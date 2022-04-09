<script setup lang="ts">
import { GlobalEvents } from "vue-global-events";
import { ui } from "../state/ui";
import { overrideQueue } from "../state/queue";
import { reactive, ref } from "vue";

const tabs = reactive(["songs", "albums", "playlists"]);
const currentTab = ref("songs");
</script>

<template>
    <GlobalEvents 
        v-if="ui.searchResults.isShowing" 
        @keyup.escape="ui.searchResults.isShowing = false" 
    />
    
    <div class="search-section overlay side-right" :class="{ open: ui.searchResults.isShowing }">
        <div class="py-6 px-3">
            <div class="overlay-header mb-1">
                <button 
                    class="button is-info play-btn close-btn mr-5 mb-5" 
                    @click="ui.searchResults.isShowing = false"
                >
                    <div class="icon">
                        <span class="iconify" data-icon="mdi:exit-to-app" data-rotate="180deg" />
                    </div>
                </button>

                <div class="is-flex-grow-1">
                    <div class="display">
                        <span class="info-display">
                            results for
                        </span>

                        <h3 class="is-size-4">"{{ ui.searchResults.query.toLowerCase() }}"</h3>
                    </div>

                    <nav class="tabs">
                        <div 
                            v-for="(tab, i) in tabs" :key="i"
                            :style="`--border: ${currentTab === tab ? '#48c78e' : 'white'}`"
                            @click="currentTab = tab"
                            role="button"
                        >
                            <span class="is-size-5">{{ tab }}</span>
                        </div>
                    </nav>
                </div>
            </div>
            
            <div class="result-container">
                <div 
                    v-for="result of ui.searchResults.songs" 
                    :key="(result.id as string)" 
                    class="result"
                    role="button"
                    @click="overrideQueue(result)"
                    v-show="currentTab === 'songs'"
                >
                    <div class="thumbnail mr-5" :style="`background-image: url('${result.thumbnail}');`" alt="" />
                    <div>
                        <h1 class="is-size-6 mr-2">{{ result.title }}</h1>
                        <h2 class="is-size-7">{{ result.artist }}</h2>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.search-section > div {
    display: flex;
}

nav {
    display: flex;
    margin-left: -56px;
}
nav.tabs > div {
    flex: 1;
    text-align: center;
    border-bottom: 1px solid var(--border);
    padding: 0.75rem;
    cursor: pointer;
    margin-bottom: 1rem;
}

.result-container {
    flex: 1;
    overflow-y: scroll;
}

.result {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin: 1rem 0;
}

.thumbnail {
    min-width: 56.25px;
    height: 56.25px;
    background-size: 100px calc(calc(100px / 0.75) * calc(9 / 16));
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.9);
    background-position: center center;
    border-radius: 10px;
}
</style>