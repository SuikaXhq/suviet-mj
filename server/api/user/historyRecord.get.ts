import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event);
    if (!session) {
        return {
            statusCode: 401,
            message: "未登录",
            body: [],
        };
    }
    const user = session.user!;
    const records = await prisma.gameRecord.findMany({
        where: {
            playerId: user.id,
            game: {
                isValid: true,
            },
        },
        orderBy: {
            game: {
                time: "desc",
            },
        },
        select: {
            game: {
                include: {
                    GameRecord: {
                        include: {
                            player: true,
                        },
                    },
                },
            },
        },
    });
    return {
        statusCode: 200,
        body: records.map((record) => ({
            id: record.game.id,
            gameType: record.game.type,
            time: record.game.time,
            players: record.game.GameRecord.map((r) => r.player.name),
            scores: record.game.GameRecord.map((r) => r.score),
            positions: record.game.GameRecord.map((r) => r.positionOnStart),
            ranks: record.game.GameRecord.map((r) => r.rank),
        })),
    };
});
