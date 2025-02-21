package handlers

import "orderly-server/lib/services"

type InventoryHandler struct {
	InventoryService *services.InventoryService
}

func NewInventoryHandler(InventoryService *services.InventoryService) *InventoryHandler {
	return &InventoryHandler{InventoryService: InventoryService}
}
