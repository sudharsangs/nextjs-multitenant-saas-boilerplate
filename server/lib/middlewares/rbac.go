package middlewares

import (
	"net/http"
	"orderly-server/lib/services"

	"github.com/labstack/echo/v4"
)

type RBACMiddleware struct {
	authService *services.AuthService
}

func NewRBACMiddleware(authService *services.AuthService) *RBACMiddleware {
	return &RBACMiddleware{authService: authService}
}

func (m *RBACMiddleware) RequirePermission(resource, action string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			userID, err := services.GetUserIDFromToken(c)
			if err != nil {
				return c.JSON(http.StatusUnauthorized, map[string]string{
					"error": "Unauthorized",
				})
			}
			if !m.authService.HasPermission(c.Request().Context(), userID, resource, action) {
				return c.JSON(http.StatusForbidden, map[string]string{
					"error": "Permission denied",
				})
			}

			return next(c)
		}
	}
}
