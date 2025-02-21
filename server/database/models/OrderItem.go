package models

import "gorm.io/gorm"

type OrderItem struct {
	gorm.Model
	OrderID   uint    `gorm:"not null"`
	ProductID uint    `gorm:"not null"`
	Quantity  int     `gorm:"not null"`
	UnitPrice float64 `gorm:"type:decimal(10,2);not null"`
	Discount  float64 `gorm:"type:decimal(10,2)"`
	Status    string  `gorm:"not null"`

	Order   Order   `gorm:"foreignKey:OrderID"`
	Product Product `gorm:"foreignKey:ProductID"`
}
