import { reactive } from "vue";

export const BASE_URL = process.env.NODE_ENV === "production" ?
    "http://localhost:6969" :
    "http://localhost:8080";

export const user = reactive({
    token: undefined as string | undefined,
});

export const request = (method: string) => (endpoint: string, init?: RequestInit) => fetch(`${BASE_URL}${endpoint}`, {
    ...init,
    method,
    headers:  {
        "Content-Type": "application/json",
        Authorization: user.token ? `Bearer ${user.token}` : undefined as any,  
    }
})