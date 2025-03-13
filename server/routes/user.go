package routes

import (
	"github.com/labstack/echo/v4"
)

// SetupUserRoutes configures all user management related routes
func SetupUserRoutes(v1 *echo.Group, config RouteConfig) {
	users := v1.Group("/users")
	{
		users.GET("", config.UserHandler.GetUsers)
		users.GET("/:id", config.UserHandler.GetUserByID)
		users.POST("/:id/roles", config.UserHandler.AssignRole)
		users.POST("/:id/roles/bulk", config.UserHandler.BulkAssignRoles)
	}
}
