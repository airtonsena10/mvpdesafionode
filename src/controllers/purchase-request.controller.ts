import { FastifyRequest, FastifyReply } from 'fastify';
import { PurchaseRequestService } from '../services/purchase-request.service';
import { CreatePurchaseRequestDTO, UpdatePurchaseRequestDTO, JwtPayload } from '../types';
import { z } from 'zod';

const purchaseRequestService = new PurchaseRequestService();

const createSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  items: z.array(z.object({
    description: z.string(),
    quantity: z.number().int().positive(),
    unitPrice: z.number().positive()
  })).min(1)
});

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  status: z.enum(['APPROVED', 'REJECTED', 'CANCELLED']).optional(),
  reason: z.string().optional()
});

export class PurchaseRequestController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = createSchema.parse(request.body);
      const user = request.user as JwtPayload;
      const userId = user.id;

      const purchaseRequest = await purchaseRequestService.create(
        data as CreatePurchaseRequestDTO,
        userId
      );

      return reply.status(201).send(purchaseRequest);
    } catch (error: any) {
      
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ 
          error: 'Dados inválidos', 
          details: error.errors 
        });
      }

      return reply.status(500).send({ 
        error: error.message || 'Erro ao criar requisição' 
      });
    }
  }

  async findAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user as JwtPayload;
      const userId = user.id;
      const role = user.role;

      const requests = await purchaseRequestService.findAll(userId, role);

      
      return reply.send({
        data: requests,
        pagination: {
          page: 1,
          limit: requests.length,
          total: requests.length,
          totalPages: 1
        }
      });
    } catch (error: any) {
      return reply.status(500).send({ 
        error: 'Erro ao listar requisições' 
      });
    }
  }

  async findById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const user = request.user as JwtPayload;
      const userId = user.id;
      const role = user.role;

      const purchaseRequest = await purchaseRequestService.findById(id, userId, role);

      if (!purchaseRequest) {
        return reply.status(404).send({ error: 'Requisição não encontrada' });
      }

      return reply.send(purchaseRequest);
    } catch (error: any) {
      
      if (error.message === 'Sem permissão para visualizar esta requisição') {
        return reply.status(403).send({ error: error.message });
      }

      return reply.status(500).send({ 
        error: 'Erro ao buscar requisição' 
      });
    }
  }

  async update(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const data = updateSchema.parse(request.body);
      const user = request.user as JwtPayload;
      const userId = user.id;
      const role = user.role;

      const updatedRequest = await purchaseRequestService.update(
        id,
        data as UpdatePurchaseRequestDTO,
        userId,
        role
      );

      return reply.send(updatedRequest);
    } catch (error: any) {
      
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ 
          error: 'Dados inválidos', 
          details: error.errors 
        });
      }

      if (error.message.includes('permissão')) {
        return reply.status(403).send({ error: error.message });
      }

      if (error.message === 'Requisição não encontrada') {
        return reply.status(404).send({ error: error.message });
      }

      return reply.status(500).send({ 
        error: 'Erro ao atualizar requisição' 
      });
    }
  }
}
