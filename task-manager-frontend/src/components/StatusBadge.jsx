import React from "react";

const MAP = {
  pending:     { label: "Pending",     cls: "pill-pending",     dot: "#F59E0B" },
  in_progress: { label: "In Progress", cls: "pill-in_progress", dot: "#06B6D4" },
  done:        { label: "Done",        cls: "pill-done",        dot: "#10B981" },
};

export function StatusBadge({ status }) {
  const c = MAP[status] || MAP.pending;
  return (
    <span className={`status-pill ${c.cls}`}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.dot, display: "inline-block" }} />
      {c.label}
    </span>
  );
}
