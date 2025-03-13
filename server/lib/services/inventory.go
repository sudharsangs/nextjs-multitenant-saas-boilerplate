package services

import (
	"errors"

	"github.com/factostack/orderly/server/database/models"
	"gorm.io/gorm"
)

type InventoryService struct {
	db *gorm.DB
}

func NewInventoryService(db *gorm.DB) *InventoryService {
	return &InventoryService{db: db}
}

// GetInventory retrieves inventory for a specific product
func (s *InventoryService) GetInventory(productID uint) ([]models.InventoryItem, error) {
	var items []models.InventoryItem
	err := s.db.Where("product_id = ?", productID).
		Preload("Product").
		Preload("Warehouse").
		Find(&items).Error
	return items, err
}

// UpdateInventory updates inventory for a product
func (s *InventoryService) UpdateInventory(item *models.InventoryItem) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Verify product exists
		var product models.Product
		if err := tx.First(&product, item.ProductID).Error; err != nil {
			return errors.New("product not found")
		}

		// Verify warehouse exists
		var warehouse models.Warehouse
		if err := tx.First(&warehouse, item.WarehouseID).Error; err != nil {
			return errors.New("warehouse not found")
		}

		// Check if inventory item exists
		var existingItem models.InventoryItem
		result := tx.Where("product_id = ? AND warehouse_id = ?", item.ProductID, item.WarehouseID).
			First(&existingItem)

		if result.Error == nil {
			// Update existing item
			existingItem.Quantity = item.Quantity
			existingItem.LotNumber = item.LotNumber
			existingItem.ExpiryDate = item.ExpiryDate
			existingItem.Location = item.Location
			existingItem.UpdatedBy = item.UpdatedBy
			return tx.Save(&existingItem).Error
		}

		// Create new item
		return tx.Create(item).Error
	})
}

// GetInventoryHistory retrieves inventory history for a product
func (s *InventoryService) GetInventoryHistory(productID uint) ([]models.InventoryItem, error) {
	var items []models.InventoryItem
	err := s.db.Where("product_id = ?", productID).
		Preload("Product").
		Preload("Warehouse").
		Order("updated_at DESC").
		Find(&items).Error
	return items, err
}

// GetLowStockProducts retrieves products with stock below minimum level
func (s *InventoryService) GetLowStockProducts(warehouseID uint) ([]models.Product, error) {
	var products []models.Product
	err := s.db.Joins("JOIN inventory_items ON products.id = inventory_items.product_id").
		Where("inventory_items.warehouse_id = ? AND inventory_items.quantity <= products.min_stock_level", warehouseID).
		Find(&products).Error
	return products, err
}

// GetOutOfStockProducts retrieves products with zero stock
func (s *InventoryService) GetOutOfStockProducts(warehouseID uint) ([]models.Product, error) {
	var products []models.Product
	err := s.db.Joins("JOIN inventory_items ON products.id = inventory_items.product_id").
		Where("inventory_items.warehouse_id = ? AND inventory_items.quantity = 0", warehouseID).
		Find(&products).Error
	return products, err
}

// AdjustInventory adjusts inventory quantity for a product
func (s *InventoryService) AdjustInventory(productID, warehouseID uint, quantity int, reason string, updatedBy uint) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Get current inventory
		var item models.InventoryItem
		result := tx.Where("product_id = ? AND warehouse_id = ?", productID, warehouseID).
			First(&item)

		if result.Error == nil {
			// Update existing item
			item.Quantity += quantity
			item.UpdatedBy = updatedBy
			return tx.Save(&item).Error
		}

		// Create new item if it doesn't exist
		item = models.InventoryItem{
			ProductID:   productID,
			WarehouseID: warehouseID,
			Quantity:    quantity,
			UpdatedBy:   updatedBy,
		}
		return tx.Create(&item).Error
	})
}

// TransferInventory transfers inventory between warehouses
func (s *InventoryService) TransferInventory(productID, fromWarehouseID, toWarehouseID uint, quantity int, updatedBy uint) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Check if source warehouse has enough stock
		var sourceItem models.InventoryItem
		if err := tx.Where("product_id = ? AND warehouse_id = ?", productID, fromWarehouseID).
			First(&sourceItem).Error; err != nil {
			return errors.New("source warehouse inventory not found")
		}

		if sourceItem.Quantity < quantity {
			return errors.New("insufficient stock in source warehouse")
		}

		// Update source warehouse inventory
		sourceItem.Quantity -= quantity
		sourceItem.UpdatedBy = updatedBy
		if err := tx.Save(&sourceItem).Error; err != nil {
			return err
		}

		// Update or create destination warehouse inventory
		var destItem models.InventoryItem
		result := tx.Where("product_id = ? AND warehouse_id = ?", productID, toWarehouseID).
			First(&destItem)

		if result.Error == nil {
			destItem.Quantity += quantity
			destItem.UpdatedBy = updatedBy
			return tx.Save(&destItem).Error
		}

		destItem = models.InventoryItem{
			ProductID:   productID,
			WarehouseID: toWarehouseID,
			Quantity:    quantity,
			UpdatedBy:   updatedBy,
		}
		return tx.Create(&destItem).Error
	})
}
