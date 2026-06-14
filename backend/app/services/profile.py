import uuid

from sqlalchemy.orm import Session

from app.models.user import User
from app.models.profile import Profile
from app.schemas.profile import ProfileUpdate
from app.services.auth import hash_password


def create_user_with_profile(db: Session, email: str, password: str) -> User:
    user = User(
        id=uuid.uuid4(),
        email=email,
        password_hash=hash_password(password),
    )
    db.add(user)
    db.flush()

    profile = Profile(
        id=uuid.uuid4(),
        user_id=user.id,
    )
    db.add(profile)
    db.commit()
    db.refresh(user)
    return user


def get_profile(db: Session, user_id: uuid.UUID) -> Profile | None:
    return db.query(Profile).filter(Profile.user_id == user_id).first()


def update_profile(db: Session, user_id: uuid.UUID, data: ProfileUpdate) -> Profile | None:
    profile = get_profile(db, user_id)
    if not profile:
        return None
    for field, value in data.model_dump(exclude_unset=True, by_alias=False).items():
        setattr(profile, field, value)
    db.commit()
    db.refresh(profile)
    return profile
