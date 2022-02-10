import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            manifest: {
                name: "music player",
                display: "fullscreen",
                short_name: "music player",
                start_url: "/",
                background_color: "#161616",
                description: ":0",
                icons: [
                    { src: "/icons/icon-144.png", sizes: "144x144", type: "image/png", },
                    { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", }
                ]
            },
            registerType: "prompt"
        }),
    ],
    server: {
        port: 3000
    }
});
