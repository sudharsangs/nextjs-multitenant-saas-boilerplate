package models

import "gorm.io/gorm"

type ProductCategory struct {
	gorm.Model
	Name        string `gorm:"uniqueIndex;not null"`
	Description string
	Active      bool `gorm:"default:true"`
}
