package models

type PurchaseOrderItem struct {
	POItemID  uint    `gorm:"primaryKey;column:po_item_id"`
	POID      uint    `gorm:"not null"`
	ProductID uint    `gorm:"not null"`
	Quantity  int     `gorm:"not null"`
	UnitCost  float64 `gorm:"type:decimal(10,2);not null"`

	// Relationships
	PurchaseOrder PurchaseOrder `gorm:"foreignKey:POID"`
	Product       Product       `gorm:"foreignKey:ProductID"`
}
