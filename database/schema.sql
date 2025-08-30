-- VideoHub SaaS Database Schema
-- PostgreSQL Schema

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de vídeos
CREATE TABLE IF NOT EXISTS videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(500) NOT NULL,
    embed_code TEXT, -- Para códigos iframe personalizados
    embed_width VARCHAR(20) DEFAULT '100%', -- Largura do embed (100%, 800px, etc)
    embed_height VARCHAR(20) DEFAULT '400px', -- Altura do embed (400px, 100vh, etc)
    thumbnail VARCHAR(500),
    duration INTEGER, -- em segundos
    expiry_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    views_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de sessões (para Redis backup)
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de views/analytics
CREATE TABLE IF NOT EXISTS video_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    watch_duration INTEGER, -- segundos assistidos
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_videos_active ON videos(is_active);
CREATE INDEX IF NOT EXISTS idx_videos_expiry ON videos(expiry_date);
CREATE INDEX IF NOT EXISTS idx_videos_created_by ON videos(created_by);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_video_views_video_id ON video_views(video_id);
CREATE INDEX IF NOT EXISTS idx_video_views_user_id ON video_views(user_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir usuário admin padrão
INSERT INTO users (email, password_hash, role) 
VALUES (
    'admin@example.com', 
    crypt('admin123', gen_salt('bf')), 
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- Inserir usuário demo
INSERT INTO users (email, password_hash, role) 
VALUES (
    'user@example.com', 
    crypt('user123', gen_salt('bf')), 
    'member'
) ON CONFLICT (email) DO NOTHING;

-- Inserir vídeos demo
INSERT INTO videos (title, description, url, thumbnail, duration, expiry_date, created_by)
SELECT 
    'Introdução ao React',
    'Aprenda os conceitos básicos do React',
    'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
    'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=300',
    1800,
    NOW() + INTERVAL '7 days',
    u.id
FROM users u WHERE u.email = 'admin@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO videos (title, description, url, thumbnail, duration, created_by)
SELECT 
    'Docker para Iniciantes',
    'Containerização com Docker',
    'https://www.youtube.com/watch?v=fqMOX6JJhGo',
    'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=300',
    2400,
    u.id
FROM users u WHERE u.email = 'admin@example.com'
ON CONFLICT DO NOTHING;