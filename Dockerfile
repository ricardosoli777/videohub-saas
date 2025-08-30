FROM node:18-alpine as builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
RUN npm ci

# Copiar código fonte
COPY . .

# Argumentos de build para variáveis de ambiente
ARG VITE_ADMIN_EMAIL
ARG VITE_ADMIN_PASSWORD
ARG DOMAIN_NAME

# Definir variáveis de ambiente para o build
ENV VITE_ADMIN_EMAIL=$VITE_ADMIN_EMAIL
ENV VITE_ADMIN_PASSWORD=$VITE_ADMIN_PASSWORD
ENV VITE_DOMAIN_NAME=$DOMAIN_NAME

# Build da aplicação
RUN npm run build

# Estágio de produção
FROM nginx:alpine

# Instalar envsubst para substituição de variáveis
RUN apk add --no-cache gettext

# Copiar build da aplicação
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração do nginx
COPY nginx.conf.template /etc/nginx/nginx.conf.template

# Script de inicialização
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expor porta
EXPOSE 80

# Comando de inicialização
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]