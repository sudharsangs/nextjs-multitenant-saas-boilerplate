package routes

import (
	"github.com/labstack/echo/v4"
)

func SetupInvoiceRoutes(e *echo.Group, config RouteConfig) {
	invoices := e.Group("/invoices")
	invoices.Use(config.AuthMiddleware)

	// Invoice routes
	invoices.GET("", config.InvoiceHandler.GetInvoices)
	invoices.GET("/:id", config.InvoiceHandler.GetInvoice)
	invoices.POST("", config.InvoiceHandler.CreateInvoice)
	invoices.PUT("/:id", config.InvoiceHandler.UpdateInvoice)
	invoices.DELETE("/:id", config.InvoiceHandler.DeleteInvoice)

	// Invoice items routes
	invoices.GET("/:id/items", config.InvoiceHandler.GetInvoiceItems)
	invoices.POST("/:id/items", config.InvoiceHandler.AddInvoiceItem)
	invoices.PUT("/:id/items/:itemId", config.InvoiceHandler.UpdateInvoiceItem)
	invoices.DELETE("/:id/items/:itemId", config.InvoiceHandler.DeleteInvoiceItem)
}
