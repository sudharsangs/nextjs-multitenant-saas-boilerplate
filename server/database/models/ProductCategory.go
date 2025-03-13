package models

import "gorm.io/gorm"

type ProductCategory struct {
	gorm.Model
	CompanyID   uint   `gorm:"not null"`
	Name        string `gorm:"uniqueIndex;not null"`
	Description string
	Active      bool `gorm:"default:true"`
	ParentID    *uint

	Parent   *ProductCategory  `gorm:"foreignKey:ParentID"`
	Children []ProductCategory `gorm:"foreignKey:ParentID"`
	Company  Company           `gorm:"foreignKey:CompanyID"`
}
