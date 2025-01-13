import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    const body = await readBody<{
        name: string;
        password: string;
        token: string;
    }>(event);
    const { name, password, token } = body;

    // check name redundant
    const userCheck = await prisma.user.findUnique({
        where: {
            name,
        },
    });
    if (userCheck) {
        return {
            statusCode: 400,
            message: "名称重复",
        };
    }

    // check token
    if (token !== useRuntimeConfig().registerToken) {
        return {
            statusCode: 400,
            message: "注册Token错误",
        };
    }

    // generate salt
    const salt = Math.random().toString(36).slice(-10);
    const passwordHash = await hashPassword(password + salt);
    // console.log(password + salt);
    await prisma.user.create({
        data: {
            name,
            password: passwordHash,
            salt
        },
    });

    return {
        statusCode: 200,
        message: "注册成功",
    };
});
