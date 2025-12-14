# CES LMS Backend API

A comprehensive backend API for the CES Learning Management System (LMS) built with Node.js, Express, MongoDB, and TypeScript following Clean Enterprise Architecture principles.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Docker](#docker)
- [Testing](#testing)
- [Deployment](#deployment)

## 🎯 Overview

This is the backend API for the CES LMS platform. It provides a RESTful API with 22 fully implemented modules covering all aspects of a Learning Management System, including user management, courses, quizzes, webinars, certificates, and analytics.

### Key Highlights

- ✅ **Clean Enterprise Architecture** - Separation of concerns with Repository, Service, Controller layers
- ✅ **22 Modules Implemented** - Complete feature set for LMS
- ✅ **JWT Authentication** - Secure authentication with refresh tokens
- ✅ **Role-Based Access Control** - Admin, Educator, Learner roles
- ✅ **Type-Safe** - Full TypeScript implementation
- ✅ **MongoDB Integration** - Mongoose ODM with optimized queries
- ✅ **Request Validation** - Zod schema validation
- ✅ **Error Handling** - Centralized error handling
- ✅ **Logging** - Winston-based logging with rotation

## ✨ Features

### Authentication & Authorization
- JWT-based authentication with access and refresh tokens
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Token refresh mechanism
- Secure session management

### Core Modules (22 Total)

1. **Auth** - Authentication and authorization
2. **User** - User management
3. **Course** - Course management
4. **Category** - Category management
5. **Quiz** - Quiz management
6. **Quiz Assignment** - Quiz assignment and submission
7. **Course Module** - Course module management
8. **Course Content** - Course content management
9. **Course Assignment** - Course assignment management
10. **Webinar** - Webinar management
11. **Webinar Registration** - Webinar registration
12. **Group** - Group management
13. **Learning Path** - Learning path management
14. **Learning Path Step** - Learning path step management
15. **Learning Path Enrollment** - Learning path enrollment
16. **Certificate Template** - Certificate template management
17. **Issued Certificate** - Certificate issuance
18. **Announcement** - Announcement management
19. **Notification** - Notification system
20. **Leaderboard** - Leaderboard and rankings
21. **Course Review** - Course reviews and ratings
22. **Dashboard** - Dashboard and analytics

### Technical Features
- RESTful API design
- Pagination support
- Filtering and searching
- Data validation with Zod
- Error handling middleware
- Request logging with Morgan
- Security headers with Helmet
- CORS configuration
- Rate limiting
- File upload support (Multer)

## 🛠 Tech Stack

- **Runtime**: Node.js (>=18.0.0)
- **Framework**: Express.js 4.18.2
- **Language**: TypeScript 5.3.3
- **Database**: MongoDB with Mongoose 8.0.3
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Validation**: Zod 3.22.4
- **Security**: bcryptjs 2.4.3, helmet 7.1.0
- **Logging**: Winston 3.11.0 with daily rotation
- **Other**: cors, morgan, compression, express-rate-limit, multer

## 🏗 Architecture

### Clean Enterprise Architecture

The project follows a clean, enterprise-level architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    Request Layer                        │
│  Routes → Validation → Authentication → Authorization   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   Controller Layer                       │
│              HTTP Request Handlers                       │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    Service Layer                        │
│              Business Logic & Rules                      │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  Repository Layer                        │
│              Data Access Abstraction                     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   Database Layer                        │
│                    MongoDB                               │
└─────────────────────────────────────────────────────────┘
```

### Module Structure

Each module follows this structure:

```
modules/[module-name]/
├── [module].repository.ts  # Data access layer
├── [module].service.ts      # Business logic layer
├── [module].controller.ts   # HTTP request handler
└── [module].routes.ts       # Route definitions
```

## 📁 Project Structure

```
node-web-api/
├── src/
│   ├── config/              # Configuration
│   │   ├── env.ts          # Environment variables
│   │   └── logger.ts       # Winston logger
│   ├── core/               # Core utilities
│   │   ├── http/           # HTTP utilities
│   │   │   ├── ApiError.ts
│   │   │   └── ApiResponse.ts
│   │   ├── middleware/     # Express middleware
│   │   │   ├── auth.ts     # Authentication & authorization
│   │   │   ├── validation.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── notFoundHandler.ts
│   │   └── utils/          # Utility functions
│   │       ├── crypto.ts
│   │       ├── date.ts
│   │       └── validator.ts
│   ├── infrastructure/     # Infrastructure layer
│   │   └── database/
│   │       └── mongo/
│   │           ├── connection.ts
│   │           └── BaseRepository.ts
│   ├── loaders/            # Application loaders
│   │   ├── express.ts
│   │   ├── routes.ts
│   │   └── index.ts
│   ├── models/             # Mongoose models (22 models)
│   ├── modules/            # Business modules (22 modules)
│   ├── schemas/            # Zod validation schemas
│   └── server.ts           # Application entry point
├── package.json
├── tsconfig.json
├── Dockerfile
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB >= 5.0.0 (or MongoDB Atlas account)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd node-web-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm run build
   npm start
   ```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <accessToken>
```

### Endpoints

See the main [README.md](../README.md) for complete API endpoint documentation.

### Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "path": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Application
NODE_ENV=development
PORT=3000
API_VERSION=v1

# MongoDB
MONGODB_URI=mongodb://localhost:27017/ces-lms
MONGODB_DB_NAME=ces-lms

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRES_IN=30d

# Bcrypt
BCRYPT_ROUNDS=12

# CORS
CORS_ORIGIN=http://localhost:8080
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads

# Logging
LOG_LEVEL=info
LOG_DIR=logs
```

## 💻 Development

### Available Scripts

```bash
# Development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Linting
npm run lint
npm run lint:fix

# Testing
npm test
npm run test:watch
npm run test:coverage
```

### Code Style

- Follow TypeScript best practices
- Use ESLint for code linting
- Follow the existing module structure
- Write meaningful commit messages

## 🐳 Docker

### Build Docker Image

```bash
docker build -t ces-lms-api .
```

### Run Docker Container

```bash
docker run -d \
  --name ces-lms-api \
  -p 3000:3000 \
  --env-file .env \
  ces-lms-api
```

### Using Docker Compose

See the root `docker-compose.yml` for a complete setup with MongoDB.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🚢 Deployment

### Production Build

```bash
npm run build
```

This creates a `dist/` directory with compiled JavaScript.

### Environment Setup

1. Set production environment variables
2. Use secure JWT secrets
3. Configure MongoDB connection string
4. Set CORS origin to production frontend URL
5. Enable rate limiting
6. Configure logging

### Deployment Options

- **Traditional Server**: Deploy to VPS/Cloud server
- **Container**: Use Docker
- **Platform as a Service**: Deploy to Heroku, Railway, Render, etc.

## 📝 Module Implementation Status

All 22 modules are fully implemented:

- ✅ Authentication & Authorization
- ✅ User Management
- ✅ Course Management
- ✅ Category Management
- ✅ Quiz Management
- ✅ Quiz Assignment
- ✅ Course Module & Content
- ✅ Course Assignment
- ✅ Webinar Management
- ✅ Webinar Registration
- ✅ Group Management
- ✅ Learning Path Management
- ✅ Certificate Management
- ✅ Announcement System
- ✅ Notification System
- ✅ Leaderboard
- ✅ Course Reviews
- ✅ Dashboard & Analytics

## 🔐 Security

- JWT token-based authentication
- Password hashing with bcrypt
- CORS configuration
- Rate limiting
- Security headers (Helmet)
- Input validation (Zod)
- SQL injection prevention (Mongoose)
- XSS protection

## 📄 License

ISC License

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

---

For more information, see the main [README.md](../README.md) in the root directory.

