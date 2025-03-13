package services

import (
	"github.com/factostack/orderly/server/database/models"
	"gorm.io/gorm"
)

type InventoryService struct {
	db *gorm.DB
}

func NewInventoryService(db *gorm.DB) *InventoryService {
	return &InventoryService{db: db}
}

// GetInventory retrieves inventory for a product
func (s *InventoryService) GetInventory(productID uint) (*models.InventoryItem, error) {
	var inventory models.InventoryItem
	err := s.db.Where("product_id = ?", productID).First(&inventory).Error
	return &inventory, err
}

// UpdateInventory updates inventory for a product
func (s *InventoryService) UpdateInventory(inventory *models.InventoryItem) error {
	return s.db.Save(inventory).Error
}

// GetInventoryHistory retrieves inventory history for a product
func (s *InventoryService) GetInventoryHistory(productID uint) ([]models.InventoryItem, error) {
	var history []models.InventoryItem
	err := s.db.Where("product_id = ?", productID).Order("updated_at desc").Find(&history).Error
	return history, err
}

// GetLowStockProducts retrieves products with low stock
func (s *InventoryService) GetLowStockProducts() ([]models.Product, error) {
	var products []models.Product
	err := s.db.Joins("JOIN inventory_items ON products.id = inventory_items.product_id").
		Where("inventory_items.quantity <= products.min_stock_level").
		Find(&products).Error
	return products, err
}

// GetOutOfStockProducts retrieves products that are out of stock
func (s *InventoryService) GetOutOfStockProducts() ([]models.Product, error) {
	var products []models.Product
	err := s.db.Joins("JOIN inventory_items ON products.id = inventory_items.product_id").
		Where("inventory_items.quantity = 0").
		Find(&products).Error
	return products, err
}
