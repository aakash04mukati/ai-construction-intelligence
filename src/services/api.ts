import {
  Project,
  Task,
  Inspection,
  DailyLog,
  Report,
  ApiResponse,
  SafetyAnalysisResult,
  CrackAnalysisResult,
  ValuationResult,
  PlanningResult,
  WeatherAdvisoryResult,
} from "../types";

const BASE_URL = "";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || `HTTP error ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Health
  getHealth: () => fetchJson<{ status: string; version: string; model: string; geminiConfigured: boolean; databaseConnected: boolean }>("/api/health"),

  // Dashboard
  getDashboardSummary: () => fetchJson<any>("/api/dashboard/summary"),

  // Projects
  getProjects: () => fetchJson<Project[]>("/api/projects"),
  getProject: (id: string) => fetchJson<Project>("/api/projects/" + id),
  createProject: (data: Partial<Project>) =>
    fetchJson<Project>("/api/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateProject: (id: string, data: Partial<Project>) =>
    fetchJson<Project>("/api/projects/" + id, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteProject: (id: string) =>
    fetchJson<{ message: string }>("/api/projects/" + id, {
      method: "DELETE",
    }),

  // Tasks
  getTasks: (projectId: string) => fetchJson<Task[]>(`/api/projects/${projectId}/tasks`),
  createTask: (projectId: string, data: Partial<Task>) =>
    fetchJson<Task>(`/api/projects/${projectId}/tasks`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateTask: (taskId: string, data: Partial<Task>) =>
    fetchJson<Task>(`/api/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteTask: (taskId: string) =>
    fetchJson<{ message: string }>(`/api/tasks/${taskId}`, {
      method: "DELETE",
    }),

  // Daily Logs
  createDailyLog: (projectId: string, data: Partial<DailyLog>) =>
    fetchJson<DailyLog>(`/api/projects/${projectId}/logs`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Inspections
  getInspections: () => fetchJson<Inspection[]>("/api/inspections"),
  createInspection: (data: Partial<Inspection>) =>
    fetchJson<Inspection>("/api/inspections", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateInspection: (id: string, data: Partial<Inspection>) =>
    fetchJson<Inspection>(`/api/inspections/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Reports
  getReports: () => fetchJson<Report[]>("/api/reports"),
  getReport: (id: string) => fetchJson<Report>(`/api/reports/${id}`),
  createReport: (data: Partial<Report>) =>
    fetchJson<Report>("/api/reports", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // AI Safety Analysis
  analyzeSafety: (data: { image: string; projectName?: string; notes?: string; location?: string }) =>
    fetchJson<ApiResponse<SafetyAnalysisResult>>("/api/ai/safety/analyze", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // AI Crack Detection
  analyzeCracks: (data: {
    image: string;
    materialType: string;
    structureType: string;
    structureAgeYears?: number;
    scaleReference?: string;
    observedSymptoms?: string;
  }) =>
    fetchJson<ApiResponse<CrackAnalysisResult>>("/api/ai/cracks/analyze", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // AI Valuation
  estimateValuation: (data: any) =>
    fetchJson<ApiResponse<ValuationResult>>("/api/ai/valuation/estimate", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // AI Planning
  generatePlanning: (data: any) =>
    fetchJson<ApiResponse<PlanningResult>>("/api/ai/planning/generate", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Daily Site Assistant Chat
  chatAssistant: (messages: Array<{ role: "user" | "assistant"; content: string }>, projectId?: string) =>
    fetchJson<ApiResponse<string>>("/api/ai/assistant/chat", {
      method: "POST",
      body: JSON.stringify({ messages, projectId }),
    }),

  // Construction Knowledge Base
  askKnowledge: (query: string, documentContext?: string) =>
    fetchJson<ApiResponse<string>>("/api/ai/knowledge/ask", {
      method: "POST",
      body: JSON.stringify({ query, documentContext }),
    }),

  // Weather & Advisory
  getWeatherForecast: (location: string) =>
    fetchJson<any>(`/api/weather/forecast?location=${encodeURIComponent(location)}`),
  getWeatherAdvisory: (weatherData: any, location: string) =>
    fetchJson<ApiResponse<WeatherAdvisoryResult>>("/api/ai/weather/advisory", {
      method: "POST",
      body: JSON.stringify({ weatherData, location }),
    }),

  // Reset Demo Data
  resetDemoData: () =>
    fetchJson<{ message: string; data: any }>("/api/reset-demo", {
      method: "POST",
    }),
};
