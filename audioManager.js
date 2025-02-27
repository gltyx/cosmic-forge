import { getCurrentStarSystemWeatherEfficiency, getBackgroundAudio, getSfx } from "./constantsAndGlobalVars.js";

class WeatherAmbienceManager {
    constructor() {
        this.tracks = {};
    }

    play(key, filePath) {
        if (!this.tracks[key]) {
            const audio = new Audio(filePath);
            audio.volume = 0.3;
            audio.loop = true;
            this.tracks[key] = audio;
        }
        this.tracks[key].play().catch(error => {
            console.error(`Error playing ${key}:`, error);
        });
    }

    pause(key) {
        if (this.tracks[key]) {
            this.tracks[key].pause();
        }
    }

    pauseAll() {
        Object.keys(this.tracks).forEach(key => this.pause(key));
    }

    resumeAll() {
        Object.keys(this.tracks).forEach(key => {
            if (this.tracks[key]) {
                this.tracks[key].play();
            }
        });
    }

    update() {
        if (!getBackgroundAudio()) {
            this.pauseAll();
            return;
        }

        const weather = getCurrentStarSystemWeatherEfficiency()[2];
        const sounds = {
            'rain': './sounds/rainLoop.mp3',
            'volcano': './sounds/eruptionLoop.mp3'
        };

        Object.keys(this.tracks).forEach(key => {
            if (key !== weather) {
                this.pause(key);
            }
        });

        if (sounds[weather]) {
            this.play(weather, sounds[weather]);
        }
    }
}

export const weatherAmbienceManager = new WeatherAmbienceManager();

class BackgroundAudioPlayer {
    constructor() {
        this.audio = new Audio('./sounds/bgAmbience.mp3');
        this.audio.loop = true;
        this.audio.volume = 0.5;
        this.isPlaying = false;
    }

    update() {
        if (getBackgroundAudio()) {
            if (!this.isPlaying) {
                this.resume();
            }
        } else {
            if (this.isPlaying) {
                this.pause();
            }
        }
    }

    play() {
        this.audio.play().then(() => {
            this.isPlaying = true;
        }).catch(error => {
            console.error("Audio playback failed:", error);
        });
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
    }

    resume() {
        this.audio.play().then(() => {
            this.isPlaying = true;
        }).catch(error => {
            console.error("Error resuming audio:", error);
        });
    }
}

export const backgroundAudio = new BackgroundAudioPlayer();

class SfxPlayer {
    constructor() {
        this.sounds = {
            "asteroidScan": "./sounds/asteroidScan.mp3",
            "powerOff": "./sounds/powerOff.mp3",
            "powerOn": "./sounds/powerOn.mp3",
            "powerTripped": "./sounds/powerTripped.mp3",
            "rocketLaunch": "./sounds/rocketLaunch.mp3",
            "starStudy": "./sounds/starStudy.mp3"
        };
        this.activeSounds = new Map();
    }

    playAudio(audioKey, stopTarget = false) {
        if (!getSfx()) return;

        if (stopTarget === true) {
            this.stopAll();
        } else if (typeof stopTarget === "string") {
            this.stop(stopTarget);
        }

        if (this.sounds[audioKey]) {
            const audio = new Audio(this.sounds[audioKey]);
            audio.volume = 0.5;
            this.activeSounds.set(audioKey, audio);
            
            audio.play().catch(error => {
                console.error(`Error playing SFX ${audioKey}:`, error);
            });

            audio.addEventListener("ended", () => {
                this.activeSounds.delete(audioKey);
            });
        }
    }

    stop(audioKey) {
        if (this.activeSounds.has(audioKey)) {
            const audio = this.activeSounds.get(audioKey);
            audio.pause();
            audio.currentTime = 0;
            this.activeSounds.delete(audioKey);
        }
    }

    stopAll() {
        this.activeSounds.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        this.activeSounds.clear();
    }
}

export const sfxPlayer = new SfxPlayer();

window.addEventListener('blur', () => {
    weatherAmbienceManager.pauseAll();
    backgroundAudio.pause();
    sfxPlayer.stopAll();
});

window.addEventListener('focus', () => {
    weatherAmbienceManager.resumeAll();
    backgroundAudio.play();
});
