import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShieldAlert,
  SearchCheck,
  CalendarDays,
  Building2,
  MessageSquareText,
  CloudSun,
  BookOpenCheck,
  Briefcase,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  HardHat,
  Cpu,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  geminiActive: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  geminiActive,
}) => {
  const location = useLocation();

  const navigationItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Site Safety AI", path: "/safety", icon: ShieldAlert, badge: "Multimodal" },
    { name: "Crack Detection", path: "/cracks", icon: SearchCheck, badge: "Vision" },
    { name: "Project Planning", path: "/planning", icon: CalendarDays },
    { name: "Real Estate Valuation", path: "/valuation", icon: Building2 },
    { name: "Daily Site Assistant", path: "/assistant", icon: MessageSquareText },
    { name: "Weather Advisory", path: "/weather", icon: CloudSun },
    { name: "Knowledge Base", path: "/knowledge", icon: BookOpenCheck },
    { name: "Project Management", path: "/projects", icon: Briefcase },
    { name: "Reports & Exports", path: "/reports", icon: FileText },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out border-r border-slate-800 bg-slate-900 text-slate-200 flex flex-col justify-between select-none ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Header / Branding */}
      <div>
        <div className="flex items-center justify-between px-4 py-5 border-b border-slate-800/80">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-bold">
              <HardHat className="h-6 w-6 stroke-[2.2]" />
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                  BuildIntel <span className="text-amber-400 font-mono text-[10px] bg-amber-400/10 px-1 rounded">PRO</span>
                </span>
                <span className="text-[11px] text-slate-400 truncate">Construction Intelligence</span>
              </div>
            )}
          </Link>
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="mt-4 px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)] scrollbar-thin scrollbar-thumb-slate-800">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
                title={collapsed ? item.name : undefined}
              >
                <Icon
                  className={`h-4.5 w-4.5 shrink-0 transition-transform ${
                    isActive ? "text-slate-950 scale-105" : "text-slate-400 group-hover:text-amber-400"
                  }`}
                />

                {!collapsed && (
                  <div className="flex items-center justify-between w-full truncate">
                    <span className="truncate">{item.name}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-mono ${
                          isActive
                            ? "bg-slate-950/20 text-slate-950"
                            : "bg-slate-800 text-amber-400 border border-amber-400/20"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}

                {/* Floating tooltip when collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-3 hidden group-hover:flex items-center z-50 rounded-lg bg-slate-950 px-2.5 py-1.5 text-xs font-semibold text-white shadow-xl border border-slate-800 whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom status badge */}
      <div className="p-3 border-t border-slate-800/80">
        <div
          className={`flex items-center gap-2.5 p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center">
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                geminiActive ? "bg-emerald-400" : "bg-amber-400"
              }`}
            />
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${
                geminiActive ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
          </div>

          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="text-[11px] font-semibold text-slate-200 flex items-center gap-1">
                <Cpu className="h-3 w-3 text-amber-400" />
                {geminiActive ? "Gemini Multimodal Live" : "Demo Engine Active"}
              </span>
              <span className="text-[10px] text-slate-400 truncate">
                {geminiActive ? "gemini-3.8-flash" : "Full offline fallback"}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
