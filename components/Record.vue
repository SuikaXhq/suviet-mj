<script setup lang="ts">
import type { GameType, Position } from '@prisma/client';

const { user: currentUser } = useUserSession();

const props = defineProps<{
    gameType: GameType;
    positions: Position[];
    players: string[];
    scores: number[];
    ranks: number[];
    time: string;
    points?: number[];
}>();

const records = computed(() => {
    return props.ranks.map((rank, i) => ({
        player: props.players[i],
        score: props.scores[i],
        position: props.positions[i],
        rank: props.ranks[i],
        point: props.points?.[i],
    })).sort((a, b) => a.rank - b.rank);
})
</script>

<template>
    <div class="flex flex-col w-full">
        <div class="flex flex-row sm:px-4 items-center justify-between w-full sm:text-2xl text-base text-gray-400">
            <div>{{ nameMap[gameType] }}</div>
            <div class="">{{ new Date(time).toLocaleString() }}</div>
        </div>
        <div
            class="sm:rounded-3xl rounded-xl sm:px-2 w-full flex flex-row items-center justify-center sm:gap-2 gap-1">
            <div v-for="item in records" :key="item.player"
                class="rounded-xl sm:py-4 sm:max-h-28 max-h-24 flex flex-col flex-1 items-center justify-center gap-1 py-1"
                :class="currentUser?.name === item.player ? `bg-blue-100` : `bg-gray-200`">
                <div class="flex flex-row sm:gap-2 gap-1 justify-center items-baseline sm:px-4 px-1">
                    <div class="xl:text-3xl sm:text-2xl text-base text-gray-600">{{ nameMap[item.position] }}</div>
                    <div class="sm:text-2xl text-base sm:font-bold truncate text-center max-w-[75%]"
                        :title="item.player">
                        {{ item.player }}
                    </div>
                </div>
                <div class="flex flex-row items-baseline justify-center flex-wrap">
                    <div class="sm:text-4xl text-lg inline-block">{{ item.score }}</div>
                    <div v-if="item.score !== 0" class="sm:text-3xl text-base inline-block">00</div>
                    <div v-if="item.point !== undefined" class="sm:text-xl text-xs inline-block sm:ml-2">
                        ({{ Math.abs(item.point - 0) < 1e-3 ? '±' : (item.point > 0 ? '＋' : '▲') }}{{
                            Math.abs(item.point).toFixed(1) }})
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>