/** @type {import('tailwindcss').Config} */
const nativewind = require("nativewind/tailwind/native");
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx,html}"],
    theme: {
        extend: {},
    },
    plugins: [nativewind()],
};
