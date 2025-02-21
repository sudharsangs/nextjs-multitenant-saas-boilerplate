package models

import (
	"time"

	"gorm.io/gorm"
)

type Invoice struct {
	gorm.Model
	OrderID       uint      `gorm:"not null"`
	InvoiceNumber string    `gorm:"uniqueIndex;not null"`
	InvoiceDate   time.Time `gorm:"not null"`
	DueDate       time.Time `gorm:"not null"`
	TotalAmount   float64   `gorm:"type:decimal(10,2);not null"`
	TaxAmount     float64   `gorm:"type:decimal(10,2)"`
	Status        string    `gorm:"not null"`
	PaymentStatus string    `gorm:"not null"`
	CreatedBy     uint      `gorm:"not null"`

	Order Order `gorm:"foreignKey:OrderID"`
}
