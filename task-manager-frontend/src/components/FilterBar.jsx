import React from "react";

const FILTERS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending", color: "#F59E0B" },
  { value: "in_progress", label: "In Progress", color: "#06B6D4" },
  { value: "done", label: "Done", color: "#10B981" },
];

export function FilterBar({ active, onChange, counts }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {FILTERS.map((f) => {
        const isActive = active === f.value;
        return (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: 100,
              border: isActive
                ? `1px solid ${f.color || "rgba(124,58,237,0.6)"}`
                : "1px solid rgba(255,255,255,0.08)",
              background: isActive
                ? f.color
                  ? `${f.color}18`
                  : "rgba(124,58,237,0.15)"
                : "transparent",
              color: isActive ? f.color || "#A855F7" : "#9090B0",
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {f.color && isActive && (
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: f.color }} />
            )}
            {f.label}
            {counts?.[f.value] != null && (
              <span style={{
                fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
                background: "rgba(255,255,255,0.1)",
                padding: "1px 6px",
                borderRadius: 100,
                color: "inherit",
              }}>
                {counts[f.value]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
