package handlers

import (
	"fmt"
	"net/http"

	"github.com/factostack/orderly/server/database/models"
	"github.com/factostack/orderly/server/lib/services"
	"github.com/labstack/echo/v4"
)

type CategoryHandler struct {
	categoryService *services.CategoryService
}

func NewCategoryHandler(categoryService *services.CategoryService) *CategoryHandler {
	return &CategoryHandler{
		categoryService: categoryService,
	}
}

// GetCategories handles GET /api/categories
func (h *CategoryHandler) GetCategories(c echo.Context) error {
	companyID := c.Get("company_id").(uint)
	categories, err := h.categoryService.GetCategories(companyID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, categories)
}

// GetCategory handles GET /api/categories/:id
func (h *CategoryHandler) GetCategory(c echo.Context) error {
	id, err := parseUintParam(c, "id")
	if err != nil {
		return err
	}

	companyID := c.Get("company_id").(uint)
	category, err := h.categoryService.GetCategory(id, companyID)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Category not found"})
	}
	return c.JSON(http.StatusOK, category)
}

// CreateCategory handles POST /api/categories
func (h *CategoryHandler) CreateCategory(c echo.Context) error {
	var category models.ProductCategory
	if err := c.Bind(&category); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	companyID := c.Get("company_id").(uint)
	category.CompanyID = companyID

	if err := h.categoryService.CreateCategory(&category); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, category)
}

// UpdateCategory handles PUT /api/categories/:id
func (h *CategoryHandler) UpdateCategory(c echo.Context) error {
	id, err := parseUintParam(c, "id")
	if err != nil {
		return err
	}

	var category models.ProductCategory
	if err := c.Bind(&category); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	companyID := c.Get("company_id").(uint)
	category.ID = id
	category.CompanyID = companyID

	if err := h.categoryService.UpdateCategory(&category); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, category)
}

// DeleteCategory handles DELETE /api/categories/:id
func (h *CategoryHandler) DeleteCategory(c echo.Context) error {
	id, err := parseUintParam(c, "id")
	if err != nil {
		return err
	}

	companyID := c.Get("company_id").(uint)
	if err := h.categoryService.DeleteCategory(id, companyID); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.NoContent(http.StatusNoContent)
}

// GetCategoryProducts handles GET /api/categories/:id/products
func (h *CategoryHandler) GetCategoryProducts(c echo.Context) error {
	id, err := parseUintParam(c, "id")
	if err != nil {
		return err
	}

	companyID := c.Get("company_id").(uint)
	products, err := h.categoryService.GetCategoryProducts(id, companyID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, products)
}

// GetCategoryHierarchy handles GET /api/categories/hierarchy
func (h *CategoryHandler) GetCategoryHierarchy(c echo.Context) error {
	companyID := c.Get("company_id").(uint)
	categories, err := h.categoryService.GetCategoryHierarchy(companyID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, categories)
}

// MoveCategory handles PUT /api/categories/:id/move
func (h *CategoryHandler) MoveCategory(c echo.Context) error {
	id, err := parseUintParam(c, "id")
	if err != nil {
		return err
	}

	var request struct {
		NewParentID *uint `json:"new_parent_id"`
	}
	if err := c.Bind(&request); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	companyID := c.Get("company_id").(uint)
	if err := h.categoryService.MoveCategory(id, request.NewParentID, companyID); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.NoContent(http.StatusOK)
}

// Helper function to parse uint parameters
func parseUintParam(c echo.Context, param string) (uint, error) {
	id := c.Param(param)
	if id == "" {
		return 0, c.JSON(http.StatusBadRequest, map[string]string{"error": "Missing ID parameter"})
	}

	var uintID uint
	if _, err := fmt.Sscanf(id, "%d", &uintID); err != nil {
		return 0, c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid ID format"})
	}
	return uintID, nil
}
