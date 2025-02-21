package models

type ProductCategory struct {
	CategoryID  uint   `gorm:"primaryKey;column:category_id"`
	Name        string `gorm:"uniqueIndex;not null"`
	Description string
	Active      bool `gorm:"default:true"`

	// Relationships
	Products []Product `gorm:"foreignKey:CategoryID"`
}
