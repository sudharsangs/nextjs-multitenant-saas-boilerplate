package services

import (
	"github.com/factostack/orderly/server/database/models"
	"gorm.io/gorm"
)

type RoleService struct {
	db *gorm.DB
}

func NewRoleService(db *gorm.DB) *RoleService {
	return &RoleService{db: db}
}

// GetRoles retrieves all roles
func (s *RoleService) GetRoles() ([]models.Role, error) {
	var roles []models.Role
	err := s.db.Find(&roles).Error
	return roles, err
}

// GetRole retrieves a single role by ID
func (s *RoleService) GetRole(id uint) (*models.Role, error) {
	var role models.Role
	err := s.db.First(&role, id).Error
	return &role, err
}

// CreateRole creates a new role
func (s *RoleService) CreateRole(role *models.Role) error {
	return s.db.Create(role).Error
}

// UpdateRole updates an existing role
func (s *RoleService) UpdateRole(role *models.Role) error {
	return s.db.Save(role).Error
}

// DeleteRole deletes a role
func (s *RoleService) DeleteRole(id uint) error {
	return s.db.Delete(&models.Role{}, id).Error
}

// GetRolePermissions retrieves all permissions for a role
func (s *RoleService) GetRolePermissions(roleID uint) ([]models.Permission, error) {
	var permissions []models.Permission
	err := s.db.Joins("JOIN role_permissions ON permissions.id = role_permissions.permission_id").
		Where("role_permissions.role_id = ?", roleID).
		Find(&permissions).Error
	return permissions, err
}

// UpdateRolePermissions updates permissions for a role
func (s *RoleService) UpdateRolePermissions(roleID uint, permissionIDs []uint) error {
	// First, delete existing role permissions
	if err := s.db.Where("role_id = ?", roleID).Delete(&models.RolePermission{}).Error; err != nil {
		return err
	}

	// Then, create new role permissions
	for _, permissionID := range permissionIDs {
		rolePermission := models.RolePermission{
			RoleID:       int(roleID),
			PermissionID: int(permissionID),
		}
		if err := s.db.Create(&rolePermission).Error; err != nil {
			return err
		}
	}

	return nil
}
