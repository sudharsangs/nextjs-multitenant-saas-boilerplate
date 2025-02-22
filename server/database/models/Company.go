package models

import (
	"gorm.io/gorm"
)

type Company struct {
	gorm.Model
	Name      string `gorm:"not null"`
	Email     string `gorm:"uniqueIndex;not null"`
	Phone     string `gorm:"uniqueIndex"`
	AddressID uint
	GSTIN     string `gorm:"uniqueIndex"`
	PAN       string `gorm:"uniqueIndex"`
	IsActive  bool   `gorm:"default:true"`
	POCID     uint   `gorm:"not null"`

	Address Address `gorm:"foreignKey:AddressID"`
	POC     User    `gorm:"foreignKey:POCID"`
}
