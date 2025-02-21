package models

import "gorm.io/gorm"

type PurchaseOrderItem struct {
	gorm.Model
	POID      uint    `gorm:"not null"`
	ProductID uint    `gorm:"not null"`
	Quantity  int     `gorm:"not null"`
	UnitCost  float64 `gorm:"type:decimal(10,2);not null"`

	PurchaseOrder PurchaseOrder `gorm:"foreignKey:POID"`
	Product       Product       `gorm:"foreignKey:ProductID"`
}
