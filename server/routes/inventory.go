package routes

import (
	"github.com/labstack/echo/v4"
)

func SetupInventoryRoutes(e *echo.Group, config RouteConfig) {
	inventory := e.Group("/inventory")
	inventory.Use(config.AuthMiddleware)

	// Inventory routes
	inventory.GET("/products/:id", config.InventoryHandler.GetInventory)
	inventory.PUT("/products/:id", config.InventoryHandler.UpdateInventory)
	inventory.GET("/products/:id/history", config.InventoryHandler.GetInventoryHistory)

	// Inventory status routes
	inventory.GET("/low-stock", config.InventoryHandler.GetLowStockProducts)
	inventory.GET("/out-of-stock", config.InventoryHandler.GetOutOfStockProducts)
}
