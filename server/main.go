package main

import (
	"log"

	"github.com/factostack/orderly/server/database"
	"github.com/factostack/orderly/server/database/models"
	"github.com/factostack/orderly/server/lib"
	"github.com/factostack/orderly/server/lib/handlers"
	"github.com/factostack/orderly/server/lib/middlewares"
	"github.com/factostack/orderly/server/lib/services"
	"github.com/factostack/orderly/server/routes"

	"github.com/go-playground/validator/v10"
	_ "github.com/joho/godotenv/autoload"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {

	db, err := database.Connect()

	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	if err := models.Migrate(db); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	e := echo.New()
	e.Use(middleware.CORSWithConfig(
		middleware.CORSConfig{
			AllowOrigins:     []string{"http://localhost:5173"},
			AllowCredentials: true,
		},
	))

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
