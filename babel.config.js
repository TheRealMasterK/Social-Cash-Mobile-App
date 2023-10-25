module.exports = function (api) {
    api.cache(true);

    const presets = ["babel-preset-expo"];
    const plugins = [
        "@babel/plugin-transform-export-namespace-from",
        "react-native-reanimated/plugin",
        "expo-router/babel",
        "nativewind/babel",
    ];

    if (process.env.NODE_ENV === "production") {
        // Plugin to remove console statements in production build. Console statements effect performance of the app.
        plugins.push("babel-plugin-transform-remove-console");
    }

    return {
        presets,
        plugins,
    };
};
