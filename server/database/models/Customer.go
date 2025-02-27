package models

import (
	"time"

	"gorm.io/gorm"
)

type Customer struct {
	gorm.Model
	Name        string `gorm:"not null"`
	Email       string `gorm:"uniqueIndex;not null"`
	CompanyID   uint   `gorm:"not null"`
	AddressID   uint
	Phone       string
	CreditLimit float64   `gorm:"type:decimal(10,2)"`
	CreatedAt   time.Time `gorm:"not null"`
	IsActive    bool      `gorm:"default:true"`
	CreatedBy   uint      `gorm:"not null"`
	UpdatedBy   uint      `gorm:"not null"`
	DeletedBy   uint

	Address Address `gorm:"foreignKey:AddressID"`
	Company Company `gorm:"foreignKey:CompanyID"`
	User    User    `gorm:"foreignKey:CreatedBy"`
}
