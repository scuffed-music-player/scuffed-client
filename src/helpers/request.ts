export const BASE_URL = "";

export const request = (method: string) => (endpoint: string, init?: RequestInit) => 
    fetch(`${BASE_URL}${endpoint}`, {
        ...init,
        method,
        headers: {
            ...init?.headers,
            "Content-Type": "application/json",
        }
    });