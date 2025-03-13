package handlers

import (
	"net/http"
	"strconv"

	"github.com/factostack/orderly/server/lib/dto"
	"github.com/factostack/orderly/server/lib/services"

	"github.com/labstack/echo/v4"
)

type UserHandler struct {
	userService *services.UserService
}

func NewUserHandler(userService *services.UserService) *UserHandler {
	return &UserHandler{userService: userService}
}

func (h *UserHandler) GetUsers(c echo.Context) error {
	users, err := h.userService.GetUsers(c.Request().Context())
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, users)
}

func (h *UserHandler) GetUserByID(c echo.Context) error {
	userID := c.Param("id")
	uid, err := strconv.ParseUint(userID, 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid user ID"})
	}
	user, err := h.userService.GetUserByID(c.Request().Context(), uint(uid))
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, user)
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
