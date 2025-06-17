import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
    base: mode === "production" ? "/frontend/" : "/",
    build: {
        sourcemap: true,
    },
    server: {
        allowedHosts: true,
    },
    plugins: [react()],
    resolve: {
        alias: {
            "@hooks": path.resolve(__dirname, "src/hooks"),
            "@api": path.resolve(__dirname, "src/api"),
            "@components": path.resolve(__dirname, "src/components"),
            "@charts": path.resolve(__dirname, "src/charts"),
            "@pages": path.resolve(__dirname, "src/pages"),
            "@utils": path.resolve(__dirname, "src/utils"),
            "@assets": path.resolve(__dirname, "src/assets"),
            "@public": path.resolve(__dirname, "public"),
            // Add others as needed
        },
    },
}));
