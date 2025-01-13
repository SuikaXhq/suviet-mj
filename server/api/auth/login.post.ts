import { UserStatus } from "@prisma/client";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    const body = await readBody<{
        name: string;
        password: string;
    }>(event);
    const { name, password } = body;

    const user = await prisma.user.findUnique({
        where: {
            name,
            status: UserStatus.ACTIVE,
        },
    });
    if (user) {
        if (await verifyPassword(user.password, password + user.salt)) {
            await setUserSession(event, {
                user: {
                    id: user.id,
                    name: user.name,
                    level: user.level,
                },
            });
            return {
                statusCode: 200,
                message: "登录成功",
            };
        }
    }
    return {
        statusCode: 400,
        message: "用户名或密码错误",
    };
});
