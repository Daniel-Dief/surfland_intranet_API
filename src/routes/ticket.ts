import { Router } from 'express';
import { getTicketsByUser } from '../controllers/ticketController';
import getUserIdFromJwt from '../utils/userIdFromJwt'

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
 */
router.get('/myTickets', async (req, res) =>{
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        res.status(401).json({ error: 'Token não informado' });
        return;
    }

    const userId = getUserIdFromJwt(authHeader)

    const myTickets = (await getTicketsByUser(userId)).map(ticket => {
        return {
            TicketId: ticket.TicketId.toString(),
            Wave: ticket.Availability.Waves.Name,
            WaveDate: ticket.Availability.WaveDate,
            WaveTime: ticket.Availability.WaveTime,
            CreatedAt: ticket.CreatedAt,
            Status: ticket.Status.Name
        }
    });

    res.status(200).json(myTickets);
});

export default router;