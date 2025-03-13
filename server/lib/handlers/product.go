package handlers

import (
	"net/http"

	"github.com/factostack/orderly/server/database/models"
	"github.com/factostack/orderly/server/lib/services"
	"github.com/labstack/echo/v4"
)

type ProductHandler struct {
	productService *services.ProductsService
}

func NewProductHandler(productService *services.ProductsService) *ProductHandler {
	return &ProductHandler{
		productService: productService,
	}
}

// GetProducts handles GET /api/products
func (h *ProductHandler) GetProducts(c echo.Context) error {
	companyID := c.Get("company_id").(uint)
	products, err := h.productService.GetProducts(companyID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, products)
}

// GetProduct handles GET /api/products/:id
func (h *ProductHandler) GetProduct(c echo.Context) error {
	id, err := parseUintParam(c, "id")
	if err != nil {
		return err
	}

	companyID := c.Get("company_id").(uint)
	product, err := h.productService.GetProduct(id, companyID)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Product not found"})
	}
	return c.JSON(http.StatusOK, product)
}

// CreateProduct handles POST /api/products
func (h *ProductHandler) CreateProduct(c echo.Context) error {
	var product models.Product
	if err := c.Bind(&product); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	companyID := c.Get("company_id").(uint)
	product.CompanyID = companyID

	if err := h.productService.CreateProduct(&product); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, product)
}

// UpdateProduct handles PUT /api/products/:id
func (h *ProductHandler) UpdateProduct(c echo.Context) error {
	id, err := parseUintParam(c, "id")
	if err != nil {
		return err
	}

	var product models.Product
	if err := c.Bind(&product); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	companyID := c.Get("company_id").(uint)
	product.ID = id
	product.CompanyID = companyID

	if err := h.productService.UpdateProduct(&product); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, product)
}

// DeleteProduct handles DELETE /api/products/:id
func (h *ProductHandler) DeleteProduct(c echo.Context) error {
	id, err := parseUintParam(c, "id")
	if err != nil {
		return err
	}

	companyID := c.Get("company_id").(uint)
	if err := h.productService.DeleteProduct(id, companyID); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.NoContent(http.StatusNoContent)
}

// GetProductInventory handles GET /api/products/:id/inventory
func (h *ProductHandler) GetProductInventory(c echo.Context) error {
	id, err := parseUintParam(c, "id")
	if err != nil {
		return err
	}

	companyID := c.Get("company_id").(uint)
	inventory, err := h.productService.GetProductInventory(id, companyID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, inventory)
}

// GetProductsByCategory handles GET /api/products/category/:categoryId
func (h *ProductHandler) GetProductsByCategory(c echo.Context) error {
	categoryID, err := parseUintParam(c, "categoryId")
	if err != nil {
		return err
	}

	companyID := c.Get("company_id").(uint)
	products, err := h.productService.GetProductsByCategory(categoryID, companyID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, products)
}

// UpdateProductStatus handles PATCH /api/products/:id/status
func (h *ProductHandler) UpdateProductStatus(c echo.Context) error {
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
	if err := h.productService.UpdateProductStatus(id, companyID, request.Active); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.NoContent(http.StatusOK)
}

// UpdateProductPrice handles PATCH /api/products/:id/price
func (h *ProductHandler) UpdateProductPrice(c echo.Context) error {
	id, err := parseUintParam(c, "id")
	if err != nil {
		return err
	}

	var request struct {
		Price float64 `json:"price"`
	}
	if err := c.Bind(&request); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	companyID := c.Get("company_id").(uint)
	if err := h.productService.UpdateProductPrice(id, companyID, request.Price); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.NoContent(http.StatusOK)
}

// UpdateProductStockLevel handles PATCH /api/products/:id/stock-level
func (h *ProductHandler) UpdateProductStockLevel(c echo.Context) error {
	id, err := parseUintParam(c, "id")
	if err != nil {
		return err
	}

	var request struct {
		MinStockLevel float64 `json:"min_stock_level"`
	}
	if err := c.Bind(&request); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	companyID := c.Get("company_id").(uint)
	if err := h.productService.UpdateProductStockLevel(id, companyID, request.MinStockLevel); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.NoContent(http.StatusOK)
}
