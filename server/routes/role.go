package routes

import (
	"github.com/labstack/echo/v4"
)

func SetupRoleRoutes(e *echo.Group, config RouteConfig) {
	roles := e.Group("/roles")
	roles.Use(config.AuthMiddleware)

	// Role routes
	roles.GET("", config.RoleHandler.GetRoles)
	roles.GET("/:id", config.RoleHandler.GetRole)
	roles.POST("", config.RoleHandler.CreateRole)
	roles.PUT("/:id", config.RoleHandler.UpdateRole)
	roles.DELETE("/:id", config.RoleHandler.DeleteRole)

	// Role permissions routes
	roles.GET("/:id/permissions", config.RoleHandler.GetRolePermissions)
	roles.PUT("/:id/permissions", config.RoleHandler.UpdateRolePermissions)
}
