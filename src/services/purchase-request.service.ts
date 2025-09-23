import { PrismaClient, PurchaseRequest, Prisma } from '@prisma/client';
import { CreatePurchaseRequestDTO, UpdatePurchaseRequestDTO } from '../types';

const prisma = new PrismaClient();

export class PurchaseRequestService {
  async create(data: CreatePurchaseRequestDTO, userId: string): Promise<PurchaseRequest> {
    const { title, description, items } = data;

    const totalAmount = items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);

    const purchaseRequest = await prisma.purchaseRequest.create({
      data: {
        title,
        description,
        userId,
        totalAmount,
        items: {
          create: items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice
          }))
        }
      },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return purchaseRequest;
  }

  async findAll(userId?: string, role?: string): Promise<PurchaseRequest[]> {
    const where: Prisma.PurchaseRequestWhereInput = {};


    if (role !== 'ADMIN' && role !== 'APPROVER' && userId) {
      where.userId = userId;
    }

    const requests = await prisma.purchaseRequest.findMany({
      where,
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return requests;
  }

  async findById(id: string, userId?: string, role?: string): Promise<PurchaseRequest | null> {
    const request = await prisma.purchaseRequest.findUnique({
      where: { id },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!request) {
      return null;
    }

    // Verifica permissão
    if (role !== 'ADMIN' && role !== 'APPROVER' && request.userId !== userId) {
      throw new Error('Sem permissão para visualizar esta requisição');
    }

    return request;
  }

  async update(
    id: string,
    data: UpdatePurchaseRequestDTO,
    userId: string,
    role: string
  ): Promise<PurchaseRequest> {
    const request = await this.findById(id, userId, role);

    if (!request) {
      throw new Error('Requisição não encontrada');
    }

    // Verifica permissões para atualização
    if (data.status === 'APPROVED' || data.status === 'REJECTED') {
      if (role !== 'APPROVER' && role !== 'ADMIN') {
        throw new Error('Sem permissão para aprovar/rejeitar requisições');
      }

      if (request.userId === userId) {
        throw new Error('Você não pode aprovar suas próprias requisições');
      }
    }

    const updateData: Prisma.PurchaseRequestUpdateInput = {
      title: data.title,
      description: data.description,
      status: data.status,
      reason: data.reason
    };

    if (data.status === 'APPROVED') {
      updateData.approvedBy = userId;
      updateData.approvedAt = new Date();
    } else if (data.status === 'REJECTED') {
      updateData.rejectedBy = userId;
      updateData.rejectedAt = new Date();
    }

    const updatedRequest = await prisma.purchaseRequest.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return updatedRequest;
  }
}
