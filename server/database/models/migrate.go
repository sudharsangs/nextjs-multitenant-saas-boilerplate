package models

import (
	"fmt"

	"gorm.io/gorm"
)

// Migrate : migrate models
func Migrate(db *gorm.DB) error {
	if db == nil {
		return fmt.Errorf("database connection is nil")
	}

	// Remove duplicate Address{} and ensure all models exist
	err := db.AutoMigrate(
		&Address{},
		&Permission{},
		&Role{},
		&RolePermission{},
		&User{},
		&UserRole{},
		&Customer{},
		&Supplier{},
		&Warehouse{},
		&ProductCategory{},
		&Product{},
		&InventoryItem{},
		&Order{},
		&OrderItem{},
		&ReturnOrder{},
		&PurchaseOrder{},
		&PurchaseOrderItem{},
		&Shipment{},
		&Invoice{},
		&InvoiceItem{},
		&PaymentMethod{},
		&PaymentTransaction{},
		&AuditLog{},
	)
	if err != nil {
		return fmt.Errorf("failed to migrate database: %v", err)
	}

	return nil
}
