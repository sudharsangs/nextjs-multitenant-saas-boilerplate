package routes

import (
	"github.com/labstack/echo/v4"
)

// SetupOrderRoutes configures all order management related routes
func SetupOrderRoutes(v1 *echo.Group, config RouteConfig) {
	orders := v1.Group("/orders")
	{
		orders.GET("", config.OrdersHandler.GetOrders)
		orders.GET("/:id", config.OrdersHandler.GetOrder)
		orders.POST("", config.OrdersHandler.CreateOrder)
		orders.PUT("/:id", config.OrdersHandler.UpdateOrder)
		orders.DELETE("/:id", config.OrdersHandler.DeleteOrder)
		orders.GET("/:id/items", config.OrdersHandler.GetOrderItems)
		orders.POST("/:id/items", config.OrdersHandler.AddOrderItem)
		orders.PUT("/:id/items/:itemId", config.OrdersHandler.UpdateOrderItem)
		orders.DELETE("/:id/items/:itemId", config.OrdersHandler.DeleteOrderItem)
	}
}
