package handlers

import (
	"net/http"

	"github.com/factostack/orderly/server/lib/services"
	"github.com/labstack/echo/v4"
)

type SupplierHandler struct {
	SuppliersService *services.SupplierService
}

func NewSuppliersHandler(SuppliersService *services.SupplierService) *SupplierHandler {
	return &SupplierHandler{SuppliersService: SuppliersService}
}

// GetSuppliers handles listing all suppliers
func (h *SupplierHandler) GetSuppliers(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"message": "List suppliers endpoint",
	})
}

// GetSupplier handles getting a single supplier
func (h *SupplierHandler) GetSupplier(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"message": "Get supplier endpoint",
	})
}

// CreateSupplier handles supplier creation
func (h *SupplierHandler) CreateSupplier(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"message": "Create supplier endpoint",
	})
}

// UpdateSupplier handles supplier updates
func (h *SupplierHandler) UpdateSupplier(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"message": "Update supplier endpoint",
	})
}

// DeleteSupplier handles supplier deletion
func (h *SupplierHandler) DeleteSupplier(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"message": "Delete supplier endpoint",
	})
}

// GetSupplierProducts handles getting products supplied by a supplier
func (h *SupplierHandler) GetSupplierProducts(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"message": "Get supplier products endpoint",
	})
}

// GetSupplierOrders handles getting orders from a supplier
func (h *SupplierHandler) GetSupplierOrders(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"message": "Get supplier orders endpoint",
	})
}
