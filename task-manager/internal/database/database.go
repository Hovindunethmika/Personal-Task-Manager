package database

import (
	"log"

	"github.com/yourusername/task-manager/internal/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func Init(dbPath string) *gorm.DB {
	var err error
	DB, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	// Auto-migrate creates/updates the tasks table
	if err := DB.AutoMigrate(&models.Task{}); err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}

	log.Println("Database connected and migrated successfully")
	return DB
}
