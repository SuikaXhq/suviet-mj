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
                <div class="text-center font-bold xl:text-4xl text-2xl">对局记录</div>
            </div>
        </template>

        <template v-slot:body>
            <div class="flex flex-col sm:gap-4 gap-2 sm:p-4 p-2 divide-y-[1px] items-center">
                <TransitionGroup name="record">
                    <RecordInputPanel key="recordPanel" canFold @uploaded="refreshHistoryRecords" />
                    <div class="flex flex-col w-full " key="historyPanel">
                        <div class="block w-full sm:m-4 m-2 font-bold sm:text-3xl text-2xl text-gray-600 text-center sm:text-left">历史对局</div>
                        <div class="flex flex-col w-full sm:gap-6 gap-2 items-center">
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