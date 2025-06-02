const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { requestLogger, errorLogger } = require('./middlewares/loggerMiddleware');

// Middleware de logging de requisições
app.use(requestLogger);

app.use(express.json());

// Middleware para tratar erros de JSON malformado
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error(`[APP] JSON malformado na requisição ${req.method} ${req.path}:`, err.message);
    return res.status(400).json({ message: 'JSON inválido na requisição' });
  }
  next(err);
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  console.log(`[APP] Rota não encontrada: ${req.method} ${req.path}`);
  res.status(404).json({ message: 'Rota não encontrada' });
});

// Middleware de logging de erros
app.use(errorLogger);

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  console.error(`[APP] Erro não tratado na requisição ${req.method} ${req.path}:`, err);
  res.status(500).json({ 
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno'
  });
});

module.exports = app;
