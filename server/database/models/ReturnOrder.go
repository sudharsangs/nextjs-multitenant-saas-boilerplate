package models

import (
	"time"

	"gorm.io/gorm"
)

type ReturnOrder struct {
	gorm.Model
	OrderID      uint      `gorm:"not null"`
	RMANumber    string    `gorm:"uniqueIndex;not null"`
	Reason       string    `gorm:"not null"`
	Status       string    `gorm:"not null"`
	CreatedAt    time.Time `gorm:"not null"`
	RefundAmount float64   `gorm:"type:decimal(10,2)"`
	ApprovedBy   uint      `gorm:"not null"`

	Order Order `gorm:"foreignKey:OrderID"`
}
