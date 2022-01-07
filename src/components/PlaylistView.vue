<script setup lang="ts">
import { v4 } from "uuid";
import { GlobalEvents } from "vue-global-events";
import { ISongData, player } from "../state/player";
import { ui } from "../state/ui";
import { overrideQueue } from "../state/queue";
import { playlists, currentPlaylistId, currentPlaylist } from "../state/playlists";
import { recursivePrompt } from "../helpers/recursivePrompt";
import { user } from "../state/user";
import Swal from "sweetalert2";
import Draggable from "vuedraggable";

function createPlaylist() {
    const _id = v4();

    playlists.value.push({
        _id,
        name: `playlist #${playlists.value.length}`,
        songs: [],
        album: false
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
    currentPlaylist.value.name = await recursivePrompt("Enter new name.", currentPlaylist.value.name);
}

async function deletePlaylist() {
    const removeIndex = playlists.value.findIndex(p => p._id === currentPlaylist.value?._id);

    const { isConfirmed } = await Swal.fire({
        title: `Are you sure you want to delete "${currentPlaylist.value?.name}"?`,
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

    const title = (await recursivePrompt("What's this song called?", song.title || "")).toLowerCase();
    const thumbnail = await recursivePrompt(
        "Link to the cover art? (if you don't know don't change the default)", 
        song.thumbnail || ""
    );

    const index = currentPlaylist.value.songs.findIndex(s => s.id === song.id);

    currentPlaylist.value.songs[index] = {
        id: song.id, 
        title: title?.length > 0 ? title : song.title, 
        thumbnail: thumbnail?.length > 0 ? thumbnail : song.thumbnail, 
    };
}

function deleteSong(song: ISongData) {
    if (!currentPlaylist.value) return;

    const index = currentPlaylist.value?.songs.findIndex(s => s.id === song.id);
    currentPlaylist.value.songs[index] = null as unknown as ISongData;
    currentPlaylist.value.songs = currentPlaylist.value.songs.filter(s => s);
}

async function uploadAlbum() {
    if (!currentPlaylist.value) return;

    const { isConfirmed } = await Swal.fire({
        title: "If this playlist is an album, you can upload to our database. Do you want to do so?",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        allowEscapeKey: false,
        allowOutsideClick: false,
    });
    
    if (!isConfirmed) return;

    const name = (await recursivePrompt("What's this album called?", currentPlaylist.value?.name)).toLowerCase();
    const artist = (await recursivePrompt("Who made the album?", "")).toLowerCase();

    await Swal.fire("Thanks for contributing!");

    const res = await fetch(`${user.serverURL}/api/upload`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            album: {
                name,
                artist,
                songs: currentPlaylist.value.songs,
            }
        })
    });
    
    const { success } = await res.json();

    if (success) {
        currentPlaylist.value.album = true;
        currentPlaylist.value.name = `${artist} - ${name}`;
    }
}
</script>

<template>
    <GlobalEvents 
        v-if="ui.playlistView" 
        @keyup.escape="ui.playlistView = false" 
    />
    
    <div class="playlist-section overlay" :class="{ open: ui.playlistView }">
        <div class="playlist-view section">
            <div class="playlist-selector">
                <button 
                    class="button is-danger play-btn close-btn mr-5" 
                    @click="ui.playlistView = false"
                >
                    <div class="icon">
                        <span class="iconify" data-icon="gg:close" />
                    </div>
                </button>

                <div class="display">
                    <span class="info-display">
                        {{ 
                            playlists.length > 0 ? 
                            `currently displaying ${currentPlaylist?.album ? "album" : "playlist"}` : 
                            "no playlists" 
                        }}
                    </span>

                    <div class="field has-addons">
                        <p v-if="playlists.length > 0" class="control selector">
                            <div class="select is-medium">
                                <select v-model="currentPlaylistId">
                                    <option v-for="playlist in playlists" :key="playlist._id" :value="playlist._id">{{ playlist.name }}</option>
                                </select>
                            </div>
                        </p>
                        <p class="control">
                            <button class="button is-primary is-medium" @click="createPlaylist">
                                <span class="iconify" data-icon="gg:play-list-add" />
                                <span class="ml-2 hide-mobile">new playlist</span>
                            </button>
                        </p>
                        <p class="control hide-mobile">
                            <button class="button is-link is-medium" @click="ui.playlistView = false; ui.albumView = true;">
                                <span class="ml-2">albums</span>
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            <div class="playlist mt-5 px-5">
                <br>
                <template v-if="currentPlaylist">
                    <div class="playlist-choices is-flex is-align-items-center mb-5">
                        <div class="field has-addons icon-choices mb-0">
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

                        <div class="field has-addons mb-0 ml-auto" v-if="currentPlaylist.album">
                            <button 
                                class="button is-ghost"
                                style="pointer-events: none;"
                            >
                                official album
                            </button>
                            <button class="button is-danger" @click="deletePlaylist">
                                delete
                            </button>
                        </div>
                        <div class="field has-addons mb-0 ml-auto" v-else>
                            <p 
                                v-if="player.states.playing"
                                class="control"
                            >
                                <button 
                                    class="button is-success"
                                    @click="addCurrentSong"
                                >
                                    add song
                                </button>
                            </p>
                            <p class="control">
                                <button class="button is-danger" @click="deletePlaylist">
                                    delete
                                </button>
                            </p>
                            <p class="control">
                                <button class="button is-link" @click="renamePlaylist">
                                    rename
                                </button>
                            </p>
                            <p class="control">
                                <button class="button is-dark" @click="uploadAlbum" style="background: #161616;">
                                    upload
                                </button>
                            </p>
                        </div>
                    </div>

                        <h3 
                            v-if="currentPlaylist.songs?.length === 0"
                            class="is-size-4 mt-3"
                        >
                            no songs in this playlist
                        </h3>

                        <Draggable 
                            v-model="currentPlaylist.songs" 
                            item-key="id"
                            tag="ul"
                            class="songs-list"
                        >
                            <template #item="{ element }">
                                 <li 
                                    class="my-2 is-size-6 song"
                                >
                                    <button class="play-btn mr-3 button is-ghost" @click="overrideQueue(element)">
                                        <span class="icon">
                                            <span class="iconify" data-icon="gg:play-button-o"></span>
                                        </span>
                                    </button>

                                    <span @dblclick="overrideQueue(element)">{{ element.title }}</span>

                                    <div class="ml-auto field" v-if="!currentPlaylist.album">
                                        <button class="play-btn button is-ghost has-text-danger" @click="updateSong(element)">
                                            <span class="icon">
                                                <span class="iconify" data-icon="mdi:playlist-edit"></span>
                                            </span>
                                        </button>
                                        <button class="play-btn delete-btn button is-ghost has-text-danger" @click="deleteSong(element)">
                                            <span class="icon">
                                                <span class="iconify" data-icon="gg:trash"></span>
                                            </span>
                                        </button>
                                    </div>
                                </li>
                            </template>
                        </Draggable>
                </template>
            </div>
        </div>

        <button
            class="toggle-view button is-ghost hide-mobile" 
            @click="ui.playlistView = true">
            <div>
                <span class="iconify" data-icon="gg:play-list" />
            </div>
        </button>
    </div>
</template>

<style scoped>
.playlist-section {
    left: -100vw;
    transition: left 0.5s;
}

.playlist {
    flex: 1;
    overflow-y: scroll;
}

.playlist-section.open {
    left: 0;
}

button.toggle-view {
    padding-top: 0;
    padding-bottom: 0;
    padding-left: 1rem;
    padding-right: 1rem;
    margin: auto 0;
    position: relative;
    left: 1.5rem;
    top: 4rem;
    border-radius: 15px 15px;
    font-size: 2rem;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5) !important;
    border: 2px solid rgba(255, 255, 255, 0.5);
}

button.toggle-view > div {
    height: 2rem;
}

.field.has-addons {
    overflow: hidden;
    border-radius: 4px;
}

button.toggle-view svg {
    position: relative;
    bottom: 0.125rem;
}

.playlist-selector {
    display: flex;
    align-items: center;
}

.song {
    display: flex;
    align-items: center;
}

.song > span {
    cursor: pointer;
}

.playlist-selector .display, .control.selector {
    flex: 1;
}

.control.selector .select, .control.selector select {
    width: 100%;
}

.playlist-selector h1 {
    position: relative;
    bottom: 1rem;
}

.playlist-selector .display {
    position: relative;
    display: flex;   
}

.playlist-selector .display .field {
    flex: 1;
}

.playlist-selector .display .info-display {
    content: "currently displaying";
    position: absolute;
    top: -2rem;
    left: 0;
}
</style>