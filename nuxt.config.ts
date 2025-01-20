// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    css: ["~/assets/css/main.css"],
    modules: [
        "@nuxtjs/tailwindcss",
        "@nuxt/icon",
        "nuxt-auth-utils",
        "@prisma/nuxt",
    ],
    devServer: {
        host: "0.0.0.0",
        https: {
            key: "./server.key",
            cert: "./server.crt",
        },
    },
    app: {
        pageTransition: { name: "fade", mode: "out-in" },
        head: {
            title: "苏共最高位战",
        },
    },
    runtimeConfig: {
        registerToken: process.env.REGISTER_TOKEN,
    },
    vite: {
        resolve: {
            alias: {
                ".prisma/client/index-browser":
                    "./node_modules/.prisma/client/index-browser.js",
            },
        },
    },
    icon: {
        clientBundle: {
            icons: [
                "stash:check-solid",
                "stash:chevron-up-duotone",
                "svg-spinners:180-ring-with-bg",
                "stash:shield-user",
                "stash:person",
                "stash:burger-classic",
            ],
            scan: true,
        },
    },
});
