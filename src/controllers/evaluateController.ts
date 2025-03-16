import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface IEvaluate {
    id?: number;
    body?: string;
}

async function getEvaluates(evaluate: IEvaluate) {
    if(!evaluate) {
        return await prisma.evaluate.findMany();
    }

    return await prisma.evaluate.findMany({
        where: {
            Id: evaluate.id,
            body: evaluate.body
        }
    });
}

async function getEvaluateById(evaluateId: number) {
    if(!evaluateId) {
        throw new Error("evaluateId is required");
    }

    return await prisma.evaluate.findUnique({
        where: {
            Id: evaluateId
        }
    });
}

async function createEvaluate(evaluate: IEvaluate) {
    if(!evaluate) {
        throw new Error("evaluate is required");
    }

    if(!evaluate.body) {
        throw new Error("evaluate body is required");
    }

    return await prisma.evaluate.create({
        data: {
            body: evaluate.body
        }
    });
}

async function updateEvaluate(evaluate: IEvaluate) {
    if(!evaluate) {
        throw new Error("evaluate is required");
    }

    if(!evaluate.id || !evaluate.body) {
        throw new Error("evaluate data is imcomplete");
    }

    return await prisma.evaluate.update({
        where: {
            Id: evaluate.id
        },
        data: {
            body: evaluate.body
        }
    });
}

async function deleteEvaluate(evaluateId: number) {
    if(!evaluateId) {
        throw new Error("evaluateId is required");
    }

    return await prisma.evaluate.delete({
        where: {
            Id: evaluateId
        }
    });
}

export {
    getEvaluates,
    getEvaluateById,
    createEvaluate,
    updateEvaluate,
    deleteEvaluate
}