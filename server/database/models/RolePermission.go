package models

import (
	"gorm.io/gorm"
)

type RolePermission struct {
	gorm.Model
	RoleID       int `gorm:"foreignKey"`
	PermissionID int `gorm:"foreignKey"`
}
