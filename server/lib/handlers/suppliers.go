package handlers

import "orderly-server/lib/services"

type SuppliersHandler struct {
	SuppliersService *services.SuppliersService
}

func NewSuppliersHandler(SuppliersService *services.SuppliersService) *SuppliersHandler {
	return &SuppliersHandler{SuppliersService: SuppliersService}
}
