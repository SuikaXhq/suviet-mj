// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    modules: [
        "@nuxtjs/tailwindcss",
        "@nuxt/icon",
        "nuxt-auth-utils",
        "@prisma/nuxt",
    ],
    app: {
        pageTransition: { name: "fade", mode: "out-in" },
        head: {
            title: "苏共最高位战",
        },
    },
    runtimeConfig: {
        registerToken: process.env.REGISTER_TOKEN,
    },
});
