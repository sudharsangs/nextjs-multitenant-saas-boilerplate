package services

import (
	"errors"
	"time"

	"github.com/factostack/orderly/server/database/models"
	"gorm.io/gorm"
)

type PaymentMethodService struct {
	db *gorm.DB
}

func NewPaymentMethodService(db *gorm.DB) *PaymentMethodService {
	return &PaymentMethodService{db: db}
}

// GetPaymentMethods retrieves all payment methods for a customer
func (s *PaymentMethodService) GetPaymentMethods(customerID uint) ([]models.PaymentMethod, error) {
	var methods []models.PaymentMethod
	err := s.db.Where("customer_id = ?", customerID).Find(&methods).Error
	return methods, err
}

// GetPaymentMethod retrieves a single payment method by ID
func (s *PaymentMethodService) GetPaymentMethod(id uint, customerID uint) (*models.PaymentMethod, error) {
	var method models.PaymentMethod
	err := s.db.Where("id = ? AND customer_id = ?", id, customerID).First(&method).Error
	if err != nil {
		return nil, err
	}
	return &method, nil
}

// CreatePaymentMethod creates a new payment method
func (s *PaymentMethodService) CreatePaymentMethod(method *models.PaymentMethod) error {
	// Verify customer exists
	var customer models.Customer
	if err := s.db.First(&customer, method.CustomerID).Error; err != nil {
		return errors.New("customer not found")
	}

	// If this is the first payment method, set it as default
	var count int64
	if err := s.db.Model(&models.PaymentMethod{}).Where("customer_id = ?", method.CustomerID).Count(&count).Error; err != nil {
		return err
	}

	if count == 0 {
		method.IsDefault = true
	}

	return s.db.Create(method).Error
}

// UpdatePaymentMethod updates an existing payment method
func (s *PaymentMethodService) UpdatePaymentMethod(method *models.PaymentMethod) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Verify payment method exists and belongs to customer
		var existing models.PaymentMethod
		if err := tx.Where("id = ? AND customer_id = ?", method.ID, method.CustomerID).First(&existing).Error; err != nil {
			return errors.New("payment method not found")
		}

		// Update fields
		existing.Type = method.Type
		existing.Details = method.Details
		existing.ExpiryDate = method.ExpiryDate

		return tx.Save(&existing).Error
	})
}

// DeletePaymentMethod deletes a payment method
func (s *PaymentMethodService) DeletePaymentMethod(id uint, customerID uint) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Verify payment method exists and belongs to customer
		var method models.PaymentMethod
		if err := tx.Where("id = ? AND customer_id = ?", id, customerID).First(&method).Error; err != nil {
			return errors.New("payment method not found")
		}

		// If this is the default payment method, we need to set another one as default
		if method.IsDefault {
			// Find another payment method for this customer
			var alternative models.PaymentMethod
			if err := tx.Where("customer_id = ? AND id != ?", customerID, id).First(&alternative).Error; err == nil {
				alternative.IsDefault = true
				if err := tx.Save(&alternative).Error; err != nil {
					return err
				}
			}
		}

		return tx.Delete(&method).Error
	})
}

// SetDefaultPaymentMethod sets a payment method as default
func (s *PaymentMethodService) SetDefaultPaymentMethod(id uint, customerID uint) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Verify payment method exists and belongs to customer
		var method models.PaymentMethod
		if err := tx.Where("id = ? AND customer_id = ?", id, customerID).First(&method).Error; err != nil {
			return errors.New("payment method not found")
		}

		// Remove default status from all other payment methods
		if err := tx.Model(&models.PaymentMethod{}).
			Where("customer_id = ? AND id != ?", customerID, id).
			Update("is_default", false).Error; err != nil {
			return err
		}

		// Set this payment method as default
		method.IsDefault = true
		return tx.Save(&method).Error
	})
}

// ValidatePaymentMethod validates a payment method's details
func (s *PaymentMethodService) ValidatePaymentMethod(method *models.PaymentMethod) error {
	// Check if payment method is expired
	if !method.ExpiryDate.IsZero() && method.ExpiryDate.Before(time.Now()) {
		return errors.New("payment method has expired")
	}

	// Add additional validation based on payment method type
	switch method.Type {
	case "credit_card":
		// Validate credit card details (implement according to your requirements)
		if len(method.Details) < 16 {
			return errors.New("invalid credit card details")
		}
	case "bank_account":
		// Validate bank account details (implement according to your requirements)
		if len(method.Details) < 8 {
			return errors.New("invalid bank account details")
		}
	default:
		return errors.New("unsupported payment method type")
	}

	return nil
}
