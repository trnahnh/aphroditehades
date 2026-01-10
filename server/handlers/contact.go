package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"regexp"
	"strings"

	"katanaid/database"
	"katanaid/models"
	"katanaid/util"
)

type ContactRequest struct {
	Email  string `json:"email"`
	Reason string `json:"reason"`
}

type ContactResponse struct {
	Message string `json:"message"`
}

var contactEmailRegex = regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`)

func Contact(w http.ResponseWriter, r *http.Request) {
	var req ContactRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		log.Print("Error decoding JSON:", err)
		util.WriteJSON(w, http.StatusBadRequest, models.ErrorResponse{Error: "Invalid JSON"})
		return
	}

	email := strings.ToLower(strings.TrimSpace(req.Email))
	reason := strings.TrimSpace(req.Reason)

	if email == "" || reason == "" {
		log.Print("Missing required fields")
		util.WriteJSON(w, http.StatusBadRequest, models.ErrorResponse{Error: "Email and reason are required"})
		return
	}

	if !contactEmailRegex.MatchString(email) {
		log.Print("Invalid email format")
		util.WriteJSON(w, http.StatusBadRequest, models.ErrorResponse{Error: "Invalid email format"})
		return
	}

	if len(reason) < 10 {
		log.Print("Reason too short")
		util.WriteJSON(w, http.StatusBadRequest, models.ErrorResponse{Error: "Please provide more details (at least 10 characters)"})
		return
	}

	if len(reason) > 2000 {
		log.Print("Reason too long")
		util.WriteJSON(w, http.StatusBadRequest, models.ErrorResponse{Error: "Message too long (max 2000 characters)"})
		return
	}

	_, err = database.DB.Exec(
		context.Background(),
		"INSERT INTO contacts (email, reason) VALUES ($1, $2)",
		email,
		reason,
	)

	if err != nil {
		log.Print("Error saving contact:", err)
		util.WriteJSON(w, http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to submit contact"})
		return
	}

	log.Printf("New contact submission from: %s", email)

	util.WriteJSON(w, http.StatusCreated, ContactResponse{
		Message: "Thank you for contacting us! We'll get back to you soon.",
	})
}
