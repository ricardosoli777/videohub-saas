# 🚀 Instalação via Portainer

## Pré-requisitos

1. **VPS com Docker instalado**
2. **Portainer rodando** na VPS
3. **Domínio configurado** apontando para o IP da VPS
4. **Rede Traefik criada**: `docker network create traefik-network`

## 📋 Passo a Passo

### 1. Preparar a VPS

```bash
# Conectar na VPS via SSH
ssh root@SEU_IP_VPS

# Instalar Docker (se não tiver)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Portainer
docker volume create portainer_data
docker run -d -p 8000:8000 -p 9443:9443 --name portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:latest

# Criar rede do Traefik
docker network create traefik-network
```

### 2. Configurar DNS

Configure seu domínio para apontar para o IP da VPS:

```
videohub.seudominio.com     A    IP_DA_VPS
portainer.seudominio.com    A    IP_DA_VPS
traefik.seudominio.com      A    IP_DA_VPS
```

### 3. Deploy via Portainer

#### Opção A: Via Template (Recomendado)

1. Acesse Portainer: `https://SEU_IP:9443`
2. Vá em **App Templates**
3. Clique em **Custom Templates**
4. Adicione o template do arquivo `stack-template.json`
5. Configure as variáveis:
   - **DOMAIN_NAME**: `videohub.seudominio.com`
   - **ACME_EMAIL**: `seu@email.com`
   - **TRAEFIK_USERS**: `admin:$2y$10$hash` (use o gerador de hash)
6. Clique em **Deploy**

#### Opção B: Via Stack Manual

1. Acesse Portainer: `https://SEU_IP:9443`
2. Vá em **Stacks** → **Add Stack**
3. Nome: `videohub-saas`
4. Cole o conteúdo do `docker-compose.portainer.yml`
5. Configure as **Environment Variables**:
   ```
   DOMAIN_NAME=videohub.seudominio.com
   ACME_EMAIL=seu@email.com
   TRAEFIK_USERS=admin:$2y$10$8K8TGFhQNmPYq8RQGv5HJOoP5b4b2J3xKj9mWoO2KpY8tFjJrQgXG
   ```
6. Clique em **Deploy the Stack**

### 4. Verificar Deploy

Após o deploy, verifique se os serviços estão rodando:

1. **VideoHub**: `https://videohub.seudominio.com`
2. **Portainer**: `https://portainer.seudominio.com`
3. **Traefik Dashboard**: `https://traefik.seudominio.com`

### 5. Configurar Traefik (Primeira vez)

Se for a primeira vez usando Traefik, você precisa deployar ele primeiro:

```yaml
# Stack separado para Traefik
version: '3.8'

services:
  traefik:
    image: traefik:v2.10
    container_name: traefik
    command:
      - "--api.dashboard=true"
      - "--api.insecure=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--providers.docker.network=traefik-network"
      - "--certificatesresolvers.letsencrypt.acme.tlschallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.email=${ACME_EMAIL}"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - traefik-letsencrypt:/letsencrypt
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.traefik.rule=Host(`traefik.${DOMAIN_NAME}`)"
      - "traefik.http.routers.traefik.entrypoints=websecure"
      - "traefik.http.routers.traefik.tls.certresolver=letsencrypt"
      - "traefik.http.routers.traefik.service=api@internal"
      - "traefik.http.middlewares.traefik-auth.basicauth.users=${TRAEFIK_USERS}"
      - "traefik.http.routers.traefik.middlewares=traefik-auth"
    networks:
      - traefik-network
    restart: unless-stopped

networks:
  traefik-network:
    external: true

volumes:
  traefik-letsencrypt:
    driver: local
```

## 🔧 Configurações Importantes

### Gerar Hash para Senha do Traefik

```bash
# Gerar hash da senha
echo $(htpasswd -nb admin suasenha) | sed -e s/\\$/\\$\\$/g
```

### Variáveis de Ambiente Essenciais

```env
DOMAIN_NAME=videohub.seudominio.com
ACME_EMAIL=seu@email.com
TRAEFIK_USERS=admin:$2y$10$hash-da-senha
```

### Portas Necessárias no Firewall

```bash
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw allow 8080/tcp # Traefik Dashboard
sudo ufw allow 9443/tcp # Portainer
```

## 🎯 Acesso aos Serviços

Após o deploy bem-sucedido:

- **VideoHub**: `https://videohub.seudominio.com`
- **Portainer**: `https://portainer.seudominio.com`
- **Traefik**: `https://traefik.seudominio.com`

## 🔐 Credenciais Padrão

### VideoHub (Demo)
- **Admin**: admin@example.com / admin123
- **Usuário**: user@example.com / user123

### Traefik Dashboard
- **Usuário**: admin / admin123 (configurável)

## 🆘 Troubleshooting

### Verificar Logs
```bash
# Via Portainer: Containers → videohub-app → Logs
# Via CLI:
docker logs videohub-app
```

### Verificar Rede
```bash
# Verificar se a rede existe
docker network ls | grep traefik

# Criar se não existir
docker network create traefik-network
```

### Verificar Certificados SSL
```bash
# Logs do Traefik
docker logs traefik
```