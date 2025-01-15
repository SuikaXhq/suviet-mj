<script setup lang="ts">
import { GameType, Position } from '@prisma/client';
import argsort from '#shared/utils/argsort';

const props = withDefaults(defineProps<{
    isSubmitting?: boolean;
    gameType?: GameType;
    players: string[]; // 东南西北
}>(), {
    isSubmitting: false,
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
        <div class="flex flex-row sm:px-4 items-center justify-between w-full sm:text-xl text-base text-gray-400">
            <div>{{ nameMap[gameType] }}</div>
        </div>
        <form class="sm:px-2 w-full flex flex-row items-center justify-center sm:gap-2 gap-1"
            @submit.prevent="$emit('submit', players, scores, points)">
            <div class="sm:flex sm:flex-row grid grid-cols-2 grid-rows-2 flex-1 items-center justify-center sm:gap-2 gap-1">
                <div v-for="(player, index) in players" :key="index"
                    class="rounded-xl sm:p-2 px-2 py-1 flex-auto sm:h-28 h-20 flex flex-row items-center justify-center sm:gap-2 bg-gray-200">
                    <div class="flex flex-col items-center justify-center sm:gap-2 gap-1">
                        <div class="sm:text-3xl text-xl font-bold">{{ nameMap[positions[index]] }}</div>
                        <input v-model="points[index]" type="number" step="0.1" placeholder="精算" required
                            class="sm:w-[70px] w-[35px] sm:h-8 h-4 sm:text-xl text-xs text-right sm:rounded-lg rounded-md appearance-none"
                            @update="$emit('update')" />
                    </div>
                    <div class="flex flex-col sm:gap-2 gap-1 justify-center items-center sm:max-w-28 max-w-24">
                        <div class="sm:text-2xl text-base font-bold text-gray-600 truncate text-center max-w-full"
                            :title="player">
                            {{ player }}
                        </div>
                        <div class="sm:text-xl text-sm">
                            <input v-model="scores[index]" type="number" placeholder="点数" required
                                class="sm:w-20 w-12 sm:h-12 h-8 sm:text-2xl text-base text-right border-gray-200 border-2 rounded-lg appearance-none"
                                @input="$emit('update')" @change="calculatePoints()" />00
                        </div>
                    </div>

                </div>
            </div>
            <button type="submit" class="" :disabled="isSubmitting">
                <BaseButton class="sm:w-16 w-16 h-16 sm:p-4 flex items-center justify-center" :disabled="isSubmitting">
                    <Icon v-if="!isSubmitting" name="stash:check-solid" size="2em" mode="svg" />
                    <Icon v-else name="svg-spinners:180-ring-with-bg" size="2em" mode="svg" class="animate-spin" />
                </BaseButton>
            </button>
        </form>

    </div>
</template>