const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const dotenv = require('dotenv'); // Import dotenv

const app = express();
const port = process.env.PORT || 3000; // Use environment port or default

// ✅ Load environment variables
dotenv.config();

// ✅ CORS setup — allow specific origin from .env
const allowedOrigin = process.env.ALLOWED_ORIGIN ;
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

app.use(express.json());

// ✅ PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432, // Ensure port is a number
});

// Helper function to handle database errors
const handleDatabaseError = (err, res, operation) => {
  console.error(`${operation} error:`, err);
  res.status(500).send('Server error');
};

// ✅ Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, description, priority, due_date FROM tasks ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    handleDatabaseError(err, res, 'GET /tasks');
  }
});

// ✅ Add a new task
app.post('/tasks', async (req, res) => {
  const { description, priority, due_date } = req.body;
  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO tasks (description, priority, due_date) VALUES ($1, $2, $3) RETURNING id, description, priority, due_date',
      [description, priority, due_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    handleDatabaseError(err, res, 'POST /tasks');
  }
});

// ✅ Update a task
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { description, priority, due_date } = req.body;
  try {
    const result = await pool.query(
      'UPDATE tasks SET description = $1, priority = $2, due_date = $3 WHERE id = $4 RETURNING id, description, priority, due_date',
      [description, priority, due_date, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    handleDatabaseError(err, res, `PUT /tasks/${id}`);
  }
});

// ✅ Delete a task
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.sendStatus(204);
  } catch (err) {
    handleDatabaseError(err, res, `DELETE /tasks/${id}`);
  }
});

// ✅ Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
  console.log(`✅ Allowed Origin: ${allowedOrigin}`);
});