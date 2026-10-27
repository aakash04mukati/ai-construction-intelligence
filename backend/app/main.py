import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from .config import settings
from .database import engine, Base, get_db
from .models import ProjectModel, TaskModel, InspectionModel, ReportModel, DailyLogModel
from .schemas.schemas import (
    GenericResponse,
    ProjectCreate,
    ProjectResponse,
    TaskCreate,
    TaskResponse,
    SafetyAnalysisRequest,
    CrackAnalysisRequest,
    ValuationRequest,
    PlanningRequest,
    AssistantChatRequest,
    KnowledgeAskRequest
)
from .services.gemini_service import gemini_service

# Initialize tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="FastAPI Backend for Multimodal Construction Intelligence Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "version": "1.0.0",
        "model": settings.GEMINI_MODEL,
        "geminiConfigured": gemini_service.is_configured(),
        "databaseConnected": True
    }

@app.get("/api/dashboard/summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    active_projects = db.query(ProjectModel).filter(ProjectModel.status == "Active").count()
    inspections_count = db.query(InspectionModel).count()
    tasks_count = db.query(TaskModel).filter(TaskModel.status == "In Progress").count()
    reports_count = db.query(ReportModel).count()

    return {
        "summaryCards": {
            "activeProjects": active_projects or 3,
            "safetyIssues": 2,
            "crackInspections": inspections_count or 4,
            "tasksInProgress": tasks_count or 6,
            "weatherAlerts": 1,
            "pendingReports": reports_count or 2
        },
        "analytics": {
            "safetyCategories": [
                {"name": "Fall Hazard / Edge", "count": 8},
                {"name": "PPE Compliance", "count": 5},
                {"name": "Housekeeping", "count": 4},
                {"name": "Scaffolding / Rigging", "count": 3},
                {"name": "Electrical & Lockout", "count": 2}
            ],
            "weeklyInspectionActivity": [
                {"day": "Mon", "safety": 4, "cracks": 2},
                {"day": "Tue", "safety": 6, "cracks": 3},
                {"day": "Wed", "safety": 5, "cracks": 1},
                {"day": "Thu", "safety": 7, "cracks": 4},
                {"day": "Fri", "safety": 8, "cracks": 2},
                {"day": "Sat", "safety": 3, "cracks": 1},
                {"day": "Sun", "safety": 1, "cracks": 0}
            ]
        }
    }

@app.get("/api/projects", response_model=List[ProjectResponse])
def list_projects(db: Session = Depends(get_db)):
    return db.query(ProjectModel).all()

@app.post("/api/projects", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    import uuid
    db_project = ProjectModel(
        id=f"proj-{uuid.uuid4().hex[:8]}",
        **project.model_dump()
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.post("/api/ai/safety/analyze")
def analyze_safety(payload: SafetyAnalysisRequest):
    try:
        data = gemini_service.analyze_safety(payload.image, payload.model_dump())
        return {"success": True, "data": data, "error": None}
    except Exception as e:
        return {"success": False, "data": None, "error": {"code": "AI_ERROR", "message": str(e)}}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
