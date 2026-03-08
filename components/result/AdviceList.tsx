import type { Advice } from "@/lib/types";

interface Props {
  advices: Advice[];
}

export function AdviceList({ advices }: Props) {
  return (
    <ul className="space-y-3">
      {advices.map((advice, i) => (
        <li
          key={i}
          className="bg-white rounded-xl border border-slate-200 p-4 flex gap-4 items-start"
        >
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
            {i + 1}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800">{advice.title}</p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{advice.description}</p>
            <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-md">
              期待効果 {advice.impact}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
