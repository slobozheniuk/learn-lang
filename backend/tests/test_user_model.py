import pytest
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.user import User, NativeLanguage, TargetLanguage

@pytest.mark.asyncio
async def test_create_user(db_session: AsyncSession):
    # Create a new user with unique email
    email = f"test-{uuid.uuid4()}@example.com"
    new_user = User(
        email=email,
        display_name="Test User",
        native_language=NativeLanguage.en,
        target_language=TargetLanguage.nl
    )
    db_session.add(new_user)
    await db_session.flush()

    # Verify user was created
    assert new_user.id is not None
    assert new_user.email == email
    assert new_user.native_language == NativeLanguage.en
    assert new_user.target_language == TargetLanguage.nl

    # Query the user back
    result = await db_session.execute(select(User).where(User.email == email))
    user_from_db = result.scalar_one()
    assert user_from_db.id == new_user.id

from sqlalchemy.exc import StatementError

@pytest.mark.asyncio
async def test_invalid_native_language_db(db_session: AsyncSession):
    # Try to insert a user with an invalid native_language via SQLAlchemy
    # This should fail at the SQLAlchemy level because it's an Enum
    with pytest.raises(StatementError):
        email = f"invalid-{uuid.uuid4()}@example.com"
        new_user = User(
            email=email,
            display_name="Invalid User",
            native_language="fr",  # Not in NativeLanguage enum
            target_language=TargetLanguage.nl
        )
        db_session.add(new_user)
        await db_session.flush()
