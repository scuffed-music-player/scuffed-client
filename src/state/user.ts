import { reactive } from "vue";

export const BASE_URL = process.env.NODE_ENV === "production" ?
    "https://music-player-app-338003.uw.r.appspot.com/" :
    "http://localhost:8080";

export const user = reactive({
    token: undefined as string | undefined,
});

//@ts-ignore
window.__user = user;

export const request = (method: string) => (endpoint: string, init?: RequestInit) => fetch(`${BASE_URL}${endpoint}`, {
    ...init,
    method,
    headers:  {
        "Content-Type": "application/json",
        Authorization: user.token ? `Bearer ${user.token}` : undefined as any,  
    }
})