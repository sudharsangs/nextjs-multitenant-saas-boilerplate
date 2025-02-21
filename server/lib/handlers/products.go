package handlers

import "orderly-server/lib/services"

type ProductsHandler struct {
	ProductsService *services.ProductsService
}

func NewProductsHandler(ProductsService *services.ProductsService) *ProductsHandler {
	return &ProductsHandler{ProductsService: ProductsService}
}
