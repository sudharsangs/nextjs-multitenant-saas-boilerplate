package models

type Address struct {
	AddressID  uint   `gorm:"primaryKey;column:address_id"`
	CustomerID uint   `gorm:"not null"`
	Street     string `gorm:"not null"`
	City       string `gorm:"not null"`
	State      string `gorm:"not null"`
	Country    string `gorm:"not null"`
	PostalCode string `gorm:"not null"`
	IsDefault  bool   `gorm:"default:false"`

	// Relationships
	Customer Customer `gorm:"foreignKey:CustomerID"`
	Orders   []Order  `gorm:"foreignKey:AddressID"`
}
