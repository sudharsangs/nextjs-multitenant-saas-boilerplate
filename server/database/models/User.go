package models

import (
	"os"

	"golang.org/x/crypto/bcrypt"

	jwt "github.com/dgrijalva/jwt-go"
	"gorm.io/gorm"
)

// User : User Model
type User struct {
	gorm.Model
	Username     string
	Email        string
	PasswordHash string
	DisplayName  string
}

var (
	jwtKey = os.Getenv("JWT_KEY")
)

// HashPassword : Hash Password
func (u *User) HashPassword() {
	bytes, _ := bcrypt.GenerateFromPassword([]byte(u.PasswordHash), bcrypt.DefaultCost)
	u.PasswordHash = string(bytes)
}

// GenerateToken : Generate Token
func (u *User) GenerateToken() (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": u.Username,
		"email":    u.Email,
	})

	tokenString, err := token.SignedString([]byte(jwtKey))
	return tokenString, err
}
