import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface IStatus {
    statusId?: number;
    name?: string;
}

async function getStatus(status : IStatus) {
    if(!status) {
        return await prisma.status.findMany();
    }

    return await prisma.status.findUnique({
        where: {
            StatusId: status.statusId,
            Name: status.name
        }
    });
}

async function getStatusById(statusId : number) {
    if(!statusId) {
        throw new Error("StatusId is required");
    }

    return await prisma.status.findUnique({
        where: {
            StatusId: statusId
        }
    })
}

async function createStatus(status : IStatus) {
    if(!status) {
        throw new Error("Status is required");
    }

    if(!status.name) {
        throw new Error("Name is required");
    }

    return await prisma.status.create({
        data: {
            Name: status.name
        }
    });
}

async function updateStatus(status : IStatus) {
    if(!status) {
        throw new Error("Status is required");
    }

    if(!status.statusId) {
        throw new Error("StatusId is required");
    }

    return await prisma.status.update({
        where: {
            StatusId: status.statusId
        },
        data: {
            Name: status.name
        }
    });
}

async function deleteStatus(statusId : number) {
    if(!statusId) {
        throw new Error("StatusId is required");
    }

    return await prisma.status.delete({
        where: {
            StatusId: statusId
        }
    });
}

export {
    getStatus,
    getStatusById,
    createStatus,
    updateStatus,
    deleteStatus
}