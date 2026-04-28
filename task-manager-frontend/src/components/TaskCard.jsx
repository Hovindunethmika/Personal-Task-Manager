import React, { useState } from "react";
import { StatusBadge } from "./StatusBadge";

const NEXT = { pending: "in_progress", in_progress: "done", done: "pending" };
const NEXT_LABEL = { pending: "Start task", in_progress: "Mark done", done: "Reopen" };
const NEXT_COLOR = { pending: "#06B6D4", in_progress: "#10B981", done: "#F59E0B" };

export function TaskCard({ task, onPatch, onDelete, onEdit, index }) {
  const [hovered, setHovered] = useState(false);
  const [patching, setPatching] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleToggle = async () => {
    try { setPatching(true); await onPatch(task.id, { status: NEXT[task.status] }); }
    finally { setPatching(false); }
  };

  const handleDelete = async () => {
    try { setDeleting(true); await onDelete(task.id); }
    catch { setDeleting(false); }
  };

  const date = new Date(task.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const isDone = task.status === "done";

  return (
    <div
      className="glass-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "18px 20px",
        animation: `slideIn 0.4s cubic-bezier(0.16,1,0.3,1) ${index * 50}ms both`,
        borderLeft: `3px solid ${isDone ? "#10B981" : task.status === "in_progress" ? "#06B6D4" : "#F59E0B"}`,
        borderRadius: "0 16px 16px 0",
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
            <h3 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 15,
              fontWeight: 600,
              color: isDone ? "#5A5A78" : "#F0F0FF",
              textDecoration: isDone ? "line-through" : "none",
              letterSpacing: "-0.01em",
            }}>
              {task.title}
            </h3>
            <StatusBadge status={task.status} />
          </div>
          {task.note && (
            <p style={{ fontSize: 13, color: "#9090B0", lineHeight: 1.6, marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {task.note}
            </p>
          )}
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#5A5A78" }}>
            {date}
          </span>
        </div>

        {/* Actions */}
        <div style={{
          display: "flex", gap: 4, alignItems: "center",
          opacity: hovered ? 1 : 0, transition: "opacity 0.15s",
        }}>
          <ActionBtn onClick={() => onEdit(task)} title="Edit" color="#A855F7">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M8.5 1.5l3 3-7 7H1.5v-3l7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
          </ActionBtn>
          <ActionBtn onClick={handleDelete} disabled={deleting} title="Delete" color="#EC4899">
            {deleting
              ? <span style={{ width: 11, height: 11, border: "1.5px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", display: "block", animation: "spin 0.7s linear infinite" }} />
              : <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
                  <path d="M1 3h9M3.5 3V1.5h4V3M2 3l.6 8.5h5.8L9 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            }
          </ActionBtn>
        </div>
      </div>

      {/* Status toggle */}
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          onClick={handleToggle}
          disabled={patching}
          style={{
            background: "transparent",
            border: `1px solid ${NEXT_COLOR[task.status]}30`,
            borderRadius: 8,
            padding: "5px 12px",
            color: NEXT_COLOR[task.status],
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            fontWeight: 500,
            cursor: "pointer",
            letterSpacing: "0.05em",
            transition: "all 0.15s",
            opacity: patching ? 0.5 : 1,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = `${NEXT_COLOR[task.status]}15`; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
        >
          {patching ? "…" : `→ ${NEXT_LABEL[task.status]}`}
        </button>
      </div>
    </div>
  );
}

function ActionBtn({ onClick, disabled, title, color, children }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        width: 30, height: 30,
        borderRadius: 8,
        border: `1px solid ${h ? color + "40" : "rgba(255,255,255,0.08)"}`,
        background: h ? `${color}12` : "transparent",
        color: h ? color : "#5A5A78",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}
