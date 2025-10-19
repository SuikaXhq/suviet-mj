<script setup lang="ts">
import type { GameType, Position } from '@prisma/client';

const { user: currentUser } = useUserSession();

const props = defineProps<{
    id: number;
    gameType: GameType;
    positions: Position[];
    players: string[];
    scores: number[];
    ranks: number[];
    time: string;
    points?: number[];
}>();

const emit = defineEmits<{
    (e: 'delete', id: number): void;
    (e: 'edit', id: number, scores: number[]): void;
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

const editStatus = ref('')
function confirmDelete() {
    editStatus.value = 'delete';
}
const editingScores = reactive<{ [player: string]: number }>({});
function startEditing() {
    if (editStatus.value === 'edit') return;
    editStatus.value = 'edit';
    records.value.forEach((item) => {
        editingScores[item.player] = item.score;
    });
}
function cancel() {
    editStatus.value = '';
    isSubmitting.value = false;
}

const isSubmitting = ref(false);
function submit() {
    if (isSubmitting.value) return;
    if (editStatus.value === 'delete') {
        isSubmitting.value = true;
        emit('delete', props.id);
    } else if (editStatus.value === 'edit') {
        isSubmitting.value = true;
        emit('edit', props.id, records.value.map(item => editingScores[item.player]));
    }
}

const isEditing = computed(() => editStatus.value === 'edit');
const isDeleting = computed(() => editStatus.value === 'delete');
</script>

<template>
    <div class="flex flex-col w-full">
        <div class="flex flex-row sm:px-4 items-center justify-between w-full sm:text-2xl text-base text-gray-400">
            <div class="flex flex-row items-center gap-2">
                <div>{{ nameMap[gameType] }}</div>
                <button @click="startEditing()" class="rounded-lg hover:bg-gray-200">
                    <Icon name="material-symbols:edit-document" size="1.25em" mode="svg" />
                </button>
                <button @click="confirmDelete()" class="rounded-lg hover:bg-gray-200">
                    <Icon name="line-md:trash" size="1.4em" mode="svg" />
                </button>
            </div>
            <div class="">{{ new Date(time).toLocaleString() }}</div>
        </div>
        <div class="sm:rounded-3xl rounded-xl sm:px-2 w-full flex flex-row items-center justify-center sm:gap-2 gap-1">
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
                    <div v-if="isEditing">
                        <div class="sm:text-3xl text-xl">
                            <input v-model="editingScores[item.player]" type="number" placeholder="点数" required
                                class="sm:w-28 sm:h-14 w-20 h-8 sm:text-4xl text-xl text-right border-gray-200 border-2 rounded-lg group-hover:pointer-events-none" />00
                        </div>
                    </div>
                    <div v-else>
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
        <TransitionGroup name="record" tag="div" class="flex flex-col my-1 sm:px-2">
            <div v-if="isDeleting" class="text-red-600 text-center">
                确认删除该记录吗？
            </div>
            <div class="flex w-full justify-center gap-2 text-2xl" v-if="isDeleting || isEditing">
                <button @click="submit()" class="flex-1" :disabled="isSubmitting">
                    <BaseButton class="h-14 sm:p-4 flex items-center justify-center" :disabled="isSubmitting">
                        <Icon v-if="!isSubmitting" name="stash:check-solid" size="2em" mode="svg" />
                        <Icon v-else name="svg-spinners:180-ring-with-bg" size="1.5em" mode="svg" class="animate-spin" />
                    </BaseButton>
                </button>
                <button @click="cancel()" class="flex-1" :disabled="isSubmitting">
                    <BaseButton class="h-14 sm:p-4 flex items-center justify-center" :disabled="isSubmitting">
                        <Icon name="stash:times-duotone" size="2em" mode="svg" />
                    </BaseButton>
                </button>
            </div>
        </TransitionGroup>
    </div>
</template>