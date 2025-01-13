<script setup lang="ts">
import { CompetitionType, GameType, Position, UserLevel } from '@prisma/client';

const { user: currentUser } = useUserSession();

const props = withDefaults(defineProps<{
    canFold?: boolean;
}>(), {});
const emit = defineEmits<{
    (e: "submitted", competitionId: number): void;
}>();

const errorInfo = ref('');
const userList = reactive<{ name: string, id: number, level: string }[]>([]);
const newButtonClicked = ref(false);
async function fetchUserList() {
    const data = await $fetch('/api/user/list');
    if (data.statusCode === 200) { userList.push(...data.data) }
}
fetchUserList();

async function submitCompetition() {
    if (competitionConfigInputs.players.length !== maxPlayers.value) {
        errorInfo.value = '参赛人数不足';
        return;
    }
    const data = await $fetch('/api/competition', {
        method: 'POST',
        body: {
            ...competitionConfigInputs,
            competitionType: chosenCompetitionType.value,
        },
        watch: false,
    },);
    if (data.statusCode === 200) {
        emit('submitted', data.body!);
    } else {
        errorInfo.value = data.message || '创建失败';
    }
}

function clearError() {
    errorInfo.value = ''
}


const userListUI = computed(() => {
    return userList.filter(user => !competitionConfigInputs.players.includes(user.name))
});

const competitionTypes: CompetitionType[] = [
    CompetitionType.FourInFour,
    CompetitionType.FiveInFive,
]
const competitionTypeNames = computed(() => {
    return competitionTypes.map(type => nameMap[type]);
})
const chosenCompetitionTypeIndex = ref<number>(0);
const chosenCompetitionType = computed(() => {
    return competitionTypes[chosenCompetitionTypeIndex.value];
});
const maxPlayers = computed<number>(() => {
    if (chosenCompetitionType.value === CompetitionType.FourInFour) {
        return 4;
    } else if (chosenCompetitionType.value === CompetitionType.FiveInFive) {
        return 5;
    } else {
        return 0;
    }
});

const competitionConfigInputs = reactive<{
    name: string,
    players: string[],
}>({
    name: '新大赛',
    players: [],
});
const competitors = computed(() => {
    return competitionConfigInputs.players.sort();
})
watch(competitionConfigInputs, clearError, { deep: true });

function startDragPlayer(event: DragEvent, player: string) {
    event.dataTransfer!.dropEffect = 'move';
    event.dataTransfer!.effectAllowed = 'move';
    event.dataTransfer!.setData('player', player);
}

function handleAddToCompetitor(player: string) {
    if (competitionConfigInputs.players.length >= maxPlayers.value) return;
    competitionConfigInputs.players.push(player);
}

function handleRemoveFromCompetitor(player: string) {
    const index = competitionConfigInputs.players.indexOf(player);
    if (index === -1) return;
    competitionConfigInputs.players.splice(index, 1);
}


</script>

<template>
    <BaseButton v-if="canFold && !newButtonClicked" @click="newButtonClicked = true" key="newButton"
        class="h-32 w-80 text-center flex items-center justify-center m-4">
        <div class="text-3xl text-center">新大赛</div>
    </BaseButton>
    <form v-else class="flex flex-col w-full gap-2 items-center relative m-4" key="newPanel"
        @submit.prevent="submitCompetition()">
        <div class="w-full flex flex-row items-center justify-center">
            <div class="font-bold text-3xl text-center m-2">大赛名：
                <input v-model="competitionConfigInputs.name" type="text" required
                    class="rounded-xl w-3/5 h-16 text-2xl text-center border-2 text-gray-800" />
            </div>
        </div>
        <div class="w-full flex flex-row items-center justify-center">
            <div class="font-bold text-3xl text-center m-2">大赛类型：</div>
            <div>
                <ToggleGroup v-model="chosenCompetitionTypeIndex" :options="competitionTypeNames" />
            </div>
        </div>
        <TransitionGroup name="record-users" tag="div" class="flex flex-row flex-wrap gap-2 items-center justify-center"
            @drop.prevent @dragover.prevent
            @drop="handleRemoveFromCompetitor($event.dataTransfer?.getData('player') || '')">
            <UserButton v-for="user in userListUI" :key="user.id" :user="user" :draggable="true"
                @dragstart="startDragPlayer($event, user.name)" @click="handleAddToCompetitor(user.name)" />
        </TransitionGroup>
        <div class="flex flex-row items-center justify-center w-full">
            <div class="font-bold text-3xl text-center m-2">
                参赛玩家：
            </div>
            <div class="rounded-xl border-2 w-3/5 h-16 gap-2 p-2 flex flex-row justify-center items-center"
                @drop.prevent @dragover.prevent
                @drop="handleAddToCompetitor($event.dataTransfer?.getData('player') || '')">
                <UserButton v-for="player in competitors" :key="player"
                    :user="userList.find(user => user.name === player)!" :draggable="true"
                    @click="handleRemoveFromCompetitor(player)" @dragstart="startDragPlayer($event, player)" />
            </div>
        </div>
        <button type="submit" class="h-16 w-80 rounded-2xl">
            <BaseButton class="h-16 w-80 p-4 flex items-center justify-center">
                <Icon name="stash:check-solid" size="2em" mode="svg" />
            </BaseButton>
        </button>
        <div class="text-center text-xl text-red-700 mb-4">
            {{ errorInfo }}
        </div>
        <Icon v-if="canFold" name="stash:chevron-up-duotone" size="2em" mode="svg" @click="newButtonClicked = false"
            class="absolute text-gray-300 cursor-pointer hover:text-gray-600 transition bottom-[-25px]" />
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