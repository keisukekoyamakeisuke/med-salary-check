import type { DiagnosisResult } from "@/lib/types";
import { formatSalary } from "@/lib/diagnosis-logic";

interface Props {
  evaluation: DiagnosisResult["evaluation"];
  difference: number;
}

const CONFIG = {
  above: {
    label: "相場より高い",
    icon: "▲",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
  },
  average: {
    label: "相場と同水準",
    icon: "≈",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
  },
  below: {
    label: "相場より低い",
    icon: "▼",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
  },
};

export function ScoreBadge({ evaluation, difference }: Props) {
  const c = CONFIG[evaluation];
  const absDiff = Math.abs(difference);

  return (
    <div className={`rounded-xl border-2 ${c.bg} ${c.border} px-5 py-4 text-center`}>
      <p className={`text-xs font-medium ${c.text} mb-1`}>{c.label}</p>
      <p className={`text-3xl font-bold ${c.text}`}>
        {c.icon} {formatSalary(absDiff)}
      </p>
      <p className="text-xs text-slate-500 mt-1">同条件の中央値との差</p>
    </div>
  );
}
