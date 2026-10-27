from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# Generic API Response
class ErrorDetail(BaseModel):
    code: str
    message: str

class GenericResponse(BaseModel):
    success: bool
    data: Optional[Any] = None
    error: Optional[ErrorDetail] = None

# Project Schemas
class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = ""
    location: str
    client: Optional[str] = ""
    manager: Optional[str] = ""
    budget: Optional[float] = 0.0
    start_date: Optional[str] = ""
    target_completion_date: Optional[str] = ""
    status: Optional[str] = "Active"
    progress: Optional[int] = 0
    site_area: Optional[str] = "10,000 sq ft"
    floors: Optional[int] = 1
    project_type: Optional[str] = "Commercial"

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: str
    created_at: Any
    updated_at: Any

    class Config:
        from_attributes = True

# Task Schemas
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    priority: Optional[str] = "Medium"
    status: Optional[str] = "Not Started"
    start_date: Optional[str] = ""
    end_date: Optional[str] = ""
    progress: Optional[int] = 0
    dependencies: Optional[List[str]] = []
    assigned_to: Optional[str] = ""
    phase: Optional[str] = "Execution"

class TaskResponse(TaskCreate):
    id: str
    project_id: str
    created_at: Any
    updated_at: Any

    class Config:
        from_attributes = True

# Safety Schemas
class SafetyHazard(BaseModel):
    category: str
    severity: str
    description: str
    evidence: str
    recommended_action: str
    priority: str
    confidence: Optional[float] = 0.85

class SafetyAnalysisRequest(BaseModel):
    image: str
    projectName: Optional[str] = "General Site"
    notes: Optional[str] = ""
    location: Optional[str] = "Active Deck"

class SafetyAnalysisData(BaseModel):
    module: str = "site_safety"
    summary: str
    hazards: List[SafetyHazard] = []
    generalRecommendations: List[str] = []
    limitations: List[str] = []

# Crack Detection Schemas
class CrackRegion(BaseModel):
    box: List[int]
    label: str
    orientation: Optional[str] = ""
    pattern: Optional[str] = ""
    estimatedVisibleLength: Optional[str] = ""

class CrackAnalysisRequest(BaseModel):
    image: str
    materialType: str
    structureType: str
    structureAgeYears: Optional[int] = None
    scaleReference: Optional[str] = None
    observedSymptoms: Optional[str] = None

class CrackAnalysisData(BaseModel):
    module: str = "crack_detection"
    summary: str
    material: str
    structureType: str
    crackClassification: str
    severityCategory: str
    detectedRegions: List[CrackRegion] = []
    visualCharacteristics: List[str] = []
    recommendedSteps: List[str] = []
    limitations: List[str] = []

# Valuation Schemas
class ValuationRequest(BaseModel):
    propertyType: str
    location: str
    landArea: float
    builtUpArea: float
    numberOfFloors: int
    buildingAge: Optional[int] = 0
    constructionQuality: str
    propertyCondition: str
    amenities: Optional[str] = ""
    roadAccess: Optional[str] = ""
    currency: Optional[str] = "USD"
    measurementUnit: Optional[str] = "sq ft"

# Planning Schemas
class PlanningRequest(BaseModel):
    projectName: str
    projectType: str
    projectDescription: Optional[str] = ""
    siteArea: Optional[str] = ""
    floors: Optional[int] = 1
    budget: Optional[str] = ""
    workforce: Optional[str] = ""
    plannedStartDate: Optional[str] = ""
    targetCompletionDate: Optional[str] = ""
    constraints: Optional[str] = ""

# Assistant & Knowledge Schemas
class ChatMessage(BaseModel):
    role: str
    content: str

class AssistantChatRequest(BaseModel):
    messages: List[ChatMessage]
    projectId: Optional[str] = None

class KnowledgeAskRequest(BaseModel):
    query: str
    documentContext: Optional[str] = None
