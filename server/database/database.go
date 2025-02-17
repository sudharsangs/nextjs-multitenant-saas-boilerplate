package database

import (
	"orderly-server/database/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Connect : Database connect
func Connect() *gorm.DB {
	dsn := "host=localhost user=sgs password=shakthikodu dbname=fs_template sslmode=disable TimeZone=Asia/Kolkata"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	db.Logger.LogMode(3)

	if err != nil {
		panic(err)
	}

	models.Migrate(db)

	return db
}
