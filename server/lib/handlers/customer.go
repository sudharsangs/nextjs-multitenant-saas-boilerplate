package handlers

import "orderly-server/lib/services"

type CustomerHandler struct {
	customerService *services.CustomersService
}

func NewCustomerHandler(CustomerService *services.CustomersService) *CustomerHandler {
	return &CustomerHandler{customerService: CustomerService}
}
