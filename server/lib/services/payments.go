package services

import "gorm.io/gorm"

type PaymentsService struct {
	db *gorm.DB
}

func NewPaymentsService(db *gorm.DB) *PaymentsService {
	return &PaymentsService{db: db}
}
