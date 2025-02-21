package services

import "gorm.io/gorm"

type SuppliersService struct {
	db *gorm.DB
}

func NewSuppliersService(db *gorm.DB) *SuppliersService {
	return &SuppliersService{db: db}
}
