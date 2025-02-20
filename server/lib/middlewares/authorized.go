package middlewares

import (
	"fmt"
	"net/http"
	"orderly-server/lib/services"
	"os"

	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo/v4"
)

var (
	jwtKey = os.Getenv("JWT_KEY")
)

type AuthorisedMiddleware struct {
	authService *services.AuthService
}

func NewAuthorisedMiddleware(authService *services.AuthService) *AuthorisedMiddleware {
	return &AuthorisedMiddleware{authService: authService}
}

// Authorised : Check Auth
func Authorised(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		cookie, err := c.Cookie("token")
		if err != nil {
			return c.NoContent(http.StatusUnauthorized)
		}

		token, err := jwt.Parse(cookie.Value, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}

			return jwtKey, nil
		})

		if !token.Valid || err != nil {
			return c.NoContent(http.StatusUnauthorized)
		}

		c.Set("username", token.Claims.(jwt.MapClaims)["username"])

		return next(c)
	}
}
