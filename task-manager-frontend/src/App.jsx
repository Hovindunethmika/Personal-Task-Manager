import React, { useState, useMemo } from "react";
import { useTasks } from "./hooks/useTasks";
import { AddTaskForm } from "./components/AddTaskForm";
import { TaskCard } from "./components/TaskCard";
import { EditModal } from "./components/EditModal";
import { FilterBar } from "./components/FilterBar";

export default function App() {
  const [filter, setFilter] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const { tasks, loading, error, createTask, updateTask, patchTask, deleteTask } = useTasks(filter);

  const counts = useMemo(() => filter !== "" ? undefined : {
    "": tasks.length,
    pending: tasks.filter(t => t.status === "pending").length,
    in_progress: tasks.filter(t => t.status === "in_progress").length,
    done: tasks.filter(t => t.status === "done").length,
  }, [tasks, filter]);

  const doneCount = tasks.filter(t => t.status === "done").length;
  const progress = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 20px 60px" }}>
      {/* Header */}
      <header style={{ padding: "40px 0 32px", position: "sticky", top: 0, zIndex: 40, background: "linear-gradient(to bottom, #080810 80%, transparent)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                background: "#7C3AED",
                boxShadow: "0 0 12px rgba(124,58,237,0.8)",
                animation: "pulseGlow 2s ease-in-out infinite",
              }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#7C3AED", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                v0.1.0
              </span>
            </div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 700, color: "#F0F0FF", letterSpacing: "-0.03em", lineHeight: 1 }}>
              void<span style={{ color: "#7C3AED" }}>.</span>tasks
            </h1>
          </div>

          {/* Progress ring */}
          {tasks.length > 0 && (
            <div style={{ textAlign: "center" }}>
              <svg width="56" height="56" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                <circle
                  cx="28" cy="28" r="22" fill="none"
                  stroke="#7C3AED" strokeWidth="3"
                  strokeDasharray={`${2 * Math.PI * 22}`}
                  strokeDashoffset={`${2 * Math.PI * 22 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 28 28)"
                  style={{ filter: "drop-shadow(0 0 6px rgba(124,58,237,0.6))" }}
                />
                <text x="28" y="33" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="500" fill="#A855F7">
                  {progress}%
                </text>
              </svg>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#5A5A78", marginTop: 4 }}>done</p>
            </div>
          )}
        </div>

        {/* Stats row */}
        {tasks.length > 0 && (
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {[
              { label: "total", val: tasks.length, color: "#F0F0FF" },
              { label: "pending", val: counts?.pending ?? 0, color: "#F59E0B" },
              { label: "active", val: counts?.in_progress ?? 0, color: "#06B6D4" },
              { label: "done", val: counts?.done ?? 0, color: "#10B981" },
            ].map(s => (
              <div key={s.label} style={{
                flex: 1, padding: "10px 12px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12, textAlign: "center",
              }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 500, color: s.color, marginBottom: 2 }}>{s.val}</p>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#5A5A78", textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        <FilterBar active={filter} onChange={setFilter} counts={counts} />
      </header>

      {/* Main content */}
      <main style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <AddTaskForm onCreate={createTask} />

        {loading && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 0", gap: 12, color: "#5A5A78" }}>
            <span style={{ width: 16, height: 16, border: "2px solid #7C3AED", borderTopColor: "transparent", borderRadius: "50%", display: "block", animation: "spin 0.8s linear infinite" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>loading tasks…</span>
          </div>
        )}

        {error && (
          <div style={{
            padding: "16px 20px",
            background: "rgba(236,72,153,0.08)",
            border: "1px solid rgba(236,72,153,0.25)",
            borderRadius: 14,
          }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#EC4899", marginBottom: 4 }}>
              error: {error}
            </p>
            <p style={{ fontSize: 12, color: "#9090B0" }}>
              Make sure the Go backend is running on port 8080.
            </p>
          </div>
        )}

        {!loading && !error && tasks.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: "rgba(124,58,237,0.08)",
              border: "1px solid rgba(124,58,237,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="2" y="2" width="18" height="18" rx="4" stroke="#7C3AED" strokeWidth="1.2"/>
                <path d="M11 7v8M7 11h8" stroke="#7C3AED" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: "#F0F0FF", marginBottom: 6 }}>No tasks yet</p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#5A5A78" }}>// create your first task above</p>
          </div>
        )}

        {!loading && tasks.map((task, i) => (
          <TaskCard key={task.id} task={task} index={i} onPatch={patchTask} onDelete={deleteTask} onEdit={setEditingTask} />
        ))}
      </main>

      {editingTask && <EditModal task={editingTask} onSave={updateTask} onClose={() => setEditingTask(null)} />}

      <style>{`
        @keyframes pulseGlow { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
      `}</style>
    </div>
  );
}
