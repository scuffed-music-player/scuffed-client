<script setup lang="ts">
import Swal from "sweetalert2";
import Draggable from "vuedraggable";
import { v4 } from "uuid";
import { GlobalEvents } from "vue-global-events";
import { ISongData, player } from "../state/player";
import { ui } from "../state/ui";
import { overrideQueue } from "../state/queue";
import { playlists, currentPlaylistId, currentPlaylist } from "../state/playlists";
import { question } from "../helpers/question";
import { request } from "../helpers/request";


function createPlaylist() {
    const _id = v4();

    playlists.value.push({
        _id,
        name: `playlist #${playlists.value.length}`,
        songs: [],
    });

    currentPlaylistId.value = _id; 
}

function addCurrentSong() {
    if (!currentPlaylist.value?.songs.find(s => player.song.id === s.id)) {
        currentPlaylist.value?.songs.push(player.song);
    }
}

async function renamePlaylist() {
    if (!currentPlaylist.value) return;
    currentPlaylist.value.name = await question("Enter new name.", currentPlaylist.value.name);
}

async function deletePlaylist() {
    const removeIndex = playlists.value.findIndex(p => p._id === currentPlaylist.value?._id);

    const { isConfirmed } = await Swal.fire({
        title: `Are you sure you want to delete "${currentPlaylist.value?.name}"?`,
        html: "Due to legal liabilities, we are unable to offer restoration of deleted playlists.",
        icon: "question",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        allowEscapeKey: false,
        allowOutsideClick: false,
    });

    if (removeIndex > -1 && isConfirmed) {
        currentPlaylistId.value = playlists.value[0]?._id;
        playlists.value.splice(removeIndex, 1);
    }
}

async function updateSong(song: ISongData) {
    if (!currentPlaylist.value) return;

    const title = (await question("what's this song called?", song.title || "")).toLowerCase();
    const artist = (await question("who made it?", song.artist || "")).toLowerCase();

    const index = currentPlaylist.value.songs.findIndex(s => s.id === song.id);

    currentPlaylist.value.songs[index] = {
        ...song,
        title: title?.length > 0 ? title : song.title,
        artist: artist?.length > 0 ? artist : song.artist, 
    };
}

async function undownloadSong(song: ISongData) {
    await request("DELETE")(`/api/saves/${song.id}`);
    if (player.song.id === song.id) {
        player.song.downloaded = false;
        song.thumbnail = `https://i.ytimg.com/vi/${song.id}/hqdefault.jpg`;
        const pos = player.audio.currentTime;
        overrideQueue(song);
        player.audio.currentTime = pos;
    }
}

async function deleteSong(song: ISongData) {
    if (!currentPlaylist.value) return;

    const index = currentPlaylist.value?.songs.findIndex(s => s.id === song.id);
    currentPlaylist.value.songs[index] = null as unknown as ISongData;
    currentPlaylist.value.songs = currentPlaylist.value.songs.filter(s => s);
}

async function downloadSong({ id, thumbnail }: ISongData) {
    const songPlaylistId = currentPlaylistId.value;
    const songPlaylist = playlists.value.find(p => p._id === songPlaylistId);

    const res = await request("POST")(`/api/saves/${id}`);
    const { success, thumbnail: newThumbnail } = (await res.json()) as { success: boolean, thumbnail: string };

    const song = songPlaylist?.songs.find(s => s.id === id);

    if (success && song) {
        song.downloaded = true;
        song.thumbnail = newThumbnail || thumbnail;
        const pos = player.audio.currentTime;
        overrideQueue(song);
        player.audio.currentTime = pos;
    } 
}
</script>

<template>
    <GlobalEvents 
        v-if="ui.playlistView.isShowing" 
        @keyup.escape="ui.playlistView.isShowing = false" 
    />
    
    <div class="playlist-section overlay side-left" :class="{ open: ui.playlistView.isShowing }">
        <div class="playlist-view py-6 px-3">
            <div class="overlay-header mb-1">
                <button 
                    class="button is-danger play-btn close-btn mr-5" 
                    @click="ui.playlistView.isShowing = false"
                >
                    <div class="icon">
                        <span class="iconify" data-icon="gg:close" />
                    </div>
                </button>

                <div class="display">
                    <span class="info-display">
                        {{ 
                            playlists.length > 0 ? 
                            `playlists` : 
                            "no playlists" 
                        }}
                    </span>

                    <div class="field has-addons">
                        <p v-if="playlists.length > 0" class="control selector">
                            <div class="select">
                                <select v-model="currentPlaylistId">
                                    <option v-for="playlist in playlists" :key="playlist._id" :value="playlist._id">{{ playlist.name }}</option>
                                </select>
                            </div>
                        </p>
                        <p class="control">
                            <button class="button is-primary" @click="createPlaylist">
                                <span class="iconify" data-icon="gg:play-list-add" />
                                <span class="ml-2 hide-mobile">new playlist</span>
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            <div v-if="currentPlaylist" class="playlist-choices is-flex is-align-items-center my-5">
                <div class="field has-addons icon-choices">
                    <p class="control">
                        <button 
                            class="play-btn button is-primary" 
                            @click="currentPlaylist && overrideQueue(...currentPlaylist.songs)"
                        >
                            <span class="icon">
                                <span class="iconify" data-icon="dashicons:controls-play"></span>
                            </span>
                        </button>
                    </p>
                    <p class="control">
                        <button 
                            class="play-btn button is-link"
                            @click="currentPlaylist && overrideQueue(...[...currentPlaylist.songs].sort(() => 0.5 - Math.random()))"
                        >
                            <span class="icon">
                                <span class="iconify" data-icon="ic:baseline-shuffle"></span>
                            </span>
                        </button>
                    </p>
                </div>
                <div class="field has-addons mb-0 ml-auto">
                    <p 
                        v-if="player.states.playing"
                        class="control"
                    >
                        <button 
                            class="button is-success"
                            @click="addCurrentSong"
                        >
                            <span class="icon">
                                <span class="iconify" data-icon="carbon:music-add"></span>
                            </span>
                        </button>
                    </p>
                    <p class="control">
                        <button class="button is-link" @click="renamePlaylist">
                            <span class="icon">
                                <span class="iconify" data-icon="mdi:playlist-edit"></span>
                            </span>
                        </button>
                    </p>
                    <p class="control">
                        <button class="button is-danger" @click="deletePlaylist">
                            <span class="icon">
                                <span class="iconify" data-icon="gg:trash"></span>
                            </span>
                        </button>
                    </p>
                </div>
            </div>

            <div class="playlist">
                <template v-if="currentPlaylist">
                    <h3 
                        v-if="currentPlaylist.songs?.length === 0"
                        class="is-size-4 mt-3"
                    >
                        no songs in this playlist
                    </h3>

                    <div class="songs-list">
                        <li class="mb-2 is-size-6 song" v-for="element in currentPlaylist.songs" :key="element.id">
                            <div role="button"  @click="overrideQueue(element)" style="cursor: pointer;">
                                <p class="is-size-6">{{ element.title }}</p>
                                <p class="is-size-7">{{ element.artist }}</p>
                            </div>

                            <div class="ml-auto mr-2 field" style="min-width: 78.75px;">
                                <button class="play-btn button is-ghost is-small" @click="updateSong(element)">
                                    <span class="icon">
                                        <span class="iconify" data-icon="mdi:playlist-edit"></span>
                                    </span>
                                </button>
                                <button v-show="!element.downloaded" class="play-btn active button is-ghost is-small" @click="downloadSong(element)">
                                    <span class="icon">
                                        <span class="iconify" data-icon="feather:download"></span>
                                    </span>
                                </button>
                                <button v-show="element.downloaded" class="play-btn info button is-ghost is-small" @click="undownloadSong(element)">
                                    <span class="icon">
                                        <span class="iconify" data-icon="feather:check-square"></span>
                                    </span>
                                </button>
                                <button class="play-btn delete-btn button is-ghost is-small" @click="deleteSong(element)">
                                    <span class="icon">
                                        <span class="iconify" data-icon="gg:trash"></span>
                                    </span>
                                </button>
                            </div>
                        </li>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
.playlist {
    flex: 1;
    overflow-y: scroll;
}

.field.has-addons {
    overflow: hidden;
    border-radius: 4px;
}

.song {
    display: flex;
    align-items: center;
}

.song > span {
    cursor: pointer;
}

.control.selector .select, .control.selector select {
    width: 100%;
}
</style>