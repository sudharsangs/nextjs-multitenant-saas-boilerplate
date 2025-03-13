package services

import (
	"context"
	"errors"
	"time"

	"github.com/factostack/orderly/server/database/models"

	"gorm.io/gorm"
)

type UserService struct {
	db *gorm.DB
}

func NewUserService(db *gorm.DB) *UserService {
	return &UserService{db: db}
}

func (s *UserService) GetUsers(ctx context.Context) ([]models.User, error) {
	var users []models.User
	if err := s.db.Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

func (s *UserService) GetUserByID(ctx context.Context, userID uint) (models.User, error) {
	var user models.User
	if err := s.db.First(&user, userID).Error; err != nil {
		return models.User{}, errors.New("user not found")
	}
	return user, nil
}

func (s *UserService) AssignRole(ctx context.Context, userID, roleID, assignedBy uint) error {
	// Check if user exists
	var user models.User
	if err := s.db.First(&user, userID).Error; err != nil {
		return errors.New("user not found")
	}

	// Check if role exists
	var role models.Role
	if err := s.db.First(&role, roleID).Error; err != nil {
		return errors.New("role not found")
	}

	// Check if assignment already exists
	var existingAssignment models.UserRole
	result := s.db.Where("user_id = ? AND role_id = ?", userID, roleID).First(&existingAssignment)
	if result.Error == nil {
		return errors.New("role already assigned to user")
	}

	// Create new assignment
	userRole := models.UserRole{
		UserID:     userID,
		RoleID:     roleID,
		AssignedAt: time.Now(),
		AssignedBy: assignedBy,
	}

	return s.db.Create(&userRole).Error
}

func (s *UserService) BulkAssignRoles(ctx context.Context, userID uint, roleIDs []uint, assignedBy uint) error {
	// Start transaction
	return s.db.Transaction(func(tx *gorm.DB) error {
		for _, roleID := range roleIDs {
			userRole := models.UserRole{
				UserID:     userID,
				RoleID:     roleID,
				AssignedAt: time.Now(),
				AssignedBy: assignedBy,
			}

			// Skip if already assigned
			var existing models.UserRole
			result := tx.Where("user_id = ? AND role_id = ?", userID, roleID).First(&existing)
			if result.Error == nil {
				continue
			}

			if err := tx.Create(&userRole).Error; err != nil {
				return err
			}
		}
		return nil
	})
}

func (s *UserService) RemoveRole(ctx context.Context, userID, roleID uint) error {
	result := s.db.Where("user_id = ? AND role_id = ?", userID, roleID).Delete(&models.UserRole{})
	if result.RowsAffected == 0 {
		return errors.New("role assignment not found")
	}
	return result.Error
}
