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

//ELEMENT VALUES
export const SALE_VALUE_HYDROGEN = 0.1; //0.005;

//GLOBAL VARIABLES
let currencySymbol = '$';
let increaseStorageFactor = 2;
let resourcesToDeduct = {};
let resourcesToIncreasePrice = {};
let cash = 0;

let techUnlockedArray = [];

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

let hydrogenSalePreview = 0;

let hydrogenQuantity = 0;
let hydrogenRate = 0;
let hydrogenStorage = 200;

let hydrogenAB1Quantity = 0;

let researchQuantity = 0;
let researchRate = 0;

let scienceKitQuantity = 0;
let scienceClubQuantity = 0;

let upgradeHydrogen = {
    storage: {
        type: 'storage',
        requirementQty: 1,
        price: getHydrogenStorage,
        resource: 'hydrogen',
        checkQuantity: getHydrogenQuantity,
        deduct: setHydrogenQuantity,
        setPrice: null
    },
    autoBuyer: {
        type: 'autoBuyer',
        tier1: { 
            price: 65, rate: 0.01, setPrice: 'hydrogenAB1Price'
        }, 
        tier2: { 
            price: 500, rate: 25, setPrice: 'hydrogenAB2Price'
        }, 
        tier3: { 
            price: 2500, rate: 125, setPrice: 'hydrogenAB3Price'
        }, 
        tier4: { 
            price: 12500, rate: 625, setPrice: 'hydrogenAB4Price'
        },
        requirementQty: 1,
        resource: 'hydrogen',
        checkQuantity: getHydrogenQuantity,
        deduct: setHydrogenQuantity,
    },
};

let upgradeResearch = {
    techs: {
        knowledgeSharing: {
            price: 5,
            resource: 'research',
            effectFunction: 'revealElement'
        }
    },
    research: {
        scienceKit: {
            requirementQty: 1, 
            price: 5,
            rate: 0.003,
            resource: 'cash', 
            checkQuantity: getCash,
            deduct: setCash,
            setPrice: 'scienceKitPrice'
        },
        scienceClub: {
            requirementQty: 1, 
            price: 100,
            rate: 0.06,
            resource: 'cash', 
            checkQuantity: getCash,
            deduct: setCash,
            setPrice: 'scienceClubPrice'
        }
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

//FUNCTION REGISTRIES
export const functionRegistryUpgrade = {
    getUpgradeHydrogen: getUpgradeHydrogen,
    getUpgradeResearch: getUpgradeResearch,
    getHydrogenQuantity: getHydrogenQuantity,
    getResearchQuantity: getResearchQuantity,
    getCash: getCash,
    // Add more functions here as needed
};

const functionRegistryResourceQuantity = {
    hydrogen: { getQuantity: getHydrogenQuantity, setSalePreview: setHydrogenSalePreview, getSalePreview: getHydrogenSalePreview, salePreviewElement: 'sellHydrogenDescription' },
    //helium: { getQuantity: getHeliumQuantity, setSalePreview: setHeliumSalePreview },
    // Add more resources here...
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
        statsContainer: document.getElementById('statsContainer'),
        tabsContainer: document.getElementById('tabsContainer'),
        mainContainer: document.getElementById('mainContainer'),
        hydrogenOption: document.getElementById('hydrogenOption'),
        hydrogenRate: document.getElementById('hydrogenRate'),
        hydrogenQuantity: document.getElementById('hydrogenQuantity'),
        researchRate: document.getElementById('researchRate'),
        researchQuantity: document.getElementById('researchQuantity'),
        cashStat: document.getElementById('cashStat'),
        
        // scienceKitQuantity: document.getElementById('scienceKitQuantity'), //IF TRYING TO ADD ELEMENTS HERE FROM DYNAMICALLY GENERATED ELEMENTS IT WONT WORK UNLESS WE CALL SET ELEMENTS AFTER CREATING THEM
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

export function getCash() {
    return cash;
}

export function setCash(value) {
    cash = value;
}

export function getCurrencySymbol() {
    return currencySymbol;
}

export function setCurrencySymbol(value) {
    currencySymbol = value;
}

export function getHydrogenQuantity() {
    return hydrogenQuantity;
}

export function setHydrogenQuantity(value) {
    hydrogenQuantity = value;
}

export function getHydrogenStorage() {
    return hydrogenStorage;
}

export function setHydrogenStorage(value) {
    hydrogenStorage = value;
}

export function getResearchQuantity() {
    return researchQuantity;
}

export function setResearchQuantity(value) {
    researchQuantity = value;
}

export function getScienceKitQuantity() {
    return scienceKitQuantity;
}

export function setScienceKitQuantity(value) {
    scienceKitQuantity = value;
}

export function getScienceClubQuantity() {
    return scienceClubQuantity;
}

export function setScienceClubQuantity(value) {
    scienceClubQuantity = value;
}

export function getHydrogenRate() {
    return hydrogenRate;
}

export function setHydrogenRate(value) {
    hydrogenRate = value;
}

export function getResearchRate() {
    return researchRate;
}

export function setResearchRate(value) {
    researchRate = value;
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

export function getUpgradeHydrogen(key) {
    return upgradeHydrogen[key];
}

export function setUpgradeHydrogen(key, tier, property, value) {
    upgradeHydrogen[key][tier][property] = value;
}

export function setUpgradeResearch(key1, key2, property, value) {
    upgradeResearch[key1][key2][property] = value;
}

export function getUpgradeResearch(key1, key2) {
    return upgradeResearch[key1][key2];
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

        resourceFunc.setSalePreview(calculatedAmount);
    } else {
        console.warn(`No functions found for resource: ${resource}`);
    }
}

export function setHydrogenSalePreview(value) {
    const quantityInStock = getHydrogenQuantity();
    if (getCurrencySymbol() !== "€") {
        if (value <= quantityInStock) {
            hydrogenSalePreview = `${getCurrencySymbol()}` + (value * SALE_VALUE_HYDROGEN).toFixed(2) + ` (${value} Hydrogen)`;
        } else {
            hydrogenSalePreview = `${getCurrencySymbol()}` + (quantityInStock * SALE_VALUE_HYDROGEN).toFixed(2) + ` (${quantityInStock} Hydrogen)`;
        }
    } else {
        if (value <= quantityInStock) {
            hydrogenSalePreview = `${(value * SALE_VALUE_HYDROGEN).toFixed(2) + getCurrencySymbol()} (${value} Hydrogen)`;
        } else {
            hydrogenSalePreview = `${(quantityInStock * SALE_VALUE_HYDROGEN).toFixed(2) + getCurrencySymbol()} (${quantityInStock} Hydrogen)`;
        }
    }
}

export function getHydrogenSalePreview() {
    return hydrogenSalePreview;
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

export function getHydrogenAB1Quantity() {
    return hydrogenAB1Quantity;
}

export function setHydrogenAB1Quantity(value) {
    hydrogenAB1Quantity = value;
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