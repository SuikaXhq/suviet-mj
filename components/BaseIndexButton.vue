<script setup lang="ts">
const props = defineProps<{
    to?: string;
    disabled?: boolean;
}>()
const NuxtLink = resolveComponent('NuxtLink')
const baseComponent = computed(() => {
    return props.disabled || !props.to ? `div` : NuxtLink
})
</script>
<template>
    <component :is="baseComponent" :to>
        <BaseButton :disabled=props.disabled>
            <div class="xl:p-8 xl:h-96 xl:w-96 sm:p-4 p-2 sm:h-72 w-72 h-20 grid grid-cols-1 grid-rows-1 place-content-center items-center">
                <div class="xl:text-6xl sm:text-4xl text-2xl text-center">
                    <slot></slot>
                </div>
            </div>
        </BaseButton>
    </component>
</template>