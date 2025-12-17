FROM node:22-alpine

WORKDIR /usr/src/app

# Instalar dependências do sistema necessárias para o Angular
RUN apk add --no-cache python3 make g++

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Expor porta do Angular
EXPOSE 4200

# Comando padrão (pode ser sobrescrito no docker-compose)
CMD ["npm", "start", "--", "--host", "0.0.0.0"]
