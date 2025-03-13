package services

import (
	"errors"
	"time"

	"github.com/factostack/orderly/server/database/models"
	"gorm.io/gorm"
)

type InvoiceService struct {
	db *gorm.DB
}

func NewInvoiceService(db *gorm.DB) *InvoiceService {
	return &InvoiceService{db: db}
}

// GetInvoices retrieves all invoices for a company
func (s *InvoiceService) GetInvoices(companyID uint) ([]models.Invoice, error) {
	var invoices []models.Invoice
	err := s.db.Where("company_id = ?", companyID).
		Preload("Customer").
		Preload("Items").
		Find(&invoices).Error
	return invoices, err
}

// GetInvoice retrieves a single invoice by ID
func (s *InvoiceService) GetInvoice(id uint, companyID uint) (*models.Invoice, error) {
	var invoice models.Invoice
	err := s.db.Where("id = ? AND company_id = ?", id, companyID).
		Preload("Customer").
		Preload("Items").
		First(&invoice).Error
	if err != nil {
		return nil, err
	}
	return &invoice, nil
}

// CreateInvoice creates a new invoice
func (s *InvoiceService) CreateInvoice(invoice *models.Invoice) error {
	// Start transaction
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Set invoice date if not provided
		if invoice.InvoiceDate.IsZero() {
			invoice.InvoiceDate = time.Now()
		}

		// Set due date if not provided (default to 30 days from invoice date)
		if invoice.DueDate.IsZero() {
			invoice.DueDate = invoice.InvoiceDate.AddDate(0, 0, 30)
		}

		// Calculate total amount
		var totalAmount float64
		for _, item := range invoice.Items {
			totalAmount += float64(item.Quantity) * item.UnitPrice
		}
		invoice.TotalAmount = totalAmount

		// Create invoice
		if err := tx.Create(invoice).Error; err != nil {
			return err
		}

		// Create invoice items
		for _, item := range invoice.Items {
			item.InvoiceID = invoice.ID
			if err := tx.Create(&item).Error; err != nil {
				return err
			}
		}

		return nil
	})
}

// UpdateInvoice updates an existing invoice
func (s *InvoiceService) UpdateInvoice(invoice *models.Invoice) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Update invoice
		if err := tx.Save(invoice).Error; err != nil {
			return err
		}

		// Delete existing items
		if err := tx.Where("invoice_id = ?", invoice.ID).Delete(&models.InvoiceItem{}).Error; err != nil {
			return err
		}

		// Create new items
		for _, item := range invoice.Items {
			item.InvoiceID = invoice.ID
			if err := tx.Create(&item).Error; err != nil {
				return err
			}
		}

		return nil
	})
}

// DeleteInvoice deletes an invoice
func (s *InvoiceService) DeleteInvoice(id uint, companyID uint) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Delete invoice items first
		if err := tx.Where("invoice_id = ?", id).Delete(&models.InvoiceItem{}).Error; err != nil {
			return err
		}

		// Delete invoice
		result := tx.Where("id = ? AND company_id = ?", id, companyID).Delete(&models.Invoice{})
		if result.RowsAffected == 0 {
			return errors.New("invoice not found")
		}
		return result.Error
	})
}

// GetInvoiceItems retrieves all items for an invoice
func (s *InvoiceService) GetInvoiceItems(invoiceID uint) ([]models.InvoiceItem, error) {
	var items []models.InvoiceItem
	err := s.db.Where("invoice_id = ?", invoiceID).Find(&items).Error
	return items, err
}

// AddInvoiceItem adds a new item to an invoice
func (s *InvoiceService) AddInvoiceItem(item *models.InvoiceItem) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Verify invoice exists
		var invoice models.Invoice
		if err := tx.First(&invoice, item.InvoiceID).Error; err != nil {
			return err
		}

		// Create item
		if err := tx.Create(item).Error; err != nil {
			return err
		}

		// Update invoice total
		var totalAmount float64
		if err := tx.Model(&models.InvoiceItem{}).
			Where("invoice_id = ?", item.InvoiceID).
			Select("COALESCE(SUM(quantity * unit_price), 0)").
			Scan(&totalAmount).Error; err != nil {
			return err
		}

		return tx.Model(&invoice).Update("total_amount", totalAmount).Error
	})
}

// UpdateInvoiceItem updates an existing invoice item
func (s *InvoiceService) UpdateInvoiceItem(item *models.InvoiceItem) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Update item
		if err := tx.Save(item).Error; err != nil {
			return err
		}

		// Update invoice total
		var totalAmount float64
		if err := tx.Model(&models.InvoiceItem{}).
			Where("invoice_id = ?", item.InvoiceID).
			Select("COALESCE(SUM(quantity * unit_price), 0)").
			Scan(&totalAmount).Error; err != nil {
			return err
		}

		return tx.Model(&models.Invoice{}).
			Where("id = ?", item.InvoiceID).
			Update("total_amount", totalAmount).Error
	})
}

// DeleteInvoiceItem deletes an invoice item
func (s *InvoiceService) DeleteInvoiceItem(itemID uint) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Get item to find invoice ID
		var item models.InvoiceItem
		if err := tx.First(&item, itemID).Error; err != nil {
			return err
		}

		// Delete item
		if err := tx.Delete(&item).Error; err != nil {
			return err
		}

		// Update invoice total
		var totalAmount float64
		if err := tx.Model(&models.InvoiceItem{}).
			Where("invoice_id = ?", item.InvoiceID).
			Select("COALESCE(SUM(quantity * unit_price), 0)").
			Scan(&totalAmount).Error; err != nil {
			return err
		}

		return tx.Model(&models.Invoice{}).
			Where("id = ?", item.InvoiceID).
			Update("total_amount", totalAmount).Error
	})
}
