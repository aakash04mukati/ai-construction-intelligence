import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import {
  loadDatabase,
  saveDatabase,
  resetDatabaseToDemo,
  Project,
  Task,
  Inspection,
  DailyLog,
  Report,
} from "./server/db.js";
import {
  analyzeSiteSafety,
  analyzeCracks,
  estimateValuation,
  generateProjectPlan,
  chatDailyAssistant,
  askKnowledgeBase,
  generateWeatherAdvisory,
} from "./server/aiServices.js";
import { isGeminiConfigured, getModelName } from "./server/gemini.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// High limit for base64 construction site images
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// -------------------------------------------------------------
// HEALTH ENDPOINT
// -------------------------------------------------------------
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    version: "1.0.0",
    model: getModelName(),
    geminiConfigured: isGeminiConfigured(),
    databaseConnected: true,
    serverTime: new Date().toISOString(),
  });
});

// -------------------------------------------------------------
// DASHBOARD SUMMARY
// -------------------------------------------------------------
app.get("/api/dashboard/summary", (_req: Request, res: Response) => {
  const db = loadDatabase();

  const activeProjectsCount = db.projects.filter((p) => p.status === "Active" || p.status === "Delayed").length;
  const safetyIssuesCount = db.inspections.filter((i) => i.inspectionType === "safety" && i.severity !== "Low").length;
  const crackInspectionsCount = db.inspections.filter((i) => i.inspectionType === "crack").length;
  const tasksInProgressCount = db.tasks.filter((t) => t.status === "In Progress").length;
  const pendingReportsCount = db.reports.filter((r) => r.reviewStatus !== "Approved").length;
  const weatherAlertsCount = 1; // 1 active wind advisory on record

  // Safety incidents by category
  const safetyCategories = [
    { name: "Fall Hazard / Edge", count: 8 },
    { name: "PPE Compliance", count: 5 },
    { name: "Housekeeping", count: 4 },
    { name: "Scaffolding / Rigging", count: 3 },
    { name: "Electrical & Lockout", count: 2 },
  ];

  // Weekly inspection activity
  const weeklyInspectionActivity = [
    { day: "Mon", safety: 4, cracks: 2 },
    { day: "Tue", safety: 6, cracks: 3 },
    { day: "Wed", safety: 5, cracks: 1 },
    { day: "Thu", safety: 7, cracks: 4 },
    { day: "Fri", safety: 8, cracks: 2 },
    { day: "Sat", safety: 3, cracks: 1 },
    { day: "Sun", safety: 1, cracks: 0 },
  ];

  // Project progress comparison
  const projectProgressData = db.projects.map((p) => ({
    name: p.name.length > 20 ? p.name.substring(0, 18) + "..." : p.name,
    progress: p.progress,
    budget: Math.round(p.budget / 1000000),
  }));

  // Chronological recent activity feed
  const recentActivities = [
    {
      id: "act-1",
      type: "safety_alert",
      title: "Perimeter Fall Hazard Flagged",
      project: "Skyline Meridian Commercial Tower",
      timestamp: "10 mins ago",
      severity: "High",
      detail: "Mid-rail slackened near Floor 26 West leading edge.",
    },
    {
      id: "act-2",
      type: "crack_inspection",
      title: "Diagonal Shear Crack Analyzed",
      project: "Crestview Viaduct & Bridge Retrofit",
      timestamp: "1 hour ago",
      severity: "Medium",
      detail: "Multimodal AI identified 14.2-inch diagonal shear pattern on Pier Cap 2.",
    },
    {
      id: "act-3",
      type: "task_update",
      title: "Level 28 Slab Rebar Certified",
      project: "Skyline Meridian Commercial Tower",
      timestamp: "3 hours ago",
      severity: "Low",
      detail: "Quality inspector certified post-tensioned tendon clearances.",
    },
    {
      id: "act-4",
      type: "weather_warning",
      title: "Elevated Wind Advisory (26 mph)",
      project: "Harborview Logistics Hub",
      timestamp: "5 hours ago",
      severity: "Medium",
      detail: "Crane hoisting operations restricted for loads exceeding 100 sq ft surface area.",
    },
  ];

  res.json({
    summaryCards: {
      activeProjects: activeProjectsCount,
      safetyIssues: safetyIssuesCount,
      crackInspections: crackInspectionsCount,
      tasksInProgress: tasksInProgressCount,
      weatherAlerts: weatherAlertsCount,
      pendingReports: pendingReportsCount,
    },
    analytics: {
      safetyCategories,
      weeklyInspectionActivity,
      projectProgressData,
    },
    recentActivities,
  });
});

// -------------------------------------------------------------
// PROJECTS CRUD
// -------------------------------------------------------------
app.get("/api/projects", (_req: Request, res: Response) => {
  const db = loadDatabase();
  res.json(db.projects);
});

app.post("/api/projects", (req: Request, res: Response) => {
  const db = loadDatabase();
  const now = new Date().toISOString();

  const newProject: Project = {
    id: `proj-${Date.now()}`,
    name: req.body.name || "Untitled Project",
    description: req.body.description || "",
    location: req.body.location || "Unspecified Location",
    client: req.body.client || "Owner / Developer",
    manager: req.body.manager || "Unassigned",
    budget: Number(req.body.budget) || 1000000,
    startDate: req.body.startDate || now.split("T")[0],
    targetCompletionDate: req.body.targetCompletionDate || now.split("T")[0],
    status: req.body.status || "Active",
    progress: Number(req.body.progress) || 0,
    siteArea: req.body.siteArea || "10,000 sq ft",
    floors: Number(req.body.floors) || 1,
    projectType: req.body.projectType || "Commercial",
    createdAt: now,
    updatedAt: now,
  };

  db.projects.push(newProject);
  saveDatabase(db);
  res.status(201).json(newProject);
});

app.get("/api/projects/:id", (req: Request, res: Response) => {
  const db = loadDatabase();
  const project = db.projects.find((p) => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  const tasks = db.tasks.filter((t) => t.projectId === project.id);
  const inspections = db.inspections.filter((i) => i.projectId === project.id);
  const dailyLogs = db.dailyLogs.filter((l) => l.projectId === project.id);
  const reports = db.reports.filter((r) => r.projectId === project.id);

  res.json({
    ...project,
    tasks,
    inspections,
    dailyLogs,
    reports,
  });
});

app.patch("/api/projects/:id", (req: Request, res: Response) => {
  const db = loadDatabase();
  const index = db.projects.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Project not found" });
  }

  db.projects[index] = {
    ...db.projects[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  saveDatabase(db);
  res.json(db.projects[index]);
});

app.delete("/api/projects/:id", (req: Request, res: Response) => {
  const db = loadDatabase();
  const index = db.projects.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Project not found" });
  }

  db.projects.splice(index, 1);
  // Also clean up dependent tasks
  db.tasks = db.tasks.filter((t) => t.projectId !== req.params.id);
  saveDatabase(db);
  res.json({ message: "Project deleted successfully" });
});

// -------------------------------------------------------------
// TASKS CRUD
// -------------------------------------------------------------
app.get("/api/projects/:id/tasks", (req: Request, res: Response) => {
  const db = loadDatabase();
  const tasks = db.tasks.filter((t) => t.projectId === req.params.id);
  res.json(tasks);
});

app.post("/api/projects/:id/tasks", (req: Request, res: Response) => {
  const db = loadDatabase();
  const now = new Date().toISOString();

  const newTask: Task = {
    id: `task-${Date.now()}`,
    projectId: req.params.id,
    title: req.body.title || "Untitled Task",
    description: req.body.description || "",
    priority: req.body.priority || "Medium",
    status: req.body.status || "Not Started",
    startDate: req.body.startDate || now.split("T")[0],
    endDate: req.body.endDate || now.split("T")[0],
    progress: Number(req.body.progress) || 0,
    dependencies: req.body.dependencies || [],
    assignedTo: req.body.assignedTo || "Unassigned",
    phase: req.body.phase || "Execution",
    createdAt: now,
    updatedAt: now,
  };

  db.tasks.push(newTask);
  saveDatabase(db);
  res.status(201).json(newTask);
});

app.patch("/api/tasks/:id", (req: Request, res: Response) => {
  const db = loadDatabase();
  const index = db.tasks.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  db.tasks[index] = {
    ...db.tasks[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  saveDatabase(db);
  res.json(db.tasks[index]);
});

app.delete("/api/tasks/:id", (req: Request, res: Response) => {
  const db = loadDatabase();
  const index = db.tasks.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  db.tasks.splice(index, 1);
  saveDatabase(db);
  res.json({ message: "Task deleted successfully" });
});

// -------------------------------------------------------------
// DAILY LOGS
// -------------------------------------------------------------
app.post("/api/projects/:id/logs", (req: Request, res: Response) => {
  const db = loadDatabase();
  const now = new Date().toISOString();

  const newLog: DailyLog = {
    id: `log-${Date.now()}`,
    projectId: req.params.id,
    logDate: req.body.logDate || now.split("T")[0],
    weatherSummary: req.body.weatherSummary || "Normal conditions",
    temperature: req.body.temperature || "65°F",
    workCompleted: req.body.workCompleted || "",
    workforceCount: Number(req.body.workforceCount) || 10,
    workforceSummary: req.body.workforceSummary || "",
    issues: req.body.issues || "None",
    safetyObservations: req.body.safetyObservations || "Zero incidents",
    createdAt: now,
  };

  db.dailyLogs.unshift(newLog);
  saveDatabase(db);
  res.status(201).json(newLog);
});

// -------------------------------------------------------------
// INSPECTIONS
// -------------------------------------------------------------
app.get("/api/inspections", (_req: Request, res: Response) => {
  const db = loadDatabase();
  res.json(db.inspections);
});

app.post("/api/inspections", (req: Request, res: Response) => {
  const db = loadDatabase();
  const project = db.projects.find((p) => p.id === req.body.projectId);

  const newInspection: Inspection = {
    id: `insp-${Date.now()}`,
    projectId: req.body.projectId || "proj-1",
    projectName: project ? project.name : req.body.projectName || "General Site",
    inspectionType: req.body.inspectionType || "safety",
    severity: req.body.severity || "Medium",
    reviewStatus: "Pending Review",
    imageReference: req.body.imageReference,
    inputData: req.body.inputData || {},
    findings: req.body.findings || {},
    recommendations: req.body.recommendations || [],
    createdAt: new Date().toISOString(),
  };

  db.inspections.unshift(newInspection);
  saveDatabase(db);
  res.status(201).json(newInspection);
});

app.patch("/api/inspections/:id", (req: Request, res: Response) => {
  const db = loadDatabase();
  const index = db.inspections.findIndex((i) => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Inspection not found" });
  }

  db.inspections[index] = {
    ...db.inspections[index],
    ...req.body,
  };

  saveDatabase(db);
  res.json(db.inspections[index]);
});

// -------------------------------------------------------------
// REPORTS
// -------------------------------------------------------------
app.get("/api/reports", (_req: Request, res: Response) => {
  const db = loadDatabase();
  res.json(db.reports);
});

app.post("/api/reports", (req: Request, res: Response) => {
  const db = loadDatabase();
  const project = db.projects.find((p) => p.id === req.body.projectId);

  const newReport: Report = {
    id: `rep-${Date.now()}`,
    projectId: req.body.projectId || "proj-1",
    projectName: project ? project.name : req.body.projectName || "General Site",
    reportType: req.body.reportType || "safety",
    title: req.body.title || "Construction Inspection Report",
    summary: req.body.summary || "",
    reportData: req.body.reportData || {},
    generatedBy: req.body.generatedBy || "AI Platform Officer",
    reviewStatus: req.body.reviewStatus || "Draft",
    createdAt: new Date().toISOString(),
  };

  db.reports.unshift(newReport);
  saveDatabase(db);
  res.status(201).json(newReport);
});

app.get("/api/reports/:id", (req: Request, res: Response) => {
  const db = loadDatabase();
  const report = db.reports.find((r) => r.id === req.params.id);
  if (!report) {
    return res.status(404).json({ error: "Report not found" });
  }
  res.json(report);
});

// -------------------------------------------------------------
// AI MODULES
// -------------------------------------------------------------
app.post("/api/ai/safety/analyze", async (req: Request, res: Response) => {
  const { image, projectName, notes, location } = req.body;
  if (!image) {
    return res.status(400).json({
      success: false,
      data: null,
      error: { code: "IMAGE_REQUIRED", message: "A construction site image is required for safety analysis." },
    });
  }

  const result = await analyzeSiteSafety(image, { projectName, notes, location });
  res.json(result);
});

app.post("/api/ai/cracks/analyze", async (req: Request, res: Response) => {
  const { image, materialType, structureType, structureAgeYears, scaleReference, observedSymptoms } = req.body;
  if (!image) {
    return res.status(400).json({
      success: false,
      data: null,
      error: { code: "IMAGE_REQUIRED", message: "A concrete or masonry photograph is required for crack detection." },
    });
  }

  const result = await analyzeCracks(image, {
    materialType,
    structureType,
    structureAgeYears,
    scaleReference,
    observedSymptoms,
  });
  res.json(result);
});

app.post("/api/ai/valuation/estimate", async (req: Request, res: Response) => {
  const result = await estimateValuation(req.body);
  res.json(result);
});

app.post("/api/ai/planning/generate", async (req: Request, res: Response) => {
  const result = await generateProjectPlan(req.body);
  res.json(result);
});

app.post("/api/ai/assistant/chat", async (req: Request, res: Response) => {
  const { messages, projectId } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ success: false, data: null, error: { code: "INVALID_REQUEST", message: "Messages array required" } });
  }

  const db = loadDatabase();
  const project = projectId ? db.projects.find((p) => p.id === projectId) : null;
  const projectTasks = project ? db.tasks.filter((t) => t.projectId === project.id) : [];

  const context = project ? { ...project, tasks: projectTasks } : undefined;
  const result = await chatDailyAssistant(messages, context);
  res.json(result);
});

app.post("/api/ai/knowledge/ask", async (req: Request, res: Response) => {
  const { query, documentContext } = req.body;
  if (!query) {
    return res.status(400).json({ success: false, data: null, error: { code: "QUERY_REQUIRED", message: "Query text is required." } });
  }

  const result = await askKnowledgeBase(query, documentContext);
  res.json(result);
});

// -------------------------------------------------------------
// WEATHER FORECAST & ADVISORY
// -------------------------------------------------------------
app.get("/api/weather/forecast", async (req: Request, res: Response) => {
  const location = (req.query.location as string) || "Chicago, IL";

  // Provide realistic weather data matching the chosen location
  const forecasts: Record<string, any> = {
    "Chicago, IL": {
      location: "Chicago, IL",
      temperature: 58,
      condition: "Partly Cloudy",
      windSpeed: 16,
      humidity: 62,
      precipitationProbability: 15,
      uvIndex: 4,
      daily: [
        { day: "Today", tempMax: 62, tempMin: 48, condition: "Partly Cloudy", rainProb: 15, wind: 16 },
        { day: "Tomorrow", tempMax: 65, tempMin: 52, condition: "Sunny", rainProb: 5, wind: 11 },
        { day: "Day 3", tempMax: 54, tempMin: 44, condition: "Scattered Showers", rainProb: 65, wind: 22 },
        { day: "Day 4", tempMax: 50, tempMin: 40, condition: "Clear", rainProb: 10, wind: 12 },
        { day: "Day 5", tempMax: 56, tempMin: 46, condition: "Windy", rainProb: 20, wind: 28 },
      ],
    },
    "Seattle, WA": {
      location: "Seattle, WA",
      temperature: 52,
      condition: "Overcast with Light Rain",
      windSpeed: 12,
      humidity: 84,
      precipitationProbability: 60,
      uvIndex: 2,
      daily: [
        { day: "Today", tempMax: 54, tempMin: 46, condition: "Light Rain", rainProb: 60, wind: 12 },
        { day: "Tomorrow", tempMax: 56, tempMin: 48, condition: "Showers", rainProb: 75, wind: 15 },
        { day: "Day 3", tempMax: 58, tempMin: 50, condition: "Overcast", rainProb: 35, wind: 9 },
        { day: "Day 4", tempMax: 60, tempMin: 50, condition: "Partly Cloudy", rainProb: 20, wind: 8 },
        { day: "Day 5", tempMax: 55, tempMin: 47, condition: "Rain", rainProb: 80, wind: 18 },
      ],
    },
    "Sacramento, CA": {
      location: "Sacramento, CA",
      temperature: 74,
      condition: "Sunny & Clear",
      windSpeed: 8,
      humidity: 38,
      precipitationProbability: 0,
      uvIndex: 7,
      daily: [
        { day: "Today", tempMax: 76, tempMin: 52, condition: "Sunny", rainProb: 0, wind: 8 },
        { day: "Tomorrow", tempMax: 79, tempMin: 54, condition: "Clear", rainProb: 0, wind: 7 },
        { day: "Day 3", tempMax: 82, tempMin: 55, condition: "Sunny", rainProb: 0, wind: 9 },
        { day: "Day 4", tempMax: 75, tempMin: 50, condition: "Breezy", rainProb: 5, wind: 15 },
        { day: "Day 5", tempMax: 72, tempMin: 48, condition: "Clear", rainProb: 0, wind: 10 },
      ],
    },
  };

  const selected = forecasts[location] || {
    location,
    temperature: 64,
    condition: "Partly Cloudy",
    windSpeed: 11,
    humidity: 55,
    precipitationProbability: 20,
    uvIndex: 5,
    daily: [
      { day: "Today", tempMax: 68, tempMin: 50, condition: "Partly Cloudy", rainProb: 20, wind: 11 },
      { day: "Tomorrow", tempMax: 71, tempMin: 53, condition: "Sunny", rainProb: 10, wind: 9 },
      { day: "Day 3", tempMax: 66, tempMin: 49, condition: "Cloudy", rainProb: 30, wind: 14 },
    ],
  };

  res.json(selected);
});

app.post("/api/ai/weather/advisory", async (req: Request, res: Response) => {
  const { weatherData, location } = req.body;
  const advisory = await generateWeatherAdvisory(weatherData, location || "Active Site");
  res.json(advisory);
});

// -------------------------------------------------------------
// RESET DEMO DATABASE
// -------------------------------------------------------------
app.post("/api/reset-demo", (_req: Request, res: Response) => {
  const freshDb = resetDatabaseToDemo();
  res.json({ message: "Database reset to demo state successfully", data: freshDb });
});

// -------------------------------------------------------------
// VITE MIDDLEWARE / SPA SERVING
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.resolve("dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Construction Intelligence Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
