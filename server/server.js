import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Importar rotas
import authRoutes from './routes/auth.js';
import videoRoutes from './routes/videos.js';
import healthRoutes from './routes/health.js';

// Importar conexões de banco
import { connectPostgreSQL } from './config/database.js';
import { connectRedis } from './config/redis.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de segurança
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware para disponibilizar conexões de banco
app.use(async (req, res, next) => {
  try {
    req.db = await connectPostgreSQL();
    req.redis = await connectRedis();
    next();
  } catch (error) {
    console.error('🔥 Erro ao conectar aos bancos:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Rotas da API
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);

// Servir arquivos estáticos do frontend (build do Vite)
const distPath = join(__dirname, '../dist');
app.use(express.static(distPath));

// SPA Fallback - todas as rotas não-API retornam index.html
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(join(distPath, 'index.html'));
  } else {
    res.status(404).json({ error: 'Endpoint não encontrado' });
  }
});

// Handler de erros global
app.use((error, req, res, next) => {
  console.error('🔥 Erro não tratado:', error);
  res.status(500).json({
    error: 'Erro interno do servidor',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Inicializar servidor
async function startServer() {
  try {
    // Testar conexões
    console.log('🚀 Iniciando VideoHub Server...');
    
    const db = await connectPostgreSQL();
    const redis = await connectRedis();
    
    console.log('✅ PostgreSQL conectado');
    console.log('✅ Redis conectado');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🎬 VideoHub Server rodando na porta ${PORT}`);
      console.log(`🌐 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📍 URL: http://localhost:${PORT}`);
    });
    
  } catch (error) {
    console.error('🔥 Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Parando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Parando servidor...');
  process.exit(0);
});

startServer();