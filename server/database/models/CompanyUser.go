package models

import (
	"gorm.io/gorm"
)

type CompanyUser struct {
	gorm.Model
	CompanyID uint `gorm:"not null"`
	UserID    uint `gorm:"not null"`
}
