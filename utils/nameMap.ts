import { CompetitionType, GameType, Position } from "@prisma/client";

export const nameMap = {
    [GameType.ES4]: "四人半庄",
    [GameType.ES3]: "三人半庄",
    [GameType.E4]: "四人东风",
    [GameType.E3]: "三人东风",
    [GameType.GB]: "国标",
    [Position.EAST]: "东",
    [Position.SOUTH]: "南",
    [Position.WEST]: "西",
    [Position.NORTH]: "北",
    [Position.NULL]: "无",
    [CompetitionType.FourInFour]: "四人",
    [CompetitionType.FiveInFive]: "五人",
};
