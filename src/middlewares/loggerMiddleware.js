// Middleware para logging de requisições HTTP
function requestLogger(req, res, next) {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  
  // Log da requisição entrante
  console.log(`[${timestamp}] --> ${req.method} ${req.path}`);
  
  if (req.body && Object.keys(req.body).length > 0) {
    // Log do body (sem senhas)
    const safeBody = { ...req.body };
    if (safeBody.password) safeBody.password = '***';
    console.log(`[${timestamp}] Body:`, JSON.stringify(safeBody));
  }
  
  if (req.query && Object.keys(req.query).length > 0) {
    console.log(`[${timestamp}] Query:`, JSON.stringify(req.query));
  }

  // Interceptar a resposta para logar
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - start;
    const responseTimestamp = new Date().toISOString();
    
    console.log(`[${responseTimestamp}] <-- ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    
    // Log de erros (status >= 400)
    if (res.statusCode >= 400) {
      console.error(`[${responseTimestamp}] Erro na resposta:`, data);
    }
    
    return originalSend.call(this, data);
  };

  next();
}

// Middleware para logging de erros
function errorLogger(err, req, res, next) {
  const timestamp = new Date().toISOString();
  
  console.error(`[${timestamp}] ERRO em ${req.method} ${req.path}:`);
  console.error(`[${timestamp}] Stack:`, err.stack);
  console.error(`[${timestamp}] Message:`, err.message);
  
  if (req.body && Object.keys(req.body).length > 0) {
    const safeBody = { ...req.body };
    if (safeBody.password) safeBody.password = '***';
    console.error(`[${timestamp}] Body da requisição:`, JSON.stringify(safeBody));
  }
  
  next(err);
}

module.exports = {
  requestLogger,
  errorLogger
};
