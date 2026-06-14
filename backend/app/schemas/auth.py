from pydantic import EmailStr

from app.schemas import CamelCaseModel


class RegisterRequest(CamelCaseModel):
    email: EmailStr
    password: str


class LoginRequest(CamelCaseModel):
    email: EmailStr
    password: str


class TokenResponse(CamelCaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(CamelCaseModel):
    id: str
    email: str
    is_active: bool
