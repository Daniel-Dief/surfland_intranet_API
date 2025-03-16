import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface ILog {
    logId?: number;
    userId?: number;
    changedAt?: string;
    oldJSON?: string;
    newJSON?: string;
}

async function getLogs(log : ILog) {
    if(!log) {
        return await prisma.logs.findMany();
    }

    return await prisma.logs.findMany({
        where: {
            LogId: log.logId,
            UserId: log.userId,
            ChangedAt: log.changedAt,
            OldJSON: log.oldJSON,
            NewJSON: log.newJSON
        }
    });
}

async function getLogById(logId: number) {
    if(!logId) {
        throw new Error("LogId is required");
    }

    return await prisma.logs.findUnique({
        where: {
            LogId: logId
        }
    });
}

async function createLog(log: ILog) {
    if(!log) {
        throw new Error("Log is required");
    }

    if(!log.userId || !log.oldJSON || !log.newJSON) {
        throw new Error("Log data is incomplete");
    }

    return await prisma.logs.create({
        data: {
            UserId: log.userId,
            ChangedAt: log.changedAt ?? new Date().toISOString(),
            OldJSON: log.oldJSON,
            NewJSON: log.newJSON
        }
    });
}

export {
    getLogs,
    getLogById,
    createLog
}