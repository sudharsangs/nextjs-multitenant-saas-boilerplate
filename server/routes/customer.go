package routes

import (
	"github.com/labstack/echo/v4"
)

// SetupCustomerRoutes configures all customer management related routes
func SetupCustomerRoutes(v1 *echo.Group, config RouteConfig) {
	customers := v1.Group("/customers")
	{
		customers.GET("", config.CustomerHandler.GetCustomersBasedOnCompany)
		customers.GET("/:id", config.CustomerHandler.GetCustomer)
		customers.POST("", config.CustomerHandler.CreateCustomer)
		customers.PUT("/:id", config.CustomerHandler.UpdateCustomer)
		customers.DELETE("/:id", config.CustomerHandler.DeleteCustomer)
	}
}
