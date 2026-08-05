# ArchiFlow Client Project Summary

## Overview

`ArchiFlow` is a React-based client application built with Vite for architecture, interior design, and construction business management. The app combines marketing pages for a customer-facing site with a protected workspace for firm operations, project delivery, BOQ, procurement, finance, and team collaboration.

## Tech Stack

- React 19
- Vite
- JavaScript / JSX
- React Router DOM 7
- Sass / SCSS
- PostCSS
- Radix UI
- Framer Motion
- Recharts
- Sonner (toast notifications)
- Swiper
- date-fns

## Package & Scripts

Defined in `package.json`:

- `npm run dev` — start Vite development server
- `npm run build` — build production bundle
- `npm run lint` — run OXLint
- `npm run preview` — preview built app

## Entry Point

- `src/main.jsx` imports global fonts/styles and renders `<App />` inside React StrictMode.
- `src/App.jsx` provides the React Router provider.
- Routing is defined in `src/routes/router.jsx`.

## Routing & Layout

### Public / Marketing Routes

- `/` — `HomePage`
- `/projects` — marketing projects list
- `/projects/:id` — marketing project detail
- `/services` — services page
- `/about` — about page
- `/journal` — marketing blog/list
- `/journal/:slug` — blog detail
- `/contact` — contact page

These run inside `MainLayout` with `Navbar` and `Footer`.

### Auth Routes

- `/login` — login page
- `/signup` — signup page

These run inside `AuthLayout`.

### Protected Dashboard Workspace

The following routes are wrapped with `ProtectedRoute` and rendered in `DashboardLayout`:

- `/dashboard`
- `/app/projects`
- `/app/projects/new`
- `/app/projects/:id`
- `/clients`
- `/clients/:id`
- `/design-studio`
- `/boq`
- `/boq/new`
- `/boq/:id`
- `/quotations`
- `/quotations/:id`
- `/materials`
- `/vendors`
- `/procurement`
- `/site-progress`
- `/documents`
- `/approvals`
- `/team`
- `/calendar`
- `/finance`
- `/reports`
- `/settings`
- `/ai-assistant`

### Fallback

- `*` — `NotFoundPage`

## Core Layouts

- `src/layouts/MainLayout.jsx` — marketing layout with top navigation and footer.
- `src/layouts/AuthLayout.jsx` — login/signup layout with branding and stats.
- `src/components/templates/dashboard-layout.jsx` — dashboard shell with sidebar, mobile menu, header, and floating action button.

## Application Features

### Dashboard

- Central project and business overview
- Activity feed, AI insights, progress metrics, and charts
- Dashboard components under `src/components/features/dashboard`

### Project Management

- Project list, detail pages, creation workflow
- Milestones, risks, progress, team assignments
- Data seeded in `src/lib/store/project-store.js`

### BOQ & Quotation Workflow

- BOQ creation and editing
- Quantity takeoff wizard
- Estimate calculation and quotation generation
- BOQ service logic in `src/services/boqService.js`
- BOQ helper modules in `src/lib/boq`

### Materials & Procurement

- Material library and catalog views
- Procurement tracking and purchase orders
- Suppliers/vendors planning
- Materials services and stores in `src/services/materialsService.js` and `src/lib/store/material-store.js`

### Clients & Teams

- Client listing and detail pages
- Team pages and user/task management
- Client data in `src/lib/store/client-store.js`

### Documents & Approvals

- Document management dashboards
- Approval workflow pages

### Site Progress & Execution

- Project execution tracking with site progress views
- Design studio and drawing upload support

### Finance & Reporting

- Financial dashboard pages
- Reports and budget insights

### AI Assistant

- Protected route for AI assistant page (`/ai-assistant`)

## Data & State

The project relies on local/mock data stores and client-side state:

- `src/lib/store/project-store.js`
- `src/lib/store/client-store.js`
- `src/lib/store/quotation-store.js`
- `src/lib/store/material-store.js`
- `src/lib/store/document-store.js`
- `src/lib/store/approval-store.js`
- `src/lib/mock/` — seed data, dashboard data, clients, projects, activities, materials

## Services

- `src/services/projectsService.js`
- `src/services/notificationsService.js`
- `src/services/materialsService.js`
- `src/services/boqService.js`

## UI Component Structure

The app is organized with reusable UI building blocks:

- `src/components/atoms` — logo, badges, progress rings, status chips
- `src/components/common` — form controls, buttons, cards, labels, selects, textareas
- `src/components/molecules` — form fields, client pickers, construction details forms
- `src/components/organisms` — sidebar, headers, dashboards, BOQ views, material library, project tab panels, client workspace shell
- `src/components/templates` — page header, dashboard layout
- `src/components/marketing` — hero, services, projects, journal, contact sections

## Styling

- SCSS styles under `src/assets/styles`
- Organized by base, components, layout, pages, utilities, animations
- Global styles imported in `src/main.jsx`

## Branding & Constants

- App name: `ArchiFlow`
- Tagline: `Project & Business Management Platform`
- Current user sample: `Adarsh P`, Principal Architect
- Studio name: `Agara Associates`

## Notes

- The app is currently client-side focused and uses mock data for demo and seeded workflows.
- The protected dashboard workspace assumes authentication routing via `ProtectedRoute`.
- Marketing pages use React.lazy and `Suspense` for code-splitting on non-dashboard content.

---

This summary reflects the current repository structure, routing, features, and major modules of the project.