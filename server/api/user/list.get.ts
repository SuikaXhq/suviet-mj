import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event);
    if (!session) {
        return {
            statusCode: 401,
            message: "未登录",
            data: [],
        };
    }

    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            level: true,
        },
    });

    return {
        statusCode: 200,
        data: users,
    };
});
