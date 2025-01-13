<script setup lang="ts">
const props = defineProps<{
    hasParent?: boolean
}>()
</script>

<template>
    <div class="relative flex grow cursor-default flex-col divide-y divide-gray-200 dark:divide-gray-700">
        <div class="relative xl:h-28 h-16 text-2xl lg:text-3xl">
            <div v-if="hasParent" class="absolute inset-y-0 left-0 ml-4 flex items-center text-left">
                <button @click="$router.back()" type="button" title="返回"
                    class="flex items-center justify-center p-2 text-5xl transition hover:text-gray-500 hover:dark:text-gray-400">
                    <Icon name="stash:chevron-left-solid" size="1.5em" mode="svg" />
                </button>
            </div>
            <slot name="header"></slot>
        </div>

        <div class="flex grow flex-col text-base lg:text-2xl">
            <slot name="body"></slot>
        </div>
    </div>
</template>