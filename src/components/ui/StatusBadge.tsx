import React from "react";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = "md" }) => {
  const norm = status.toLowerCase();
  
  let colorClasses = "bg-slate-100 text-slate-700 border-slate-300";

  // Critical / Stop / Delayed / High
  if (norm.includes("critical") || norm.includes("stop") || norm === "delayed") {
    colorClasses = "bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-500/20";
  } else if (norm.includes("high") || norm.includes("caution") || norm.includes("under review")) {
    colorClasses = "bg-amber-50 text-amber-800 border-amber-200 ring-1 ring-amber-500/20";
  } else if (norm.includes("medium") || norm.includes("in progress")) {
    colorClasses = "bg-sky-50 text-sky-700 border-sky-200 ring-1 ring-sky-500/20";
  } else if (norm.includes("low") || norm.includes("go") || norm.includes("active") || norm.includes("completed") || norm.includes("verified") || norm.includes("approved")) {
    colorClasses = "bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/20";
  }

  const sizeClasses =
    size === "sm"
      ? "text-xs px-2 py-0.5"
      : size === "lg"
      ? "text-sm px-3 py-1 font-medium"
      : "text-xs px-2.5 py-1 font-medium";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border shadow-2xs uppercase tracking-wider font-semibold ${colorClasses} ${sizeClasses}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
};
