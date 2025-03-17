// src/controllers/authController.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import decodeCredentials from '../utils/decodeHash';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();

interface Props {
    req: Request;
    res: Response;
}

export async function Login({req, res} : Props) {
    try {
        const { hashPassword } = req.body;

        if (!hashPassword) {
            return res.status(400).json({ error: 'Credenciais não informadas' });
        }

        const { login, password } = decodeCredentials(hashPassword)

        const user = await prisma.users.findFirst({
            where: {
                Login: login,
            },
            select: {
                UserId: true,
                Login: true,
                Password: true,
                AccessProfileId: true,
                StatusId: true,
                Persons_Users_PersonIdToPersons: {
                    select: {
                        Name: true
                    }
                }
            }
        })

        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        if(user.StatusId.toString() !== "1") {
            return res.status(401).json({ error: 'Usuário inativo' });
        }

        // const passwordMatch = await bcrypt.compare(password, user.Password);
        const passwordMatch = password === user.Password;

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const token = jwt.sign(
            { id: user.UserId.toString() },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );

        const { Password: _, Persons_Users_PersonIdToPersons: person, ...userWithoutPassword } = user;

        (BigInt.prototype as any).toJSON = function() {
            return this.toString();
        };

        return res.status(200).json({
            user: {
                Name: person.Name,
                ...userWithoutPassword
            },
            token
        });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
};