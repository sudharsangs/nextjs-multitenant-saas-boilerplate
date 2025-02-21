package services

import "gorm.io/gorm"

type TransactionsService struct {
	db *gorm.DB
}

func NewTransactionsService(db *gorm.DB) *TransactionsService {
	return &TransactionsService{db: db}
}
