package routes

import (
	"orderly-server/lib/handlers"
	"orderly-server/lib/middlewares"

	"github.com/labstack/echo/v4"
)

type RouteConfig struct {
	AuthHandler          *handlers.AuthHandler
	UserHandler          *handlers.UserHandler
	RBACMiddleware       *middlewares.RBACMiddleware
	AuthorisedMiddleware *middlewares.AuthorisedMiddleware
}

func SetupRoutes(e *echo.Echo, config RouteConfig) {
	// Public routes group
	public := e.Group("/api/v1")
	setupPublicRoutes(public, config)

	// Protected routes group
	protected := e.Group("/api/v1")
	setupProtectedRoutes(protected, config)
}

func setupPublicRoutes(g *echo.Group, config RouteConfig) {
	auth := g.Group("/auth")
	{
		auth.POST("/login", config.AuthHandler.Login)
		auth.POST("/register", config.AuthHandler.Register)
	}
}

func setupProtectedRoutes(g *echo.Group, config RouteConfig) {
	users := g.Group("/users")
	{
		users.GET("", config.UserHandler.GetUsers, middlewares.Authorised)
		users.POST("/:id/roles", config.UserHandler.AssignRole, middlewares.Authorised)
	}

	auth := g.Group("/auth")
	{
		auth.POST("/logout", config.AuthHandler.Logout)
	}
}
