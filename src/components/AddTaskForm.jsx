import React, { useState } from "react";

export function AddTaskForm({ onCreate, loading }) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    if (!title.trim()) { setErr("Title is required"); return; }
    try {
      setBusy(true);
      setErr("");
      await onCreate(title.trim(), note.trim());
      setTitle("");
      setNote("");
      setOpen(false);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-3 px-5 py-4 rounded-xl
                   border-2 border-dashed border-black/15
                   text-muted font-body font-medium
                   hover:border-ink/40 hover:text-ink
                   transition-all duration-200 group"
      >
        <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center
                         group-hover:bg-ink group-hover:border-ink group-hover:text-paper transition-all duration-200">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </span>
        New task
      </button>
    );
  }

  return (
    <div className="bg-paper-dark border-2 border-ink/20 rounded-xl p-5 animate-scale-in">
      <h3 className="font-display font-semibold text-sm uppercase tracking-widest text-muted mb-4">
        New Task
      </h3>

      {err && (
        <p className="text-xs text-accent mb-3 font-mono">{err}</p>
      )}

      <input
        autoFocus
        className="input-field mb-3"
        placeholder="Task title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
      />
      <textarea
        className="input-field resize-none mb-4"
        placeholder="Add a note… (optional)"
        rows={2}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <div className="flex gap-2 justify-end">
        <button className="btn-ghost" onClick={() => { setOpen(false); setErr(""); }}>
          Cancel
        </button>
        <button className="btn-primary" onClick={submit} disabled={busy}>
          {busy ? "Creating…" : "Create Task"}
        </button>
      </div>
    </div>
  );
}
