import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import String, Text, DateTime, func, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.fields import UUID


class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID, primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID, ForeignKey("users.id", ondelete="CASCADE"), unique=True
    )
    full_name: Mapped[str | None] = mapped_column(String(100))
    phone: Mapped[str | None] = mapped_column(String(20))
    avatar: Mapped[str | None] = mapped_column(Text)
    summary: Mapped[str | None] = mapped_column(Text)
    education: Mapped[list[dict[str, Any]] | None] = mapped_column(JSON, default=list)
    projects: Mapped[list[dict[str, Any]] | None] = mapped_column(JSON, default=list)
    internships: Mapped[list[dict[str, Any]] | None] = mapped_column(JSON, default=list)
    skills: Mapped[list[str] | None] = mapped_column(JSON, default=list)
    awards: Mapped[list[str] | None] = mapped_column(JSON, default=list)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    user = relationship("User", back_populates="profile")
