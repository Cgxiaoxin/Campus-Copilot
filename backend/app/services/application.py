import uuid

from sqlalchemy.orm import Session

from app.models.application import Application, ApplicationStatus
from app.schemas.application import ApplicationCreate, ApplicationUpdate


def list_applications(
    db: Session, user_id: uuid.UUID, status: ApplicationStatus | None = None
) -> list[Application]:
    query = db.query(Application).filter(Application.user_id == user_id)
    if status:
        query = query.filter(Application.status == status)
    return query.order_by(Application.updated_at.desc()).all()


def create_application(db: Session, user_id: uuid.UUID, data: ApplicationCreate) -> Application:
    app = Application(id=uuid.uuid4(), user_id=user_id, **data.model_dump(by_alias=False))
    db.add(app)
    db.commit()
    db.refresh(app)
    return app


def update_application(
    db: Session, app_id: uuid.UUID, user_id: uuid.UUID, data: ApplicationUpdate
) -> Application | None:
    app = (
        db.query(Application)
        .filter(Application.id == app_id, Application.user_id == user_id)
        .first()
    )
    if not app:
        return None
    for field, value in data.model_dump(exclude_unset=True, by_alias=False).items():
        setattr(app, field, value)
    db.commit()
    db.refresh(app)
    return app


def delete_application(db: Session, app_id: uuid.UUID, user_id: uuid.UUID) -> bool:
    app = (
        db.query(Application)
        .filter(Application.id == app_id, Application.user_id == user_id)
        .first()
    )
    if not app:
        return False
    db.delete(app)
    db.commit()
    return True
