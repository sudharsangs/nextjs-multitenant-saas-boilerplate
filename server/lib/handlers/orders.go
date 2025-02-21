package handlers

import "orderly-server/lib/services"

type OrdersHandler struct {
	OrdersService *services.OrdersService
}

func NewOrdersHandler(OrdersService *services.OrdersService) *OrdersHandler {
	return &OrdersHandler{OrdersService: OrdersService}
}
