from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class TaskModel(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(String, default="Medium")
    status = Column(String, default="Not Started")
    start_date = Column(String, nullable=True)
    end_date = Column(String, nullable=True)
    progress = Column(Integer, default=0)
    dependencies = Column(JSON, default=list)
    assigned_to = Column(String, nullable=True)
    phase = Column(String, default="Execution")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    project = relationship("ProjectModel", back_populates="tasks")

class InspectionModel(Base):
    __tablename__ = "inspections"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False, index=True)
    inspection_type = Column(String, nullable=False) # 'safety' or 'crack'
    image_reference = Column(Text, nullable=True)
    input_data = Column(JSON, default=dict)
    findings = Column(JSON, default=dict)
    recommendations = Column(JSON, default=list)
    severity = Column(String, default="Medium")
    review_status = Column(String, default="Pending Review")
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("ProjectModel", back_populates="inspections")

class ReportModel(Base):
    __tablename__ = "reports"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False, index=True)
    report_type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    summary = Column(Text, nullable=True)
    report_data = Column(JSON, default=dict)
    generated_by = Column(String, default="AI Platform Officer")
    review_status = Column(String, default="Draft")
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("ProjectModel", back_populates="reports")

class DailyLogModel(Base):
    __tablename__ = "daily_logs"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False, index=True)
    log_date = Column(String, nullable=False)
    weather_summary = Column(String, nullable=True)
    temperature = Column(String, nullable=True)
    work_completed = Column(Text, nullable=False)
    workforce_count = Column(Integer, default=0)
    workforce_summary = Column(String, nullable=True)
    issues = Column(Text, default="None")
    safety_observations = Column(Text, default="Zero incidents")
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("ProjectModel", back_populates="daily_logs")
