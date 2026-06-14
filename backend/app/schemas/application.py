from datetime import date, datetime

from app.models.application import ApplicationStatus
from app.schemas import CamelCaseModel


class ApplicationCreate(CamelCaseModel):
    company: str
    position: str
    status: ApplicationStatus = ApplicationStatus.DRAFT
    deadline: date | None = None
    applied_date: date | None = None
    next_step: str | None = None
    notes: str | None = None


class ApplicationUpdate(CamelCaseModel):
    company: str | None = None
    position: str | None = None
    status: ApplicationStatus | None = None
    deadline: date | None = None
    applied_date: date | None = None
    next_step: str | None = None
    notes: str | None = None


class ApplicationResponse(CamelCaseModel):
    id: str
    user_id: str
    company: str
    position: str
    status: ApplicationStatus
    deadline: date | None
    applied_date: date | None
    next_step: str | None
    notes: str | None
    created_at: datetime
    updated_at: datetime
