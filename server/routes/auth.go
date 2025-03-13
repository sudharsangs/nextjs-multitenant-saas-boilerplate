package routes

import (
	"github.com/labstack/echo/v4"
)

// SetupAuthRoutes configures all authentication related routes
func SetupAuthRoutes(e *echo.Group, config RouteConfig) {
	auth := e.Group("/auth")

	// Auth routes
	auth.POST("/login", config.AuthHandler.Login)
	auth.POST("/register", config.AuthHandler.Register)
	auth.POST("/logout", config.AuthHandler.Logout)
	auth.POST("/refresh", config.AuthHandler.RefreshToken)
	auth.POST("/forgot-password", config.AuthHandler.ForgotPassword)
	auth.POST("/reset-password", config.AuthHandler.ResetPassword)
}
