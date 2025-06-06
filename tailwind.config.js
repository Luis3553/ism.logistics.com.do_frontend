/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                brand: {
                    DEFAULT: "#f3f6f9",
                    blue: "#049cdb",
                    ["light-blue"]: "#cdebf8",
                    ["dark-blue"]: "#005174",
                    ["light-gray"]: "#f3f4f6",
                    gray: "#6d7080",
                    ["dark-gray"]: "#4c5058",
                    yellow: "#ff9800",
                },
            },
        },
    },
    plugins: [],
};
