#!/bin/bash

# ============================================
# Azure Ubuntu Deployment Setup Script
# ============================================
# This script helps set up the environment for Azure deployment
# Usage: bash setup-azure.sh

set -e

echo "============================================"
echo "CES LMS - Azure Deployment Setup"
echo "============================================"
echo ""

# Check if .env file exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

# Create .env file
echo "Creating .env file..."
cat > .env << 'ENVEOF'
# ============================================
# Docker Compose Environment Variables
# ============================================

# Port Configuration
BACKEND_PORT=3000
FRONTEND_PORT=8080

# Node.js Backend Configuration
NODE_ENV=production
API_VERSION=v1

# MongoDB Atlas Configuration
# Replace with your actual MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ces-lms?retryWrites=true&w=majority
MONGODB_DB_NAME=ces-lms

# JWT Configuration
# Generate strong secrets using: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production-min-32-chars
JWT_REFRESH_EXPIRES_IN=30d

# Security Configuration
BCRYPT_ROUNDS=12

# CORS Configuration
# For Azure, set to your domain or use * for all origins
CORS_ORIGIN=*
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads

# Logging Configuration
LOG_LEVEL=info
LOG_DIR=logs

# Seed Script Configuration
RUN_SEED=false

# Frontend Build Configuration
# For Azure, set this to your backend URL
# Example: http://YOUR_VM_IP:3000 or https://api.yourdomain.com
VITE_API_BASE_URL=http://localhost:3000
VITE_API_VERSION=v1
VITE_API_TIMEOUT=30000
ENVEOF

echo "✅ .env file created!"
echo ""

# Generate JWT secrets
echo "Generating JWT secrets..."
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

# Update .env with generated secrets
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|" .env
    sed -i '' "s|JWT_REFRESH_SECRET=.*|JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET|" .env
else
    # Linux
    sed -i "s|JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|" .env
    sed -i "s|JWT_REFRESH_SECRET=.*|JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET|" .env
fi

echo "✅ JWT secrets generated and updated in .env"
echo ""

# Get VM public IP (if available)
VM_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s ipinfo.io/ip 2>/dev/null || echo "YOUR_VM_IP")

if [ "$VM_IP" != "YOUR_VM_IP" ]; then
    echo "Detected VM IP: $VM_IP"
    read -p "Do you want to use this IP for VITE_API_BASE_URL? (Y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s|VITE_API_BASE_URL=.*|VITE_API_BASE_URL=http://$VM_IP:3000|" .env
        else
            sed -i "s|VITE_API_BASE_URL=.*|VITE_API_BASE_URL=http://$VM_IP:3000|" .env
        fi
        echo "✅ Updated VITE_API_BASE_URL to http://$VM_IP:3000"
    fi
fi

echo ""
echo "============================================"
echo "Setup Complete!"
echo "============================================"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env file and update MONGODB_URI with your MongoDB Atlas connection string"
echo "2. Update CORS_ORIGIN if needed (currently set to *)"
echo "3. Review other configuration values"
echo ""
echo "🚀 To deploy:"
echo "   sudo docker compose up -d --build"
echo ""
echo "📖 For more information, see DEPLOYMENT.md"
echo ""

