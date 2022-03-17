<script setup lang="ts">
import SearchBar from "./components/Searchbar.vue";
import SongDisplay from "./components/SongDisplay.vue";
import ControlBar from "./components/ControlBar.vue";
import SongBackdrop from "./components/SongBackdrop.vue";
import PlaylistView from "./components/PlaylistView.vue";
import SearchResults from "./components/SearchResults.vue";
</script>

<template>
    <SongBackdrop />
    <main>
        <SearchBar />
        <SongDisplay />
        <ControlBar />
    </main>
    <PlaylistView />
    <SearchResults />
</template>

<style>
html {
    width: 100%;
    height: 100vh;
    position: relative;
}

body, html {
    overflow: hidden !important;
    background: black;
}

* {
    font-family: "IBM Plex Mono", Consolas, "Courier New", monospace !important;
}

:not(select):not(option):not(path) {
    color: white !important;
}

main {
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    align-self: stretch;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>
