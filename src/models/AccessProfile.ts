import { Status } from "./Status";

/**
 * Modelo para perfis de acesso
 * @swagger
 * components:
 *   schemas:
 *     AccessProfile:
 *       type: object
 *       required:
 *         - name
 *         - waveLimitMonth
 *         - waveLimitWeek
 *         - waveLimitDay
 *         - statusId
 *       properties:
 *         accessProfileId:
 *           type: integer
 *           description: ID único do perfil de acesso
 *         name:
 *           type: string
 *           maxLength: 200
 *           description: Nome do perfil de acesso
 *         waveLimitMonth:
 *           type: integer
 *           description: Limite mensal de emissão de ondas
 *         waveLimitWeek:
 *           type: integer
 *           description: Limite semanal de emissão de ondas
 *         waveLimitDay:
 *           type: integer
 *           description: Limite diário de emissão de ondas
 *         statusId:
 *           type: integer
 *           description: ID do status
 *         status:
 *           $ref: '#/components/schemas/Status'
 */
export interface AccessProfile {
    accessProfileId?: number;
    name: string;
    waveLimitMonth: number;
    waveLimitWeek: number;
    waveLimitDay: number;
    statusId: number;
    status?: Status;
  }