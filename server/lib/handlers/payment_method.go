package handlers

import (
	"net/http"

	"github.com/factostack/orderly/server/lib/services"
	"github.com/labstack/echo/v4"
)

type PaymentMethodHandler struct {
	paymentMethodService *services.PaymentMethodService
}

func NewPaymentMethodHandler(paymentMethodService *services.PaymentMethodService) *PaymentMethodHandler {
	return &PaymentMethodHandler{paymentMethodService: paymentMethodService}
}

// GetPaymentMethods handles listing all payment methods
func (h *PaymentMethodHandler) GetPaymentMethods(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"message": "List payment methods endpoint",
	})
}

// GetPaymentMethod handles getting a single payment method
func (h *PaymentMethodHandler) GetPaymentMethod(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"message": "Get payment method endpoint",
	})
}

// CreatePaymentMethod handles payment method creation
func (h *PaymentMethodHandler) CreatePaymentMethod(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"message": "Create payment method endpoint",
	})
}

// UpdatePaymentMethod handles payment method updates
func (h *PaymentMethodHandler) UpdatePaymentMethod(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"message": "Update payment method endpoint",
	})
}

// DeletePaymentMethod handles payment method deletion
func (h *PaymentMethodHandler) DeletePaymentMethod(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"message": "Delete payment method endpoint",
	})
}

// SetDefaultPaymentMethod handles setting a payment method as default
func (h *PaymentMethodHandler) SetDefaultPaymentMethod(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"message": "Set default payment method endpoint",
	})
}
