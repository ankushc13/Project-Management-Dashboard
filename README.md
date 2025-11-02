# Project Management Dashboard

This repository contains a small full-stack Project Management Dashboard built with an Angular frontend and a Node/Express + SQLite backend. It includes project CRUD, task management, users, and a dashboard with basic stats.

## Status (what's implemented)
- **Backend (Node + Express + SQLite)**
  - `backend/init-db.js` — creates `project-management.db`, schema (users, projects, project_members, tasks) and inserts sample data.
  - `backend/server.js` — REST API for users, projects and tasks:
    - Users: `GET /api/users`, `GET /api/users/:id`, `POST /api/users`, `PUT /api/users/:id`, `DELETE /api/users/:id`
    - Projects: `GET /api/projects`, `GET /api/projects/:id`, `POST /api/projects`, `PUT /api/projects/:id`, `DELETE /api/projects/:id`
    - Tasks: `GET /api/tasks`, `GET /api/tasks/:id`, `GET /api/projects/:projectId/tasks`, `POST /api/tasks`, `PUT /api/tasks/:id`, `DELETE /api/tasks/:id`
  - `backend/database.js` — small wrapper around sqlite3 with Promise helpers.

- **Frontend (Angular 18, standalone components)**
  - Models: `src/app/models/types.ts` (Project, Task, User interfaces)
  - Services: `src/app/services/*` (ProjectService, TaskService, UserService) to call the backend API
  - Layout: `src/app/layout` — top navigation + sidebar with active link highlighting
  - Pages:
    - Dashboard: dynamic counts for projects, tasks and users
    - Projects: list, add/edit form, detail view (including project members)
    - Tasks: global tasks list at `/tasks` and project-scoped task views at `/projects/:id/tasks`
  - Routing: `src/app/app.routes.ts` wired with nested routes for project-scoped tasks

## Key files (quick reference)
- `backend/init-db.js` — initialize DB and seed sample data
- `backend/project-management.db` — created after running the init script
- `backend/server.js` — backend API server
- `src/app/models/types.ts` — TypeScript interfaces
- `src/app/services/*` — HTTP services for API calls
- `src/app/pages/projects/*` — Projects UI and child routes
- `src/app/pages/tasks/*` — Task list, form and details components

## Prerequisites
- Node.js (16+ recommended) and npm
- (Optional) Angular CLI if you want to run Angular commands locally

## Run the app (Windows - cmd.exe recommended)

### 1) Backend

Open a cmd.exe terminal and run:

```cmd
cd C:\angular\project-management-dashboard\backend
npm install
npm run init-db
npm start
```

- `npm run init-db` will create `project-management.db` and insert sample data.
- Backend server will listen on http://localhost:3000 and expose the API under `/api/*`.

### 2) Frontend

In a separate cmd.exe terminal (project root):

```cmd
cd C:\angular\project-management-dashboard
npm install
npm start
```

- The Angular dev server runs at http://localhost:4200 by default.
- If you see PowerShell execution policy errors when running `npx` or scripts, run the above commands from cmd.exe instead of PowerShell.

### 3) Try it

- Open http://localhost:4200
- Go to Projects → create / edit projects.
- Open a project and click "View Tasks" to see project-scoped tasks.
- Or open http://localhost:4200/tasks to view the global tasks list.

## Database location & reset
- The SQLite file is at `backend/project-management.db`.
- To reset the DB: stop the backend, delete `backend/project-management.db`, then re-run `npm run init-db`.

## Troubleshooting
- If `npx` fails in PowerShell with an execution policy error, either run commands in cmd.exe or update PowerShell execution policy. Using cmd.exe is simplest.
- If the frontend can't reach the backend, ensure the backend is running and CORS is enabled (it is by default in `server.js`).

## Next steps / TODOs
- Verify create flow manually in the UI (add a project and confirm it appears in the list).
- Replace alerts/confirm() with a toast/snackbar notification system.
- Add unit/e2e tests and CI if you want automated checks on push.
 - Implement Users feature in the frontend (list/detail/create/edit) — pending.

---
