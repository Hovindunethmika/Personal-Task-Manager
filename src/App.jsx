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

  // Counts for all statuses (always from unfiltered data wouldn't need separate call;
  // we compute from current tasks for simplicity when filter="" )
  const counts = useMemo(() => {
    if (filter !== "") return undefined;
    return {
      "": tasks.length,
      pending: tasks.filter((t) => t.status === "pending").length,
      in_progress: tasks.filter((t) => t.status === "in_progress").length,
      done: tasks.filter((t) => t.status === "done").length,
    };
  }, [tasks, filter]);

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-paper/80 backdrop-blur-md border-b border-black/10">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display font-extrabold text-2xl tracking-tight leading-none">
              Taskr
            </h1>
            <p className="text-xs font-mono text-muted mt-0.5">
              {tasks.length} task{tasks.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Decorative accent */}
          <div className="w-8 h-8 rounded-full bg-accent" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-6">
        {/* Filter bar */}
        <div className="mb-5">
          <FilterBar active={filter} onChange={setFilter} counts={counts} />
        </div>

        {/* Add task form */}
        <div className="mb-6">
          <AddTaskForm onCreate={createTask} />
        </div>

        {/* States */}
        {loading && (
          <div className="flex items-center justify-center py-16 gap-3 text-muted">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span className="font-mono text-sm">Loading tasks…</span>
          </div>
        )}

        {error && (
          <div className="bg-accent/10 border border-accent/20 rounded-xl px-5 py-4 mb-4">
            <p className="text-sm font-mono text-accent">
              ⚠ {error}
            </p>
            <p className="text-xs text-muted mt-1">
              Make sure the Go backend is running on port 8080.
            </p>
          </div>
        )}

        {!loading && !error && tasks.length === 0 && (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-2xl bg-paper-dark border border-black/10
                            flex items-center justify-center mx-auto mb-3">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="3" y="3" width="14" height="14" rx="2" stroke="#8C8070" strokeWidth="1.2"/>
                <path d="M7 10h6M10 7v6" stroke="#8C8070" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="font-display font-semibold text-ink">No tasks yet</p>
            <p className="text-sm text-muted mt-1">Create your first task above</p>
          </div>
        )}

        {/* Task list */}
        {!loading && tasks.length > 0 && (
          <div className="space-y-3">
            {tasks.map((task, i) => (
              <TaskCard
                key={task.id}
                task={task}
                index={i}
                onPatch={patchTask}
                onDelete={deleteTask}
                onEdit={setEditingTask}
              />
            ))}
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {editingTask && (
        <EditModal
          task={editingTask}
          onSave={updateTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}
