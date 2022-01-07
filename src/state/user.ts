import { reactive } from "vue";

export const user = reactive({
    serverURL: process.env.NODE_ENV === "production" ? 
        "http://localhost:6969" : 
        "http://localhost:8080",
});