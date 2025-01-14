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

async function submitRecord() {
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

function startDragPlayer(event: DragEvent, item: (typeof userList)[number]) {
    event.dataTransfer!.dropEffect = 'move';
    event.dataTransfer!.effectAllowed = 'move';
    event.dataTransfer!.setData('player', item.name);
}

const indexToSwapPlayer = ref<number>(-1)
function readyForSwapPlayer(index: number) {
    indexToSwapPlayer.value = index;
}
function swapPlayer(player: string) {
    if (indexToSwapPlayer.value === -1) return;
    recordInputs.players[indexToSwapPlayer.value] = player;
    indexToSwapPlayer.value = -1;
}
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
                @dragstart="startDragPlayer($event, user)" />
        </TransitionGroup>
        <div class="grid grid-cols-2 sm:gap-x-32 gap-x-2 gap-y-2 items-center justify-center justify-items-center">
            <RecordInput v-for="(wind, index) in inputWindList" :wind="nameMap[wind]"
                v-model:userName="recordInputs.players[index]" v-model:score="recordInputs.scores[index]"
                :class="index === 0 || index === 3 ? `col-span-2` : ``" @playerDragged="readyForSwapPlayer(index)"
                @playerDropped="swapPlayer" @update="clearError" />
        </div>
        <button type="submit" class="h-16 w-80 rounded-2xl sm:mt-2 mt-8">
            <BaseButton class="h-16 w-80 p-4 flex items-center justify-center">
                <Icon name="stash:check-solid" size="2em" mode="svg" />
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