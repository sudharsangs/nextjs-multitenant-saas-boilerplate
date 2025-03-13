package services

import (
	"errors"

	"github.com/factostack/orderly/server/database/models"
	"gorm.io/gorm"
)

type CategoryService struct {
	db *gorm.DB
}

func NewCategoryService(db *gorm.DB) *CategoryService {
	return &CategoryService{db: db}
}

// GetCategories retrieves all product categories for a company
func (s *CategoryService) GetCategories(companyID uint) ([]models.ProductCategory, error) {
	var categories []models.ProductCategory
	err := s.db.Where("company_id = ?", companyID).Find(&categories).Error
	return categories, err
}

// GetCategory retrieves a single category by ID for a company
func (s *CategoryService) GetCategory(id uint, companyID uint) (*models.ProductCategory, error) {
	var category models.ProductCategory
	err := s.db.Where("id = ? AND company_id = ?", id, companyID).First(&category).Error
	if err != nil {
		return nil, err
	}
	return &category, nil
}

// CreateCategory creates a new product category
func (s *CategoryService) CreateCategory(category *models.ProductCategory) error {
	// Check if category with same name already exists in the company
	var existing models.ProductCategory
	result := s.db.Where("name = ? AND company_id = ?", category.Name, category.CompanyID).First(&existing)
	if result.Error == nil {
		return errors.New("category with this name already exists")
	}

	return s.db.Create(category).Error
}

// UpdateCategory updates an existing product category
func (s *CategoryService) UpdateCategory(category *models.ProductCategory) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Check if category exists and belongs to the company
		var existing models.ProductCategory
		if err := tx.Where("id = ? AND company_id = ?", category.ID, category.CompanyID).First(&existing).Error; err != nil {
			return errors.New("category not found")
		}

		// Check if new name conflicts with existing category in the company
		if category.Name != existing.Name {
			var nameConflict models.ProductCategory
			if err := tx.Where("name = ? AND company_id = ? AND id != ?", category.Name, category.CompanyID, category.ID).First(&nameConflict).Error; err == nil {
				return errors.New("category with this name already exists")
			}
		}

		// If parent is set, verify it belongs to the same company
		if category.ParentID != nil {
			var parent models.ProductCategory
			if err := tx.Where("id = ? AND company_id = ?", *category.ParentID, category.CompanyID).First(&parent).Error; err != nil {
				return errors.New("parent category not found")
			}
		}

		return tx.Save(category).Error
	})
}

// DeleteCategory deletes a product category
func (s *CategoryService) DeleteCategory(id uint, companyID uint) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Check if category exists and belongs to the company
		var category models.ProductCategory
		if err := tx.Where("id = ? AND company_id = ?", id, companyID).First(&category).Error; err != nil {
			return errors.New("category not found")
		}

		// Check if category has products
		var productCount int64
		if err := tx.Model(&models.Product{}).Where("category_id = ?", id).Count(&productCount).Error; err != nil {
			return err
		}

		if productCount > 0 {
			return errors.New("cannot delete category with associated products")
		}

		return tx.Delete(&category).Error
	})
}

// GetCategoryProducts retrieves all products in a category for a company
func (s *CategoryService) GetCategoryProducts(categoryID uint, companyID uint) ([]models.Product, error) {
	var products []models.Product
	err := s.db.Where("category_id = ? AND company_id = ?", categoryID, companyID).Find(&products).Error
	return products, err
}

// GetCategoryHierarchy retrieves the category hierarchy for a company
func (s *CategoryService) GetCategoryHierarchy(companyID uint) ([]models.ProductCategory, error) {
	var categories []models.ProductCategory
	err := s.db.Where("parent_id IS NULL AND company_id = ?", companyID).
		Preload("Children").
		Find(&categories).Error
	return categories, err
}

// MoveCategory moves a category to a new parent within the same company
func (s *CategoryService) MoveCategory(categoryID uint, newParentID *uint, companyID uint) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Check if category exists and belongs to the company
		var category models.ProductCategory
		if err := tx.Where("id = ? AND company_id = ?", categoryID, companyID).First(&category).Error; err != nil {
			return errors.New("category not found")
		}

		// If new parent is set, verify it belongs to the same company
		if newParentID != nil {
			var parent models.ProductCategory
			if err := tx.Where("id = ? AND company_id = ?", *newParentID, companyID).First(&parent).Error; err != nil {
				return errors.New("parent category not found")
			}
		}

		// Update parent ID
		category.ParentID = newParentID
		return tx.Save(&category).Error
	})
}
