import React, { useState, useEffect } from "react";
import {
  SearchCheck,
  Upload,
  AlertTriangle,
  Download,
  Save,
  CheckCircle2,
  Sparkles,
  Info,
  Ruler,
  Building,
  RefreshCw,
} from "lucide-react";
import { api } from "../services/api";
import { CrackAnalysisResult } from "../types";
import { StatusBadge } from "../components/ui/StatusBadge";
import { ImageAnnotator } from "../components/ui/ImageAnnotator";
import { SamplePhotosModal } from "../components/ui/SamplePhotosModal";

export const CrackDetection: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [materialType, setMaterialType] = useState("Reinforced Concrete (4000 PSI)");
  const [structureType, setStructureType] = useState("Bridge Pier Cap / Girder");
  const [structureAgeYears, setStructureAgeYears] = useState<number>(34);
  const [scaleReference, setScaleReference] = useState("6-inch magnetic scale card");
  const [observedSymptoms, setObservedSymptoms] = useState("Diagonal line originating from tension face near support.");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<CrackAnalysisResult | null>(null);
  const [sampleModalOpen, setSampleModalOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setResults(null);
        setSavedSuccess(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imageSrc) return;
    try {
      setIsAnalyzing(true);
      setSavedSuccess(false);
      const res = await api.analyzeCracks({
        image: imageSrc,
        materialType,
        structureType,
        structureAgeYears,
        scaleReference,
        observedSymptoms,
      });

      if (res.success && res.data) {
        setResults(res.data);
      } else {
        alert(res.error?.message || "Crack analysis failed.");
      }
    } catch (err: any) {
      console.error("Crack scan error:", err);
      alert("Failed to analyze crack: " + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveReport = async () => {
    if (!results) return;
    try {
      await api.createReport({
        projectId: "proj-3",
        projectName: "Crestview Viaduct & Bridge Retrofit",
        reportType: "crack",
        title: `Optical Crack Inspection - ${structureType}`,
        summary: results.summary,
        reportData: results,
      });
      setSavedSuccess(true);
    } catch (err) {
      console.error("Failed to save report:", err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-900 p-5 text-white shadow-lg border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <SearchCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">AI Crack Detection &amp; Structural Morphology</h1>
              <span className="rounded-md bg-amber-400/20 border border-amber-400/30 px-2 py-0.5 text-[10px] font-mono text-amber-300">
                MODULE 2
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              High-resolution concrete and masonry surface crack classification, spatial localization, and repair diagnostics.
            </p>
          </div>
        </div>

        <button
          onClick={() => setSampleModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:bg-amber-400 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          <span>Load Concrete Crack Sample</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span>Concrete / Masonry Surface Image</span>
              {imageSrc && (
                <button
                  onClick={() => setImageSrc(null)}
                  className="text-xs text-rose-600 hover:underline font-semibold"
                >
                  Remove
                </button>
              )}
            </h3>

            {!imageSrc ? (
              <label className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-7 text-center hover:border-amber-500 hover:bg-amber-50/20 transition-all cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-600 group-hover:scale-110 transition-transform">
                  <Upload className="h-5 w-5" />
                </div>
                <p className="mt-2 text-xs font-bold text-slate-800">Upload crack photograph</p>
                <p className="mt-0.5 text-[11px] text-slate-500">Attach optical photo with scale card if available</p>
              </label>
            ) : (
              <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-950">
                <img
                  src={imageSrc}
                  alt="Crack preview"
                  className="w-full max-h-[300px] object-contain mx-auto"
                />
              </div>
            )}

            {/* Inputs */}
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Material Type
                  </label>
                  <select
                    value={materialType}
                    onChange={(e) => setMaterialType(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
                  >
                    <option value="Reinforced Concrete (4000 PSI)">Reinforced Concrete</option>
                    <option value="Prestressed / Post-Tensioned Concrete">Post-Tensioned Concrete</option>
                    <option value="Unreinforced Mass Concrete">Mass Concrete</option>
                    <option value="Clay Brick Masonry">Clay Brick Masonry</option>
                    <option value="Concrete Block (CMU)">Concrete Block (CMU)</option>
                    <option value="Exterior Cement Plaster / Stucco">Cement Stucco / Render</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Structure Type
                  </label>
                  <select
                    value={structureType}
                    onChange={(e) => setStructureType(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
                  >
                    <option value="Bridge Pier Cap / Girder">Bridge Pier Cap / Girder</option>
                    <option value="Elevated Floor Deck Slab">Elevated Floor Slab</option>
                    <option value="Primary Structural Column">Structural Column</option>
                    <option value="Basement Retaining Wall">Foundation / Retaining Wall</option>
                    <option value="Pavement SOG">Slab on Grade (Pavement)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Structure Age (Years)
                  </label>
                  <input
                    type="number"
                    value={structureAgeYears}
                    onChange={(e) => setStructureAgeYears(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Scale Reference
                  </label>
                  <input
                    type="text"
                    value={scaleReference}
                    onChange={(e) => setScaleReference(e.target.value)}
                    placeholder="e.g. 6-inch card, coin, or none"
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Observed Symptoms / History
                </label>
                <textarea
                  rows={2}
                  value={observedSymptoms}
                  onChange={(e) => setObservedSymptoms(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
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
                    <span>Detecting &amp; Classifying Crack Patterns...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Scan Surface Cracks</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 leading-relaxed">
            <div className="flex items-center gap-2 font-bold mb-1 text-amber-950">
              <Info className="h-4 w-4 text-amber-700 shrink-0" />
              <span>Diagnostic Engineering Limitations</span>
            </div>
            Do not claim precise crack width, depth, or structural load capacity from an ordinary photograph without physical contact testing or ultrasonic pulse velocity (UPV). A qualified structural engineer (SE) must verify critical findings.
          </div>
        </div>

        {/* Right Output Dashboard (7 Cols) */}
        <div className="lg:col-span-7">
          {!results ? (
            <div className="flex h-full min-h-[460px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-400 shadow-2xs">
              <SearchCheck className="h-12 w-12 text-slate-300 mb-3" />
              <h4 className="text-sm font-bold text-slate-700">Awaiting Crack Scan Execution</h4>
              <p className="mt-1 text-xs text-slate-500 max-w-sm">
                Upload a photograph of the damaged concrete or masonry surface to inspect morphology, bounding coordinates, and repair protocol.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Annotated Image with Bounding Boxes */}
              {imageSrc && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">
                      AI Spatial Localization &amp; Bounding Overlay
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Normalized Coordinates [ymin, xmin, ymax, xmax]
                    </span>
                  </div>
                  <ImageAnnotator
                    imageSrc={imageSrc}
                    regions={results.detectedRegions || []}
                    alt="Detected crack region"
                  />
                </div>
              )}

              {/* Classification & Severity Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Classification
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {results.crackClassification}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge status={results.severityCategory} size="md" />
                    <button
                      onClick={handleSaveReport}
                      disabled={savedSuccess}
                      className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:bg-emerald-600 transition-colors shadow-2xs cursor-pointer"
                    >
                      {savedSuccess ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Report Logged</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-3.5 w-3.5" />
                          <span>Save Inspection</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Visual Characteristics &amp; Symptoms
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                    {results.visualCharacteristics.map((vc, i) => (
                      <li key={i}>{vc}</li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Steps */}
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Recommended Inspection &amp; Remediation Steps
                  </h4>
                  <div className="space-y-2">
                    {results.recommendedSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-3 text-xs text-slate-800 border border-slate-100"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Limitations */}
                {results.limitations?.length > 0 && (
                  <div className="mt-5 rounded-xl bg-slate-100 p-3 text-[11px] text-slate-600">
                    <span className="font-bold text-slate-700 block mb-1">
                      Measurement &amp; Structural Limitations:
                    </span>
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

      <SamplePhotosModal
        isOpen={sampleModalOpen}
        onClose={() => setSampleModalOpen(false)}
        filterType="crack"
        onSelect={(uri, title) => {
          setImageSrc(uri);
          setObservedSymptoms(`Pre-loaded scenario: ${title}`);
          setResults(null);
          setSavedSuccess(false);
        }}
      />
    </div>
  );
};
