import { ISongData, player } from "./player";
import { BASE_URL } from "../helpers/request";
import { watchEffect } from "vue";
import { ui } from "./ui";

let queue: ISongData[] = [];
let originalQueue: ISongData[] = [];
let playedSongs: ISongData[] = [];

async function play(song: ISongData, initialPosition: number = 0) {
    player.audio.src = `${BASE_URL}/api/stream/${song.id}`;
    player.audio.currentTime = initialPosition;
    await player.audio.play();
    player.song = song;
    player.states.loading = false;
    player.states.playing = true;

    if ("mediaSession" in navigator) {
        navigator.mediaSession.setActionHandler("nexttrack", nextSong);
        navigator.mediaSession.setActionHandler("previoustrack", prevSong);
    }
}

watchEffect(() => {
    navigator.mediaSession.metadata = new MediaMetadata({
        title: player.song.title,
        artist: player.song.artist,
        album: "greatest hits!",
        artwork: [
            { src: ui.thumbnail || "" }
        ]
    });
})

export function overrideQueue(...songs: ISongData[]) {
    queue = [...songs];
    originalQueue = [...songs];
    if (queue.length > 0) {
        play(queue[0]);
    }
}

export function prevSong() {
    playedSongs = playedSongs.filter(s => s.id !== queue[0].id);

    if (player.states.looping) {
        player.audio.currentTime = 0;
    } else if (playedSongs.length > 0) {
        queue.unshift(playedSongs.pop() as ISongData);
        play(queue[0]);
    }
}

export function nextSong() {
    if (player.states.looping) {
        player.audio.currentTime = 0;
        player.audio.play();
    } else {
        const last = queue.shift();
        if (last) playedSongs.push(last);
        if (queue.length > 0) {
            play(queue[0]);
        } else if (originalQueue.length > 0) {
            queue = [...originalQueue];
            play(queue[0]);
        }
    }
}

player.audio.addEventListener("ended", nextSong);