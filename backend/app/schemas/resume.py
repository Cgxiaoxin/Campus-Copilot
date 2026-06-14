from datetime import datetime
from typing import Any

from app.schemas import CamelCaseModel


class ResumeGenerateRequest(CamelCaseModel):
    jd: str
    template: str = "modern"
    title: str = "未命名简历"


class ResumeUpdate(CamelCaseModel):
    title: str | None = None
    template: str | None = None
    content: dict[str, Any] | None = None


class ResumeResponse(CamelCaseModel):
    id: str
    user_id: str
    title: str
    template: str
    jd: str | None
    content: dict[str, Any] | None
    version: int
    created_at: datetime
    updated_at: datetime
