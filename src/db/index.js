const { Pool } = require('pg');
require('dotenv').config();

// TODO: adicionar tratamento de erros do pool para reconexões automáticas
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
