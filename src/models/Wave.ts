import { Status } from "./Status";

/**
 * Modelo para ondas
 * @swagger
 * components:
 *   schemas:
 *     Wave:
 *       type: object
 *       required:
 *         - name
 *         - statusId
 *       properties:
 *         waveId:
 *           type: integer
 *           description: ID único da onda
 *         name:
 *           type: string
 *           maxLength: 255
 *           description: Nome da onda
 *         statusId:
 *           type: integer
 *           description: ID do status
 *         status:
 *           $ref: '#/components/schemas/Status'
 */
export interface Wave {
    waveId?: number;
    name: string;
    statusId: number;
    status?: Status;
}