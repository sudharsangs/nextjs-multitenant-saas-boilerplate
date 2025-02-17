package routes

import (
	"orderly-server/routes/auth"

	"github.com/labstack/echo/v4"
)

func Routes(g *echo.Group) {
	auth.AuthRouter{}.Init(g.Group("/v1/auth"))
}
