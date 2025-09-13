import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { LoginDTO, RegisterDTO } from '../types';

const prisma = new PrismaClient();

export class AuthService {
  async register(data: RegisterDTO): Promise<User> {
    const { email, password, name, role } = data;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'REQUESTER'
      }
    });

    console.log(`Novo usuário registrado: ${email}`);
    return user;
  }

  async login(data: LoginDTO): Promise<User | null> {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log(` Tentativa de login falhou - usuário não encontrado: ${email}`);
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log(`Tentativa de login falhou - senha inválida: ${email}`);
      return null;
    }

    console.log(`Login bem-sucedido: ${email}`);
    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id }
    });
  }
}
