import { Router } from 'express';
import { getAvailabilitySchedules, getAvailableWaves, getAvailableDates, getAvailabilityId, checkDayLimit } from '../controllers/availabilityController'; 
import { checkUserLimitForNextMonth, getUserById } from '../controllers/userController';
import getUserIdFromJwt from '../utils/userIdFromJwt';
import { scheduleTicket } from '../controllers/ticketController';

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
router.get('/availabilitySchedules', async (req, res) =>{
    const { waveId } = req.query;

    if(!waveId) {
        res.status(400).json({ message: "WaveId is required" });
        return;
    }

    const intWaveIt = parseInt(waveId as string);

    const schedules = await getAvailabilitySchedules(intWaveIt);

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

/**
 * @swagger
 * /availability/availabilityDates:
 *   post:
 *     summary: Retorna as datas disponiveis para uma onda
 *     tags: [Availability]
 *     responses:
 *       200:
 *         description: Retorna as datas disponiveis para uma onda
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   WaveId:
 *                     type: number
 *                     description: Id da onda
 *                   WaveTime:
 *                     type: string
 *                     description: Horário da onda
 */
router.post('/availabilityDates', async (req, res) =>{
    const { WaveId, WaveTime } = req.body;

    if(!WaveId || !WaveTime) {
        res.status(400).json({ message: "WaveId and WaveTime is required" });
        return;
    }

    const dates = await getAvailableDates(Number(WaveId.toString()), WaveTime.toString());

    if(dates.length === 0) {
        res.status(200).json({ message: "No dates available" });
    } else {
        res.status(200).json(dates);
    }
});


/**
 * @swagger
 * /availability/scheduleSession:
 *   post:
 *     summary: Agenda a sessão solicitada pelo usuário
 *     tags: [Availability]
 *     responses:
 *       200:
 *         description: Agenda a sessão solicitada pelo usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   WaveId:
 *                     type: number
 *                     description: Id da onda
 *                   WaveTime:
 *                     type: string
 *                     description: Horário da onda
 *                   WaveDate:
 *                     type: string
 *                     description: Data da onda
 */
router.post('/scheduleSession', async (req, res) =>{
    const { WaveId, WaveTime, WaveDate } = req.body;

    if(!WaveId || !WaveTime || !WaveDate) {
        res.status(400).json({ message: "WaveId, WaveTime and WaveDate is required" });
        return;
    }

    const authHeader = req.headers.authorization;

    if(!authHeader) {
        res.status(401).json({ error: 'Token não informado' });
        return;
    }

    const user = await getUserById(
        getUserIdFromJwt(authHeader)
    );

    if(!user) {
        throw new Error('Usuário não encontrado');
    }

    const availabilityId = await getAvailabilityId(Number(WaveId), WaveTime.toString(), WaveDate.toString());
    
    const userLimit = await checkUserLimitForNextMonth(Number(user.UserId));

    if(!userLimit.hasLimit) {
        res.status(200).json({ message: `O usuário já utilizou todas suas sessão do ${userLimit.type}` });
        return;
    }

    if(!availabilityId) {
        res.status(200).json({ message: "Disponibilidade de sessão não encontrada" });
        return;
    }
    
    const haveDayLimit = await checkDayLimit(availabilityId)

    if(!haveDayLimit) {
        res.status(200).json({ message: "Limite de sessões por dia atingido" });
        return;
    }

    const ticketId = Number(await scheduleTicket(Number(user.UserId), Number(user.PersonId), availabilityId));

    res.status(200).json({ message: "Sessão agendada com sucesso", ticketId });
    
    return;
});

export default router;