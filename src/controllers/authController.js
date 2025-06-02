const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findByEmail } = require('../models/userModel');

async function login(req, res) {
  try {
    const { email, password } = req.body;
    console.log(`[AUTH] Tentativa de login para email: ${email}`);
    
    const user = await findByEmail(email);
    if (!user) {
      console.log(`[AUTH] Usuário não encontrado: ${email}`);
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      console.log(`[AUTH] Senha incorreta para usuário: ${email}`);
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    const token = jwt.sign(
      { userId: user.id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    console.log(`[AUTH] Login bem-sucedido para usuário: ${email} (ID: ${user.id})`);
    return res.json({ token });
  } catch (error) {
    console.error(`[AUTH] Erro no login:`, error);
    return res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
}

function logout(req, res) {
  console.log(`[AUTH] Logout realizado`);
  return res.json({ message: 'Logout efetuado com sucesso' });
}

module.exports = { login, logout };
