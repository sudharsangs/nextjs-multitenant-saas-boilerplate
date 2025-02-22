package models

import "gorm.io/gorm"

type Address struct {
	gorm.Model
	Street     string `gorm:"not null"`
	City       string `gorm:"not null"`
	State      string `gorm:"not null"`
	Country    string `gorm:"not null"`
	PostalCode string `gorm:"not null"`
	IsDefault  bool   `gorm:"default:false"`
}
