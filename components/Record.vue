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
        <div class="flex flex-row px-4 items-center justify-between w-full text-2xl text-gray-400">
            <div>{{ nameMap[gameType] }}</div>
            <div class="">{{ new Date(time).toLocaleString() }}</div>
        </div>
        <div class="rounded-3xl px-2 w-full h-32 flex flex-row items-center justify-center gap-2">
            <div v-for="item in records" :key="item.player"
                class="rounded-xl p-4 flex-1 h-28  flex flex-col items-center justify-between gap-2"
                :class="currentUser?.name === item.player ? `bg-blue-100` : `bg-gray-200`">
                <div class="flex flex-row gap-2 justify-center items-center w-full">
                    <div class="text-3xl text-gray-600">{{ nameMap[item.position] }}</div>
                    <div class="text-2xl font-bold truncate text-center max-w-[75%]" :title="item.player">
                        {{ item.player }}
                    </div>
                </div>
                <div>
                    <div class="text-4xl inline-block">{{ item.score }}</div>
                    <div v-if="item.score !== 0" class="text-3xl inline-block">00</div>
                    <div v-if="item.point !== undefined" class="text-xl inline-block ml-2">
                        ({{ Math.abs(item.point - 0) < 1e-3 ? '±' : (item.point > 0 ? '＋' : '▲') }}{{
                            Math.abs(item.point).toFixed(1) }})
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>