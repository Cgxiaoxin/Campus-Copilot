import uuid

from sqlalchemy.orm import Session

from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate


def list_tasks(db: Session, user_id: uuid.UUID) -> list[Task]:
    return (
        db.query(Task)
        .filter(Task.user_id == user_id)
        .order_by(Task.created_at.desc())
        .all()
    )


def create_task(db: Session, user_id: uuid.UUID, data: TaskCreate) -> Task:
    task = Task(id=uuid.uuid4(), user_id=user_id, **data.model_dump(by_alias=False))
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def update_task(
    db: Session, task_id: uuid.UUID, user_id: uuid.UUID, data: TaskUpdate
) -> Task | None:
    task = (
        db.query(Task)
        .filter(Task.id == task_id, Task.user_id == user_id)
        .first()
    )
    if not task:
        return None
    for field, value in data.model_dump(exclude_unset=True, by_alias=False).items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task_id: uuid.UUID, user_id: uuid.UUID) -> bool:
    task = (
        db.query(Task)
        .filter(Task.id == task_id, Task.user_id == user_id)
        .first()
    )
    if not task:
        return False
    db.delete(task)
    db.commit()
    return True
