package services

import "gorm.io/gorm"

type ShipmentsService struct {
	db *gorm.DB
}

func NewShipmentsService(db *gorm.DB) *ShipmentsService {
	return &ShipmentsService{db: db}
}
