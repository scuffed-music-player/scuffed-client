import { computed, reactive, watchEffect } from "vue";
import { player, ISongData } from "./player";

export const ui = reactive({
    thumbnail: "",
    playlistView: {
        isShowing: false,
    },
    searchResults: {
        query: "",
        isShowing: false,
        results: [] as ISongData[]
    }
});

const cropCanvas = (document.getElementById("cropCanvas") as HTMLCanvasElement);
const cropCtx = cropCanvas.getContext("2d") as CanvasRenderingContext2D;
cropCanvas.width = 480;
cropCanvas.height = 270;

watchEffect(() => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = player.song.thumbnail;
    image.addEventListener("load", () => {
        cropCtx.clearRect(0, 0, cropCanvas.width, cropCanvas.height);
        cropCtx.drawImage(image, 0, 45, 480, 270, 0, 0, 480, 270);
        ui.thumbnail = cropCanvas.toDataURL();
        console.log(ui.thumbnail);
    });
});

export const hideMainView = computed(() => 
    ui.playlistView.isShowing || 
    ui.searchResults.isShowing
);