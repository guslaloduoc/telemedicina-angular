# --- ETAPA 1: Compilación (Build) ---
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Esta línea usa la configuración de producción, activando environment.prod.ts
RUN npm run build -- --configuration production

# --- ETAPA 2: Despliegue (Serve) ---
FROM nginx:alpine
# Copiamos los archivos de la carpeta de build de producción
COPY --from=build /app/dist/telemedicina/browser /usr/share/nginx/html
EXPOSE 80