import React from "react";
import { Sparkles, X, CheckCircle, ShieldAlert, AlertTriangle } from "lucide-react";

interface SamplePhotosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageDataUri: string, title: string, category: "safety" | "crack") => void;
  filterType?: "safety" | "crack";
}

// Generate high quality SVG data URIs for construction testing
function createSafetySampleSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
    <rect width="800" height="500" fill="#2d3748"/>
    <!-- Sky & Upper Construction -->
    <rect x="0" y="0" width="800" height="220" fill="#4a5568"/>
    <!-- Concrete Slab Edge -->
    <polygon points="0,220 800,220 800,260 0,260" fill="#a0aec0"/>
    <rect x="0" y="260" width="800" height="240" fill="#718096"/>
    <!-- Distant skyline -->
    <rect x="100" y="140" width="60" height="80" fill="#2b6cb0" opacity="0.4"/>
    <rect x="220" y="110" width="80" height="110" fill="#2b6cb0" opacity="0.3"/>
    <rect x="360" y="160" width="70" height="60" fill="#2b6cb0" opacity="0.4"/>
    <!-- Edge Opening & Sagging Cable -->
    <path d="M 50,210 Q 400,245 750,210" stroke="#ecc94b" stroke-width="4" fill="none" stroke-dasharray="10,5"/>
    <circle cx="50" cy="210" r="6" fill="#ecc94b"/>
    <circle cx="750" cy="210" r="6" fill="#ecc94b"/>
    <!-- Loose wooden timber dunnage near edge -->
    <rect x="280" y="225" width="160" height="24" rx="2" fill="#d69e2e" transform="rotate(8 360 237)"/>
    <rect x="310" y="218" width="140" height="20" rx="2" fill="#b7791f" transform="rotate(-4 380 228)"/>
    <!-- Rebar stub hazard -->
    <rect x="520" y="195" width="8" height="35" fill="#e53e3e"/>
    <rect x="535" y="198" width="8" height="32" fill="#e53e3e"/>
    <rect x="550" y="192" width="8" height="38" fill="#e53e3e"/>
    <!-- Warning Stamp -->
    <rect x="40" y="40" width="380" height="60" rx="8" fill="#1a202c" opacity="0.85"/>
    <text x="60" y="75" fill="#f6ad55" font-family="sans-serif" font-size="18" font-weight="bold">AI TEST: UNPROTECTED ELEVATION EDGE</text>
    <text x="60" y="92" fill="#cbd5e0" font-family="sans-serif" font-size="12">Slack perimeter cable &amp; loose timber fall hazard</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

function createCrackSampleSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
    <!-- Concrete Surface Texture -->
    <rect width="800" height="500" fill="#cbd5e1"/>
    <!-- Concrete Formwork lines -->
    <line x1="0" y1="120" x2="800" y2="120" stroke="#94a3b8" stroke-width="3"/>
    <line x1="0" y1="360" x2="800" y2="360" stroke="#94a3b8" stroke-width="3"/>
    <line x1="260" y1="0" x2="260" y2="500" stroke="#94a3b8" stroke-width="2"/>
    <line x1="580" y1="0" x2="580" y2="500" stroke="#94a3b8" stroke-width="2"/>
    <!-- Diagonal Shear Crack Pattern -->
    <path d="M 220,110 Q 250,140 270,180 T 320,230 T 370,290 T 430,340 T 520,380" 
          stroke="#1e293b" stroke-width="5" fill="none" stroke-linecap="round"/>
    <!-- Micro branching -->
    <path d="M 320,230 Q 350,240 370,250" stroke="#334155" stroke-width="2.5" fill="none"/>
    <path d="M 430,340 Q 420,380 440,410" stroke="#334155" stroke-width="3" fill="none"/>
    <path d="M 270,180 Q 290,160 310,155" stroke="#475569" stroke-width="2" fill="none"/>
    <!-- Scale Reference card -->
    <rect x="540" y="220" width="160" height="90" rx="6" fill="#f8fafc" stroke="#0f172a" stroke-width="2"/>
    <rect x="550" y="230" width="140" height="15" fill="#ef4444"/>
    <text x="560" y="275" fill="#0f172a" font-family="monospace" font-size="14" font-weight="bold">SCALE: 6 INCH</text>
    <text x="560" y="295" fill="#64748b" font-family="monospace" font-size="10">1 div = 0.5 in</text>
    <!-- Label Banner -->
    <rect x="40" y="40" width="380" height="60" rx="8" fill="#0f172a" opacity="0.9"/>
    <text x="60" y="75" fill="#38bdf8" font-family="sans-serif" font-size="18" font-weight="bold">AI TEST: DIAGONAL SHEAR CRACK</text>
    <text x="60" y="92" fill="#cbd5e1" font-family="sans-serif" font-size="12">Reinforced concrete girder with 6-inch scale</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

function createPpeSampleSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
    <rect width="800" height="500" fill="#334155"/>
    <!-- Staging area floor -->
    <polygon points="0,320 800,320 800,500 0,500" fill="#475569"/>
    <!-- Construction Material Stacks -->
    <rect x="60" y="240" width="180" height="90" fill="#b45309" stroke="#78350f" stroke-width="3"/>
    <rect x="80" y="160" width="140" height="80" fill="#d97706" stroke="#92400e" stroke-width="2"/>
    <!-- Forklift silhouette in background -->
    <rect x="520" y="220" width="180" height="110" rx="10" fill="#f59e0b"/>
    <rect x="480" y="240" width="50" height="10" fill="#0f172a"/>
    <circle cx="560" cy="330" r="25" fill="#0f172a"/>
    <circle cx="660" cy="330" r="25" fill="#0f172a"/>
    <!-- Human Worker Without Helmet & Vest -->
    <circle cx="340" cy="220" r="16" fill="#fbcfe8"/>
    <rect x="325" y="238" width="30" height="50" fill="#1e293b"/> <!-- Dark hoodie, NO high-vis vest -->
    <rect x="328" y="288" width="10" height="40" fill="#0f172a"/>
    <rect x="342" y="288" width="10" height="40" fill="#0f172a"/>
    <!-- Trip cords on ground -->
    <path d="M 280,360 Q 420,380 580,340" stroke="#f43f5e" stroke-width="4" fill="none"/>
    <!-- Label Banner -->
    <rect x="40" y="40" width="400" height="60" rx="8" fill="#0f172a" opacity="0.9"/>
    <text x="60" y="75" fill="#fbbf24" font-family="sans-serif" font-size="18" font-weight="bold">AI TEST: PPE &amp; HOUSEKEEPING</text>
    <text x="60" y="92" fill="#cbd5e1" font-family="sans-serif" font-size="12">Missing hi-vis, unhelmeted crew, trailing cable</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export const SamplePhotosModal: React.FC<SamplePhotosModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  filterType,
}) => {
  if (!isOpen) return null;

  const samples = [
    {
      id: "s1",
      title: "Unprotected Slab Edge & Sagging Perimeter Cable",
      category: "safety" as const,
      description: "Leading elevated edge with loose timber dunnage within 18 inches of floor boundary.",
      getImage: createSafetySampleSvg,
      badge: "High Risk Hazard",
    },
    {
      id: "s2",
      title: "Diagonal Shear Crack on Concrete Girder",
      category: "crack" as const,
      description: "Severe 38° diagonal shear crack propagating from tension zone with scale reference card.",
      getImage: createCrackSampleSvg,
      badge: "Structural Concrete Defect",
    },
    {
      id: "s3",
      title: "PPE Deficiency & Trailing Cable Trip Hazard",
      category: "safety" as const,
      description: "Ground personnel in forklift loading aisle without high-visibility vests or protective headgear.",
      getImage: createPpeSampleSvg,
      badge: "OSHA Violation",
    },
  ];

  const visibleSamples = filterType
    ? samples.filter((s) => s.category === filterType)
    : samples;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Pre-Loaded Test Site Photographs</h3>
              <p className="text-xs text-slate-500">
                Select a calibrated construction scenario for immediate 1-click multimodal AI analysis.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {visibleSamples.map((sample) => (
            <div
              key={sample.id}
              onClick={() => {
                onSelect(sample.getImage(), sample.title, sample.category);
                onClose();
              }}
              className="group cursor-pointer rounded-xl border border-slate-200 bg-slate-50 p-3 hover:border-amber-500 hover:bg-amber-50/30 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-900">
                  <img
                    src={sample.getImage()}
                    alt={sample.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 right-2 rounded-md bg-slate-950/80 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                    {sample.category === "safety" ? "Safety" : "Crack"}
                  </span>
                </div>
                <h4 className="mt-3 text-sm font-semibold text-slate-900 group-hover:text-amber-700">
                  {sample.title}
                </h4>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {sample.description}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-200/60">
                <span className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
                  {sample.category === "safety" ? (
                    <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                  )}
                  {sample.badge}
                </span>
                <span className="text-xs font-semibold text-amber-600 group-hover:translate-x-0.5 transition-transform">
                  Load &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-xs text-slate-500">
            You can also drag-and-drop or upload any real site JPG/PNG from your local device.
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
