# 🚀 VideoHub SaaS - Guia de Deploy

## 📋 PRÉ-REQUISITOS

1. **Docker Hub Account** para hospedar a imagem
2. **VPS com Docker Swarm** configurado
3. **Traefik** rodando com `letsencryptresolver`
4. **Rede GroofNet** criada
5. **DNS** apontando para a VPS

## 🔨 PASSO 1: BUILD E PUSH DA IMAGEM

### Opção A: Build Local
```bash
# No diretório do projeto
chmod +x build-and-push.sh
./build-and-push.sh
```

### Opção B: Build Manual
```bash
# Build da imagem
docker build \
  --build-arg VITE_ADMIN_EMAIL=admin@videohub.com \
  --build-arg VITE_ADMIN_PASSWORD=admin123 \
  --build-arg VITE_DOMAIN_NAME=videohub.groof.com.br \
  -t ricardosoli777/videohub-saas:latest .

# Push para Docker Hub  
docker push ricardosoli777/videohub-saas:latest
```

## 🐳 PASSO 2: DEPLOY NO PORTAINER

### 1️⃣ Stacks de Banco (se ainda não existem)
1. `postgres-stack.yml` → Stack "PostgreSQL"
2. `redis-stack.yml` → Stack "Redis"
3. `pgadmin-stack.yml` → Stack "pgAdmin"

### 2️⃣ Inicializar Banco (uma vez)
4. `postgres-init-stack.yml` → Stack "DB-Init" → **Remover após completar**

### 3️⃣ Aplicação Principal
5. `videohub-stack.yml` → Stack "VideoHub"

**Variáveis necessárias:**
```env
VIDEOHUB_DOMAIN=videohub.groof.com.br
ADMIN_EMAIL=admin@videohub.com  
ADMIN_PASSWORD=admin123
```

## 📊 VERIFICAR DEPLOY

- **App:** https://videohub.groof.com.br
- **Health:** https://videohub.groof.com.br/api/health
- **pgAdmin:** https://pgadmin.groof.com.br

## 🔐 CREDENCIAIS PADRÃO

- **Admin:** admin@videohub.com / admin123
- **User:** user@videohub.com / user123
- **pgAdmin:** admin@example.com / admin123

## 🛠️ TROUBLESHOOTING

### Erro "image not found"
```bash
# Verificar se imagem existe no Docker Hub
docker pull ricardosoli777/videohub-saas:latest
```

### App não conecta ao banco
1. Verificar se PostgreSQL stack está running
2. Verificar se postgres-init foi executado
3. Verificar logs: `docker service logs videohub_videohub`

### SSL não funciona
1. Verificar DNS
2. Verificar Traefik config
3. Verificar se `letsencryptresolver` existe