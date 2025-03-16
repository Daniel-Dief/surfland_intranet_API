import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface IUser {
    userId?: number;
    login?: string;
    password?: string;
    accessProfileId?: number;
    statusId?: number;
    temporaryPassword?: string;
    personId?: number;
    updatedAt?: string;
    updatedBy?: number;
}

async function getUsers(userFilter ?: IUser) {
    if(!userFilter) {
        return await prisma.users.findMany();
    }

    return await prisma.users.findMany({
        where: {
            UserId: userFilter.userId,
            Login: userFilter.login,
            Password: userFilter.password,
            AccessProfileId: userFilter.accessProfileId,
            StatusId: userFilter.statusId,
            TemporaryPassword: userFilter.temporaryPassword,
            PersonId: userFilter.personId,
            UpdatedAt: userFilter.updatedAt,
            UpdatedBy: userFilter.updatedBy
        }
    });
}

async function getUserById(userId: number) {
    if(!userId) {
        throw new Error("User Id is required");
    }

    return await prisma.users.findUnique({
        where: {
            UserId: userId
        }
    });
}

async function createUser(user: IUser) {
    if(!user) {
        throw new Error("User data is required");
    }
    if(!user.login || !user.personId) {
        throw new Error("User data is incomplete");
    }

    return await prisma.users.create({
        data: {
            Login: user.login,
            Password: user.password ?? "Surfland@2025",
            AccessProfileId: user.accessProfileId ?? 16,
            StatusId: user.statusId ?? 1,
            TemporaryPassword: user.temporaryPassword,
            PersonId: user.personId,
            UpdatedAt: user.updatedAt,
            UpdatedBy: user.updatedBy,
        }
    });
}

async function updatedUser(user: IUser) {
    if(!user) {
        throw new Error("User data is required");
    }

    if(!user.userId) {
        throw new Error("User Id is required");
    }

    return await prisma.users.update({
        where: {
            UserId: user.userId
        },
        data: {
            Login: user.login,
            Password: user.password,
            AccessProfileId: user.accessProfileId,
            StatusId: user.statusId,
            TemporaryPassword: user.temporaryPassword,
            PersonId: user.personId,
            UpdatedAt: user.updatedAt,
            UpdatedBy: user.updatedBy,
        }
    });
}

async function deleteUser(userId: number) {
    if(!userId) {
        throw new Error("User Id is required");
    }

    return await prisma.users.delete({
        where: {
            UserId: userId
        }
    });
}

export {
    getUsers,
    getUserById,
    createUser,
    updatedUser,
    deleteUser
};