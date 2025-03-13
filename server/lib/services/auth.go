package services

import (
	"context"
	"errors"
	"time"

	"github.com/factostack/orderly/server/database/models"

	"os"

	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"

	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	db *gorm.DB
}

func NewAuthService(db *gorm.DB) *AuthService {
	return &AuthService{db: db}
}

// HasPermission checks if a user has a specific permission
func (s *AuthService) HasPermission(ctx context.Context, userID uint, resource, action string) bool {
	var user models.User
	if err := s.db.Preload("Roles.Permissions").First(&user, userID).Error; err != nil {
		return false
	}

	for _, role := range user.Roles {
		for _, permission := range role.Permissions {
			if permission.Resource == resource && permission.Action == action {
				return true
			}
		}
	}
	return false
}

var (
	jwtKey = os.Getenv("JWT_KEY")
)

// HashPassword hashes a user's password
func HashPassword(user *models.User) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.PasswordHash), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.PasswordHash = string(hashedPassword)
	return nil
}

// GenerateToken generates a JWT token for a user
func GenerateToken(user *models.User, companyUser *models.CompanyUser) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["user_id"] = user.ID
	claims["company_id"] = companyUser.CompanyID
	claims["username"] = user.Username
	claims["exp"] = time.Now().Add(7 * 24 * time.Hour).Unix()

	return token.SignedString([]byte(jwtKey))
}

// ValidateToken validates a JWT token
func (s *AuthService) ValidateToken(tokenString string) (*jwt.Token, error) {
	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(jwtKey), nil
	})
}

// RefreshToken refreshes a user's JWT token
func (s *AuthService) RefreshToken(user *models.User, companyUser *models.CompanyUser) (string, error) {
	return GenerateToken(user, companyUser)
}

// ForgotPassword initiates the password reset process
func (s *AuthService) ForgotPassword(email string) error {
	var user models.User
	if err := s.db.Where("email = ?", email).First(&user).Error; err != nil {
		return err
	}

	// Generate reset token
	resetToken := jwt.New(jwt.SigningMethodHS256)
	claims := resetToken.Claims.(jwt.MapClaims)
	claims["user_id"] = user.ID
	claims["exp"] = time.Now().Add(1 * time.Hour).Unix()

	tokenString, err := resetToken.SignedString([]byte(jwtKey))
	if err != nil {
		return err
	}

	// TODO: Send email with reset token
	// For now, we'll just store it in the database
	user.ResetToken = tokenString
	user.ResetTokenExpires = time.Now().Add(1 * time.Hour)
	return s.db.Save(&user).Error
}

// ResetPassword resets a user's password using a reset token
func (s *AuthService) ResetPassword(token, newPassword string) error {
	// Validate token
	claims := jwt.MapClaims{}
	_, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(jwtKey), nil
	})
	if err != nil {
		return err
	}

	userID := uint(claims["user_id"].(float64))
	var user models.User
	if err := s.db.First(&user, userID).Error; err != nil {
		return err
	}

	// Verify token matches stored token
	if user.ResetToken != token {
		return errors.New("invalid reset token")
	}

	// Check if token is expired
	if time.Now().After(user.ResetTokenExpires) {
		return errors.New("reset token expired")
	}

	// Update password
	user.PasswordHash = newPassword
	if err := HashPassword(&user); err != nil {
		return err
	}

	// Clear reset token
	user.ResetToken = ""
	user.ResetTokenExpires = time.Time{}

	return s.db.Save(&user).Error
}

// GetUserIDFromToken extracts user ID from JWT token
func GetUserIDFromToken(context echo.Context) (uint, error) {
	user := context.Get("user")
	if user == nil {
		return 0, echo.NewHTTPError(401, "missing or invalid JWT token")
	}

	token := user.(*jwt.Token)
	claims := token.Claims.(jwt.MapClaims)
	userID := claims["user_id"].(float64)
	return uint(userID), nil
}

// GetCompanyIDFromToken extracts company ID from JWT token
func GetCompanyIDFromToken(context echo.Context) (uint, error) {
	user := context.Get("user")
	if user == nil {
		return 0, echo.NewHTTPError(401, "missing or invalid JWT token")
	}

	token := user.(*jwt.Token)
	claims := token.Claims.(jwt.MapClaims)
	companyID := claims["company_id"].(float64)
	return uint(companyID), nil
}
