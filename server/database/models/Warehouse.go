package models

import "gorm.io/gorm"

type Warehouse struct {
	gorm.Model
	CompanyID   uint   `gorm:"not null"`
	Name        string `gorm:"not null"`
	AddressID   string `gorm:"not null"`
	ContactInfo string
	IsActive    bool `gorm:"default:true"`

	Address Address `gorm:"foreignKey:AddressID"`
	Company Company `gorm:"foreignKey:CompanyID"`
}
