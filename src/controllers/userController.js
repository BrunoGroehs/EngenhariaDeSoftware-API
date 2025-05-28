const bcrypt = require('bcrypt');
const {
  createUser,
  findById,
  updateUser,
  softDeleteUser
} = require('../models/userModel');

async function create(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Campos obrigatórios ausentes' });

  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await createUser(name, email, hash);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar usuário', error: err.message });
  }
}

async function get(req, res) {
  const { id } = req.params;
  const user = await findById(id);
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
  res.json(user);
}

async function update(req, res) {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const user = await updateUser(id, name, email);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar usuário', error: err.message });
  }
}

async function remove(req, res) {
  const { id } = req.params;
  await softDeleteUser(id);
  res.json({ message: 'Usuário removido com sucesso (soft delete)' });
}

module.exports = { create, get, update, remove };
