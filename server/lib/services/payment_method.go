package services

import "gorm.io/gorm"

type PaymentMethodService struct {
	db *gorm.DB
}

func NewPaymentMethodService(db *gorm.DB) *PaymentMethodService {
	return &PaymentMethodService{db: db}
}
