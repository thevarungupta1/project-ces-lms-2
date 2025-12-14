# CES LMS Frontend Application

A modern, feature-rich Learning Management System frontend built with React, TypeScript, and Vite. This application provides a complete user interface for managing corporate education, including courses, webinars, quizzes, certificates, and user management.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Docker](#docker)
- [Build & Deployment](#build--deployment)
- [API Integration](#api-integration)

## 🎯 Overview

This is the frontend application for the CES LMS platform. It's a Single Page Application (SPA) built with React 18, providing a modern, responsive user interface for all LMS features.

### Key Highlights

- ✅ **Feature-Based Architecture** - Modular, scalable codebase
- ✅ **Role-Based Access Control** - Admin, Educator, and Learner roles
- ✅ **Modern UI/UX** - Built with shadcn/ui and Tailwind CSS
- ✅ **Type-Safe** - Full TypeScript implementation
- ✅ **Responsive Design** - Works on all device sizes
- ✅ **API Integration** - Connected to backend API
- ✅ **State Management** - React Query for server state
- ✅ **Form Handling** - React Hook Form with Zod validation

## ✨ Features

### Core Features

- **Dashboard** - Role-specific dashboards with analytics and insights
- **Course Management** - Create, edit, and manage courses with modules and content
- **Learning Paths** - Structured learning journeys with multiple steps
- **Webinars** - Schedule and manage live training sessions
- **Quizzes & Assessments** - Create quizzes with assignment capabilities
- **Certificates** - Generate and manage certificates for course completion
- **User Management** - Comprehensive user administration
- **Groups** - Organize users into groups for targeted learning
- **Leaderboard** - Track and display user achievements
- **Notifications** - Real-time notification system
- **Announcements** - Platform-wide announcements
- **Categories** - Organize courses and content by categories
- **Settings** - Platform configuration and preferences

### User Roles

1. **Admin**
   - Full system access
   - User management
   - Platform settings
   - Content creation and management

2. **Educator**
   - Course creation and management
   - Quiz creation and assignment
   - Student management
   - Content delivery

3. **Learner**
   - Course enrollment and completion
   - Quiz taking
   - Certificate viewing
   - Profile management

### Technical Features

- JWT Authentication with auto-refresh
- React Query for server state management
- Optimistic updates
- Error handling and retry logic
- Loading states and skeletons
- Toast notifications
- Form validation with Zod
- Responsive design
- Dark mode support (if implemented)

## 🛠 Tech Stack

### Core Technologies

- **React** 18.3.1 - UI library
- **TypeScript** 5.8.3 - Type safety
- **Vite** 5.4.19 - Build tool and dev server
- **React Router DOM** 6.30.1 - Client-side routing

### UI & Styling

- **Tailwind CSS** 3.4.17 - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Recharts** 2.15.4 - Chart library for analytics

### State & Data Management

- **TanStack Query** 5.83.0 - Server state management
- **React Hook Form** 7.61.1 - Form handling
- **Zod** 3.25.76 - Schema validation
- **Axios** - HTTP client

### Additional Libraries

- **date-fns** 3.6.0 - Date manipulation
- **jsPDF** 3.0.4 - PDF generation
- **html2canvas** 1.4.1 - HTML to canvas conversion
- **Sonner** - Toast notifications

## 🏗 Architecture

### Feature-Based Architecture

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

### Feature Structure

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

## 📁 Project Structure

```
react-web-app/
├── src/
│   ├── app/                # Application-level code
│   │   ├── layouts/        # Layout components
│   │   ├── navigation/     # Navigation menus by role
│   │   └── providers/      # Context providers (Auth, Query)
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # shadcn/ui base components
│   │   └── [Feature components]
│   ├── contexts/           # React Context providers
│   ├── features/           # Feature modules
│   │   ├── auth/           # Authentication
│   │   ├── users/          # User management
│   │   ├── courses/        # Course management
│   │   ├── categories/     # Category management
│   │   ├── quizzes/        # Quiz management
│   │   ├── webinars/       # Webinar management
│   │   ├── groups/         # Group management
│   │   ├── learning-paths/  # Learning paths
│   │   ├── certificates/   # Certificates
│   │   ├── announcements/  # Announcements
│   │   ├── notifications/  # Notifications
│   │   ├── leaderboard/    # Leaderboard
│   │   └── dashboard/      # Dashboard
│   ├── shared/             # Shared utilities
│   │   ├── api/            # API client and services
│   │   │   ├── client.ts   # Axios instance
│   │   │   ├── types.ts    # API types
│   │   │   └── errors.ts   # Error handling
│   │   ├── hooks/          # Shared React hooks
│   │   ├── components/     # Shared components
│   │   ├── ui/             # UI components
│   │   └── utils/          # Utility functions
│   ├── pages/              # Route components
│   ├── router/             # Route configuration
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── Dockerfile
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd react-web-app
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

4. **Run the development server**
   ```bash
   npm run dev
   ```

The application will start on `http://localhost:8080` (or the port specified in Vite config).

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000
VITE_API_VERSION=v1
VITE_API_TIMEOUT=30000
```

### Environment Variables for Production

```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_API_VERSION=v1
VITE_API_TIMEOUT=30000
```

## 💻 Development

### Available Scripts

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Linting
npm run lint
```

### Development Server

The development server runs on `http://localhost:8080` by default (configurable in `vite.config.ts`).

### Code Style

- Follow TypeScript best practices
- Use ESLint for code linting
- Follow the existing feature structure
- Use functional components with hooks
- Prefer composition over inheritance

### Adding a New Feature

1. Create feature directory in `src/features/[feature-name]/`
2. Add feature structure (api, hooks, components, pages, types)
3. Create API service in `api/[feature].api.ts`
4. Create React Query hooks in `hooks/use[Feature].ts`
5. Add routes in router configuration
6. Add navigation items in `app/navigation/`

## 🐳 Docker

### Build Docker Image

```bash
docker build -t ces-lms-frontend .
```

### Run Docker Container

```bash
docker run -d \
  --name ces-lms-frontend \
  -p 8080:80 \
  --env-file .env \
  ces-lms-frontend
```

### Using Docker Compose

See the root `docker-compose.yml` for a complete setup with backend.

## 🏭 Build & Deployment

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Deployment Options

1. **Static Hosting** (Vercel, Netlify, GitHub Pages)
   - Build the project
   - Deploy the `dist/` folder
   - Set environment variables in hosting platform

2. **Traditional Hosting**
   - Build the project
   - Serve `dist/` with a web server (nginx, Apache)
   - Configure reverse proxy if needed

3. **Container Deployment**
   - Build Docker image
   - Deploy to container platform (Docker Hub, AWS ECS, etc.)

### Build Configuration

The build is configured in `vite.config.ts`. For production:
- Set `VITE_API_BASE_URL` to production backend URL
- Enable production optimizations
- Configure base path if needed

## 🔌 API Integration

### API Client

The application uses a centralized API client (`src/shared/api/client.ts`) with:
- Automatic JWT token injection
- Token refresh on 401 errors
- Error handling and transformation
- Request/response interceptors

### Authentication

1. User logs in → API call to `/api/v1/auth/login`
2. Tokens stored in localStorage
3. Access token included in all requests
4. Automatic token refresh on expiration

### Using API Services

```typescript
import { useCourses } from '@/features/courses/hooks/useCourses';

function CoursesPage() {
  const { data, isLoading, error } = useCourses();
  
  if (isLoading) return <Loading />;
  if (error) return <Error />;
  
  return <CourseList courses={data?.data} />;
}
```

## 🎨 UI Components

The application uses **shadcn/ui** components built on Radix UI primitives. All components are in `src/shared/ui/` and can be customized.

### Available Components

- Button, Input, Select, Checkbox, Radio
- Dialog, Dropdown, Popover, Tooltip
- Table, Card, Badge, Avatar
- Form components
- And many more...

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px - 1920px)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

## 🧪 Testing

```bash
# Run tests (if configured)
npm test

# Run tests in watch mode
npm run test:watch
```

## 📝 Path Aliases

The project uses path aliases configured in `vite.config.ts`:

```typescript
@/app          → src/app
@/features     → src/features
@/shared       → src/shared
@/router       → src/router
@/data         → src/data
@/assets       → src/assets
```

## 🔐 Security

- JWT token storage in localStorage
- Automatic token refresh
- CORS configuration
- Input validation with Zod
- XSS protection
- Secure API communication

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

