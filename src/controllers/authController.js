const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findByEmail } = require('../models/userModel');

async function login(req, res) {
  const { email, password } = req.body;
  // Considerar try/catch para capturar falhas de DB
  const user = await findByEmail(email);
  if (!user) return res.status(400).json({ message: 'Usuário não encontrado' });

  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) return res.status(401).json({ message: 'Senha incorreta' });

  const token = jwt.sign(
    { userId: user.id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  return res.json({ token });
}

function logout(req, res) {
  return res.json({ message: 'Logout efetuado com sucesso' });
}

module.exports = { login, logout };
