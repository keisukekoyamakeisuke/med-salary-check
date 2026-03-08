"use client";


interface Props {
  value: number | null;
  unknown: boolean;
  onChange: (v: number | null) => void;
  onUnknown: (v: boolean) => void;
}

const MIN = 200;
const MAX = 1500;
const STEP = 10;

export function SalarySlider({ value, unknown, onChange, onUnknown }: Props) {
  const displayValue = value != null ? value / 10000 : 400;

  return (
    <div className="space-y-6">
      <div className={`transition-opacity ${unknown ? "opacity-40 pointer-events-none" : ""}`}>
        <div className="text-center mb-4">
          <span className="text-4xl font-bold text-blue-700">
            {displayValue.toFixed(0)}
          </span>
          <span className="text-lg text-slate-500 ml-1">万円</span>
        </div>
        <input
          type="range"
          min={MIN}
          max={MAX}
          step={STEP}
          value={displayValue}
          onChange={(e) => onChange(Number(e.target.value) * 10000)}
          className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>{MIN}万円</span>
          <span>{MAX}万円</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onUnknown(!unknown)}
        className={`
          w-full py-3 rounded-xl border-2 text-sm font-medium transition-all
          ${
            unknown
              ? "border-slate-400 bg-slate-100 text-slate-700"
              : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
          }
        `}
      >
        {unknown ? "✓ " : ""}年収がわからない・スキップする
      </button>
    </div>
  );
}
