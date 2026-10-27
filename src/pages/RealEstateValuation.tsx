import React, { useState } from "react";
import {
  Building2,
  Sparkles,
  TrendingUp,
  DollarSign,
  Info,
  CheckCircle,
  AlertTriangle,
  Layers,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { api } from "../services/api";
import { ValuationResult } from "../types";

export const RealEstateValuation: React.FC = () => {
  const [propertyType, setPropertyType] = useState("Commercial Office Building");
  const [location, setLocation] = useState("Downtown Financial District, Chicago, IL");
  const [landArea, setLandArea] = useState<number>(35000);
  const [builtUpArea, setBuiltUpArea] = useState<number>(180000);
  const [numberOfFloors, setNumberOfFloors] = useState<number>(14);
  const [buildingAge, setBuildingAge] = useState<number>(8);
  const [constructionQuality, setConstructionQuality] = useState("High-End");
  const [propertyCondition, setPropertyCondition] = useState("Excellent");
  const [amenities, setAmenities] = useState("Subterranean Parking (250 stalls), LEED Gold Certification, Backup Generators, High-Speed Elevators");
  const [roadAccess, setRoadAccess] = useState("Dual-Arterial Primary Highway Corridor");
  const [currency, setCurrency] = useState("USD");
  const [measurementUnit, setMeasurementUnit] = useState("sq ft");

  const [isEstimating, setIsEstimating] = useState(false);
  const [result, setResult] = useState<ValuationResult | null>(null);

  const handleEstimate = async () => {
    try {
      setIsEstimating(true);
      const res = await api.estimateValuation({
        propertyType,
        location,
        landArea,
        builtUpArea,
        numberOfFloors,
        buildingAge,
        constructionQuality,
        propertyCondition,
        amenities,
        roadAccess,
        currency,
        measurementUnit,
      });

      if (res.success && res.data) {
        setResult(res.data);
      } else {
        alert(res.error?.message || "Valuation failed.");
      }
    } catch (err: any) {
      console.error("Valuation error:", err);
      alert("Failed to calculate valuation: " + err.message);
    } finally {
      setIsEstimating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-900 p-5 text-white shadow-lg border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">AI Real Estate Valuation &amp; Asset Appraisal</h1>
              <span className="rounded-md bg-amber-400/20 border border-amber-400/30 px-2 py-0.5 text-[10px] font-mono text-amber-300">
                MODULE 3
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Cost-approach modeling, land-to-building ratio breakdown, comparable transactions, and value driver sensitivity.
            </p>
          </div>
        </div>

        <button
          onClick={handleEstimate}
          disabled={isEstimating}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:bg-amber-400 disabled:opacity-50 transition-all cursor-pointer"
        >
          {isEstimating ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
              <span>Synthesizing Asset Valuation...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Calculate Valuation</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3.5">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Property Specification
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
              >
                <option value="Commercial Office Building">Commercial Office Building</option>
                <option value="Industrial Logistics Facility">Industrial Logistics Facility</option>
                <option value="Multi-Family Residential Complex">Multi-Family Residential Complex</option>
                <option value="Mixed-Use Retail & Residential">Mixed-Use Retail &amp; Residential</option>
                <option value="Hospitality / Hotel">Hospitality / Hotel</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Location &amp; District
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Land Area ({measurementUnit})
                </label>
                <input
                  type="number"
                  value={landArea}
                  onChange={(e) => setLandArea(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Built-up Area ({measurementUnit})
                </label>
                <input
                  type="number"
                  value={builtUpArea}
                  onChange={(e) => setBuiltUpArea(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Number of Floors
                </label>
                <input
                  type="number"
                  value={numberOfFloors}
                  onChange={(e) => setNumberOfFloors(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Building Age (Years)
                </label>
                <input
                  type="number"
                  value={buildingAge}
                  onChange={(e) => setBuildingAge(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Construction Quality
                </label>
                <select
                  value={constructionQuality}
                  onChange={(e) => setConstructionQuality(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
                >
                  <option value="Standard">Standard Commercial</option>
                  <option value="High-End">High-End Institutional</option>
                  <option value="Luxury">Luxury Grade A+</option>
                  <option value="Economy">Economy / Shell</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Property Condition
                </label>
                <select
                  value={propertyCondition}
                  onChange={(e) => setPropertyCondition(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Needs Renovation">Needs Renovation</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="AED">AED (د.إ)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Measurement Unit
                </label>
                <select
                  value={measurementUnit}
                  onChange={(e) => setMeasurementUnit(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
                >
                  <option value="sq ft">Square Feet (sq ft)</option>
                  <option value="sq m">Square Meters (sq m)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Road Access &amp; Logistics Frontage
              </label>
              <input
                type="text"
                value={roadAccess}
                onChange={(e) => setRoadAccess(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Building Amenities &amp; MEP Systems
              </label>
              <textarea
                rows={2}
                value={amenities}
                onChange={(e) => setAmenities(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Right Output Dashboard (7 Cols) */}
        <div className="lg:col-span-7">
          {!result ? (
            <div className="flex h-full min-h-[460px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-400 shadow-2xs">
              <Building2 className="h-12 w-12 text-slate-300 mb-3" />
              <h4 className="text-sm font-bold text-slate-700">Awaiting Valuation Execution</h4>
              <p className="mt-1 text-xs text-slate-500 max-w-sm">
                Enter building dimensions, finishes, and regional data on the left to calculate indicative capital value and comparable market rates.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Midpoint Big Banner */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Estimated Indicative Valuation Midpoint
                </span>
                <div className="mt-1 text-3xl sm:text-4xl font-black text-slate-900 flex items-baseline gap-2">
                  <span>
                    {result.currency} {result.estimatedMidpoint.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    ({result.currency} {result.estimatedRatePerUnit}/{result.unit})
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span>Range:</span>
                  <strong className="text-slate-900">
                    {result.currency} {result.estimatedRange.low.toLocaleString()}
                  </strong>
                  <span>to</span>
                  <strong className="text-slate-900">
                    {result.currency} {result.estimatedRange.high.toLocaleString()}
                  </strong>
                  <span className="ml-auto text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
                    Score: {result.dataCompletenessScore}%
                  </span>
                </div>

                {/* Land vs Building Breakdown */}
                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Building Structure Value
                    </span>
                    <span className="text-base font-black text-slate-900 mt-1 block">
                      {result.currency} {result.breakdown.buildingStructureValue.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      {result.breakdown.depreciationAdjustment || "Physical wear factored"}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Underlying Land Value
                    </span>
                    <span className="text-base font-black text-slate-900 mt-1 block">
                      {result.currency} {result.breakdown.landValue.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      Zoning utility assessment
                    </span>
                  </div>
                </div>

                {/* Positive & Negative Drivers */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                  <div>
                    <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Value Appreciation Drivers</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {result.valueDrivers.positiveFactors.map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                      <span>Risk &amp; Depreciation Factors</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {result.valueDrivers.negativeOrRiskFactors.map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Comparable Market Transactions */}
                <div className="mt-6 border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Market Comparable Benchmarks
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold">
                          <th className="py-2 px-2.5">Comparable Property</th>
                          <th className="py-2 px-2.5">Area</th>
                          <th className="py-2 px-2.5">Sale Rate</th>
                          <th className="py-2 px-2.5">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {result.comparableProperties.map((comp, idx) => (
                          <tr key={idx}>
                            <td className="py-2 px-2.5 font-medium text-slate-900">{comp.address}</td>
                            <td className="py-2 px-2.5 text-slate-600">{comp.builtUpArea}</td>
                            <td className="py-2 px-2.5 font-mono font-semibold text-slate-900">{comp.effectiveRate}</td>
                            <td className="py-2 px-2.5 text-slate-500">{comp.saleDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mandatory Disclaimer */}
                <div className="mt-5 rounded-xl bg-slate-100 p-3 text-[11px] text-slate-600 leading-relaxed border border-slate-200/80">
                  <span className="font-bold text-slate-700 block mb-0.5">Appraisal Disclaimer:</span>
                  {result.disclaimer}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
