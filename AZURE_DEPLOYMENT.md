# Azure Ubuntu VM Deployment Guide

This guide explains how to deploy the CES LMS application on an Azure Ubuntu VM using Docker Compose with MongoDB Atlas.

## Prerequisites

1. Azure Ubuntu VM (x64 architecture)
2. Docker and Docker Compose installed on the VM
3. MongoDB Atlas account and cluster
4. Network security group configured to allow ports 80 and 3000

## Step 1: Prepare Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ces-lms?retryWrites=true&w=majority
MONGODB_DB_NAME=ces-lms

# JWT Secrets (Generate strong random strings)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production

# Frontend API URL (Replace with your Azure VM public IP)
VITE_API_BASE_URL=http://YOUR_AZURE_VM_IP:3000

# CORS Origin (Set to your frontend URL or * for all)
CORS_ORIGIN=*

# Optional: Seed database on first run
RUN_SEED=false
```

## Step 2: Build and Deploy

On your Azure Ubuntu VM, navigate to the project directory and run:

```bash
# Build and start containers
docker compose -f docker-compose.azure.yml up -d --build

# Check container status
docker compose -f docker-compose.azure.yml ps

# View logs
docker compose -f docker-compose.azure.yml logs -f
```

## Step 3: Configure Azure Network Security Group

Ensure your Azure VM's Network Security Group allows inbound traffic on:
- Port 80 (HTTP - Frontend)
- Port 3000 (Backend API - if accessing directly)

## Step 4: Access the Application

- Frontend: `http://YOUR_AZURE_VM_IP`
- Backend API: `http://YOUR_AZURE_VM_IP:3000`

## MongoDB Atlas Configuration

1. Create a MongoDB Atlas cluster
2. Create a database user
3. Whitelist your Azure VM's public IP address in MongoDB Atlas Network Access
4. Get your connection string and update `MONGODB_URI` in `.env`

## Troubleshooting

### Check container logs
```bash
docker compose -f docker-compose.azure.yml logs backend
docker compose -f docker-compose.azure.yml logs frontend
```

### Restart containers
```bash
docker compose -f docker-compose.azure.yml restart
```

### Rebuild containers
```bash
docker compose -f docker-compose.azure.yml up -d --build
```

### Stop containers
```bash
docker compose -f docker-compose.azure.yml down
```

## Notes

- Images are built for `linux/amd64` (x64) architecture
- Backend runs on port 3000
- Frontend runs on port 80 (nginx)
- MongoDB Atlas connection is configured via environment variables
- No local MongoDB container is needed

