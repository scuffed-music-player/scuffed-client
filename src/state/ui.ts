import { computed, reactive, watchEffect } from "vue";
import { BASE_URL } from "../helpers/request";
import { player, ISongData } from "./player";

export const ui = reactive({
    thumbnail: "",
    playlistView: {
        isShowing: false,
    },
    searchResults: {
        query: "",
        isShowing: false,
        songs: [] as ISongData[]
    }
});

const cropCanvas = (document.getElementById("cropCanvas") as HTMLCanvasElement);
const cropCtx = cropCanvas.getContext("2d") as CanvasRenderingContext2D;
cropCanvas.width = 480;
cropCanvas.height = 270;

watchEffect(() => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = `${BASE_URL}/api/proxy/${encodeURIComponent(player.song.thumbnail)}`;
    image.addEventListener("load", () => {
        cropCtx.clearRect(0, 0, cropCanvas.width, cropCanvas.height);
        cropCtx.drawImage(image, 0, 45, 480, 270, 0, 0, 480, 270);
        ui.thumbnail = cropCanvas.toDataURL();
    });
});

export const hideMainView = computed(() => 
    ui.playlistView.isShowing || 
    ui.searchResults.isShowing
);