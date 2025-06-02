const { Pool } = require('pg');
require('dotenv').config();

// For testing: create a mock pool if in test environment without DATABASE_URL
let pool;

if (process.env.NODE_ENV === 'test' && !process.env.DATABASE_URL) {
  console.log('[DB] Usando mock pool para testes');
  // Mock pool for testing when no database is available
  pool = {
    query: async (text, params) => {
      console.log('[DB_MOCK] Query executada:', text, params ? `com parâmetros: ${JSON.stringify(params)}` : '');
      return { rows: [] };
    },
    end: async () => {
      console.log('[DB_MOCK] Pool finalizado');
    },
    connect: async () => ({
      query: async (text, params) => {
        console.log('[DB_MOCK] Query executada via connection:', text, params ? `com parâmetros: ${JSON.stringify(params)}` : '');
        return { rows: [] };
      },
      release: () => {
        console.log('[DB_MOCK] Connection released');
      }
    })
  };
} else {
  console.log('[DB] Conectando ao banco de dados PostgreSQL');
  console.log('[DB] DATABASE_URL configurada:', !!process.env.DATABASE_URL);
  
  // TODO: adicionar tratamento de erros do pool para reconexões automáticas
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  // Event listeners para monitoramento do pool
  pool.on('connect', () => {
    console.log('[DB] Nova conexão estabelecida com o banco');
  });

  pool.on('error', (err) => {
    console.error('[DB] Erro no pool de conexões:', err);
  });

  pool.on('remove', () => {
    console.log('[DB] Conexão removida do pool');
  });
}

module.exports = pool;
