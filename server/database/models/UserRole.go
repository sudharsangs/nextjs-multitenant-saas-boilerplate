package models

import (
	"time"
)

type UserRole struct {
	ID         uint      `json:"id" gorm:"primaryKey"`
	UserID     uint      `json:"user_id" gorm:"not null"`
	RoleID     uint      `json:"role_id" gorm:"not null"`
	AssignedAt time.Time `json:"assigned_at"`
	AssignedBy uint      `json:"assigned_by"`
	User       User      `json:"user" gorm:"foreignKey:UserID"`
	Role       Role      `json:"role" gorm:"foreignKey:RoleID"`
}
