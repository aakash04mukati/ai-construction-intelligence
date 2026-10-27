import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Plus,
  Search,
  ArrowUpRight,
  MapPin,
  Calendar,
  DollarSign,
  User,
  X,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { api } from "../services/api";
import { Project } from "../types";
import { StatusBadge } from "../components/ui/StatusBadge";

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New project form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [client, setClient] = useState("");
  const [manager, setManager] = useState("");
  const [budget, setBudget] = useState(15000000);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [targetCompletionDate, setTargetCompletionDate] = useState("2027-06-30");
  const [projectType, setProjectType] = useState("Commercial High-Rise");
  const [siteArea, setSiteArea] = useState("45,000 sq ft");
  const [floors, setFloors] = useState(12);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await api.getProjects();
      setProjects(data);
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createProject({
        name,
        description,
        location,
        client,
        manager,
        budget: Number(budget),
        startDate,
        targetCompletionDate,
        status: "Active",
        progress: 0,
        siteArea,
        floors: Number(floors),
        projectType,
      });

      setIsModalOpen(false);
      // Reset form
      setName("");
      setDescription("");
      setLocation("");
      fetchProjects();
    } catch (err) {
      console.error("Project creation failed:", err);
    }
  };

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-900 p-5 text-white shadow-lg border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">Project Management Portfolio</h1>
              <span className="rounded-md bg-amber-400/20 border border-amber-400/30 px-2 py-0.5 text-[10px] font-mono text-amber-300">
                MODULE 8
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Enterprise site directory, schedule tracking, task assignments, and multimodal inspection history.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:bg-amber-400 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Construction Project</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects by title, location, or PM..."
            className="w-full rounded-lg border border-slate-300 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500">
          Showing {filtered.length} Sites
        </span>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((proj) => (
          <div
            key={proj.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  {proj.projectType}
                </span>
                <StatusBadge status={proj.status} size="sm" />
              </div>

              <Link
                to={`/projects/${proj.id}`}
                className="text-base font-bold text-slate-900 hover:text-amber-600 transition-colors flex items-center justify-between group"
              >
                <span>{proj.name}</span>
                <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
              </Link>

              <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                {proj.description}
              </p>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500 font-medium">Physical Completion</span>
                  <span className="font-bold text-slate-900">{proj.progress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>
              </div>

              {/* Meta details */}
              <div className="mt-4 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{proj.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>PM: {proj.manager}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>Target: {proj.targetCompletionDate}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-900">
                ${(proj.budget / 1000000).toFixed(1)}M Budget
              </span>
              <Link
                to={`/projects/${proj.id}`}
                className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
              >
                Open Workspace &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">Create New Construction Project</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Apex Central Station & Tower"
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Project Type</label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 focus:border-amber-500 focus:outline-hidden"
                  >
                    <option value="Commercial High-Rise">Commercial High-Rise</option>
                    <option value="Industrial Logistics">Industrial Logistics</option>
                    <option value="Infrastructure / Bridge">Infrastructure / Bridge</option>
                    <option value="Residential Multi-Family">Residential Multi-Family</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Site Location</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. 100 Main St, Austin, TX"
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Client / Owner</label>
                  <input
                    type="text"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="e.g. Apex Infrastructure Partners"
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Project Manager (PM)</label>
                  <input
                    type="text"
                    value={manager}
                    onChange={(e) => setManager(e.target.value)}
                    placeholder="e.g. Rachel Sterling, PE"
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Budget ($)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={targetCompletionDate}
                    onChange={(e) => setTargetCompletionDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed structural systems, square footage, design parameters..."
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg bg-slate-100 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-amber-500 px-4 py-2 font-bold text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
