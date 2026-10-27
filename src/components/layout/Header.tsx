import React, { useState } from "react";
import {
  Bell,
  HardHat,
  Search,
  Sparkles,
  RefreshCw,
  Wind,
  ShieldCheck,
  AlertTriangle,
  Menu,
} from "lucide-react";
import { Project } from "../../types";

interface HeaderProps {
  onMobileMenuToggle: () => void;
  projects: Project[];
  selectedProjectId: string;
  onSelectProject: (id: string) => void;
  onResetDemo: () => void;
  isResetting: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onMobileMenuToggle,
  projects,
  selectedProjectId,
  onSelectProject,
  onResetDemo,
  isResetting,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: "n1",
      title: "Perimeter Fall Hazard Detected",
      time: "12m ago",
      severity: "High",
      project: "Skyline Meridian Tower",
    },
    {
      id: "n2",
      title: "Elevated Wind Advisory (26 mph)",
      time: "45m ago",
      severity: "Medium",
      project: "Harborview Logistics Hub",
    },
    {
      id: "n3",
      title: "Level 28 Pour Inspection Completed",
      time: "2h ago",
      severity: "Low",
      project: "Skyline Meridian Tower",
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-6 shadow-2xs">
      {/* Left: Mobile hamburger & Site Project Selector */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="flex md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          aria-label="Toggle Navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Active Site:
          </span>
          <select
            value={selectedProjectId}
            onChange={(e) => onSelectProject(e.target.value)}
            className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-2xs hover:border-slate-400 focus:border-amber-500 focus:outline-hidden focus:ring-1 focus:ring-amber-500 max-w-[200px] sm:max-w-xs truncate cursor-pointer"
          >
            <option value="">All Construction Sites (Enterprise Portfolio)</option>
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.name} ({proj.progress}%)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Weather Indicator Quick Pill */}
        <div className="hidden lg:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 shadow-2xs">
          <Wind className="h-3.5 w-3.5 text-sky-500" />
          <span>Chicago: <strong>58°F</strong> / 16 mph NW</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </div>

        {/* Reset Demo Data Button */}
        <button
          onClick={onResetDemo}
          disabled={isResetting}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-50"
          title="Reset sample projects and inspections to initial demo state"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${isResetting ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Reset Demo</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Site Alerts &amp; Logs
                </span>
                <span className="text-[10px] bg-rose-50 text-rose-700 font-semibold px-2 py-0.5 rounded-full">
                  3 New
                </span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-900">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{n.project}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Card */}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-amber-400 font-bold shadow-2xs">
            <HardHat className="h-4.5 w-4.5" />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 leading-tight">Chief Inspector</span>
            <span className="text-[10px] text-slate-500">Site Superintendent</span>
          </div>
        </div>
      </div>
    </header>
  );
};
