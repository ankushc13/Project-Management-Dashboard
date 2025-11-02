const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'project-management.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

db.run('PRAGMA foreign_keys = ON');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('Manager', 'Developer', 'Tester')),
      email TEXT NOT NULL UNIQUE
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('✓ Users table created');
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL CHECK(status IN ('Active', 'Completed', 'On Hold')),
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Error creating projects table:', err.message);
    } else {
      console.log('✓ Projects table created');
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS project_members (
      projectId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      PRIMARY KEY (projectId, userId),
      FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Error creating project_members table:', err.message);
    } else {
      console.log('✓ Project Members table created');
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      projectId INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL CHECK(status IN ('To Do', 'In Progress', 'Done')),
      assignedTo INTEGER NOT NULL,
      dueDate TEXT NOT NULL,
      FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (assignedTo) REFERENCES users(id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating tasks table:', err.message);
    } else {
      console.log('✓ Tasks table created');
    }
  });

  console.log('\nInserting sample data...');

  const users = [
    { name: 'John Doe', role: 'Manager', email: 'john.doe@example.com' },
    { name: 'Jane Smith', role: 'Developer', email: 'jane.smith@example.com' },
    { name: 'Bob Johnson', role: 'Developer', email: 'bob.johnson@example.com' },
    { name: 'Alice Williams', role: 'Tester', email: 'alice.williams@example.com' }
  ];

  const userStmt = db.prepare('INSERT INTO users (name, role, email) VALUES (?, ?, ?)');
  users.forEach(user => {
    userStmt.run(user.name, user.role, user.email);
  });
  userStmt.finalize(() => console.log('✓ Sample users inserted'));

  const projects = [
    {
      name: 'Website Redesign',
      description: 'Complete overhaul of company website',
      status: 'Active',
      startDate: '2025-10-01',
      endDate: '2025-12-31'
    },
    {
      name: 'Mobile App Development',
      description: 'New mobile app for iOS and Android',
      status: 'Active',
      startDate: '2025-09-15',
      endDate: '2026-03-15'
    },
    {
      name: 'Database Migration',
      description: 'Migrate legacy database to cloud',
      status: 'Completed',
      startDate: '2025-07-01',
      endDate: '2025-10-01'
    }
  ];

  const projectStmt = db.prepare('INSERT INTO projects (name, description, status, startDate, endDate) VALUES (?, ?, ?, ?, ?)');
  projects.forEach(project => {
    projectStmt.run(project.name, project.description, project.status, project.startDate, project.endDate);
  });
  projectStmt.finalize(() => console.log('✓ Sample projects inserted'));

  const projectMembers = [
    { projectId: 1, userId: 1 },
    { projectId: 1, userId: 2 },
    { projectId: 1, userId: 4 },
    { projectId: 2, userId: 1 },
    { projectId: 2, userId: 2 },
    { projectId: 2, userId: 3 },
    { projectId: 3, userId: 2 },
    { projectId: 3, userId: 3 }
  ];

  const memberStmt = db.prepare('INSERT INTO project_members (projectId, userId) VALUES (?, ?)');
  projectMembers.forEach(member => {
    memberStmt.run(member.projectId, member.userId);
  });
  memberStmt.finalize(() => console.log('✓ Sample project members inserted'));

  const tasks = [
    {
      projectId: 1,
      title: 'Design Homepage',
      description: 'Create new homepage design mockups',
      status: 'Done',
      assignedTo: 2,
      dueDate: '2025-10-15'
    },
    {
      projectId: 1,
      title: 'Implement Navigation',
      description: 'Build responsive navigation component',
      status: 'In Progress',
      assignedTo: 2,
      dueDate: '2025-11-10'
    },
    {
      projectId: 1,
      title: 'Test Cross-browser Compatibility',
      description: 'Test website on all major browsers',
      status: 'To Do',
      assignedTo: 4,
      dueDate: '2025-12-15'
    },
    {
      projectId: 2,
      title: 'Setup React Native Project',
      description: 'Initialize React Native project structure',
      status: 'Done',
      assignedTo: 3,
      dueDate: '2025-09-20'
    },
    {
      projectId: 2,
      title: 'Implement User Authentication',
      description: 'Build login and registration screens',
      status: 'In Progress',
      assignedTo: 2,
      dueDate: '2025-11-30'
    }
  ];

  const taskStmt = db.prepare('INSERT INTO tasks (projectId, title, description, status, assignedTo, dueDate) VALUES (?, ?, ?, ?, ?, ?)');
  tasks.forEach(task => {
    taskStmt.run(task.projectId, task.title, task.description, task.status, task.assignedTo, task.dueDate);
  });
  taskStmt.finalize(() => {
    console.log('✓ Sample tasks inserted');
    console.log('\n✅ Database initialized successfully!');
    console.log(`Database location: ${dbPath}`);
  });
});

db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  }
});
