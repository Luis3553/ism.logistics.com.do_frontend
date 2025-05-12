import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    build: {
        sourcemap: true,
    },
    base: "/",
    server: {
        allowedHosts: true,
    },
    plugins: [react(), tailwindcss()],
});
