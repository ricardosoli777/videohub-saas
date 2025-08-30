#!/bin/bash

# Script para atualizar a aplicação em produção

set -e

echo "🔄 Atualizando VideoHub..."

# Ir para diretório do projeto
cd ~/videohub

# Fazer backup do banco de dados (se existir)
echo "💾 Fazendo backup..."
mkdir -p backups
docker-compose exec -T database pg_dump -U postgres videohub > "backups/backup-$(date +%Y%m%d-%H%M%S).sql" || true

# Parar aplicação
echo "⏹️ Parando aplicação..."
docker-compose down

# Atualizar código (assumindo que o código está em um repositório Git)
echo "📥 Atualizando código..."
git pull origin main

# Rebuild e restart
echo "🔨 Reconstruindo aplicação..."
docker-compose build --no-cache
docker-compose up -d

echo "✅ Atualização concluída!"

# Verificar status
echo "🔍 Verificando status dos containers..."
docker-compose ps