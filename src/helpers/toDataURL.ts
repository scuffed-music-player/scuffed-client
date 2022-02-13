import { BASE_URL } from "./request";

export const toDataURL: (url: string) => Promise<string | undefined> = async (url: string) => {
    if (url.startsWith("data:")) {
        return Promise.resolve(url);
    } else {
        const response = await fetch(`${BASE_URL}/api/proxy/${encodeURIComponent(url)}`);
        const blob = await response.blob();
        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result?.toString());
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }
}