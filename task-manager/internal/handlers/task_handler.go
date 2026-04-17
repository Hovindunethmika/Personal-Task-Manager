package handlers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/Hovindunethmika/task-manager/internal/middleware"
	"github.com/Hovindunethmika/task-manager/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type TaskHandler struct {
	db *gorm.DB
}

func NewTaskHandler(db *gorm.DB) *TaskHandler {
	return &TaskHandler{db: db}
}

// GET /api/tasks
// Returns all tasks, optionally filtered by ?status=pending|in_progress|done
func (h *TaskHandler) GetAll(c *gin.Context) {
	var tasks []models.Task
	query := h.db

	if status := c.Query("status"); status != "" {
		query = query.Where("status = ?", status)
	}

	if err := query.Order("created_at desc").Find(&tasks).Error; err != nil {
		middleware.Fail(c, http.StatusInternalServerError, "failed to fetch tasks")
		return
	}

	middleware.Success(c, http.StatusOK, "tasks fetched successfully", tasks)
}

// GET /api/tasks/:id
// Returns a single task by ID
func (h *TaskHandler) GetByID(c *gin.Context) {
	task, err := h.findTask(c)
	if err != nil {
		return
	}
	middleware.Success(c, http.StatusOK, "task fetched successfully", task)
}

// POST /api/tasks
// Creates a new task
func (h *TaskHandler) Create(c *gin.Context) {
	var req models.CreateTaskRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		middleware.Fail(c, http.StatusBadRequest, err.Error())
		return
	}

	task := models.Task{
		Title:  req.Title,
		Note:   req.Note,
		Status: models.StatusPending,
	}

	if err := h.db.Create(&task).Error; err != nil {
		middleware.Fail(c, http.StatusInternalServerError, "failed to create task")
		return
	}

	middleware.Success(c, http.StatusCreated, "task created successfully", task)
}

// PUT /api/tasks/:id
// Fully replaces a task (title, note, and status are all required)
func (h *TaskHandler) Update(c *gin.Context) {
	task, err := h.findTask(c)
	if err != nil {
		return
	}

	var req models.UpdateTaskRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		middleware.Fail(c, http.StatusBadRequest, err.Error())
		return
	}

	task.Title = req.Title
	task.Note = req.Note
	task.Status = req.Status

	if err := h.db.Save(&task).Error; err != nil {
		middleware.Fail(c, http.StatusInternalServerError, "failed to update task")
		return
	}

	middleware.Success(c, http.StatusOK, "task updated successfully", task)
}

// PATCH /api/tasks/:id
// Partially updates a task (only provided fields are changed)
func (h *TaskHandler) Patch(c *gin.Context) {
	task, err := h.findTask(c)
	if err != nil {
		return
	}

	var req models.PatchTaskRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		middleware.Fail(c, http.StatusBadRequest, err.Error())
		return
	}

	// Build a map of only the fields that were provided
	updates := map[string]interface{}{}
	if req.Title != nil {
		updates["title"] = *req.Title
	}
	if req.Note != nil {
		updates["note"] = *req.Note
	}
	if req.Status != nil {
		updates["status"] = *req.Status
	}

	if len(updates) == 0 {
		middleware.Fail(c, http.StatusBadRequest, "no fields provided to update")
		return
	}

	if err := h.db.Model(&task).Updates(updates).Error; err != nil {
		middleware.Fail(c, http.StatusInternalServerError, "failed to patch task")
		return
	}

	middleware.Success(c, http.StatusOK, "task patched successfully", task)
}

// DELETE /api/tasks/:id
// Permanently deletes a task
func (h *TaskHandler) Delete(c *gin.Context) {
	task, err := h.findTask(c)
	if err != nil {
		return
	}

	if err := h.db.Delete(&task).Error; err != nil {
		middleware.Fail(c, http.StatusInternalServerError, "failed to delete task")
		return
	}

	middleware.Success(c, http.StatusOK, "task deleted successfully", nil)
}

// --- helper ---

func (h *TaskHandler) findTask(c *gin.Context) (*models.Task, error) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		middleware.Fail(c, http.StatusBadRequest, "invalid task id")
		return nil, err
	}

	var task models.Task
	if err := h.db.First(&task, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			middleware.Fail(c, http.StatusNotFound, "task not found")
		} else {
			middleware.Fail(c, http.StatusInternalServerError, "database error")
		}
		return nil, err
	}

	return &task, nil
}
