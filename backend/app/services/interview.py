import uuid
from typing import Any

from sqlalchemy.orm import Session

from app.models.interview import InterviewSession
from app.schemas.interview import InterviewGenerateRequest


MOCK_QUESTIONS: list[dict[str, Any]] = [
    {"index": 0, "question": "请简单介绍一下你自己，以及为什么你对这个岗位感兴趣？", "category": "行为面试", "difficulty": "简单"},
    {"index": 1, "question": "请描述一个你在团队中解决过的技术难题。", "category": "行为面试", "difficulty": "中等"},
    {"index": 2, "question": "对于你使用的编程语言，它的垃圾回收机制是如何工作的？", "category": "技术面试", "difficulty": "中等"},
    {"index": 3, "question": "请解释 RESTful API 的设计原则，并举例说明。", "category": "技术面试", "difficulty": "中等"},
    {"index": 4, "question": "如果让你重新设计你最近完成的一个项目，你会做哪些不同的选择？", "category": "行为面试", "difficulty": "较难"},
]


def generate_session(db: Session, user_id: uuid.UUID, data: InterviewGenerateRequest) -> InterviewSession:
    session = InterviewSession(
        id=uuid.uuid4(),
        user_id=user_id,
        company=data.company,
        position=data.position,
        questions=MOCK_QUESTIONS,
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def _mock_evaluate(answers: list[dict[str, Any]]) -> tuple[list[dict[str, Any]], float, dict[str, Any]]:
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
        "strengths": ["回答问题流畅", "逻辑清晰"] if overall > 60 else ["有待提升"],
        "suggestions": ["建议准备更多项目细节", "可以结合 STAR 法则进行回答"],
        "dimensions": {
            "技术能力": min(overall + 5, 100),
            "表达能力": overall,
            "逻辑思维": min(overall + 3, 100),
        },
    }
    return scores, overall, report


def submit_answers(db: Session, session_id: uuid.UUID, user_id: uuid.UUID, answers: list[dict[str, Any]]) -> InterviewSession | None:
    session = (
        db.query(InterviewSession)
        .filter(InterviewSession.id == session_id, InterviewSession.user_id == user_id)
        .first()
    )
    if not session:
        return None

    scores, overall, report = _mock_evaluate(answers)

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
