import { Router } from 'express';
import { getWaves } from '../controllers/waveController';

const router = Router();

/**
 * @swagger
 * /waves/allWaves:
 *   get:
 *     summary: Retorna todas as ondas
 *     tags: [Waves]
 *     responses:
 *       200:
 *         description: Retorna todas as ondas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   waveName:
 *                     type: string
 *                     description: Nome da onda
 */
router.get('/allWaves', async (req, res) =>{
    const waveName = req.query.waveName?.toString();
    
    const waves = await getWaves({
        name: waveName
    })

    res.status(200).json(waves);
});


/**
 * @swagger
 * /waves/activeWaves:
 *   get:
 *     summary: Retorna todas as ondas ativas
 *     tags: [Waves]
 *     responses:
 *       200:
 *         description: Retorna todas as ondas ativas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   waveName:
 *                     type: string
 *                     description: Nome da onda
 */
router.get('/activeWaves', async (req, res) =>{
    const waveName = req.query.name?.toString();
    
    const waves = await getWaves({
        name: waveName,
        statusId: 1
    })

    res.status(200).json(waves);
});

export default router;