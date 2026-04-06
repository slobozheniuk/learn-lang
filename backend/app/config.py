from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://learnlang:changeme@db:5432/learnlang"
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
