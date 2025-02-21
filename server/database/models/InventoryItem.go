package models

import (
	"time"

	"gorm.io/gorm"
)

type InventoryItem struct {
	gorm.Model
	ProductID   uint `gorm:"not null"`
	WarehouseID uint `gorm:"not null"`
	Quantity    int  `gorm:"not null"`
	LotNumber   string
	ExpiryDate  time.Time
	Location    string
	UpdatedBy   uint `gorm:"not null"`

	Product   Product   `gorm:"foreignKey:ProductID"`
	Warehouse Warehouse `gorm:"foreignKey:WarehouseID"`
}
