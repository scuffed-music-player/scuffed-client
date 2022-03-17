import { reactive, watchEffect } from "vue";

export interface ISongData {
    id: string;
    title: string;
    thumbnail: string;
    downloaded: boolean;
}

export interface IPlayer {
    audio: HTMLAudioElement;
    states: {
        playing: boolean; // Is a song currently loaded into the player?
        paused: boolean; // If state.playing, is it paused?
        looping: boolean; // Is the player set to loop?
        loading: boolean; // Is the player currently trying to load a song?
    };
    title: string,
    song: ISongData; // What song is currently loaded?
    position: number; // Current place in the song.
    volume: number; // Corresponds to the volume of the player (0-100).
}

export const player = reactive<IPlayer>({
    audio: new Audio(),
    title: "no song is playing right now",
    states: {
        playing: false,
        paused: false,
        looping: false,
        loading: false,
    },
    song: {
        id: "",
        title: "",
        thumbnail: "",
        downloaded: false,
    },
    position: 0,
    volume: 100,
});

let updateInterval = -1;

const updatePosition = () => player.position = Number(player.audio.currentTime) || 0;

watchEffect(() => {
    if (player.states.playing) {
        player.title = player.song.title as string;
        updateInterval = setInterval(updatePosition, 50) as unknown as number;
    } else if (player.states.loading) {
        clearInterval(updateInterval);
        player.title = "loading...";
        
    } else {
        clearInterval(updateInterval);
        player.audio?.pause();
        player.title = "no song is playing right now";
    }
});

watchEffect(() => {
    if (player.audio) {
        player.audio.volume = player.volume / 100;
    }
})

watchEffect(() => {
    document.title = player.title;
});

player.audio.addEventListener("pause", () => {
    player.states.paused = true;
});

player.audio.addEventListener("play", () => {
    player.states.paused = false;
});

watchEffect(() => {
    if (player.states.paused) {
        player.audio?.pause();
    } else {
        player.audio?.play();
    }
});