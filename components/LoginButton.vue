<script setup lang="ts">
import { UserLevel } from '@prisma/client';

const { loggedIn, user, session, fetch: fetchUserSession, clear } = useUserSession();
const clicked = ref(false);
const loginInfo = reactive<{
    username?: string,
    password?: string,
    passwordConfirm?: string,
    token?: string,
    isRegister: boolean
}>({
    username: undefined,
    password: undefined,
    passwordConfirm: undefined,
    token: undefined,
    isRegister: false
});
const namePlaceholder = computed(() => loginInfo.isRegister ? `用户名：3-12个字符` : `用户名`);
const pwdPlaceholder = computed(() => loginInfo.isRegister ? `密码：6-16个字符` : `密码`);
const errorInfo = ref('');

function checkForm() {
    // Name
    if (loginInfo.username!.length < 3 || loginInfo.username!.length > 12) {
        errorInfo.value = '用户名长度应在3-12个字符之间';
        return false;
    }
    // 特殊字符
    if (!/^[a-zA-Z0-9_\-\u4E00-\u9FFF]+$/.test(loginInfo.username!)) {
        errorInfo.value = '用户名不能包含特殊字符';
        return false;
    }
    // Password
    if (loginInfo.password!.length < 6 || loginInfo.password!.length > 16) {
        errorInfo.value = '密码长度应在6-16个字符之间';
        return false;
    }
    // Password confirm
    if (loginInfo.isRegister && loginInfo.password !== loginInfo.passwordConfirm) {
        errorInfo.value = '两次输入的密码不一致';
        return false;
    }
    return true;
}

function clearError() {
    errorInfo.value = '';
}

async function register() {
    clearError();
    if (!checkForm()) return;
    const res = await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
            name: loginInfo.username,
            password: loginInfo.password,
            token: loginInfo.token
        }
    })
    if (res.statusCode === 200) {
        login();
    } else {
        errorInfo.value = res.message;
    }

}

async function login() {
    clearError();
    const res = await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
            name: loginInfo.username,
            password: loginInfo.password
        }
    })
    if (res.statusCode === 200) {
        fetchUserSession();
    } else {
        errorInfo.value = res.message;
    }
}
</script>

<template>
    <div class="rounded-2xl bg-gray-200 xl:h-96 xl:w-96 sm:h-72 sm:w-72 h-40 w-40">
        <Transition name="fade" mode="out-in">
            <BaseIndexButton v-if="!loggedIn && !clicked" @click="clicked = true">
                    登录/注册
            </BaseIndexButton>

            <form v-else-if="!loggedIn" class="rounded-2xl xl:h-96 xl:w-96 sm:h-72 sm:w-72 h-40 w-40 bg-gray-200 " @submit.prevent="loginInfo.isRegister ? register() : login()">
                <TransitionGroup name="login" tag="div"
                    class="sm:p-8 p-4 h-full justify-center justify-items-center place-items-center flex flex-col xl:text-2xl sm:text-xl text-sm sm:gap-2 gap-1 relative">
                    <input v-model="loginInfo.username" type="text" :placeholder="namePlaceholder" required key="name"
                        @input="clearError"
                        class="sm:px-4 px-1 sm:rounded-lg rounded-md xl:h-12 xl:w-80 sm:h-8 h-4 sm:w-56 w-32 block text-gray-900 outline outline-1 outline-gray-400 focus:outline focus:outline-2 focus:outline-gray-500" />
                    <input v-model="loginInfo.password" type="password" :placeholder="pwdPlaceholder" required key="pwd"
                        @update="clearError"
                        class="sm:px-4 px-1 sm:rounded-lg rounded-md xl:h-12 xl:w-80 sm:h-8 h-4 sm:w-56 w-32 block text-gray-900 outline outline-1 outline-gray-400 focus:outline focus:outline-2 focus:outline-gray-500" />
                    <input v-if="loginInfo.isRegister" v-model="loginInfo.passwordConfirm" type="password"
                        key="pwdConfirm" placeholder="确认密码" required @update="clearError"
                        class="sm:px-4 px-1 sm:rounded-lg rounded-md xl:h-12 xl:w-80 sm:h-8 h-4 sm:w-56 w-32 block text-gray-900 outline outline-1 outline-gray-400 focus:outline focus:outline-2 focus:outline-gray-500" />
                    <input v-if="loginInfo.isRegister" v-model="loginInfo.token" type="text" placeholder="注册Token"
                        key="token" @update="clearError" required
                        class="sm:px-4 px-1 sm:rounded-lg rounded-md xl:h-12 xl:w-80 sm:h-8 h-4 sm:w-56 w-32 block text-gray-900 outline outline-1 outline-gray-400 focus:outline focus:outline-2 focus:outline-gray-500" />
                    <button type="submit" key="submit"
                        class="rounded-xl xl:h-12 sm:h-8 xl:w-80 sm:w-56 w-32 block text-gray-700 bg-white hover:scale-[1.02] active:scale-[0.98] shadow-md transition duration-200">{{
                            loginInfo.isRegister ? `注册` : `登录` }}</button>
                    <div class="text-red-700 text-left text-base" key="error">{{ errorInfo }}</div>
                    <div class="w-full flex justify-center text-gray-500" key="switch">
                        或
                        <button @click="loginInfo.isRegister = !loginInfo.isRegister; clearError();" type="button"
                            class="text-blue-600 hover:text-blue-400 active:text-blue-800 transition duration-100 sm:ml-4 ml-2">{{
                                loginInfo.isRegister ? `登录` : `注册` }}</button>
                    </div>
                </TransitionGroup>
            </form>
            <div v-else
                class="sm:p-8 p-4 h-full sm:text-3xl text-xl text-gray-700 font-bold flex flex-col justify-center items-center sm:gap-8 gap-4">
                <div class="text-center">欢迎 {{ user!.level === UserLevel.admin ? `管理员` : `用户` }} {{ user!.name }}</div>
                <button @click="clear"
                    class="sm:text-2xl text-base font-normal text-red-700 hover:text-red-800 active:text-red-900 transition duration-150">退出登录</button>
            </div>
        </Transition>
    </div>
</template>

<style>
.login-move {
    transition: transform 0.3s;
}

.login-enter-active {
    transition: all 0.5s ease;
}

.login-leave-active {
    transition: all 0.2s ease;
}

.login-enter-from,
.login-leave-to {
    opacity: 0;
}

.login-leave-active {
    position: absolute;
}
</style>