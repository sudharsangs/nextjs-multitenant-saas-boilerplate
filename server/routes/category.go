package routes

import (
	"github.com/labstack/echo/v4"
)

func SetupCategoryRoutes(e *echo.Group, config RouteConfig) {
	categories := e.Group("/categories")
	categories.Use(config.AuthMiddleware)

	// Category routes
	categories.GET("", config.CategoryHandler.GetCategories)
	categories.GET("/:id", config.CategoryHandler.GetCategory)
	categories.POST("", config.CategoryHandler.CreateCategory)
	categories.PUT("/:id", config.CategoryHandler.UpdateCategory)
	categories.DELETE("/:id", config.CategoryHandler.DeleteCategory)

	// Category products routes
	categories.GET("/:id/products", config.CategoryHandler.GetCategoryProducts)
}
