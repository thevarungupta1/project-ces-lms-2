# Azure Ubuntu VM Deployment Guide

This guide provides step-by-step instructions to deploy the CES LMS application on an Azure Ubuntu VM using Docker Compose with MongoDB Atlas.

## Prerequisites

1. Azure account with active subscription
2. MongoDB Atlas account (free tier available)
3. SSH client for connecting to Azure VM

## Step 1: Create Azure Ubuntu VM

1. Log in to [Azure Portal](https://portal.azure.com)
2. Navigate to **Virtual Machines** → **Create** → **Azure virtual machine**
3. Configure the VM:
   - **Image**: Ubuntu Server 22.04 LTS (or latest)
   - **Size**: Standard_B2s (2 vCPUs, 4 GB RAM) or higher
   - **Authentication**: SSH public key or password
   - **Public inbound ports**: Allow SSH (22)
4. Create the VM and note the **Public IP address**

## Step 2: Configure Azure Network Security Group

1. In Azure Portal, go to your VM → **Networking**
2. Click on the **Network security group**
3. Add **Inbound security rules**:
   - **Port 80** (HTTP) - Allow from Any source
   - **Port 3000** (Backend API) - Allow from Any source (or restrict to specific IPs)

## Step 3: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (or use existing)
3. Create a database user:
   - Go to **Database Access** → **Add New Database User**
   - Set username and password (save these!)
4. Configure Network Access:
   - Go to **Network Access** → **Add IP Address**
   - Add your Azure VM's **Public IP address** (or use `0.0.0.0/0` for testing)
5. Get Connection String:
   - Go to **Database** → **Connect** → **Connect your application**
   - Copy the connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/...`)

## Step 4: Connect to Azure VM

```bash
# Using SSH (replace with your VM details)
ssh username@YOUR_AZURE_VM_IP

# Or using Azure Cloud Shell
az vm ssh --name YOUR_VM_NAME --resource-group YOUR_RESOURCE_GROUP
```

## Step 5: Install Docker and Docker Compose

On your Azure Ubuntu VM, run:

```bash
# Update system packages
sudo apt-get update

# Install Docker
sudo apt-get install -y docker.io docker-compose

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group (to run without sudo)
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker compose version
```

## Step 6: Upload Project Files to Azure VM

### Option A: Using Git (Recommended)

```bash
# On Azure VM, install Git if not installed
sudo apt-get install -y git

# Clone your repository
git clone YOUR_REPOSITORY_URL
cd project-ces-lms-2
```

### Option B: Using SCP (from local machine)

```bash
# From your local machine
scp -r project-ces-lms-2 username@YOUR_AZURE_VM_IP:~/
```

### Option C: Using Azure Storage/Blob

Upload files via Azure Portal and download on VM.

## Step 7: Create Environment Variables File

On your Azure VM, navigate to project directory and create `.env` file:

```bash
cd ~/project-ces-lms-2
nano .env
```

Add the following content (replace with your actual values):

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ces-lms?retryWrites=true&w=majority
MONGODB_DB_NAME=ces-lms

# JWT Secrets (Generate strong random strings - use openssl or online generator)
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Frontend API URL (Replace YOUR_AZURE_VM_IP with actual IP)
VITE_API_BASE_URL=http://YOUR_AZURE_VM_IP:3000
VITE_API_VERSION=v1
VITE_API_TIMEOUT=30000

# CORS Origin (Set to your frontend URL or * for all)
CORS_ORIGIN=*
CORS_CREDENTIALS=true

# Optional: Seed database on first run
RUN_SEED=false

# Optional: Other settings
BCRYPT_ROUNDS=12
LOG_LEVEL=info
```

Save and exit (Ctrl+X, then Y, then Enter in nano).

**Generate secure JWT secrets:**
```bash
# Generate random secrets
openssl rand -base64 32
# Run twice to get two different secrets for JWT_SECRET and JWT_REFRESH_SECRET
```

## Step 8: Build and Deploy Containers

On your Azure VM, in the project directory:

```bash
# Make sure you're in the project root
cd ~/project-ces-lms-2

# Build and start containers (this may take 5-10 minutes on first run)
docker compose -f docker-compose.azure.yml up -d --build

# Check container status
docker compose -f docker-compose.azure.yml ps

# View logs to verify everything is working
docker compose -f docker-compose.azure.yml logs -f
```

Wait for both containers to show as "healthy" in the status.

## Step 9: Verify Deployment

```bash
# Check if containers are running
docker ps

# Check backend health
curl http://localhost:3000/health

# Check frontend
curl http://localhost/
```

## Step 10: Access the Application

From your browser, access:
- **Frontend**: `http://YOUR_AZURE_VM_IP`
- **Backend API**: `http://YOUR_AZURE_VM_IP:3000`
- **Health Check**: `http://YOUR_AZURE_VM_IP:3000/health`

## Step 11: (Optional) Seed Database

If you want to populate the database with initial data:

```bash
# Edit .env and set RUN_SEED=true
nano .env

# Restart backend container
docker compose -f docker-compose.azure.yml restart backend
```

## Common Deployment Commands

### View Logs
```bash
# All services
docker compose -f docker-compose.azure.yml logs -f

# Specific service
docker compose -f docker-compose.azure.yml logs -f backend
docker compose -f docker-compose.azure.yml logs -f frontend
```

### Restart Services
```bash
# Restart all
docker compose -f docker-compose.azure.yml restart

# Restart specific service
docker compose -f docker-compose.azure.yml restart backend
```

### Stop Services
```bash
docker compose -f docker-compose.azure.yml down
```

### Update and Redeploy
```bash
# Pull latest code (if using Git)
git pull

# Rebuild and restart
docker compose -f docker-compose.azure.yml up -d --build
```

### Check Resource Usage
```bash
docker stats
```

## Troubleshooting

### Backend Not Starting
```bash
# Check backend logs
docker compose -f docker-compose.azure.yml logs backend

# Common issues:
# - MongoDB connection failed: Check MONGODB_URI in .env
# - Port already in use: Check if port 3000 is available
# - Missing environment variables: Verify .env file exists
```

### Frontend Not Loading
```bash
# Check frontend logs
docker compose -f docker-compose.azure.yml logs frontend

# Verify backend is accessible
curl http://localhost:3000/health
```

### MongoDB Connection Issues
1. Verify MongoDB Atlas Network Access includes your Azure VM IP
2. Check connection string format in `.env`
3. Test connection from VM:
   ```bash
   # Install MongoDB client (optional)
   sudo apt-get install -y mongodb-clients
   # Test connection (replace with your connection string)
   mongosh "mongodb+srv://username:password@cluster.mongodb.net/ces-lms"
   ```

### Container Build Failures
```bash
# Clean Docker cache and rebuild
docker compose -f docker-compose.azure.yml down
docker system prune -a
docker compose -f docker-compose.azure.yml up -d --build
```

### Port Already in Use
```bash
# Check what's using the port
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :80

# Stop conflicting services or change ports in docker-compose.azure.yml
```

### Permission Issues
```bash
# If you get permission denied errors
sudo usermod -aG docker $USER
newgrp docker
```

## Notes

- Images are built for `linux/amd64` (x64) architecture
- Backend runs on port 3000
- Frontend runs on port 80 (nginx)
- MongoDB Atlas connection is configured via environment variables
- No local MongoDB container is needed

