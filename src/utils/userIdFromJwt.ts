import jwt from 'jsonwebtoken';

export default function (token: string): number {
  try {
    token = token.split(' ')[1];
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    
    if (!decoded) {
      throw new Error('Token inválido');
    }
    
    return decoded.sub || decoded.user_id || decoded.id;
  } catch (error) {
    throw new Error('Erro ao decodificar o JWT');
  }
}