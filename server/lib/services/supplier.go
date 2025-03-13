package services

import (
	"errors"

	"github.com/factostack/orderly/server/database/models"
	"gorm.io/gorm"
)

type SupplierService struct {
	db *gorm.DB
}

func NewSupplierService(db *gorm.DB) *SupplierService {
	return &SupplierService{db: db}
}

// GetSuppliers retrieves all suppliers
func (s *SupplierService) GetSuppliers() ([]models.Supplier, error) {
	var suppliers []models.Supplier
	err := s.db.Find(&suppliers).Error
	return suppliers, err
}

// GetSupplier retrieves a single supplier by ID
func (s *SupplierService) GetSupplier(id uint) (*models.Supplier, error) {
	var supplier models.Supplier
	err := s.db.First(&supplier, id).Error
	if err != nil {
		return nil, err
	}
	return &supplier, nil
}

// CreateSupplier creates a new supplier
func (s *SupplierService) CreateSupplier(supplier *models.Supplier) error {
	// Check if supplier with same email already exists
	var existing models.Supplier
	result := s.db.Where("email = ?", supplier.Email).First(&existing)
	if result.Error == nil {
		return errors.New("supplier with this email already exists")
	}

	return s.db.Create(supplier).Error
}

// UpdateSupplier updates an existing supplier
func (s *SupplierService) UpdateSupplier(supplier *models.Supplier) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Check if supplier exists
		var existing models.Supplier
		if err := tx.First(&existing, supplier.ID).Error; err != nil {
			return errors.New("supplier not found")
		}

		// Check if new email conflicts with existing supplier
		if supplier.Email != existing.Email {
			var emailConflict models.Supplier
			if err := tx.Where("email = ? AND id != ?", supplier.Email, supplier.ID).First(&emailConflict).Error; err == nil {
				return errors.New("supplier with this email already exists")
			}
		}

		return tx.Save(supplier).Error
	})
}

// DeleteSupplier deletes a supplier
func (s *SupplierService) DeleteSupplier(id uint) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Check if supplier exists
		var supplier models.Supplier
		if err := tx.First(&supplier, id).Error; err != nil {
			return errors.New("supplier not found")
		}

		// Check if supplier has any purchase orders
		var poCount int64
		if err := tx.Model(&models.PurchaseOrder{}).Where("supplier_id = ?", id).Count(&poCount).Error; err != nil {
			return err
		}

		if poCount > 0 {
			return errors.New("cannot delete supplier with existing purchase orders")
		}

		return tx.Delete(&supplier).Error
	})
}

// GetSupplierPurchaseOrders retrieves all purchase orders for a supplier
func (s *SupplierService) GetSupplierPurchaseOrders(supplierID uint) ([]models.PurchaseOrder, error) {
	var orders []models.PurchaseOrder
	err := s.db.Where("supplier_id = ?", supplierID).
		Preload("Items").
		Find(&orders).Error
	return orders, err
}

// GetSupplierProducts retrieves all products supplied by a supplier
func (s *SupplierService) GetSupplierProducts(supplierID uint) ([]models.Product, error) {
	var products []models.Product
	err := s.db.Joins("JOIN purchase_order_items ON products.id = purchase_order_items.product_id").
		Joins("JOIN purchase_orders ON purchase_order_items.po_id = purchase_orders.id").
		Where("purchase_orders.supplier_id = ?", supplierID).
		Distinct().
		Find(&products).Error
	return products, err
}

// UpdateSupplierStatus updates the active status of a supplier
func (s *SupplierService) UpdateSupplierStatus(supplierID uint, active bool) error {
	return s.db.Model(&models.Supplier{}).
		Where("id = ?", supplierID).
		Update("active", active).Error
}

// GetSupplierPaymentHistory retrieves payment history for a supplier
func (s *SupplierService) GetSupplierPaymentHistory(supplierID uint) ([]models.PaymentTransaction, error) {
	var transactions []models.PaymentTransaction
	err := s.db.Where("supplier_id = ?", supplierID).
		Order("created_at DESC").
		Find(&transactions).Error
	return transactions, err
}

// GetSupplierBalance retrieves the current balance for a supplier
func (s *SupplierService) GetSupplierBalance(supplierID uint) (float64, error) {
	var balance float64
	err := s.db.Model(&models.PaymentTransaction{}).
		Where("supplier_id = ?", supplierID).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&balance).Error
	return balance, err
}
