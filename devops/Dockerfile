# Base image
FROM node:18.19.1

# Define o diretório de trabalho no container (absoluto)
WORKDIR /app/src/frontend

# Copiar os arquivos package.json e package-lock.json para o container
COPY app/src/frontend/package*.json ./

# Instalar as dependências com npm
RUN npm install

# Copiar o restante do código da aplicação
COPY app/src/frontend .

# Expor a porta padrão da aplicação
EXPOSE 5173

# Comando padrão para iniciar a aplicação
CMD ["npm", "run", "dev"]
