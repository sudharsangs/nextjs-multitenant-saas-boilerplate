package routes

import (
	"github.com/labstack/echo/v4"
)

func SetupPurchaseOrderRoutes(e *echo.Group, config RouteConfig) {
	purchaseOrders := e.Group("/purchase-orders")
	purchaseOrders.Use(config.AuthMiddleware)

	// Purchase order routes
	purchaseOrders.GET("", config.PurchaseOrderHandler.GetPurchaseOrders)
	purchaseOrders.GET("/:id", config.PurchaseOrderHandler.GetPurchaseOrder)
	purchaseOrders.POST("", config.PurchaseOrderHandler.CreatePurchaseOrder)
	purchaseOrders.PUT("/:id", config.PurchaseOrderHandler.UpdatePurchaseOrder)
	purchaseOrders.DELETE("/:id", config.PurchaseOrderHandler.DeletePurchaseOrder)

	// Purchase order items routes
	purchaseOrders.GET("/:id/items", config.PurchaseOrderHandler.GetPurchaseOrderItems)
	purchaseOrders.POST("/:id/items", config.PurchaseOrderHandler.AddPurchaseOrderItem)
	purchaseOrders.PUT("/:id/items/:itemId", config.PurchaseOrderHandler.UpdatePurchaseOrderItem)
	purchaseOrders.DELETE("/:id/items/:itemId", config.PurchaseOrderHandler.DeletePurchaseOrderItem)

	// Purchase order status routes
	purchaseOrders.POST("/:id/approve", config.PurchaseOrderHandler.ApprovePurchaseOrder)
	purchaseOrders.POST("/:id/reject", config.PurchaseOrderHandler.RejectPurchaseOrder)
}
