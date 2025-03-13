package services

import (
	"github.com/factostack/orderly/server/database/models"
	"gorm.io/gorm"
)

type InvoiceService struct {
	db *gorm.DB
}

func NewInvoiceService(db *gorm.DB) *InvoiceService {
	return &InvoiceService{db: db}
}

// GetInvoices retrieves all invoices
func (s *InvoiceService) GetInvoices() ([]models.Invoice, error) {
	var invoices []models.Invoice
	err := s.db.Find(&invoices).Error
	return invoices, err
}

// GetInvoice retrieves a single invoice by ID
func (s *InvoiceService) GetInvoice(id uint) (*models.Invoice, error) {
	var invoice models.Invoice
	err := s.db.First(&invoice, id).Error
	return &invoice, err
}

// CreateInvoice creates a new invoice
func (s *InvoiceService) CreateInvoice(invoice *models.Invoice) error {
	return s.db.Create(invoice).Error
}

// UpdateInvoice updates an existing invoice
func (s *InvoiceService) UpdateInvoice(invoice *models.Invoice) error {
	return s.db.Save(invoice).Error
}

// DeleteInvoice deletes an invoice
func (s *InvoiceService) DeleteInvoice(id uint) error {
	return s.db.Delete(&models.Invoice{}, id).Error
}

// GetInvoiceItems retrieves all items for an invoice
func (s *InvoiceService) GetInvoiceItems(invoiceID uint) ([]models.InvoiceItem, error) {
	var items []models.InvoiceItem
	err := s.db.Where("invoice_id = ?", invoiceID).Find(&items).Error
	return items, err
}

// AddInvoiceItem adds a new item to an invoice
func (s *InvoiceService) AddInvoiceItem(item *models.InvoiceItem) error {
	return s.db.Create(item).Error
}

// UpdateInvoiceItem updates an existing invoice item
func (s *InvoiceService) UpdateInvoiceItem(item *models.InvoiceItem) error {
	return s.db.Save(item).Error
}

// DeleteInvoiceItem deletes an invoice item
func (s *InvoiceService) DeleteInvoiceItem(id uint) error {
	return s.db.Delete(&models.InvoiceItem{}, id).Error
}
