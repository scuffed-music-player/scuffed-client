<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import { v4 } from "uuid";
import { GlobalEvents } from "vue-global-events";
import { ui } from "../state/ui";
import { ISongData } from "../state/player";
import { playlists } from "../state/playlists";
import { overrideQueue } from "../state/queue";
import { request } from "../state/user";
import Swal from "sweetalert2";
 
interface IAlbum {
    _id: string;
    name: string;
    artist: string;
    songs: ISongData[];
}

const albums = ref<Omit<IAlbum, "songs">[]>([]);

const refreshAlbums = async () => {
    const res = await request("GET")("/api/albums");
    albums.value = (await res.json()).albums;
}

watchEffect(() => ui.albumView && refreshAlbums());

const query = ref("");

const filteredAlbums = computed(() => {
    const q = query.value
        .toLowerCase()
        .replaceAll(" ", "")
        .replaceAll("-", "");

    return albums.value.filter((a) => 
        `${a.name.toLowerCase()}${a.artist.toLowerCase()}`
            .replaceAll(" ", " ")
            .replaceAll("-", "")
            .includes(q) || 
        `${a.artist.toLowerCase()}${a.name.toLowerCase()}`
            .replaceAll(" ", " ")
            .replaceAll("-", "")
            .includes(q) 
    )
});

async function addAlbum({ _id, name, artist }: Omit<IAlbum, "songs">) {
    const albumName = `${artist} - ${name}`;

    if (playlists.value?.find(p => p.name === albumName)) {
        await Swal.fire("Looks like you've already saved this album.", "You're just that good I guess, try another album?", "info");
        return;
    }

    const res = await request("GET")(`/api/album/${_id}`); 
    const { album, success } = (await res.json()) as { album: IAlbum, success: boolean };
    if (success) {
        playlists.value.push({
            name: albumName,
            songs: album.songs,
            _id: v4(),
            album: true,
            albumData: {
                name,
                artist
            }
        });

        await Swal.fire("Added to playlists!", "Head to the playlists page to view it!", "success");
    }
}

async function playAlbum({ _id }: Omit<IAlbum, "songs">, shuffle: boolean = false) {
    const res = await request("GET")(`/api/album/${_id}`); 
    const { album, success } = (await res.json()) as { album: IAlbum, success: boolean };
    
    if (success) {
        const queue = shuffle ?
            [...album.songs.sort(() => 0.5 - Math.random())] :
            [...album.songs];

        overrideQueue(...queue);
    }
}
</script>

<template>
    <GlobalEvents 
        v-if="ui.albumView" 
        @keyup.escape="ui.albumView = false" 
    />

    <div class="album-section overlay" :class="{ open: ui.albumView }">
        <div class="album-content section">
            <div class="is-flex">
                <div>
                    <h1 class="title is-3">album database</h1>
                    <h2 class="subtitle is-5 hide-mobile mb-5">user-compiled albums that you can listen to and save in your playlists</h2>
                </div>
                <button 
                    class="button is-danger play-btn close-btn ml-auto" 
                    @click="ui.albumView = false"
                >
                    <div class="icon">
                        <span class="iconify" data-icon="gg:close" />
                    </div>
                </button>
            </div>

            <div class="field has-addons">
                <p class="control input-conent">
                    <input 
                        type="text" 
                        class="input is-medium" 
                        placeholder="filter through albums"
                        v-model="query"
                    />
                </p>

                <p class="control">
                    <button 
                        class="button is-static is-medium has-background-info" 
                        style="border: none;"
                    >
                        {{ filteredAlbums.length }} results
                    </button>
                </p>
            </div>

            <div class="albums">
                <div class="album my-2 is-flex is-align-items-center" v-for="album in filteredAlbums">
                    <div>
                        <h3 class="is-size-3 has-text-weight-bold">{{ album.name }}</h3>
                        <h4>{{ album.artist }}</h4>
                    </div>

                    <div class="field has-addons ml-auto">
                        <p class="control">
                                <button 
                                    class="play-btn button is-primary" 
                                    @click="playAlbum(album)"
                                >
                                    <span class="icon">
                                        <span class="iconify" data-icon="dashicons:controls-play"></span>
                                    </span>
                                </button>
                            </p>
                            <p class="control">
                                <button 
                                    class="play-btn button is-link"
                                    @click="playAlbum(album, true)"
                                >
                                    <span class="icon">
                                        <span class="iconify" data-icon="ic:baseline-shuffle"></span>
                                    </span>
                                </button>
                            </p>
                            <p class="control">
                                <button class="button is-dark" @click="addAlbum(album)">save</button>
                            </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.album-section {
    right: -100vw;
    transition: right 0.5s;
}

.albums {
    flex: 1;
    overflow-y: scroll;
}

.album-section.open {
    right: 0;
}


.control.input-conent {
    flex: 1;
}
</style>