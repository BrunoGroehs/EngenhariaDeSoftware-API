require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

// Tratamento de erros não capturados
process.on('uncaughtException', (err) => {
  console.error('[SERVER] Erro não capturado:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[SERVER] Promise rejeitada não tratada:', reason);
  console.error('Promise:', promise);
  process.exit(1);
});

const server = app.listen(PORT, () => {
  console.log(`[SERVER] Servidor rodando na porta ${PORT}`);
  console.log(`[SERVER] Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[SERVER] Timestamp: ${new Date().toISOString()}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[SERVER] SIGTERM recebido, encerrando servidor...');
  server.close(() => {
    console.log('[SERVER] Servidor encerrado com sucesso');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[SERVER] SIGINT recebido, encerrando servidor...');
  server.close(() => {
    console.log('[SERVER] Servidor encerrado com sucesso');
    process.exit(0);
  });
});
