export default defineNuxtRouteMiddleware((to, from) => {
    const { loggedIn } = useUserSession();
    if (to.path !== "/" && !loggedIn.value) {
        alert("请先登录");
        return navigateTo("/");
    }
});
