package middleware

import (
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// APIResponse is the standard envelope for all responses
type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// Success sends a 200-level JSON response
func Success(c *gin.Context, status int, message string, data interface{}) {
	c.JSON(status, APIResponse{
		Success: true,
		Message: message,
		Data:    data,
	})
}

// Fail sends an error JSON response
func Fail(c *gin.Context, status int, errMsg string) {
	c.JSON(status, APIResponse{
		Success: false,
		Error:   errMsg,
	})
}

// ErrorHandler is a global recovery middleware that catches panics
func ErrorHandler() gin.HandlerFunc {
	return gin.CustomRecovery(func(c *gin.Context, recovered interface{}) {
		log.Printf("PANIC recovered: %v", recovered)
		Fail(c, http.StatusInternalServerError, "an unexpected error occurred")
		c.Abort()
	})
}

// Logger logs method, path, status, and latency for every request
func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		c.Next()
		latency := time.Since(start)
		log.Printf("[%s] %s | %d | %v",
			c.Request.Method,
			c.Request.URL.Path,
			c.Writer.Status(),
			latency,
		)
	}
}

// CORS sets the necessary headers to allow cross-origin requests
func CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get allowed origins from environment or use wildcard for development
		allowedOrigins := os.Getenv("ALLOWED_ORIGINS")
		if allowedOrigins == "" {
			allowedOrigins = "*"
		}

		origin := c.Request.Header.Get("Origin")
		if allowedOrigins == "*" {
			c.Header("Access-Control-Allow-Origin", "*")
		} else {
			// Check if origin is in allowed list
			allowedList := strings.Split(allowedOrigins, ",")
			for _, allowed := range allowedList {
				if strings.TrimSpace(allowed) == origin {
					c.Header("Access-Control-Allow-Origin", origin)
					break
				}
			}
		}

		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}
