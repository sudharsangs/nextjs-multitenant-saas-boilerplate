package services

import "gorm.io/gorm"

type InvoiceService struct {
	db *gorm.DB
}

func NewInvoiceService(db *gorm.DB) *InvoiceService {
	return &InvoiceService{db: db}
}
