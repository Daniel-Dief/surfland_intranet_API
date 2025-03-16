/**
 * Modelo para avaliação
 * @swagger
 * components:
 *   schemas:
 *     Evaluate:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único da avaliação
 *         body:
 *           type: string
 *           maxLength: 255
 *           nullable: true
 *           description: Conteúdo da avaliação
 */
export interface Evaluate {
    id?: number;
    body?: string | null;
  }