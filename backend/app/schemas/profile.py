from datetime import datetime
from typing import Any

from app.schemas import CamelCaseModel


class ProfileBase(CamelCaseModel):
    education: list[dict[str, Any]] = []
    projects: list[dict[str, Any]] = []
    internships: list[dict[str, Any]] = []
    skills: list[str] = []
    awards: list[str] = []


class ProfileUpdate(ProfileBase):
    full_name: str | None = None
    phone: str | None = None
    avatar: str | None = None
    summary: str | None = None


class ProfileResponse(ProfileBase):
    id: str
    user_id: str
    full_name: str | None
    phone: str | None
    avatar: str | None
    summary: str | None
    created_at: datetime
    updated_at: datetime
