import { Status } from "./Status";
import { AccessProfile } from "./AccessProfile";
import { Person } from "./Person";

/**
 * Modelo para usuários
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - login
 *         - password
 *         - accessProfileId
 *         - statusId
 *         - personId
 *       properties:
 *         userId:
 *           type: integer
 *           description: ID único do usuário
 *         login:
 *           type: string
 *           maxLength: 20
 *           description: Login do usuário (igual ao documento da pessoa)
 *         password:
 *           type: string
 *           maxLength: 255
 *           description: Senha criptografada
 *         accessProfileId:
 *           type: integer
 *           description: ID do perfil de acesso
 *         statusId:
 *           type: integer
 *           description: ID do status
 *         temporaryPassword:
 *           type: string
 *           maxLength: 6
 *           nullable: true
 *           description: Senha temporária
 *         personId:
 *           type: integer
 *           description: ID da pessoa relacionada
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Data e hora da última atualização
 *         updatedBy:
 *           type: integer
 *           nullable: true
 *           description: ID do usuário que atualizou
 *         accessProfile:
 *           $ref: '#/components/schemas/AccessProfile'
 *         status:
 *           $ref: '#/components/schemas/Status'
 *         person:
 *           $ref: '#/components/schemas/Person'
 */
export interface User {
    userId?: number;
    login: string;
    password: string;
    accessProfileId: number;
    statusId: number;
    temporaryPassword?: string | null;
    personId: number;
    updatedAt?: string | null;
    updatedBy?: number | null;
    accessProfile?: AccessProfile;
    status?: Status;
    person?: Person;
  }