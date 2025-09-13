import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/auth.service';
import { LoginDTO, RegisterDTO } from '../types';
import { z } from 'zod';

const authService = new AuthService();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(['REQUESTER', 'APPROVER', 'ADMIN']).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export class AuthController {
  async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = registerSchema.parse(request.body);
      const user = await authService.register(data as RegisterDTO);

      const { password, ...userWithoutPassword } = user;

      return reply.status(201).send({
        message: 'Usuário criado com sucesso',
        user: userWithoutPassword
      });
    } catch (error: any) {
      console.log('[AUTH] Erro no registro:', error);
      
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ 
          error: 'Dados inválidos', 
          details: error.errors 
        });
      }

      return reply.status(400).send({ 
        error: error.message || 'Erro ao criar usuário' 
      });
    }
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = loginSchema.parse(request.body);
      const user = await authService.login(data as LoginDTO);

      if (!user) {
        return reply.status(401).send({ error: 'Credenciais inválidas' });
      }

      const token = await reply.jwtSign({
        id: user.id,
        email: user.email,
        role: user.role
      });

      const { password, ...userWithoutPassword } = user;

      return reply.send({
        token,
        user: userWithoutPassword
      });
    } catch (error: any) {
      console.log('[AUTH] Erro no login:', error);
      
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ 
          error: 'Dados inválidos', 
          details: error.errors 
        });
      }

      return reply.status(500).send({ 
        error: 'Erro ao fazer login' 
      });
    }
  }

  async me(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({ error: 'Não autenticado' });
      }

      const user = await authService.getUserById(request.user.id);

      if (!user) {
        return reply.status(404).send({ error: 'Usuário não encontrado' });
      }

      const { password, ...userWithoutPassword } = user;

      return reply.send(userWithoutPassword);
    } catch (error) {
      console.log('[AUTH] Erro ao buscar usuário:', error);
      return reply.status(500).send({ error: 'Erro ao buscar dados do usuário' });
    }
  }
}
