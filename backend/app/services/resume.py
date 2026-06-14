import uuid

from sqlalchemy.orm import Session

from app.models.resume import Resume
from app.schemas.resume import ResumeGenerateRequest, ResumeUpdate
from app.services.profile import get_profile


def generate_resume_content(profile_data: dict | None, jd: str) -> dict:
    """Mock AI resume generation. Replace with LLM call later."""
    name = (profile_data or {}).get("full_name") or "求职者"
    summary = (profile_data or {}).get("summary") or "暂无简介"
    skills = (profile_data or {}).get("skills") or []

    return {
        "personalInfo": {"name": name, "email": "", "phone": ""},
        "summary": f"{summary}（已根据 JD 优化：{jd[:80]}...）",
        "skills": skills + ["团队协作", "沟通能力"],
        "education": (profile_data or {}).get("education") or [
            {"school": "示例大学", "degree": "本科", "major": "计算机科学", "startDate": "2020-09", "endDate": "2024-06"}
        ],
        "experience": (profile_data or {}).get("internships") or [
            {"company": "示例公司", "position": "实习生", "description": f"参与项目开发，涉及{jd[:30]}相关技术", "startDate": "2023-06", "endDate": "2023-09"}
        ],
        "projects": (profile_data or {}).get("projects") or [
            {"name": "示例项目", "role": "核心开发", "description": f"使用相关技术栈完成{jd[:20]}相关功能开发", "techStack": skills[:3]}
        ],
    }


def generate_resume(
    db: Session, user_id: uuid.UUID, data: ResumeGenerateRequest
) -> Resume:
    profile = get_profile(db, user_id)
    profile_dict = None
    if profile:
        profile_dict = {
            "full_name": profile.full_name,
            "summary": profile.summary,
            "skills": profile.skills or [],
            "education": profile.education or [],
            "internships": profile.internships or [],
            "projects": profile.projects or [],
        }

    content = generate_resume_content(profile_dict, data.jd)
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
