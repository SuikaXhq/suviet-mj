<script setup lang="ts">
const props = defineProps<{
    disabled?: boolean;
}>()

const buttonStyle = computed(() => {
    return [
        "rounded-2xl",
        "shadow-lg",
        "transition",
        "duration-300",
        "bg-gray-200",
        "dark:bg-slate-600",
        "hover:bg-gray-300",
        "hover:dark:border-gray-400",
        "font-bold",
        {
            "cursor-not-allowed": props.disabled,
            "cursor-pointer": !props.disabled,
            "hover:scale-[1.02]": !props.disabled,
            "active:scale-[0.98]": !props.disabled,
            "text-gray-400": props.disabled,
            "text-gray-700": !props.disabled,
        }
    ]
})
</script>

<template>
    <div :class="buttonStyle">
        <slot></slot>
    </div>
</template>