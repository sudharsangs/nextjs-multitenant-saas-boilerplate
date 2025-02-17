package main

import (
	"orderly-server/database"
	"orderly-server/lib"
	"orderly-server/lib/middlewares"
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

	routes.Routes(e.Group(""))

	e.Logger.Fatal(e.Start(":4444"))
}
