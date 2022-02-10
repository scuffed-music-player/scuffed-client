import { BASE_URL } from "./request";

export const toDataURL: (url: string) => Promise<string | undefined> = (url: string) => 
    fetch(`${BASE_URL}/api/proxy/${encodeURIComponent(url)}`)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result?.toString())
        reader.onerror = reject
        reader.readAsDataURL(blob)
    }));