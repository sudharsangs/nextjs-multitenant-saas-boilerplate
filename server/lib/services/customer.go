package services

import (
	"errors"
	"orderly-server/database/models"

	"gorm.io/gorm"
)

type CustomersService struct {
	db *gorm.DB
}

func NewCustomersService(db *gorm.DB) *CustomersService {
	return &CustomersService{db: db}
}

func (s *CustomersService) CreateCustomer(customer models.Customer) error {
	if err := s.db.Where("email = ? OR phone = ? AND company_id = ?", customer.Email, customer.Phone, customer.CompanyID).First(&customer).Error; err == nil {
		return errors.New("customer with the same email or phone already exists")
	} else if err != gorm.ErrRecordNotFound {
		return err
	}

	if err := s.db.Create(&customer).Error; err != nil {
		return err
	}
	return nil
}

func (s *CustomersService) UpdateCustomer(customer models.Customer) error {
	if err := s.db.Model(&customer).Updates(customer).Error; err != nil {
		return err
	}
	return nil
}

func (s *CustomersService) DeleteCustomer(customer models.Customer) error {
	if err := s.db.Delete(&customer).Error; err != nil {
		return err
	}
	return nil
}

func (s *CustomersService) GetCustomerByID(id uint) (models.Customer, error) {
	var customer models.Customer
	if err := s.db.First(&customer, id).Error; err != nil {
		return customer, err
	}
	return customer, nil
}

func (s *CustomersService) GetCustomersByCompanyID(companyId uint) ([]models.Customer, error) {
	var customers []models.Customer
	if err := s.db.Find(&customers).Where("company_id = ?", companyId).Error; err != nil {
		return customers, err
	}
	return customers, nil
}
