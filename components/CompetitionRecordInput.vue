<script setup lang="ts">
import { GameType, Position } from '@prisma/client';
import argsort from '#shared/utils/argsort';

const props = withDefaults(defineProps<{
    gameType?: GameType;
    players: string[]; // 东南西北
}>(), {
    gameType: GameType.ES4,
});
const scores = ref([NaN, NaN, NaN, NaN]);
const points = ref([NaN, NaN, NaN, NaN]);

const positions = [Position.EAST, Position.SOUTH, Position.WEST, Position.NORTH];

const emit = defineEmits<{
    (e: 'update'): void;
    (e: 'submit', players: string[], scores: number[], points: number[]): void;
}>();

function calculatePoints() {
    const rank = argsort(scores.value.map((s, i) => s - i / 10), true);
    const orderPoints = [500, 100, -100, -300];
    for (let i = 0; i < 4; i++) {
        points.value[rank[i]] = Math.round(orderPoints[i] + (scores.value[rank[i]]) - 300) / 10;
    }
}
</script>

<template>
    <div class="flex flex-col w-full">
        <div class="flex flex-row px-4 items-center justify-between w-full text-xl text-gray-400">
            <div>{{ nameMap[gameType] }}</div>
        </div>
        <form class="rounded-3xl px-2 w-full flex flex-row items-center justify-center gap-2"
            @submit.prevent="$emit('submit', players, scores, points)">
            <div v-for="(player, index) in players" :key="index"
                class="rounded-xl p-2 flex-auto h-28 flex flex-row items-center justify-center gap-2 bg-gray-200">
                <div class="flex flex-col items-center justify-center gap-2">
                    <div class="text-3xl font-bold">{{ nameMap[positions[index]] }}</div>
                    <input v-model="points[index]" type="number" step="0.1" placeholder="精算" required
                        class="w-[70px] h-8 text-xl text-right rounded-lg" @update="$emit('update')" />
                </div>
                <div class="flex flex-col gap-2 justify-center items-center min-w-24">
                    <div class="text-2xl font-bold text-gray-600 truncate text-center max-w-full" :title="player">
                        {{ player }}
                    </div>
                    <div class="text-xl">
                        <input v-model="scores[index]" type="number" placeholder="点数" required
                            class="w-20 h-12 text-2xl text-right border-gray-200 border-2 rounded-lg"
                            @input="$emit('update')" @change="calculatePoints()" />00
                    </div>
                </div>

            </div>
            <button type="submit" class="h-full">
                <BaseButton class="h-full w-16 p-4 flex items-center justify-center">
                    <Icon name="stash:check-solid" size="2em" mode="svg" />
                </BaseButton>
            </button>
        </form>

    </div>
</template>