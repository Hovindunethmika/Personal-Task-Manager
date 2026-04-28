import React, { useState } from "react";

export function AddTaskForm({ onCreate }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    if (!title.trim()) { setErr("Title required"); return; }
    try {
      setBusy(true); setErr("");
      await onCreate(title.trim(), note.trim());
      setTitle(""); setNote(""); setOpen(false);
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  };

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      style={{
        width: "100%",
        padding: "14px 20px",
        background: "rgba(124,58,237,0.06)",
        border: "1px dashed rgba(124,58,237,0.3)",
        borderRadius: 16,
        color: "#9090B0",
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 14,
        fontWeight: 500,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 10,
        transition: "all 0.2s",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.6)"; e.currentTarget.style.color = "#A855F7"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)"; e.currentTarget.style.color = "#9090B0"; }}
    >
      <span style={{
        width: 22, height: 22, borderRadius: "50%",
        background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16, lineHeight: 1, color: "#A855F7",
      }}>+</span>
      Add new task
    </button>
  );

  return (
    <div className="glass-card" style={{ padding: 20, animation: "fadeUp 0.25s ease forwards" }}>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#7C3AED", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
        // new_task
      </p>
      {err && <p style={{ color: "#EC4899", fontSize: 12, fontFamily: "monospace", marginBottom: 10 }}>{err}</p>}
      <input
        autoFocus
        className="void-input"
        placeholder="Task title *"
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => e.key === "Enter" && submit()}
        style={{ marginBottom: 10 }}
      />
      <textarea
        className="void-input"
        placeholder="Note… (optional)"
        rows={2}
        value={note}
        onChange={e => setNote(e.target.value)}
        style={{ marginBottom: 16, resize: "none" }}
      />
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button className="btn-ghost" onClick={() => { setOpen(false); setErr(""); }}>Cancel</button>
        <button className="btn-void" onClick={submit} disabled={busy}>
          {busy ? "Creating…" : "Create →"}
        </button>
      </div>
    </div>
  );
}
