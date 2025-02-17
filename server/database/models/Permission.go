package models

import (
	"time"

	"gorm.io/gorm"
)

type Permission struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	Name        string         `json:"name" gorm:"uniqueIndex;not null"`
	Resource    string         `json:"resource" gorm:"not null"` // e.g., "orders", "customers"
	Action      string         `json:"action" gorm:"not null"`   // e.g., "create", "read", "update", "delete"
	Description string         `json:"description"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}
