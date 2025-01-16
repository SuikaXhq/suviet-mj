<template>
    <div>
        <div class="bg-gray-50 dark:bg-zinc-900">
            <div
                class="relative mx-auto flex min-h-[100dvh] w-full xl:max-w-5xl flex-col bg-white text-textMain shadow-lg dark:bg-slate-800 dark:text-textMainDark">
                <NuxtPage />
            </div>
        </div>
    </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

::-webkit-scrollbar {
    width: 0.3rem;
}

::-webkit-scrollbar-thumb {
    background-color: #6b7280;
    border-radius: 999rem;
}
</style>