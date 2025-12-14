# Docker Configuration Guide for node-web-api

## MongoDB URL Configuration

The MongoDB connection URL can be configured in several ways depending on how you run the Docker container:

### 1. Using docker-compose.yml (Recommended)

The `docker-compose.yml` file in the root directory already configures MongoDB URL:

```yaml
backend:
  environment:
    MONGODB_URI: mongodb://admin:password123@mongodb:27017/ces-lms?authSource=admin
```

**To use this:**
```bash
docker-compose up -d
```

**To change MongoDB URL in docker-compose:**
Edit the `MONGODB_URI` value in `docker-compose.yml`:
- For local MongoDB: `mongodb://localhost:27017/ces-lms`
- For Docker MongoDB: `mongodb://admin:password123@mongodb:27017/ces-lms?authSource=admin`
- For MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/ces-lms`

### 2. Using Environment Variables with docker run

When building and running the image directly:

```bash
# Build the image
docker build -t ces-lms-backend ./node-web-api

# Run with environment variables
docker run -d \
  -p 3000:3000 \
  -e MONGODB_URI="mongodb://admin:password123@mongodb:27017/ces-lms?authSource=admin" \
  -e MONGODB_DB_NAME="ces-lms" \
  -e JWT_SECRET="your-secret-key" \
  -e NODE_ENV="production" \
  --name ces-lms-backend \
  ces-lms-backend
```

### 3. Using .env File

Create a `.env` file in the `node-web-api` directory:

```env
MONGODB_URI=mongodb://admin:password123@mongodb:27017/ces-lms?authSource=admin
MONGODB_DB_NAME=ces-lms
```

Then use it with docker-compose:
```bash
docker-compose --env-file node-web-api/.env up -d
```

### 4. Using Dockerfile ENV (Default Values)

The Dockerfile now includes default ENV values that can be overridden:

```dockerfile
ENV MONGODB_URI=mongodb://mongodb:27017/ces-lms
ENV MONGODB_DB_NAME=ces-lms
```

These are defaults and will be overridden by:
1. docker-compose.yml environment variables
2. Command-line `-e` flags
3. `.env` file (if used)

## MongoDB Connection String Formats

### Local MongoDB (no authentication)
```
mongodb://localhost:27017/ces-lms
```

### Docker MongoDB (with authentication)
```
mongodb://admin:password123@mongodb:27017/ces-lms?authSource=admin
```

### MongoDB Atlas (Cloud)
```
mongodb+srv://username:password@cluster.mongodb.net/ces-lms?retryWrites=true&w=majority
```

### MongoDB with Replica Set
```
mongodb://host1:27017,host2:27017,host3:27017/ces-lms?replicaSet=rs0
```

## Environment Variable Priority

When running in Docker, environment variables are resolved in this order (highest to lowest priority):

1. **Command-line `-e` flags** (docker run)
2. **docker-compose.yml environment section**
3. **Dockerfile ENV statements**
4. **Default values in env.ts**

## Testing the Connection

After starting the container, check logs:

```bash
# Using docker-compose
docker-compose logs backend

# Using docker run
docker logs ces-lms-backend
```

You should see: `MongoDB connected successfully`

## Troubleshooting

### Connection Refused
- Ensure MongoDB container is running: `docker-compose ps`
- Check MongoDB service name matches in connection string
- Verify network connectivity: `docker network ls`

### Authentication Failed
- Verify username/password in connection string
- Check `authSource` parameter matches MongoDB configuration
- Ensure MongoDB is configured with authentication

### Connection Timeout
- Increase `serverSelectionTimeoutMS` in connection options
- Check firewall rules
- Verify MongoDB is accessible from container network

