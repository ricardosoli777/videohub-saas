# 🐳 Guia Completo de Instalação via Portainer

## 🎯 Visão Geral

Este guia te ajudará a instalar o VideoHub SaaS usando Portainer de forma simples e visual, sem precisar usar linha de comando.

## 📋 Pré-requisitos

1. **VPS** com Ubuntu/Debian
2. **Docker** instalado
3. **Portainer** instalado e rodando
4. **Domínio** configurado

## 🚀 Instalação Passo a Passo

### Passo 1: Preparar a VPS

```bash
# Conectar via SSH
ssh root@SEU_IP_VPS

# Instalar Docker (se necessário)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Portainer
docker volume create portainer_data
docker run -d -p 8000:8000 -p 9443:9443 --name portainer --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest

# Criar rede do Traefik
docker network create traefik-network
```

### Passo 2: Acessar Portainer

1. Abra o navegador: `https://SEU_IP:9443`
2. Crie sua conta de administrador
3. Conecte ao Docker local

### Passo 3: Deploy do Traefik (Primeiro)

1. No Portainer, vá em **Stacks** → **Add Stack**
2. Nome: `traefik`
3. Cole o conteúdo do arquivo `traefik-stack.yml`
4. Configure as variáveis:
   ```
   DOMAIN_NAME=seudominio.com
   ACME_EMAIL=seu@email.com
   TRAEFIK_USERS=admin:$2y$10$8K8TGFhQNmPYq8RQGv5HJOoP5b4b2J3xKj9mWoO2KpY8tFjJrQgXG
   ```
5. Clique em **Deploy the Stack**

### Passo 4: Deploy do VideoHub

1. No Portainer, vá em **Stacks** → **Add Stack**
2. Nome: `videohub-saas`
3. **Método 1 - Via Repository (Recomendado)**:
   - Escolha **Repository**
   - URL: `https://github.com/seu-usuario/videohub-saas`
   - Compose file path: `portainer/docker-compose.portainer.yml`
   
4. **Método 2 - Via Upload**:
   - Escolha **Upload**
   - Faça upload do arquivo `docker-compose.portainer.yml`

5. Configure as **Environment Variables**:
   ```
   DOMAIN_NAME=videohub.seudominio.com
   ACME_EMAIL=seu@email.com
   ```

6. Clique em **Deploy the Stack**

### Passo 5: Verificar Deploy

1. Vá em **Containers** no Portainer
2. Verifique se todos os containers estão **running**:
   - ✅ `traefik`
   - ✅ `videohub-app`

3. Teste os acessos:
   - **VideoHub**: `https://videohub.seudominio.com`
   - **Traefik Dashboard**: `https://traefik.seudominio.com`

## 🔧 Configurações Avançadas

### Gerar Hash de Senha para Traefik

Use este comando para gerar o hash da senha:

```bash
# Instalar htpasswd
sudo apt install apache2-utils

# Gerar hash (substitua 'suasenha' pela senha desejada)
echo $(htpasswd -nb admin suasenha) | sed -e s/\\$/\\$\\$/g
```

### Configurar Backup Automático

1. No Portainer, vá em **Stacks** → **Add Stack**
2. Nome: `backup-system`
3. Cole este docker-compose:

```yaml
version: '3.8'

services:
  backup:
    image: alpine:latest
    container_name: videohub-backup
    volumes:
      - videohub_data:/data:ro
      - ./backups:/backups
    command: |
      sh -c "
        while true; do
          echo 'Fazendo backup...'
          tar czf /backups/backup-$(date +%Y%m%d-%H%M%S).tar.gz /data
          find /backups -name '*.tar.gz' -mtime +7 -delete
          sleep 86400
        done
      "
    restart: unless-stopped

volumes:
  videohub_data:
    external: true
```

## 📊 Monitoramento via Portainer

### Verificar Logs
1. Vá em **Containers**
2. Clique no container desejado
3. Aba **Logs** para ver logs em tempo real

### Verificar Recursos
1. Vá em **Containers**
2. Veja uso de CPU/RAM em tempo real
3. Configure alertas se necessário

### Restart de Serviços
1. Selecione o container
2. Clique em **Restart**
3. Ou use **Recreate** para rebuild completo

## 🔐 Segurança

### Configurar Firewall
```bash
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 9443/tcp  # Portainer
sudo ufw --force enable
```

### Backup de Configurações
1. No Portainer, vá em **Settings** → **Backup**
2. Faça download das configurações
3. Guarde em local seguro

## 🆘 Troubleshooting

### Container não inicia
1. Verifique logs no Portainer
2. Verifique se a rede `traefik-network` existe
3. Verifique configuração DNS

### SSL não funciona
1. Verifique logs do Traefik
2. Confirme que o domínio aponta para o IP correto
3. Aguarde alguns minutos para propagação DNS

### Aplicação não carrega
1. Verifique se o container está healthy
2. Teste acesso direto: `http://SEU_IP`
3. Verifique configuração do Traefik

## 📱 Acesso Mobile

O Portainer tem app mobile oficial:
- **iOS**: Portainer na App Store
- **Android**: Portainer no Google Play

Configure o endpoint: `https://SEU_IP:9443`

## 🔄 Atualizações

Para atualizar a aplicação:

1. No Portainer, vá para o Stack `videohub-saas`
2. Clique em **Editor**
3. Modifique se necessário
4. Clique em **Update the Stack**
5. Escolha **Re-pull image and redeploy**

## 📈 Escalabilidade

Para escalar horizontalmente:

1. Adicione mais réplicas no docker-compose:
```yaml
deploy:
  replicas: 3
```

2. Configure load balancing no Traefik
3. Use volumes externos para dados persistentes