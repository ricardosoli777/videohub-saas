import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { cacheGet, cacheSet, cacheDel } from '../config/redis.js';

const router = express.Router();

// Middleware para verificar autenticação
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  // Aqui você pode implementar verificação JWT completa
  // Por simplicidade, vamos aceitar qualquer token por enquanto
  next();
};

// Listar vídeos ativos
router.get('/', async (req, res) => {
  try {
    // Tentar buscar no cache primeiro
    const cached = await cacheGet('videos:active');
    if (cached) {
      return res.json({ success: true, videos: cached });
    }

    // Buscar vídeos ativos do banco
    const result = await req.db.query(`
      SELECT 
        v.id,
        v.title,
        v.description,
        v.url,
        v.embed_code,
        v.embed_width,
        v.embed_height,
        v.thumbnail,
        v.duration,
        v.expiry_date,
        v.is_active,
        v.views_count,
        v.created_at,
        u.email as created_by_email
      FROM videos v
      LEFT JOIN users u ON v.created_by = u.id
      WHERE v.is_active = true 
        AND (v.expiry_date IS NULL OR v.expiry_date > NOW())
      ORDER BY v.created_at DESC
    `);

    const videos = result.rows;

    // Cachear por 5 minutos
    await cacheSet('videos:active', videos, 300);

    res.json({ success: true, videos });

  } catch (error) {
    console.error('Erro ao buscar vídeos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar vídeo por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar vídeo específico
    const result = await req.db.query(`
      SELECT 
        v.*,
        u.email as created_by_email
      FROM videos v
      LEFT JOIN users u ON v.created_by = u.id
      WHERE v.id = $1 AND v.is_active = true
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vídeo não encontrado' });
    }

    const video = result.rows[0];

    // Verificar se não expirou
    if (video.expiry_date && new Date(video.expiry_date) < new Date()) {
      return res.status(410).json({ error: 'Vídeo expirado' });
    }

    res.json({ success: true, video });

  } catch (error) {
    console.error('Erro ao buscar vídeo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar vídeo (apenas admin)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description, url, embed_code, embed_width, embed_height, thumbnail, duration, expiry_date } = req.body;

    if (!title || !url) {
      return res.status(400).json({ error: 'Título e URL são obrigatórios' });
    }

    // Por simplicidade, assumindo usuário admin (implementar verificação JWT real)
    const adminResult = await req.db.query(
      "SELECT id FROM users WHERE role = 'admin' LIMIT 1"
    );

    if (adminResult.rows.length === 0) {
      return res.status(500).json({ error: 'Admin não encontrado' });
    }

    const adminId = adminResult.rows[0].id;

    // Inserir vídeo
    const result = await req.db.query(`
      INSERT INTO videos (title, description, url, embed_code, embed_width, embed_height, thumbnail, duration, expiry_date, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [title, description, url, embed_code, embed_width || '100%', embed_height || '400px', thumbnail, duration, expiry_date, adminId]);

    const video = result.rows[0];

    // Limpar cache
    await cacheDel('videos:active');

    res.status(201).json({ success: true, video });

  } catch (error) {
    console.error('Erro ao criar vídeo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar vídeo (apenas admin)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, url, embed_code, embed_width, embed_height, thumbnail, duration, expiry_date, is_active } = req.body;

    // Atualizar vídeo
    const result = await req.db.query(`
      UPDATE videos 
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          url = COALESCE($3, url),
          embed_code = COALESCE($4, embed_code),
          embed_width = COALESCE($5, embed_width),
          embed_height = COALESCE($6, embed_height),
          thumbnail = COALESCE($7, thumbnail),
          duration = COALESCE($8, duration),
          expiry_date = COALESCE($9, expiry_date),
          is_active = COALESCE($10, is_active),
          updated_at = NOW()
      WHERE id = $11
      RETURNING *
    `, [title, description, url, embed_code, embed_width, embed_height, thumbnail, duration, expiry_date, is_active, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vídeo não encontrado' });
    }

    const video = result.rows[0];

    // Limpar cache
    await cacheDel('videos:active');

    res.json({ success: true, video });

  } catch (error) {
    console.error('Erro ao atualizar vídeo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar vídeo (apenas admin)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Soft delete - marcar como inativo
    const result = await req.db.query(`
      UPDATE videos 
      SET is_active = false, updated_at = NOW()
      WHERE id = $1
      RETURNING id, title
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vídeo não encontrado' });
    }

    // Limpar cache
    await cacheDel('videos:active');

    res.json({ 
      success: true, 
      message: 'Vídeo removido com sucesso',
      video: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao deletar vídeo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Registrar visualização
router.post('/:id/view', async (req, res) => {
  try {
    const { id } = req.params;
    const { watchDuration } = req.body;
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.connection.remoteAddress;

    // Registrar visualização
    await req.db.query(`
      INSERT INTO video_views (video_id, ip_address, user_agent, watch_duration)
      VALUES ($1, $2, $3, $4)
    `, [id, ipAddress, userAgent, watchDuration || 0]);

    // Incrementar contador de views
    await req.db.query(`
      UPDATE videos 
      SET views_count = views_count + 1
      WHERE id = $1
    `, [id]);

    // Limpar cache
    await cacheDel('videos:active');

    res.json({ success: true, message: 'Visualização registrada' });

  } catch (error) {
    console.error('Erro ao registrar visualização:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;