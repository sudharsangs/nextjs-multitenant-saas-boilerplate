package models

import "gorm.io/gorm"

type Product struct {
	gorm.Model
	CategoryID    uint    `gorm:"not null"`
	Name          string  `gorm:"not null"`
	SKU           string  `gorm:"uniqueIndex;not null"`
	BasePrice     float64 `gorm:"type:decimal(10,2);not null"`
	Description   string
	Active        bool    `gorm:"default:true"`
	MinStockLevel float64 `gorm:"type:decimal(10,2)"`
	CreatedBy     uint    `gorm:"not null"`
	UpdatedBy     uint    `gorm:"not null"`

	Category ProductCategory `gorm:"foreignKey:CategoryID"`
}
