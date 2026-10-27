import React, { useRef, useEffect } from "react";
import { CrackRegion } from "../../types";

interface ImageAnnotatorProps {
  imageSrc: string;
  regions?: CrackRegion[];
  alt?: string;
  className?: string;
}

export const ImageAnnotator: React.FC<ImageAnnotatorProps> = ({
  imageSrc,
  regions = [],
  alt = "Inspection image",
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  return (
    <div ref={containerRef} className={`relative overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-md ${className}`}>
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className="w-full h-auto max-h-[500px] object-contain mx-auto block select-none"
      />

      {/* Render overlay bounding boxes */}
      {regions.map((region, idx) => {
        // [ymin, xmin, ymax, xmax] normalized 0-1000
        const [ymin, xmin, ymax, xmax] = region.box;
        const top = `${(ymin / 1000) * 100}%`;
        const left = `${(xmin / 1000) * 100}%`;
        const width = `${((xmax - xmin) / 1000) * 100}%`;
        const height = `${((ymax - ymin) / 1000) * 100}%`;

        return (
          <div
            key={idx}
            style={{ top, left, width, height }}
            className="absolute border-2 border-amber-500 bg-amber-500/20 rounded pointer-events-auto transition-all group"
          >
            <div className="absolute -top-7 left-0 bg-slate-900/90 backdrop-blur-xs text-amber-300 border border-amber-500/40 text-[11px] font-semibold px-2 py-0.5 rounded shadow-md whitespace-nowrap flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              {region.label || `Region ${idx + 1}`}
              {region.orientation ? ` (${region.orientation})` : ""}
            </div>

            {/* Hover tooltip */}
            <div className="hidden group-hover:block absolute bottom-full mb-8 left-0 z-20 w-48 p-2 bg-slate-950 text-white text-xs rounded-lg shadow-xl border border-slate-800">
              <div className="font-semibold text-amber-400">{region.label}</div>
              {region.estimatedVisibleLength && (
                <div className="text-slate-300 mt-0.5">Length: {region.estimatedVisibleLength}</div>
              )}
              {region.pattern && (
                <div className="text-slate-400 text-[10px] mt-0.5">{region.pattern}</div>
              )}
            </div>
          </div>
        );
      })}

      {regions.length > 0 && (
        <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md border border-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
          <span>{regions.length} AI localized defect region(s) detected</span>
        </div>
      )}
    </div>
  );
};
