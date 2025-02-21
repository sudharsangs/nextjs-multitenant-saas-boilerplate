package models

import "time"

type Shipment struct {
	ShipmentID     uint `gorm:"primaryKey;column:shipment_id"`
	OrderID        uint `gorm:"not null"`
	TrackingNumber string
	Carrier        string `gorm:"not null"`
	ShipDate       time.Time
	Status         string  `gorm:"not null"`
	ShippingCost   float64 `gorm:"type:decimal(10,2)"`
	CreatedBy      uint    `gorm:"not null"`

	// Relationships
	Order Order `gorm:"foreignKey:OrderID"`
}
