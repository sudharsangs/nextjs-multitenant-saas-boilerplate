package models

import (
	"time"

	"gorm.io/gorm"
)

type PaymentMethod struct {
	gorm.Model
	CustomerID uint   `gorm:"not null"`
	Type       string `gorm:"not null"`
	Details    string `gorm:"not null"`
	IsDefault  bool   `gorm:"default:false"`
	ExpiryDate time.Time

	Customer Customer `gorm:"foreignKey:CustomerID"`
}
