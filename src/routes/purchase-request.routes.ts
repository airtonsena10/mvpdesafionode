import { FastifyInstance } from 'fastify';
import { PurchaseRequestController } from '../controllers/purchase-request.controller';
import { authenticate } from '../middlewares/auth.middleware';

const purchaseRequestController = new PurchaseRequestController();

export async function purchaseRequestRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate);

  // Criar requisição de compra
  app.post('/', {
    schema: {
      tags: ['purchase-requests'],
      summary: 'Criar requisição de compra',
      description: 'Cria uma nova requisição de compra no sistema',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['title', 'description', 'items'],
        properties: {
          title: {
            type: 'string',
            minLength: 3,
            description: 'Título da requisição'
          },
          description: {
            type: 'string',
            minLength: 10,
            description: 'Descrição detalhada da requisição'
          },
          items: {
            type: 'array',
            minItems: 1,
            description: 'Lista de itens da requisição',
            items: {
              type: 'object',
              required: ['description', 'quantity', 'unitPrice'],
              properties: {
                description: {
                  type: 'string',
                  minLength: 3,
                  description: 'Descrição do item'
                },
                quantity: {
                  type: 'number',
                  minimum: 1,
                  description: 'Quantidade do item'
                },
                unitPrice: {
                  type: 'number',
                  minimum: 0.01,
                  description: 'Preço unitário do item'
                }
              }
            }
          }
        }
      },
      response: {
        201: {
          description: 'Requisição criada com sucesso',
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string' },
            totalAmount: { type: 'number' },
            requesterId: { type: 'string' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  description: { type: 'string' },
                  quantity: { type: 'number' },
                  unitPrice: { type: 'number' },
                  totalPrice: { type: 'number' }
                }
              }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        400: {
          description: 'Dados inválidos',
          type: 'object',
          properties: {
            message: { type: 'string' }
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
  }, purchaseRequestController.create);

  // Listar requisições de compra
  app.get('/', {
    schema: {
      tags: ['purchase-requests'],
      summary: 'Listar requisições de compra',
      description: 'Lista todas as requisições de compra do usuário autenticado',
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
            description: 'Filtrar por status da requisição'
          },
          page: {
            type: 'number',
            minimum: 1,
            default: 1,
            description: 'Número da página'
          },
          limit: {
            type: 'number',
            minimum: 1,
            maximum: 100,
            default: 10,
            description: 'Quantidade de itens por página'
          }
        }
      },
      response: {
        200: {
          description: 'Lista de requisições',
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  description: { type: 'string' },
                  status: { type: 'string' },
                  totalAmount: { type: 'number' },
                  requesterId: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' }
                }
              }
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number' },
                limit: { type: 'number' },
                total: { type: 'number' },
                totalPages: { type: 'number' }
              }
            }
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
  }, purchaseRequestController.findAll);

  // Buscar requisição por ID
  app.get('/:id', {
    schema: {
      tags: ['purchase-requests'],
      summary: 'Buscar requisição por ID',
      description: 'Retorna os detalhes de uma requisição específica',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: {
            type: 'string',
            description: 'ID da requisição'
          }
        }
      },
      response: {
        200: {
          description: 'Detalhes da requisição',
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string' },
            totalAmount: { type: 'number' },
            requesterId: { type: 'string' },
            approverId: { type: 'string' },
            reason: { type: 'string' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  description: { type: 'string' },
                  quantity: { type: 'number' },
                  unitPrice: { type: 'number' },
                  totalPrice: { type: 'number' }
                }
              }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        401: {
          description: 'Token inválido ou expirado',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        404: {
          description: 'Requisição não encontrada',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, purchaseRequestController.findById);

  // Atualizar requisição
  app.patch('/:id', {
    schema: {
      tags: ['purchase-requests'],
      summary: 'Atualizar requisição',
      description: 'Atualiza uma requisição (aprovar, rejeitar ou cancelar)',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: {
            type: 'string',
            description: 'ID da requisição'
          }
        }
      },
      body: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            minLength: 3,
            description: 'Novo título da requisição'
          },
          description: {
            type: 'string',
            minLength: 10,
            description: 'Nova descrição da requisição'
          },
          status: {
            type: 'string',
            enum: ['APPROVED', 'REJECTED', 'CANCELLED'],
            description: 'Novo status da requisição'
          },
          reason: {
            type: 'string',
            description: 'Motivo da alteração de status'
          }
        }
      },
      response: {
        200: {
          description: 'Requisição atualizada com sucesso',
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string' },
            totalAmount: { type: 'number' },
            requesterId: { type: 'string' },
            approverId: { type: 'string' },
            reason: { type: 'string' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  description: { type: 'string' },
                  quantity: { type: 'number' },
                  unitPrice: { type: 'number' },
                  totalPrice: { type: 'number' }
                }
              }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        400: {
          description: 'Dados inválidos',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        401: {
          description: 'Token inválido ou expirado',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        403: {
          description: 'Sem permissão para atualizar esta requisição',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        404: {
          description: 'Requisição não encontrada',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, purchaseRequestController.update);
}
