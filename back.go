// main.go
package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

type CourseRequest struct {
	Title string `json:"title"`
	Level string `json:"level"`
}

func main() {
	r := gin.Default()

	// Enable CORS for your React frontend
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	r.POST("/api/generate", func(c *gin.Context) {
		var req CourseRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// LOGIC: In a real scenario, you'd call the Gemini/OpenAI API here.
		// For now, we return a mock structure.
		response := gin.H{
			"course_name": req.Title,
			"content":     "Week 1: Introduction to " + req.Title + "\nWeek 2: Core Concepts...",
			"alignment":   "Industry Standard ISO-27001",
		}

		c.JSON(http.StatusOK, response)
	})

	r.Run(":8080")
}