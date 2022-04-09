<script setup lang="ts">
import Swal from "sweetalert2";
import { ref } from "vue";
import { ISongData, player } from "../state/player";
import { ui, hideMainView } from "../state/ui";
import { request } from "../helpers/request";

const query = ref("");
const searchInput = ref<HTMLInputElement | null>(null);

async function loadSong() {
    const q = encodeURIComponent(query.value.trim().toLowerCase());

    searchInput.value?.blur();
    const dataResponse = await request("GET")(`/api/search/${q}`);
    const videoData = await dataResponse.json() as { success: boolean, songs: ISongData[] };

    if (!videoData.success) {
        player.states.loading = false;
        return await Swal.fire("couldn't find a song.", "Try some different search criteria, that search didn't work.", "error");
    }

    ui.searchResults.query = query.value;
    ui.searchResults.results = videoData.songs;
    ui.searchResults.isShowing = true;
}
</script>

<template>
    <div 
        class="app-heading is-flex has-background-black" 
        style="height: 43.75px; align-items: stretch;" 
        :class="{ playlists: hideMainView }"
    >
        <p class="px-4 my-auto">music player</p>
        <button 
            class="button is-black is-medium ml-auto" 
            style="height: 100%;" 
            @click="ui.playlistView.isShowing = true"
        >
            <div class="icon mr-1">
                <span class="iconify" data-icon="gg:play-list" />
            </div>

            <span class="is-size-6">library</span>
        </button>
    </div>
    <div class="searchbar" :class="{ playlists: hideMainView }">
        <form class="field has-addons" @submit.prevent="loadSong">
            <p class="control input-conent">
                <input 
                    class="input is-medium" 
                    v-model="query" 
                    ref="searchInput"
                    placeholder="search a song" 
                    required
                />
            </p>
            <p class="control ml-1">
                <button 
                    class="button is-success is-medium" 
                    type="submit"
                >
                    <div class="icon">
                        <span class="iconify" data-icon="gg:search"></span>
                    </div>
                </button>
            </p>
        </form>
    </div>
</template>

<style scoped>
.searchbar {
    display: flex;
    align-items: center;
    background: #161616;
}

.searchbar, .app-heading {
    opacity: 1;
    transition: opacity 0.5s;
}

.playlists {
    opacity: 0;
}

.field, .control.input-conent {
    flex: 1;
}

input {
    z-index: 0;
}

button {
    z-index: 2;
}

input, button {
    border-radius: 0 !important;
}
</style>