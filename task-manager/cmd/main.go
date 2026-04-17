package main

import (
	"log"
	"net/http"

	"github.com/Hovindunethmika/task-manager/config"
	"github.com/Hovindunethmika/task-manager/internal/database"
	"github.com/Hovindunethmika/task-manager/internal/handlers"
	"github.com/Hovindunethmika/task-manager/internal/middleware"
	"github.com/gin-gonic/gin"
)

func main() {
	// Load config from .env
	cfg := config.Load()

	// Set Gin mode
	gin.SetMode(cfg.GinMode)

	// Connect & migrate DB
	db := database.Init(cfg.DBPath)

	// Create handler
	taskHandler := handlers.NewTaskHandler(db)

	// Setup router
	r := gin.New()
	r.Use(middleware.ErrorHandler())
	r.Use(middleware.Logger())
	r.Use(middleware.CORS())

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// API routes
	api := r.Group("/api")
	{
		tasks := api.Group("/tasks")
		{
			tasks.GET("", taskHandler.GetAll)        // GET    /api/tasks
			tasks.GET("/:id", taskHandler.GetByID)   // GET    /api/tasks/:id
			tasks.POST("", taskHandler.Create)       // POST   /api/tasks
			tasks.PUT("/:id", taskHandler.Update)    // PUT    /api/tasks/:id
			tasks.PATCH("/:id", taskHandler.Patch)   // PATCH  /api/tasks/:id
			tasks.DELETE("/:id", taskHandler.Delete) // DELETE /api/tasks/:id
		}
	}

	log.Printf("🚀 Server running on http://localhost:%s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
