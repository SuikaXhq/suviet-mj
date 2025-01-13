import { CompetitionType, UserLevel } from "@prisma/client";
import prisma from "~/lib/prisma";
import { scheduleMap } from "#shared/schedule";
import shuffleArray from "#shared/utils/shuffle";

export default defineEventHandler(async (event) => {
    const body = await readBody<{
        name: string;
        players: string[];
        competitionType: CompetitionType;
    }>(event);

    const session = await getUserSession(event);
    if (!session || session.user?.level !== UserLevel.admin) {
        return {
            statusCode: 401,
            message: "用户未登录或权限不足",
            body: null,
        };
    }

    // check name redundant
    const competitionCheck = await prisma.competition.findFirst({
        where: {
            name: body.name,
            isValid: true,
        },
    });
    if (body.name === "" || competitionCheck) {
        return {
            statusCode: 400,
            message: "名称重复",
            body: null,
        };
    }

    // check player number
    if (
        (body.competitionType === CompetitionType.FourInFour &&
            body.players.length !== 4) ||
        (body.competitionType === CompetitionType.FiveInFive &&
            body.players.length !== 5)
    ) {
        return {
            statusCode: 400,
            message: "选手数量错误",
            body: null,
        };
    }

    // check players
    const players = await prisma.user.findMany({
        where: {
            name: {
                in: body.players,
            },
        },
    });

    if (players.length !== body.players.length) {
        return {
            statusCode: 400,
            message: "选手不存在",
            body: null,
        };
    }

    // create competition
    const schedule = Math.floor(
        Math.random() * scheduleMap[body.competitionType].length
    );
    const competition = await prisma.competition.create({
        data: {
            name: body.name,
            type: body.competitionType,
            schedule,
        },
    });

    // arrange competitor IDs
    // random shuffle
    shuffleArray(players);
    const competitors = await prisma.competitor.createMany({
        data: players.map((player, index) => ({
            competitionId: competition.id,
            playerId: player.id,
            competitorId: index,
        })),
    });

    return {
        statusCode: 200,
        message: "比赛创建成功",
        body: competition.id,
    };
});
