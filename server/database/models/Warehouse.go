package models

type Warehouse struct {
	WarehouseID uint   `gorm:"primaryKey;column:warehouse_id"`
	Name        string `gorm:"not null"`
	Address     string `gorm:"not null"`
	ContactInfo string
	IsActive    bool `gorm:"default:true"`

	// Relationships
	InventoryItems []InventoryItem `gorm:"foreignKey:WarehouseID"`
}
