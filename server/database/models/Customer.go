package models

import "time"

type Customer struct {
	CustomerID  uint   `gorm:"primaryKey;column:customer_id"`
	Name        string `gorm:"not null"`
	Email       string `gorm:"uniqueIndex;not null"`
	Phone       string
	CreditLimit float64   `gorm:"type:decimal(10,2)"`
	CreatedAt   time.Time `gorm:"not null"`
	IsActive    bool      `gorm:"default:true"`
	CreatedBy   uint      `gorm:"not null"`
	UpdatedBy   uint      `gorm:"not null"`

	// Relationships
	Orders         []Order         `gorm:"foreignKey:CustomerID"`
	Addresses      []Address       `gorm:"foreignKey:CustomerID"`
	PaymentMethods []PaymentMethod `gorm:"foreignKey:CustomerID"`
}
