package models

import (
	"encoding/json"
	"time"

	"gorm.io/gorm"
)

type AuditLog struct {
	gorm.Model
	UserID     uint            `gorm:"not null"`
	Action     string          `gorm:"not null"`
	EntityType string          `gorm:"not null"`
	EntityID   uint            `gorm:"not null"`
	OldValues  json.RawMessage `gorm:"type:json"`
	NewValues  json.RawMessage `gorm:"type:json"`
	Timestamp  time.Time       `gorm:"not null"`
	IPAddress  string          `gorm:"not null"`

	User User `gorm:"foreignKey:UserID"`
}
