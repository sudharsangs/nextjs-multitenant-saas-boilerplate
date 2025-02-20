package dto

type AssignRoleRequest struct {
	UserID uint `json:"user_id" validate:"required"`
	RoleID uint `json:"role_id" validate:"required"`
}

type BulkAssignRoleRequest struct {
	UserID  uint   `json:"user_id" validate:"required"`
	RoleIDs []uint `json:"role_ids" validate:"required,min=1"`
}
