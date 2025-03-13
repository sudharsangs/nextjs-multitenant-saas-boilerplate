package handlers

import (
	"net/http"

	"github.com/factostack/orderly/server/lib/services"
	"github.com/labstack/echo/v4"
)

type CategoryHandler struct {
	categoryService *services.CategoryService
}

func NewCategoryHandler(categoryService *services.CategoryService) *CategoryHandler {
	return &CategoryHandler{categoryService: categoryService}
}

// GetCategories handles listing all categories
func (h *CategoryHandler) GetCategories(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"message": "List categories endpoint",
	})
}

// GetCategory handles getting a single category
func (h *CategoryHandler) GetCategory(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"message": "Get category endpoint",
	})
}

// CreateCategory handles category creation
func (h *CategoryHandler) CreateCategory(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"message": "Create category endpoint",
	})
}

// UpdateCategory handles category updates
func (h *CategoryHandler) UpdateCategory(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"message": "Update category endpoint",
	})
}

// DeleteCategory handles category deletion
func (h *CategoryHandler) DeleteCategory(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"message": "Delete category endpoint",
	})
}

// GetCategoryProducts handles getting products in a category
func (h *CategoryHandler) GetCategoryProducts(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"message": "Get category products endpoint",
	})
}
