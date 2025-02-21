package models

import "gorm.io/gorm"

type Supplier struct {
	gorm.Model
	Name          string `gorm:"not null"`
	ContactPerson string
	Email         string `gorm:"not null"`
	Phone         string
	PaymentTerms  string
	CreatedBy     uint `gorm:"not null"`
	UpdatedBy     uint `gorm:"not null"`
}
