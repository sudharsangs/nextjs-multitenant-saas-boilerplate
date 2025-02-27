package models

import (
	"gorm.io/gorm"
)

// User : User Model
type User struct {
	gorm.Model
	Email        string `json:"email" gorm:"uniqueIndex;not null"`
	Username     string `json:"username" gorm:"uniqueIndex;not null"`
	Phone        string `json:"phone" gorm:"uniqueIndex"`
	PasswordHash string `json:"-" gorm:"not null"`
	FirstName    string `json:"first_name"`
	LastName     string `json:"last_name"`
}
