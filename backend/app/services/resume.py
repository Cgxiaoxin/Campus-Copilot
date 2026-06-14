import uuid
import json

from sqlalchemy.orm import Session

from app.models.resume import Resume
from app.schemas.resume import ResumeGenerateRequest, ResumeUpdate
from app.services.profile import get_profile
from app.llm import get_llm

RESUME_SYSTEM_PROMPT = """你是一个专业的简历优化助手。根据用户提供的个人档案和岗位描述，生成一份定制化的 JSON 简历。
严格输出 JSON 格式，不要包含 markdown 代码块标记。JSON 结构：
{
  "personalInfo": {"name": "", "email": "", "phone": ""},
  "summary": "个人简介（已针对 JD 优化）",
  "skills": ["技能1", "技能2"],
  "education": [{"school": "", "degree": "", "major": "", "startDate": "", "endDate": ""}],
  "experience": [{"company": "", "position": "", "description": "", "startDate": "", "endDate": ""}],
  "projects": [{"name": "", "role": "", "description": "", "techStack": []}]
}"""


def generate_resume(
    db: Session, user_id: uuid.UUID, data: ResumeGenerateRequest
) -> Resume:
    profile = get_profile(db, user_id)
    profile_str = "暂无档案信息"
    if profile:
        profile_str = json.dumps({
            "name": profile.full_name,
            "summary": profile.summary,
            "skills": profile.skills or [],
            "education": profile.education or [],
            "internships": profile.internships or [],
            "projects": profile.projects or [],
        }, ensure_ascii=False)

    prompt = f"""## 用户档案
{profile_str}

## 目标岗位描述
{data.jd}

## 要求
1. 根据岗位描述关键词优化简历内容
2. 突出匹配的技能和经验
3. 保持专业、简洁的语言风格
4. 输出严格 JSON 格式"""

    llm = get_llm()
    content = llm.generate_json(prompt, RESUME_SYSTEM_PROMPT)

    resume = Resume(
        id=uuid.uuid4(),
        user_id=user_id,
        title=data.title,
        template=data.template,
        jd=data.jd,
        content=content,
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume


def list_resumes(db: Session, user_id: uuid.UUID) -> list[Resume]:
    return (
        db.query(Resume)
        .filter(Resume.user_id == user_id)
        .order_by(Resume.updated_at.desc())
        .all()
    )


def get_resume(db: Session, resume_id: uuid.UUID, user_id: uuid.UUID) -> Resume | None:
    return (
        db.query(Resume)
        .filter(Resume.id == resume_id, Resume.user_id == user_id)
        .first()
    )


def update_resume(
    db: Session, resume_id: uuid.UUID, user_id: uuid.UUID, data: ResumeUpdate
) -> Resume | None:
    resume = get_resume(db, resume_id, user_id)
    if not resume:
        return None
    for field, value in data.model_dump(exclude_unset=True, by_alias=False).items():
        setattr(resume, field, value)
    db.commit()
    db.refresh(resume)
    return resume


def delete_resume(db: Session, resume_id: uuid.UUID, user_id: uuid.UUID) -> bool:
    resume = get_resume(db, resume_id, user_id)
    if not resume:
        return False
    db.delete(resume)
    db.commit()
    return True
