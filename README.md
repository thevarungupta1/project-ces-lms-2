# CES LMS - Corporate Education System Learning Management System

A comprehensive, full-stack Learning Management System (LMS) designed for corporate education and training. This platform provides a complete solution for managing courses, webinars, quizzes, certificates, and user learning paths with role-based access control.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

CES LMS is a modern, enterprise-grade Learning Management System built with a clean architecture pattern. It consists of two main components:

1. **Backend API** (`node-web-api`) - RESTful API built with Node.js, Express, MongoDB, and TypeScript
2. **Frontend Application** (`react-web-app`) - React-based SPA with TypeScript, Vite, and modern UI components

The system supports three user roles:
- **Admin** - Full system access and management
- **Educator** - Course creation, content management, and student oversight
- **Learner** - Course enrollment, quiz taking, and certificate viewing

## ✨ Features

### Core Features

- **User Management**
  - User registration and authentication
  - Role-based access control (RBAC)
  - User profile management
  - Department and group organization

- **Course Management**
  - Course creation and editing
  - Course modules and content organization
  - Course assignments to users/groups
  - Course reviews and ratings
  - Category-based organization

- **Learning Paths**
  - Structured learning journeys
  - Multi-step learning paths
  - Progress tracking
  - Enrollment management

- **Assessments**
  - Quiz creation with multiple question types
  - Quiz assignments to users/groups
  - Automatic scoring and feedback
  - Quiz submission tracking

- **Webinars**
  - Live session scheduling
  - Registration management
  - Attendance tracking
  - Recording support

- **Certificates**
  - Certificate template management
  - Automatic certificate issuance
  - Certificate verification
  - PDF generation

- **Communication**
  - Platform-wide announcements
  - User notifications
  - Targeted messaging by audience/department

- **Analytics**
  - Leaderboard with rankings
  - Dashboard with role-specific analytics
  - Progress tracking
  - Engagement metrics

### Technical Features

- **Authentication & Security**
  - JWT-based authentication
  - Refresh token mechanism
  - Password hashing with bcrypt
  - CORS configuration
  - Rate limiting

- **Data Management**
  - MongoDB database
  - Repository pattern
  - Service layer architecture
  - Type-safe API calls
  - Request validation with Zod

- **Frontend Features**
  - React Query for server state
  - Optimistic updates
  - Error handling
  - Loading states
  - Responsive design

## 🛠 Tech Stack

### Backend (`node-web-api`)

- **Runtime**: Node.js (>=18.0.0)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Security**: bcryptjs, helmet, cors
- **Logging**: Winston with daily rotation
- **Other**: express-rate-limit, morgan, compression

### Frontend (`react-web-app`)

- **Framework**: React 18.3.1
- **Language**: TypeScript 5.8.3
- **Build Tool**: Vite 5.4.19
- **Routing**: React Router DOM 6.30.1
- **State Management**: TanStack Query (React Query) 5.83.0
- **Forms**: React Hook Form 7.61.1
- **Validation**: Zod 3.25.76
- **HTTP Client**: Axios
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS 3.4.17
- **Icons**: Lucide React
- **Charts**: Recharts 2.15.4
- **Notifications**: Sonner

## 📁 Project Structure

```
project-ces/
├── node-web-api/                 # Backend API
│   ├── src/
│   │   ├── config/               # Configuration (env, logger)
│   │   ├── core/                 # Core utilities
│   │   │   ├── http/             # HTTP utilities (ApiError, ApiResponse)
│   │   │   ├── middleware/       # Express middleware (auth, validation, error handling)
│   │   │   └── utils/             # Utility functions (crypto, date, validator)
│   │   ├── infrastructure/       # Infrastructure layer
│   │   │   └── database/         # Database connections and repositories
│   │   │       └── mongo/        # MongoDB connection and BaseRepository
│   │   ├── loaders/              # Application loaders
│   │   │   ├── express.ts        # Express app initialization
│   │   │   ├── routes.ts         # Route registration
│   │   │   └── index.ts           # Main loader orchestrator
│   │   ├── models/               # Mongoose models (22 models)
│   │   ├── modules/              # Business modules (22 modules)
│   │   │   ├── auth/             # Authentication module
│   │   │   ├── user/             # User management
│   │   │   ├── course/           # Course management
│   │   │   ├── category/         # Category management
│   │   │   ├── quiz/             # Quiz management
│   │   │   ├── webinar/          # Webinar management
│   │   │   ├── group/            # Group management
│   │   │   ├── learning-path/    # Learning path management
│   │   │   ├── certificate-template/  # Certificate templates
│   │   │   ├── issued-certificate/    # Issued certificates
│   │   │   ├── announcement/     # Announcements
│   │   │   ├── notification/     # Notifications
│   │   │   ├── leaderboard/      # Leaderboard
│   │   │   ├── course-review/    # Course reviews
│   │   │   ├── dashboard/        # Dashboard & analytics
│   │   │   └── ...               # More modules
│   │   ├── schemas/              # Zod validation schemas
│   │   └── server.ts              # Application entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── react-web-app/                # Frontend Application
│   ├── src/
│   │   ├── app/                  # Application-level code
│   │   │   ├── layouts/          # Layout components
│   │   │   ├── navigation/       # Navigation menus by role
│   │   │   └── providers/         # Context providers (Auth, Query)
│   │   ├── components/           # Reusable UI components
│   │   │   ├── ui/               # shadcn/ui base components
│   │   │   └── [Feature components]
│   │   ├── contexts/             # React Context providers
│   │   ├── features/             # Feature modules
│   │   │   ├── auth/             # Authentication
│   │   │   ├── users/            # User management
│   │   │   ├── courses/          # Course management
│   │   │   ├── categories/       # Category management
│   │   │   ├── quizzes/          # Quiz management
│   │   │   ├── webinars/         # Webinar management
│   │   │   ├── groups/           # Group management
│   │   │   ├── learning-paths/   # Learning paths
│   │   │   ├── certificates/    # Certificates
│   │   │   ├── announcements/    # Announcements
│   │   │   ├── notifications/    # Notifications
│   │   │   ├── leaderboard/      # Leaderboard
│   │   │   ├── dashboard/        # Dashboard
│   │   │   └── ...               # More features
│   │   ├── shared/               # Shared utilities
│   │   │   ├── api/              # API client and services
│   │   │   │   ├── client.ts     # Axios instance with interceptors
│   │   │   │   ├── types.ts      # API type definitions
│   │   │   │   ├── errors.ts     # Error handling
│   │   │   │   └── auth.api.ts   # Auth API service
│   │   │   └── hooks/            # Shared React hooks
│   │   ├── pages/                # Route components
│   │   ├── router/               # Route configuration
│   │   └── main.tsx              # Application entry point
│   ├── public/                   # Static assets
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── README.md
│
└── README.md                     # This file
```

## 🏗 Architecture

### Backend Architecture (Clean Enterprise Architecture)

The backend follows a clean, enterprise-level architecture with clear separation of concerns:

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

**Key Principles:**
- **Separation of Concerns**: Each layer has a single responsibility
- **Dependency Inversion**: Higher layers depend on abstractions
- **Repository Pattern**: Data access is abstracted
- **Service Layer**: Business logic is centralized
- **Type Safety**: Full TypeScript implementation

### Frontend Architecture (Feature-Based)

The frontend follows a feature-based architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    UI Components                         │
│              (Pages, Components, Forms)                  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              React Query Hooks                           │
│         (useQuery, useMutation)                          │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  API Services                            │
│         (Feature-specific API calls)                      │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  HTTP Client                             │
│    (Axios with interceptors, token management)          │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  Backend API                             │
│              RESTful Endpoints                            │
└─────────────────────────────────────────────────────────┘
```

**Key Principles:**
- **Feature-Based Organization**: Related code grouped by feature
- **React Query**: Server state management
- **Type Safety**: Full TypeScript implementation
- **Component Composition**: Reusable UI components
- **API Abstraction**: Centralized API client

### Authentication Flow

```
1. User Login
   ↓
2. Backend validates credentials
   ↓
3. Backend generates JWT tokens (access + refresh)
   ↓
4. Frontend stores tokens in localStorage
   ↓
5. Frontend includes access token in all API requests
   ↓
6. On 401 error, frontend automatically refreshes token
   ↓
7. On refresh failure, user is logged out
```

## 🔌 API Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | User login | No |
| POST | `/auth/refresh-token` | Refresh access token | No |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users` | Get all users (paginated) | Yes |
| GET | `/users/:id` | Get user by ID | Yes |
| GET | `/users/profile` | Get current user profile | Yes |
| POST | `/users` | Create new user | Yes (Admin) |
| PUT | `/users/:id` | Update user | Yes (Admin) |
| DELETE | `/users/:id` | Delete user | Yes (Admin) |

### Course Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/courses` | Get all courses (paginated) | Yes |
| GET | `/courses/:id` | Get course by ID | Yes |
| POST | `/courses` | Create new course | Yes (Educator/Admin) |
| PUT | `/courses/:id` | Update course | Yes (Educator/Admin) |
| DELETE | `/courses/:id` | Delete course | Yes (Educator/Admin) |

### Category Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/categories` | Get all categories | Yes |
| GET | `/categories/:id` | Get category by ID | Yes |
| POST | `/categories` | Create category | Yes (Admin) |
| PUT | `/categories/:id` | Update category | Yes (Admin) |
| DELETE | `/categories/:id` | Delete category | Yes (Admin) |

### Quiz Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/quizzes` | Get all quizzes | Yes |
| GET | `/quizzes/:id` | Get quiz by ID | Yes |
| GET | `/quizzes/course/:courseId` | Get quizzes by course | Yes |
| POST | `/quizzes` | Create quiz | Yes (Educator/Admin) |
| PUT | `/quizzes/:id` | Update quiz | Yes (Educator/Admin) |
| DELETE | `/quizzes/:id` | Delete quiz | Yes (Educator/Admin) |

### Quiz Assignment Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/quiz-assignments` | Get all assignments | Yes |
| GET | `/quiz-assignments/:id` | Get assignment by ID | Yes |
| POST | `/quiz-assignments` | Create assignment | Yes (Educator/Admin) |
| POST | `/quiz-assignments/:id/submit` | Submit quiz | Yes |
| PUT | `/quiz-assignments/:id` | Update assignment | Yes (Educator/Admin) |
| DELETE | `/quiz-assignments/:id` | Delete assignment | Yes (Educator/Admin) |

### Webinar Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/webinars` | Get all webinars | Yes |
| GET | `/webinars/upcoming` | Get upcoming webinars | Yes |
| GET | `/webinars/:id` | Get webinar by ID | Yes |
| POST | `/webinars` | Create webinar | Yes (Educator/Admin) |
| PUT | `/webinars/:id` | Update webinar | Yes (Educator/Admin) |
| DELETE | `/webinars/:id` | Delete webinar | Yes (Educator/Admin) |

### Webinar Registration Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/webinar-registrations` | Get all registrations | Yes |
| GET | `/webinar-registrations/:id` | Get registration by ID | Yes |
| POST | `/webinar-registrations` | Register for webinar | Yes |
| PUT | `/webinar-registrations/:id/attendance` | Update attendance | Yes (Educator/Admin) |
| DELETE | `/webinar-registrations/:id` | Cancel registration | Yes |

### Group Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/groups` | Get all groups | Yes |
| GET | `/groups/:id` | Get group by ID | Yes |
| POST | `/groups` | Create group | Yes (Admin) |
| PUT | `/groups/:id` | Update group | Yes (Admin) |
| DELETE | `/groups/:id` | Delete group | Yes (Admin) |
| POST | `/groups/:id/members/:memberId` | Add member | Yes (Admin) |
| DELETE | `/groups/:id/members/:memberId` | Remove member | Yes (Admin) |

### Learning Path Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/learning-paths` | Get all learning paths | Yes |
| GET | `/learning-paths/:id` | Get learning path by ID | Yes |
| POST | `/learning-paths` | Create learning path | Yes (Educator/Admin) |
| PUT | `/learning-paths/:id` | Update learning path | Yes (Educator/Admin) |
| DELETE | `/learning-paths/:id` | Delete learning path | Yes (Educator/Admin) |

### Certificate Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/certificate-templates` | Get all templates | Yes |
| GET | `/certificate-templates/default` | Get default template | Yes |
| GET | `/certificate-templates/:id` | Get template by ID | Yes |
| POST | `/certificate-templates` | Create template | Yes (Admin) |
| PUT | `/certificate-templates/:id` | Update template | Yes (Admin) |
| DELETE | `/certificate-templates/:id` | Delete template | Yes (Admin) |
| GET | `/issued-certificates` | Get all certificates | Yes |
| GET | `/issued-certificates/:id` | Get certificate by ID | Yes |
| GET | `/issued-certificates/verify/:certificateNumber` | Verify certificate | No |
| POST | `/issued-certificates` | Issue certificate | Yes (Admin) |

### Communication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/announcements` | Get all announcements | Yes |
| GET | `/announcements/active` | Get active announcements | Yes |
| GET | `/announcements/:id` | Get announcement by ID | Yes |
| POST | `/announcements` | Create announcement | Yes (Admin) |
| PUT | `/announcements/:id` | Update announcement | Yes (Admin) |
| DELETE | `/announcements/:id` | Delete announcement | Yes (Admin) |
| GET | `/notifications/me` | Get my notifications | Yes |
| GET | `/notifications/me/unread` | Get unread notifications | Yes |
| GET | `/notifications/me/unread-count` | Get unread count | Yes |
| PUT | `/notifications/:id/read` | Mark as read | Yes |
| PUT | `/notifications/me/read-all` | Mark all as read | Yes |

### Analytics Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/leaderboard` | Get leaderboard | Yes |
| GET | `/leaderboard/me` | Get my ranking | Yes |
| GET | `/course-reviews/course/:courseId` | Get course reviews | Yes |
| GET | `/course-reviews/course/:courseId/average` | Get average rating | Yes |
| POST | `/course-reviews` | Create review | Yes |
| GET | `/dashboard` | Get dashboard data | Yes |

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MongoDB** >= 5.0.0 (or MongoDB Atlas account)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-ces
   ```

2. **Install Backend Dependencies**
   ```bash
   cd node-web-api
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../react-web-app
   npm install
   ```

### Configuration

#### Backend Configuration

1. **Create `.env` file in `node-web-api/`**
   ```env
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

#### Frontend Configuration

1. **Create `.env` file in `react-web-app/`**
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   VITE_API_VERSION=v1
   VITE_API_TIMEOUT=30000
   ```

### Running the Application

#### Start MongoDB

Make sure MongoDB is running on your system:
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env file
```

#### Start Backend

```bash
cd node-web-api
npm run dev
```

Backend will start on `http://localhost:3000`

#### Start Frontend

```bash
cd react-web-app
npm run dev
```

Frontend will start on `http://localhost:8080`

### Access the Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000/api/v1

## 💻 Development

### Backend Development

```bash
cd node-web-api

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

### Frontend Development

```bash
cd react-web-app

# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Linting
npm run lint
```

### Code Structure Guidelines

#### Backend Module Structure

Each module follows this structure:
```
modules/[module-name]/
├── [module].repository.ts  # Data access layer
├── [module].service.ts      # Business logic layer
├── [module].controller.ts  # HTTP request handler
└── [module].routes.ts      # Route definitions
```

#### Frontend Feature Structure

Each feature follows this structure:
```
features/[feature-name]/
├── api/
│   └── [feature].api.ts    # API service
├── hooks/
│   └── use[Feature].ts     # React Query hooks
├── components/             # Feature components
├── pages/                  # Feature pages
└── types/
    └── [feature].types.ts  # Type definitions
```

## 🚢 Deployment

### Docker Deployment (Recommended)

#### Using Docker Compose (All Services)

The easiest way to deploy the entire application:

```bash
# Build and start all services (MongoDB, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up -d --build
```

**Services:**
- MongoDB: `localhost:27017`
- Backend API: `http://localhost:3000`
- Frontend: `http://localhost:8080`

**Note:** Update environment variables in `docker-compose.yml` for production.

#### Individual Docker Deployment

**Backend:**
```bash
cd node-web-api

# Build Docker image
docker build -t ces-lms-api .

# Run container
docker run -d \
  --name ces-lms-backend \
  -p 3000:3000 \
  --env-file .env \
  ces-lms-api
```

**Frontend:**
```bash
cd react-web-app

# Build Docker image with build args
docker build -t ces-lms-frontend \
  --build-arg VITE_API_BASE_URL=http://localhost:3000 \
  --build-arg VITE_API_VERSION=v1 \
  --build-arg VITE_API_TIMEOUT=30000 .

# Run container
docker run -d \
  --name ces-lms-frontend \
  -p 8080:80 \
  ces-lms-frontend
```

### Traditional Deployment

#### Backend Deployment

1. **Build the application**
   ```bash
   cd node-web-api
   npm install
   npm run build
   ```

2. **Set production environment variables**
   - Create `.env` file with production values
   - Set secure JWT secrets
   - Configure MongoDB connection string
   - Set CORS origin to production frontend URL

3. **Start the server**
   ```bash
   # Using PM2 (recommended)
   npm install -g pm2
   pm2 start dist/server.js --name ces-lms-api
   
   # Or using npm
   npm start
   ```

4. **Deployment Options:**
   - **VPS/Cloud Server**: Deploy to AWS EC2, DigitalOcean, Linode, etc.
   - **Platform as a Service**: Deploy to Heroku, Railway, Render, Fly.io
   - **Container Platform**: Deploy to AWS ECS, Google Cloud Run, Azure Container Instances

#### Frontend Deployment

1. **Build the application**
   ```bash
   cd react-web-app
   npm install
   
   # Set environment variables
   export VITE_API_BASE_URL=https://api.yourdomain.com
   
   # Build
   npm run build
   ```

2. **Deploy the `dist/` folder**

   **Option 1: Static Hosting Services**
   - **Vercel**: `vercel --prod`
   - **Netlify**: `netlify deploy --prod --dir=dist`
   - **GitHub Pages**: Push `dist/` to `gh-pages` branch
   - **AWS S3 + CloudFront**: Upload `dist/` to S3 bucket

   **Option 2: Traditional Web Server**
   ```bash
   # Copy dist folder to server
   scp -r dist/* user@server:/var/www/html/
   
   # Or use nginx
   # Configure nginx to serve dist/ folder
   ```

   **Option 3: Container Platform**
   - Build Docker image and deploy to container registry
   - Deploy to AWS ECS, Google Cloud Run, Azure Container Instances

### Cloud Platform Deployment

#### AWS Deployment

**Backend:**
- Deploy to AWS ECS/Fargate or EC2
- Use AWS RDS for MongoDB or DocumentDB
- Use AWS Secrets Manager for environment variables

**Frontend:**
- Deploy to AWS S3 + CloudFront
- Or use AWS Amplify

#### Google Cloud Deployment

**Backend:**
- Deploy to Cloud Run or Compute Engine
- Use Cloud SQL for MongoDB or MongoDB Atlas

**Frontend:**
- Deploy to Firebase Hosting or Cloud Storage + CDN

#### Azure Deployment

**Backend:**
- Deploy to Azure App Service or Container Instances
- Use Azure Cosmos DB or MongoDB Atlas

**Frontend:**
- Deploy to Azure Static Web Apps or Blob Storage + CDN

### Environment Variables for Production

**Backend (.env):**
```env
NODE_ENV=production
PORT=3000
API_VERSION=v1

# MongoDB (use MongoDB Atlas for production)
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/ces-lms
MONGODB_DB_NAME=ces-lms

# JWT (use strong, unique secrets)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRES_IN=30d

# CORS (set to production frontend URL)
CORS_ORIGIN=https://yourdomain.com
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_DIR=logs
```

**Frontend (.env):**
```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_API_VERSION=v1
VITE_API_TIMEOUT=30000
```

### Production Checklist

**Backend:**
- ✅ Use strong, unique JWT secrets
- ✅ Use MongoDB Atlas or secure MongoDB instance
- ✅ Set proper CORS origin
- ✅ Enable rate limiting
- ✅ Configure logging
- ✅ Set up monitoring (e.g., PM2, New Relic)
- ✅ Enable HTTPS/SSL
- ✅ Set up backup strategy
- ✅ Configure firewall rules
- ✅ Use environment variables for secrets

**Frontend:**
- ✅ Set production API base URL
- ✅ Enable production optimizations
- ✅ Configure CDN for static assets
- ✅ Enable HTTPS/SSL
- ✅ Set up error tracking (e.g., Sentry)
- ✅ Configure caching headers
- ✅ Test all features in production environment

### Monitoring & Maintenance

- **Logs**: Monitor application logs for errors
- **Performance**: Use tools like PM2, New Relic, or Datadog
- **Database**: Monitor MongoDB performance and set up backups
- **Security**: Regularly update dependencies, review security patches
- **Backups**: Set up automated backups for MongoDB
- **SSL Certificates**: Use Let's Encrypt or similar for HTTPS

## 📝 API Response Format

### Success Response
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

### Error Response
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

## 🔐 Authentication

### Login Flow

1. **POST** `/api/v1/auth/login`
   ```json
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

2. **Response**
   ```json
   {
     "success": true,
     "message": "Login successful",
     "data": {
       "user": { ... },
       "accessToken": "eyJhbGc...",
       "refreshToken": "eyJhbGc..."
     }
   }
   ```

3. **Store tokens** in localStorage
4. **Include access token** in Authorization header:
   ```
   Authorization: Bearer <accessToken>
   ```

### Token Refresh

When access token expires (401 error):
1. Frontend automatically calls `/api/v1/auth/refresh-token`
2. Backend validates refresh token
3. Backend returns new access and refresh tokens
4. Frontend updates stored tokens
5. Original request is retried with new token

## 🧪 Testing

### Backend Testing

```bash
cd node-web-api
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Frontend Testing

```bash
cd react-web-app
npm test              # Run all tests
npm run test:watch    # Watch mode
```

## 📚 Additional Documentation

- [Backend README](node-web-api/README.md) - Detailed backend documentation
- [Frontend README](react-web-app/README.md) - Detailed frontend documentation
architecture details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use ESLint for code linting
- Write meaningful commit messages
- Add comments for complex logic
- Follow existing code structure

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Development Team

## 🙏 Acknowledgments

- Built with modern web technologies
- Follows clean architecture principles
- Enterprise-grade security practices

---

**Note**: This is a comprehensive Learning Management System. For specific module documentation, refer to individual module README files or the detailed documentation in each project directory.

## 🔐 Test Credentials

After seeding the database (`npm run seed`), you can login with the following credentials:

### Admin User
- **Email:** `sarah.johnson@company.com`
- **Password:** `admin123`
- **Role:** Admin
- **Department:** Administration

### Educator Users
1. **Email:** `michael.chen@company.com`
   - **Password:** `educator123`
   - **Department:** Engineering

2. **Email:** `emily.rodriguez@company.com`
   - **Password:** `educator123`
   - **Department:** Marketing

### Learner Users
1. **Email:** `david.kim@company.com`
   - **Password:** `learner123`
   - **Department:** Sales

2. **Email:** `jessica.taylor@company.com`
   - **Password:** `learner123`
   - **Department:** Engineering

3. **Email:** `robert.brown@company.com`
   - **Password:** `learner123`
   - **Department:** Operations
   - **Status:** Inactive