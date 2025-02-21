package models

import (
	"time"

	"gorm.io/gorm"
)

type PurchaseOrder struct {
	gorm.Model
	SupplierID       uint      `gorm:"not null"`
	OrderDate        time.Time `gorm:"not null"`
	Status           string    `gorm:"not null"`
	TotalAmount      float64   `gorm:"type:decimal(10,2);not null"`
	ExpectedDelivery time.Time
	CreatedBy        uint `gorm:"not null"`
	ApprovedBy       uint `gorm:"not null"`

	Supplier Supplier `gorm:"foreignKey:SupplierID"`
}
