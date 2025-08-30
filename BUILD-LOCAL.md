# 🚀 VideoHub - Build Local na VPS

## 📋 INSTRUÇÕES PARA BUILD LOCAL

### **1️⃣ FAZER BUILD DA IMAGEM NA SUA VPS:**

```bash
# 1. Clone o repositório na VPS
git clone https://github.com/ricardosoli777/videohub-saas.git
cd videohub-saas

# 2. Build da imagem localmente
docker build \
  --build-arg VITE_ADMIN_EMAIL=admin@videohub.com \
  --build-arg VITE_ADMIN_PASSWORD=admin123 \
  --build-arg VITE_DOMAIN_NAME=videohub.groof.com.br \
  -t videohub-saas:local .
```

### **2️⃣ USAR A STACK LOCAL:**

Use o arquivo `videohub-local-build.yml` no Portainer:

- **Nome da Stack:** "VideoHub"
- **Arquivo:** `videohub-local-build.yml`

**Variáveis de ambiente:**
```env
VIDEOHUB_DOMAIN=videohub.groof.com.br
ADMIN_EMAIL=admin@videohub.com
ADMIN_PASSWORD=admin123
```

### **🎯 VANTAGENS:**

✅ **Sem necessidade de Docker Hub**
✅ **Build direto na VPS**
✅ **Controle total da imagem**
✅ **Deploy imediato após build**

### **📊 VERIFICAR BUILD:**

```bash
# Verificar se imagem foi criada
docker images | grep videohub-saas

# Testar localmente (opcional)
docker run -p 3001:3001 videohub-saas:local
```

**Após o build, use `videohub-local-build.yml` no Portainer! 🚀**