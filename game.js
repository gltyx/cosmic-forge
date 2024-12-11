import {
    getIncreaseStorageFactor,
    setDustStorage,
    getDustStorage,
    setDustRate,
    setSilverRate,
    getDustRate,
    getSilverRate,
    getDustQuantity,
    setDustQuantity,
    getSilverQuantity,
    setSilverQuantity,
    getIncrement,
    setIncrement,
    setBeginGameStatus, 
    setGameStateVariable, 
    getBeginGameStatus, 
    getMenuState, 
    getGameVisibleActive, 
    getElements, 
    getLanguage, 
    gameState, 
    getCurrentTab
} from './constantsAndGlobalVars.js';

//--------------------------------------------------------------------------------------------------------

export function startGame() {
    if (getBeginGameStatus()) {
        setBeginGameStatus(false);
    }
    setGameState(getGameVisibleActive());

    gameLoop();
}

export async function gameLoop() {
    if (gameState === getGameVisibleActive()) {

        if (gameState === getGameVisibleActive()) {
            drawScreen(getCurrentTab());
        }

        monitorResourceCostChecks();

        requestAnimationFrame(gameLoop);
    }
}

function drawScreen(tabNumber) {
    
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

const timerManager = new TimerManager();

const updateDisplay = (elementId, count, storage) => {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = count + "/" + storage;
    } else {
        console.error(`Element with id "${elementId}" not found.`);
    }
};

export function toggleTimer(key, buttonId) {
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

export function doubleRate(key) {
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
                console.log(`${key} Rate doubled, new interval: ${newDuration}ms`);
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

export function resetCounter(key) {
    if (key === "dustTimer") {
        setDustQuantity(0);
        updateDisplay("dustQuantity", getDustQuantity());
    } else if (key === "silverTimer") {
        setSilverQuantity(0);
        updateDisplay("silverQuantity", getSilverQuantity());
    }
}

export function manualIncrementer(getResourceQuantity, setResource, getResourceStorage, incrementAmount, elementId) {
    if (getResourceQuantity() < getResourceStorage()) {
        getElements()[elementId].classList.remove('green-text');
        let currentResource = getResourceQuantity();
        setResource(currentResource + incrementAmount);
        updateDisplay(elementId, getResourceQuantity(), getResourceStorage());
        if (getResourceQuantity() === getResourceStorage()) {
            getElements()[elementId].classList.add('green-text');
        }
    }
}

export function startAutoIncrementer(resourceKey) {
    if (resourceKey === "dust") {
        setDustRate(getIncrement("dustTimer"));
        timerManager.addTimer("dustTimer", 1000, () => {
            const currentDust = getDustQuantity();
            setDustQuantity(currentDust + getIncrement("dustTimer"));
            updateDisplay("dustQuantity", getDustQuantity());
            updateSummary();
        });
    } else if (resourceKey === "silver") {
        setSilverRate(getIncrement("silverTimer"));
        timerManager.addTimer("silverTimer", 1000, () => {
            const currentSilver = getSilverQuantity();
            setSilverQuantity(currentSilver + getIncrement("silverTimer"));
            updateDisplay("silverQuantity", getSilverQuantity());
            updateSummary();
        });
    }
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
    if (resourceKey === "dustTimer") {
        setDustRate(rate);
    } else if (resourceKey === "silverTimer") {
        setSilverRate(rate);
    }
    updateSummary();
}

function updateSummary() {
    document.getElementById("dustPerSec").textContent = `Dust: ${getDustRate()}/s`;
    document.getElementById("silverPerSec").textContent = `Silver: ${getSilverRate()}/s`;
}

//===============================================================================================================

export function setGameState(newState) {
    console.log("Setting game state to " + newState);
    setGameStateVariable(newState);

    switch (newState) {
        case getMenuState():
            getElements().menu.classList.remove('d-none');
            getElements().menu.classList.add('d-flex');
            getElements().tabsContainer.classList.remove('d-flex');
            getElements().tabsContainer.classList.add('d-none');
            getElements().mainContainer.classList.remove('d-flex');
            getElements().mainContainer.classList.add('d-none');
            break;
        case getGameVisibleActive():
            getElements().menu.classList.remove('d-flex');
            getElements().menu.classList.add('d-none');
            getElements().tabsContainer.classList.remove('d-none');
            getElements().tabsContainer.classList.add('d-flex');
            getElements().mainContainer.classList.remove('d-none');
            getElements().mainContainer.classList.add('d-flex');

            manageTabSpecificUi();
            break;
    }
}

function manageTabSpecificUi() {
    const currentTab = getCurrentTab();
    const tabElements = document.querySelectorAll(`.tab-${currentTab}`);
    const allTabElements = document.querySelectorAll('[class^="tab-"]');
    allTabElements.forEach(element => {
        const tabNumberMatch = element.className.match(/tab-(\d+)/);
        if (tabNumberMatch) {
            const tabNumber = parseInt(tabNumberMatch[1], 10);

            if (tabNumber !== currentTab) {
                element.classList.remove('d-flex');
                element.classList.add('d-none');
            }
        }
    });

    if (tabElements.length > 0) {
        tabElements.forEach(element => {
            element.classList.remove('d-none');
            element.classList.add('d-flex');
        });

        console.log(`Showing UI for Tab ${currentTab}.`);
    } else {
        console.log(`No tab-specific UI to show for Tab ${currentTab}, but other tabs are hidden.`);
    }
}

function monitorResourceCostChecks() {
    const elements = document.querySelectorAll('.resource-cost-check');

    elements.forEach(element => {
        if (element.dataset.conditionCheck === 'dustStorageCheck' && getDustQuantity() === getDustStorage()) {
            element.classList.remove('red-text');
        }
        //} else if () {

        //} 
        else {
            element.classList.add('red-text');
        }
        // } else if (element.dataset.conditionCheck === 'otherCheck' && /* other condition */) {
        //     element.classList.remove('red-text');
        // }
    });
}

export function increaseResourceStorage(setResourceStorage, getResourceStorage, getResourceQuantity, setResourceQuantity, elementId) {
    const increaseFactor = getIncreaseStorageFactor();
    setResourceStorage(getResourceStorage() * increaseFactor);
    setResourceQuantity(0);
    updateDisplay(elementId, getResourceQuantity(), getResourceStorage());
    getElements()[elementId].classList.remove('green-text');
}