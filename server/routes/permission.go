package routes

import (
	"github.com/labstack/echo/v4"
)

// SetupPermissionRoutes configures all permission management related routes
func SetupPermissionRoutes(e *echo.Group, config RouteConfig) {
	permissions := e.Group("/permissions")
	permissions.Use(config.AuthMiddleware)

	// Permission routes
	permissions.GET("", config.PermissionHandler.GetPermissions)
	permissions.GET("/:id", config.PermissionHandler.GetPermission)
	permissions.POST("", config.PermissionHandler.CreatePermission)
	permissions.PUT("/:id", config.PermissionHandler.UpdatePermission)
	permissions.DELETE("/:id", config.PermissionHandler.DeletePermission)
}
