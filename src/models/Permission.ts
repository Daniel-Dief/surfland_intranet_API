import { AccessProfile } from "./AccessProfile";
import { Function } from "./Function";

/**
 * Modelo para permissões
 * @swagger
 * components:
 *   schemas:
 *     Permission:
 *       type: object
 *       required:
 *         - accessProfileId
 *         - functionId
 *       properties:
 *         permissionId:
 *           type: integer
 *           description: ID único da permissão
 *         accessProfileId:
 *           type: integer
 *           description: ID do perfil de acesso
 *         functionId:
 *           type: integer
 *           description: ID da função
 *         accessProfile:
 *           $ref: '#/components/schemas/AccessProfile'
 *         function:
 *           $ref: '#/components/schemas/Function'
 */
export interface Permission {
    permissionId?: number;
    accessProfileId: number;
    functionId: number;
    accessProfile?: AccessProfile;
    function?: Function;
  }