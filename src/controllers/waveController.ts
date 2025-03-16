import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface IWave {
    waveId?: number;
    name?: string;
    statusId?: number;
}

async function getWaves(wave : IWave) {
    if(!wave) {
        return prisma.waves.findMany();
    }

    return prisma.waves.findMany({
        where: {
            Name: {
                contains: wave.name
            },
            StatusId: wave.statusId
        }
    });
}

async function getWaveById(waveId : number) {
    if(!waveId) {
        throw new Error("WaveId is required");
    }

    return prisma.waves.findUnique({
        where: {
            WaveId: waveId
        }
    });
}

async function createWave(wave : IWave) {
    if(!wave) {
        throw new Error("Wave is required");
    }

    if(!wave.name) {
        throw new Error("Wave name is required");
    }

    return prisma.waves.create({
        data: {
            Name: wave.name,
            StatusId: wave.statusId ?? 1
        }
    });
}

async function updateWave(wave : IWave) {
    if(!wave) {
        throw new Error("Wave is required");
    }

    if(!wave.waveId) {
        throw new Error("WaveId is required");
    }

    return prisma.waves.update({
        where: {
            WaveId: wave.waveId
        },
        data: {
            Name: wave.name,
            StatusId: wave.statusId
        }
    });
}

async function deleteWave(waveId : number) {
    if(!waveId) {
        throw new Error("WaveId is required");
    }

    return prisma.waves.delete({
        where: {
            WaveId: waveId
        }
    });
}

export {
    getWaves,
    getWaveById,
    createWave,
    updateWave,
    deleteWave
}