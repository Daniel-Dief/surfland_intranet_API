import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const passThrough = ['/api/login', '/api-docs/'];

interface Props { 
  req: Request,
  res: Response,
  next: NextFunction
}

export async function validateToken({ req, res, next } : Props) {
  const isAllowed = passThrough.some(path => req.path.startsWith(path));

  if (isAllowed) {
    return next();
  }

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ error: 'Token não fornecido' });
      return;
    }

    const parts = authHeader.split(' ');


    if (parts.length !== 2) {
      res.status(401).json({ error: 'Erro no formato do token' });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      res.status(401).json({ error: 'Token mal formatado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };

    const user = await prisma.users.findUnique({
      where: { UserId: decoded.id }
    });

    if (!user) {
      res.status(401).json({ error: 'Usuário não encontrado' });
    }

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token expirado' });
    } else {
      res.status(401).json({ error: 'Token inválido' });
    }
  }
};