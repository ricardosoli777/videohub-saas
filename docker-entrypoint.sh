#!/bin/sh

echo "🚀 Iniciando VideoHub SaaS..."
echo "🌐 Domínio: ${DOMAIN_NAME}"
echo "🗄️ Database: ${DATABASE_URL}"
echo "⚡ Redis: ${REDIS_URL}"

# Aguardar bancos estarem prontos
echo "⏳ Aguardando PostgreSQL..."
until wget --quiet --tries=1 --spider http://postgres:5432/ 2>/dev/null || nc -z postgres 5432; do
  sleep 2
done
echo "✅ PostgreSQL disponível"

echo "⏳ Aguardando Redis..."
until nc -z redis 6379; do
  sleep 2
done
echo "✅ Redis disponível"

echo "🎬 Iniciando servidor VideoHub..."

# Executar comando passado como parâmetro
exec "$@"