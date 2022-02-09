import { createApp } from "vue";
import App from "./App.vue";
import "@iconify/iconify";
//@ts-ignore
import { registerSW } from "virtual:pwa-register";

registerSW({ immediate: true });
createApp(App).mount("#app");