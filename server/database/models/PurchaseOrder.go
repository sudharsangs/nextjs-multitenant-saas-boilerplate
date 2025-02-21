package models

import "time"

type PurchaseOrder struct {
	POID             uint      `gorm:"primaryKey;column:po_id"`
	SupplierID       uint      `gorm:"not null"`
	OrderDate        time.Time `gorm:"not null"`
	Status           string    `gorm:"not null"`
	TotalAmount      float64   `gorm:"type:decimal(10,2);not null"`
	ExpectedDelivery time.Time
	CreatedBy        uint `gorm:"not null"`
	ApprovedBy       uint `gorm:"not null"`

	// Relationships
	Supplier           Supplier            `gorm:"foreignKey:SupplierID"`
	PurchaseOrderItems []PurchaseOrderItem `gorm:"foreignKey:POID"`
}
