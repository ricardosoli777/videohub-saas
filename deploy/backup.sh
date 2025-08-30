#!/bin/bash

# Script de backup automático

set -e

BACKUP_DIR="~/videohub/backups"
DATE=$(date +%Y%m%d-%H%M%S)

echo "💾 Iniciando backup do VideoHub..."

# Criar diretório de backup se não existir
mkdir -p $BACKUP_DIR

# Backup do banco de dados
echo "📊 Fazendo backup do banco de dados..."
docker-compose exec -T database pg_dump -U postgres videohub > "$BACKUP_DIR/db-backup-$DATE.sql"

# Backup dos volumes de dados
echo "📁 Fazendo backup dos volumes..."
docker run --rm -v videohub_data:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/volumes-backup-$DATE.tar.gz /data

# Limpar backups antigos (manter apenas os últimos 7 dias)
echo "🧹 Limpando backups antigos..."
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "✅ Backup concluído: $DATE"