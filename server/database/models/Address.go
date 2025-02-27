package models

import "gorm.io/gorm"

type Address struct {
	gorm.Model
	AddressLine1 string `gorm:"not null"`
	AddressLine2 string
	City         string `gorm:"not null"`
	State        string `gorm:"not null"`
	Country      string `gorm:"not null"`
	PostalCode   string `gorm:"not null"`
	IsDefault    bool   `gorm:"default:false"`
	CreatedBy    uint   `gorm:"not null"`

	User User `gorm:"foreignKey:CreatedBy"`
}
