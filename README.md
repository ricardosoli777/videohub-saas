# VideoHub SaaS

Uma plataforma SaaS moderna para embedding e gerenciamento de vídeos com área de membros, autenticação e sistema de expiração de conteúdo.

## 🚀 Funcionalidades

### Core Features
- **Sistema de Autenticação**: Login/senha seguro com diferentes níveis de acesso
- **Área de Membros**: Dashboard personalizado para cada usuário
- **Embedding de Vídeos**: Suporte para YouTube, Vimeo, Dailymotion e outras plataformas
- **Agendamento de Conteúdo**: Sistema de expiração automática com notificações
- **Painel Administrativo**: Interface completa para gerenciar vídeos e usuários
- **API REST**: Endpoints para integração com sistemas externos
- **Notificações**: Sistema de alertas em tempo real

### Recursos Técnicos
- **Containerização**: Deploy com Docker, Portainer e Traefik
- **SSL Automático**: Certificados Let's Encrypt via Traefik
- **Backup Automático**: Scripts de backup e recovery
- **Monitoramento**: Health checks e restart automático
- **Escalabilidade**: Arquitetura preparada para crescimento

## 🛠 Tecnologias

### Frontend
- **React 18** com TypeScript
- **Tailwind CSS** para styling responsivo
- **Vite** para build e desenvolvimento
- **Lucide React** para ícones
- **React Router** para navegação

### Backend & Infrastructure
- **Docker** para containerização
- **Traefik** como reverse proxy e load balancer
- **Portainer** para gerenciamento de containers
- **Nginx** para servir a aplicação
- **Let's Encrypt** para SSL automático

### Banco de Dados (Planejado)
- **Supabase** para autenticação e banco de dados
- **PostgreSQL** como banco principal
- **Redis** para cache e sessões

## 📋 Pré-requisitos

- VPS com Ubuntu 20.04+ ou Debian 11+
- Docker e Docker Compose
- Domínio configurado (para SSL automático)
- Mínimo 2GB RAM e 20GB de armazenamento

## 🚀 Deploy em VPS

### 1. Setup Inicial

```bash
# Clone o repositório
git clone <seu-repositorio>
cd videohub-saas

# Execute o script de setup
chmod +x deploy/setup.sh
./deploy/setup.sh
```

### 2. Configuração

```bash
# Edite as variáveis de ambiente
nano .env

# Exemplo de configuração:
DOMAIN_NAME=videohub.exemplo.com
ACME_EMAIL=admin@exemplo.com
TRAEFIK_USERS=admin:$2y$10$hash-gerado
```

### 3. Deploy

```bash
# Criar rede do Traefik
docker network create traefik-network

# Iniciar todos os serviços
docker-compose up -d

# Verificar status
docker-compose ps
```

### 4. Configuração DNS

Configure seu domínio para apontar para o IP da VPS:

```
videohub.exemplo.com     A    IP_DA_VPS
portainer.exemplo.com    A    IP_DA_VPS
traefik.exemplo.com      A    IP_DA_VPS
```

## 🔧 Scripts de Manutenção

### Backup

```bash
# Backup manual
./deploy/backup.sh

# Backup automático (crontab)
0 2 * * * /home/usuario/videohub/deploy/backup.sh
```

### Atualização

```bash
# Atualizar aplicação
./deploy/update.sh
```

### Monitoramento

```bash
# Verificar status e restart se necessário
./deploy/monitor.sh

# Adicionar ao crontab para verificação automática
*/5 * * * * /home/usuario/videohub/deploy/monitor.sh
```

## 🌐 Acesso aos Serviços

### Aplicação Principal
- **URL**: https://seu-dominio.com
- **Usuário Demo Admin**: admin@example.com / admin123
- **Usuário Demo Member**: user@example.com / user123

### Portainer (Gerenciamento de Containers)
- **URL**: https://portainer.seu-dominio.com
- Interface web para gerenciar todos os containers

### Traefik Dashboard (Monitoramento)
- **URL**: https://traefik.seu-dominio.com
- **Usuário**: admin / admin123
- Monitoramento de rotas e certificados

## 📱 Uso da Aplicação

### Para Membros
1. Faça login na plataforma
2. Navegue pelo catálogo de vídeos disponíveis
3. Clique em qualquer vídeo para assistir
4. Use a busca para encontrar conteúdos específicos

### Para Administradores
1. Acesse o Painel Administrativo
2. Adicione novos vídeos com URLs externas
3. Configure datas de expiração para conteúdo temporário
4. Gerencie usuários e permissões
5. Monitore analytics e estatísticas

## 🔒 Segurança

- Autenticação baseada em JWT
- HTTPS obrigatório via Traefik
- Headers de segurança configurados
- Backup automático criptografado
- Monitoramento de acesso

## 📊 Monitoramento

### Health Checks
- Endpoint `/health` para verificação de status
- Restart automático em caso de falha
- Logs centralizados

### Métricas
- CPU e memória dos containers
- Tempo de resposta da aplicação
- Certificados SSL e validade

## 🔧 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 📝 Variáveis de Ambiente

### Produção
```env
DOMAIN_NAME=videohub.exemplo.com
ACME_EMAIL=admin@exemplo.com
TRAEFIK_USERS=admin:hash-senha
```

### Desenvolvimento
```env
VITE_SUPABASE_URL=sua-url-do-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a MIT License.

## 🆘 Suporte

Para suporte técnico:
1. Verifique os logs: `docker-compose logs`
2. Execute o script de monitoramento: `./deploy/monitor.sh`
3. Consulte a documentação do Traefik e Portainer