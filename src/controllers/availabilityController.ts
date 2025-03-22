import { PrismaClient } from "@prisma/client";
import { availabilitiesScheduleType } from "../@types/forControllers/availabilitie";
import { addMonth, resetHours } from "../utils/dates";
const prisma = new PrismaClient();

interface IAvailability {
    availabilityId?: number;
    waveId?: number;
    statusId?: number;
    waveDate?: string;
    waveTime?: string;
    amount?: number;
    createdBy?: number;
    createdAt?: string;
}

async function getAvailabilities(availability : IAvailability) {
    if(!availability) {
        return await prisma.availability.findMany();
    }

    return await prisma.availability.findMany({
        where: {
            AvailabilityId: availability.availabilityId,
            WaveId: availability.waveId,
            StatusId: availability.statusId,
            WaveDate: availability.waveDate,
            WaveTime: availability.waveTime,
            Amount: availability.amount,
            CreatedBy: availability.createdBy,
            CreatedAt: availability.createdAt
        }
    });
}

async function getAvailabilitieById(availabilityId: number) {
    if(!availabilityId) {
        throw new Error("availabilityId is required");
    }

    return await prisma.availability.findUnique({
        where: {
            AvailabilityId: availabilityId
        }
    });
}

async function createAvailability(availability : IAvailability) {
    if(!availability) {
        throw new Error("availability is required");
    }

    if(!availability.waveId || !availability.waveDate || !availability.waveTime || !availability.amount || !availability.createdBy) {
        throw new Error("Availability data is incomplete");
    }

    return await prisma.availability.create({
        data: {
            WaveId: availability.waveId,
            StatusId: availability.statusId ?? 1,
            WaveDate: availability.waveDate,
            WaveTime: availability.waveTime,
            Amount: availability.amount,
            CreatedBy: availability.createdBy,
            CreatedAt: availability.createdAt ?? new Date().toISOString()
        }
    });
}

async function updateAvailability(availability : IAvailability) {
    if(!availability) {
        throw new Error("availability is required");
    }

    if(!availability.availabilityId) {
        throw new Error("availabilityId is required");
    }

    return await prisma.availability.update({
        where: {
            AvailabilityId: availability.availabilityId
        },
        data: {
            WaveId: availability.waveId,
            StatusId: availability.statusId,
            WaveDate: availability.waveDate,
            WaveTime: availability.waveTime,
            Amount: availability.amount,
            CreatedBy: availability.createdBy,
            CreatedAt: availability.createdAt
        }
    });
}

async function deleteAvailability(availabilityId: number) {
    if(!availabilityId) {
        throw new Error("availabilityId is required");
    }

    return await prisma.availability.delete({
        where: {
            AvailabilityId: availabilityId
        }
    });
}

async function getAvailableShedules(waveId : number) {
    if(!waveId) {
        throw new Error("waveId is required");
    }

    let now = addMonth(new Date(), 1)
    let nextMonth = addMonth(new Date(), 2);
    now = resetHours(now);
    nextMonth = resetHours(nextMonth);
    now.setUTCDate(1);
    nextMonth.setUTCDate(1);

    const availabilities = await prisma.availability.findMany({
        where: {
            WaveId: waveId,
            StatusId: 1,
            WaveDate: {
                gte: now.toISOString(),
                lte: nextMonth.toISOString(),
            },
        },
        select: {
            WaveTime: true,
            Amount: true,
            AvailabilityId: true,
            Tickets: {
                where: {
                    StatusId: {
                        in: [1, 2],
                    },
                },
                select: {
                    TicketId: true,
                },
            },
        },
        orderBy: {
            WaveTime: 'asc'
        },
    });

    const groupedResult = availabilities.reduce<Record<string, availabilitiesScheduleType>>((acc, curr) => {
        const key = `${curr.WaveTime}-${curr.Amount}-${curr.AvailabilityId}`;
        if (!acc[key]) {
            acc[key] = {
                WaveTime: curr.WaveTime,
                Amount: Number(curr.Amount),
                AvailabilityId: Number(curr.AvailabilityId),
                TicketCount: 0,
            };
        }
        acc[key].TicketCount += curr.Tickets.length;
        return acc;
    }, {});

    const filteredResult = Object
        .values(groupedResult)
        .filter((item) => item.TicketCount < item.Amount)
        .map(({ Amount, TicketCount, ...rest}) => rest);

    return filteredResult;
}

async function getAvailableWaves() {
    let now = addMonth(new Date(), 1)
    let nextMonth = addMonth(new Date(), 2);
    now = resetHours(now);
    nextMonth = resetHours(nextMonth);
    now.setUTCDate(1);
    nextMonth.setUTCDate(1);

    const availabilities = await prisma.availability.findMany({
        select: {
            Waves: {
                select: {
                    WaveId: true,
                    Name: true,
                }
            }
        },
        where: {
            StatusId: 1,
            WaveDate: {
                gte: now.toISOString(),
                lte: nextMonth.toISOString(),
            },
        },
        distinct: ['WaveId']
    })

    const waves = availabilities.map((item) => ({
        WaveId: Number(item.Waves.WaveId),
        Name: item.Waves.Name
    }));

    return waves;
}

export {
    getAvailabilities,
    getAvailabilitieById,
    createAvailability,
    updateAvailability,
    deleteAvailability,
    getAvailableShedules,
    getAvailableWaves
}