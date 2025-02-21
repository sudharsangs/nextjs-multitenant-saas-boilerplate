package services

import "gorm.io/gorm"

type ReturnsService struct {
	db *gorm.DB
}

func NewReturnsService(db *gorm.DB) *ReturnsService {
	return &ReturnsService{db: db}
}
