package services

import "gorm.io/gorm"

type ProductsService struct {
	db *gorm.DB
}

func NewProductsService(db *gorm.DB) *ProductsService {
	return &ProductsService{db: db}
}
