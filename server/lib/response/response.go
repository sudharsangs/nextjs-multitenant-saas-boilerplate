package response

import (
	"math"
	"net/http"

	"github.com/labstack/echo/v4"
)

// Meta contains metadata about the response, such as pagination info
type Meta struct {
	Page      int `json:"page,omitempty"`
	PerPage   int `json:"per_page,omitempty"`
	Total     int `json:"total,omitempty"`
	TotalPage int `json:"total_page,omitempty"`
}

// Error represents error details in the response
type Error struct {
	Code    string `json:"code,omitempty"`
	Message string `json:"message,omitempty"`
	Details any    `json:"details,omitempty"`
}

// Response is the base response structure
type Response struct {
	Success bool   `json:"success"`
	Data    any    `json:"data,omitempty"`
	Meta    *Meta  `json:"meta,omitempty"`
	Error   *Error `json:"error,omitempty"`
}

// Helper functions to create responses
func Success(c echo.Context, statusCode int, data any) error {
	return c.JSON(statusCode, Response{
		Success: true,
		Data:    data,
	})
}

// SuccessWithMeta sends a success response with pagination metadata
func SuccessWithMeta(c echo.Context, statusCode int, data any, page, perPage, total int) error {
	return c.JSON(statusCode, Response{
		Success: true,
		Data:    data,
		Meta: &Meta{
			Page:      page,
			PerPage:   perPage,
			Total:     total,
			TotalPage: int(math.Ceil(float64(total) / float64(perPage))),
		},
	})
}

// Error sends an error response
func SendError(c echo.Context, statusCode int, code, message string, details any) error {
	return c.JSON(statusCode, Response{
		Success: false,
		Error: &Error{
			Code:    code,
			Message: message,
			Details: details,
		},
	})
}

// ValidationError is a helper for validation errors
func ValidationError(c echo.Context, details any) error {
	return SendError(c, http.StatusBadRequest, "VALIDATION_ERROR", "Validation failed", details)
}

// NotFoundError is a helper for not found errors
func NotFoundError(c echo.Context, message string) error {
	return SendError(c, http.StatusNotFound, "NOT_FOUND", message, nil)
}

// ServerError is a helper for internal server errors
func ServerError(c echo.Context, err error) error {
	return SendError(c, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "An internal server error occurred", err.Error())
}
