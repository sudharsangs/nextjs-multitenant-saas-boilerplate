package routes

import (
	"github.com/labstack/echo/v4"
)

func SetupWarehouseRoutes(e *echo.Group, config RouteConfig) {
	warehouses := e.Group("/warehouses")
	warehouses.Use(config.AuthMiddleware)

	// Warehouse routes
	warehouses.GET("", config.WarehouseHandler.GetWarehouses)
	warehouses.GET("/:id", config.WarehouseHandler.GetWarehouse)
	warehouses.POST("", config.WarehouseHandler.CreateWarehouse)
	warehouses.PUT("/:id", config.WarehouseHandler.UpdateWarehouse)
	warehouses.DELETE("/:id", config.WarehouseHandler.DeleteWarehouse)

	// Warehouse inventory routes
	warehouses.GET("/:id/inventory", config.WarehouseHandler.GetWarehouseInventory)
	warehouses.POST("/:id/transfer", config.WarehouseHandler.TransferInventory)
}
