<script setup lang="ts">
import { UserLevel } from '@prisma/client';

const { data } = await useFetch('/api/competition/');
const { user } = useUserSession();
const competitions = ref(data.value?.body || []);
</script>

<template>
    <BasePage hasParent>
        <template v-slot:header>
            <div class="flex h-full items-center justify-center">
                <div class="text-center font-bold xl:text-4xl text-2xl">最高位战</div>
            </div>
        </template>

        <template v-slot:body>
            <div class="flex flex-col items-center justify-center divide-y-[1px]">
                <CompetitionInputPanel v-if="user.level === UserLevel.admin" canFold
                    @submitted="(id) => navigateTo(`/competition/${id}`)" />

                <div class="w-full flex flex-col justify-center items-center xl:gap-8 gap-4 xl:p-8 p-4">
                    <NuxtLink v-for="competition in competitions" :key="competition.id"
                        :to="`/competition/${competition.id}`" class="w-full">
                        <BaseButton>
                            <div class="flex flex-col items-center justify-between sm:gap-4 p-4">
                                <div class="sm:text-4xl text-2xl font-bold">
                                    {{ competition.name }}
                                </div>
                                <div class="sm:text-2xl text-base font-normal text-gray-400">
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