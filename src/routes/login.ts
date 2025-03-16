import { Router } from "express";
import { Login } from "../controllers/authController";

const router = Router();

/**
 * @swagger
 * /api/login:
 *   get:
 *     summary: Efetua o login do usuário
 *     tags: [Login]
 *     responses:
 *       200:
 *         description: Login do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   login:
 *                     type: string
 *                     description: Documento/Login do usuário
 *                   password:
 *                     type: string
 *                     description: Senha do usuário
 */
router.post('/login', (req, res) => {
    Login({req, res});
});

export default router;