package handlers

import "orderly-server/lib/services"

type ShipmentsHandler struct {
	ShipmentsService *services.ShipmentsService
}

func NewShipmentsHandler(ShipmentsService *services.ShipmentsService) *ShipmentsHandler {
	return &ShipmentsHandler{ShipmentsService: ShipmentsService}
}
