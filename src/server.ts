import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { authRoutes } from './routes/auth.routes';
import { purchaseRequestRoutes } from './routes/purchase-request.routes';

const app = Fastify({
  logger: false
});

app.register(cors, {
  origin: true
});

app.register(jwt, {
  secret: process.env.JWT_SECRET || 'default-secret-key'
});

// Configuração do Swagger
app.register(swagger, {
  swagger: {
    info: {
      title: 'API de Gestão de Requisições de Compra',
      description: 'Sistema para gerenciar requisições de compra com autenticação e autorização',
      version: '1.0.0',
      contact: {
        name: 'Equipe de Desenvolvimento',
        email: 'dev@empresa.com'
      }
    },
    host: 'localhost:3333',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: 'Token JWT para autenticação. Formato: Bearer <token>'
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'auth',
        description: 'Endpoints de autenticação e autorização'
      },
      {
        name: 'purchase-requests',
        description: 'Endpoints para gerenciar requisições de compra'
      },
      {
        name: 'health',
        description: 'Endpoints de monitoramento e status'
      }
    ]
  }
});

// Configuração do Swagger UI
app.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false
  },
  uiHooks: {
    onRequest: function (request, reply, next) { next() },
    preHandler: function (request, reply, next) { next() }
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
  transformSpecificationClone: true
});

// Rota principal
app.get('/', {
  schema: {
    tags: ['health'],
    summary: 'Informações da API',
    description: 'Retorna informações gerais sobre a API e seus endpoints',
    response: {
      200: {
        description: 'Informações da API',
        type: 'object',
        properties: {
          message: { type: 'string' },
          version: { type: 'string' },
          status: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
          endpoints: {
            type: 'object',
            properties: {
              health: {
                type: 'object',
                properties: {
                  method: { type: 'string' },
                  path: { type: 'string' },
                  description: { type: 'string' }
                }
              },
              auth: { type: 'object' },
              purchaseRequests: { type: 'object' }
            }
          }
        }
      }
    }
  }
}, async (request, reply) => {
  return {
    message: 'API de Gestão de Requisições de Compra',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: {
        method: 'GET',
        path: '/health',
        description: 'Status do servidor'
      },
      auth: {
        register: {
          method: 'POST',
          path: '/api/auth/register',
          description: 'Cadastrar usuário',
          body: { email: 'string', password: 'string', name: 'string', role: 'REQUESTER|APPROVER|ADMIN' }
        },
        login: {
          method: 'POST',
          path: '/api/auth/login',
          description: 'Fazer login',
          body: { email: 'string', password: 'string' }
        },
        me: {
          method: 'GET',
          path: '/api/auth/me',
          description: 'Dados do usuário logado',
          headers: { Authorization: 'Bearer <token>' }
        }
      },
      purchaseRequests: {
        create: {
          method: 'POST',
          path: '/api/purchase-requests',
          description: 'Criar requisição de compra',
          headers: { Authorization: 'Bearer <token>' },
          body: { title: 'string', description: 'string', items: [{ description: 'string', quantity: 'number', unitPrice: 'number' }] }
        },
        list: {
          method: 'GET',
          path: '/api/purchase-requests',
          description: 'Listar requisições',
          headers: { Authorization: 'Bearer <token>' }
        },
        get: {
          method: 'GET',
          path: '/api/purchase-requests/:id',
          description: 'Visualizar requisição específica',
          headers: { Authorization: 'Bearer <token>' }
        },
        update: {
          method: 'PATCH',
          path: '/api/purchase-requests/:id',
          description: 'Atualizar requisição (aprovar/rejeitar)',
          headers: { Authorization: 'Bearer <token>' },
          body: { title: 'string', description: 'string', status: 'APPROVED|REJECTED|CANCELLED', reason: 'string' }
        }
      }
    }
  };
});

// Rotas
app.register(authRoutes, { prefix: '/api/auth' });
app.register(purchaseRequestRoutes, { prefix: '/api/purchase-requests' });

// Health check
app.get('/health', {
  schema: {
    tags: ['health'],
    summary: 'Status do servidor',
    description: 'Verifica se o servidor está funcionando corretamente',
    response: {
      200: {
        description: 'Servidor funcionando',
        type: 'object',
        properties: {
          status: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' }
        }
      }
    }
  }
}, async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3333;
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Servidor rodando na porta ${port}`);
    console.log(`📚 Documentação Swagger disponível em http://localhost:${port}/docs`);
    console.log(`🔍 Health check disponível em http://localhost:${port}/health`);
  } catch (err) {
    console.error('Erro ao iniciar servidor:', err);
    process.exit(1);
  }
};

start();
