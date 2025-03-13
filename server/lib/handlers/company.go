package handlers

import (
	"net/http"

	"github.com/factostack/orderly/server/lib/services"

	"github.com/labstack/echo/v4"
)

type CompanyHandler struct {
	companyService *services.CompanyService
}

func NewCompanyHandler(CompanyService *services.CompanyService) *CompanyHandler {
	return &CompanyHandler{companyService: CompanyService}
}

func (h *CompanyHandler) CreateCompany(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"message": "Company created successfully"})
}

func (h *CompanyHandler) GetCompany(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"message": "Company retrieved successfully"})
}

func (h *CompanyHandler) UpdateCompany(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"message": "Company updated successfully"})
}

func (h *CompanyHandler) DeleteCompany(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"message": "Company deleted successfully"})
}
