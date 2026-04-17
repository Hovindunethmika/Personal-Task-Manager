import React, { useState } from "react";
import { StatusBadge } from "./StatusBadge";

const NEXT_STATUS = {
  pending: "in_progress",
  in_progress: "done",
  done: "pending",
};

const TOGGLE_LABEL = {
  pending: "Start",
  in_progress: "Complete",
  done: "Reopen",
};

export function TaskCard({ task, onPatch, onDelete, onEdit, index }) {
  const [deleting, setDeleting] = useState(false);
  const [patching, setPatching] = useState(false);

  const handleToggle = async () => {
    try {
      setPatching(true);
      await onPatch(task.id, { status: NEXT_STATUS[task.status] });
    } finally {
      setPatching(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await onDelete(task.id);
    } catch {
      setDeleting(false);
    }
  };

  const date = new Date(task.updated_at).toLocaleDateString("en-US", {
    month: "short", day: "numeric"
  });

  return (
    <div
      className="task-card animate-slide-up group"
      style={{ animationDelay: `${index * 40}ms`, animationFillMode: "both", opacity: 0 }}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: title + note */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className={`font-display font-semibold text-base leading-snug
                            ${task.status === "done" ? "line-through text-muted" : "text-ink"}`}>
              {task.title}
            </h3>
            <StatusBadge status={task.status} />
          </div>
          {task.note && (
            <p className="text-sm text-muted font-body leading-relaxed line-clamp-2">
              {task.note}
            </p>
          )}
          <p className="text-xs font-mono text-muted/60 mt-2">{date}</p>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
          {/* Edit (PUT) */}
          <button
            onClick={() => onEdit(task)}
            title="Edit task"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted
                       hover:bg-black/5 hover:text-ink transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9.5 1.5l3 3L4 13H1v-3L9.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Delete */}
          <button
            onClick={handleDelete}
            disabled={deleting}
            title="Delete task"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted
                       hover:bg-accent/10 hover:text-accent transition-all disabled:opacity-40"
          >
            {deleting ? (
              <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                <path d="M1 3h10M4 3V1.5h4V3M2 3l.7 9h6.6L10 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Toggle status — PATCH */}
      <div className="mt-4 pt-3 border-t border-black/8">
        <button
          onClick={handleToggle}
          disabled={patching}
          className={`text-xs font-mono font-medium uppercase tracking-wider
                      px-3 py-1.5 rounded-md border transition-all duration-150
                      active:scale-95 disabled:opacity-40
                      ${task.status === "done"
                        ? "border-muted/30 text-muted hover:border-muted/60"
                        : "border-ink/20 text-ink hover:bg-ink hover:text-paper"
                      }`}
        >
          {patching ? "…" : `→ ${TOGGLE_LABEL[task.status]}`}
        </button>
      </div>
    </div>
  );
}
