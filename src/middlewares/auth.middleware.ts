import { FastifyRequest, FastifyReply } from 'fastify';
import { JwtPayload } from '../types';

declare module 'fastify' {
  interface FastifyRequest {
    user?: JwtPayload;
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return reply.status(401).send({ error: 'Token não fornecido' });
    }

    const decoded = await request.jwtVerify() as JwtPayload;
    request.user = decoded;
  } catch (error) {
    console.log('[AUTH] Erro na autenticação:', error);
    return reply.status(401).send({ error: 'Token inválido' });
  }
}
