import { createApp } from "vue";
import App from "./App.vue";
import "@iconify/iconify";
//@ts-ignore
import { registerSW } from "virtual:pwa-register";
import { recursivePrompt } from "./helpers/recursivePrompt";
import { request, user } from "./state/user";

registerSW({ immediate: true });
createApp(App).mount("#app");

(async () => {
    const username = await recursivePrompt("Username please?", "");
    const password = await recursivePrompt("Password please?", "");

    const res = await request("POST")("/api/login", {
        body: JSON.stringify({ username, password })
    });

    const data = await res.json() as { success: boolean, token: string };

    if (data.success) {
        user.token = data.token;
    } else {
        location.reload();
    }
})();