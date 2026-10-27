import React, { useState, useEffect } from "react";
import {
  CalendarDays,
  Sparkles,
  Layers,
  Clock,
  AlertOctagon,
  Save,
  CheckCircle2,
  Package,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  FolderPlus,
} from "lucide-react";
import { api } from "../services/api";
import { PlanningResult, Project } from "../types";
import { StatusBadge } from "../components/ui/StatusBadge";

export const ProjectPlanning: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectName, setProjectName] = useState("Horizon Gateway Logistics Center");
  const [projectType, setProjectType] = useState("Industrial Warehouse / Cold Storage");
  const [projectDescription, setProjectDescription] = useState(
    "High-cube automated warehouse featuring 36-foot clear heights, post-tensioned superflat floor slabs (FF 50/FL 35), and insulated metal panel envelope."
  );
  const [siteArea, setSiteArea] = useState("180,000 sq ft");
  const [floors, setFloors] = useState<number>(2);
  const [budget, setBudget] = useState("$24,500,000");
  const [workforce, setWorkforce] = useState("65 craft workers across structural, electrical, and slab trades");
  const [plannedStartDate, setPlannedStartDate] = useState("2026-11-15");
  const [targetCompletionDate, setTargetCompletionDate] = useState("2027-12-20");
  const [constraints, setConstraints] = useState(
    "Wet winter weather expected between Dec-Feb. Strict dust control mandated by municipal environmental agency."
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [planResult, setPlanResult] = useState<PlanningResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    api.getProjects().then(setProjects).catch(console.error);
  }, []);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setSavedSuccess(false);
      const res = await api.generatePlanning({
        projectName,
        projectType,
        projectDescription,
        siteArea,
        floors,
        budget,
        workforce,
        plannedStartDate,
        targetCompletionDate,
        constraints,
      });

      if (res.success && res.data) {
        setPlanResult(res.data);
      } else {
        alert(res.error?.message || "Failed to generate project plan.");
      }
    } catch (err: any) {
      console.error("Planning error:", err);
      alert("Failed to plan project: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToActiveProject = async () => {
    if (!planResult) return;
    try {
      setIsSaving(true);
      // Create new project in the database
      const newProj = await api.createProject({
        name: planResult.projectName,
        projectType: planResult.projectType,
        description: projectDescription,
        siteArea,
        floors,
        budget: 24500000,
        startDate: plannedStartDate,
        targetCompletionDate,
        status: "Active",
        progress: 5,
        manager: "Assigned Project Manager",
        location: "Industrial Sector West",
      });

      // Save initial tasks from phase 1 & 2
      for (const phase of planResult.phases.slice(0, 2)) {
        for (const task of phase.tasks) {
          await api.createTask(newProj.id, {
            title: task.title,
            description: `Generated from ${phase.phaseName}`,
            priority: "High",
            status: "Not Started",
            phase: phase.phaseName,
            startDate: plannedStartDate,
            endDate: targetCompletionDate,
            dependencies: task.dependencies,
          });
        }
      }

      setSavedSuccess(true);
    } catch (err) {
      console.error("Save plan error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-900 p-5 text-white shadow-lg border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <CalendarDays className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">AI Construction Project Planning &amp; WBS Synthesis</h1>
              <span className="rounded-md bg-amber-400/20 border border-amber-400/30 px-2 py-0.5 text-[10px] font-mono text-amber-300">
                MODULE 4
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Automated Work Breakdown Structure, critical path phase sequencing, material forecasting, and risk contingency register.
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:bg-amber-400 disabled:opacity-50 transition-all cursor-pointer"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
              <span>Synthesizing WBS &amp; Schedule...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Generate Project Plan</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3.5">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Project Specification Inputs
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Type
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-2 py-1.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
                >
                  <option value="Commercial High-Rise">Commercial High-Rise</option>
                  <option value="Industrial Warehouse / Cold Storage">Industrial Logistics</option>
                  <option value="Residential Multi-Family">Residential Complex</option>
                  <option value="Infrastructure / Highway Bridge">Infrastructure / Bridge</option>
                  <option value="Healthcare / Hospital">Healthcare Facility</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Floors
                </label>
                <input
                  type="number"
                  value={floors}
                  onChange={(e) => setFloors(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Site Area
                </label>
                <input
                  type="text"
                  value={siteArea}
                  onChange={(e) => setSiteArea(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Budget
                </label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={plannedStartDate}
                  onChange={(e) => setPlannedStartDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-2 py-1.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  value={targetCompletionDate}
                  onChange={(e) => setTargetCompletionDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-2 py-1.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project Scope &amp; Structural System
              </label>
              <textarea
                rows={2}
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Weather &amp; Supply Chain Constraints
              </label>
              <textarea
                rows={2}
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Right Output Dashboard (8 Cols) */}
        <div className="lg:col-span-8">
          {!planResult ? (
            <div className="flex h-full min-h-[460px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-400 shadow-2xs">
              <CalendarDays className="h-12 w-12 text-slate-300 mb-3" />
              <h4 className="text-sm font-bold text-slate-700">Project Plan Not Generated Yet</h4>
              <p className="mt-1 text-xs text-slate-500 max-w-sm">
                Configure your project parameters on the left and click "Generate Project Plan" to synthesize the complete WBS, schedule, and risk matrix.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Top Summary & Actions */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Approved Plan Blueprint
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {planResult.projectName} ({planResult.totalEstimatedDurationDays} Days Total)
                    </h3>
                  </div>

                  <button
                    onClick={handleSaveToActiveProject}
                    disabled={isSaving || savedSuccess}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-500 disabled:bg-emerald-700 transition-colors shadow-2xs cursor-pointer"
                  >
                    {savedSuccess ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Saved as Active Project</span>
                      </>
                    ) : (
                      <>
                        <FolderPlus className="h-4 w-4" />
                        <span>{isSaving ? "Saving..." : "Approve & Persist Plan"}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Milestone Timeline Ribbon */}
                <div className="mt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Milestone Critical Path
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {planResult.milestones.map((ms, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-center"
                      >
                        <span className="block text-[10px] font-mono font-semibold text-amber-600 uppercase">
                          {ms.targetMonth}
                        </span>
                        <span className="text-xs font-bold text-slate-900 mt-0.5 block leading-tight">
                          {ms.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WBS Phases & Tasks Breakdown */}
                <div className="mt-6 border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Work Breakdown Structure ({planResult.phases.length} Phases)
                  </h4>

                  <div className="space-y-4">
                    {planResult.phases.map((phase, pIdx) => (
                      <div
                        key={pIdx}
                        className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs"
                      >
                        <div className="flex items-center justify-between bg-slate-100/80 px-4 py-2.5 border-b border-slate-200">
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-800 text-white font-mono text-[10px]">
                              {pIdx + 1}
                            </span>
                            {phase.phaseName}
                          </span>
                          <span className="text-xs font-mono font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {phase.durationDays} Days
                          </span>
                        </div>

                        <div className="p-3 divide-y divide-slate-100">
                          {phase.tasks.map((task, tIdx) => (
                            <div
                              key={tIdx}
                              className="py-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1"
                            >
                              <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                <span className="font-semibold text-slate-800">{task.title}</span>
                              </div>
                              <div className="flex items-center gap-3 text-slate-500 text-[11px] self-end sm:self-auto">
                                {task.dependencies.length > 0 && (
                                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600">
                                    Dep: {task.dependencies.join(", ")}
                                  </span>
                                )}
                                <span className="font-mono font-medium">{task.durationDays}d</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Material Estimates & Risk Register */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                  {/* Materials */}
                  <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
                    <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                      <Package className="h-4 w-4 text-amber-600" />
                      <span>Forecasted Material Quantities</span>
                    </h4>
                    <div className="space-y-2">
                      {planResult.materialEstimates.map((mat, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-slate-200"
                        >
                          <span className="font-medium text-slate-800">{mat.material}</span>
                          <span className="font-mono font-bold text-slate-900">{mat.estimatedQuantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risk Register */}
                  <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
                    <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                      <AlertOctagon className="h-4 w-4 text-rose-600" />
                      <span>Risk &amp; Contingency Register</span>
                    </h4>
                    <div className="space-y-2">
                      {planResult.riskRegister.map((risk, i) => (
                        <div key={i} className="text-xs bg-white p-2.5 rounded-lg border border-slate-200">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-900">{risk.risk}</span>
                            <StatusBadge status={risk.severity} size="sm" />
                          </div>
                          <p className="text-[11px] text-slate-600">{risk.mitigation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-4 rounded-xl bg-slate-100 p-3 text-[11px] text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-700 block mb-0.5">Planning Schedule Disclosure:</span>
                  {planResult.disclaimer}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
