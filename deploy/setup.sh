#!/bin/bash

# Script de setup para VPS com Docker, Portainer e Traefik
# Execute este script em sua VPS Ubuntu/Debian

set -e

echo "🚀 Iniciando setup do VideoHub SaaS..."

# Atualizar sistema
echo "📦 Atualizando sistema..."
sudo apt update && sudo apt upgrade -y

# Instalar Docker
if ! command -v docker &> /dev/null; then
    echo "🐳 Instalando Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
else
    echo "✅ Docker já está instalado"
fi

# Instalar Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "🔧 Instalando Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    echo "✅ Docker Compose já está instalado"
fi

# Criar rede do Traefik
echo "🌐 Criando rede do Traefik..."
docker network create traefik-network || true

# Criar diretórios necessários
echo "📁 Criando estrutura de diretórios..."
mkdir -p ~/videohub/{data,logs,backups}

# Configurar firewall
echo "🔥 Configurando firewall..."
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8080/tcp
sudo ufw --force enable

# Criar arquivo de configuração
echo "⚙️ Criando arquivo de configuração..."
cat > ~/videohub/.env << EOF
DOMAIN_NAME=localhost
ACME_EMAIL=admin@example.com
TRAEFIK_USERS=admin:\$2y\$10\$8K8TGFhQNmPYq8RQGv5HJOoP5b4b2J3xKj9mWoO2KpY8tFjJrQgXG
EOF

echo "✅ Setup concluído!"
echo ""
echo "🔧 Próximos passos:"
echo "1. Edite o arquivo ~/videohub/.env com seu domínio e email"
echo "2. Execute: cd ~/videohub && docker-compose up -d"
echo "3. Acesse https://seu-dominio.com para usar a aplicação"
echo "4. Acesse https://portainer.seu-dominio.com para gerenciar containers"
echo "5. Acesse https://traefik.seu-dominio.com para monitorar o proxy"
echo ""
echo "🔐 Credenciais padrão do Traefik: admin/admin123"