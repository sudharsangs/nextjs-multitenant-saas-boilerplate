package handlers

import (
	"net/http"
	"orderly-server/database/models"
	"orderly-server/lib/services"

	"github.com/labstack/echo/v4"
)

type CustomerHandler struct {
	customerService *services.CustomersService
}

func NewCustomerHandler(CustomerService *services.CustomersService) *CustomerHandler {
	return &CustomerHandler{customerService: CustomerService}
}

func (h *CustomerHandler) CreateCustomer(c echo.Context) error {
	type RequestBody struct {
		Name        string  `json:"name" validate:"required"`
		Email       string  `json:"email" validate:"required"`
		Phone       string  `json:"phone"`
		AddressID   uint    `json:"address_id"`
		CreditLimit float64 `json:"credit_limit"`
		IsActive    bool    `json:"is_active"`
	}

	var body RequestBody

	if err := c.Bind(&body); err != nil {
		return err
	}
	if err := c.Validate(&body); err != nil {
		return err
	}

	createdBy, _ := services.GetUserIDFromToken(c)
	companyId, err := services.GetCompanyIDFromToken(c)

	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	err = h.customerService.CreateCustomer(models.Customer{
		Name:        body.Name,
		Email:       body.Email,
		Phone:       body.Phone,
		AddressID:   body.AddressID,
		CreditLimit: body.CreditLimit,
		IsActive:    body.IsActive,
		CreatedBy:   createdBy,
		CompanyID:   companyId,
	})

	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Customer created successfully"})
}

func (h *CustomerHandler) GetCustomer(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"message": "Customer retrieved successfully"})
}

func (h *CustomerHandler) UpdateCustomer(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"message": "Customer updated successfully"})
}

func (h *CustomerHandler) DeleteCustomer(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"message": "Customer deleted successfully"})
}

func (h *CustomerHandler) GetCustomersBasedOnCompany(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"message": "Customers retrieved successfully"})
}
