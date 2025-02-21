package models

import (
	"time"

	"gorm.io/gorm"
)

type Order struct {
	gorm.Model
	CustomerID    uint      `gorm:"not null"`
	AddressID     uint      `gorm:"not null"`
	UserID        uint      `gorm:"not null"`
	TotalAmount   float64   `gorm:"type:decimal(10,2);not null"`
	Status        string    `gorm:"not null"`
	OrderDate     time.Time `gorm:"not null"`
	PaymentStatus string    `gorm:"not null"`
	TaxAmount     float64   `gorm:"type:decimal(10,2)"`
	Currency      string    `gorm:"not null"`
	CreatedBy     uint      `gorm:"not null"`
	UpdatedBy     uint      `gorm:"not null"`

	Customer Customer `gorm:"foreignKey:CustomerID"`
	Address  Address  `gorm:"foreignKey:AddressID"`
	User     User     `gorm:"foreignKey:UserID"`
}
