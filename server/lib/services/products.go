package services

import (
	"errors"

	"github.com/factostack/orderly/server/database/models"
	"gorm.io/gorm"
)

type ProductsService struct {
	db *gorm.DB
}

func NewProductsService(db *gorm.DB) *ProductsService {
	return &ProductsService{db: db}
}

// GetProducts retrieves all products for a company
func (s *ProductsService) GetProducts(companyID uint) ([]models.Product, error) {
	var products []models.Product
	err := s.db.Where("company_id = ?", companyID).
		Preload("Category").
		Find(&products).Error
	return products, err
}

// GetProduct retrieves a single product by ID for a company
func (s *ProductsService) GetProduct(id uint, companyID uint) (*models.Product, error) {
	var product models.Product
	err := s.db.Where("id = ? AND company_id = ?", id, companyID).
		Preload("Category").
		First(&product).Error
	if err != nil {
		return nil, err
	}
	return &product, nil
}

// CreateProduct creates a new product
func (s *ProductsService) CreateProduct(product *models.Product) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Verify category exists and belongs to the same company
		var category models.ProductCategory
		if err := tx.Where("id = ? AND company_id = ?", product.CategoryID, product.CompanyID).First(&category).Error; err != nil {
			return errors.New("category not found")
		}

		// Check if SKU is unique within the company
		var existing models.Product
		result := tx.Where("sku = ? AND company_id = ?", product.SKU, product.CompanyID).First(&existing)
		if result.Error == nil {
			return errors.New("product with this SKU already exists")
		}

		return tx.Create(product).Error
	})
}

// UpdateProduct updates an existing product
func (s *ProductsService) UpdateProduct(product *models.Product) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Check if product exists and belongs to the company
		var existing models.Product
		if err := tx.Where("id = ? AND company_id = ?", product.ID, product.CompanyID).First(&existing).Error; err != nil {
			return errors.New("product not found")
		}

		// Verify category exists and belongs to the same company if changed
		if product.CategoryID != existing.CategoryID {
			var category models.ProductCategory
			if err := tx.Where("id = ? AND company_id = ?", product.CategoryID, product.CompanyID).First(&category).Error; err != nil {
				return errors.New("category not found")
			}
		}

		// Check if new SKU conflicts with existing product within the company
		if product.SKU != existing.SKU {
			var skuConflict models.Product
			if err := tx.Where("sku = ? AND company_id = ? AND id != ?", product.SKU, product.CompanyID, product.ID).First(&skuConflict).Error; err == nil {
				return errors.New("product with this SKU already exists")
			}
		}

		return tx.Save(product).Error
	})
}

// DeleteProduct deletes a product
func (s *ProductsService) DeleteProduct(id uint, companyID uint) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Check if product exists and belongs to the company
		var product models.Product
		if err := tx.Where("id = ? AND company_id = ?", id, companyID).First(&product).Error; err != nil {
			return errors.New("product not found")
		}

		// Check if product has inventory
		var inventoryCount int64
		if err := tx.Model(&models.InventoryItem{}).Where("product_id = ?", id).Count(&inventoryCount).Error; err != nil {
			return err
		}

		if inventoryCount > 0 {
			return errors.New("cannot delete product with existing inventory")
		}

		// Check if product is used in any orders
		var orderItemCount int64
		if err := tx.Model(&models.OrderItem{}).Where("product_id = ?", id).Count(&orderItemCount).Error; err != nil {
			return err
		}

		if orderItemCount > 0 {
			return errors.New("cannot delete product that has been used in orders")
		}

		return tx.Delete(&product).Error
	})
}

// GetProductInventory retrieves inventory for a product
func (s *ProductsService) GetProductInventory(productID uint, companyID uint) ([]models.InventoryItem, error) {
	var items []models.InventoryItem
	err := s.db.Joins("JOIN products ON inventory_items.product_id = products.id").
		Where("products.id = ? AND products.company_id = ?", productID, companyID).
		Preload("Warehouse").
		Find(&items).Error
	return items, err
}

// GetProductsByCategory retrieves all products in a category for a company
func (s *ProductsService) GetProductsByCategory(categoryID uint, companyID uint) ([]models.Product, error) {
	var products []models.Product
	err := s.db.Where("category_id = ? AND company_id = ?", categoryID, companyID).Find(&products).Error
	return products, err
}

// UpdateProductStatus updates the active status of a product
func (s *ProductsService) UpdateProductStatus(productID uint, companyID uint, active bool) error {
	return s.db.Model(&models.Product{}).
		Where("id = ? AND company_id = ?", productID, companyID).
		Update("active", active).Error
}

// UpdateProductPrice updates the base price of a product
func (s *ProductsService) UpdateProductPrice(productID uint, companyID uint, newPrice float64) error {
	return s.db.Model(&models.Product{}).
		Where("id = ? AND company_id = ?", productID, companyID).
		Update("base_price", newPrice).Error
}

// UpdateProductStockLevel updates the minimum stock level of a product
func (s *ProductsService) UpdateProductStockLevel(productID uint, companyID uint, minStockLevel float64) error {
	return s.db.Model(&models.Product{}).
		Where("id = ? AND company_id = ?", productID, companyID).
		Update("min_stock_level", minStockLevel).Error
}
