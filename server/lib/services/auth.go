package services

import (
	"context"
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

func (s *AuthService) HasPermission(ctx context.Context, userID uint, resource, action string) bool {
	var user models.User
	if err := s.db.Preload("Roles.Permissions").First(&user, userID).Error; err != nil {
		return false
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
	claims["exp"] = time.Now().Add(7 * 24 * time.Hour).Unix()

	return token.SignedString([]byte("your-secret-key")) // TODO: Move secret key to config
}

// ValidateToken validates a JWT token
func (s *AuthService) ValidateToken(tokenString string) (*jwt.Token, error) {
	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte("your-secret-key"), nil // TODO: Move secret key to config
	})
}

// RefreshToken refreshes a user's JWT token
func (s *AuthService) RefreshToken(user *models.User, companyUser *models.CompanyUser) (string, error) {
	return GenerateToken(user, companyUser)
}

// ForgotPassword initiates the password reset process
func (s *AuthService) ForgotPassword(email string) error {
	// TODO: Implement password reset token generation and email sending
	return nil
}

// ResetPassword resets a user's password using a reset token
func (s *AuthService) ResetPassword(token, newPassword string) error {
	// TODO: Implement password reset validation and update
	return nil
}

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
