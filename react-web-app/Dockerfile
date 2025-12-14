# Frontend React App Dockerfile for Azure Ubuntu VM (x64)
FROM --platform=linux/amd64 node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --legacy-peer-deps && npm cache clean --force

# Copy source code and config files
COPY . .

# Build arguments for environment variables
ARG VITE_API_BASE_URL
ARG VITE_API_VERSION
ARG VITE_API_TIMEOUT

# Set environment variables for build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_API_VERSION=$VITE_API_VERSION
ENV VITE_API_TIMEOUT=$VITE_API_TIMEOUT

# Build the application
RUN npm run build

# Production stage with nginx
FROM --platform=linux/amd64 nginx:alpine AS production

# Copy built application from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Add health check script
RUN echo '#!/bin/sh' > /healthcheck.sh && \
    echo 'wget --quiet --tries=1 --spider http://localhost/ || exit 1' >> /healthcheck.sh && \
    chmod +x /healthcheck.sh

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD /healthcheck.sh

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
