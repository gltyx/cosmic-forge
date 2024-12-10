import {
    setGoldRate,
    setSilverRate,
    getGoldRate,
    getSilverRate,
    getGold,
    setGold,
    getSilver,
    setSilver,
    setCounter,
    getCounter, 
    getIncrement,
    setIncrement,
    setBeginGameStatus, 
    setGameStateVariable, 
    getBeginGameStatus, 
    getMenuState, 
    getGameVisibleActive, 
    getElements, 
    getLanguage, 
    gameState 
} from './constantsAndGlobalVars.js';

//--------------------------------------------------------------------------------------------------------

export function startGame() {
    function updateCanvasSize() {
        const canvasWidth = container.clientWidth * 0.8;
        const canvasHeight = container.clientHeight * 0.8;

        getElements().canvas.style.width = `${canvasWidth}px`;
        getElements().canvas.style.height = `${canvasHeight}px`;

        getElements().canvas.width = canvasWidth;
        getElements().canvas.height = canvasHeight;
        
        ctx.scale(1, 1);
    }

    //updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    if (getBeginGameStatus()) {
        setBeginGameStatus(false);
    }
    setGameState(getGameVisibleActive());

    gameLoop();
}

export async function gameLoop() {
    if (gameState === getGameVisibleActive()) {

        if (gameState === getGameVisibleActive()) {
            draw(); //(ctx)
        }

        requestAnimationFrame(gameLoop);
    }
}

function draw() {
    // Clear and draw logic here if needed
}

class Timer {
    constructor(duration, onExpire) {
        this.duration = duration;
        this.onExpire = onExpire;
        this.timerId = null;
    }

    start() {
        if (this.timerId) {
            clearTimeout(this.timerId);
        }
        this.timerId = setInterval(() => {
            this.onExpire();
        }, this.duration);
    }

    stop() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }
}

// TimerManager class
class TimerManager {
    constructor() {
        this.timers = new Map();
    }

    addTimer(key, duration, onExpire) {
        if (this.timers.has(key)) {
            console.error(`Timer with key "${key}" already exists.`);
            return;
        }
        const timer = new Timer(duration, onExpire);
        this.timers.set(key, timer);
        timer.start();
    }

    removeTimer(key) {
        if (this.timers.has(key)) {
            this.timers.get(key).stop();
            this.timers.delete(key);
        }
    }

    stopAllTimers() {
        this.timers.forEach(timer => timer.stop());
    }

    getTimer(key) {
        return this.timers.get(key);
    }
}

// Timer logic
const timerManager = new TimerManager();

const updateDisplay = (elementId, count) => {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = count;
    } else {
        console.error(`Element with id "${elementId}" not found.`);
    }
};

// Pause/Resume logic for buttons
function toggleTimer(key, buttonId) {
    const timer = timerManager.getTimer(key);
    if (timer) {
        const button = document.getElementById(buttonId);
        if (timer.timerId) {
            timer.stop();
            button.textContent = `Resume ${key.charAt(0).toUpperCase() + key.slice(1)}`;
        } else {
            timer.start();
            button.textContent = `Pause ${key.charAt(0).toUpperCase() + key.slice(1)}`;
        }
    }
}

function doubleSpeed(key) {
    const timer = timerManager.getTimer(key);
    if (timer) {
        const currentIncrement = getIncrement(key);
        const currentDuration = timer.duration;

        if (currentIncrement === 1) {
            const newDuration = Math.max(currentDuration / 2, 1);
            if (newDuration >= 10) {
                timer.stop();
                timer.duration = newDuration;
                timer.start();
                console.log(`${key} speed doubled, new interval: ${newDuration}ms`);
                updateRate(key, false);
            } else {
                setIncrement(key, 2);
                updateRate(key, true);
            }
        } else {
            const newIncrement = currentIncrement * 2;
            setIncrement(key, newIncrement);
            console.log(`${key} increment doubled, new increment: ${newIncrement}`);
            updateRate(key, true);
        }
    }
}

function resetCounter(key) {
    if (key === "goldTimer") {
        setGold(0);
        updateDisplay("goldQuantity", getGold());
    } else if (key === "silverTimer") {
        setSilver(0);
        updateDisplay("silverQuantity", getSilver());
    }
}

function manualIncrementer(getResource, setResource, incrementAmount, elementId) {
    let currentResource = getResource();
    setResource(currentResource + incrementAmount);
    updateDisplay(elementId, getResource());
}

function startAutoIncrementer(resourceKey) {
    if (resourceKey === "gold") {
        setGoldRate(getIncrement("goldTimer"));
        timerManager.addTimer("goldTimer", 1000, () => {
            const currentGold = getGold();
            setGold(currentGold + getIncrement("goldTimer"));
            updateDisplay("goldQuantity", getGold());
            updateSummary();
        });
    } else if (resourceKey === "silver") {
        setSilverRate(getIncrement("silverTimer"));
        timerManager.addTimer("silverTimer", 1000, () => {
            const currentSilver = getSilver();
            setSilver(currentSilver + getIncrement("silverTimer"));
            updateDisplay("silverQuantity", getSilver());
            updateSummary();
        });
    }
}

function updateSummary() {
    document.getElementById("goldPerSec").textContent = `Gold: ${getGoldRate()}/s`;
    document.getElementById("silverPerSec").textContent = `Silver: ${getSilverRate()}/s`;
}

function calculateRate(resourceKey) {
    const timer = timerManager.getTimer(resourceKey);
    const currentIncrement = getIncrement(resourceKey);
    const currentDuration = timer.duration;

    let rate = 0;

    if (currentIncrement === 1) {
        rate = 1000 / currentDuration * currentIncrement;
    } else {
        rate = currentIncrement;
    }

    return rate;
}

function updateRate(resourceKey, reachedFastestInterval) {
    let rate;
    reachedFastestInterval ? rate = calculateRate(resourceKey) * 64 : rate = calculateRate(resourceKey);
    if (resourceKey === "goldTimer") {
        setGoldRate(rate);
    } else if (resourceKey === "silverTimer") {
        setSilverRate(rate);
    }
    updateSummary();
}

// Event listeners for the buttons
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("pauseResumegoldTimer").addEventListener("click", () => toggleTimer("goldTimer", "pauseResumegoldTimer"));
    document.getElementById("pauseResumesilverTimer").addEventListener("click", () => toggleTimer("silverTimer", "pauseResumesilverTimer"));
    document.getElementById("doubleSpeedgoldTimer").addEventListener("click", () => doubleSpeed("goldTimer"));
    document.getElementById("doubleSpeedsilverTimer").addEventListener("click", () => doubleSpeed("silverTimer"));
    document.getElementById("resetCountergoldTimer").addEventListener("click", () => resetCounter("goldTimer"));
    document.getElementById("resetCountersilverTimer").addEventListener("click", () => resetCounter("silverTimer"));
    document.getElementById("incrementGold").addEventListener("click", () => manualIncrementer(getGold, setGold, 1, "goldQuantity"));
    document.getElementById("incrementSilver").addEventListener("click", () => manualIncrementer(getSilver, setSilver, 1, "silverQuantity"));
    document.getElementById("startAutoIncrementGold").addEventListener("click", () => startAutoIncrementer("gold"));
    document.getElementById("startAutoIncrementSilver").addEventListener("click", () => startAutoIncrementer("silver"));
});

//===============================================================================================================

export function setGameState(newState) {
    console.log("Setting game state to " + newState);
    setGameStateVariable(newState);

    switch (newState) {
        case getMenuState():
            getElements().menu.classList.remove('d-none');
            getElements().menu.classList.add('d-flex');
            getElements().canvasContainer.classList.remove('d-flex');
            getElements().canvasContainer.classList.add('d-none');
            getElements().summaryContainer.classList.remove('d-flex');
            getElements().summaryContainer.classList.add('d-none');
            break;
        case getGameVisibleActive():
            getElements().menu.classList.remove('d-flex');
            getElements().menu.classList.add('d-none');
            getElements().canvasContainer.classList.remove('d-none');
            getElements().canvasContainer.classList.add('d-flex');
            getElements().summaryContainer.classList.remove('d-none');
            getElements().summaryContainer.classList.add('d-flex');
            break;
    }
}
