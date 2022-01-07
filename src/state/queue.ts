import { ISongData, player } from "./player";
import { currentPlaylist } from "./playlists";
import { user } from "./user";

let queue: ISongData[] = [];
let originalQueue: ISongData[] = [];
let playedSongs: ISongData[] = [];

async function setupMediaSource(song: ISongData) {
    const ms = new MediaSource();
    player.audio.src = URL.createObjectURL(ms);

    return new Promise<void>((resolve, reject) => {
        ms.addEventListener("sourceopen", async () => {
            const sourceBuffer = ms.addSourceBuffer("audio/mpeg");
            let stream: ReadableStreamDefaultReader<BufferSource> | undefined;

            async function pump(stream: ReadableStreamDefaultReader<BufferSource>) {
                const { value } = await stream.read();
                if (value) sourceBuffer.appendBuffer(value);
            };

            sourceBuffer.addEventListener("updateend", () => stream && pump(stream), false);

            const streamResponse = await fetch(`${user.serverURL}/api/stream/${song.id}`);
            
            if (streamResponse.body) {
                pump(streamResponse.body.getReader());
                
                resolve();
                console.log("hi");
            } else {
                reject();
            }
        }, false);

        player.audio.play();

        player.audio.addEventListener("playing", () => console.log("wsedrfgbh"), { once: true });
    });
}

async function play(song: ISongData) {
    player.states.playing = false;
    player.states.loading = true;
    player.audio.pause();
    player.audio.src = `${user.serverURL}/api/stream/${song.id}`;
    // await setupMediaSource(song);
    player.audio.currentTime = 0;
    await player.audio.play();
    player.song = song;
    player.states.loading = false;
    player.states.playing = true;

    if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: player.song.title || "song",
            artist: currentPlaylist.value?.albumData?.artist || "music player",
            album: currentPlaylist.value?.albumData?.name,
            artwork: [
                { src: player.song.thumbnail || "" }
            ]
        });
    }
}

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
            queue = originalQueue;
            play(queue[0]);
        }
    }
}

player.audio.addEventListener("ended", nextSong);