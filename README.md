# University Course Management Interface

A Vite + React javaScript supervisor dashboard for authenticating against the provided backend API and managing university course data.

## Features

- Supervisor login flow with protected routes
- Create, list, inspect, update, and delete courses
- Search, credit filters, sorting, pagination, and detail panel
- Inline form validation and toast feedback
- Custom delete confirmation modal
- Optimistic create, update, and delete interactions

## Test Credentials

- Email: <admin@example.com>
- Password: adminpassword123

## Scripts

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run test`
- `npm run preview`

## Project Structure

- `src/api/` API client and backend calls
- `src/context/` authentication state
- `src/components/dashboard/` dashboard UI components
- `src/pages/` top-level route pages and dashboard utilities
- `src/types/` shared javaScript types

## Notes

- The app expects the backend documented at:
  - <https://student-management-system-backend.up.railway.app/api-docs/#/>
- Authentication tokens are stored in local storage for protected API access.
- The test suite currently covers shared dashboard logic used for filtering, pagination, summaries, and validation.
