#!/bin/sh

# Substituir variáveis de ambiente no nginx.conf
envsubst '${DOMAIN_NAME}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Executar comando passado como parâmetro
exec "$@"