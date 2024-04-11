FROM node:14

# Criar diretório da aplicação
WORKDIR /usr/src/app

# Instalar dependências da aplicação
COPY package*.json ./
RUN npm install

# Empacotar código da aplicação
COPY . .

EXPOSE 3000
CMD [ "node", "app.js" ]
