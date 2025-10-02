# Uni Tracker

## Overview

Uni Tracker is a comprehensive student productivity application designed to help university students manage their tasks, track study sessions, organize notes, and monitor academic progress. The application combines timer-based study sessions (Pomodoro, stopwatch, countdown), task management with a Kanban board interface, note-taking capabilities, and detailed statistics tracking to provide an all-in-one study companion.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **React** with TypeScript for type-safe component development
- **Vite** as the build tool and development server for fast hot module replacement
- **Wouter** for lightweight client-side routing
- **TanStack Query (React Query)** for server state management, caching, and data synchronization
- **shadcn/ui** component library built on Radix UI primitives for accessible, customizable UI components
- **Tailwind CSS** for utility-first styling with a custom design system

**Design Patterns:**
- Component-based architecture with clear separation between presentational and container components
- Custom hooks (`useAuth`, `useTimer`, `useDragAndDrop`) for shared logic and state management
- Theme provider pattern for light/dark mode support with CSS variables
- Form validation using react-hook-form with Zod schema validation

**State Management:**
- React Query manages all server-side state with automatic caching, background refetching, and optimistic updates
- Local React state for UI-specific concerns (modals, timers, theme)
- Authentication state derived from API queries rather than global context

### Backend Architecture

**Technology Stack:**
- **Express.js** server with TypeScript for type safety
- **Drizzle ORM** for type-safe database queries and schema management
- **Neon Database** (PostgreSQL) as the serverless database provider
- **OpenID Connect** via Replit Auth for authentication

**API Design:**
- RESTful API endpoints organized by resource (`/api/tasks`, `/api/notes`, `/api/sessions`, `/api/stats`)
- Session-based authentication using express-session with PostgreSQL session store
- Middleware pattern for authentication checks (`isAuthenticated`)
- Centralized error handling and request logging

**Database Schema:**
- Users table for authentication and profile information
- Tasks table with status tracking (todo, in_progress, done), priority levels, and due dates
- Notes table with tagging support for organization
- Study sessions table for tracking different timer types (pomodoro, study, countdown)
- User preferences table for personalized settings
- Session storage table for express-session persistence

**Data Flow:**
- Client makes authenticated requests to Express API endpoints
- Routes validate request data using Zod schemas
- Storage layer (storage.ts) provides abstraction over Drizzle ORM queries
- Database operations return typed results through Drizzle schema definitions

### Authentication & Authorization

**Authentication Mechanism:**
- OpenID Connect (OIDC) integration with Replit's authentication service
- Passport.js strategy for OAuth flow handling
- Session-based authentication with secure HTTP-only cookies

**Session Management:**
- PostgreSQL-backed session store using connect-pg-simple
- 7-day session TTL (time-to-live)
- Automatic session renewal on activity
- Secure cookie configuration (httpOnly, secure flags)

**Authorization Pattern:**
- `isAuthenticated` middleware enforces authentication on protected routes
- User ID extracted from OIDC claims (`req.user.claims.sub`)
- Row-level data isolation by userId in all database queries

### External Dependencies

**Database:**
- **Neon Database** - Serverless PostgreSQL with WebSocket connections for compatibility
- Connection pooling via @neondatabase/serverless
- Drizzle Kit for schema migrations

**Authentication Service:**
- **Replit Auth** - OpenID Connect provider
- Environment variables: `ISSUER_URL`, `REPL_ID`, `SESSION_SECRET`

**UI Component Libraries:**
- **Radix UI** - Headless, accessible component primitives (dialogs, dropdowns, popovers, etc.)
- **DND Kit** - Drag-and-drop functionality for Kanban board task reordering

**Development Tools:**
- **Replit-specific plugins** - Cartographer and dev banner for development environment
- Runtime error overlay for better debugging experience

**Styling:**
- **Tailwind CSS** with PostCSS for production builds
- CSS custom properties for theming support
- Google Fonts integration (Inter, DM Sans, Architects Daughter, Fira Code, Geist Mono)

**Build & Deployment:**
- **esbuild** for server-side bundling in production
- **tsx** for TypeScript execution in development
- Vite handles client-side bundling with React plugin
- Static assets served from dist/public in production