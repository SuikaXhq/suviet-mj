<script setup lang="ts">
const props = defineProps<{
    hasParent?: boolean
}>()
</script>

<template>
    <div class="relative flex grow cursor-default flex-col divide-y divide-gray-200 dark:divide-gray-700">
        <div class="relative xl:h-28 sm:h-16 h-12 sm:text-2xl text-lg lg:text-3xl">
            <div v-if="hasParent" class="absolute inset-y-0 left-0 sm:ml-4 flex items-center text-left">
                <button @click="$router.back()" type="button" title="返回"
                    class="flex items-center justify-center sm:p-2 xl:text-5xl text-3xl transition hover:text-gray-500 hover:dark:text-gray-400">
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