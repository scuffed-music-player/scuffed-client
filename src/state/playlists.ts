import { ref, watchEffect, computed } from "vue";
import { request } from "../helpers/request";
import { ISongData } from "./player";

export interface IPlaylist {
    _id: string;
    name: string;
    songs: ISongData[];
}

export const playlists = ref<IPlaylist[]>([]);
//@ts-ignore
window.__playlists = playlists;

export const currentPlaylistId = ref("");
export const currentPlaylist = computed(() => playlists.value.find(p => p._id == currentPlaylistId.value));

(async () => {
    const playlistsRes = await request("GET")("/api/playlists");
    const { success, playlists: serverPlaylists } = await playlistsRes.json();
    if (success) {
        playlists.value = serverPlaylists;
        currentPlaylistId.value = playlists.value[0]?._id || "";
    }
    
    watchEffect(() => request("POST")("/api/playlists", {
        body: JSON.stringify({ playlists: playlists.value })
    }));
})();