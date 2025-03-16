import { Status } from "./Status";
import { User } from "./User";
import { Person } from "./Person";
import { Availability } from "./Availability";

/**
 * Modelo para tickets
 * @swagger
 * components:
 *   schemas:
 *     Ticket:
 *       type: object
 *       required:
 *         - userId
 *         - personId
 *         - availabilityId
 *         - statusId
 *         - createdAt
 *       properties:
 *         ticketId:
 *           type: integer
 *           description: ID único do ticket
 *         userId:
 *           type: integer
 *           description: ID do usuário que criou o ticket
 *         personId:
 *           type: integer
 *           description: ID da pessoa relacionada ao ticket
 *         availabilityId:
 *           type: integer
 *           description: ID da disponibilidade
 *         statusId:
 *           type: integer
 *           description: ID do status
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data e hora de criação
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Data e hora da última atualização
 *         updatedBy:
 *           type: integer
 *           nullable: true
 *           description: ID do usuário que atualizou
 *         user:
 *           $ref: '#/components/schemas/User'
 *         person:
 *           $ref: '#/components/schemas/Person'
 *         availability:
 *           $ref: '#/components/schemas/Availability'
 *         status:
 *           $ref: '#/components/schemas/Status'
 *         updater:
 *           $ref: '#/components/schemas/User'
 */
export interface Ticket {
    ticketId?: number;
    userId: number;
    personId: number;
    availabilityId: number;
    statusId: number;
    createdAt: string;
    updatedAt?: string | null;
    updatedBy?: number | null;
    user?: User;
    person?: Person;
    availability?: Availability;
    status?: Status;
    updater?: User;
  }