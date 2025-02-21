package models

import (
	"time"

	"gorm.io/gorm"
)

type Shipment struct {
	gorm.Model
	OrderID        uint `gorm:"not null"`
	TrackingNumber string
	Carrier        string `gorm:"not null"`
	ShipDate       time.Time
	Status         string  `gorm:"not null"`
	ShippingCost   float64 `gorm:"type:decimal(10,2)"`
	CreatedBy      uint    `gorm:"not null"`

	Order Order `gorm:"foreignKey:OrderID"`
}
