#!/bin/bash

# Script de monitoramento e restart automático

check_service() {
    local service=$1
    local url=$2
    
    if curl -f -s $url > /dev/null; then
        echo "✅ $service está funcionando"
        return 0
    else
        echo "❌ $service não está respondendo"
        return 1
    fi
}

echo "🔍 Verificando status dos serviços..."

# Verificar aplicação principal
if ! check_service "VideoHub" "http://localhost"; then
    echo "🔄 Reiniciando VideoHub..."
    cd ~/videohub
    docker-compose restart videohub
fi

# Verificar Traefik
if ! check_service "Traefik" "http://localhost:8080/ping"; then
    echo "🔄 Reiniciando Traefik..."
    cd ~/videohub
    docker-compose restart traefik
fi

# Verificar Portainer
if ! check_service "Portainer" "http://localhost:9000"; then
    echo "🔄 Reiniciando Portainer..."
    cd ~/videohub
    docker-compose restart portainer
fi

echo "🏁 Verificação concluída"