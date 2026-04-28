import React, { useState, useEffect } from "react";

const STATUSES = [
  { value: "pending",     label: "Pending",     color: "#F59E0B" },
  { value: "in_progress", label: "In Progress", color: "#06B6D4" },
  { value: "done",        label: "Done",        color: "#10B981" },
];

export function EditModal({ task, onSave, onClose }) {
  const [title, setTitle] = useState(task.title);
  const [note, setNote] = useState(task.note || "");
  const [status, setStatus] = useState(task.status);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const submit = async () => {
    if (!title.trim()) { setErr("Title required"); return; }
    try { setBusy(true); setErr(""); await onSave(task.id, title.trim(), note.trim(), status); onClose(); }
    catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  };

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(8,8,16,0.85)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
        animation: "fadeUp 0.2s ease forwards",
      }}
    >
      <div style={{
        width: "100%", maxWidth: 480,
        background: "#0E0E1A",
        border: "1px solid rgba(124,58,237,0.3)",
        borderRadius: 20,
        boxShadow: "0 0 60px rgba(124,58,237,0.2), 0 24px 64px rgba(0,0,0,0.8)",
        overflow: "hidden",
        animation: "fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) forwards",
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#7C3AED", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>
              // edit_task
            </p>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 18, color: "#F0F0FF" }}>
              Edit Task
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "transparent", color: "#9090B0",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 16, lineHeight: 1,
            }}
          >✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          {err && <p style={{ color: "#EC4899", fontSize: 12, fontFamily: "monospace" }}>{err}</p>}

          <div>
            <label style={{ display: "block", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#5A5A78", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Title</label>
            <input autoFocus className="void-input" value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          <div>
            <label style={{ display: "block", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#5A5A78", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Note</label>
            <textarea className="void-input" rows={3} value={note} onChange={e => setNote(e.target.value)} style={{ resize: "none" }} />
          </div>

          <div>
            <label style={{ display: "block", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#5A5A78", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Status</label>
            <div style={{ display: "flex", gap: 8 }}>
              {STATUSES.map(s => (
                <button
                  key={s.value}
                  onClick={() => setStatus(s.value)}
                  style={{
                    flex: 1, padding: "8px 0",
                    borderRadius: 10,
                    border: `1px solid ${status === s.value ? s.color + "60" : "rgba(255,255,255,0.08)"}`,
                    background: status === s.value ? `${s.color}15` : "transparent",
                    color: status === s.value ? s.color : "#9090B0",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11, fontWeight: 500,
                    letterSpacing: "0.05em", textTransform: "uppercase",
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-void" onClick={submit} disabled={busy}>
            {busy ? "Saving…" : "Save Changes →"}
          </button>
        </div>
      </div>
    </div>
  );
}
