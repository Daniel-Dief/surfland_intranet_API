import { PrismaClient } from "@prisma/client";
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

export {
    getAvailabilities,
    getAvailabilitieById,
    createAvailability,
    updateAvailability,
    deleteAvailability
}