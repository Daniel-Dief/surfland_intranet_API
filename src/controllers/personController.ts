import { PrismaClient } from "@prisma/client";
import validateDocument from "../utils/validateDocument";
const prisma = new PrismaClient();

interface IPerson {
    personId?: number;
    name?: string;
    document?: string;
    birthDate?: string;
    email?: string;
    phone?: string;
    foreigner?: boolean;
}

async function getPersons(personFilter ?: IPerson) {
    if(!personFilter) {
        return await prisma.persons.findMany();
    }

    return await prisma.persons.findMany({
        where: {
            PersonId: personFilter.personId,
            Name: personFilter.name,
            Document: personFilter.document,
            BirthDate: personFilter.birthDate,
            Email: personFilter.email,
            Phone: personFilter.phone,
            Foreigner: personFilter.foreigner
        }
    });
}

async function getPersonById(personId: number) {
    if(!personId) {
        throw new Error("Person ID is required");
    }

    return await prisma.persons.findUnique({
        where: {
            PersonId: personId
        }
    });
}

async function createPerson(person: IPerson) {
    if(!person) {
        throw new Error("Person data is required");
    }

    if(!person.document || !person.name) {
        throw new Error("Person data is incomplete");
    }

    if(!validateDocument(person.document)) {
        throw new Error("Invalid document");
    }

    return await prisma.persons.create({
        data: {
            Name: person.name,
            Document: person.document,
            BirthDate: person.birthDate ?? "2000-01-01",
            Email: person.email ?? "exemple@exemple.com",
            Phone: person.phone ?? "55",
            Foreigner: person.foreigner ?? false
        }
    });
}

async function updatePerson(person : IPerson) {
    if(!person.personId) {
        throw new Error("Person ID is required");
    }

    if(!person.document || !person.name) {
        throw new Error("Person data is incomplete");
    }

    if(!validateDocument(person.document)) {
        throw new Error("Invalid document");
    }

    return await prisma.persons.update({
        where: {
            PersonId: person.personId
        },
        data: {
            Name: person.name,
            Document: person.document,
            BirthDate: person.birthDate,
            Email: person.email,
            Phone: person.phone,
            Foreigner: person.foreigner
        }
    })
}

async function deletePerson(personId : number) {
    if(!personId) {
        throw new Error("Person ID is required");
    }

    return await prisma.persons.delete({
        where: {
            PersonId: personId
        }
    });
}


export {
    getPersons,
    getPersonById,
    createPerson,
    updatePerson,
    deletePerson
}