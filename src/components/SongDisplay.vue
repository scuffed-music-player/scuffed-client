<script setup lang="ts">
import { computed } from "vue";
import { player } from "../state/player";
import { ui } from "../state/ui";

const thumbnailURL = computed(() => player.states.playing ?
    player.song?.thumbnail :
    "https://via.placeholder.com/356x200"
);
</script>

<template>
    <div 
        class="song-display has-text-centered"
        :class="{ playlists: ui.playlistView }"
    >
        <div>
            <div 
                class="thumbnail"
                :class="{ zoomed: ui.thumbnailZoomed }"
                @click="ui.thumbnailZoomed = !ui.thumbnailZoomed"
            >
                <img :src="thumbnailURL || ''" alt="cover">
            </div>
            <br><br>
            <h1 class="title is-3">
                {{ player.title }}
            </h1>
        </div>
    </div>
</template>

<style scoped>
.thumbnail {
    --height: 200px;
    display: inline-flex;
    overflow: hidden;
    justify-content: center;
    align-items: center;
    width: calc(calc(16 / 9) * var(--height));
    height: var(--height);
    border-radius: 30px;
    box-shadow: 0 0 50px rgba(0, 0, 0, 0.9);
    transition: width 0.25s, transform 0.25s;
    cursor: pointer;
}

.thumbnail:hover {
    transform: scale(1.125);
}

.thumbnail img {
    width: 100%;
    transform: none;
    transition: transform 0.25s;
}

.thumbnail.zoomed {
    width: var(--height);
    border-radius: 10px;
}

.thumbnail.zoomed img {
    transform: scale(calc(calc(16 / 9) + 0.02));
}

.song-display, .song-display > div {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: 100vw;
    align-self: center;
    opacity: 1;
    transition: 0.5s opacity;
}

.song-display.playlists > div {
    opacity: 0;
}
</style>