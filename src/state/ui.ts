import { computed, reactive } from "vue";
import { ISongData } from "./player";

export const ui = reactive({
    thumbnailZoomed: false,
    playlistView: {
        isShowing: false,
    },
    searchResults: {
        isShowing: true,
        results: [] as ISongData[]
    }
});

export const hideMainView = computed(() => 
    ui.playlistView.isShowing || 
    ui.searchResults.isShowing
);