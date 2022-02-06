import { reactive } from "vue";

export const BASE_URL = "http://localhost:8080";

export const user = reactive({
    token: undefined as string | undefined,
});

//@ts-ignore
window.__user = user;

export const request = (method: string) => (endpoint: string, init?: RequestInit) => fetch(`${BASE_URL}${endpoint}`, {
    ...init,
    method,
    headers: {
        ...init?.headers,
        "Content-Type": "application/json",
        Authorization: user.token ? `Bearer ${user.token}` : undefined as any,  
    }
})