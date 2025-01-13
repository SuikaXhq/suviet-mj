import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    const competitions = await prisma.competition.findMany({
        select: {
            id: true,
            name: true,
            time: true,
        },
        where: {
            isValid: true,
        },
        orderBy: {
            time: "desc",
        },
    });

    return {
        statusCode: 200,
        body: competitions,
    };
});
