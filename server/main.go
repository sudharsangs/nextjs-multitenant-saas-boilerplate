package main

import (
	"orderly-server/database"
	"orderly-server/lib"
	"orderly-server/lib/handlers"
	"orderly-server/lib/middlewares"
	"orderly-server/lib/services"
	"orderly-server/routes"

	"github.com/go-playground/validator/v10"
	_ "github.com/joho/godotenv/autoload"
	"github.com/labstack/echo/v4"
)

func main() {

	db := database.Connect()

	e := echo.New()

	e.Validator = &lib.CustomValidator{Validator: validator.New()}

	e.Use(middlewares.ContextDB(db))

	// Initialize services
	authService := services.NewAuthService(db)
	userService := services.NewUserService(db)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(authService)
	userHandler := handlers.NewUserHandler(userService)

	rbacMiddleware := middlewares.NewRBACMiddleware(authService)
	authorisedMiddleware := middlewares.NewAuthorisedMiddleware(authService)

	// Create route config
	routeConfig := routes.RouteConfig{
		AuthHandler:          authHandler,
		UserHandler:          userHandler,
		RBACMiddleware:       rbacMiddleware,
		AuthorisedMiddleware: authorisedMiddleware,
	}

	routes.SetupRoutes(e, routeConfig)

	e.Logger.Fatal(e.Start(":4444"))
}
