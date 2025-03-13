package routes

import (
	"github.com/labstack/echo/v4"
)

func SetupShipmentRoutes(e *echo.Group, config RouteConfig) {
	shipments := e.Group("/shipments")
	shipments.Use(config.AuthMiddleware)

	// Shipment routes
	shipments.GET("", config.ShipmentHandler.GetShipments)
	shipments.GET("/:id", config.ShipmentHandler.GetShipment)
	shipments.POST("", config.ShipmentHandler.CreateShipment)
	shipments.PUT("/:id", config.ShipmentHandler.UpdateShipment)
	shipments.DELETE("/:id", config.ShipmentHandler.DeleteShipment)

	// Shipment items routes
	shipments.GET("/:id/items", config.ShipmentHandler.GetShipmentItems)
	shipments.POST("/:id/items", config.ShipmentHandler.AddShipmentItem)
	shipments.PUT("/:id/items/:itemId", config.ShipmentHandler.UpdateShipmentItem)
	shipments.DELETE("/:id/items/:itemId", config.ShipmentHandler.DeleteShipmentItem)

	// Shipment status and tracking routes
	shipments.PUT("/:id/status", config.ShipmentHandler.UpdateShipmentStatus)
	shipments.GET("/:id/tracking", config.ShipmentHandler.GetShipmentTracking)
}
