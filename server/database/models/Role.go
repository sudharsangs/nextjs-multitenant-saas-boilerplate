package models

import (
	"gorm.io/gorm"
)

type Role struct {
	gorm.Model
	Name        string `json:"name" gorm:"uniqueIndex;not null"`
	Description string `json:"description"`
}
