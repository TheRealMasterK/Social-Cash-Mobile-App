const commonEslintConfig = require("./.eslintrc.common");

module.exports = {
    ...commonEslintConfig,
    env: {
        ...commonEslintConfig.env,
    },
    ignorePatterns: [
        "config/**/*.js",
        "node_modules/**/*.ts",
        "coverage/lcov-report/*.js",
        "src/graphql/*.ts*",
        "src/types/*.d.ts",
        "src/**/*.test.ts",
        "src/*.js",
        "*.js",
    ],

    rules: {
        ...commonEslintConfig.rules,
        "import/no-extraneous-dependencies": "off",
        "jsx-a11y/anchor-is-valid": "off",
        "jsx-a11y/interactive-supports-focus": "off",
        "jsx-a11y/click-events-have-key-events": "off",
        "no-console": "off",
        "react-hooks/exhaustive-deps": [
            "error",
            {
                additionalHooks: "(useAnimatedStyle|useDerivedValue|useAnimatedProps)",
            },
        ],
    },
};
