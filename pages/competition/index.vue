<script setup lang="ts">
const { data } = await useFetch('/api/competition/');
const competitions = ref(data.value?.body || []);
</script>

<template>
    <BasePage hasParent>
        <template v-slot:header>
            <div class="flex h-full items-center justify-center">
                <div class="text-center font-bold text-4xl">最高位战</div>
            </div>
        </template>

        <template v-slot:body>
            <div class="flex flex-col items-center justify-center divide-y-[1px]">
                <TransitionGroup name="competition">
                    <CompetitionInputPanel canFold @submitted="(id) => navigateTo(`/competition/${id}`)" />
                </TransitionGroup>

                <div class="w-full flex flex-col justify-center items-center gap-8 p-8">
                    <NuxtLink v-for="competition in competitions" :key="competition.id"
                        :to="`/competition/${competition.id}`" class="w-full">
                        <BaseButton>
                            <div class="flex flex-col items-center justify-between gap-4 p-4">
                                <div class="text-4xl font-bold">
                                    {{ competition.name }}
                                </div>
                                <div class="text-2xl font-normal text-gray-400">
                                    {{ new Date(competition.time).toLocaleString() }}
                                </div>
                            </div>
                        </BaseButton>
                    </NuxtLink>
                </div>
            </div>
        </template>
    </BasePage>
</template>

<style>
.competition-move {
    transition: transform 0.3s;
}

.competition-leave-active,
.competition-enter-active {
    transition: opacity 0.3s ease;
}

.competition-enter-from,
.competition-leave-to {
    opacity: 0;
}

.competition-leave-active {
    position: absolute;
}
</style>