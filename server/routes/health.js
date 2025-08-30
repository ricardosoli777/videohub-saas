import express from 'express';

const router = express.Router();

// Health check endpoint
router.get('/', async (req, res) => {
  try {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    };

    // Testar PostgreSQL
    try {
      await req.db.query('SELECT 1');
      health.postgresql = 'connected';
    } catch (error) {
      health.postgresql = 'error';
      health.postgresql_error = error.message;
    }

    // Testar Redis
    try {
      await req.redis.ping();
      health.redis = 'connected';
    } catch (error) {
      health.redis = 'error';
      health.redis_error = error.message;
    }

    const statusCode = (health.postgresql === 'connected' && health.redis === 'connected') ? 200 : 503;
    res.status(statusCode).json(health);

  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Detailed system info (apenas desenvolvimento)
router.get('/info', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Não disponível em produção' });
  }

  res.json({
    node: process.version,
    platform: process.platform,
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    env: {
      DATABASE_URL: process.env.DATABASE_URL ? '[DEFINIDO]' : '[NÃO DEFINIDO]',
      REDIS_URL: process.env.REDIS_URL ? '[DEFINIDO]' : '[NÃO DEFINIDO]',
    }
  });
});

export default router;