package services

import "gorm.io/gorm"

type ShipmentService struct {
	db *gorm.DB
}

func NewShipmentService(db *gorm.DB) *ShipmentService {
	return &ShipmentService{db: db}
}
