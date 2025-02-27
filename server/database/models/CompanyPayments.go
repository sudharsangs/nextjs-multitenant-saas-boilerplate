package models

import (
	"time"

	"gorm.io/gorm"
)

type CompanyPayments struct {
	gorm.Model
	CompanyID     uint    `gorm:"not null"`
	Amount        float64 `gorm:"not null"`
	Remarks       string
	ValidUpto     time.Time `gorm:"not null"`
	PaymentDate   time.Time `gorm:"not null"`
	PaymentMethod string    `gorm:"type:varchar(100)"`
}
