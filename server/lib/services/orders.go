package services

import "gorm.io/gorm"

type OrdersService struct {
	db *gorm.DB
}

func NewOrdersService(db *gorm.DB) *OrdersService {
	return &OrdersService{db: db}
}
