import React from "react";

const CONFIG = {
  pending: {
    label: "Pending",
    dot: "bg-amber-400",
    cls: "bg-amber-100 text-amber-700",
  },
  in_progress: {
    label: "In Progress",
    dot: "bg-progress",
    cls: "bg-blue-100 text-blue-700",
  },
  done: {
    label: "Done",
    dot: "bg-done",
    cls: "bg-green-100 text-green-700",
  },
};

export function StatusBadge({ status }) {
  const c = CONFIG[status] || CONFIG.pending;
  return (
    <span className={`status-badge ${c.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
