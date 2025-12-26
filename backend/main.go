package main

import (
	"fmt"
	"katanaid/handlers"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func main() {
	// Initialize router
	r := chi.NewRouter()

	// Register health endpoint
	r.Get("/health", handlers.Health)

	// Start server
	fmt.Println("Server is running on port 8080")
	http.ListenAndServe(":8080", r)
}
