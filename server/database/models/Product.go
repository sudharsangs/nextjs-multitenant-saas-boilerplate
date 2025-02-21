package models

type Product struct {
	ProductID     uint    `gorm:"primaryKey;column:product_id"`
	CategoryID    uint    `gorm:"not null"`
	Name          string  `gorm:"not null"`
	SKU           string  `gorm:"uniqueIndex;not null"`
	BasePrice     float64 `gorm:"type:decimal(10,2);not null"`
	Description   string
	Active        bool    `gorm:"default:true"`
	MinStockLevel float64 `gorm:"type:decimal(10,2)"`
	CreatedBy     uint    `gorm:"not null"`
	UpdatedBy     uint    `gorm:"not null"`

	// Relationships
	Category       ProductCategory     `gorm:"foreignKey:CategoryID"`
	InventoryItems []InventoryItem     `gorm:"foreignKey:ProductID"`
	OrderItems     []OrderItem         `gorm:"foreignKey:ProductID"`
	POItems        []PurchaseOrderItem `gorm:"foreignKey:ProductID"`
}
