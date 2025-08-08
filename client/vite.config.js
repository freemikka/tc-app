import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import visualizer from "vite-bundle-analyzer";

import path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        visualizer({
            open: true, // automatically open the report in your browser
            gzipSize: true, // show gzipped sizes
            brotliSize: true, // show brotli sizes
        }),
    ],
    define: {
        "import.meta.env": {}, // Ensures Vite environment variables are recognized
    },
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:5000",
                changeOrigin: true,
            },
        },
    },
    /* shadcn */
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
