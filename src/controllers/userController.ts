import { PrismaClient } from "@prisma/client";
import { addMonth, getWeekOfMonth, resetHours } from "../utils/dates";
import { getAccessProfileById } from "./accessProfileController";
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


async function getUserInfo(userId: number) {
    if(!userId) {
        throw new Error("User Id is required");
    }

    return await prisma.users.findUnique({
        where: {
            UserId: userId
        },
        select: {
            UserId: true,
            StatusId: true,
            AccessProfileId: true,
            Persons_Users_PersonIdToPersons: {
                select: {
                    Name: true,
                    Email: true,
                    Phone: true,
                    BirthDate: true,
                    Document: true
                }
            }
        }
    });
}

async function checkUserLimitForNextMonth(userId: number) {
    if(!userId) {
        throw new Error("User Id is required");
    }

    let now = addMonth(new Date(), 1)
    let nextMonth = addMonth(new Date(), 2);
    now = resetHours(now);
    nextMonth = resetHours(nextMonth);
    now.setUTCDate(1);
    nextMonth.setUTCDate(1);

    const ticketsByUser = await prisma.tickets.findMany({
        select: {
            TicketId: true,
            Availability: {
                select: {
                    WaveDate: true
                }
            }
        },
        where: {
            UserId: userId,
            StatusId: {
                in: [1, 2]
            },
            Availability: {
                WaveDate: {
                    gte: now.toISOString(),
                    lte: nextMonth.toISOString()
                }
            }
        }
    })

    type tempTicketType = {
        label: number;
        count: number;
    }

    const ticketsMonth = ticketsByUser.length;
    const ticketsWeek = ticketsByUser
        .map(ticket => getWeekOfMonth(ticket.Availability.WaveDate))
        .map(week => ({ label: week, count: 1 }))
        .reduce((acc : tempTicketType[], curr) => {
            const existing = acc.find(item => item.label === curr.label);
            if (existing) {
                existing.count += curr.count;
            } else {
                acc.push(curr);
            }
            return acc;
        }, [])
        .reduce((max : number, curr : tempTicketType) =>
            Math.max(max, curr.count),
        0);

    const ticketsDay = ticketsByUser
        .map(ticket => ticket.Availability.WaveDate.getDay())
        .map(week => ({ label: week, count: 1 }))
        .reduce((acc : tempTicketType[], curr) => {
            const existing = acc.find(item => item.label === curr.label);
            if (existing) {
                existing.count += curr.count;
            } else {
                acc.push(curr);
            }
            return acc;
        }, [])
        .reduce((max : number, curr : tempTicketType) =>
            Math.max(max, curr.count),
        0);



    const accessProfileId = await getUserById(userId).then(user => Number(user?.AccessProfileId))

    const accessProfileLimits = await getAccessProfileById(accessProfileId).then(profile => ({
        month: profile?.WaveLimitMonth,
        week: profile?.WaveLimitWeek,
        day: profile?.WaveLimitDay
    }));

    if(
        accessProfileLimits.month === undefined ||
        accessProfileLimits.week === undefined ||
        accessProfileLimits.day === undefined
    ) {
        throw new Error("Access Profile limits not found");
    }

    if(ticketsMonth >= accessProfileLimits.month) {
        return {
            hasLimit: false,
            type: "month"
        }
    } else if(ticketsWeek >= accessProfileLimits.week) {
        return {
            hasLimit: false,
            type: "week"
        }
    } else if(ticketsDay >= accessProfileLimits.day) {
        return {
            hasLimit: false,
            type: "day"
        }
    } else {
        return {
            hasLimit: true,
            type: "none"
        }
    }
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
    getUserInfo,
    createUser,
    updatedUser,
    deleteUser,
    checkUserLimitForNextMonth
};