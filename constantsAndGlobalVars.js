import { functionRegistryResourceQuantity, SALE_VALUES } from "./resourceConstantsAndGlobalVars.js";

//DEBUG
export let debugFlag = false;
export let debugOptionFlag = false;
export let stateLoading = false;
export const debugVisibilityArray = ['settingsNotificationTestRow'];

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
export const TIMER_UPDATE_INTERVAL = 10;
export const TIMER_RATE_RATIO = 100;

//GLOBAL VARIABLES
let currencySymbol = '$';
let increaseStorageFactor = 2;
let salePreviews = {};
let resourcesToDeduct = {};
let resourcesToIncreasePrice = {};
let techUnlockedArray = [];
let revealedTechArray = [];
let lastScreenOpenRegister = {
    tab1: null,
    tab2: null,
    tab3: null,
    tab4: null,
    tab5: null,
    tab6: null,
    tab7: null,
    tab8: null,
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

const headerDescriptions = {
    visual: "Change the visual settings of the game.",
    research: "Here you can buy upgrades to generate research points for unlocking new technology.",
    'tech tree': "Here you can unlock new technologies to improve your game, provided you have enough research points!",
    hydrogen: "The most basic element known to man, very cheap to produce and has a pretty low value, but anything can be created from it.",
    helium: "Lighter than air this one will make you float away!"
}

//GETTER SETTER METHODS
export function setElements() {
    elements = {
        menu: document.getElementById('menu'),
        menuTitle: document.getElementById('menuTitle'),
        newGameMenuButton: document.getElementById('newGame'),
        returnToMenuButton: document.getElementById('returnToMenu'),
        canvas: document.getElementById('canvas'),
        testContainer: document.getElementById('testContainer'),
        statsContainer: document.getElementById('statsContainer'),
        tabsContainer: document.getElementById('tabsContainer'),
        mainContainer: document.getElementById('mainContainer'),
        hydrogenOption: document.getElementById('hydrogenOption'),
        hydrogenRate: document.getElementById('hydrogenRate'),
        hydrogenQuantity: document.getElementById('hydrogenQuantity'),
        heliumOption: document.getElementById('heliumOption'),
        heliumRate: document.getElementById('heliumRate'),
        heliumQuantity: document.getElementById('heliumQuantity'),
        researchRate: document.getElementById('researchRate'),
        researchQuantity: document.getElementById('researchQuantity'),
        cashStat: document.getElementById('cashStat'),
        optionPaneDescriptions: document.querySelectorAll('.option-pane-description'),
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

export function getTimerUpdateInterval() {
    return TIMER_UPDATE_INTERVAL;
}

export function getTimerRateRatio() {
    return TIMER_RATE_RATIO;
}

export function getCurrencySymbol() {
    return currencySymbol;
}

export function setCurrencySymbol(value) {
    currencySymbol = value;
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

export function getCurrentOptionPane() {
    return currentOptionPane;
}

export function setCurrentOptionPane(value) {
    currentOptionPane = value.toLowerCase();
}

export function setResourcesToDeduct(name, setFunctionName, getFunctionName, amount) {
    if (name === 'clear') {
        resourcesToDeduct = {};
        return;
    }

    if (!resourcesToDeduct[name]) {
        resourcesToDeduct[name] = {};
    }

    resourcesToDeduct[name].deductQuantity = amount;
    resourcesToDeduct[name].setFunction = setFunctionName;
    resourcesToDeduct[name].getFunction = getFunctionName;
}

export function getResourcesToDeduct() {
    return resourcesToDeduct;
}

export function setResourcesToIncreasePrice(name, setPriceTarget, currentPrice) {
    if (name === 'clear') {
        resourcesToIncreasePrice = {};
        return;
    }

    if (!resourcesToIncreasePrice[name]) {
        resourcesToIncreasePrice[name] = {};
    }

    resourcesToIncreasePrice[name].currentPrice = currentPrice;
    resourcesToIncreasePrice[name].setPriceTarget = setPriceTarget;
}

export function getResourcesToIncreasePrice() {
    return resourcesToIncreasePrice;
}

export function setSalePreview(resource, amount) {
    const resourceFunc = functionRegistryResourceQuantity[resource];

    if (resourceFunc) {
        let calculatedAmount;

        switch (amount) {
            case 'all':
                calculatedAmount = Math.floor(resourceFunc.getQuantity());
                break;
            case 'threeQuarters':
                calculatedAmount = Math.floor(resourceFunc.getQuantity() * 0.75);
                break;
            case 'twoThirds':
                calculatedAmount = Math.floor(resourceFunc.getQuantity() * 2 / 3);
                break;
            case 'half':
                calculatedAmount = Math.floor(resourceFunc.getQuantity() * 0.5);
                break;
            case 'oneThird':
                calculatedAmount = Math.floor(resourceFunc.getQuantity() / 3);
                break;
            case '100000':
                calculatedAmount = Math.min(100000, resourceFunc.getQuantity());
                break;
            case '10000':
                calculatedAmount = Math.min(10000, resourceFunc.getQuantity());
                break;
            case '1000':
                calculatedAmount = Math.min(1000, resourceFunc.getQuantity());
                break;
            case '100':
                calculatedAmount = Math.min(100, resourceFunc.getQuantity());
                break;
            case '10':
                calculatedAmount = Math.min(10, resourceFunc.getQuantity());
                break;
            case '1':
                calculatedAmount = Math.min(1, resourceFunc.getQuantity());
                break;
            default:
                calculatedAmount = 0;
                break;
        }

        resourceFunc.setSalePreview(resource, calculatedAmount);
    } else {
        console.warn(`No functions found for resource: ${resource}`);
    }
}
export function setResourceSalePreview(resource, value) {
    const resourceString = resource.charAt(0).toUpperCase() + resource.slice(1);
    const resourceQuantity = functionRegistryResourceQuantity[resource].getQuantity();

    if (getCurrencySymbol() !== "€") {
        if (value <= resourceQuantity) {
            salePreviews[resource] = 
                getCurrencySymbol() + 
                (value * SALE_VALUES[resource]).toFixed(2) + 
                ' (' + 
                value + ' ' + resourceString + ')';
        } else {
            salePreviews[resource] = 
                getCurrencySymbol() + 
                (resourceQuantity * SALE_VALUES[resource]).toFixed(2) + 
                ' (' + 
                resourceQuantity + ' ' + resourceString + ')';
        }
    } else {
        if (value <= resourceQuantity) {
            salePreviews[resource] = 
                (value * SALE_VALUES[resource]).toFixed(2) + 
                getCurrencySymbol() + 
                ' (' + 
                value + ' ' + resourceString + ')';
        } else {
            salePreviews[resource] = 
                (resourceQuantity * SALE_VALUES[resource]).toFixed(2) + 
                getCurrencySymbol() + 
                ' (' + 
                resourceQuantity + ' ' + resourceString + ')';
        }
    }
    console.log(salePreviews[resource]);
}


export function getResourceSalePreview(key) {
    return salePreviews[key];
}

export function getFunctionRegistryResourceQuantity() {
    return functionRegistryResourceQuantity;
}

export function getLastScreenOpenRegister(key) {
    return lastScreenOpenRegister[key];
}

export function setLastScreenOpenRegister(key, value) {
    lastScreenOpenRegister[key] = value;
}

export function getDebugVisibilityArray() {
    return debugVisibilityArray;
}

export function getTechUnlockedArray() {
    return techUnlockedArray;
}

export function setTechUnlockedArray(value) {
    techUnlockedArray.unshift(value);
}

export function getRevealedTechArray() {
    return revealedTechArray;
}

export function setRevealedTechArray(value) {
    revealedTechArray.unshift(value);
}

export function getHeaderDescriptions(key) {
    return headerDescriptions[key];
}

export function setHeaderDescriptions(value) {
    headerDescriptions[key] = value;
}

getRevealedTechArray

