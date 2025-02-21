package models

type OrderItem struct {
	OrderItemID uint    `gorm:"primaryKey;column:order_item_id"`
	OrderID     uint    `gorm:"not null"`
	ProductID   uint    `gorm:"not null"`
	Quantity    int     `gorm:"not null"`
	UnitPrice   float64 `gorm:"type:decimal(10,2);not null"`
	Discount    float64 `gorm:"type:decimal(10,2)"`
	Status      string  `gorm:"not null"`

	// Relationships
	Order   Order   `gorm:"foreignKey:OrderID"`
	Product Product `gorm:"foreignKey:ProductID"`
}
