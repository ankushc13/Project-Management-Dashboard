const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/api/users', async (req, res) => {
  try {
    const users = await db.query('SELECT * FROM users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await db.get('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, role, email } = req.body;
    const result = await db.run(
      'INSERT INTO users (name, role, email) VALUES (?, ?, ?)',
      [name, role, email]
    );
    res.status(201).json({ id: result.id, name, role, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { name, role, email } = req.body;
    await db.run(
      'UPDATE users SET name = ?, role = ?, email = ? WHERE id = ?',
      [name, role, email, req.params.id]
    );
    res.json({ id: parseInt(req.params.id), name, role, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await db.run('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await db.query('SELECT * FROM projects');
    for (let project of projects) {
      const members = await db.query(
        'SELECT userId FROM project_members WHERE projectId = ?',
        [project.id]
      );
      project.members = members.map(m => m.userId);
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await db.get('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (project) {
      const members = await db.query(
        'SELECT userId FROM project_members WHERE projectId = ?',
        [project.id]
      );
      project.members = members.map(m => m.userId);
      res.json(project);
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const { name, description, status, startDate, endDate, members } = req.body;
    const result = await db.run(
      'INSERT INTO projects (name, description, status, startDate, endDate) VALUES (?, ?, ?, ?, ?)',
      [name, description, status, startDate, endDate]
    );
    const projectId = result.id;
    if (members && members.length > 0) {
      for (let userId of members) {
        await db.run(
          'INSERT INTO project_members (projectId, userId) VALUES (?, ?)',
          [projectId, userId]
        );
      }
    }
    res.status(201).json({ id: projectId, name, description, status, startDate, endDate, members });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const { name, description, status, startDate, endDate, members } = req.body;
    await db.run(
      'UPDATE projects SET name = ?, description = ?, status = ?, startDate = ?, endDate = ? WHERE id = ?',
      [name, description, status, startDate, endDate, req.params.id]
    );
    await db.run('DELETE FROM project_members WHERE projectId = ?', [req.params.id]);
    if (members && members.length > 0) {
      for (let userId of members) {
        await db.run(
          'INSERT INTO project_members (projectId, userId) VALUES (?, ?)',
          [req.params.id, userId]
        );
      }
    }
    res.json({ id: parseInt(req.params.id), name, description, status, startDate, endDate, members });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    await db.run('DELETE FROM projects WHERE id = ?', [req.params.id]);
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await db.query('SELECT * FROM tasks');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/projects/:projectId/tasks', async (req, res) => {
  try {
    const tasks = await db.query('SELECT * FROM tasks WHERE projectId = ?', [req.params.projectId]);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/tasks/:id', async (req, res) => {
  try {
    const task = await db.get('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { projectId, title, description, status, assignedTo, dueDate } = req.body;
    const result = await db.run(
      'INSERT INTO tasks (projectId, title, description, status, assignedTo, dueDate) VALUES (?, ?, ?, ?, ?, ?)',
      [projectId, title, description, status, assignedTo, dueDate]
    );
    res.status(201).json({ id: result.id, projectId, title, description, status, assignedTo, dueDate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { projectId, title, description, status, assignedTo, dueDate } = req.body;
    await db.run(
      'UPDATE tasks SET projectId = ?, title = ?, description = ?, status = ?, assignedTo = ?, dueDate = ? WHERE id = ?',
      [projectId, title, description, status, assignedTo, dueDate, req.params.id]
    );
    res.json({ id: parseInt(req.params.id), projectId, title, description, status, assignedTo, dueDate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await db.run('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});
