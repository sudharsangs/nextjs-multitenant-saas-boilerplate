package services

import (
	"errors"

	"github.com/factostack/orderly/server/database/models"
	"gorm.io/gorm"
)

type WarehouseService struct {
	db *gorm.DB
}

func NewWarehouseService(db *gorm.DB) *WarehouseService {
	return &WarehouseService{db: db}
}

// GetWarehouses retrieves all warehouses for a company
func (s *WarehouseService) GetWarehouses(companyID uint) ([]models.Warehouse, error) {
	var warehouses []models.Warehouse
	err := s.db.Where("company_id = ?", companyID).Find(&warehouses).Error
	return warehouses, err
}

// GetWarehouse retrieves a single warehouse by ID for a company
func (s *WarehouseService) GetWarehouse(id uint, companyID uint) (*models.Warehouse, error) {
	var warehouse models.Warehouse
	err := s.db.Where("id = ? AND company_id = ?", id, companyID).First(&warehouse).Error
	if err != nil {
		return nil, err
	}
	return &warehouse, nil
}

// CreateWarehouse creates a new warehouse
func (s *WarehouseService) CreateWarehouse(warehouse *models.Warehouse) error {
	// Check if warehouse with same name already exists in the company
	var existing models.Warehouse
	result := s.db.Where("name = ? AND company_id = ?", warehouse.Name, warehouse.CompanyID).First(&existing)
	if result.Error == nil {
		return errors.New("warehouse with this name already exists")
	}

	return s.db.Create(warehouse).Error
}

// UpdateWarehouse updates an existing warehouse
func (s *WarehouseService) UpdateWarehouse(warehouse *models.Warehouse) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Check if warehouse exists and belongs to the company
		var existing models.Warehouse
		if err := tx.Where("id = ? AND company_id = ?", warehouse.ID, warehouse.CompanyID).First(&existing).Error; err != nil {
			return errors.New("warehouse not found")
		}

		// Check if new name conflicts with existing warehouse in the company
		if warehouse.Name != existing.Name {
			var nameConflict models.Warehouse
			if err := tx.Where("name = ? AND company_id = ? AND id != ?", warehouse.Name, warehouse.CompanyID, warehouse.ID).First(&nameConflict).Error; err == nil {
				return errors.New("warehouse with this name already exists")
			}
		}

		return tx.Save(warehouse).Error
	})
}

// DeleteWarehouse deletes a warehouse
func (s *WarehouseService) DeleteWarehouse(id uint, companyID uint) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Check if warehouse exists and belongs to the company
		var warehouse models.Warehouse
		if err := tx.Where("id = ? AND company_id = ?", id, companyID).First(&warehouse).Error; err != nil {
			return errors.New("warehouse not found")
		}

		// Check if warehouse has inventory
		var inventoryCount int64
		if err := tx.Model(&models.InventoryItem{}).Where("warehouse_id = ?", id).Count(&inventoryCount).Error; err != nil {
			return err
		}

		if inventoryCount > 0 {
			return errors.New("cannot delete warehouse with existing inventory")
		}

		return tx.Delete(&warehouse).Error
	})
}

// GetWarehouseInventory retrieves all inventory items in a warehouse
func (s *WarehouseService) GetWarehouseInventory(warehouseID uint, companyID uint) ([]models.InventoryItem, error) {
	var items []models.InventoryItem
	err := s.db.Joins("JOIN warehouses ON inventory_items.warehouse_id = warehouses.id").
		Where("warehouses.id = ? AND warehouses.company_id = ?", warehouseID, companyID).
		Preload("Product").
		Find(&items).Error
	return items, err
}

// GetWarehouseLowStock retrieves products with stock below minimum level
func (s *WarehouseService) GetWarehouseLowStock(warehouseID uint, companyID uint) ([]models.Product, error) {
	var products []models.Product
	err := s.db.Joins("JOIN inventory_items ON products.id = inventory_items.product_id").
		Joins("JOIN warehouses ON inventory_items.warehouse_id = warehouses.id").
		Where("warehouses.id = ? AND warehouses.company_id = ? AND inventory_items.quantity <= products.min_stock_level", warehouseID, companyID).
		Find(&products).Error
	return products, err
}

// GetWarehouseOutOfStock retrieves products with zero stock
func (s *WarehouseService) GetWarehouseOutOfStock(warehouseID uint, companyID uint) ([]models.Product, error) {
	var products []models.Product
	err := s.db.Joins("JOIN inventory_items ON products.id = inventory_items.product_id").
		Joins("JOIN warehouses ON inventory_items.warehouse_id = warehouses.id").
		Where("warehouses.id = ? AND warehouses.company_id = ? AND inventory_items.quantity = 0", warehouseID, companyID).
		Find(&products).Error
	return products, err
}

// GetWarehouseCapacity retrieves the current capacity usage of a warehouse
func (s *WarehouseService) GetWarehouseCapacity(warehouseID uint, companyID uint) (float64, error) {
	var totalQuantity int
	err := s.db.Model(&models.InventoryItem{}).
		Joins("JOIN warehouses ON inventory_items.warehouse_id = warehouses.id").
		Where("warehouses.id = ? AND warehouses.company_id = ?", warehouseID, companyID).
		Select("COALESCE(SUM(quantity), 0)").
		Scan(&totalQuantity).Error
	return float64(totalQuantity), err
}

// UpdateWarehouseStatus updates the active status of a warehouse
func (s *WarehouseService) UpdateWarehouseStatus(warehouseID uint, companyID uint, active bool) error {
	return s.db.Model(&models.Warehouse{}).
		Where("id = ? AND company_id = ?", warehouseID, companyID).
		Update("active", active).Error
}

// TransferWarehouseInventory transfers inventory between warehouses
func (s *WarehouseService) TransferWarehouseInventory(warehouseID uint, companyID uint, fromWarehouseID uint, toWarehouseID uint, productID uint, quantity int) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Check if source warehouse has enough inventory
		var sourceInventory models.InventoryItem
		if err := tx.Where("warehouse_id = ? AND product_id = ?", fromWarehouseID, productID).First(&sourceInventory).Error; err != nil {
			return errors.New("source warehouse inventory not found")
		}

		if int(sourceInventory.Quantity) < quantity {
			return errors.New("insufficient inventory in source warehouse")
		}
		// Update source warehouse inventory
		sourceInventory.Quantity -= quantity
		if err := tx.Save(&sourceInventory).Error; err != nil {
			return err
		}

		// Update destination warehouse inventory
		var destinationInventory models.InventoryItem
		if err := tx.Where("warehouse_id = ? AND product_id = ?", toWarehouseID, productID).First(&destinationInventory).Error; err != nil {
			return errors.New("destination warehouse inventory not found")
		}

		destinationInventory.Quantity += quantity
		if err := tx.Save(&destinationInventory).Error; err != nil {
			return err
		}

		return nil
	})
}
