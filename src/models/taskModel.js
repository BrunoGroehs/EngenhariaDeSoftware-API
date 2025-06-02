const pool = require('../db');

async function createTask(title, description, status, assignedTo) {
  try {
    console.log(`[TASK_MODEL] Criando tarefa no banco: ${title} para usuário ${assignedTo}`);
    const res = await pool.query(
      `INSERT INTO tasks (title, description, status, assigned_to)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, description, status || 'pendente', assignedTo]
    );
    console.log(`[TASK_MODEL] Tarefa criada no banco com ID: ${res.rows[0].id}`);
    return res.rows[0];
  } catch (error) {
    console.error(`[TASK_MODEL] Erro ao criar tarefa ${title}:`, error);
    throw error;
  }
}

async function findById(id) {
  try {
    console.log(`[TASK_MODEL] Buscando tarefa por ID: ${id}`);
    const res = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    const found = res.rows[0] ? 'encontrada' : 'não encontrada';
    console.log(`[TASK_MODEL] Tarefa ID ${id} ${found}`);
    return res.rows[0];
  } catch (error) {
    console.error(`[TASK_MODEL] Erro ao buscar tarefa por ID ${id}:`, error);
    throw error;
  }
}

async function findByUser(userId) {
  try {
    console.log(`[TASK_MODEL] Buscando tarefas para usuário: ${userId}`);
    const res = await pool.query(
      `SELECT * FROM tasks WHERE assigned_to = $1 ORDER BY created_at DESC`,
      [userId]
    );
    console.log(`[TASK_MODEL] Encontradas ${res.rows.length} tarefas para usuário ${userId}`);
    return res.rows;
  } catch (error) {
    console.error(`[TASK_MODEL] Erro ao buscar tarefas para usuário ${userId}:`, error);
    throw error;
  }
}

async function updateTask(id, title, description, status) {
  try {
    console.log(`[TASK_MODEL] Atualizando tarefa ID ${id}: ${title}`);
    const res = await pool.query(
      `UPDATE tasks SET title = $1, description = $2, status = $3, updated_at = NOW()
       WHERE id = $4 RETURNING *`,
      [title, description, status, id]
    );
    const updated = res.rows[0] ? 'atualizada' : 'não encontrada';
    console.log(`[TASK_MODEL] Tarefa ID ${id} ${updated}`);
    return res.rows[0];
  } catch (error) {
    console.error(`[TASK_MODEL] Erro ao atualizar tarefa ID ${id}:`, error);
    throw error;
  }
}

async function deleteTask(id) {
  try {
    console.log(`[TASK_MODEL] Removendo tarefa ID: ${id}`);
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    console.log(`[TASK_MODEL] Tarefa ID ${id} removida`);
  } catch (error) {
    console.error(`[TASK_MODEL] Erro ao remover tarefa ID ${id}:`, error);
    throw error;
  }
}

module.exports = {
  createTask,
  findById,
  findByUser,
  updateTask,
  deleteTask,
};
