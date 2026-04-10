# 📝 Task Manager — Go Backend

A clean REST API built with **Go + Gin + GORM + SQLite**.

---

## 📁 Project Structure

```
task-manager/
├── cmd/
│   └── main.go                     # Entry point
├── config/
│   └── config.go                   # .env loader
├── internal/
│   ├── database/
│   │   └── database.go             # GORM SQLite init
│   ├── handlers/
│   │   └── task_handler.go         # All 5 REST handlers
│   ├── middleware/
│   │   └── middleware.go           # CORS, logger, error recovery
│   └── models/
│       └── task.go                 # Task model + request types
├── .env                            # Environment variables
├── go.mod
└── README.md
```

---

## ⚙️ Prerequisites

- [Go 1.22+](https://go.dev/dl/)
- GCC (required by SQLite driver) — on Ubuntu: `sudo apt install gcc`

---

## 🚀 Setup & Run

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/task-manager.git
cd task-manager

# 2. Install dependencies
go mod tidy

# 3. Copy and configure environment
cp .env .env.local   # optional: edit PORT or DB_PATH

# 4. Run the server
go run cmd/main.go
```

Server starts at: `http://localhost:8080`

---

## 🔌 API Reference

Base URL: `http://localhost:8080/api`

### Task Schema

```json
{
  "id": 1,
  "title": "Buy groceries",
  "note": "Milk, eggs, bread",
  "status": "pending",
  "created_at": "2026-03-29T10:00:00Z",
  "updated_at": "2026-03-29T10:00:00Z"
}
```

Status values: `pending` | `in_progress` | `done`

---

### GET `/api/tasks`
Fetch all tasks. Optionally filter by status:
```
GET /api/tasks?status=pending
```

**Response 200:**
```json
{ "success": true, "message": "tasks fetched successfully", "data": [...] }
```

---

### GET `/api/tasks/:id`
Fetch a single task by ID.

**Response 200:**
```json
{ "success": true, "message": "task fetched successfully", "data": { ... } }
```

---

### POST `/api/tasks`
Create a new task.

**Body:**
```json
{ "title": "Buy groceries", "note": "Milk, eggs, bread" }
```

**Response 201:**
```json
{ "success": true, "message": "task created successfully", "data": { ... } }
```

---

### PUT `/api/tasks/:id`
Fully replace a task (all fields required).

**Body:**
```json
{ "title": "Buy groceries", "note": "Updated note", "status": "in_progress" }
```

**Response 200:**
```json
{ "success": true, "message": "task updated successfully", "data": { ... } }
```

---

### PATCH `/api/tasks/:id`
Partially update a task (only include fields you want to change).

**Body (toggle status only):**
```json
{ "status": "done" }
```

**Response 200:**
```json
{ "success": true, "message": "task patched successfully", "data": { ... } }
```

---

### DELETE `/api/tasks/:id`
Delete a task permanently.

**Response 200:**
```json
{ "success": true, "message": "task deleted successfully" }
```

---

## 🧪 Test with curl

```bash
# Create
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Go","note":"Finish the Gin tutorial"}'

# Get all
curl http://localhost:8080/api/tasks

# Get one
curl http://localhost:8080/api/tasks/1

# Full update
curl -X PUT http://localhost:8080/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Go","note":"Done!","status":"done"}'

# Partial update (toggle status only)
curl -X PATCH http://localhost:8080/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"in_progress"}'

# Delete
curl -X DELETE http://localhost:8080/api/tasks/1
```

---

## 🔧 Environment Variables

| Variable   | Default      | Description              |
|------------|--------------|--------------------------|
| `PORT`     | `8080`       | Port the server listens on |
| `GIN_MODE` | `debug`      | `debug` or `release`     |
| `DB_PATH`  | `./tasks.db` | Path to SQLite database  |

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `gin-gonic/gin` | HTTP router & framework |
| `gorm.io/gorm` | ORM for database access |
| `gorm.io/driver/sqlite` | SQLite driver for GORM |
| `joho/godotenv` | Load `.env` files |
