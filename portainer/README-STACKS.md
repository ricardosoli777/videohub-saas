# 🐳 VideoHub - Stacks do Portainer

## 📋 Ordem de Deploy das Stacks

### 1️⃣ **PostgreSQL Stack** (`postgres-stack.yml`)
- **Serviços:** PostgreSQL + Inicializador automático
- **Portas:** 5432
- **Volumes:** postgres-data, postgres-init
- **Funcionalidade:** 
  - ✅ Cria banco `videohub` automaticamente
  - ✅ Executa schema completo (tabelas, índices, triggers)
  - ✅ Insere usuários demo (admin@example.com, user@example.com)
  - ✅ Insere vídeos demo
  - ✅ Healthcheck configurado

### 2️⃣ **Redis Stack** (`redis-stack.yml`)
- **Serviços:** Redis + Redis Commander + Inicializador
- **Portas:** 6379, 8081
- **Volumes:** redis-data, redis-config  
- **Funcionalidade:**
  - ✅ Redis configurado para produção (AOF, LRU, passwords)
  - ✅ Interface web Redis Commander
  - ✅ Cache inicial configurado (settings, sessions)
  - ✅ Namespace `videohub:*` preparado

### 3️⃣ **pgAdmin Stack** (`pgadmin-stack.yml`)
- **Serviços:** pgAdmin + Configurador automático
- **Portas:** 8080
- **Volumes:** pgadmin-data, pgadmin-config
- **Funcionalidade:**
  - ✅ Interface web para PostgreSQL
  - ✅ Conexão automática ao banco VideoHub
  - ✅ Autenticação via Traefik
  - ✅ SSL automático

### 4️⃣ **VideoHub App** (`portainer-stack.yml`)
- **Serviços:** Aplicação principal
- **Depende de:** PostgreSQL e Redis stacks
- **Funcionalidade:**
  - ✅ Frontend React + Backend integrado
  - ✅ Conecta automaticamente aos bancos
  - ✅ SSL via Traefik

## 🔧 Variáveis de Ambiente Necessárias

```env
# Domain
VIDEOHUB_DOMAIN=videohub.seudominio.com

# PostgreSQL
POSTGRES_DB=videohub
POSTGRES_USER=postgres
POSTGRES_PASSWORD=SuaSenhaSeguraPostgres123

# Redis  
REDIS_PASSWORD=SuaSenhaSeguraRedis123
REDIS_ADMIN_USER=admin
REDIS_ADMIN_PASSWORD=admin123

# pgAdmin
PGADMIN_EMAIL=admin@seudominio.com
PGADMIN_PASSWORD=admin123

# App
ADMIN_EMAIL=admin@seudominio.com
ADMIN_PASSWORD=admin123

# Traefik Auth
TRAEFIK_USERS=admin:$2y$10$hash_da_senha
```

## 🚀 Como Usar no Portainer

### **Método 1: Deploy Individual**
1. Acesse **Stacks** → **Add Stack**
2. Cole o conteúdo de `postgres-stack.yml`
3. Configure as variáveis de ambiente
4. Deploy → Aguarde conclusão
5. Repita para `redis-stack.yml`, `pgadmin-stack.yml`, `portainer-stack.yml`

### **Método 2: Deploy via Git**
1. **Stacks** → **Add Stack** → **Repository**
2. **URL:** `https://github.com/ricardosoli777/videohub-saas.git`
3. **Compose file:** `portainer/postgres-stack.yml`
4. Configure variáveis
5. Deploy

## 📊 Acessos Após Deploy

- **VideoHub:** `https://videohub.seudominio.com`
- **pgAdmin:** `https://pgadmin.seudominio.com`  
- **Redis Commander:** `https://redis.seudominio.com`
- **PostgreSQL:** `seudominio.com:5432`
- **Redis:** `seudominio.com:6379`

## 🔐 Credenciais Padrão

- **PostgreSQL:** `postgres` / `postgres123`
- **Redis:** `:redis123`
- **App Admin:** `admin@example.com` / `admin123`
- **App User:** `user@example.com` / `user123`

## ⚡ Recursos Automáticos

- ✅ **Auto-inicialização** de bancos e dados
- ✅ **Healthchecks** em todos os serviços
- ✅ **SSL automático** via Let's Encrypt
- ✅ **Conexões automáticas** entre serviços
- ✅ **Volumes persistentes** para dados
- ✅ **Configuração zero** - funciona out-of-the-box

## 🔧 Troubleshooting

### Se PostgreSQL não inicializar:
```bash
docker logs videohub-postgres
docker logs videohub-postgres-init
```

### Se Redis não conectar:
```bash
docker logs videohub-redis
redis-cli -h localhost -p 6379 -a redis123 ping
```

### Verificar conectividade:
```bash
# PostgreSQL
psql -h localhost -U postgres -d videohub
# Redis  
redis-cli -h localhost -p 6379 -a redis123
```