import React, { useState, useEffect } from "react";

const STATUSES = ["pending", "in_progress", "done"];
const STATUS_LABELS = { pending: "Pending", in_progress: "In Progress", done: "Done" };

export function EditModal({ task, onSave, onClose }) {
  const [title, setTitle] = useState(task.title);
  const [note, setNote] = useState(task.note || "");
  const [status, setStatus] = useState(task.status);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  // Close on Escape
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const submit = async () => {
    if (!title.trim()) { setErr("Title is required"); return; }
    try {
      setBusy(true);
      setErr("");
      await onSave(task.id, title.trim(), note.trim(), status);
      onClose();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-paper w-full max-w-md rounded-2xl shadow-2xl animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-black/10">
          <h2 className="font-display font-bold text-lg">Edit Task</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:bg-black/5 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {err && <p className="text-xs text-accent font-mono">{err}</p>}

          <div>
            <label className="block text-xs font-display font-semibold uppercase tracking-widest text-muted mb-1.5">
              Title *
            </label>
            <input
              autoFocus
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-display font-semibold uppercase tracking-widest text-muted mb-1.5">
              Note
            </label>
            <textarea
              className="input-field resize-none"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-display font-semibold uppercase tracking-widest text-muted mb-2">
              Status
            </label>
            <div className="flex gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`flex-1 py-2 rounded-lg text-xs font-mono font-medium uppercase tracking-wider
                              border transition-all duration-150
                              ${status === s
                                ? "bg-ink text-paper border-ink"
                                : "bg-transparent text-muted border-black/15 hover:border-black/30"
                              }`}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 justify-end px-6 pb-6">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={submit} disabled={busy}>
            {busy ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
