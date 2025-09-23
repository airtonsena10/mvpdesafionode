# 🛒 API de Gestão de Requisições de Compra

[![Swagger Documentation](https://img.shields.io/badge/Swagger-Documentation-green?style=for-the-badge&logo=swagger)](https://mvpdesafionode-api.onrender.com/docs)


Sistema MVP para gestão de requisições de compra, permitindo que usuários cadastrem requisições, adicionem itens e acompanhem o status até aprovação ou rejeição.


## 🚀 Tecnologias

- **Node.js** + **TypeScript**
- **Fastify** - Framework web rápido e eficiente
- **Prisma** - ORM para banco de dados
- **MySQL** - Banco de dados relacional
- **JWT** - Autenticação baseada em tokens
- **Docker** - Containerização do banco de dados
- **Zod** - Validação de schemas
- **Swagger** - Documentação interativa da API

## 🔄 Fluxo Principal do Sistema

```mermaid
graph TD
    A[👤 Usuário] --> B{🔐 Autenticado?}
    B -->|Não| C[📝 Cadastro/Login]
    C --> D[🔑 Recebe JWT Token]
    D --> E[📋 Criar Requisição]
    B -->|Sim| E
    
    E --> F[📝 Preencher Dados]
    F --> G[🛍️ Adicionar Itens]
    G --> H[💰 Calcular Total]
    H --> I[💾 Salvar no Banco]
    I --> J[📊 Status: PENDING]
    
    J --> K{👥 Role do Usuário}
    K -->|REQUESTER| L[👀 Visualizar Próprias Requisições]
    K -->|APPROVER/ADMIN| M[👀 Visualizar Todas Requisições]
    
    M --> N{🤔 Decisão}
    N -->|✅ Aprovar| O[✅ Status: APPROVED]
    N -->|❌ Rejeitar| P[❌ Status: REJECTED]
    N -->|⏸️ Aguardar| Q[⏳ Status: PENDING]
    
    O --> R[📧 Notificação de Aprovação]
    P --> S[📧 Notificação de Rejeição]
    Q --> T[⏳ Aguardando Aprovação]
    
    L --> U[📊 Dashboard Pessoal]
    R --> V[📊 Dashboard Aprovadas]
    S --> W[📊 Dashboard Rejeitadas]
    T --> X[📊 Dashboard Pendentes]
    
    style A fill:#e1f5fe
    style B fill:#fff3e0
    style E fill:#f3e5f5
    style J fill:#e8f5e8
    style O fill:#e8f5e8
    style P fill:#ffebee
    style Q fill:#fff8e1
```

## 📋 Funcionalidades

### 🔐 Sistema de Autenticação
- Cadastro de usuários com diferentes roles (REQUESTER, APPROVER, ADMIN)
- Login com JWT
- Middleware de autenticação para rotas protegidas

### 📝 Gestão de Requisições
- Criar requisições de compra com múltiplos itens
- Listar requisições (filtrado por permissões)
- Visualizar requisição específica
- Atualizar status (aprovar/rejeitar/cancelar)

### 🛍️ Gestão de Itens
- Adicionar múltiplos itens por requisição
- Descrição, quantidade e preço unitário
- Cálculo automático de totais

### 👥 Sistema de Permissões
- **REQUESTER**: Cria e visualiza apenas suas requisições
- **APPROVER**: Visualiza todas e pode aprovar/rejeitar
- **ADMIN**: Acesso total ao sistema

### 📖 Documentação Swagger
- **Interface interativa** para testar todos os endpoints
- **Autenticação integrada** com JWT
- **Validação em tempo real** dos dados de entrada
- **Exemplos de requisições e respostas** para cada endpoint
- **Esquemas detalhados** de validação com Zod
- **Organização por tags** (auth, purchase-requests, health)

## 🏗️ Estrutura do Projeto

```
src/
├── controllers/          # Controladores das rotas
│   ├── auth.controller.ts
│   └── purchase-request.controller.ts
├── middlewares/          # Middlewares
│   └── auth.middleware.ts
├── routes/              # Definição das rotas
│   ├── auth.routes.ts
│   └── purchase-request.routes.ts
├── services/            # Lógica de negócio
│   ├── auth.service.ts
│   └── purchase-request.service.ts
├── types/               # Tipos TypeScript
│   └── index.ts
├── utils/               # Utilitários
│   └── jwt.ts
└── server.ts            # Arquivo principal
```

## 🚀 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/airtonsena10/mvpdesafionode
cd mvpdesafionode
```

### 2. Instale as dependências
```bash
pnpm install
```

### 3. Configure o banco de dados
```bash
# Inicie o MySQL com Docker
docker-compose up -d

# Execute as migrações
pnpm prisma:migrate
```

### 4. Configure as variáveis de ambiente
O arquivo `.env` já está configurado com:
```env
DATABASE_URL="mysql://purchase_user:purchase_password@localhost:3306/purchase_requests"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3333
```

### 5. Inicie o servidor
```bash
pnpm dev
```

O servidor estará disponível em `http://localhost:3333`

### 6. Acesse a documentação
Após iniciar o servidor, acesse:
- **📖 [Documentação Swagger](https://mvpdesafionode-api.onrender.com/docs)** - Interface interativa para testar a API
- **🔍 [Health Check](https://mvpdesafionode-api.onrender.com/health)** - Status do servidor
- **ℹ️ [Informações da API](https://mvpdesafionode-api.onrender.com/)** - Detalhes gerais

## 📚 Documentação da API

### 🎯 Acesso Rápido
- **📖 Documentação Swagger**: https://mvpdesafionode-api.onrender.com/docs
- **🔍 Health Check**: https://mvpdesafionode-api.onrender.com/health
- **ℹ️ Informações da API**: https://mvpdesafionode-api.onrender.com/

### Base URL
```
https://mvpdesafionode-api.onrender.com
```

### 📖 Documentação Interativa (Swagger)
A API possui documentação completa e interativa disponível em:
```
https://mvpdesafionode-api.onrender.com/docs
```

A documentação Swagger inclui:
- ✅ Todos os endpoints da API
- 🔐 Sistema de autenticação integrado
- 📝 Exemplos de requisições e respostas
- 🧪 Teste direto dos endpoints
- 📋 Esquemas de validação detalhados

### 🔐 Autenticação

#### POST `/api/auth/register`
Cadastrar novo usuário

**Body:**
```json
{
  "email": "user@example.com",
  "password": "123456",
  "name": "João Silva",
  "role": "REQUESTER" 
}
```

**Resposta:**
```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "João Silva",
    "role": "REQUESTER",
    "createdAt": "2025-09-12T23:33:38.443Z",
    "updatedAt": "2025-09-12T23:33:38.443Z"
  }
}
```

#### POST `/api/auth/login`
Fazer login

**Body:**
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "João Silva",
    "role": "REQUESTER"
  }
}
```

#### GET `/api/auth/me`
Dados do usuário logado

**Headers:**
```
Authorization: Bearer <token>
```

### 📋 Requisições de Compra

#### POST `/api/purchase-requests`
Criar nova requisição de compra

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Compra de Material de Escritório",
  "description": "Material necessário para o escritório",
  "items": [
    {
      "description": "Canetas esferográficas",
      "quantity": 10,
      "unitPrice": 2.50
    },
    {
      "description": "Blocos de papel A4",
      "quantity": 5,
      "unitPrice": 15.00
    }
  ]
}
```

**Resposta:**
```json
{
  "id": "uuid",
  "title": "Compra de Material de Escritório",
  "description": "Material necessário para o escritório",
  "status": "PENDING",
  "totalAmount": "100.00",
  "items": [
    {
      "id": "uuid",
      "description": "Canetas esferográficas",
      "quantity": 10,
      "unitPrice": "2.50",
      "totalPrice": "25.00"
    }
  ],
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "user@example.com"
  },
  "createdAt": "2025-09-12T23:38:50.566Z"
}
```

#### GET `/api/purchase-requests`
Listar requisições de compra

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta:**
```json
[
  {
    "id": "uuid",
    "title": "Compra de Material de Escritório",
    "status": "PENDING",
    "totalAmount": "100.00",
    "items": [...],
    "user": {...},
    "createdAt": "2025-09-12T23:38:50.566Z"
  }
]
```

#### GET `/api/purchase-requests/:id`
Visualizar requisição específica

**Headers:**
```
Authorization: Bearer <token>
```

#### PATCH `/api/purchase-requests/:id`
Atualizar requisição (aprovar/rejeitar)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "status": "APPROVED", 
  "reason": "Aprovado conforme orçamento disponível"
}
```

### 📊 Monitoramento

#### GET `/`
Informações da API e documentação completa

**Resposta:**
```json
{
  "message": "API de Gestão de Requisições de Compra",
  "version": "1.0.0",
  "status": "online",
  "timestamp": "2025-09-12T23:33:52.736Z",
  "endpoints": {
    "health": {
      "method": "GET",
      "path": "/health",
      "description": "Status do servidor"
    },
    "auth": { ... },
    "purchaseRequests": { ... }
  }
}
```

#### GET `/health`
Status do servidor

**Resposta:**
```json
{
  "status": "ok",
  "timestamp": "2025-09-12T23:33:52.736Z"
}
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev                 # Inicia servidor com hot reload

# Build
pnpm build              # Compila TypeScript
pnpm start              # Inicia servidor compilado

# Banco de dados
pnpm prisma:migrate     # Executa migrações
pnpm prisma:generate    # Gera cliente Prisma
pnpm prisma:studio      # Interface visual do banco

# Docker
docker-compose up -d    # Inicia MySQL
docker-compose down     # Para MySQL
```

## 🗄️ Banco de Dados

### Tabelas

#### `users`
- `id` (UUID, PK)
- `email` (String, Unique)
- `password` (String, Hashed)
- `name` (String)
- `role` (Enum: REQUESTER, APPROVER, ADMIN)
- `createdAt`, `updatedAt`

#### `purchase_requests`
- `id` (UUID, PK)
- `title` (String)
- `description` (Text, Optional)
- `status` (Enum: PENDING, APPROVED, REJECTED, CANCELLED)
- `userId` (UUID, FK)
- `totalAmount` (Decimal)
- `approvedBy`, `approvedAt`, `rejectedBy`, `rejectedAt`, `reason`
- `createdAt`, `updatedAt`

#### `purchase_items`
- `id` (UUID, PK)
- `purchaseRequestId` (UUID, FK)
- `description` (String)
- `quantity` (Int)
- `unitPrice` (Decimal)
- `totalPrice` (Decimal)
- `createdAt`, `updatedAt`

## 🔒 Segurança

- Senhas são hasheadas com bcrypt
- Autenticação JWT com expiração
- Middleware de autenticação em rotas protegidas
- Validação de dados com Zod
- CORS configurado

## 🧪 Testando a API

### 🎯 Usando a Documentação Swagger (Recomendado)

1. **Acesse a documentação**: https://mvpdesafionode-api.onrender.com/docs
2. **Teste os endpoints diretamente** na interface Swagger
3. **Configure a autenticação**:
   - Clique em "Authorize" no topo da página
   - Faça login via `/api/auth/login`
   - Cole o token JWT retornado
   - Agora você pode testar todos os endpoints protegidos

### 📝 Exemplo via cURL

```bash
# 1. Cadastrar usuário
curl -X POST https://mvpdesafionode-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456","name":"Test User","role":"REQUESTER"}'

# 2. Fazer login
curl -X POST https://mvpdesafionode-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'

# 3. Criar requisição (usar token do login)
curl -X POST https://mvpdesafionode-api.onrender.com/api/purchase-requests \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"title":"Nova Requisição","description":"Descrição da requisição","items":[{"description":"Item 1","quantity":1,"unitPrice":10.00}]}'

# 4. Listar requisições
curl -X GET https://mvpdesafionode-api.onrender.com/api/purchase-requests \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 📝 Status das Requisições

- **PENDING**: Aguardando aprovação
- **APPROVED**: Aprovada (com data e responsável)
- **REJECTED**: Rejeitada (com motivo e responsável)
- **CANCELLED**: Cancelada

## 👥 Roles e Permissões

- **REQUESTER**: Pode criar e visualizar apenas suas requisições
- **APPROVER**: Pode visualizar todas as requisições e aprovar/rejeitar
- **ADMIN**: Acesso total ao sistema

## 🚀 Deploy

Para produção, configure:
- Variáveis de ambiente seguras
- Banco de dados em produção
- HTTPS
- Rate limiting
- Logs estruturados

## 📄 Licença

Este projeto está sob a licença MIT.

---

