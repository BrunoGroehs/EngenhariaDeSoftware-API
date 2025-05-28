const pool = require('../db');

async function createTask(title, description, status, assignedTo) {
  const res = await pool.query(
    `INSERT INTO tasks (title, description, status, assigned_to)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, description, status || 'pendente', assignedTo]
  );
  return res.rows[0];
}

async function findById(id) {
  const res = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
  return res.rows[0];
}

async function findByUser(userId) {
  const res = await pool.query(
    `SELECT * FROM tasks WHERE assigned_to = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return res.rows;
}

async function updateTask(id, title, description, status) {
  const res = await pool.query(
    `UPDATE tasks SET title = $1, description = $2, status = $3, updated_at = NOW()
     WHERE id = $4 RETURNING *`,
    [title, description, status, id]
  );
  return res.rows[0];
}

async function deleteTask(id) {
  await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
}

module.exports = {
  createTask,
  findById,
  findByUser,
  updateTask,
  deleteTask,
};
