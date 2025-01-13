<script setup lang="ts">
const { loggedIn } = useUserSession()
const appConfig = useAppConfig()
</script>
<template>
    <div class="min-h-screen items-center flex justify-items-center justify-center place-content-center p-8">
        <div class="grid grid-cols-2 grid-rows-2 xl:gap-16 gap-4 justify-items-center justify-center place-content-center items-center
        my-4">
            <LoginButton />
            <BaseIndexButton disabled to="/statistics">数据统计</BaseIndexButton>
            <BaseIndexButton :disabled=!loggedIn to="/record">对局记录</BaseIndexButton>
            <BaseIndexButton :disabled=!loggedIn to="/competition">最高位战</BaseIndexButton>
        </div>
    </div>
</template>