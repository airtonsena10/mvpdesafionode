import jwt from '@fastify/jwt';
import { JwtPayload } from '../types';

export const generateToken = (payload: JwtPayload, secret: string): string => {
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

export const verifyToken = (token: string, secret: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};
