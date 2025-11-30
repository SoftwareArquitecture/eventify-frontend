# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Eventify** is a comprehensive event management platform built with Vue 3 and Vite. It provides event organizers and service providers with tools to manage events, quotations, tasks, profiles, and calendars.

## Development Commands

### Running the Application
```bash
npm run dev          # Start development server at http://localhost:5173
npm run build        # Build for production
npm run preview      # Preview production build
```

The development server is configured to:
- Run on port 5173 (strict port enforcement)
- Auto-open browser on start
- Accept connections from network (host: true)

### Environment Variables
The project uses environment-specific configuration files:
- `.env.development` - Local development (backend Gateway at `http://localhost:5000/api/v1`)
- `.env.production` - Production settings (deployed at `https://eventify-plaftorm.onrender.com/api/v1`)

Required environment variables:
- `VITE_API_BASE_URL` - Backend API base URL
- `VITE_SERVICE_ITEMS_ENDPOINT_PATH` - Service items endpoint
- `VITE_QUOTE_ORDERS_ENDPOINT_PATH` - Quote orders endpoint
- `VITE_TASKS_ENDPOINT_PATH` - Tasks endpoint

## Architecture

### Domain-Driven Design Structure

The codebase follows a feature-based modular architecture with domain separation:

```
src/
├── event-management/     # Social event CRUD operations (data table view)
├── events/              # Calendar views and event scheduling (calendar view)
├── iam/                 # Identity and Access Management (auth)
├── profile-management/  # User/provider profiles, services, reviews
├── quote-management/    # Quotations and service item management
├── task-management/     # Task boards and columns (Kanban-style)
├── public/              # Public pages (home, header, toolbar)
├── shared/              # Shared utilities and services
├── router/              # Vue Router configuration
└── i18n/                # Internationalization (en, es)
```

**Note**: There are two separate event domains:
- `event-management/` - Handles event CRUD with data table UI at `/events` route
- `events/` - Handles calendar-based event visualization at `/calendar` route

Each domain module typically contains:
- `components/` - Vue components specific to the domain
- `pages/` - Page-level components (route destinations)
- `services/` - API service layer
- `model/` - Entity classes and data models

### Authentication Flow

**Authentication is handled via the IAM module with JWT token-based authentication:**

1. **Store**: `authentication.store.js` (Pinia) manages auth state
   - State: `signedIn`, `userId`, `username`
   - Token stored in localStorage
   - `initializeAuth()` restores state on app load

2. **Guard**: `authentication.guard.js` protects routes
   - Public routes: `/sign-in`, `/sign-up`, `/about`, `/page-not-found`
   - All other routes require authentication
   - Redirects to `/sign-in` if not authenticated

3. **Interceptor**: `authentication.interceptor.js` adds JWT to requests
   - Request interceptor: Adds `Authorization: Bearer <token>` header
   - Response interceptor: Handles 401 errors

4. **Initialization**: `main.js` calls `initializeAuth()` before mounting app

**Important**: Authentication state must be restored from localStorage on app initialization to maintain sessions across page refreshes.

### HTTP Client Configuration

All API calls use `src/shared/services/http.instance.js`:
- Pre-configured axios instance with base URL from environment
- Authentication interceptors automatically attached
- Default headers: `Content-Type: application/json`

### Routing Architecture

Router configuration in `src/router/index.js`:
- Uses `createWebHistory` mode
- `beforeEach` guard calls `authenticationGuard` for all routes
- Dynamic page titles: `Eventify | {route.name}`
- Lazy-loaded components using `() => import()` for code splitting

### State Management

**Pinia stores** are used for global state:
- `authentication.store.js` - Auth state (sign-in, sign-up, sign-out)
- Each domain may have its own stores

### Internationalization

Vue I18n configuration (`src/i18n/index.js`):
- Supported locales: `en` (English), `es` (Spanish)
- Fallback locale: `en`
- Global injection enabled
- Locale files in `src/locales/`

### UI Component Library

**PrimeVue 4.3.4** with Material Design preset:
- All PrimeVue components registered with `pv-` prefix
- Examples: `pv-dialog`, `pv-button`, `pv-data-table`, `pv-calendar`
- FullCalendar integration: `pv-full-calendar`
- Theme configured in `main.js` via `PrimeVue.use()`
- Additional UI: PrimeIcons, PrimeFlex (utility CSS)

## Key Patterns and Conventions

### Service Layer Pattern

Services are the single source of truth for API communication:
```javascript
// Example: event.service.js
const EventService = {
    async getEvents(params = {}) {
        const response = await httpInstance.get('/social-events', { params });
        return response;
    },
    createEvent(eventData) {
        return httpInstance.post('/social-events', eventData);
    },
    // ... other methods
};
export default EventService;
```

Services handle:
- Data transformation between backend and frontend formats
- Consistent error handling
- Endpoint abstraction

### Component Naming Convention

- Suffix components with `.component.vue`
- Page components in `pages/` folder
- Reusable components in `components/` folder
- Example: `event-card.component.vue`, `home.component.vue`

### Event Creation and Editing Routes

Event creation and editing routes use the dialog component:
- `/events/create` - Create new event
- `/events/:id/edit` - Edit existing event

Both routes use: `../event-management/components/event-create-and-edit-dialog.component.vue`

### Data Transformation Pattern

Backend and frontend may use different field names. Services transform data:
```javascript
transformEventFromBackend(backendEvent) {
    return {
        title: backendEvent.eventTitle || backendEvent.title,
        date: backendEvent.eventDate || backendEvent.date,
        status: this.getStatusText(backendEvent.status), // Number to text
        // ...
    };
}
```

### Status Enumeration

Event statuses use numeric values in backend, text in frontend:
- `0` → `'Active'`
- `1` → `'To be confirmed'`
- `2` → `'Cancelled'`
- `3` → `'Completed'`

## Component Integration

### Layout Structure

The app layout (defined in `App.vue`) conditionally renders based on route:
```vue
<!-- Header and Toolbar hidden on auth pages -->
<header-content v-if="!isAuthPage" />
<toolbar-content v-if="!isAuthPage" />
<router-view></router-view>
```

Auth pages (`sign-in`, `sign-up`) display full-screen without navigation.

### Full Calendar Integration

Calendar functionality uses `@fullcalendar/vue3` with plugins:
- `@fullcalendar/daygrid` - Day grid view
- `@fullcalendar/timegrid` - Time grid view
- `@fullcalendar/interaction` - Drag & drop, click events

Registered as `pv-full-calendar` component.

## Important Notes for Development

### Authentication Debugging

The codebase includes extensive console logging for auth flow:
- Look for emoji prefixes: 🔐 (sign-in), 🛡️ (guard), 🔄 (restore), ✅ (success), ❌ (error)
- Check browser console for authentication state transitions
- Verify localStorage contains: `token`, `userId`, `username`

### Router Navigation After Auth

After successful sign-in, users are redirected to `/events` (Events page).
After sign-up, users are redirected to `/sign-in`.

### Backend API Expectations

The frontend expects a RESTful backend at the URL specified in `VITE_API_BASE_URL`:
- Endpoints: `/social-events`, `/quotes`, `/service-items`, `/tasks`, `/profiles`
- Authentication via JWT token in `Authorization` header
- Error responses should include proper HTTP status codes (especially 401 for unauthorized)

## Team Information

This is a university project by the **AngelDevs-Web** team:
- Cuya Villegas Rafael Alberto (U201913495)
- Torres Garcia Andrés Alberto (U202220518)
- Berrocal Ramírez Omar Christian (U20201B529)
- Horna Silva Fabio (U202020229)
- Carlos Alvarez Ponce (U201919386)
