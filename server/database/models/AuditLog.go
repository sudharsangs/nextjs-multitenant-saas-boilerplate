package models

import (
	"encoding/json"
	"time"
)

type AuditLog struct {
	AuditID    uint            `gorm:"primaryKey;column:audit_id"`
	UserID     uint            `gorm:"not null"`
	Action     string          `gorm:"not null"`
	EntityType string          `gorm:"not null"`
	EntityID   uint            `gorm:"not null"`
	OldValues  json.RawMessage `gorm:"type:json"`
	NewValues  json.RawMessage `gorm:"type:json"`
	Timestamp  time.Time       `gorm:"not null"`
	IPAddress  string          `gorm:"not null"`

	// Relationships
	User User `gorm:"foreignKey:UserID"`
}
