import React from "react";

const FILTERS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export function FilterBar({ active, onChange, counts }) {
  return (
    <div className="flex gap-1 flex-wrap">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-body font-medium
                      transition-all duration-150
                      ${active === f.value
                        ? "bg-ink text-paper"
                        : "text-muted hover:bg-black/5 hover:text-ink"
                      }`}
        >
          {f.label}
          {counts?.[f.value] !== undefined && (
            <span className={`text-xs font-mono rounded-full w-4 h-4 flex items-center justify-center
                              ${active === f.value ? "bg-white/20" : "bg-black/8"}`}>
              {counts[f.value]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
