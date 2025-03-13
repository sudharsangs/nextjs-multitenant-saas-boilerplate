package routes

import (
	"github.com/labstack/echo/v4"
)

// SetupAddressRoutes configures all address management related routes
func SetupAddressRoutes(v1 *echo.Group, config RouteConfig) {
	addresses := v1.Group("/addresses")
	{
		addresses.GET("", config.AddressHandler.GetAddresses)
		addresses.GET("/:id", config.AddressHandler.GetAddress)
		addresses.POST("", config.AddressHandler.CreateAddress)
		addresses.PUT("/:id", config.AddressHandler.UpdateAddress)
		addresses.DELETE("/:id", config.AddressHandler.DeleteAddress)
	}
}
