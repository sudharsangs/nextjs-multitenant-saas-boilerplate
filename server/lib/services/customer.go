package services

import "gorm.io/gorm"

type CustomersService struct {
	db *gorm.DB
}

func NewCustomersService(db *gorm.DB) *CustomersService {
	return &CustomersService{db: db}
}
