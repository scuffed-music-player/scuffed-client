<script setup lang="ts">
import { player } from "../state/player";
import { ui, hideMainView } from "../state/ui";
</script>

<template>
    <div 
        class="song-display has-text-centered"
        :class="{ playlists: hideMainView }"
    >
        <div>
            <div 
                class="thumbnail"
            >
                <img v-if="ui.thumbnail !== ''" :src="ui.thumbnail" alt="cover">
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
    height: var(--height);
    box-shadow: 0 0 50px black;
    background-color: #090909;
    transition: width 0.25s, transform 0.25s;
    width: var(--height);
    border-radius: 10px;
}

.thumbnail img {
    width: 100%;
    transform: none;
    transition: transform 0.25s;
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

.title {
    margin: 0 2rem;
    font-size: 1.5rem;
}
</style>