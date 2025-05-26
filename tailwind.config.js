/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                brand: {
                    DEFAULT: "var(--background-color)",
                    blue: "var(--blue)",
                    ["light-blue"]: "var(--light-blue)",
                    ["dark-blue"]: "var(--dark-blue)",
                    ["light-gray"]: "var(--light-gray)",
                    gray: "var(--gray)",
                    ["dark-gray"]: "var(--dark-gray)",
                    yellow: "var(--yellow)",
                },
            },
        },
    },
    plugins: [],
};
