package routes

import (
	"github.com/factostack/orderly/server/lib/handlers"
	"github.com/factostack/orderly/server/lib/middlewares"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type RouteConfig struct {
	AuthHandler          *handlers.AuthHandler
	UserHandler          *handlers.UserHandler
	CustomerHandler      *handlers.CustomerHandler
	AddressHandler       *handlers.AddressHandler
	OrdersHandler        *handlers.OrdersHandler
	ProductsHandler      *handlers.ProductsHandler
	RBACMiddleware       *middlewares.RBACMiddleware
	AuthorisedMiddleware *middlewares.AuthorisedMiddleware
	RoleHandler          *handlers.RoleHandler
	PermissionHandler    *handlers.PermissionHandler
	PaymentMethodHandler *handlers.PaymentMethodHandler
	InvoiceHandler       *handlers.InvoiceHandler
	CategoryHandler      *handlers.CategoryHandler
	InventoryHandler     *handlers.InventoryHandler
	WarehouseHandler     *handlers.WarehouseHandler
	SupplierHandler      *handlers.SupplierHandler
	PurchaseOrderHandler *handlers.PurchaseOrderHandler
	ShipmentHandler      *handlers.ShipmentsHandler
	AuthMiddleware       echo.MiddlewareFunc
}

// SetupRoutes initializes all routes for the application
func SetupRoutes(e *echo.Echo, config RouteConfig) {
	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	// API version group
	v1 := e.Group("/api/v1")
	v1.Use(config.AuthMiddleware)

	// Setup all routes
	SetupAuthRoutes(v1, config)
	SetupUserRoutes(v1, config)
	SetupCustomerRoutes(v1, config)
	SetupAddressRoutes(v1, config)
	SetupOrderRoutes(v1, config)
	SetupProductRoutes(v1, config)
	SetupRoleRoutes(v1, config)
	SetupPermissionRoutes(v1, config)
	SetupPaymentMethodRoutes(v1, config)
	SetupInvoiceRoutes(v1, config)
	SetupCategoryRoutes(v1, config)
	SetupInventoryRoutes(v1, config)
	SetupWarehouseRoutes(v1, config)
	SetupSupplierRoutes(v1, config)
	SetupPurchaseOrderRoutes(v1, config)
	SetupShipmentRoutes(v1, config)
}

func setupPublicRoutes(g *echo.Group, config RouteConfig) {
	auth := g.Group("/auth")
	{
		auth.POST("/login", config.AuthHandler.Login)
		auth.POST("/register", config.AuthHandler.Register)
	}
}

func setupProtectedRoutes(g *echo.Group, config RouteConfig) {
	users := g.Group("/users")
	{
		users.GET("", config.UserHandler.GetUsers, middlewares.Authorised)
		users.POST("/:id/roles", config.UserHandler.AssignRole, middlewares.Authorised)
	}

	auth := g.Group("/auth")
	{
		auth.POST("/logout", config.AuthHandler.Logout)
	}
}
