import { getGold, setGold, getSilver, setSilver, getLanguage, setElements, getElements, setBeginGameStatus, getGameInProgress, setGameInProgress, getGameVisibleActive, getMenuState, getLanguageSelected, setLanguageSelected, setLanguage } from './constantsAndGlobalVars.js';
import { manualIncrementer, startAutoIncrementer, doubleSpeed, toggleTimer, resetCounter, setGameState, startGame } from './game.js';
import { initLocalization, localize } from './localization.js';

document.addEventListener('DOMContentLoaded', async () => {
    setElements();
    // Event listeners
    getElements().newGameMenuButton.addEventListener('click', async () => {
        setBeginGameStatus(true);
        if (!getGameInProgress()) {
            setGameInProgress(true);
        }
        setGameState(getGameVisibleActive());
        //PRE GAME START CODE HERE AFTER NEW GAME CLICKED
        startGame();
    });

    setGameState(getMenuState());
    handleLanguageChange(getLanguageSelected());

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

async function setElementsLanguageText() {
    getElements().menuTitle.innerHTML = `<h2>${localize('menuTitle', getLanguage())}</h2>`;
    getElements().newGameMenuButton.innerHTML = `${localize('newGame', getLanguage())}`;
}

export async function handleLanguageChange(languageCode) {
    setLanguageSelected(languageCode);
    await setupLanguageAndLocalization();
    setElementsLanguageText();
}

async function setupLanguageAndLocalization() {
    setLanguage(getLanguageSelected());
    await initLocalization(getLanguage());
}

export function disableActivateButton(button, action, activeClass) {
    switch (action) {
        case 'active':
            button.classList.remove('disabled');
            button.classList.add(activeClass);
            break;
        case 'disable':
            button.classList.remove(activeClass);
            button.classList.add('disabled');
            break;
    }
}

