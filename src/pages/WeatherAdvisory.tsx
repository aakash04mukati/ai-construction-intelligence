import React, { useState, useEffect } from "react";
import {
  CloudSun,
  Wind,
  Droplets,
  Thermometer,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  MapPin,
  RefreshCw,
  Sun,
  CloudRain,
} from "lucide-react";
import { api } from "../services/api";
import { WeatherAdvisoryResult } from "../types";
import { StatusBadge } from "../components/ui/StatusBadge";

export const WeatherAdvisory: React.FC = () => {
  const [location, setLocation] = useState("Chicago, IL");
  const [forecast, setForecast] = useState<any>(null);
  const [advisory, setAdvisory] = useState<WeatherAdvisoryResult | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchWeatherAndAdvisory = async (locToFetch: string) => {
    try {
      setLoading(true);
      const weatherData = await api.getWeatherForecast(locToFetch);
      setForecast(weatherData);

      const adv = await api.getWeatherAdvisory(weatherData, locToFetch);
      if (adv.success && adv.data) {
        setAdvisory(adv.data);
      }
    } catch (err) {
      console.error("Weather error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherAndAdvisory(location);
  }, []);

  const cities = ["Chicago, IL", "Seattle, WA", "Sacramento, CA"];

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-900 p-5 text-white shadow-lg border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <CloudSun className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">Weather-Aware Construction Advisory Matrix</h1>
              <span className="rounded-md bg-amber-400/20 border border-amber-400/30 px-2 py-0.5 text-[10px] font-mono text-amber-300">
                MODULE 6
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Live meteorological impact assessment for concrete placing, crane hoisting limits, roofing, and excavations.
            </p>
          </div>
        </div>

        {/* Quick Location Pills */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => {
                setLocation(city);
                fetchWeatherAndAdvisory(city);
              }}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                location === city
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {city.split(",")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Current Conditions Card */}
      {forecast && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                {forecast.temperature > 70 ? (
                  <Sun className="h-8 w-8 text-amber-500" />
                ) : forecast.precipitationProbability > 40 ? (
                  <CloudRain className="h-8 w-8 text-sky-500" />
                ) : (
                  <CloudSun className="h-8 w-8 text-sky-500" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-900">{forecast.location}</h3>
                  <span className="text-xs text-slate-500 font-medium">({forecast.condition})</span>
                </div>
                <div className="text-2xl font-bold text-slate-800 mt-0.5">
                  {forecast.temperature}°F
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 text-center sm:text-left">
              <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Sustained Wind</span>
                <span className="text-sm font-bold text-slate-900 flex items-center gap-1 mt-0.5 justify-center sm:justify-start">
                  <Wind className="h-3.5 w-3.5 text-sky-500" />
                  {forecast.windSpeed} mph
                </span>
              </div>

              <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Rain Probability</span>
                <span className="text-sm font-bold text-slate-900 flex items-center gap-1 mt-0.5 justify-center sm:justify-start">
                  <Droplets className="h-3.5 w-3.5 text-sky-500" />
                  {forecast.precipitationProbability}%
                </span>
              </div>

              <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Risk</span>
                <span className="text-xs font-bold text-amber-700 mt-1 block">
                  {advisory?.overallSiteRisk || "Low Risk"}
                </span>
              </div>
            </div>
          </div>

          {/* 5-Day Forecast Row */}
          {forecast.daily && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2">
              {forecast.daily.map((d: any, i: number) => (
                <div key={i} className="rounded-xl border border-slate-100 bg-slate-50/50 p-2 text-center text-xs">
                  <span className="font-bold text-slate-700 block text-[11px]">{d.day}</span>
                  <div className="my-1 font-mono font-bold text-slate-900">
                    {d.tempMax}° / {d.tempMin}°
                  </div>
                  <span className="text-[10px] text-slate-500 block truncate">{d.condition}</span>
                  <span className="text-[10px] text-sky-600 block mt-0.5 font-medium">{d.rainProb}% rain</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Construction Activity Risk Matrix */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Site Activity Operational Go / Caution / Stop Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Correlated against equipment load charts, OSHA wind limits, and ACI concrete temperature thresholds
            </p>
          </div>
          {loading && <RefreshCw className="h-4 w-4 animate-spin text-amber-500" />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {advisory?.activities.map((act, idx) => (
            <div
              key={idx}
              className={`rounded-xl border p-4 transition-all flex flex-col justify-between ${
                act.status === "Stop"
                  ? "border-rose-200 bg-rose-50/30"
                  : act.status === "Caution"
                  ? "border-amber-200 bg-amber-50/30"
                  : "border-emerald-200 bg-emerald-50/20"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-900">{act.activity}</h4>
                  <StatusBadge status={act.status} size="sm" />
                </div>

                <div className="text-[11px] text-slate-500 mb-2 font-mono">
                  Conditions: {act.weatherCondition}
                </div>

                <div className="text-xs text-slate-700 mb-2 leading-relaxed">
                  <strong className="text-slate-900">Potential Impact:</strong> {act.impact}
                </div>
              </div>

              <div className="rounded-lg bg-white p-2.5 border border-slate-200/80 text-[11px] text-slate-800">
                <strong className="text-amber-700 block mb-0.5">Required Precaution:</strong>
                {act.precaution}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
