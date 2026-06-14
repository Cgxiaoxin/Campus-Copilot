from datetime import datetime
from typing import Any

from app.schemas import CamelCaseModel


class InterviewGenerateRequest(CamelCaseModel):
    company: str
    position: str


class InterviewAnswerItem(CamelCaseModel):
    question_index: int
    answer: str


class InterviewSubmitRequest(CamelCaseModel):
    session_id: str
    answers: list[InterviewAnswerItem]


class InterviewQuestion(CamelCaseModel):
    index: int
    question: str
    category: str
    difficulty: str


class InterviewScore(CamelCaseModel):
    question_index: int
    score: float
    feedback: str


class InterviewSessionResponse(CamelCaseModel):
    id: str
    user_id: str
    company: str
    position: str
    questions: list[dict[str, Any]]
    answers: list[dict[str, Any]] | None
    scores: list[dict[str, Any]] | None
    overall_score: float | None
    report: dict[str, Any] | None
    created_at: datetime
