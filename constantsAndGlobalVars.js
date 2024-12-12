//DEBUG
export let debugFlag = false;
export let debugOptionFlag = false;
export let stateLoading = false;

//ELEMENTS
let elements;
let localization = {};
let language = 'en';
let languageSelected = 'en';
let oldLanguage = 'en';

//CONSTANTS
export let gameState;
export const MENU_STATE = 'menuState';
export const GAME_VISIBLE_ACTIVE = 'gameVisibleActive';

//GLOBAL VARIABLES
const increments = {
    sandTimer: 1,
    silverTimer: 1
};

let increaseStorageFactor = 2;

let sandQuantity = 0;
let sandRate = 0;
let sandStorage = 100;
let scienceQuantity = 0;
let scienceRate = 0;
let silverStorage = 100;

let upgradeSand = {
    storage: {
        requirementQty: 1,
        price: 100,
        resource: "Sand"
    },
    autobuyer: {
        requirementQty: 1,
        price: 100,
        resource: "Sand", 
    },
    checkQuantity: getSandQuantity
};

let upgradeScience = {
    scienceKit: {
        requirementQty: 1, 
        price: 50, 
        resource: "Research", 
        checkQuantity: getSandQuantity
    },
    scienceClub: {
        requirementQty: 1, 
        price: 1000, 
        resource: "Research", 
        checkQuantity: getSandQuantity
    }
};

let currentTab = 1;
let currentOptionPane = null;
let notationType = 'normal';

//FLAGS
let audioMuted;
let languageChangedFlag;
let beginGameState = true;
let gameInProgress = false;
let notificationsToggle = true;

let autoSaveOn = false;
export let pauseAutoSaveCountdown = true;

//FUNCTION REGISTRY
export const functionRegistry = {
    getUpgradeSand: getUpgradeSand,
    getSandQuantity: getSandQuantity,
    // Add more functions here as needed
};

//GETTER SETTER METHODS
export function setElements() {
    elements = {
        menu: document.getElementById('menu'),
        menuTitle: document.getElementById('menuTitle'),
        newGameMenuButton: document.getElementById('newGame'),
        returnToMenuButton: document.getElementById('returnToMenu'),
        canvas: document.getElementById('canvas'),
        testContainer: document.getElementById('testContainer'),
        tabsContainer: document.getElementById('tabsContainer'),
        mainContainer: document.getElementById('mainContainer'),
        sandOption: document.getElementById('sandOption'),
        sandRate: document.getElementById('sandRate'),
        sandQuantity: document.getElementById('sandQuantity'),
    };
}

export function setGameStateVariable(value) {
    gameState = value;
}

export function getGameStateVariable() {
    return gameState;
}

export function getElements() {
    return elements;
}

export function getLanguageChangedFlag() {
    return languageChangedFlag;
}

export function setLanguageChangedFlag(value) {
    languageChangedFlag = value;
}

export function resetAllVariables() {
    // GLOBAL VARIABLES

    // FLAGS
}

export function captureGameStatusForSaving() {
    let gameState = {};

    // Game variables

    // Flags

    // UI elements

    gameState.language = getLanguage();

    return gameState;
}
export function restoreGameStatus(gameState) {
    return new Promise((resolve, reject) => {
        try {
            // Game variables

            // Flags

            // UI elements

            setLanguage(gameState.language);

            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

export function setLocalization(value) {
    localization = value;
}

export function getLocalization() {
    return localization;
}

export function setLanguage(value) {
    language = value;
}

export function getLanguage() {
    return language;
}

export function setOldLanguage(value) {
    oldLanguage = value;
}

export function getOldLanguage() {
    return oldLanguage;
}

export function setAudioMuted(value) {
    audioMuted = value;
}

export function getAudioMuted() {
    return audioMuted;
}

export function getMenuState() {
    return MENU_STATE;
}

export function getGameVisibleActive() {
    return GAME_VISIBLE_ACTIVE;
}

export function getLanguageSelected() {
    return languageSelected;
}

export function setLanguageSelected(value) {
    languageSelected = value;
}

export function getBeginGameStatus() {
    return beginGameState;
}

export function setBeginGameStatus(value) {
    beginGameState = value;
}

export function getGameInProgress() {
    return gameInProgress;
}

export function setGameInProgress(value) {
    gameInProgress = value;
}

export function setIncrement(timerKey, value) {
    increments[timerKey] = value;
}

export function getIncrement(timerKey) {
    return increments[timerKey];
}

export function getSandQuantity() {
    return sandQuantity;
}

export function setSandQuantity(value) {
    sandQuantity = value;
}

export function getSandStorage() {
    return sandStorage;
}

export function setSandStorage(value) {
    sandStorage = value;
}

export function getScienceQuantity() {
    return scienceQuantity;
}

export function setScienceQuantity(value) {
    scienceQuantity = value;
}

export function getSandRate() {
    return sandRate;
}

export function setSandRate(value) {
    sandRate = value;
}

export function getScienceRate() {
    return scienceRate;
}

export function setScienceRate(value) {
    scienceRate = value;
}

export function getCurrentTab() {
    return currentTab;
}

export function setCurrentTab(value) {
    currentTab = value;
}

export function getNotificationsToggle() {
    return notificationsToggle;
}

export function setNotificationsToggle(value) {
    notificationsToggle = value;
}

export function getNotationType() {
    return notationType;
}

export function setNotationType(value) {
    notationType = value;
}

export function getIncreaseStorageFactor() {
    return increaseStorageFactor;
}

export function setIncreaseStorageFactor(value) {
    increaseStorageFactor = value;
}

export function getUpgradeSand(key) {
    return upgradeSand[key];
}

export function setUpgradeSand(key, value) {
    upgradeSand[key] = value;
}

export function setUpgradeScience(key, value) {
    upgradeScience[key] = value;
}

export function getUpgradeScience(key) {
    return upgradeScience[key];
}

export function getCurrentOptionPane() {
    return currentOptionPane;
}

export function setCurrentOptionPane(value) {
    currentOptionPane = value;
}
