package models

import "gorm.io/gorm"

type InvoiceItem struct {
	gorm.Model
	InvoiceID uint    `gorm:"not null"`
	ProductID uint    `gorm:"not null"`
	Quantity  int     `gorm:"not null"`
	UnitPrice float64 `gorm:"type:decimal(10,2);not null"`
	Discount  float64 `gorm:"type:decimal(10,2)"`
	TaxRate   float64 `gorm:"type:decimal(5,2)"`
	LineTotal float64 `gorm:"type:decimal(10,2)"`

	Invoice Invoice `gorm:"foreignKey:InvoiceID"`
	Product Product `gorm:"foreignKey:ProductID"`
}
