package models

import (
	"time"
)

type Status string

const (
	StatusPending    Status = "pending"
	StatusInProgress Status = "in_progress"
	StatusDone       Status = "done"
)

type Task struct {
	ID        uint      `json:"id"         gorm:"primaryKey;autoIncrement"`
	Title     string    `json:"title"      gorm:"not null"`
	Note      string    `json:"note"`
	Status    Status    `json:"status"     gorm:"default:'pending'"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// CreateTaskRequest is the payload for POST /tasks
type CreateTaskRequest struct {
	Title string `json:"title" binding:"required,min=1,max=255"`
	Note  string `json:"note"`
}

// UpdateTaskRequest is the payload for PUT /tasks/:id (full replace)
type UpdateTaskRequest struct {
	Title  string `json:"title"  binding:"required,min=1,max=255"`
	Note   string `json:"note"`
	Status Status `json:"status" binding:"required,oneof=pending in_progress done"`
}

// PatchTaskRequest is the payload for PATCH /tasks/:id (partial update)
type PatchTaskRequest struct {
	Title  *string `json:"title"`
	Note   *string `json:"note"`
	Status *Status `json:"status"`
}
