package services

import "gorm.io/gorm"

type WarehouseService struct {
	db *gorm.DB
}

func NewWarehouseService(db *gorm.DB) *WarehouseService {
	return &WarehouseService{db: db}
}
