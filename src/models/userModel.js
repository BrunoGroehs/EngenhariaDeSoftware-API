const pool = require('../db');

async function createUser(name, email, passwordHash) {
  try {
    console.log(`[USER_MODEL] Criando usuário no banco: ${email}`);
    const res = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name, email, passwordHash]
    );
    console.log(`[USER_MODEL] Usuário criado no banco com ID: ${res.rows[0].id}`);
    return res.rows[0];
  } catch (error) {
    console.error(`[USER_MODEL] Erro ao criar usuário ${email}:`, error);
    throw error;
  }
}

async function findByEmail(email) {
  try {
    console.log(`[USER_MODEL] Buscando usuário por email: ${email}`);
    const res = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL',
      [email]
    );
    const found = res.rows[0] ? 'encontrado' : 'não encontrado';
    console.log(`[USER_MODEL] Usuário ${email} ${found}`);
    return res.rows[0];
  } catch (error) {
    console.error(`[USER_MODEL] Erro ao buscar usuário por email ${email}:`, error);
    throw error;
  }
}

async function findById(id) {
  try {
    console.log(`[USER_MODEL] Buscando usuário por ID: ${id}`);
    const res = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );
    const found = res.rows[0] ? 'encontrado' : 'não encontrado';
    console.log(`[USER_MODEL] Usuário ID ${id} ${found}`);
    return res.rows[0];
  } catch (error) {
    console.error(`[USER_MODEL] Erro ao buscar usuário por ID ${id}:`, error);
    throw error;
  }
}

async function updateUser(id, name, email) {
  try {
    console.log(`[USER_MODEL] Atualizando usuário ID ${id}: ${email}`);
    const res = await pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, created_at',
      [name, email, id]
    );
    const updated = res.rows[0] ? 'atualizado' : 'não encontrado';
    console.log(`[USER_MODEL] Usuário ID ${id} ${updated}`);
    return res.rows[0];
  } catch (error) {
    console.error(`[USER_MODEL] Erro ao atualizar usuário ID ${id}:`, error);
    throw error;
  }
}

async function softDeleteUser(id) {
  try {
    console.log(`[USER_MODEL] Removendo usuário ID: ${id}`);
    await pool.query(
      'UPDATE users SET deleted_at = NOW() WHERE id = $1',
      [id]
    );
    console.log(`[USER_MODEL] Usuário ID ${id} removido (soft delete)`);
  } catch (error) {
    console.error(`[USER_MODEL] Erro ao remover usuário ID ${id}:`, error);
    throw error;
  }
}

module.exports = {
  createUser,
  findByEmail,
  findById,
  updateUser,
  softDeleteUser,
};
