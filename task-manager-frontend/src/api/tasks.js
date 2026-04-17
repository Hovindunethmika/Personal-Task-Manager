const API_URL = process.env.REACT_APP_API_URL || "";
const BASE = `${API_URL}/api/tasks`;

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || "Request failed");
  }
  return json.data;
}

export const api = {
  // GET /api/tasks?status=...
  getAll: (status = "") =>
    request(`${BASE}${status ? `?status=${status}` : ""}`),

  // POST /api/tasks
  create: (title, note) =>
    request(BASE, {
      method: "POST",
      body: JSON.stringify({ title, note }),
    }),

  // PUT /api/tasks/:id  (full replace)
  update: (id, title, note, status) =>
    request(`${BASE}/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title, note, status }),
    }),

  // PATCH /api/tasks/:id  (partial — status toggle)
  patch: (id, fields) =>
    request(`${BASE}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(fields),
    }),

  // DELETE /api/tasks/:id
  remove: (id) =>
    request(`${BASE}/${id}`, { method: "DELETE" }),
};
