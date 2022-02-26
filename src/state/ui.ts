import { reactive, watchEffect } from "vue";
import { player } from "./player";

export const ui = reactive({
    thumbnailZoomed: false,
    playlistView: false,
    croppedImages: {
        landscape: "",
        square: "",
    }
});

const canvas = document.querySelector("canvas");
watchEffect(() => {
    if (!player.song.thumbnail) return;


})