<script setup lang="ts">
import Swal from "sweetalert2";
import { ref } from "vue";
import { ISongData, player } from "../state/player";
import { overrideQueue } from "../state/queue";
import { ui } from "../state/ui";
import { request } from "../state/user";

const query = ref("");

async function loadSong() {
    player.states.playing = false;
    player.states.loading = true;
    player.audio?.pause();

    const q = encodeURIComponent(query.value.trim().toLowerCase());

    const dataResponse = await request("GET")(`/api/search/${q}%20audio`);
    const videoData = await dataResponse.json() as { success: boolean, song: ISongData };

    if (!videoData.success) {
        player.states.loading = false;
        return await Swal.fire("couldn't find a song.", "Try some different search criteria, that search didn't work.", "error");
    }

    overrideQueue({
        ...videoData.song,
        title: (videoData.song.title || "lmao idk song lol")
            .toLowerCase()
            .replaceAll("&quot;", "\"")
            .replaceAll("&amp;", "&")
            .replaceAll("[official audio]", "")
            .replaceAll("(official audio)", "")
            .replaceAll("full song", "")
            .replaceAll("(audio)", "")
            .replaceAll("audio", "")
            .replaceAll("&#39;", "'")
            .replaceAll("(lyrics)", "")
            .replaceAll("(official music video)", "")
            .replaceAll("(official music audio)", "")
            .replaceAll("(official lyric video)", "")
            .replaceAll("(lyric video)", "")
            .replaceAll("(official)", "")
            .replaceAll("(pseudo video)", "")
            .replaceAll("()", "")
            .replaceAll("[]", "")
            .replaceAll("「amv」", "")
            .replaceAll("[amv]", "")
            .replaceAll("[official lyric video]", "")
            .trim(),
    });
}
</script>

<template>
    <div class="searchbar" :class="{ playlists: ui.playlistView || ui.albumView }">
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
            <!-- <p class="control">
                <button 
                    class="button is-link is-medium hide-mobile"
                    @click.prevent="ui.albumView = true"
                >
                    albums
                </button>
            </p> -->
        </form>
    </div>
    <div class="show-mobile-flex" :class="{ playlists: ui.playlistView || ui.albumView }">
        <button class="button is-flex-grow-1 is-dark is-active" @click="ui.playlistView = true">my library</button>
        <!-- <button class="button is-flex-grow-1 is-small is-dark is-active" @click="ui.albumView = true">online albums</button> -->
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