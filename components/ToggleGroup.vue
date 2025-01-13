<script setup lang="ts">
const chosen = defineModel<number>();
const props = defineProps<{
    options: string[];
}>();
</script>

<template>
    <div class="flex flex-row p-1 gap-1 h-16 items-center justify-center rounded-xl bg-gray-200">
        <div v-for="(option, index) in props.options" :key="index" @click="chosen = index"
            class="h-full w-14 text-xl leading-6 text-center rounded-lg align-baseline flex flex-col justify-center cursor-pointer transition duration-200"
            :class="chosen === index ? `bg-gray-700 text-gray-200` : `bg-gray-200 hover:bg-gray-500 hover:text-gray-200`">
            {{ option }}
        </div>
    </div>
</template>