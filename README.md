# void.tasks — Full Stack Task Manager

A full-stack task manager built with a **Go + Gin** REST API backend and a **React** frontend. Features a dark glassmorphism UI, 5 RESTful endpoints, and SQLite persistence via GORM.

![Go](https://img.shields.io/badge/Go-1.22-00ADD8?style=flat&logo=go&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![SQLite](https://img.shields.io/badge/SQLite-GORM-003B57?style=flat&logo=sqlite&logoColor=white)
![Gin](https://img.shields.io/badge/Gin-Framework-00ACD7?style=flat)

---

## Architecture

```
┌────────────────────────────────────────────┐
│           React Frontend (:3000)           │
│  AddTaskForm · TaskCard · EditModal        │
│  FilterBar · useTasks hook · api/tasks.js  │
└──────────────┬─────────────────────────────┘
               │ HTTP / JSON (proxied)
┌──────────────▼─────────────────────────────┐
│           Go + Gin Backend (:8080)         │
│  Logger · CORS · ErrorHandler middleware   │
│                                            │
│  GET    /api/tasks        → list all       │
│  POST   /api/tasks        → create         │
│  PUT    /api/tasks/:id    → full replace   │
│  PATCH  /api/tasks/:id    → partial update │
│  DELETE /api/tasks/:id    → delete         │
└──────────────┬─────────────────────────────┘
               │ GORM queries
┌──────────────▼─────────────────────────────┐
│           SQLite — tasks.db                │
│  id · title · note · status · timestamps   │
└────────────────────────────────────────────┘
```

---

## Features

- **5 REST endpoints** — correct HTTP semantics: `PUT` for full replace, `PATCH` for partial update (pointer fields, only send what changes)
- **Status workflow** — `pending` → `in_progress` → `done` with one-click toggle
- **Filter by status** — `GET /api/tasks?status=pending`
- **Error handling middleware** — panic recovery, structured JSON error responses, request logging
- **Environment config** — `.env` via `godotenv`, with safe fallbacks
- **Dark glassmorphism UI** — Space Grotesk + JetBrains Mono, neon violet accent, animated progress ring
- **Zero-config database** — SQLite with GORM AutoMigrate (no SQL scripts, no setup)

---

## Project Structure

```
.
├── backend/                        # Go REST API
│   ├── cmd/
│   │   └── main.go                 # Entry point, router setup
│   ├── config/
│   │   └── config.go               # .env loader
│   ├── internal/
│   │   ├── database/
│   │   │   └── database.go         # GORM + SQLite init
│   │   ├── handlers/
│   │   │   └── task_handler.go     # All 5 REST handlers
│   │   ├── middleware/
│   │   │   └── middleware.go       # CORS, logger, error recovery
│   │   └── models/
│   │       └── task.go             # Task struct + request types
│   ├── .env
│   └── go.mod
│
└── frontend/                       # React app
    ├── src/
    │   ├── api/
    │   │   └── tasks.js            # All API calls in one module
    │   ├── components/
    │   │   ├── AddTaskForm.jsx      # POST — expandable form
    │   │   ├── EditModal.jsx        # PUT — full replace modal
    │   │   ├── TaskCard.jsx         # PATCH toggle + DELETE
    │   │   ├── FilterBar.jsx        # Status filter with counts
    │   │   └── StatusBadge.jsx      # Pending / In Progress / Done pill
    │   ├── hooks/
    │   │   └── useTasks.js          # State management + API wiring
    │   └── App.jsx
    ├── public/index.html
    ├── tailwind.config.js
    └── package.json
```

---

## Getting Started

### Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Go | 1.22+ | [go.dev/dl](https://go.dev/dl/) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org/) |
| GCC | any | Required by SQLite driver |

**Install GCC:**
- macOS: `xcode-select --install`
- Ubuntu/Debian: `sudo apt install gcc`
- Windows: [TDM-GCC](https://jmeubank.github.io/tdm-gcc/)

---

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/void-tasks.git
cd void-tasks
```

### 2. Run the backend

```bash
cd backend
go mod tidy          # install dependencies
go run cmd/main.go   # starts on http://localhost:8080
```

You should see:
```
Database connected and migrated successfully
🚀 Server running on http://localhost:8080
```

### 3. Run the frontend

Open a new terminal:

```bash
cd frontend
npm install          # install dependencies
npm start            # starts on http://localhost:3000
```

The `"proxy": "http://localhost:8080"` in `package.json` forwards all `/api/...` calls to Go — no CORS issues in development.

---

## API Reference

Base URL: `http://localhost:8080/api`

All responses follow this envelope:

```json
{
  "success": true,
  "message": "task created successfully",
  "data": { ... }
}
```

### Task schema

```json
{
  "id": 1,
  "title": "Build the Go API",
  "note": "5 endpoints with GORM + SQLite",
  "status": "in_progress",
  "created_at": "2026-05-25T10:00:00Z",
  "updated_at": "2026-05-25T11:30:00Z"
}
```

Status values: `pending` · `in_progress` · `done`

---

### GET `/api/tasks`

Fetch all tasks. Filter by status with a query param.

```bash
curl http://localhost:8080/api/tasks
curl http://localhost:8080/api/tasks?status=pending
```

---

### GET `/api/tasks/:id`

Fetch a single task by ID.

```bash
curl http://localhost:8080/api/tasks/1
```

---

### POST `/api/tasks`

Create a new task. Status defaults to `pending`.

```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Build the Go API", "note": "5 endpoints"}'
```

---

### PUT `/api/tasks/:id`

Fully replace a task. All fields are required.

```bash
curl -X PUT http://localhost:8080/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Build the Go API", "note": "Done!", "status": "done"}'
```

---

### PATCH `/api/tasks/:id`

Partially update a task. Only include the fields you want to change.

```bash
# Toggle status only
curl -X PATCH http://localhost:8080/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "in_progress"}'
```

---

### DELETE `/api/tasks/:id`

Permanently delete a task.

```bash
curl -X DELETE http://localhost:8080/api/tasks/1
```

---

## Environment Variables

Located in `backend/.env`:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8080` | Port the server listens on |
| `GIN_MODE` | `debug` | `debug` or `release` |
| `DB_PATH` | `./tasks.db` | Path to SQLite database file |

---

## Tech Stack

### Backend
| Package | Purpose |
|---------|---------|
| [gin-gonic/gin](https://github.com/gin-gonic/gin) | HTTP router and framework |
| [gorm.io/gorm](https://gorm.io/) | ORM for database access |
| [gorm.io/driver/sqlite](https://github.com/go-gorm/sqlite) | SQLite driver for GORM |
| [joho/godotenv](https://github.com/joho/godotenv) | Load `.env` files |

### Frontend
| Package | Purpose |
|---------|---------|
| React 18 | UI framework |
| Tailwind CSS | Utility-first styling |
| Space Grotesk | Display font |
| JetBrains Mono | Monospace font for labels |

---

## PUT vs PATCH — what's the difference?

A common interview question. This project implements both correctly:

**PUT** is a full replace — you must send the entire resource. Missing fields are set to their zero value. Used in the Edit Modal where all fields are shown and required.

**PATCH** is a partial update — you only send the fields you want to change. In Go this is implemented with pointer fields (`*string`, `*Status`) so you can distinguish between "field not provided" (`nil`) and "field set to empty string" (`""`). Used for the one-click status toggle — only `status` is sent.

---

## Possible Extensions

- [ ] JWT authentication — protect all `/api/tasks` routes
- [ ] PostgreSQL — swap the GORM driver, no handler changes needed
- [ ] Docker — `Dockerfile` + `docker-compose.yml` for one-command setup
- [ ] Due dates — add `due_at` to the Task model and filter by overdue
- [ ] Task categories / labels
- [ ] Deploy to [Railway](https://railway.app/) or [Fly.io](https://fly.io/)

---

## License

MIT
