const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    console.log(`[AUTH] Token ausente na requisição para ${req.method} ${req.path}`);
    return res.status(401).json({ message: 'Token ausente' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log(`[AUTH] Token inválido na requisição para ${req.method} ${req.path}:`, err.message);
      return res.status(403).json({ message: 'Token inválido' });
    }
    
    console.log(`[AUTH] Token válido para usuário ${user.name} (ID: ${user.userId}) - ${req.method} ${req.path}`);
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
