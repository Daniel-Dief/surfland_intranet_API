import { Status } from "./Status";
import { User } from "./User";
import { Wave } from "./Wave";

/**
 * Modelo para disponibilidade
 * @swagger
 * components:
 *   schemas:
 *     Availability:
 *       type: object
 *       required:
 *         - waveId
 *         - statusId
 *         - waveDate
 *         - waveTime
 *         - amount
 *         - createdAt
 *       properties:
 *         availabilityId:
 *           type: integer
 *           description: ID único da disponibilidade
 *         waveId:
 *           type: integer
 *           description: ID da onda relacionada
 *         statusId:
 *           type: integer
 *           description: ID do status
 *         waveDate:
 *           type: string
 *           format: date
 *           description: Data da onda
 *         waveTime:
 *           type: string
 *           format: time
 *           description: Hora da onda
 *         amount:
 *           type: integer
 *           description: Quantidade disponível
 *         createdBy:
 *           type: integer
 *           nullable: true
 *           description: ID do usuário que criou
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data e hora de criação
 *         wave:
 *           $ref: '#/components/schemas/Wave'
 *         status:
 *           $ref: '#/components/schemas/Status'
 *         creator:
 *           $ref: '#/components/schemas/User'
 */
export interface Availability {
    availabilityId?: number;
    waveId: number;
    statusId: number;
    waveDate: string;
    waveTime: string;
    amount: number;
    createdBy?: number | null;
    createdAt: string;
    wave?: Wave;
    status?: Status;
    creator?: User;
  }