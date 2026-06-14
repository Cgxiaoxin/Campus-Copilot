from datetime import datetime

from app.models.task import Priority
from app.schemas import CamelCaseModel


class TaskCreate(CamelCaseModel):
    title: str
    priority: Priority = Priority.MEDIUM
    completed: bool = False
    due_time: datetime | None = None


class TaskUpdate(CamelCaseModel):
    title: str | None = None
    priority: Priority | None = None
    completed: bool | None = None
    due_time: datetime | None = None


class TaskResponse(CamelCaseModel):
    id: str
    user_id: str
    title: str
    priority: Priority
    completed: bool
    due_time: datetime | None
    created_at: datetime
