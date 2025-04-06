class TimerManager {
    constructor() {
        this.timers = new Map();
        this.isRunning = false;
        this.lastUpdate = performance.now();
        this.update = this.update.bind(this);
    }

    addTimer(key, duration, onExpire) {
        if (this.timers.has(key)) return;

        const timer = new Timer(duration, onExpire);
        this.timers.set(key, timer);

        if (!this.isRunning) {
            this.isRunning = true;
            this.lastUpdate = performance.now();
            requestAnimationFrame(this.update);
        }
    }

    removeTimer(key) {
        this.timers.delete(key);
    }

    stopAllTimers() {
        this.timers.clear();
        this.isRunning = false;
    }

    getTimer(key) {
        return this.timers.get(key);
    }

    update(currentTime) {
        const delta = currentTime - this.lastUpdate;
        this.lastUpdate = currentTime;

        this.timers.forEach((timer, key) => {
            timer.update(delta);
            if (timer.finished) {
                this.timers.delete(key);
            }
        });

        if (this.timers.size > 0) {
            requestAnimationFrame(this.update);
        } else {
            this.isRunning = false;
        }
    }
}

class Timer {
    constructor(duration, onExpire) {
        this.duration = duration;
        this.onExpire = onExpire;
        this.elapsedTime = 0;
        this.isPaused = false;
        this.finished = false;
    }

    update(delta) {
        if (this.isPaused || this.finished) return;

        this.elapsedTime += delta;

        if (this.elapsedTime >= this.duration) {
            this.onExpire();
            this.finished = true;
        }
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    stop() {
        this.finished = true;
    }
}

export const timerManager = new TimerManager();
