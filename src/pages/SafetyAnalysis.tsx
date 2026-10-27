import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Save,
  ArrowRight,
  Info,
  Layers,
  FileCheck,
  RefreshCw,
} from "lucide-react";
import { api } from "../services/api";
import { Project, SafetyAnalysisResult } from "../types";
import { StatusBadge } from "../components/ui/StatusBadge";
import { SamplePhotosModal } from "../components/ui/SamplePhotosModal";

export const SafetyAnalysis: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("proj-1");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [siteNotes, setSiteNotes] = useState("");
  const [locationName, setLocationName] = useState("Floor 26 West Leading Edge");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<SafetyAnalysisResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [sampleModalOpen, setSampleModalOpen] = useState(false);

  useEffect(() => {
    api.getProjects().then(setProjects).catch(console.error);
  }, []);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPG, PNG, WebP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setResults(null);
      setSavedSuccess(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!imageSrc) return;
    try {
      setIsAnalyzing(true);
      setSavedSuccess(false);
      const selectedProject = projects.find((p) => p.id === selectedProjectId);
      const res = await api.analyzeSafety({
        image: imageSrc,
        projectName: selectedProject?.name,
        notes: siteNotes,
        location: locationName,
      });

      if (res.success && res.data) {
        setResults(res.data);
      } else {
        alert(res.error?.message || "Safety analysis failed.");
      }
    } catch (err: any) {
      console.error("Safety scan failed:", err);
      alert("Failed to analyze image: " + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToProject = async () => {
    if (!results) return;
    try {
      setIsSaving(true);
      const selectedProject = projects.find((p) => p.id === selectedProjectId);
      await api.createInspection({
        projectId: selectedProjectId,
        projectName: selectedProject?.name,
        inspectionType: "safety",
        severity: (results.hazards[0]?.severity as any) || "High",
        inputData: { location: locationName, notes: siteNotes },
        findings: results,
        recommendations: results.generalRecommendations,
      });
      setSavedSuccess(true);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-900 p-5 text-white shadow-lg border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">Multimodal AI Construction Site Safety Monitoring</h1>
              <span className="rounded-md bg-amber-400/20 border border-amber-400/30 px-2 py-0.5 text-[10px] font-mono text-amber-300">
                MODULE 1
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Automated optical inspection for PPE compliance, leading-edge fall hazards, barricading, and equipment positioning.
            </p>
          </div>
        </div>

        <button
          onClick={() => setSampleModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:bg-amber-400 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          <span>Load Test Photo (1-Click)</span>
        </button>
      </div>

      {/* Main Grid: Upload & Controls on Left, Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Upload & Parameters (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span>Site Photograph Input</span>
              {imageSrc && (
                <button
                  onClick={() => setImageSrc(null)}
                  className="text-xs text-rose-600 hover:underline font-semibold"
                >
                  Clear Photo
                </button>
              )}
            </h3>

            {/* Dropzone */}
            {!imageSrc ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center hover:border-amber-500 hover:bg-amber-50/20 transition-all cursor-pointer"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 group-hover:scale-110 transition-transform">
                  <Upload className="h-6 w-6" />
                </div>
                <p className="mt-3 text-xs font-bold text-slate-800">
                  Drag and drop site photo here, or browse
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Supports high-resolution JPG, PNG, WebP (up to 25MB)
                </p>
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-950 shadow-inner">
                <img
                  src={imageSrc}
                  alt="Site preview"
                  className="w-full max-h-[340px] object-contain mx-auto"
                />
                <div className="absolute bottom-2 right-2 rounded-md bg-slate-900/80 px-2 py-1 text-[10px] text-slate-200 backdrop-blur-xs font-mono">
                  Ready for AI Scan
                </div>
              </div>
            )}

            {/* Site Metadata Controls */}
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Construction Project
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-amber-500 focus:outline-hidden"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specific Site Location / Elevation
                </label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Floor 26 West Slab Edge, Grid B-4"
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Inspector Site Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={siteNotes}
                  onChange={(e) => setSiteNotes(e.target.value)}
                  placeholder="e.g. Morning pre-pour walk-through; active hoisting overhead."
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!imageSrc || isAnalyzing}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:bg-amber-400 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                    <span>Analyzing Site Conditions with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Analyze Safety Conditions</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Regulatory Safety Disclaimer Box */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-900 leading-relaxed">
            <div className="flex items-center gap-2 font-bold mb-1 text-amber-950">
              <Info className="h-4 w-4 text-amber-700 shrink-0" />
              <span>Mandatory Safety Protocol Notice</span>
            </div>
            AI analysis assists site supervisors by flagging visible anomalies, but does NOT certify site safety or replace inspections by qualified OSHA/CSP certified personnel. Critical hazards must be inspected in person immediately.
          </div>
        </div>

        {/* Right Column: AI Findings Dashboard (7 Cols) */}
        <div className="lg:col-span-7">
          {!results ? (
            <div className="flex h-full min-h-[460px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-400 shadow-2xs">
              <ShieldAlert className="h-12 w-12 text-slate-300 mb-3" />
              <h4 className="text-sm font-bold text-slate-700">No Safety Scan Performed Yet</h4>
              <p className="mt-1 text-xs text-slate-500 max-w-sm">
                Upload a site photo or click "Load Test Photo" above to initiate automated multimodal hazard detection.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Executive Summary Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Analysis Summary
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {results.summary}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveToProject}
                      disabled={isSaving || savedSuccess}
                      className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:bg-emerald-600 transition-colors shadow-2xs cursor-pointer"
                    >
                      {savedSuccess ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                          <span>Saved to Project</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-3.5 w-3.5" />
                          <span>{isSaving ? "Saving..." : "Save to Project Log"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Identified Hazards List */}
                <div className="mt-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Identified Potential Hazards ({results.hazards.length})
                  </h4>

                  {results.hazards.map((hazard, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <AlertTriangle
                            className={`h-4 w-4 ${
                              hazard.severity === "Critical"
                                ? "text-rose-600"
                                : hazard.severity === "High"
                                ? "text-amber-600"
                                : "text-sky-600"
                            }`}
                          />
                          <span className="text-xs font-bold text-slate-900">
                            {hazard.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {hazard.confidence && (
                            <span className="text-[11px] font-mono text-slate-500">
                              Confidence: {Math.round(hazard.confidence * 100)}%
                            </span>
                          )}
                          <StatusBadge status={hazard.severity} size="sm" />
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {hazard.description}
                      </p>

                      <div className="mt-2 text-[11px] text-slate-500">
                        <strong>Visual Evidence:</strong> {hazard.evidence}
                      </div>

                      <div className="mt-2.5 rounded-lg bg-white p-2.5 border border-slate-200/80 text-xs text-slate-800 flex items-start gap-2">
                        <span className="font-bold text-amber-600 shrink-0">Action:</span>
                        <span>{hazard.recommended_action}</span>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>Priority: <strong className="text-slate-800">{hazard.priority}</strong></span>
                        <span className="text-emerald-700 font-medium">Flagged for Foreman Walkthrough</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* General Recommendations */}
                {results.generalRecommendations?.length > 0 && (
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Follow-up Inspection Directives
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                      {results.generalRecommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Analysis Limitations */}
                {results.limitations?.length > 0 && (
                  <div className="mt-4 rounded-xl bg-slate-100 p-3 text-[11px] text-slate-600">
                    <span className="font-bold text-slate-700 block mb-1">Optical Model Limitations:</span>
                    <ul className="space-y-0.5 list-disc list-inside">
                      {results.limitations.map((lim, i) => (
                        <li key={i}>{lim}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pre-loaded sample selector modal */}
      <SamplePhotosModal
        isOpen={sampleModalOpen}
        onClose={() => setSampleModalOpen(false)}
        filterType="safety"
        onSelect={(uri, title) => {
          setImageSrc(uri);
          setSiteNotes(`Pre-loaded scenario: ${title}`);
          setResults(null);
          setSavedSuccess(false);
        }}
      />
    </div>
  );
};
