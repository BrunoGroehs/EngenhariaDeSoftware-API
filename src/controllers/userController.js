const bcrypt = require('bcrypt');
const {
  createUser,
  findById,
  updateUser,
  softDeleteUser
} = require('../models/userModel');

async function create(req, res) {
  try {
    const { name, email, password } = req.body;
    console.log(`[USER] Criando novo usuário: ${email}`);
    
    if (!name || !email || !password) {
      console.log(`[USER] Campos obrigatórios ausentes para: ${email}`);
      return res.status(400).json({ message: 'Campos obrigatórios ausentes' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await createUser(name, email, hash);
    
    console.log(`[USER] Usuário criado com sucesso: ${email} (ID: ${user.id})`);
    res.status(201).json(user);
  } catch (err) {
    console.error(`[USER] Erro ao criar usuário:`, err);
    res.status(500).json({ message: 'Erro ao criar usuário', error: err.message });
  }
}

async function get(req, res) {
  try {
    const { id } = req.params;
    console.log(`[USER] Buscando usuário ID: ${id}`);
    
    const user = await findById(id);
    if (!user) {
      console.log(`[USER] Usuário não encontrado ID: ${id}`);
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    console.log(`[USER] Usuário encontrado: ${user.email} (ID: ${id})`);
    res.json(user);
  } catch (err) {
    console.error(`[USER] Erro ao buscar usuário ID ${req.params.id}:`, err);
    res.status(500).json({ message: 'Erro ao buscar usuário', error: err.message });
  }
}

async function update(req, res) {
  const { id } = req.params;
  const { name, email } = req.body;
  
  try {
    console.log(`[USER] Atualizando usuário ID: ${id}`);
    
    const user = await updateUser(id, name, email);
    if (!user) {
      console.log(`[USER] Usuário não encontrado para atualização ID: ${id}`);
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    console.log(`[USER] Usuário atualizado com sucesso: ${user.email} (ID: ${id})`);
    res.json(user);
  } catch (err) {
    console.error(`[USER] Erro ao atualizar usuário ID ${id}:`, err);
    res.status(500).json({ message: 'Erro ao atualizar usuário', error: err.message });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    console.log(`[USER] Removendo usuário ID: ${id}`);
    
    await softDeleteUser(id);
    console.log(`[USER] Usuário removido com sucesso (soft delete) ID: ${id}`);
    res.json({ message: 'Usuário removido com sucesso (soft delete)' });
  } catch (err) {
    console.error(`[USER] Erro ao remover usuário ID ${req.params.id}:`, err);
    res.status(500).json({ message: 'Erro ao remover usuário', error: err.message });
  }
}

module.exports = { create, get, update, remove };
