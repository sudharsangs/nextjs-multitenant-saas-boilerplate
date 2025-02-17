package services

import (
	"context"

	"orderly-server/database/models"

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

	for _, role := range user.Roles {
		for _, perm := range role.Permissions {
			if perm.Resource == resource && perm.Action == action {
				return true
			}
		}
	}
	return false
}

var (
	jwtKey = os.Getenv("JWT_KEY")
)

// HashPassword : Hash Password
func HashPassword(u *models.User) {
	bytes, _ := bcrypt.GenerateFromPassword([]byte(u.PasswordHash), bcrypt.DefaultCost)
	u.PasswordHash = string(bytes)
}

// GenerateToken : Generate Token
func GenerateToken(u *models.User) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": u.Username,
		"email":    u.Email,
	})

	tokenString, err := token.SignedString([]byte(jwtKey))
	return tokenString, err
}

func GetUserIDFromToken(context echo.Context) (uint, error) {
	user := context.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID := claims["user_id"].(float64)
	return uint(userID), nil
}
