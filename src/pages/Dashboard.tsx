import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  ShieldAlert,
  SearchCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  TrendingUp,
  Search,
  Filter,
  ArrowUpRight,
  HardHat,
  Clock,
  Sparkles,
  ChevronRight,
  Wind,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import { api } from "../services/api";
import { Project } from "../types";
import { StatusBadge } from "../components/ui/StatusBadge";

const PIE_COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6", "#10b981"];

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "progress" | "budget">("progress");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [summary, projList] = await Promise.all([
          api.getDashboardSummary(),
          api.getProjects(),
        ]);
        setSummaryData(summary);
        setProjects(projList);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProjects = projects
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.manager.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || p.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "progress") return b.progress - a.progress;
      if (sortBy === "budget") return b.budget - a.budget;
      return a.name.localeCompare(b.name);
    });

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
        <span className="text-sm font-semibold text-slate-600">Loading Construction Intelligence Hub...</span>
      </div>
    );
  }

  const cards = summaryData?.summaryCards || {
    activeProjects: 3,
    safetyIssues: 2,
    crackInspections: 4,
    tasksInProgress: 6,
    weatherAlerts: 1,
    pendingReports: 2,
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Demo Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-5 text-white shadow-lg border border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold">Multimodal Construction Intelligence Center</h2>
              <span className="rounded-md bg-amber-400/20 border border-amber-400/30 px-2 py-0.5 text-[10px] font-mono font-semibold text-amber-300">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Live automated vision inspection, crack diagnostics, predictive scheduling, and weather risk matrix.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            to="/safety"
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/25 hover:bg-amber-400 transition-all"
          >
            <ShieldAlert className="h-4 w-4" />
            <span>Launch Safety AI</span>
          </Link>
          <Link
            to="/cracks"
            className="flex items-center gap-1.5 rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-all"
          >
            <SearchCheck className="h-4 w-4 text-amber-400" />
            <span>Scan Cracks</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards Grid (6 cards) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {/* Active Projects */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Projects</span>
            <div className="rounded-lg bg-sky-50 p-2 text-sky-600">
              <FolderKanban className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{cards.activeProjects}</div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <TrendingUp className="h-3 w-3" />
            <span>100% On Schedule</span>
          </div>
        </div>

        {/* Safety Issues */}
        <div className="rounded-2xl border border-rose-200/80 bg-rose-50/30 p-4 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-rose-700">
            <span className="text-xs font-semibold uppercase tracking-wider">Safety Issues</span>
            <div className="rounded-lg bg-rose-100 p-2 text-rose-600">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-rose-900">{cards.safetyIssues}</div>
          <div className="mt-1 text-[11px] text-rose-700 font-medium">1 Critical Flagged</div>
        </div>

        {/* Crack Inspections */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Crack Scans</span>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <SearchCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{cards.crackInspections}</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Optical + Scale Calibrated</div>
        </div>

        {/* Tasks In Progress */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Tasks</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{cards.tasksInProgress}</div>
          <div className="mt-1 text-[11px] text-emerald-600 font-medium">4 Critical Path</div>
        </div>

        {/* Weather Alerts */}
        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/30 p-4 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-xs font-semibold uppercase tracking-wider">Weather Alert</span>
            <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
              <Wind className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-amber-950">{cards.weatherAlerts}</div>
          <div className="mt-1 text-[11px] text-amber-800 font-medium">26 mph Wind Gusts</div>
        </div>

        {/* Pending Reports */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Site Reports</span>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{cards.pendingReports}</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Ready for Review</div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Inspection Activity Bar Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Weekly Inspection &amp; Scan Volume</h3>
              <p className="text-xs text-slate-500">Safety hazard audits vs structural crack scans</p>
            </div>
            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              Current Week
            </span>
          </div>

          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={summaryData?.analytics?.weeklyInspectionActivity || []}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                <Bar dataKey="safety" name="Safety Audits" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cracks" name="Crack Inspections" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Safety Incidents By Category Donut */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Safety Hazards by Category</h3>
            <p className="text-xs text-slate-500">Active flagged hazards distribution</p>
          </div>

          <div className="my-2 h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summaryData?.analytics?.safetyCategories || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {(summaryData?.analytics?.safetyCategories || []).map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "11px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-3">
            {(summaryData?.analytics?.safetyCategories || []).map((cat: any, i: number) => (
              <div key={cat.name} className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                <span className="truncate text-slate-600 text-[11px]">{cat.name}</span>
                <span className="font-bold text-slate-900 text-[11px] ml-auto">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Project Overview Table & Recent Chronological Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Table (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Active Construction Sites</h3>
              <p className="text-xs text-slate-500">Monitor completion rates, milestones, and site managers</p>
            </div>

            {/* Search & Filter Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter sites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="delayed">Delayed</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700"
              >
                <option value="progress">Sort: Progress</option>
                <option value="budget">Sort: Budget</option>
                <option value="name">Sort: Name</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-2.5 px-3">Project</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Manager</th>
                  <th className="py-2.5 px-3">Progress</th>
                  <th className="py-2.5 px-3">Target Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <Link
                        to={`/projects/${proj.id}`}
                        className="font-bold text-slate-900 hover:text-amber-600 flex items-center gap-1.5"
                      >
                        {proj.name}
                        <ArrowUpRight className="h-3 w-3 text-slate-400" />
                      </Link>
                      <span className="text-[10px] text-slate-400 block">{proj.projectType}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-[140px] truncate">{proj.location}</td>
                    <td className="py-3 px-3 text-slate-700 font-medium">{proj.manager}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${proj.progress}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-800">{proj.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{proj.targetCompletionDate}</td>
                    <td className="py-3 px-3">
                      <StatusBadge status={proj.status} size="sm" />
                    </td>
                    <td className="py-3 px-2 text-right">
                      <Link
                        to={`/projects/${proj.id}`}
                        className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-200"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chronological Recent Activity Feed (1 Col) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Site Activity</h3>
              <p className="text-xs text-slate-500">Live operational &amp; safety timeline</p>
            </div>
            <Clock className="h-4 w-4 text-slate-400" />
          </div>

          <div className="mt-4 space-y-4">
            {(summaryData?.recentActivities || []).map((act: any) => (
              <div key={act.id} className="relative pl-5 border-l-2 border-slate-200">
                <span
                  className={`absolute -left-[5px] top-1 h-2 w-2 rounded-full ${
                    act.severity === "High"
                      ? "bg-rose-500"
                      : act.severity === "Medium"
                      ? "bg-amber-500"
                      : "bg-sky-500"
                  }`}
                />
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{act.title}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">{act.timestamp}</span>
                </div>
                <div className="text-[11px] font-medium text-amber-600 mt-0.5">{act.project}</div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{act.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-slate-100 pt-3 text-center">
            <Link
              to="/reports"
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700"
            >
              <span>View All Reports &amp; Logs</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
