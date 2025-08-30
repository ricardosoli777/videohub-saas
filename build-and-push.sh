#!/bin/bash

echo "🚀 Building and pushing VideoHub SaaS Docker image..."

# Build da imagem com as variáveis de ambiente padrão
docker build \
  --build-arg VITE_ADMIN_EMAIL=admin@videohub.com \
  --build-arg VITE_ADMIN_PASSWORD=admin123 \
  --build-arg VITE_DOMAIN_NAME=videohub.groof.com.br \
  -t ricardosoli777/videohub-saas:latest \
  -t ricardosoli777/videohub-saas:v1.0.0 \
  .

# Push para Docker Hub
docker push ricardosoli777/videohub-saas:latest
docker push ricardosoli777/videohub-saas:v1.0.0

echo "✅ Image pushed to Docker Hub successfully!"
echo "🎯 You can now deploy the videohub-stack.yml in Portainer"