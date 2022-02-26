<script setup lang="ts">
import { ref, computed } from "vue";
import { player } from "../state/player";
import { prevSong, nextSong } from "../state/queue";

function formatTime(time: number) {
    const min = Math.floor(time / 60).toString();
    const sec = Math.floor(time % 60).toString();

    return `${min}:${sec.length < 2 ? `0${sec}` : sec}`;
}

const showPlayButton = computed<"on" | "disabled" | "off">(() => {
    if (player.states.playing) {
        if (player.states.loading) {
            return "disabled";
        } else if (player.states.paused) {
            return "on";
        } else {
            return "off";
        }
    } else {
        return "disabled";
    }
});

const progressBar = ref<HTMLDivElement | null>(null);

function changePosition({ clientX }: MouseEvent) {
    if (
        !player.song.downloaded || 
        !progressBar.value
    ) return;

    if (player.states.playing) {
        const clickPos = clientX - progressBar.value.offsetLeft;
        const total = progressBar.value.clientWidth;
        const percent = clickPos / total;
        const newPos = player.audio.duration * percent;
        player.audio.currentTime = newPos;
    }   
}
</script>

<template>
    <div class="control-bar">
        <div class="controls pt-4 px-4">
            <div class="buttons">
                <button 
                    class="play-btn mx-3 button is-ghost is-medium" 
                    @click="player.audio && (player.audio.currentTime = 0);"
                    :disabled="showPlayButton === 'disabled'"
                >
                    <span class="icon">
                        <span class="iconify" data-icon="ic:sharp-restart-alt" />
                    </span>
                </button>
                <button 
                    class="play-btn mr-3 button is-ghost is-medium" 
                    @click="prevSong"
                    :disabled="showPlayButton === 'disabled'"
                >
                    <span class="icon">
                        <span class="iconify" data-icon="bx:bx-rewind" />
                    </span>
                </button>
                <button 
                    v-show="showPlayButton !== 'off'"
                    class="play-btn mr-3 button is-ghost is-medium" 
                    @click="player.states.paused = false"
                    :disabled="showPlayButton === 'disabled'"
                >
                    <span class="icon">
                        <span class="iconify" data-icon="gg:play-button-o" />
                    </span>
                </button>
                <button 
                    v-show="showPlayButton === 'off'"    
                    class="play-btn mr-3 button is-ghost is-medium" 
                    @click="player.states.paused = true"
                >
                    <span class="icon">
                        <span class="iconify" data-icon="gg:play-pause-o" />
                    </span>
                </button>
                <button 
                    class="play-btn mr-3 button is-ghost is-medium" 
                    @click="nextSong"
                    :disabled="showPlayButton === 'disabled'"
                >
                    <span class="icon">
                        <span class="iconify" data-icon="bx:bx-fast-forward" />
                    </span>
                </button>
                <button 
                    class="play-btn mr-3 button is-ghost is-medium" 
                    @click="player.states.looping = !player.states.looping"
                    :class="{ active: player.states.looping }"
                >
                    <span class="icon">
                        <span class="iconify" data-icon="ic:outline-repeat"></span>
                    </span>
                </button>
            </div>
        </div>
        <div class="time-display p-4">
            <span>{{ formatTime(player.position) }}</span>

            <div 
                class="progress-bar mx-4" 
                @click="changePosition"
                ref="progressBar"
                :style="{ cursor: player.song.downloaded ? 'pointer' : '' }"
            >
                <div
                    class="progress-filler"
                    :style="`
                        width: ${(player.audio ? player.position / player.audio.duration : 0) * 100}%;
                        background: ${player.song.downloaded ? '#48c78e' : 'white'};
                    `"
                ></div>

                <div 
                    class="progress-gauge"
                />
            </div>

            <span>{{ formatTime(player.audio?.duration || 0) }}</span>
        </div>
    </div>
</template>

<style scoped>
.control-bar {
    box-shadow: 0 -10px 50px rgba(0, 0, 0, 0.616);
    background: #161616;
}

.time-display {
    display: flex;
    align-items: center;
    height: 3.875rem;
}

.controls {
    display: flex;
    align-items: center;
    justify-content: center;
}

.checkbox.loop:hover {
    color: white;
}

.progress-bar {
    flex: 1;
    background: rgb(46, 46, 46);
    border-radius: 50px;
    height: 15px;
    overflow: hidden;
    position: relative;
}

.progress-bar > div {
    display: inline-block;
}

.progress-filler {
    background: white;
    border-radius: 50px;
    height: 100%;
}

.progress-gauge {
    background: white;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    position: relative;
    right: 15px;
    border: 3px solid #48c78e;
}

.play-toggle {
    width: 50px;
}
</style>