package models

import "time"

type PaymentTransaction struct {
	TransactionID   uint      `gorm:"primaryKey;column:transaction_id"`
	OrderID         uint      `gorm:"not null;uniqueIndex"` // One-to-one relationship with Order
	Amount          float64   `gorm:"type:decimal(10,2);not null"`
	PaymentMethod   string    `gorm:"not null"`
	TransactionDate time.Time `gorm:"not null"`
	Status          string    `gorm:"not null"`
}
