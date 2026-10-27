import React, { useState } from "react";
import {
  BookOpenCheck,
  Search,
  Sparkles,
  FileText,
  Copy,
  Check,
  Building,
  Ruler,
  Shield,
  Layers,
  HelpCircle,
  RefreshCw,
} from "lucide-react";
import { api } from "../services/api";

export const KnowledgeBase: React.FC = () => {
  const [query, setQuery] = useState("");
  const [documentContext, setDocumentContext] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const sampleQuestions = [
    "What is the minimum moist curing period for ASTM C150 Type I concrete under ACI 308R?",
    "Explain the tension lap splice rules for Grade 60 rebar under ACI 318-19 Section 25.5.",
    "What are the acceptable slump and temperature limits for structural ready-mix concrete at discharge?",
    "What are the OSHA requirements for ladder safety and trench egress in excavations exceeding 4 feet?",
  ];

  const handleAsk = async (preset?: string) => {
    const q = preset || query;
    if (!q.trim() || isAsking) return;

    try {
      setIsAsking(true);
      setResponse(null);
      const res = await api.askKnowledge(q, documentContext);
      if (res.success && res.data) {
        setResponse(res.data);
      } else {
        alert(res.error?.message || "Knowledge inquiry failed.");
      }
    } catch (err: any) {
      console.error("Knowledge query error:", err);
      alert("Error querying knowledge base: " + err.message);
    } finally {
      setIsAsking(false);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-900 p-5 text-white shadow-lg border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <BookOpenCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">Construction Engineering Knowledge Assistant</h1>
              <span className="rounded-md bg-amber-400/20 border border-amber-400/30 px-2 py-0.5 text-[10px] font-mono text-amber-300">
                MODULE 7
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Standards-grounded engineering encyclopedia covering ACI 318, AISC, ASTM, IBC, and OSHA construction specifications.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Technical Query &amp; Specification Context
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Engineering Question / Standard Code Inquiry
              </label>
              <textarea
                rows={3}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. What is the required clear cover for #8 rebar exposed to earth in foundation footings according to ACI 318?"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Attach Project Specification Excerpt (Optional)</span>
                <span className="text-[10px] text-slate-400 font-normal">Pasted Spec / Submittal</span>
              </label>
              <textarea
                rows={3}
                value={documentContext}
                onChange={(e) => setDocumentContext(e.target.value)}
                placeholder="Paste architectural specification excerpt, structural note, or subcontractor RFI text..."
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden font-mono"
              />
            </div>

            <button
              onClick={() => handleAsk()}
              disabled={!query.trim() || isAsking}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:bg-amber-400 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isAsking ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                  <span>Referencing Standards &amp; Formulating Answer...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Consult Knowledge Base</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Presets */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
            <h4 className="text-xs font-bold text-slate-900 mb-2.5 flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-amber-500" />
              <span>Common Engineering Topics</span>
            </h4>
            <div className="space-y-1.5">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(q);
                    handleAsk(q);
                  }}
                  className="w-full text-left rounded-lg p-2 text-[11px] text-slate-700 hover:bg-amber-50 hover:text-amber-900 transition-colors border border-slate-100 block"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Dashboard (7 Cols) */}
        <div className="lg:col-span-7">
          {!response ? (
            <div className="flex h-full min-h-[460px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-400 shadow-2xs">
              <BookOpenCheck className="h-12 w-12 text-slate-300 mb-3" />
              <h4 className="text-sm font-bold text-slate-700">Awaiting Technical Query</h4>
              <p className="mt-1 text-xs text-slate-500 max-w-sm">
                Enter a construction code or materials question or click a preset topic on the left for step-by-step engineering principles.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Engineering Standards Answer
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg bg-slate-100 px-2.5 py-1"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-semibold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="prose prose-sm max-w-none text-xs text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
                {response}
              </div>

              <div className="border-t border-slate-100 pt-4 rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500">
                <strong>Jurisdiction Notice:</strong> Local municipal building amendments, sealed structural drawings, and the stamped project specification issued by the licensed Engineer of Record (EOR) always supersede generalized engineering literature.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
