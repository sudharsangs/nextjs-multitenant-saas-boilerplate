package handlers

import "github.com/factostack/orderly/server/lib/services"

type PaymentsHandler struct {
	PaymentsService *services.PaymentsService
}

func NewPaymentsHandler(PaymentsService *services.PaymentsService) *PaymentsHandler {
	return &PaymentsHandler{PaymentsService: PaymentsService}
}
