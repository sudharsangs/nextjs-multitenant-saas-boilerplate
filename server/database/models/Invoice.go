package models

import "time"

type Invoice struct {
	InvoiceID     uint      `gorm:"primaryKey;column:invoice_id"`
	OrderID       uint      `gorm:"not null"`
	InvoiceNumber string    `gorm:"uniqueIndex;not null"`
	InvoiceDate   time.Time `gorm:"not null"`
	DueDate       time.Time `gorm:"not null"`
	TotalAmount   float64   `gorm:"type:decimal(10,2);not null"`
	TaxAmount     float64   `gorm:"type:decimal(10,2)"`
	Status        string    `gorm:"not null"`
	PaymentStatus string    `gorm:"not null"`
	CreatedBy     uint      `gorm:"not null"`

	// Relationships
	Order        Order         `gorm:"foreignKey:OrderID"`
	InvoiceItems []InvoiceItem `gorm:"foreignKey:InvoiceID"`
}
