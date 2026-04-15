import { useState, useEffect, useCallback } from "react";
import { api } from "../api/tasks";

export function useTasks(filter) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAll(filter);
      setTasks(data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (title, note) => {
    const task = await api.create(title, note);
    setTasks((prev) => [task, ...prev]);
    return task;
  };

  const updateTask = async (id, title, note, status) => {
    const task = await api.update(id, title, note, status);
    setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
    return task;
  };

  const patchTask = async (id, fields) => {
    const task = await api.patch(id, fields);
    setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
    return task;
  };

  const deleteTask = async (id) => {
    await api.remove(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return { tasks, loading, error, createTask, updateTask, patchTask, deleteTask, refetch: fetchTasks };
}
