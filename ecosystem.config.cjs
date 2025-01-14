module.exports = {
    apps: [
        {
            name: "SuvietMJ",
            port: "33455",
            script: "./.output/server/index.mjs",
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};
