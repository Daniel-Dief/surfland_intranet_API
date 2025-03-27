import { Router } from 'express';
import { getTicketsByUser, cancelTicketById } from '../controllers/ticketController';
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

/**
 * @swagger
 * /tickets/cancelTicket:
 *   post:
 *     summary: Cancela um ticket
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: Cancela um ticket
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   TicketId:
 *                      type: string
 *                      description: Id do ticket
 *                   
 */
router.post('/cancelTicket', async (req, res) =>{
    const { TicketId } = req.body;

    if(!TicketId) {
        res.status(400).json({ error: 'TicketId não informado' });
        return;
    }

    const result = await cancelTicketById(Number(TicketId));

    if(!result) {
        res.status(200).json({
            message: 'Erro ao alterar o Ticket',
            ticketId: Number(TicketId)
        });
        return;
    } else {
        res.status(200).json({
            message: 'Ticket cancelado com sucesso',
            ticketId: Number(TicketId)
        });
        return;
    }
});

export default router;