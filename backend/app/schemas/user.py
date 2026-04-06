from datetime import datetime
import uuid
from typing import Optional

from pydantic import BaseModel, EmailStr, ConfigDict

from ..models.user import NativeLanguage, TargetLanguage

class UserBase(BaseModel):
    email: EmailStr
    display_name: Optional[str] = None
    native_language: NativeLanguage
    target_language: TargetLanguage

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    display_name: Optional[str] = None
    native_language: Optional[NativeLanguage] = None
    target_language: Optional[TargetLanguage] = None
    is_active: Optional[bool] = None

class UserRead(UserBase):
    id: uuid.UUID
    auth0_sub: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AllowlistBase(BaseModel):
    email: EmailStr

class AllowlistCreate(AllowlistBase):
    pass

class AllowlistRead(AllowlistBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
