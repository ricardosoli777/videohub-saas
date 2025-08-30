import pkg from 'pg';
const { Pool } = pkg;

let pool = null;

export async function connectPostgreSQL() {
  if (pool) return pool;

  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:eaa275260a5fa9acdf85bc88ae94e807@postgres:5432/videohub',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Testar conexão
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();

    console.log('✅ PostgreSQL conectado com sucesso');
    return pool;

  } catch (error) {
    console.error('🔥 Erro ao conectar PostgreSQL:', error);
    throw error;
  }
}

export async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

export default { connectPostgreSQL, query };