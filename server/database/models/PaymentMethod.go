package models

import "time"

type PaymentMethod struct {
	PaymentMethodID uint   `gorm:"primaryKey;column:payment_method_id"`
	CustomerID      uint   `gorm:"not null"`
	Type            string `gorm:"not null"`
	Details         string `gorm:"not null"`
	IsDefault       bool   `gorm:"default:false"`
	ExpiryDate      time.Time

	// Relationships
	Customer Customer `gorm:"foreignKey:CustomerID"`
}
