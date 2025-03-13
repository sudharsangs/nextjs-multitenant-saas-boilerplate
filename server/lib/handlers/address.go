package handlers

import (
	"net/http"

	"github.com/factostack/orderly/server/lib/services"

	"github.com/labstack/echo/v4"
)

type AddressHandler struct {
	addressService *services.AddressService
}

func NewAddressHandler(AddressService *services.AddressService) *AddressHandler {
	return &AddressHandler{addressService: AddressService}
}

func (h *AddressHandler) CreateAddress(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"message": "Address created successfully"})
}

func (h *AddressHandler) GetAddress(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"message": "Address retrieved successfully"})
}

func (h *AddressHandler) UpdateAddress(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"message": "Address updated successfully"})
}

func (h *AddressHandler) DeleteAddress(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"message": "Address deleted successfully"})
}

func (h *AddressHandler) GetAddresses(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"message": "Addresses retrieved successfully"})
}
