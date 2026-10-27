import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Briefcase,
  Calendar,
  DollarSign,
  MapPin,
  CheckCircle2,
  Clock,
  ShieldAlert,
  SearchCheck,
  FileText,
  Plus,
  ArrowLeft,
  X,
  User,
  Layers,
  Thermometer,
  Wind,
  Check,
} from "lucide-react";
import { api } from "../services/api";
import { Project, Task, Inspection, DailyLog, Report } from "../types";
import { StatusBadge } from "../components/ui/StatusBadge";

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "tasks" | "inspections" | "logs" | "reports">("tasks");

  // Task creation modal
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskPriority, setTaskPriority] = useState<"Low" | "Medium" | "High" | "Critical">("High");
  const [taskPhase, setTaskPhase] = useState("Structural Construction");
  const [taskAssigned, setTaskAssigned] = useState("Subcontractor Crew");

  // Log creation modal
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logWorkCompleted, setLogWorkCompleted] = useState("");
  const [logWorkforceCount, setLogWorkforceCount] = useState<number>(38);
  const [logWorkforceSummary, setLogWorkforceSummary] = useState("16 Ironworkers, 12 Carpenters, 6 MEP, 4 Laborers");
  const [logWeather, setLogWeather] = useState("Clear, 64°F, 11 mph winds");
  const [logIssues, setLogIssues] = useState("None reported");

  const fetchProjectDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await api.getProject(id);
      setProject(data);
    } catch (err) {
      console.error("Error fetching project:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    try {
      await api.createTask(project.id, {
        title: taskTitle,
        description: taskDesc,
        priority: taskPriority,
        phase: taskPhase,
        assignedTo: taskAssigned,
        status: "In Progress",
        progress: 25,
        startDate: new Date().toISOString().split("T")[0],
        endDate: project.targetCompletionDate,
        dependencies: [],
      });
      setIsTaskModalOpen(false);
      setTaskTitle("");
      setTaskDesc("");
      fetchProjectDetails();
    } catch (err) {
      console.error("Task creation failed:", err);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: any, newProgress: number) => {
    try {
      await api.updateTask(taskId, { status: newStatus, progress: newProgress });
      fetchProjectDetails();
    } catch (err) {
      console.error("Task update failed:", err);
    }
  };

  const handleCreateDailyLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    try {
      await api.createDailyLog(project.id, {
        workCompleted: logWorkCompleted,
        workforceCount: logWorkforceCount,
        workforceSummary: logWorkforceSummary,
        weatherSummary: logWeather,
        issues: logIssues,
      });
      setIsLogModalOpen(false);
      setLogWorkCompleted("");
      fetchProjectDetails();
    } catch (err) {
      console.error("Log creation failed:", err);
    }
  };

  if (loading || !project) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
        <span className="text-xs font-semibold text-slate-600">Loading Construction Site Workspace...</span>
      </div>
    );
  }

  const tasks = project.tasks || [];
  const inspections = project.inspections || [];
  const dailyLogs = project.dailyLogs || [];
  const reports = project.reports || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Back link & Title */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/projects" className="hover:text-amber-600 flex items-center gap-1 font-semibold">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Projects</span>
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-bold truncate">{project.name}</span>
      </div>

      {/* Project Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                {project.projectType}
              </span>
              <StatusBadge status={project.status} size="sm" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">{project.name}</h1>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                {project.location}
              </span>
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-slate-400" />
                PM: {project.manager}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:bg-amber-400 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>New Task</span>
            </button>
            <button
              onClick={() => setIsLogModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Clock className="h-4 w-4 text-amber-400" />
              <span>Log Daily Shift</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Strip */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Budget</span>
            <span className="text-base font-black text-slate-900 mt-0.5 block font-mono">
              ${(project.budget / 1000000).toFixed(1)}M USD
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Progress</span>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="h-2 w-20 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <span className="font-bold text-slate-900">{project.progress}%</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Start Date</span>
            <span className="text-xs font-semibold text-slate-700 mt-0.5 block">
              {project.startDate}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Handover</span>
            <span className="text-xs font-semibold text-slate-700 mt-0.5 block">
              {project.targetCompletionDate}
            </span>
          </div>
        </div>
      </div>

      {/* Workspace Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold">
        {[
          { key: "tasks", label: `Tasks (${tasks.length})`, icon: Layers },
          { key: "inspections", label: `Inspections (${inspections.length})`, icon: ShieldAlert },
          { key: "logs", label: `Daily Site Logs (${dailyLogs.length})`, icon: Clock },
          { key: "reports", label: `Reports (${reports.length})`, icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-all cursor-pointer ${
                isActive
                  ? "border-amber-500 text-slate-950 bg-amber-50/40 rounded-t-lg"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-amber-600" : "text-slate-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Tasks */}
      {activeTab === "tasks" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-900">Active Task Schedule &amp; Deliverables</h3>
            <span className="text-xs text-slate-500">{tasks.length} total assignments</span>
          </div>

          {tasks.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No tasks logged yet. Click "New Task" above to add an assignment.
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 hover:border-slate-300 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{task.title}</span>
                      <StatusBadge status={task.priority} size="sm" />
                      <span className="rounded bg-slate-200/80 px-2 py-0.5 text-[10px] text-slate-700 font-medium">
                        {task.phase}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] max-w-xl">{task.description}</p>
                    <div className="text-[11px] text-slate-400 flex items-center gap-3 pt-0.5">
                      <span>Assigned to: <strong>{task.assignedTo}</strong></span>
                      <span>Due: <strong>{task.endDate}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-auto">
                    {/* Progress Slider / Badge */}
                    <div className="text-right">
                      <span className="font-bold text-slate-900 block">{task.progress}%</span>
                      <span className="text-[10px] text-slate-400">{task.status}</span>
                    </div>

                    {/* Quick status toggles */}
                    {task.status !== "Completed" ? (
                      <button
                        onClick={() => handleUpdateTaskStatus(task.id, "Completed", 100)}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 shadow-2xs cursor-pointer"
                      >
                        Mark Done
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 text-emerald-600 font-bold">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Completed</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Inspections */}
      {activeTab === "inspections" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-900">Multimodal AI Inspection Records</h3>
            <span className="text-xs text-slate-500">{inspections.length} recorded</span>
          </div>

          {inspections.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No inspections recorded for this site yet. Run a scan from the Site Safety or Crack Detection module.
            </div>
          ) : (
            <div className="space-y-4">
              {inspections.map((insp) => (
                <div
                  key={insp.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {insp.inspectionType === "safety" ? (
                        <ShieldAlert className="h-4 w-4 text-rose-500" />
                      ) : (
                        <SearchCheck className="h-4 w-4 text-amber-500" />
                      )}
                      <span className="font-bold text-slate-900 capitalize">
                        {insp.inspectionType} Inspection Audit
                      </span>
                      <StatusBadge status={insp.severity} size="sm" />
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(insp.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-slate-700 leading-relaxed">
                    {insp.findings?.summary || "Inspection details logged."}
                  </p>

                  {insp.recommendations?.length > 0 && (
                    <div className="border-t border-slate-200/60 pt-2 text-[11px] text-slate-600">
                      <strong>Directives:</strong> {insp.recommendations.join(" | ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Daily Logs */}
      {activeTab === "logs" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-900">Daily Superintendent Field Logs</h3>
            <button
              onClick={() => setIsLogModalOpen(true)}
              className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Shift Entry</span>
            </button>
          </div>

          {dailyLogs.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No daily logs recorded yet.
            </div>
          ) : (
            <div className="space-y-4">
              {dailyLogs.map((log) => (
                <div
                  key={log.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="font-bold text-slate-900">Shift Date: {log.logDate}</span>
                    <span className="text-slate-500 text-[11px] font-mono">
                      {log.weatherSummary} ({log.temperature})
                    </span>
                  </div>

                  <div>
                    <strong className="text-slate-800">Work Completed:</strong>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">{log.workCompleted}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/60">
                    <div>
                      <strong>Craft Workforce ({log.workforceCount}):</strong> {log.workforceSummary}
                    </div>
                    <div>
                      <strong>Issues / Delays:</strong> {log.issues}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Reports */}
      {activeTab === "reports" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-900">Generated Reports &amp; Exports</h3>
            <span className="text-xs text-slate-500">{reports.length} records</span>
          </div>

          {reports.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No reports generated for this site yet.
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-amber-600" />
                      <span className="font-bold text-slate-900">{rep.title}</span>
                      <StatusBadge status={rep.reviewStatus} size="sm" />
                    </div>
                    <p className="text-slate-500 text-[11px]">{rep.summary}</p>
                  </div>
                  <Link
                    to="/reports"
                    className="rounded-lg bg-slate-900 px-3 py-1.5 font-semibold text-white hover:bg-slate-800"
                  >
                    View Report &rarr;
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">Add Construction Task</h3>
              <button
                onClick={() => setIsTaskModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Level 28 Tendon Stressing &amp; Elongation Verification"
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 focus:border-amber-500 focus:outline-hidden"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical Path</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phase</label>
                  <input
                    type="text"
                    value={taskPhase}
                    onChange={(e) => setTaskPhase(e.target.value)}
                    placeholder="e.g. Structural Framing"
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Subcontractor</label>
                <input
                  type="text"
                  value={taskAssigned}
                  onChange={(e) => setTaskAssigned(e.target.value)}
                  placeholder="e.g. Apex Post-Tensioning Inc"
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Task Scope &amp; Specifications</label>
                <textarea
                  rows={3}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Engineering tolerances, testing standards, safety hold points..."
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="rounded-lg bg-slate-100 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-amber-500 px-4 py-2 font-bold text-slate-950 hover:bg-amber-400"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Daily Shift Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">Log Daily Shift Record</h3>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDailyLog} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Weather &amp; Conditions</label>
                <input
                  type="text"
                  value={logWeather}
                  onChange={(e) => setLogWeather(e.target.value)}
                  placeholder="e.g. Sunny, 62°F, 12 mph NW"
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Craft Workforce</label>
                  <input
                    type="number"
                    value={logWorkforceCount}
                    onChange={(e) => setLogWorkforceCount(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Workforce Summary</label>
                  <input
                    type="text"
                    value={logWorkforceSummary}
                    onChange={(e) => setLogWorkforceSummary(e.target.value)}
                    placeholder="e.g. 18 Ironworkers, 14 Carpenters"
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Work Completed Today</label>
                <textarea
                  rows={3}
                  required
                  value={logWorkCompleted}
                  onChange={(e) => setLogWorkCompleted(e.target.value)}
                  placeholder="Detail structural progress, pours completed, hoisting operations..."
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Issues, Delays, or RFI Hold Points</label>
                <input
                  type="text"
                  value={logIssues}
                  onChange={(e) => setLogIssues(e.target.value)}
                  placeholder="e.g. 40-minute concrete batching plant dispatch delay"
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="rounded-lg bg-slate-100 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-4 py-2 font-bold text-white hover:bg-slate-800"
                >
                  Save Shift Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
