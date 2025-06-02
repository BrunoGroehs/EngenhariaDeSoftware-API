const {
  createTask,
  findById,
  findByUser,
  updateTask,
  deleteTask
} = require('../models/taskModel');

async function create(req, res) {
  const { title, description, status, assignedTo } = req.body;
  
  try {
    console.log(`[TASK] Criando nova tarefa: ${title} para usuário ${assignedTo}`);
    
    if (!title || !assignedTo) {
      console.log(`[TASK] Campos obrigatórios ausentes - título: ${title}, assignedTo: ${assignedTo}`);
      return res.status(400).json({ message: 'Título e usuário atribuível são obrigatórios' });
    }

    // Segurança: verificar se assignedTo coincide com req.user.userId
    const task = await createTask(title, description, status, assignedTo);
    console.log(`[TASK] Tarefa criada com sucesso: ${task.title} (ID: ${task.id})`);
    res.status(201).json(task);
  } catch (err) {
    console.error(`[TASK] Erro ao criar tarefa:`, err);
    res.status(500).json({ message: 'Erro ao criar tarefa', error: err.message });
  }
}

async function get(req, res) {
  try {
    const { id } = req.params;
    console.log(`[TASK] Buscando tarefa ID: ${id}`);
    
    const task = await findById(id);
    if (!task) {
      console.log(`[TASK] Tarefa não encontrada ID: ${id}`);
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }
    
    console.log(`[TASK] Tarefa encontrada: ${task.title} (ID: ${id})`);
    res.json(task);
  } catch (err) {
    console.error(`[TASK] Erro ao buscar tarefa ID ${req.params.id}:`, err);
    res.status(500).json({ message: 'Erro ao buscar tarefa', error: err.message });
  }
}

async function listByUser(req, res) {
  try {
    const { assignedTo } = req.query;
    console.log(`[TASK] Listando tarefas para usuário: ${assignedTo}`);
    
    if (!assignedTo) {
      console.log(`[TASK] Parâmetro assignedTo ausente`);
      return res.status(400).json({ message: 'Parâmetro assignedTo ausente' });
    }
    
    const tasks = await findByUser(assignedTo);
    console.log(`[TASK] Encontradas ${tasks.length} tarefas para usuário ${assignedTo}`);
    res.json(tasks);
  } catch (err) {
    console.error(`[TASK] Erro ao listar tarefas para usuário ${req.query.assignedTo}:`, err);
    res.status(500).json({ message: 'Erro ao listar tarefas', error: err.message });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    console.log(`[TASK] Atualizando tarefa ID: ${id}`);
    
    const task = await updateTask(id, title, description, status);
    if (!task) {
      console.log(`[TASK] Tarefa não encontrada para atualização ID: ${id}`);
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }
    
    console.log(`[TASK] Tarefa atualizada com sucesso: ${task.title} (ID: ${id})`);
    res.json(task);
  } catch (err) {
    console.error(`[TASK] Erro ao atualizar tarefa ID ${req.params.id}:`, err);
    res.status(500).json({ message: 'Erro ao atualizar tarefa', error: err.message });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    console.log(`[TASK] Removendo tarefa ID: ${id}`);
    
    await deleteTask(id);
    console.log(`[TASK] Tarefa removida com sucesso ID: ${id}`);
    res.json({ message: 'Tarefa removida com sucesso' });
  } catch (err) {
    console.error(`[TASK] Erro ao remover tarefa ID ${req.params.id}:`, err);
    res.status(500).json({ message: 'Erro ao remover tarefa', error: err.message });
  }
}

module.exports = { create, get, listByUser, update, remove };
