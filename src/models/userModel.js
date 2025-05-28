const pool = require('../db');

// TODO: adicionar validação de parâmetros de entrada e tratamento de exceções
async function createUser(name, email, passwordHash) {
  const res = await pool.query(
    'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
    [name, email, passwordHash]
  );
  return res.rows[0];
}

async function findByEmail(email) {
  const res = await pool.query(
    'SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL',
    [email]
  );
  return res.rows[0];
}

async function findById(id) {
  const res = await pool.query(
    'SELECT id, name, email, created_at FROM users WHERE id = $1 AND deleted_at IS NULL',
    [id]
  );
  return res.rows[0];
}

async function updateUser(id, name, email) {
  const res = await pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, created_at',
    [name, email, id]
  );
  return res.rows[0];
}

async function softDeleteUser(id) {
  await pool.query(
    'UPDATE users SET deleted_at = NOW() WHERE id = $1',
    [id]
  );
}

module.exports = {
  createUser,
  findByEmail,
  findById,
  updateUser,
  softDeleteUser,
};
