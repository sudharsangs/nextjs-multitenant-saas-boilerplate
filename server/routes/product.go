package routes

import (
	"github.com/labstack/echo/v4"
)

// SetupProductRoutes configures all product management related routes
func SetupProductRoutes(v1 *echo.Group, config RouteConfig) {
	products := v1.Group("/products")
	{
		products.GET("", config.ProductsHandler.GetProducts)
		products.GET("/:id", config.ProductsHandler.GetProduct)
		products.POST("", config.ProductsHandler.CreateProduct)
		products.PUT("/:id", config.ProductsHandler.UpdateProduct)
		products.DELETE("/:id", config.ProductsHandler.DeleteProduct)
		products.GET("/:id/inventory", config.ProductsHandler.GetProductInventory)
		products.GET("/categories/:categoryId", config.ProductsHandler.GetProductsByCategory)
	}
}
