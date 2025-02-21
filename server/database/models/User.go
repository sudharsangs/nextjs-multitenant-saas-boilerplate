package models

import (
	"time"

	"gorm.io/gorm"
)

// User : User Model
type User struct {
	gorm.Model
	Email        string         `json:"email" gorm:"uniqueIndex;not null"`
	Username     string         `json:"username" gorm:"uniqueIndex;not null"`
	PasswordHash string         `json:"-" gorm:"not null"`
	FirstName    string         `json:"first_name"`
	LastName     string         `json:"last_name"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `json:"-" gorm:"index"`
}
