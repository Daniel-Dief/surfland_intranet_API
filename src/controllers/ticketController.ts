import { PrismaClient } from "@prisma/client";
import { accessSync } from "fs";
const prisma = new PrismaClient();

interface ITicket {
    ticketId?: number;
    userId?: number;
    personId?: number;
    availabilityId?: number;
    statusId?: number;
    createdAt?: string;
    updatedAt?: string | null;
    updatedBy?: number | null;
}

async function getTickets(ticket : ITicket) {
    if(!ticket) {
        return prisma.tickets.findMany();
    }

    return prisma.tickets.findMany({
        where: {
            UserId: ticket.userId,
            PersonId: ticket.personId,
            AvailabilityId: ticket.availabilityId,
            StatusId: ticket.statusId,
            CreatedAt: ticket.createdAt,
            UpdatedAt: ticket.updatedAt,
            UpdatedBy: ticket.updatedBy
        }
    });
}

async function getTicketById(ticketId : number) {
    if(!ticketId) {
        throw new Error("TicketId is required");
    }

    return prisma.tickets.findUnique({
        where: {
            TicketId: ticketId
        }
    });
}

async function createTicket(ticket : ITicket) {
    if(!ticket) {
        throw new Error("Ticket is required");
    }

    if(!ticket.userId || !ticket.personId || !ticket.availabilityId) {
        throw new Error("Ticket data is incomplete");
    }

    return prisma.tickets.create({
        data: {
            UserId: ticket.userId,
            PersonId: ticket.personId,
            AvailabilityId: ticket.availabilityId,
            StatusId: ticket.statusId ?? 1,
            CreatedAt: ticket.createdAt ?? new Date().toISOString(),
            UpdatedAt: ticket.updatedAt,
            UpdatedBy: ticket.updatedBy
        }
    });
}

async function updateTicket(ticket : ITicket) {
    if(!ticket) {
        throw new Error("Ticket is required");
    }

    if(!ticket.ticketId) {
        throw new Error("TicketId is required");
    }

    return prisma.tickets.update({
        where: {
            TicketId: ticket.ticketId
        },
        data: {
            UserId: ticket.userId,
            PersonId: ticket.personId,
            AvailabilityId: ticket.availabilityId,
            StatusId: ticket.statusId,
            CreatedAt: ticket.createdAt,
            UpdatedAt: ticket.updatedAt,
            UpdatedBy: ticket.updatedBy
        }
    });
}

async function deleteTicket(ticketId : number) {
    if(!ticketId) {
        throw new Error("TicketId is required");
    }

    return prisma.tickets.delete({
        where: {
            TicketId: ticketId
        }
    });
}

async function getTicketsByUser(userId : number) {
    if(!userId) {
        throw new Error("UserId is required");
    }

    return await prisma.tickets.findMany({
        where: {
          UserId: userId
        },
        select: {
          TicketId: true,
          CreatedAt: true,
          Availability: {
            select: {
              WaveDate: true,
              WaveTime: true,
              Waves: {
                select: {
                  Name: true
                }
              }
            }
          },
          Status: {
            select: {
              Name: true
            }
          }
        }
      });
}

async function scheduleTicket(userId : number, personId : number, availabilityId : number) {
    if(!userId || !personId || !availabilityId) {
        throw new Error("UserId, PersonId and AvailabilityId is required");
    }

    const ticket =  await prisma.tickets.create({
        data: {
            UserId: userId,
            PersonId: personId,
            AvailabilityId: availabilityId,
            StatusId: 1,
            CreatedAt: new Date().toISOString()
        }
    })

    return ticket.TicketId;
}

export {
    getTickets,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
    getTicketsByUser,
    scheduleTicket
}