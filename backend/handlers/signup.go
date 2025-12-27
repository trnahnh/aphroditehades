package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"katanaid/database"

	"golang.org/x/crypto/bcrypt"
)

// Signup Request is the expected JSON body
type SignupRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Signup handles POST /signup requests
func Signup(w http.ResponseWriter, r *http.Request) {
	var req SignupRequest

	// Decode JSON body
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, `{"error": "Invalid JSON"}`, http.StatusBadRequest)
		return
	}

	// Validate input
	if req.Username == "" || req.Email == "" || req.Password == "" {
		http.Error(w, `{"error": "Username, email, and password are required"}`, http.StatusBadRequest)
		return
	}

	if len(req.Username) < 3 {
		http.Error(w, `{"error": "Username must be at least 3 characters"}`, http.StatusBadRequest)
		return
	}

	if len(req.Password) < 8 {
		http.Error(w, `{"error": "Password must be at least 8 characters"}`, http.StatusBadRequest)
		return
	}

	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, `{"error": "Failed to hash password"}`, http.StatusInternalServerError)
		return
	}

	// Insert user into database
	_, err = database.DB.Exec(
		context.Background(),
		"INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)",
		strings.ToLower(req.Username),
		strings.ToLower(req.Email),
		string(hashedPassword),
	)

	if err != nil {
		// Check for duplicate errors
		if strings.Contains(err.Error(), "duplicate") {
			if strings.Contains(err.Error(), "username") {
				http.Error(w, `{"error": "Username already exists"}`, http.StatusConflict)
				return
			}
			http.Error(w, `{"error": "Email already exists"}`, http.StatusConflict)
			return
		}
		http.Error(w, `{"error": "Failed to create user"}`, http.StatusInternalServerError)
		return
	}

	// Return success response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "User created successfully",
	})
}
