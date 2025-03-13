package routes

import (
	"github.com/labstack/echo/v4"
)

func SetupSupplierRoutes(e *echo.Group, config RouteConfig) {
	suppliers := e.Group("/suppliers")
	suppliers.Use(config.AuthMiddleware)

	// Supplier routes
	suppliers.GET("", config.SupplierHandler.GetSuppliers)
	suppliers.GET("/:id", config.SupplierHandler.GetSupplier)
	suppliers.POST("", config.SupplierHandler.CreateSupplier)
	suppliers.PUT("/:id", config.SupplierHandler.UpdateSupplier)
	suppliers.DELETE("/:id", config.SupplierHandler.DeleteSupplier)

	// Supplier related routes
	suppliers.GET("/:id/products", config.SupplierHandler.GetSupplierProducts)
	suppliers.GET("/:id/orders", config.SupplierHandler.GetSupplierOrders)
}
