# Dockerfile final otimizado com suporte ao Prisma
FROM node:20-alpine

# Instalar dependências necessárias para o Prisma
RUN apk add --no-cache openssl

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Definir o diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml ./

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar o código fonte
COPY . .

# Gerar o cliente Prisma
RUN pnpm prisma:generate

# Compilar o TypeScript
RUN pnpm build

# Remover dependências de desenvolvimento e arquivos desnecessários
RUN pnpm prune --prod
RUN rm -rf src tsconfig.json .dockerignore Dockerfile* docker-compose* deploy.sh DEPLOY.md env.example

# Mudar para usuário não-root
USER nodejs

# Expor a porta da aplicação
EXPOSE 3333

# Comando para iniciar a aplicação
CMD ["node", "dist/server.js"]
