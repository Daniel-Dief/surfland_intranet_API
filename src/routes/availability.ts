import { Router } from 'express';
import { getAvailableShedules } from '../controllers/availabilityController'; 

const router = Router();

/**
 * @swagger
 * /tickets/myTickets:
 *   get:
 *     summary: Retorna os tickets do usuário
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: Retorna os tickets do usuário
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
router.get('/availabilityWaves', async (req, res) =>{
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

export default router;