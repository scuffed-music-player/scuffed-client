<script setup lang="ts">
import { ui } from "../state/ui";
</script>

<template>
    <div
        class="song-backdrop"
        :style="`background-${ui.thumbnail !== '' ? 'image' : 'color'}: ${ui.thumbnail !== '' ? `url(${ui.thumbnail})` : '#1f3b2e'};`" 
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

@media screen and (max-width: 600px) {
    .song-backdrop {
        transform: scale(2);
    }
}
</style>