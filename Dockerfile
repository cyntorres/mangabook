# ==========================================================
# Semana 8 - Dockerfile para Angular (Frontend)
# ==========================================================

# ==========================================================
# 🔵 ETAPA 1: Compilación (Build Stage)
# ==========================================================

FROM node:20-alpine AS build

WORKDIR /app

# Copiamos el proyecto completo
COPY . .

# Instalamos dependencias
RUN npm install

# Build de producción
RUN npm run build -- --configuration=production


# ==========================================================
# 🔵 ETAPA 2: Servidor NGINX (Imagen final)
# ==========================================================

FROM nginx:alpine

# Copiamos el build REAL generado por Angular
# OJO: el index.html está en /browser
COPY --from=build /app/dist/mangabook/browser /usr/share/nginx/html

# Exponemos el puerto 80
EXPOSE 80

# NGINX se ejecuta automáticamente
