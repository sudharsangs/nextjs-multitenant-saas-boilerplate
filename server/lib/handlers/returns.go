package handlers

import "orderly-server/lib/services"

type ReturnsHandler struct {
	ReturnsService *services.ReturnsService
}

func NewReturnsHandler(ReturnsService *services.ReturnsService) *ReturnsHandler {
	return &ReturnsHandler{ReturnsService: ReturnsService}
}
