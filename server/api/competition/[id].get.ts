import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    const competitionId = Number(getRouterParam(event, "id"));

    if (isNaN(competitionId)) {
        return {
            statusCode: 400,
            message: "参数错误",
            body: null,
        };
    }

    const competition = await prisma.competition.findUnique({
        where: {
            id: competitionId,
        },
        include: {
            Competitor: {
                orderBy: {
                    competitionId: "asc",
                },
                include: {
                    player: true,
                },
            },
            Game: {
                orderBy: {
                    time: "desc",
                },
                where: {
                    isValid: true,
                },
                include: {
                    GameRecord: {
                        include: {
                            player: true,
                            CompetitionScoreRecord: true,
                        },
                        orderBy: {
                            rank: "asc",
                        },
                    },
                },
            },
        },
    });

    if (!competition) {
        return {
            statusCode: 404,
            message: "比赛不存在",
            body: null,
        };
    }

    return {
        statusCode: 200,
        message: "获取比赛成功",
        body: {
            id: competition.id,
            name: competition.name,
            type: competition.type,
            time: competition.time,
            schedule: competition.schedule,
            competitors: competition.Competitor.map((c) => c.player.name),
            records: competition.Game.map((r) => ({
                id: r.id,
                gameType: r.type,
                time: r.time,
                players: r.GameRecord.map((r) => r.player.name),
                scores: r.GameRecord.map((r) => r.score),
                ranks: r.GameRecord.map((r) => r.rank),
                positions: r.GameRecord.map((r) => r.positionOnStart),
                points: r.GameRecord.map(
                    (r) => r.CompetitionScoreRecord!.points
                ),
            })),
        },
    };
});
