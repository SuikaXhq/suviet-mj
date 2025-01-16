<script setup lang="ts">
const { loggedIn } = useUserSession();
</script>
<template>
    <div class="h-[100dvh] items-center flex justify-items-center justify-center place-content-center sm:p-8 p-2">
        <div class="sm:grid sm:grid-cols-2 sm:grid-rows-2 flex flex-col xl:gap-16 sm:gap-4 gap-2 justify-items-center justify-center place-content-center items-center
        my-4">
            <LoginButton />
            <BaseIndexButton disabled to="/statistics">数据统计</BaseIndexButton>
            <BaseIndexButton :disabled=!loggedIn to="/record">对局记录</BaseIndexButton>
            <BaseIndexButton :disabled=!loggedIn to="/competition">最高位战</BaseIndexButton>
        </div>
    </div>
</template>