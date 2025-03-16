import { PrismaClient } from "@prisma/client";
import { get } from "http";
const prisma = new PrismaClient();

interface IFunction {
    functionId?: number;
    name?: string;
    statusId?: number;
}

async function getFunctions(param_function : IFunction) {
    if(!param_function) {
        return await prisma.functions.findMany();
    }

    return await prisma.functions.findMany({
        where: {
            FunctionId: param_function.functionId,
            Name: param_function.name,
            StatusId: param_function.statusId
        }
    });
}

async function getFunctionById(functionId: number) {
    if(!functionId) {
        throw new Error("Function ID is required");
    }

    return await prisma.functions.findUnique({
        where: {
            FunctionId: functionId
        }
    });
}

async function createFunction(param_function: IFunction) {
    if(!param_function) {
        throw new Error("Function data is required");
    }

    if(!param_function.name) {
        throw new Error("Function name is required");
    }

    return await prisma.functions.create({
        data: {
            Name: param_function.name,
            StatusId: param_function.statusId ?? 1
        }
    });
}

async function updateFunction(param_function: IFunction) {
    if(!param_function) {
        throw new Error("Function data is required");
    }

    if(!param_function.functionId) {
        throw new Error("Function ID is required");
    }

    return await prisma.functions.update({
        where: {
            FunctionId: param_function.functionId
        },
        data: {
            Name: param_function.name,
            StatusId: param_function.statusId
        }
    });
}

async function deleteFunction(functionId: number) {
    if(!functionId) {
        throw new Error("Function ID is required");
    }

    return await prisma.functions.delete({
        where: {
            FunctionId: functionId
        }
    });
}

async function getFunctionsByAccessProfileId(accessProfileId: number) {
    if(!accessProfileId) {
        throw new Error("Access Profile ID is required");
    }

    return await prisma.functions.findMany({
        where: {
            Permissions: {
                some: {
                     AccessProfileId: accessProfileId
                }
            }
        },
        select: {
            FunctionId: true,
            Name: true
        }
    });
}

export {
    getFunctions,
    getFunctionById,
    createFunction,
    updateFunction,
    deleteFunction,
    getFunctionsByAccessProfileId
}