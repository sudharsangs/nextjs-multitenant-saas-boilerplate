package models

import "time"

type Order struct {
	OrderID       uint      `gorm:"primaryKey;column:order_id"`
	CustomerID    uint      `gorm:"not null"`
	AddressID     uint      `gorm:"not null"`
	UserID        uint      `gorm:"not null"`
	TotalAmount   float64   `gorm:"type:decimal(10,2);not null"`
	Status        string    `gorm:"not null"`
	OrderDate     time.Time `gorm:"not null"`
	PaymentStatus string    `gorm:"not null"`
	TaxAmount     float64   `gorm:"type:decimal(10,2)"`
	Currency      string    `gorm:"not null"`
	CreatedBy     uint      `gorm:"not null"`
	UpdatedBy     uint      `gorm:"not null"`

	// Relationships
	Customer     Customer      `gorm:"foreignKey:CustomerID"`
	Address      Address       `gorm:"foreignKey:AddressID"`
	User         User          `gorm:"foreignKey:UserID"`
	OrderItems   []OrderItem   `gorm:"foreignKey:OrderID"`
	Invoices     []Invoice     `gorm:"foreignKey:OrderID"`
	Shipments    []Shipment    `gorm:"foreignKey:OrderID"`
	ReturnOrders []ReturnOrder `gorm:"foreignKey:OrderID"`
}
