import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface IAccessProfile {
    accessProfileId?: number;
    name?: string;
    waveLimitMonth?: number;
    waveLimitWeek?: number;
    waveLimitDay?: number;
    statusId?: number;
}

async function getAccessProfiles(accessProfile : IAccessProfile) {
    if(!accessProfile) {
        return await prisma.accessProfiles.findMany();
    }

    return await prisma.accessProfiles.findMany({
        where: {
            AccessProfileId: accessProfile.accessProfileId,
            Name: accessProfile.name,
            WaveLimitMonth: accessProfile.waveLimitMonth,
            WaveLimitWeek: accessProfile.waveLimitWeek,
            WaveLimitDay: accessProfile.waveLimitDay,
            StatusId: accessProfile.statusId
        }
    });
}

async function getAccessProfileById(accessProfileId: number) {
    if(!accessProfileId) {
        throw new Error("accessProfileId is required");
    }

    return await prisma.accessProfiles.findUnique({
        where: {
            AccessProfileId: accessProfileId
        }
    });
}

async function createAccessProfile(accessProfile : IAccessProfile) {
    if(!accessProfile) {
        throw new Error("accessProfile is required");
    }

    if(!accessProfile.name) {
        throw new Error("AccessProfile data is incomplete");
    }

    return await prisma.accessProfiles.create({
        data: {
            Name: accessProfile.name,
            WaveLimitMonth: accessProfile.waveLimitMonth ?? 1,
            WaveLimitWeek: accessProfile.waveLimitWeek ?? 1,
            WaveLimitDay: accessProfile.waveLimitDay ?? 1,
            StatusId: accessProfile.statusId ?? 1
        }
    });
}

async function updateAccessProfile(accessProfile : IAccessProfile) {
    if(!accessProfile) {
        throw new Error("accessProfile is required");
    }

    if(!accessProfile.accessProfileId) {
        throw new Error("accessProfileId is required");
    }

    return await prisma.accessProfiles.update({
        where: {
            AccessProfileId: accessProfile.accessProfileId
        },
        data: {
            Name: accessProfile.name,
            WaveLimitMonth: accessProfile.waveLimitMonth,
            WaveLimitWeek: accessProfile.waveLimitWeek,
            WaveLimitDay: accessProfile.waveLimitDay,
            StatusId: accessProfile.statusId
        }
    });
}

async function deleteAccessProfile(accessProfileId: number) {
    if(!accessProfileId) {
        throw new Error("accessProfileId is required");
    }

    return await prisma.accessProfiles.delete({
        where: {
            AccessProfileId: accessProfileId
        }
    });
}

export {
    getAccessProfiles,
    getAccessProfileById,
    createAccessProfile,
    updateAccessProfile,
    deleteAccessProfile
}