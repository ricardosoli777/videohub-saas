import { createClient } from 'redis';

let client = null;

export async function connectRedis() {
  if (client && client.isOpen) return client;

  try {
    client = createClient({
      url: process.env.REDIS_URL || 'redis://redis:6379/0',
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500)
      }
    });

    client.on('error', (err) => {
      console.error('🔥 Erro Redis:', err);
    });

    client.on('connect', () => {
      console.log('🔄 Conectando ao Redis...');
    });

    client.on('ready', () => {
      console.log('✅ Redis conectado e pronto');
    });

    await client.connect();
    
    // Testar conexão
    await client.ping();
    
    return client;

  } catch (error) {
    console.error('🔥 Erro ao conectar Redis:', error);
    throw error;
  }
}

// Utilitários para cache
export async function cacheGet(key) {
  try {
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Erro ao buscar cache:', error);
    return null;
  }
}

export async function cacheSet(key, value, ttl = 3600) {
  try {
    await client.setEx(key, ttl, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Erro ao salvar cache:', error);
    return false;
  }
}

export async function cacheDel(key) {
  try {
    await client.del(key);
    return true;
  } catch (error) {
    console.error('Erro ao deletar cache:', error);
    return false;
  }
}

export default { connectRedis, cacheGet, cacheSet, cacheDel };