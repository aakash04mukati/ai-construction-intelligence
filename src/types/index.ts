export interface Project {
  id: string;
  name: string;
  description: string;
  location: string;
  client: string;
  manager: string;
  budget: number;
  startDate: string;
  targetCompletionDate: string;
  status: "Active" | "Delayed" | "Under Review" | "Completed";
  progress: number;
  siteArea: string;
  floors: number;
  projectType: string;
  createdAt: string;
  updatedAt: string;
  tasks?: Task[];
  inspections?: Inspection[];
  dailyLogs?: DailyLog[];
  reports?: Report[];
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Not Started" | "In Progress" | "Under Review" | "Completed";
  startDate: string;
  endDate: string;
  progress: number;
  dependencies: string[];
  assignedTo: string;
  phase: string;
  createdAt: string;
  updatedAt: string;
}

export interface Inspection {
  id: string;
  projectId: string;
  projectName?: string;
  inspectionType: "safety" | "crack";
  imageReference?: string;
  inputData: Record<string, any>;
  findings: Record<string, any>;
  recommendations: string[];
  severity: "Low" | "Medium" | "High" | "Critical";
  reviewStatus: "Pending Review" | "Verified" | "Action Taken";
  createdAt: string;
}

export interface DailyLog {
  id: string;
  projectId: string;
  logDate: string;
  weatherSummary: string;
  temperature: string;
  workCompleted: string;
  workforceCount: number;
  workforceSummary: string;
  issues: string;
  safetyObservations: string;
  createdAt: string;
}

export interface Report {
  id: string;
  projectId: string;
  projectName?: string;
  reportType: "safety" | "crack" | "progress" | "valuation" | "planning" | "weather";
  title: string;
  summary: string;
  reportData: Record<string, any>;
  generatedBy: string;
  reviewStatus: "Draft" | "Final" | "Approved" | "Verified";
  createdAt: string;
}

export interface SafetyHazard {
  category: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  description: string;
  evidence: string;
  recommended_action: string;
  priority: string;
  confidence?: number;
}

export interface SafetyAnalysisResult {
  module: string;
  isDemoAnalysis?: boolean;
  summary: string;
  hazards: SafetyHazard[];
  generalRecommendations: string[];
  limitations: string[];
}

export interface CrackRegion {
  box: [number, number, number, number]; // [ymin, xmin, ymax, xmax] 0-1000
  label: string;
  orientation?: string;
  pattern?: string;
  estimatedVisibleLength?: string;
}

export interface CrackAnalysisResult {
  module: string;
  isDemoAnalysis?: boolean;
  summary: string;
  material: string;
  structureType: string;
  crackClassification: string;
  severityCategory: string;
  detectedRegions: CrackRegion[];
  visualCharacteristics: string[];
  recommendedSteps: string[];
  limitations: string[];
}

export interface ValuationResult {
  module: string;
  isIllustrativeEstimate?: boolean;
  currency: string;
  unit: string;
  estimatedMidpoint: number;
  estimatedRange: { low: number; high: number };
  estimatedRatePerUnit: number;
  breakdown: {
    buildingStructureValue: number;
    landValue: number;
    depreciationAdjustment?: string;
  };
  valueDrivers: {
    positiveFactors: string[];
    negativeOrRiskFactors: string[];
  };
  comparableProperties: Array<{
    address: string;
    propertyType: string;
    builtUpArea: string;
    salePrice: string;
    effectiveRate: string;
    saleDate: string;
  }>;
  dataCompletenessScore: number;
  confidenceLevel: string;
  disclaimer: string;
}

export interface PlanningPhase {
  phaseName: string;
  durationDays: number;
  tasks: Array<{
    title: string;
    durationDays: number;
    dependencies: string[];
  }>;
}

export interface PlanningResult {
  module: string;
  projectName: string;
  projectType: string;
  totalEstimatedDurationDays: number;
  phases: PlanningPhase[];
  milestones: Array<{ name: string; targetMonth: string }>;
  materialEstimates: Array<{ material: string; estimatedQuantity: string; unitCost: string }>;
  riskRegister: Array<{ risk: string; severity: "Low" | "Medium" | "High"; mitigation: string }>;
  disclaimer: string;
}

export interface WeatherAdvisoryResult {
  location: string;
  timestamp: string;
  currentConditions: {
    temperature: string;
    windSpeed: string;
    precipitationProbability: string;
    conditionsSummary: string;
  };
  activities: Array<{
    activity: string;
    status: "Go" | "Caution" | "Stop";
    impact: string;
    precaution: string;
    weatherCondition: string;
  }>;
  overallSiteRisk: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: { code: string; message: string } | null;
}
