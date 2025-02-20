package handlers

import (
	"net/http"
	"orderly-server/lib/dto"
	"orderly-server/lib/services"

	"github.com/labstack/echo/v4"
)

type UserHandler struct {
	userService *services.UserService
}

func NewUserHandler(userService *services.UserService) *UserHandler {
	return &UserHandler{userService: userService}
}

func (h *UserHandler) AssignRole(c echo.Context) error {
	var req dto.AssignRoleRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request"})
	}

	// Get the current user ID from the JWT token
	assignedBy, _ := services.GetUserIDFromToken(c)

	err := h.userService.AssignRole(c.Request().Context(), req.UserID, req.RoleID, assignedBy)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.NoContent(http.StatusOK)
}

func (h *UserHandler) BulkAssignRoles(c echo.Context) error {
	var req dto.BulkAssignRoleRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request"})
	}

	assignedBy, _ := services.GetUserIDFromToken(c)

	err := h.userService.BulkAssignRoles(c.Request().Context(), req.UserID, req.RoleIDs, assignedBy)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.NoContent(http.StatusOK)
}
