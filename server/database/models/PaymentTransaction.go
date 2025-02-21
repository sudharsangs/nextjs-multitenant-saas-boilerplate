package models

import (
	"time"

	"gorm.io/gorm"
)

type PaymentTransaction struct {
	gorm.Model
	OrderID         uint      `gorm:"not null;uniqueIndex"` // One-to-one relationship with Order
	Amount          float64   `gorm:"type:decimal(10,2);not null"`
	PaymentMethodID string    `gorm:"not null"`
	TransactionDate time.Time `gorm:"not null"`
	Status          string    `gorm:"not null"`

	Order Order `gorm:"foreignKey:OrderID"`
}
