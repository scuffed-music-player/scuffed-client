import { ref, watchEffect, computed } from "vue";
import { ISongData } from "./player";

export interface IPlaylist {
    _id: string;
    name: string;
    songs: ISongData[];
    album: boolean;
    albumData?: {
        name: string;
        artist: string;
    }
}

export const playlists = ref<IPlaylist[]>(JSON.parse(localStorage.getItem("playlists") || "[]"));

watchEffect(() => localStorage.setItem("playlists", JSON.stringify(playlists.value)));

export const currentPlaylistId = ref(playlists.value[0]?._id || "");

export const currentPlaylist = computed(() => playlists.value.find(p => p._id == currentPlaylistId.value));