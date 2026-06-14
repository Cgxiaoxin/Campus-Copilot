import uuid
import json
from typing import Any

from sqlalchemy.orm import Session

from app.models.interview import InterviewSession
from app.schemas.interview import InterviewGenerateRequest
from app.llm import get_llm

INTERVIEW_SYSTEM_PROMPT = """你是一个专业的面试官助手。根据目标公司和岗位，生成面试题并评估回答。
输出严格 JSON 格式。"""


def generate_session(db: Session, user_id: uuid.UUID, data: InterviewGenerateRequest) -> InterviewSession:
    prompt = f"""为 {data.company} 的 {data.position} 岗位生成 5 道面试题。
包含行为面试和技术面试题，覆盖不同难度。输出 JSON 数组：
[{{"index": 0, "question": "题目内容", "category": "行为面试|技术面试", "difficulty": "简单|中等|较难"}}]"""

    llm = get_llm()
    try:
        result = llm.generate_json(prompt, INTERVIEW_SYSTEM_PROMPT)
        questions = result if isinstance(result, list) else result.get("questions", result.get("data", []))
    except Exception:
        questions = [
            {"index": 0, "question": "请简单介绍一下你自己，以及为什么你对这个岗位感兴趣？", "category": "行为面试", "difficulty": "简单"},
            {"index": 1, "question": "请描述一个你在团队中解决过的技术难题。", "category": "行为面试", "difficulty": "中等"},
            {"index": 2, "question": "请解释你所掌握的核心技术的原理。", "category": "技术面试", "difficulty": "中等"},
            {"index": 3, "question": "请说明你如何保证代码质量。", "category": "技术面试", "difficulty": "中等"},
            {"index": 4, "question": "如果让你重新设计最近完成的项目，你会做哪些改进？", "category": "行为面试", "difficulty": "较难"},
        ]

    session = InterviewSession(
        id=uuid.uuid4(),
        user_id=user_id,
        company=data.company,
        position=data.position,
        questions=questions,
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def _evaluate_answers(questions: list[dict[str, Any]], answers: list[dict[str, Any]]) -> tuple[list[dict[str, Any]], float, dict[str, Any]]:
    prompt = f"""根据以下面试问答，给每题评分（0-100）并提供反馈。

题目和回答：
{json.dumps([{"question": q, "answer": a} for q, a in zip(questions, answers)], ensure_ascii=False, indent=2)}

输出 JSON：
{{"scores": [{{"question_index": 0, "score": 85, "feedback": "反馈内容"}}], "overall_score": 80, "report": {{"summary": "总结", "strengths": ["优点1"], "suggestions": ["建议1"], "dimensions": {{"技术能力": 80, "表达能力": 75, "逻辑思维": 85}}}}}}"""

    llm = get_llm()
    try:
        result = llm.generate_json(prompt, INTERVIEW_SYSTEM_PROMPT)
        scores = result.get("scores", [])
        overall = result.get("overall_score", 0)
        report = result.get("report", {})
    except Exception:
        scores = []
        total = 0.0
        for a in answers:
            length = len(a.get("answer", ""))
            score = min(round(30 + length * 0.3, 1), 95)
            scores.append({
                "question_index": a["question_index"],
                "score": score,
                "feedback": "回答完整，表达清晰。" if score > 70 else "回答较为简略，建议补充更多细节。",
            })
            total += score
        overall = round(total / max(len(answers), 1), 1)
        report = {
            "summary": f"共回答 {len(answers)} 题，综合评分 {overall} 分",
            "strengths": ["回答问题流畅"] if overall > 60 else ["有待提升"],
            "suggestions": ["建议使用 STAR 法则组织回答"],
            "dimensions": {"技术能力": min(overall + 5, 100), "表达能力": overall, "逻辑思维": min(overall + 3, 100)},
        }

    return scores, overall, report


def submit_answers(
    db: Session, session_id: uuid.UUID, user_id: uuid.UUID, answers: list[dict[str, Any]]
) -> InterviewSession | None:
    session = (
        db.query(InterviewSession)
        .filter(InterviewSession.id == session_id, InterviewSession.user_id == user_id)
        .first()
    )
    if not session:
        return None

    scores, overall, report = _evaluate_answers(session.questions, answers)
    session.answers = answers
    session.scores = scores
    session.overall_score = overall
    session.report = report
    db.commit()
    db.refresh(session)
    return session


def get_session(db: Session, session_id: uuid.UUID, user_id: uuid.UUID) -> InterviewSession | None:
    return (
        db.query(InterviewSession)
        .filter(InterviewSession.id == session_id, InterviewSession.user_id == user_id)
        .first()
    )


def list_sessions(db: Session, user_id: uuid.UUID) -> list[InterviewSession]:
    return (
        db.query(InterviewSession)
        .filter(InterviewSession.user_id == user_id)
        .order_by(InterviewSession.created_at.desc())
        .all()
    )
