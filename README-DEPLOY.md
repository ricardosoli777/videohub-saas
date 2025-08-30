# 🚀 VideoHub SaaS - Guia de Deploy

## 📋 PRÉ-REQUISITOS

1. **VPS com Docker Swarm** configurado
2. **Traefik** rodando com `letsencryptresolver`
3. **Rede GroofNet** criada
4. **DNS** apontando para a VPS
5. **GitHub Repository** com Actions habilitado

## 🔨 DEPLOY OPTIONS

### 🎯 OPÇÃO 1: GitHub Container Registry (RECOMENDADO)
**Automatizado via GitHub Actions**

1. **Push para GitHub** - As imagens são construídas automaticamente
2. **Usar `videohub-stack.yml`** no Portainer

**Vantagens:**
✅ Build automático no push
✅ Imagem sempre atualizada
✅ Sem necessidade de build local

### 🎯 OPÇÃO 2: Build Local na VPS
**Para desenvolvimento ou customização**

1. **Ver** `BUILD-LOCAL.md` para instruções completas
2. **Usar `videohub-local-build.yml`** no Portainer

**Vantagens:**
✅ Controle total da imagem
✅ Build direto na VPS

## 🐳 DEPLOY NO PORTAINER

### 📋 ORDEM DE DEPLOY

### 1️⃣ Stacks de Banco (se ainda não existem)
1. `postgres-stack.yml` → Stack "PostgreSQL"
2. `redis-stack.yml` → Stack "Redis"  
3. `pgadmin-stack.yml` → Stack "pgAdmin"

### 2️⃣ Inicializar Banco (uma vez)
4. `postgres-init-stack.yml` → Stack "DB-Init" → **Remover após completar**

### 3️⃣ Aplicação Principal
5. **OPÇÃO 1:** `videohub-stack.yml` → Stack "VideoHub" (GitHub Container Registry)
   **OPÇÃO 2:** `videohub-local-build.yml` → Stack "VideoHub" (Build Local)

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

## 🔄 PROCESSO AUTOMÁTICO (GitHub Actions)

Quando você faz push para o repositório:

1. **GitHub Actions** detecta o push
2. **Build automático** da imagem Docker
3. **Push automático** para `ghcr.io/ricardosoli777/videohub-saas:latest`
4. **Stack pronta** para deploy no Portainer

## 🛠️ TROUBLESHOOTING

### Erro "image not found"
**Para GitHub Container Registry:**
```bash
# Verificar se action completou com sucesso
# Checar: https://github.com/ricardosoli777/videohub-saas/actions
docker pull ghcr.io/ricardosoli777/videohub-saas:latest
```

**Para build local:**
```bash
# Verificar se imagem foi criada localmente
docker images | grep videohub-saas
```

### App não conecta ao banco
1. Verificar se PostgreSQL stack está running
2. Verificar se postgres-init foi executado  
3. Verificar logs: `docker service logs videohub_videohub`

### GitHub Action falha
1. Verificar se repository tem Packages habilitado
2. Verificar se GITHUB_TOKEN tem permissões
3. Verificar logs na aba Actions do GitHub

### SSL não funciona
1. Verificar DNS
2. Verificar Traefik config
3. Verificar se `letsencryptresolver` existe