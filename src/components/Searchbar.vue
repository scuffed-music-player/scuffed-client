<script setup lang="ts">
import Swal from "sweetalert2";
import { ref } from "vue";
import { ISongData, player } from "../state/player";
import { overrideQueue } from "../state/queue";
import { ui, hideMainView } from "../state/ui";
import { request } from "../helpers/request";

const query = ref("");

async function loadSong() {
    const q = encodeURIComponent(query.value.trim().toLowerCase());

    const dataResponse = await request("GET")(`/api/search/${q}`);
    const videoData = await dataResponse.json() as { success: boolean, song: ISongData };

    if (!videoData.success) {
        player.states.loading = false;
        return await Swal.fire("couldn't find a song.", "Try some different search criteria, that search didn't work.", "error");
    }

    overrideQueue(videoData.song);
}
</script>

<template>
    <div class="show-mobile-flex has-background-black px-4" style="height: 43.75px;" :class="{ playlists: hideMainView }">
        <p style="align-self: center;">music player</p>
    </div>
    <div class="searchbar" :class="{ playlists: hideMainView }">
        <b class="is-size-5 mr-5">music player</b>
        <form class="field has-addons" @submit.prevent="loadSong">
            <p class="control input-conent">
                <input 
                    class="input is-medium" 
                    v-model="query" 
                    placeholder="search a song" 
                    required
                />
            </p>
            <p class="control">
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
    <div class="show-mobile-flex" :class="{ playlists: hideMainView }">
        <button 
            class="button is-flex-grow-1 is-dark is-active" 
            @click="ui.playlistView.isShowing = true"
        >
            my library
        </button>
    </div>
</template>

<style scoped>
.searchbar {
    display: flex;
    align-items: center;
    padding: 1rem;
}

.searchbar, .show-mobile-flex {
    opacity: 1;
    transition: opacity 0.5s;
}

.playlists {
    opacity: 0;
}

.field, .control.input-conent {
    flex: 1;
}

@media screen and (max-width: 800px) {
    .is-size-5 {
        display: none;
    }

    .searchbar {
        padding: 0;
    }

    input, button {
        border-radius: 0 !important;
    }
}
</style>