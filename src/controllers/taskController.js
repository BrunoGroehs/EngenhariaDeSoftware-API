const {
  createTask,
  findById,
  findByUser,
  updateTask,
  deleteTask
} = require('../models/taskModel');

async function create(req, res) {
  const { title, description, status, assignedTo } = req.body;
  if (!title || !assignedTo)
    return res.status(400).json({ message: 'Título e usuário atribuível são obrigatórios' });

  // Segurança: verificar se assignedTo coincide com req.user.userId
  try {
    const task = await createTask(title, description, status, assignedTo);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar tarefa', error: err.message });
  }
}

async function get(req, res) {
  const { id } = req.params;
  const task = await findById(id);
  if (!task) return res.status(404).json({ message: 'Tarefa não encontrada' });
  res.json(task);
}

async function listByUser(req, res) {
  const { assignedTo } = req.query;
  if (!assignedTo) return res.status(400).json({ message: 'Parâmetro assignedTo ausente' });
  const tasks = await findByUser(assignedTo);
  res.json(tasks);
}

async function update(req, res) {
  const { id } = req.params;
  const { title, description, status } = req.body;
  const task = await updateTask(id, title, description, status);
  if (!task) return res.status(404).json({ message: 'Tarefa não encontrada' });
  res.json(task);
}

async function remove(req, res) {
  const { id } = req.params;
  await deleteTask(id);
  res.json({ message: 'Tarefa removida com sucesso' });
}

module.exports = { create, get, listByUser, update, remove };
