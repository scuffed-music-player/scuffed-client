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
        class="song-backdrop"
        :class="{ zoomed: ui.thumbnailZoomed }"
        :style="`background-image: url(${thumbnailURL});`" 
    />
</template>

<style scoped>
.song-backdrop {
    background-size: cover;
    background-position: top center;
    filter: blur(15px);
    transform: scale(1.6);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    transition: transform 0.25s;
}

.song-backdrop.zoomed {
    transform: scale(2);
}
</style>