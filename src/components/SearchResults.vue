<script setup lang="ts">
import { GlobalEvents } from "vue-global-events";
import { ui } from "../state/ui";
</script>

<template>
    <GlobalEvents 
        v-if="ui.searchResults.isShowing" 
        @keyup.escape="ui.searchResults.isShowing = false" 
    />
    
    <div class="search-section overlay" :class="{ open: ui.searchResults.isShowing }">
        <div class="py-6 px-3">
            <div class="overlay-header mb-1">
            <button 
                class="button is-danger play-btn close-btn mr-5 mb-5" 
                @click="ui.searchResults.isShowing = false"
            >
                <div class="icon">
                    <span class="iconify" data-icon="gg:close" />
                </div>
            </button>

            <div class="display">
                <span class="info-display">
                    search results for
                </span>

                <h3 class="is-size-4">"big shaq mans not hot"</h3>
            </div>
        </div>
        </div>
    </div>
</template>

<style scoped>
</style>