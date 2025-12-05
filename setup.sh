#!/bin/bash

# SalesDuo Setup Script
# This script helps you set up the SalesDuo application

echo "==================================="
echo "SalesDuo Setup Script"
echo "==================================="
echo ""

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo "Error: Please run this script from the SalesDuo root directory"
    exit 1
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "Checking prerequisites..."
echo ""

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js v14 or higher."
    exit 1
else
    echo "✓ Node.js is installed: $(node --version)"
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
else
    echo "✓ npm is installed: $(npm --version)"
fi

if ! command_exists mysql; then
    echo "⚠ MySQL client is not installed. You'll need MySQL to run the application."
    echo "  You can either:"
    echo "  - Install MySQL locally"
    echo "  - Use Docker with: docker-compose up -d"
else
    echo "✓ MySQL client is installed: $(mysql --version)"
fi

echo ""
echo "==================================="
echo "Setting up Backend..."
echo "==================================="
echo ""

# Backend setup
cd backend || exit

if [ ! -f "package.json" ]; then
    echo "❌ Backend package.json not found"
    exit 1
fi

echo "Installing backend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo "✓ Backend dependencies installed"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo ""
    echo "Creating backend .env file..."
    cp .env.example .env
    echo "✓ Created .env file from .env.example"
    echo ""
    echo "⚠ IMPORTANT: Edit backend/.env with your database credentials and OpenAI API key"
    echo ""
else
    echo "✓ Backend .env file already exists"
fi

cd ..

echo ""
echo "==================================="
echo "Setting up Frontend..."
echo "==================================="
echo ""

# Frontend setup
cd frontend || exit

if [ ! -f "package.json" ]; then
    echo "❌ Frontend package.json not found"
    exit 1
fi

echo "Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo "✓ Frontend dependencies installed"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo ""
    echo "Creating frontend .env file..."
    cp .env.example .env
    echo "✓ Created .env file from .env.example"
else
    echo "✓ Frontend .env file already exists"
fi

cd ..

echo ""
echo "==================================="
echo "Setup Complete!"
echo "==================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Set up your MySQL database:"
echo "   mysql -u root -p < backend/db/schema.sql"
echo ""
echo "2. Edit backend/.env with your credentials:"
echo "   - Database connection details"
echo "   - OpenAI API key"
echo ""
echo "3. Start the backend:"
echo "   cd backend && npm start"
echo ""
echo "4. In a new terminal, start the frontend:"
echo "   cd frontend && npm start"
echo ""
echo "5. Open http://localhost:3000 in your browser"
echo ""
echo "==================================="
echo ""
echo "For Docker setup, run:"
echo "  docker-compose up -d"
echo ""
