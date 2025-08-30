FROM node:22-alpine as builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
RUN npm ci

# Copiar código fonte
COPY . .

# Argumentos de build para variáveis de ambiente
ARG VITE_ADMIN_EMAIL
ARG VITE_ADMIN_PASSWORD
ARG VITE_DOMAIN_NAME

# Definir variáveis de ambiente para o build
ENV VITE_ADMIN_EMAIL=$VITE_ADMIN_EMAIL
ENV VITE_ADMIN_PASSWORD=$VITE_ADMIN_PASSWORD
ENV VITE_DOMAIN_NAME=$VITE_DOMAIN_NAME

# Build da aplicação
RUN npm run build

# Instalar dependências do server
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --only=production

# Voltar para o diretório principal
WORKDIR /app

# Estágio de produção - Node.js
FROM node:22-alpine

WORKDIR /app

# Instalar dependências de sistema
RUN apk add --no-cache curl wget

# Copiar build do frontend
COPY --from=builder /app/dist ./dist

# Copiar servidor Node.js
COPY --from=builder /app/server ./server

# Copiar arquivos de configuração
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Definir variável de ambiente para o nginx (reutilizar ARG do estágio anterior)
ARG VITE_DOMAIN_NAME
ENV DOMAIN_NAME=$VITE_DOMAIN_NAME

# Expor porta do servidor Node.js
EXPOSE 3001

# Comando de inicialização
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["node", "server/server.js"]
