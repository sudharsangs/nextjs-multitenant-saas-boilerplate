package handlers

import "orderly-server/lib/services"

type TransactionsHandler struct {
	TransactionsService *services.TransactionsService
}

func NewTransactionsHandler(TransactionsService *services.TransactionsService) *TransactionsHandler {
	return &TransactionsHandler{TransactionsService: TransactionsService}
}
