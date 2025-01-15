<script setup lang="ts">
const props = defineProps<{
    wind: string;
}>()
const userName = defineModel<string>('userName')
const score = defineModel<number>('score')
const emit = defineEmits<{
    (e: 'playerDragged'): void;
    (e: 'playerDropped', player: string): void;
    (e: 'update'): void;
    (e: 'clickedHandle'): void;
}>()
const canDrag = ref(false)

watch(userName, () => emit('update'));
watch(score, () => emit('update'));

function onPlayerDrop(event: DragEvent) {
    emit('playerDropped', userName.value || '')
    userName.value = event.dataTransfer?.getData('player') || ''
}

function startSwapPlayer(event: DragEvent, player: string | undefined) {
    event.dataTransfer!.dropEffect = 'move'
    event.dataTransfer!.effectAllowed = 'move'
    event.dataTransfer!.setData('player', player || '')
    emit('playerDragged')
}

</script>

<template>
    <div class="flex flex-row gap-2 p-2 items-center justify-center bg-gray-100 rounded-lg shadow-md select-none"
        @dragover.prevent @dragenter.prevent @drop="onPlayerDrop">
        <div class="sm:w-12 w-8 sm:text-4xl text-2xl font-bold text-center">{{ wind }}</div>
        <div class="flex flex-col sm:gap-2 gap-1 items-center">
            <div class="bg-gray-200 rounded-lg flex flex-row items-center justify-center overflow-hidden"
                :draggable="canDrag" @dragstart="startSwapPlayer($event, userName)" @dragend="canDrag = false">
                <Icon name="stash:burger-classic" size="1.5em" mode="svg"
                    class="cursor-grab group-hover:pointer-events-none" @mousedown="canDrag = true"
                    @click="$emit('clickedHandle')" />
                <input v-model="userName" type="text" placeholder="玩家名" required
                    class="sm:w-36 w-24 sm:h-10 h-8 sm:text-2xl rounded-lg text-base text-center bg-gray-200 text-gray-600 group-hover:pointer-events-none" />
            </div>
            <div class="sm:text-3xl text-xl">
                <input v-model="score" type="number" placeholder="点数" required
                    class="sm:w-28 sm:h-16 w-20 h-8 sm:text-4xl text-xl text-right border-gray-200 border-2 rounded-lg group-hover:pointer-events-none" />00
            </div>
        </div>
    </div>
</template>