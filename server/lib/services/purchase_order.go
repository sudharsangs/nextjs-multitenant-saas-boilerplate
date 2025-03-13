package services

import "gorm.io/gorm"

type PurchaseOrderService struct {
	db *gorm.DB
}

func NewPurchaseOrderService(db *gorm.DB) *PurchaseOrderService {
	return &PurchaseOrderService{db: db}
}
