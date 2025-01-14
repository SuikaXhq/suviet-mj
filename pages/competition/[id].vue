<script setup lang="ts">
import { GameType, Position, UserLevel } from '@prisma/client';
import { scheduleMap } from '#shared/schedule';

const { user: currentUser } = useUserSession();

const route = useRoute();
const router = useRouter();
const { data, refresh } = await useFetch(`/api/competition/${route.params.id}`);

if (!data || data.value?.statusCode !== 200) {
    router.push('/404');
}

const errorInfo = ref('');

const schedule = computed(() => {
    if (data.value !== null && data.value.body !== null) {
        return scheduleMap[data.value.body.type][data.value.body.schedule];
    }
})
const playerOrders = computed(() => {
    return schedule.value?.map((idOrder) => idOrder.map((id) => data.value!.body!.competitors[id]));
})
const records = computed(() => {
    if (data.value?.body) {
        return [
            ...data.value?.body.records.map((record) => ({
                ...record,
                points: record.points.map((p) => p / 10),
            })),
        ]
    } else {
        return [];
    }
})

const isSubmitting = ref(false);
async function submitRecord(players: string[], scores: number[], points: number[]) {
    if (isSubmitting.value) return;
    isSubmitting.value = true;
    const data = await $fetch("/api/record", {
        method: "POST",
        body: {
            competition: {
                id: Number(route.params.id),
                points: points.map((p) => Math.round(p * 10)),
            },
            players,
            scores,
            gameType: GameType.ES4,
        },
    })
    if (data.statusCode === 200) {
        refresh();
    } else {
        errorInfo.value = data.message || "记录上传失败";
    }
    isSubmitting.value = false;
}

const recordsWithForms = computed(() => {
    if (!playerOrders.value) {
        return [];
    }

    const result = [];
    for (let i = 0; i < playerOrders.value.length; i++) {
        // 判断是否已经有记录
        let flag = false;
        let recordIndex = -1;
        for (let j = 0; j < records.value.length; j++) {
            for (let k = 0; k < records.value[j].players.length; k++) {
                if (playerOrders.value[i][0] === records.value[j].players[k] && records.value[j].positions[k] === Position.EAST) {
                    flag = true;
                    recordIndex = j;
                    break;
                }
            }
            if (flag) {
                break;
            }
        }
        if (!flag) {
            result.push({
                hasRecord: false,
                playerOrder: playerOrders.value[i],
            });
        } else {
            result.push({
                hasRecord: true,
                record: records.value[recordIndex],
            });
        }
    }
    return result;
})

const rankOfCompetition = computed(() => {
    // 根据已有记录计算累计points，返回{player: string, points: number}[]
    if (!data.value || !data.value.body || data.value.body.records.length === 0) {
        return [];
    }
    const points = data.value.body.records.reduce((acc, record) => {
        record.points.forEach((point, i) => {
            const player = record.players[i];
            if (acc[player] === undefined) {
                acc[player] = 0;
            }
            acc[player] += point;
        });
        return acc;
    }, {} as Record<string, number>);

    // 按points排序
    const sorted = Object.entries(points).sort((a, b) => b[1] - a[1]);

    const result = sorted.map(([player, point], index) => ({
        player,
        point,
        rank: index + 1,
    }));

    // 同分并列
    let lastPoint = sorted[0][1];
    let lastRank = 1;
    sorted.forEach(([_, point], index) => {
        if (point < lastPoint) {
            lastRank = index + 1;
            lastPoint = point;
        }
        result[index].rank = lastRank;
    });

    return result;
})

</script>

<template>
    <BasePage hasParent>
        <template v-slot:header>
            <div class="flex h-full items-center justify-center">
                <div class="text-center font-bold sm:text-4xl">{{ data?.body?.name }}</div>
            </div>
        </template>

        <template v-slot:body>
            <div class="flex flex-col items-center justify-center w-full divide-y-[1px] p-2">
                <div v-if="rankOfCompetition.length > 0" class="sm:p-8 p-4 flex flex-col items-center gap-4">
                    <div
                        class="flex flex-row items-center bg-gray-200 rounded-lg overflow-hidden sm:p-8 p-4 sm:text-3xl text-xl sm:gap-x-8 gap-x-4">
                        <div class="flex flex-col gap-4 items-center">
                            <div class="font-bold">名次</div>
                            <div v-for="(item, index) in rankOfCompetition" :key="index"
                                class="font-bold text-gray-600">{{ item.rank
                                }}</div>
                        </div>
                        <div class="flex flex-col gap-4 items-center">
                            <div class="font-bold">选手</div>
                            <div v-for="(item, index) in rankOfCompetition" :key="index" class="">{{ item.player
                                }}</div>
                        </div>
                        <div class="flex flex-col gap-4 items-center">
                            <div class="font-bold">得点</div>
                            <div v-for="(item, index) in rankOfCompetition" :key="index" :class="Math.abs(item.point
                                - 0) < 1e-3 ? `` : (item.point > 0 ? `text-red-700` : `text-green-700`)">{{
                                    Math.abs(item.point
                                        - 0) < 1e-3 ? '±' : (item.point > 0 ? '＋' : '▲') }}{{
                                    Math.abs(item.point / 10).toFixed(1) }}</div>
                        </div>
                    </div>
                </div>
                <div class="w-full flex flex-col gap-4 items-center pb-8">
                    <div class="text-red-700 text-xl">{{ errorInfo }}</div>
                    <template v-for="(item, index) in recordsWithForms" :key="index">
                        <Record v-if="item.hasRecord" v-bind="item.record!" />
                        <CompetitionRecordInput v-else-if="currentUser.level === UserLevel.admin"
                            :players="item.playerOrder!.slice(0, 4)" @submit="submitRecord" :isSubmitting />
                    </template>
                </div>
            </div>
        </template>
    </BasePage>
</template>