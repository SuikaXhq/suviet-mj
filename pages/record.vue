<script setup lang="ts">
const { data: historyRecordData, refresh: refreshHistoryRecords } = await useFetch('/api/user/historyRecord');
const historyRecords = computed(() => {
    if (historyRecordData.value?.statusCode === 200) {
        return historyRecordData.value.body;
    } else {
        return [];
    }
})
</script>

<template>
    <BasePage hasParent>
        <template v-slot:header>
            <div class="flex h-full items-center justify-center">
                <div class="text-center font-bold text-4xl">对局记录</div>
            </div>
        </template>

        <template v-slot:body>
            <div class="flex flex-col gap-4 p-4 divide-y-[1px] items-center">
                <TransitionGroup name="record">
                    <RecordInputPanel key="recordPanel" canFold @uploaded="refreshHistoryRecords" />
                    <div class="flex flex-col w-full " key="historyPanel">
                        <div class="block w-full m-4 font-bold text-3xl text-gray-600">历史对局</div>
                        <div class="flex flex-col w-full gap-6 items-center">
                            <Record v-for="record in historyRecords" :key="record.id" v-bind="record" />
                        </div>
                    </div>
                </TransitionGroup>
            </div>

        </template>
    </BasePage>
</template>

<style>
.record-move {
    transition: transform 0.3s;
}

.record-leave-active,
.record-enter-active {
    transition: opacity 0.3s ease;
}

.record-enter-from,
.record-leave-to {
    opacity: 0;
}

.record-leave-active {
    position: absolute;
}
</style>