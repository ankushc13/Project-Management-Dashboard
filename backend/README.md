# Project Management Backend

SQLite-based REST API for the Project Management Dashboard.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Initialize the database:
```bash
npm run init-db
```

This will create `project-management.db` with sample data.

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server runs on: http://localhost:3000

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Projects
- `GET /api/projects` - Get all projects (with members)
- `GET /api/projects/:id` - Get project by ID (with members)
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `GET /api/projects/:projectId/tasks` - Get tasks for a project
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Database Schema

### Users
- id (INTEGER PRIMARY KEY)
- name (TEXT)
- role (TEXT: 'Manager' | 'Developer' | 'Tester')
- email (TEXT UNIQUE)

### Projects
- id (INTEGER PRIMARY KEY)
- name (TEXT)
- description (TEXT)
- status (TEXT: 'Active' | 'Completed' | 'On Hold')
- startDate (TEXT)
- endDate (TEXT)
- members (array of user IDs via project_members junction table)

### Tasks
- id (INTEGER PRIMARY KEY)
- projectId (INTEGER, FOREIGN KEY)
- title (TEXT)
- description (TEXT)
- status (TEXT: 'To Do' | 'In Progress' | 'Done')
- assignedTo (INTEGER, FOREIGN KEY)
- dueDate (TEXT)
