package handlers

import "orderly-server/lib/services"

type InvoiceHandler struct {
	InvoiceService *services.InvoiceService
}

func NewInvoiceHandler(InvoiceService *services.InvoiceService) *InvoiceHandler {
	return &InvoiceHandler{InvoiceService: InvoiceService}
}
