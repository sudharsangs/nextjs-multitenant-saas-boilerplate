package models

import "time"

type InventoryItem struct {
	InventoryID uint `gorm:"primaryKey;column:inventory_id"`
	ProductID   uint `gorm:"not null"`
	WarehouseID uint `gorm:"not null"`
	Quantity    int  `gorm:"not null"`
	LotNumber   string
	ExpiryDate  time.Time
	Location    string
	UpdatedBy   uint `gorm:"not null"`

	// Relationships
	Product   Product   `gorm:"foreignKey:ProductID"`
	Warehouse Warehouse `gorm:"foreignKey:WarehouseID"`
}
