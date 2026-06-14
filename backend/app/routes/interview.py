import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.interview import (
    InterviewGenerateRequest,
    InterviewSubmitRequest,
    InterviewSessionResponse,
)
from app.services import interview as interview_service

router = APIRouter(prefix="/interviews", tags=["interviews"])


@router.post("/generate", response_model=InterviewSessionResponse, status_code=status.HTTP_201_CREATED)
def generate_interview(
    body: InterviewGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return interview_service.generate_session(db, current_user.id, body)


@router.post("/submit", response_model=InterviewSessionResponse)
def submit_answers(
    body: InterviewSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    result = interview_service.submit_answers(
        db,
        uuid.UUID(body.session_id),
        current_user.id,
        [a.model_dump(by_alias=False) for a in body.answers],
    )
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    return result


@router.get("", response_model=list[InterviewSessionResponse])
def list_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return interview_service.list_sessions(db, current_user.id)


@router.get("/{session_id}", response_model=InterviewSessionResponse)
def get_session(
    session_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    result = interview_service.get_session(db, session_id, current_user.id)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    return result
