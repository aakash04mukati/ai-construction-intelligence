import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "AI-Powered Multimodal Construction Intelligence Platform"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # Gemini AI Configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./construction.db")
    
    # CORS
    FRONTEND_ORIGIN: str = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
    
    # Weather Provider
    WEATHER_PROVIDER: str = os.getenv("WEATHER_PROVIDER", "open-meteo")
    WEATHER_API_KEY: str = os.getenv("WEATHER_API_KEY", "")

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
