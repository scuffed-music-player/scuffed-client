import localforage from "localforage";
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

export const playlists = ref<IPlaylist[]>([]);
//@ts-ignore
window.__playlists = playlists;

export const currentPlaylistId = ref("");
export const currentPlaylist = computed(() => playlists.value.find(p => p._id == currentPlaylistId.value));

(async () => {
    playlists.value = await localforage.getItem<IPlaylist[]>("playlists") || [];
    currentPlaylistId.value = playlists.value[0]?._id || "";
})();

watchEffect(() => localforage.setItem("playlists", JSON.parse(JSON.stringify(playlists.value))));