from sqlalchemy import Column, String, Integer, Float, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class ProjectModel(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    location = Column(String, nullable=False)
    client = Column(String, nullable=True)
    manager = Column(String, nullable=True)
    budget = Column(Float, default=0.0)
    start_date = Column(String, nullable=True)
    target_completion_date = Column(String, nullable=True)
    status = Column(String, default="Active")
    progress = Column(Integer, default=0)
    site_area = Column(String, nullable=True)
    floors = Column(Integer, default=1)
    project_type = Column(String, default="Commercial")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    tasks = relationship("TaskModel", back_populates="project", cascade="all, delete-orphan")
    inspections = relationship("InspectionModel", back_populates="project", cascade="all, delete-orphan")
    reports = relationship("ReportModel", back_populates="project", cascade="all, delete-orphan")
    daily_logs = relationship("DailyLogModel", back_populates="project", cascade="all, delete-orphan")
