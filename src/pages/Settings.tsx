import React, { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  Cpu,
  Database,
  CloudSun,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { api } from "../services/api";

export const Settings: React.FC = () => {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [units, setUnits] = useState("imperial");
  const [currency, setCurrency] = useState("USD");

  const checkHealth = async () => {
    try {
      setLoading(true);
      const data = await api.getHealth();
      setHealth(data);
    } catch (err) {
      console.error("Health check error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const handleResetDemo = async () => {
    try {
      setIsResetting(true);
      setResetDone(false);
      await api.resetDemoData();
      setResetDone(true);
      setTimeout(() => setResetDone(false), 3000);
    } catch (err) {
      console.error("Reset failed:", err);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-900 p-5 text-white shadow-lg border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <SettingsIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Platform System Diagnostics &amp; Settings</h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Service status, multimodal AI model configuration, and regional preferences.
            </p>
          </div>
        </div>

        <button
          onClick={checkHealth}
          className="flex items-center gap-1.5 rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-all cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Ping Services</span>
        </button>
      </div>

      {/* Integration Diagnostics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Gemini Service Status */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <Cpu className="h-4 w-4 text-amber-500" />
              <span>Gemini Multimodal AI</span>
            </div>
            {health?.geminiConfigured ? (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="h-3 w-3" /> Live Connected
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                <Sparkles className="h-3 w-3" /> Demo Engine Active
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Active Model: <strong className="font-mono text-slate-900">{health?.model || "gemini-3.8-flash"}</strong>.
            Multimodal image analysis processes high-resolution construction photos with schema validation.
          </p>
          <div className="mt-3 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            {health?.geminiConfigured
              ? "Google Gen AI SDK initialized server-side with injected API credentials."
              : "Running in deterministic demo mode with pre-calibrated safety and crack detection algorithms."}
          </div>
        </div>

        {/* Database Status */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <Database className="h-4 w-4 text-sky-500" />
              <span>Database &amp; Persistence</span>
            </div>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="h-3 w-3" /> Persistent Active
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Persistent local storage syncing projects, tasks, inspections, shift logs, and generated reports.
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <span>Storage Engine: <strong>Local Data Store</strong></span>
            <button
              onClick={handleResetDemo}
              disabled={isResetting}
              className="text-amber-700 font-bold hover:underline cursor-pointer"
            >
              {isResetting ? "Resetting..." : resetDone ? "Reset Done!" : "Reset to Demo Seed"}
            </button>
          </div>
        </div>

        {/* Weather Provider */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <CloudSun className="h-4 w-4 text-sky-500" />
              <span>Weather Advisory Service</span>
            </div>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="h-3 w-3" /> Connected
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Configurable provider with automated activity thresholds for wind, precipitation, and thermal concrete curing limits.
          </p>
        </div>

        {/* Security & Access Architecture */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Security &amp; Sandboxing</span>
            </div>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="h-3 w-3" /> Active
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Strict server-side validation. Uploaded photos are verified before parsing. No API keys are ever sent or exposed to the client browser.
          </p>
        </div>
      </div>

      {/* Regional Preferences */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
          Regional Units &amp; Currency Defaults
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Measurement System
            </label>
            <select
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 focus:border-amber-500 focus:outline-hidden"
            >
              <option value="imperial">Imperial (Feet, Inches, PSI, Cu Yds, °F)</option>
              <option value="metric">Metric (Meters, Millimeters, MPa, Cu Meters, °C)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Default Project Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 focus:border-amber-500 focus:outline-hidden"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
              <option value="AED">AED (د.إ)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
