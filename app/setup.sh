#!/bin/bash

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js 18 or later."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm."
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "Please update the .env file with your database credentials and other settings."
fi

# Generate Prisma client
echo "Generating Prisma client..."
npm run db:generate

# Push database schema
echo "Pushing database schema..."
npm run db:push

# Seed the database
echo "Seeding the database..."
npm run db:seed

echo "Setup complete! You can now start the development server with 'npm run dev'"
echo "Default admin credentials:"
echo "Email: admin@example.com"
echo "Password: password123" 