import { Status } from "./Status";

/**
 * Modelo para funções
 * @swagger
 * components:
 *   schemas:
 *     Function:
 *       type: object
 *       required:
 *         - name
 *         - statusId
 *       properties:
 *         functionId:
 *           type: integer
 *           description: ID único da função
 *         name:
 *           type: string
 *           maxLength: 200
 *           description: Nome da função
 *         statusId:
 *           type: integer
 *           description: ID do status
 *         status:
 *           $ref: '#/components/schemas/Status'
 */
export interface Function {
    functionId?: number;
    name: string;
    statusId: number;
    status?: Status;
  }