package models

type Supplier struct {
	SupplierID    uint   `gorm:"primaryKey;column:supplier_id"`
	Name          string `gorm:"not null"`
	ContactPerson string
	Email         string `gorm:"not null"`
	Phone         string
	PaymentTerms  string
	CreatedBy     uint `gorm:"not null"`
	UpdatedBy     uint `gorm:"not null"`

	// Relationships
	PurchaseOrders []PurchaseOrder `gorm:"foreignKey:SupplierID"`
}
