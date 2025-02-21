package models

import (
	"time"

	"gorm.io/gorm"
)

type UserRole struct {
	gorm.Model
	UserID     uint      `json:"user_id" gorm:"not null"`
	RoleID     uint      `json:"role_id" gorm:"not null"`
	AssignedAt time.Time `json:"assigned_at"`
	AssignedBy uint      `json:"assigned_by"`

	User User `gorm:"foreignKey:UserID"`
	Role Role `gorm:"foreignKey:RoleID"`
}
