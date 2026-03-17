"""Application configuration from environment."""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """App settings; load from env or .env file."""

    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/enterprise_learn"

    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # CORS (comma-separated origins, or * for dev)
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
