import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface Permission {
    permissionId?: number;
    accessProfileId?: number;
    functionId?: number;
}

async function getPermissions(permission: Permission) {
    if(!permission) {
        return await prisma.permissions.findMany();
    }

    return await prisma.permissions.findMany({
        where: {
            PermissionId: permission.permissionId,
            AccessProfileId: permission.accessProfileId,
            FunctionId: permission.functionId
        }
    });
}

async function getPermissionById(permissionId: number) {
    if(!permissionId) {
        throw new Error("PermissionId is required");
    }

    return await prisma.permissions.findUnique({
        where: {
            PermissionId: permissionId
        }
    });
}

async function createPermission(permission: Permission) {
    if(!permission) {
        throw new Error("Permission is required");
    }

    if(!permission.accessProfileId || !permission.functionId) {
        throw new Error("Permission data is incomplete");
    }

    return await prisma.permissions.create({
        data: {
            AccessProfileId: permission.accessProfileId,
            FunctionId: permission.functionId
        }
    });
}

async function updatePermission(permission: Permission) {
    if(!permission) {
        throw new Error("Permission is required");
    }

    if(!permission.permissionId) {
        throw new Error("PermissionId is required");
    }

    return await prisma.permissions.update({
        where: {
            PermissionId: permission.permissionId
        },
        data: {
            AccessProfileId: permission.accessProfileId,
            FunctionId: permission.functionId
        }
    });
}

async function deletePermission(permissionId: number) {
    if(!permissionId) {
        throw new Error("PermissionId is required");
    }

    return await prisma.permissions.delete({
        where: {
            PermissionId: permissionId
        }
    });
}

export {
    getPermissions,
    getPermissionById,
    createPermission,
    updatePermission,
    deletePermission
}