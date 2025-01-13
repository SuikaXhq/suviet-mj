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
    <div class="flex flex-row gap-2 p-2 h-32 w-fit items-center justify-center bg-gray-100 rounded-lg shadow-md"
        @dragover.prevent @dragenter.prevent @drop="onPlayerDrop">
        <div class="w-12 text-4xl font-bold text-center">{{ wind }}</div>
        <div class="flex flex-col gap-2 items-center">
            <div class="bg-gray-200 rounded-lg flex flex-row items-center justify-center" :draggable="canDrag"
                @dragstart="startSwapPlayer($event, userName)" @dragend="canDrag = false">
                <Icon name="stash:burger-classic" size="1.5em" mode="svg" class="cursor-grab"
                    @mousedown="canDrag = true" />
                <input v-model="userName" type="text" placeholder="玩家名" required
                    class="w-36 h-10 text-2xl text-center bg-gray-200 text-gray-600" />
            </div>
            <div class="text-3xl">
                <input v-model="score" type="number" placeholder="点数" required
                    class="w-28 h-16 text-4xl text-right border-gray-200 border-2 rounded-lg" />00
            </div>
        </div>
    </div>
</template>