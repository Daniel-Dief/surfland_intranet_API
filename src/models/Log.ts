import { User } from "./User";

/**
 * Modelo para logs
 * @swagger
 * components:
 *   schemas:
 *     Log:
 *       type: object
 *       required:
 *         - userId
 *         - changedAt
 *       properties:
 *         logId:
 *           type: integer
 *           description: ID único do log
 *         userId:
 *           type: integer
 *           description: ID do usuário que realizou a alteração
 *         changedAt:
 *           type: string
 *           format: date-time
 *           description: Data e hora da alteração
 *         oldJSON:
 *           type: string
 *           nullable: true
 *           description: Dados antigos em formato JSON
 *         newJSON:
 *           type: string
 *           nullable: true
 *           description: Dados novos em formato JSON
 *         user:
 *           $ref: '#/components/schemas/User'
 */
export interface Log {
    logId?: number;
    userId: number;
    changedAt: string;
    oldJSON?: string | null;
    newJSON?: string | null;
    user?: User;
  }