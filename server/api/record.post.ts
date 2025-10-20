import { GameType, Position, UserLevel } from "@prisma/client";
import prisma from "~/lib/prisma";
import argsort from "#shared/utils/argsort";

const positionList: Position[] = [
    Position.EAST,
    Position.SOUTH,
    Position.WEST,
    Position.NORTH,
];

export default defineEventHandler(async (event) => {
    const body = await readBody<{
        id?: number;
        gameType: GameType;
        players: string[];
        scores: number[];
        competition?: {
            id: number;
            points: number[];
        };
        isToDelete?: boolean;
    }>(event);

    const session = await getUserSession(event);
    if (!session) {
        return {
            statusCode: 401,
            message: "未登录",
        };
    }

    // handle delete
    if (body.id && body.isToDelete) {
        if (session.user!.level !== UserLevel.admin) {
            return {
                statusCode: 403,
                message: "无权限删除记录",
            };
        }
        const record = await prisma.game.update({
            where: {
                id: body.id,
            },
            data: {
                isValid: false,
            },
        });
        return {
            statusCode: 200,
            message: "记录删除成功",
        };
    }

    // check players valid
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
            message: `玩家${body.players.filter(
                (player) => !players.find((p) => p.name === player)
            )}不存在`,
        };
    }
    if (
        session.user!.level !== UserLevel.admin &&
        !players.find((p) => p.id === session.user!.id)
    ) {
        return {
            statusCode: 402,
            message: "不能上传他人对局",
        };
    }

    // compute rank, tie-break by position
    const rank = argsort(
        body.scores.map((value, index) => value - (index + 1) / 10),
        true
    );

    // handle edit
    if (body.id && !body.isToDelete) {
        if (session.user!.level !== UserLevel.admin) {
            return {
                statusCode: 403,
                message: "无权限修改记录",
            };
        }
        await Promise.all(
            body.players.map((player, index) => {
                return prisma.gameRecord.update({
                    where: {
                        gameId_playerId: {
                            gameId: body.id!,
                            playerId: players.find((p) => p.name === player)!.id,
                        },
                    },
                    data: {
                        score: body.scores[index],
                        rank: rank.indexOf(index) + 1,
                    },
                });
            })
        );
        return {
            statusCode: 200,
            message: "记录修改成功",
        };
    }

    // save record
    const game = await prisma.game.create({
        data: {
            type: body.gameType,
        },
    });
    const records = await prisma.gameRecord.createManyAndReturn({
        data: rank.map((index, rank) => ({
            gameId: game.id,
            playerId: players.find((p) => p.name === body.players[index])!.id,
            positionOnStart: positionList[index],
            score: body.scores[index],
            rank: rank + 1,
        })),
    });
    if (body.competition) {
        await prisma.competition.update({
            where: {
                id: body.competition.id,
            },
            data: {
                Game: {
                    connect: {
                        id: game.id,
                    },
                },
            },
        });
        await prisma.competitionScoreRecord.createMany({
            data: records.map((record, index) => ({
                gameId: game.id,
                playerId: record.playerId,
                points: body.competition!.points[rank[index]],
            })),
        });
    }
    return {
        statusCode: 200,
        message: "记录上传成功",
    };
});
