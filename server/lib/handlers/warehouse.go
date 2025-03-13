package handlers

import (
	"net/http"

	"github.com/factostack/orderly/server/database/models"
	"github.com/factostack/orderly/server/lib/services"
	"github.com/labstack/echo/v4"
)

type WarehouseHandler struct {
	warehouseService *services.WarehouseService
}

func NewWarehouseHandler(warehouseService *services.WarehouseService) *WarehouseHandler {
	return &WarehouseHandler{
		warehouseService: warehouseService,
	}
}

// GetWarehouses handles GET /api/warehouses
func (h *WarehouseHandler) GetWarehouses(c echo.Context) error {
	companyID := c.Get("company_id").(uint)
	warehouses, err := h.warehouseService.GetWarehouses(companyID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, warehouses)
}

// GetWarehouse handles GET /api/warehouses/:id
func (h *WarehouseHandler) GetWarehouse(c echo.Context) error {
	id, err := parseUintParam(c, "id")
	if err != nil {
		return err
	}

	companyID := c.Get("company_id").(uint)
	warehouse, err := h.warehouseService.GetWarehouse(id, companyID)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Warehouse not found"})
	}
	return c.JSON(http.StatusOK, warehouse)
}

// CreateWarehouse handles POST /api/warehouses
func (h *WarehouseHandler) CreateWarehouse(c echo.Context) error {
	var warehouse models.Warehouse
	if err := c.Bind(&warehouse); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	companyID := c.Get("company_id").(uint)
	warehouse.CompanyID = companyID

	if err := h.warehouseService.CreateWarehouse(&warehouse); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, warehouse)
}

// UpdateWarehouse handles PUT /api/warehouses/:id
func (h *WarehouseHandler) UpdateWarehouse(c echo.Context) error {
	id, err := parseUintParam(c, "id")
	if err != nil {
		return err
	}

	var warehouse models.Warehouse
	if err := c.Bind(&warehouse); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	companyID := c.Get("company_id").(uint)
	warehouse.ID = id
	warehouse.CompanyID = companyID

	if err := h.warehouseService.UpdateWarehouse(&warehouse); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, warehouse)
}

// DeleteWarehouse handles DELETE /api/warehouses/:id
func (h *WarehouseHandler) DeleteWarehouse(c echo.Context) error {
	id, err := parseUintParam(c, "id")
	if err != nil {
		return err
	}

	companyID := c.Get("company_id").(uint)
	if err := h.warehouseService.DeleteWarehouse(id, companyID); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.NoContent(http.StatusNoContent)
}

// GetWarehouseInventory handles GET /api/warehouses/:id/inventory
func (h *WarehouseHandler) GetWarehouseInventory(c echo.Context) error {
	id, err := parseUintParam(c, "id")
	if err != nil {
		return err
	}

	companyID := c.Get("company_id").(uint)
	inventory, err := h.warehouseService.GetWarehouseInventory(id, companyID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, inventory)
}

// GetWarehouseLowStock handles GET /api/warehouses/:id/low-stock
func (h *WarehouseHandler) GetWarehouseLowStock(c echo.Context) error {
	id, err := parseUintParam(c, "id")
	if err != nil {
		return err
	}

	companyID := c.Get("company_id").(uint)
	products, err := h.warehouseService.GetWarehouseLowStock(id, companyID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, products)
}

// GetWarehouseOutOfStock handles GET /api/warehouses/:id/out-of-stock
func (h *WarehouseHandler) GetWarehouseOutOfStock(c echo.Context) error {
	id, err := parseUintParam(c, "id")
	if err != nil {
		return err
	}

	companyID := c.Get("company_id").(uint)
	products, err := h.warehouseService.GetWarehouseOutOfStock(id, companyID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, products)
}

// GetWarehouseCapacity handles GET /api/warehouses/:id/capacity
func (h *WarehouseHandler) GetWarehouseCapacity(c echo.Context) error {
	id, err := parseUintParam(c, "id")
	if err != nil {
		return err
	}

	companyID := c.Get("company_id").(uint)
	capacity, err := h.warehouseService.GetWarehouseCapacity(id, companyID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]float64{"capacity": capacity})
}

// UpdateWarehouseStatus handles PATCH /api/warehouses/:id/status
func (h *WarehouseHandler) UpdateWarehouseStatus(c echo.Context) error {
	id, err := parseUintParam(c, "id")
	if err != nil {
		return err
	}

	var request struct {
		Active bool `json:"active"`
	}
	if err := c.Bind(&request); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	companyID := c.Get("company_id").(uint)
	if err := h.warehouseService.UpdateWarehouseStatus(id, companyID, request.Active); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.NoContent(http.StatusOK)
}

// TransferWarehouseInventory handles POST /api/warehouses/:id/transfer
func (h *WarehouseHandler) TransferWarehouseInventory(c echo.Context) error {
	id, err := parseUintParam(c, "id")
	if err != nil {
		return err
	}

	var request struct {
		FromWarehouseID uint `json:"from_warehouse_id"`
		ToWarehouseID   uint `json:"to_warehouse_id"`
		ProductID       uint `json:"product_id"`
		Quantity        int  `json:"quantity"`
	}
	if err := c.Bind(&request); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	companyID := c.Get("company_id").(uint)
	if err := h.warehouseService.TransferWarehouseInventory(id, companyID, request.FromWarehouseID, request.ToWarehouseID, request.ProductID, request.Quantity); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.NoContent(http.StatusOK)
}
