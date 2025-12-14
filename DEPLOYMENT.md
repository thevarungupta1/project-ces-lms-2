# Azure Ubuntu Deployment Guide

This guide explains how to deploy the CES LMS application on an Azure Ubuntu virtual machine using Docker Compose.

## Prerequisites

1. **Azure Ubuntu VM** with:
   - Docker installed
   - Docker Compose installed
   - Ports 3000 (backend) and 8080 (frontend) open in Azure NSG
   - SSH access configured

2. **MongoDB Atlas Account** with:
   - A cluster created
   - Database user created
   - Network access configured (add Azure VM IP or 0.0.0.0/0 for all)
   - Connection string ready

## Step 1: Prepare Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and update the following critical variables:
   ```bash
   # MongoDB Atlas Connection String
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ces-lms?retryWrites=true&w=majority
   
   # JWT Secrets (generate strong secrets)
   JWT_SECRET=your-strong-secret-here-min-32-chars
   JWT_REFRESH_SECRET=your-strong-refresh-secret-here-min-32-chars
   
   # CORS Origin (your frontend URL or * for all)
   CORS_ORIGIN=*
   
   # Frontend API URL (your backend URL)
   VITE_API_BASE_URL=http://YOUR_VM_IP:3000
   ```

## Step 2: Generate Strong Secrets

Generate secure JWT secrets:
```bash
# Generate JWT Secret
openssl rand -base64 32

# Generate JWT Refresh Secret
openssl rand -base64 32
```

## Step 3: Configure MongoDB Atlas

1. **Network Access:**
   - Go to MongoDB Atlas → Network Access
   - Add IP Address: `0.0.0.0/0` (for all) or your Azure VM's public IP
   - Click "Confirm"

2. **Database Access:**
   - Go to MongoDB Atlas → Database Access
   - Create a database user with read/write permissions
   - Note the username and password

3. **Connection String:**
   - Go to MongoDB Atlas → Clusters → Connect
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `ces-lms` (or your database name)

## Step 4: Deploy on Azure VM

1. **SSH into your Azure VM:**
   ```bash
   ssh ubuntu@YOUR_VM_IP
   ```

2. **Clone or upload your project:**
   ```bash
   cd ~
   git clone YOUR_REPO_URL project-lms-ces
   cd project-lms-ces
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   nano .env  # Edit with your values
   ```

4. **Update Frontend API URL:**
   - In `.env`, set `VITE_API_BASE_URL` to your backend URL
   - For Azure VM: `http://YOUR_VM_PUBLIC_IP:3000`
   - Or if using a domain: `https://api.yourdomain.com`

5. **Build and start containers:**
   ```bash
   # Build and start in detached mode
   sudo docker compose up -d --build
   
   # View logs
   sudo docker compose logs -f
   
   # Check container status
   sudo docker compose ps
   ```

## Step 5: Verify Deployment

1. **Check Backend Health:**
   ```bash
   curl http://localhost:3000/health
   # Or from your machine:
   curl http://YOUR_VM_IP:3000/health
   ```

2. **Check Frontend:**
   - Open browser: `http://YOUR_VM_IP:8080`

3. **View Logs:**
   ```bash
   # Backend logs
   sudo docker compose logs backend -f
   
   # Frontend logs
   sudo docker compose logs frontend -f
   
   # All logs
   sudo docker compose logs -f
   ```

## Step 6: Configure Azure Network Security Group (NSG)

1. Go to Azure Portal → Your VM → Networking
2. Add Inbound Rules:
   - **Backend (Port 3000):**
     - Priority: 1000
     - Source: Internet or specific IPs
     - Destination: Any
     - Port: 3000
     - Protocol: TCP
   
   - **Frontend (Port 8080):**
     - Priority: 1001
     - Source: Internet
     - Destination: Any
     - Port: 8080
     - Protocol: TCP

## Step 7: Optional - Use Azure-Specific Configuration

For Azure-specific optimizations, use the Azure compose file:

```bash
sudo docker compose -f docker-compose.yml -f docker-compose.azure.yml up -d --build
```

## Troubleshooting

### Backend won't start
```bash
# Check backend logs
sudo docker compose logs backend

# Check MongoDB connection
sudo docker compose exec backend node -e "console.log(process.env.MONGODB_URI)"
```

### Frontend can't connect to backend
- Verify `VITE_API_BASE_URL` in `.env` matches your backend URL
- Check CORS settings in backend
- Verify both containers are on the same network

### MongoDB Atlas connection issues
- Verify network access in MongoDB Atlas (IP whitelist)
- Check connection string format
- Verify database user credentials
- Check MongoDB Atlas logs

### Container restart issues
```bash
# Restart specific service
sudo docker compose restart backend

# Rebuild and restart
sudo docker compose up -d --build backend
```

## Maintenance Commands

```bash
# Stop all services
sudo docker compose down

# Stop and remove volumes
sudo docker compose down -v

# Update and rebuild
git pull
sudo docker compose up -d --build

# View resource usage
sudo docker stats

# Clean up unused images
sudo docker image prune -a
```

## Security Best Practices

1. **Change Default Secrets:**
   - Never use default JWT secrets in production
   - Generate strong, unique secrets

2. **CORS Configuration:**
   - Don't use `*` in production
   - Specify your actual frontend domain(s)

3. **Firewall Rules:**
   - Only open necessary ports
   - Use Azure NSG to restrict access

4. **MongoDB Atlas:**
   - Use strong database passwords
   - Restrict network access to specific IPs
   - Enable MongoDB Atlas authentication

5. **Environment Variables:**
   - Never commit `.env` file to git
   - Use Azure Key Vault for sensitive values in production

## Production Recommendations

1. **Use a Reverse Proxy (Nginx):**
   - Set up Nginx on the VM
   - Configure SSL/TLS certificates
   - Route traffic to containers

2. **Domain Configuration:**
   - Point your domain to Azure VM IP
   - Configure DNS records
   - Set up SSL certificates (Let's Encrypt)

3. **Monitoring:**
   - Set up Azure Monitor
   - Configure log aggregation
   - Set up alerts

4. **Backup:**
   - Configure MongoDB Atlas backups
   - Set up automated backups
   - Test restore procedures

