import { Router } from 'express';
import { getAvailableShedules, getAvailableWaves } from '../controllers/availabilityController'; 

const router = Router();

/**
 * @swagger
 * /availability/availableShedules:
 *   get:
 *     summary: Retorna os horários disponíveis de uma onda
 *     tags: [Availability]
 *     responses:
 *       200:
 *         description: Retorna os horários disponíveis de uma onda
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   waveId:
 *                     type: number
 *                     description: Id da onda
 */
router.get('/availableShedules', async (req, res) =>{
    const { waveId } = req.query;

    if(!waveId) {
        res.status(400).json({ message: "WaveId is required" });
        return;
    }

    const intWaveIt = parseInt(waveId as string);

    const schedules = await getAvailableShedules(intWaveIt);

    if(schedules.length === 0) {
        res.status(200).json({ message: "No schedules available" });
    } else {
        res.status(200).json(schedules);
    }
});

/**
 * @swagger
 * /availability/availabilityWaves:
 *   get:
 *     summary: Retorna as ondas disponiveis para o proximo mes
 *     tags: [Availability]
 *     responses:
 *       200:
 *         description: Retorna as ondas disponiveis para o proximo mes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 */
router.get('/availabilityWaves', async (req, res) =>{
    const waves = await getAvailableWaves();

    if(waves.length === 0) {
        res.status(200).json({ message: "No waves available" });
    } else {
        res.status(200).json(waves);
    }
});

export default router;