import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const authController = new AuthController();

export async function authRoutes(app: FastifyInstance) {
  // Registro de usuário
  app.post('/register', {
    schema: {
      tags: ['auth'],
      summary: 'Cadastrar novo usuário',
      description: 'Cria uma nova conta de usuário no sistema',
      body: {
        type: 'object',
        required: ['email', 'password', 'name', 'role'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'Email do usuário'
          },
          password: {
            type: 'string',
            minLength: 6,
            description: 'Senha do usuário (mínimo 6 caracteres)'
          },
          name: {
            type: 'string',
            minLength: 2,
            description: 'Nome completo do usuário'
          },
          role: {
            type: 'string',
            enum: ['REQUESTER', 'APPROVER', 'ADMIN'],
            description: 'Papel do usuário no sistema'
          }
        }
      },
      response: {
        201: {
          description: 'Usuário criado com sucesso',
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string' }
              }
            },
            token: { type: 'string' }
          }
        },
        400: {
          description: 'Dados inválidos',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        409: {
          description: 'Email já cadastrado',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, authController.register);

  // Login de usuário
  app.post('/login', {
    schema: {
      tags: ['auth'],
      summary: 'Fazer login',
      description: 'Autentica um usuário e retorna um token JWT',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'Email do usuário'
          },
          password: {
            type: 'string',
            description: 'Senha do usuário'
          }
        }
      },
      response: {
        200: {
          description: 'Login realizado com sucesso',
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string' }
              }
            },
            token: { type: 'string' }
          }
        },
        401: {
          description: 'Credenciais inválidas',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, authController.login);

  // Dados do usuário logado
  app.get('/me', {
    onRequest: [authenticate],
    schema: {
      tags: ['auth'],
      summary: 'Dados do usuário logado',
      description: 'Retorna os dados do usuário autenticado',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'Dados do usuário',
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            role: { type: 'string' }
          }
        },
        401: {
          description: 'Token inválido ou expirado',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, authController.me);
}
