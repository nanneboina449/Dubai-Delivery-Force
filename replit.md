# UrbanFleet - Delivery Workforce Platform

## Overview

UrbanFleet is a delivery workforce solutions platform serving the UAE market. The application allows delivery riders to apply for positions, contractors to register their fleet services, and businesses to submit inquiries for delivery workforce needs. The platform features a modern React frontend with a Node.js/Express backend, using PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for UI animations
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite

The frontend follows a page-based structure with reusable UI components. All pages are in `client/src/pages/` and shared components in `client/src/components/ui/`.

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (compiled with tsx for development, esbuild for production)
- **API Style**: RESTful JSON endpoints under `/api/`

The server handles form submissions for rider applications, contractor applications, and business inquiries. Routes are registered in `server/routes.ts` and storage logic is abstracted in `server/storage.ts`.

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Schema Location**: `shared/schema.ts`
- **Migrations**: Drizzle Kit (`drizzle-kit push` for schema sync)

Database tables include:
- `users` - Basic user accounts
- `rider_applications` - Delivery rider job applications
- `contractor_applications` - Fleet contractor registrations
- `business_inquiries` - Business partnership inquiries

### Shared Code
The `shared/` directory contains code used by both frontend and backend, primarily the database schema and Zod validation schemas generated via `drizzle-zod`.

### Build Process
- Development: Vite dev server for frontend, tsx for backend with hot reload
- Production: Vite builds static assets to `dist/public`, esbuild bundles server to `dist/index.cjs`
- The Express server serves the built frontend in production mode

## External Dependencies

### Database
- **PostgreSQL**: Required via `DATABASE_URL` environment variable
- **connect-pg-simple**: Session storage in PostgreSQL (available but sessions not currently implemented)

### UI Components
- **Radix UI**: Headless component primitives for accessibility
- **shadcn/ui**: Pre-built component library using Radix and Tailwind
- **Lucide React**: Icon library
- **Embla Carousel**: Carousel/slider functionality

### Development Tools
- **Replit Vite Plugins**: Development banner, cartographer, and runtime error overlay for Replit environment
- **Custom Meta Images Plugin**: Handles OpenGraph image URLs for deployments