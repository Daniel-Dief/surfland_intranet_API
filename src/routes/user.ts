import { Router } from 'express';
import getUserIdFromJwt from '../utils/userIdFromJwt'
import { getUserById, getUserInfo } from '../controllers/userController';
import { updatedUser } from '../controllers/userController';
import { getPermissions } from '../controllers/permissionController';
import { getFunctionsByAccessProfileId } from '../controllers/functionController';

const router = Router();

/**
 * @swagger
 * /user/myUser:
 *   get:
 *     summary: Retorna informações do usuário
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Retorna informações do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/myUser', async (req, res) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        res.status(401).json({ error: 'Token não informado' });
        return;
    }

    const userInfo = await getUserInfo(
        getUserIdFromJwt(authHeader)
    );

    if(!userInfo) {
        res.status(400).json({ error: 'Usuário não encontrado' });
        return;
    }

    const userInfos = {
        UserId: userInfo.UserId.toString(),
        StatusId: userInfo.StatusId.toString(),
        AccessProfileId: userInfo.AccessProfileId.toString(),
        Name: userInfo.Persons_Users_PersonIdToPersons.Name,
        Email: userInfo.Persons_Users_PersonIdToPersons.Email,
        Phone: userInfo.Persons_Users_PersonIdToPersons.Phone,
        BirthDate: userInfo.Persons_Users_PersonIdToPersons.BirthDate,
        Document: userInfo.Persons_Users_PersonIdToPersons.Document
    }

    res.status(200).json(userInfos);
})

/**
 * @swagger
 * /user/changePassword:
 *   patch:
 *     summary: Redefine a senha do usuário
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Redefine a senha do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   oldPassword:
 *                     type: string
 *                     description: Senha antiga do usuário
 *                   newPassword:
 *                     type: string
 *                     description: Nova senha do usuário
 *                   confirmPassword:
 *                     type: string
 *                     description: Confirmação da nova senha do usuário
 */
router.patch('/changePassword', async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const authHeader = req.headers.authorization;

    if(!oldPassword || !newPassword || !confirmPassword) {
        res.status(400).json({ error: 'Campos obrigatórios não informados' });
        return;
    }

    if(newPassword !== confirmPassword) {
        res.status(400).json({ error: 'As senhas não conhecidem' });
        return;
    }

    if(!authHeader) {
        res.status(401).json({ error: 'Token não informado' });
        return;
    }

    const user = await getUserById(
        getUserIdFromJwt(authHeader)
    );
    
    if(!user || user.Password != oldPassword) {
        res.status(400).json({ error: 'Senha antiga incorreta' });
        return;
    }
    
    const toUpdateUser = {
        userId: Number(user.UserId),
        password: newPassword
    }

    await updatedUser(toUpdateUser);
    res.status(200).json({ message: 'Senha alterada com sucesso' });
})

/**
 * @swagger
 * /user/checkAccess:
 *   get:
 *     summary: verifica se o usuário tem acesso a uma função
 *     tags: [User]
 *     responses:
 *       200:
 *         description: verifica se o usuário tem acesso a uma função
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   functionId:
 *                     type: number
 *                     description: Id da função
 */

router.get('/checkAccess', async (req, res) => {
    const functionId = Number(req.query.functionId);
    const authHeader = req.headers.authorization;

    if(!functionId) {
        res.status(400).json({ error: 'Campo obrigatório não informado' });
        return;
    }

    if(!authHeader) {
        res.status(401).json({ error: 'Token não informado' });
        return;
    }

    const user = await getUserById(
        getUserIdFromJwt(authHeader)
    );

    if(!user) {
        res.status(400).json({ error: 'Usuário não encontrado' });
        return;
    }

    const accessProfile = Number(user.AccessProfileId);

    const permissions = await getPermissions({
        accessProfileId: accessProfile,
        functionId: functionId
    })

    res.status(200).json({ hasAccess: permissions.length > 0 });
})

/**
 * @swagger
 * /user/myFunctions:
 *   get:
 *     summary: Retorna as funções que o usuário tem acesso
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Retorna as funções que o usuário tem acesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.get('/myFunctions', async (req, res) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        res.status(401).json({ error: 'Token não informado' });
        return;
    }

    const user = await getUserById(
        getUserIdFromJwt(authHeader)
    );

    if(!user) {
        res.status(400).json({ error: 'Usuário não encontrado' });
        return;
    }

    const myFunctions = await getFunctionsByAccessProfileId(
        Number(user.AccessProfileId)
    )

    res.status(200).json(myFunctions)
})

export default router;