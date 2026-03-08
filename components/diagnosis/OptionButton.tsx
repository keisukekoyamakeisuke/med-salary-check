"use client";

interface Props {
  label: string;
  selected: boolean;
  onClick: () => void;
  multi?: boolean;
}

export function OptionButton({ label, selected, onClick, multi }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-150 text-sm font-medium
        ${
          selected
            ? "border-blue-600 bg-blue-50 text-blue-700"
            : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50/50"
        }
      `}
    >
      <span className="flex items-center gap-3">
        <span
          className={`
            flex-shrink-0 w-5 h-5 rounded-${multi ? "md" : "full"} border-2 flex items-center justify-center
            ${selected ? "border-blue-600 bg-blue-600" : "border-slate-300"}
          `}
        >
          {selected && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </span>
        {label}
      </span>
    </button>
  );
}
