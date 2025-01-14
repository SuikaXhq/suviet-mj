<script setup lang="ts">
import { UserLevel } from '@prisma/client';

const props = defineProps<{
    user: {
        name: string;
        id: number;
        level: string;
    }
}>();
const { user: currentUser } = useUserSession();
</script>

<template>
    <BaseButton class="sm:text-xl text-base font-normal p-2 flex flex-row items-center">
        <Icon :name="user.level === UserLevel.admin ? `stash:shield-user` : `stash:person`" size="1.25em" mode="svg"
            :class="user.id === currentUser?.id ? `text-blue-500` : ``" />
        <div :class="user.id === currentUser?.id ? `text-blue-500` : ``">{{ user.name }}</div>
    </BaseButton>
</template>