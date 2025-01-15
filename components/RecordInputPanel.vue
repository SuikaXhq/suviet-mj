<script setup lang="ts">
import { GameType, Position, UserLevel } from '@prisma/client';

const { user: currentUser } = useUserSession();

const props = withDefaults(defineProps<{
    gameTypes?: GameType[];
    canFold?: boolean;
}>(), {
    gameTypes: () => [
        GameType.ES4,
        GameType.ES3,
        GameType.E4,
        GameType.E3,
        GameType.GB
    ] as GameType[],
});
const emit = defineEmits<{
    uploaded: [];
}>();

const errorInfo = ref('');
const userList = reactive<{ name: string, id: number, level: string }[]>([]);
const newButtonClicked = ref(false);
async function fetchUserList() {
    const { data } = await useFetch('/api/user/list');
    if (data.value?.statusCode === 200) { userList.push(...data.value.data) }
}
fetchUserList();

const isSubmitting = ref(false);
async function submitRecord() {
    if (isSubmitting.value) return;
    isSubmitting.value = true;
    const { data } = await useFetch('/api/record', {
        method: 'POST',
        body: {
            gameType: chosenGameType.value,
            players: recordInputsSubmit.value.players,
            scores: recordInputsSubmit.value.scores
        }
    });
    if (data.value?.statusCode === 200) {
        clearForm();
        isSubmitError.value = false;
        errorInfo.value = '记录上传成功';
        setTimeout(() => {
            clearInfo();
        }, 3000)
        emit('uploaded');
    } else {
        isSubmitError.value = true;
        errorInfo.value = data.value?.message || '记录上传失败';
    }
    isSubmitting.value = false;
}

const isSubmitError = ref(false);
function clearError() {
    if (isSubmitError.value) {
        errorInfo.value = ''
    }
}
function clearInfo() {
    errorInfo.value = ''
}

function clearForm() {
    recordInputs.players = [undefined, undefined, undefined, undefined];
    recordInputs.scores = [undefined, undefined, undefined, undefined];
}

const userListUI = computed(() => {
    return userList.filter(user => !recordInputs.players.includes(user.name))
});

const gameTypeNames = computed(() => {
    return props.gameTypes.map(type => nameMap[type]);
})
const chosenGameTypeIndex = ref<number>(0);
const chosenGameType = computed(() => {
    return props.gameTypes[chosenGameTypeIndex.value];
});

const inputWindList = computed(() => {
    if (chosenGameType.value === GameType.ES3 || chosenGameType.value === GameType.E3) {
        return [
            Position.EAST,
            Position.SOUTH,
            Position.WEST
        ];
    } else {
        return [
            Position.EAST,
            Position.SOUTH,
            Position.NORTH,
            Position.WEST
        ];
    }
});
const recordInputs = reactive<{
    players: (string | undefined)[],
    scores: (number | undefined)[]
}>({
    players: [undefined, undefined, undefined, undefined], // 东南北西 or 东南西
    scores: [undefined, undefined, undefined, undefined] // 东南北西 or 东南西
});
const recordInputsSubmit = computed(() => { // 转换为东南西北
    if (chosenGameType.value === GameType.ES3 || chosenGameType.value === GameType.E3) {
        return {
            players: recordInputs.players.slice(0, 3),
            scores: recordInputs.scores.slice(0, 3)
        }
    } else {
        return {
            players: [...recordInputs.players.slice(0, 2), recordInputs.players[3], recordInputs.players[2]],
            scores: [...recordInputs.scores.slice(0, 2), recordInputs.scores[3], recordInputs.scores[2]]
        }
    }
});

const windowWidth = ref(0);
const isIpad = computed(() => {
    return windowWidth.value < 1280 && windowWidth.value > 640;
});
const panelOrderResponsiveToWidth = computed(() => {
    return windowWidth.value < 1280 && windowWidth.value > 640 ? [0, 1, 3, 2] : [0, 1, 2, 3]; // Ipad上东南西北，其余东南北西
});

const draggingPlayer = ref(false);
function startDragPlayer(event: DragEvent, item: (typeof userList)[number]) {
    event.dataTransfer!.dropEffect = 'move';
    event.dataTransfer!.effectAllowed = 'move';
    event.dataTransfer!.setData('player', item.name);
    draggingPlayer.value = true;
}

const indexToSwapPlayer = ref<number>(-1)
function readyForSwapPlayer(index: number) {
    indexToSwapPlayer.value = index;
}
function swapPlayer(player: string) {
    draggingPlayer.value = false;
    if (indexToSwapPlayer.value === -1) return;
    recordInputs.players[indexToSwapPlayer.value] = player;
    indexToSwapPlayer.value = -1;
}

const isMovingOrSwapping = computed(() => {
    return indexToSwapPlayer.value !== -1 || playerCache.value !== undefined || draggingPlayer.value;
})
const playerCache = ref<string | undefined>(undefined);
function handleCachePlayer(player: string) {
    if (playerCache.value === player) {
        playerCache.value = undefined;
    } else {
        playerCache.value = player;
    }
}
function handleSetPlayer(index: number) {
    if (playerCache.value) {
        recordInputs.players[index] = playerCache.value;
        playerCache.value = undefined;
    }
}

onMounted(() => {
    windowWidth.value = window.innerWidth;
    window.addEventListener('resize', () => {
        windowWidth.value = window.innerWidth;
    });
});
</script>

<template>
    <BaseButton v-if="canFold && !newButtonClicked" @click="newButtonClicked = true" key="newButton"
        class="h-32 w-80 text-center flex items-center justify-center m-4">
        <div class="text-3xl text-center">新对局</div>
    </BaseButton>
    <form v-else class="flex flex-col w-full gap-2 items-center relative mb-4" key="newPanel"
        @submit.prevent="submitRecord()">
        <div class="w-full flex flex-row items-center justify-center">
            <div class="font-bold sm:text-3xl text-base text-center m-2">对局类型：</div>
            <div>
                <ToggleGroup v-model="chosenGameTypeIndex" :options="gameTypeNames" />
            </div>
        </div>
        <TransitionGroup name="record-users" tag="div"
            class="flex flex-row flex-wrap gap-2 items-center justify-center">
            <UserButton v-for="user in userListUI" :key="user.id" :user="user" :draggable="true"
                :class="playerCache === user.name ? `border-blue-500 border-2` : ``"
                @dragstart="startDragPlayer($event, user)" @dragend="draggingPlayer = false"
                @click="handleCachePlayer(user.name)" />
        </TransitionGroup>
        <div
            class="grid grid-cols-2 sm:max-xl:flex sm:max-xl:flex-row gap-x-2 xl:gap-x-32 gap-y-2 items-center justify-center justify-items-center">
            <RecordInput v-for="index in panelOrderResponsiveToWidth" :wind="nameMap[inputWindList[index]]" :key="index"
                v-model:userName="recordInputs.players[index]" v-model:score="recordInputs.scores[index]"
                class="transition duration-150" :class="{
                    'col-span-2': (index === 0 || index === 3) && !isIpad,
                    'border-2 border-orange-300 hover:scale-[1.02] group cursor-pointer': isMovingOrSwapping && indexToSwapPlayer !== index,
                    'border-2 border-blue-500': indexToSwapPlayer === index,
                }" @playerDragged="readyForSwapPlayer(index)" @playerDropped="swapPlayer" @update="clearError"
                @click="handleSetPlayer(index)" />
        </div>
        <button type="submit" class="h-16 w-80 rounded-2xl sm:mt-2 mt-8" :disabled="isSubmitting">
            <BaseButton class="h-16 w-80 p-4 flex items-center justify-center" :disabled="isSubmitting">
                <Icon v-if="!isSubmitting" name="stash:check-solid" size="2em" mode="svg" />
                <Icon v-else name="svg-spinners:180-ring-with-bg" size="2em" mode="svg" class="animate-spin" />
            </BaseButton>
        </button>
        <div class="text-center text-xl" :class="isSubmitError ? `text-red-700 ` : `text-green-500`">{{
            errorInfo }}</div>
        <Icon v-if="canFold" name="stash:chevron-up-duotone" size="2em" mode="svg" @click="newButtonClicked = false"
            class="absolute text-gray-300 cursor-pointer hover:text-gray-600 transition sm:bottom-[-40px] bottom-[-30px]" />
    </form>
</template>

<style>
.record-users-move {
    transition: transform 0.3s;
}

.record-users-leave-active {
    transition: all 0s;
}

.record-users-enter-active {
    transition: all 0.3s ease;
}

.record-users-enter-from,
.record-users-leave-to {
    opacity: 0;
}

.record-users-leave-active {
    position: absolute;
}
</style>