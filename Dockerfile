# Usar una imagen base de Node.js
FROM node:16

# Establecer el directorio de trabajo en la aplicación
WORKDIR /app

# Copiar los archivos de la aplicación
COPY ApiModelado/package*.json ./
COPY ApiModelado/ .

# Instalar las dependencias de la aplicación
RUN npm install

# Exponer el puerto en el que la aplicación se ejecuta (si es necesario)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD [ "node", "server.js" ]