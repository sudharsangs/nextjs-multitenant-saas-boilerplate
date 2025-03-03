package handlers

import (
	"log"
	"net/http"
	"time"

	"orderly-server/database/models"
	"orderly-server/lib/services"

	"golang.org/x/crypto/bcrypt"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type AuthHandler struct {
	authService *services.AuthService
}

func NewAuthHandler(authService *services.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

func (AuthHandler) Register(c echo.Context) error {
	type RequestBody struct {
		Username  string `json:"username" validate:"required"`
		Password  string `json:"password" validate:"required"`
		Phone     string `json:"phone"`
		Email     string `json:"email"`
		CompanyID uint   `json:"company_id"`

		FirstName string `json:"first_name" validate:"required"`
		LastName  string `json:"last_name" validate:"required"`
	}

	var body RequestBody

	if err := c.Bind(&body); err != nil {
		return err
	}
	if err := c.Validate(&body); err != nil {
		return err
	}

	db, _ := c.Get("db").(*gorm.DB)

	if err := db.Where("username = ?", body.Username).First(&models.User{}).Error; err == nil {
		return c.JSON(http.StatusConflict, echo.Map{
			"message": "Username already exists",
		})
	}

	user := models.User{
		Username:     body.Username,
		PasswordHash: body.Password,
		Phone:        body.Phone,
		Email:        body.Email,
		FirstName:    body.FirstName,
		LastName:     body.LastName,
	}

	services.HashPassword(&user)
	db.Create(&user)

	companyUser := models.CompanyUser{
		UserID:    user.ID,
		CompanyID: body.CompanyID,
	}

	token, _ := services.GenerateToken(&user, &companyUser)

	var cookie http.Cookie

	cookie.Name = "token"
	cookie.Value = token
	cookie.Expires = time.Now().Add(7 * 24 * time.Hour)

	c.SetCookie(&cookie)

	return c.JSON(http.StatusOK, echo.Map{
		"token": token,
		"user":  user,
	})
}

// Login : Login Router
func (AuthHandler) Login(c echo.Context) error {
	type RequestBody struct {
		Username string `json:"username" validate:"required"`
		Password string `json:"password" validate:"required"`
	}

	var body RequestBody

	if err := c.Bind(&body); err != nil {
		return c.NoContent(http.StatusNotFound)
	}
	if err := c.Validate(&body); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{
			"message": "Invalid request body",
		})
	}

	db, _ := c.Get("db").(*gorm.DB)

	var user models.User
	var companyUser models.CompanyUser

	if err := db.Where("username = ?", body.Username).First(&user).Error; err != nil {
		return c.NoContent(http.StatusConflict)
	}

	if err := db.Where("user_id = ?", user.ID).First(&companyUser).Error; err != nil {
		companyUser = models.CompanyUser{
			UserID:    user.ID,
			CompanyID: 0,
		}
	}

	if bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(body.Password)) != nil {
		return c.NoContent(http.StatusInternalServerError)
	}

	token, err := services.GenerateToken(&user, &companyUser)
	if err != nil {
		log.Println(err)
		return c.NoContent(http.StatusInternalServerError)
	}

	var cookie http.Cookie

	cookie.Name = "token"
	cookie.Value = token
	cookie.Expires = time.Now().Add(7 * 24 * time.Hour)

	c.SetCookie(&cookie)

	return c.JSON(http.StatusOK, echo.Map{
		"token": token,
		"user":  user,
	})
}

// Logout : Logout Router
func (AuthHandler) Logout(c echo.Context) error {
	tokenCookie, _ := c.Get("tokenCookie").(*http.Cookie)

	tokenCookie.Value = ""
	tokenCookie.Expires = time.Unix(0, 0)

	c.SetCookie(tokenCookie)

	return c.NoContent(200)
}
