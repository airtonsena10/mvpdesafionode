import { JwtPayload } from '../types';

export const generateToken = (payload: JwtPayload, secret: string): string => {
  // Esta função não é mais necessária pois o Fastify JWT plugin
  // já fornece os métodos sign e verify através do reply.jwtSign
  throw new Error('Use reply.jwtSign() instead of this utility function');
};

export const verifyToken = (token: string, secret: string): JwtPayload => {
  // Esta função não é mais necessária pois o Fastify JWT plugin
  // já fornece os métodos sign e verify através do request.jwtVerify
  throw new Error('Use request.jwtVerify() instead of this utility function');
};
