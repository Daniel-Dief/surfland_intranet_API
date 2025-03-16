/**
 * Modelo para pessoas
 * @swagger
 * components:
 *   schemas:
 *     Person:
 *       type: object
 *       required:
 *         - name
 *         - document
 *         - birthDate
 *         - email
 *         - phone
 *         - foreigner
 *       properties:
 *         personId:
 *           type: integer
 *           description: ID único da pessoa
 *         name:
 *           type: string
 *           maxLength: 200
 *           description: Nome completo da pessoa
 *         document:
 *           type: string
 *           maxLength: 20
 *           description: Documento de identificação (CPF/Passaporte)
 *         birthDate:
 *           type: string
 *           format: date
 *           description: Data de nascimento
 *         email:
 *           type: string
 *           maxLength: 100
 *           description: Endereço de e-mail
 *         phone:
 *           type: string
 *           pattern: '^[0-9]{11}$'
 *           description: Número de telefone (11 dígitos)
 *         foreigner:
 *           type: boolean
 *           description: Indica se é estrangeiro
 */
export interface Person {
    personId?: number;
    name: string;
    document: string;
    birthDate: string;
    email: string;
    phone: string;
    foreigner: boolean;
  }