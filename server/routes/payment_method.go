package routes

import (
	"github.com/labstack/echo/v4"
)

func SetupPaymentMethodRoutes(e *echo.Group, config RouteConfig) {
	paymentMethods := e.Group("/payment-methods")
	paymentMethods.Use(config.AuthMiddleware)

	// Payment method routes
	paymentMethods.GET("", config.PaymentMethodHandler.GetPaymentMethods)
	paymentMethods.GET("/:id", config.PaymentMethodHandler.GetPaymentMethod)
	paymentMethods.POST("", config.PaymentMethodHandler.CreatePaymentMethod)
	paymentMethods.PUT("/:id", config.PaymentMethodHandler.UpdatePaymentMethod)
	paymentMethods.DELETE("/:id", config.PaymentMethodHandler.DeletePaymentMethod)

	// Payment method status routes
	paymentMethods.PUT("/:id/default", config.PaymentMethodHandler.SetDefaultPaymentMethod)
}
