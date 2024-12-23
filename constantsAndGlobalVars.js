import { getResourceDataObject, setResourceDataObject } from "./resourceDataObject.js";

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
export const READY_TO_SORT = 120;
export const NOW = 30; //READY TO SORT NOW needs total of 150

//GLOBAL VARIABLES
export const deferredActions = [];

let techRenderCounter = 0;
let tempSellRowValue = null;
let currencySymbol = '$';
let increaseStorageFactor = 2;
let salePreviews = {};
let resourcesToDeduct = {};
let resourcesToIncreasePrice = {};
let techUnlockedArray = [];
let revealedTechArray = [];
let techSpecificUIItemsArray = {};
let unlockedResourcesArray = ['hydrogen'];
let temporaryRowsRepo = null;
let canAffordDeferred = null;

let originalFrameNumbers = {
};

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
let notationType = 'normalCondensed';

//FLAGS
let audioMuted;
let languageChangedFlag;
let beginGameState = true;
let gameInProgress = false;
let notificationsToggle = true;
let techRenderChange = false;

let autoSaveOn = false;
export let pauseAutoSaveCountdown = true;

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
        solidsMenu: document.getElementById('solids'),
        gasesMenu: document.getElementById('gases'),
        nonFerrous: document.getElementById('nonFerrous'),
        simpleGases: document.getElementById('simpleGases'),
        nobleGases: document.getElementById('nobleGases'),
        hydrogenOption: document.getElementById('hydrogenOption'),
        hydrogenRate: document.getElementById('hydrogenRate'),
        hydrogenQuantity: document.getElementById('hydrogenQuantity'),
        heliumOption: document.getElementById('heliumOption'),
        heliumRate: document.getElementById('heliumRate'),
        heliumQuantity: document.getElementById('heliumQuantity'),
        carbonOption: document.getElementById('carbonOption'),
        carbonRate: document.getElementById('carbonRate'),
        carbonQuantity: document.getElementById('carbonQuantity'),
        neonOption: document.getElementById('neonOption'),
        neonRate: document.getElementById('neonRate'),
        neonQuantity: document.getElementById('neonQuantity'),
        oxygenOption: document.getElementById('oxygenOption'),
        oxygenRate: document.getElementById('oxygenRate'),
        oxygenQuantity: document.getElementById('oxygenQuantity'),
        sodiumOption: document.getElementById('sodiumOption'),
        sodiumRate: document.getElementById('sodiumRate'),
        sodiumQuantity: document.getElementById('sodiumQuantity'),
        siliconOption: document.getElementById('siliconOption'),
        siliconRate: document.getElementById('siliconRate'),
        siliconQuantity: document.getElementById('siliconQuantity'),
        ironOption: document.getElementById('ironOption'),
        ironRate: document.getElementById('ironRate'),
        ironQuantity: document.getElementById('ironQuantity'),
        researchRate: document.getElementById('researchRate'),
        researchQuantity: document.getElementById('researchQuantity'),
        scienceKitQuantity: document.getElementById('scienceKitQuantity'),
        scienceClubQuantity: document.getElementById('scienceClubQuantity'),
        cashStat: document.getElementById('cashStat'),
        optionPaneDescriptions: document.querySelectorAll('.option-pane-description'),
        notificationContainer: document.getElementById('notificationContainer'),
        modalContainer: document.getElementById('modal'),
        modalHeader: document.querySelector('.modal-header h4'),
        modalContent: document.querySelector('.modal-content p'),
        modalOKButton: document.getElementById('modalButton'),
        overlay: document.getElementById('overlay'),
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

export function setResourcesToDeduct(name, amount) {
    if (name === 'clear') {
        resourcesToDeduct = {};
        return;
    }

    if (!resourcesToDeduct[name]) {
        resourcesToDeduct[name] = {};
    }

    resourcesToDeduct[name].deductQuantity = amount;
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

export function setSalePreview(resource, amount, fusionTo1, fusionTo2) {
    const resourceQuantity = getResourceDataObject('resources', [resource, 'quantity']);

    let calculatedAmount;

    switch (amount) {
        case 'all':
            calculatedAmount = Math.floor(resourceQuantity);
            break;
        case 'threeQuarters':
            calculatedAmount = Math.floor(resourceQuantity * 0.75);
            break;
        case 'twoThirds':
            calculatedAmount = Math.floor(resourceQuantity * 2 / 3);
            break;
        case 'half':
            calculatedAmount = Math.floor(resourceQuantity * 0.5);
            break;
        case 'oneThird':
            calculatedAmount = Math.floor(resourceQuantity / 3);
            break;
        case '100000':
            calculatedAmount = Math.min(100000, resourceQuantity);
            break;
        case '10000':
            calculatedAmount = Math.min(10000, resourceQuantity);
            break;
        case '1000':
            calculatedAmount = Math.min(1000, resourceQuantity);
            break;
        case '100':
            calculatedAmount = Math.min(100, resourceQuantity);
            break;
        case '10':
            calculatedAmount = Math.min(10, resourceQuantity);
            break;
        case '1':
            calculatedAmount = Math.min(1, resourceQuantity);
            break;
        default:
            calculatedAmount = 0;
            break;
    }
    setResourceSalePreview(resource, calculatedAmount, fusionTo1, fusionTo2);
}

export function setResourceSalePreview(resource, value, fuseToResource1, fuseToResource2) {
    let fusionFlag = false;
    let tooManyToStore1 = 0;
    let tooManyToStore2 = 0;
    let suffixFusion = '';

    const resourceCapitalised = getResourceDataObject('resources', [resource, 'nameResource']);
    const resourceQuantity = getResourceDataObject('resources', [resource, 'quantity']);
    const resourceSaleValueFactor = getResourceDataObject('resources', [resource, 'saleValue']);

    if (getTechUnlockedArray().includes(getResourceDataObject('resources', [resource, 'canFuseTech']))) {
        const fuseToCapitalised1 = getResourceDataObject('resources', [fuseToResource1, 'nameResource']);
        const fuseToQuantity1 = getResourceDataObject('resources', [fuseToResource1, 'quantity']);
        const fuseToStorage1 = getResourceDataObject('resources', [fuseToResource1, 'storageCapacity']);
        const fuseToRatio1 = getResourceDataObject('resources', [resource, 'fuseToRatio1']);

        fusionFlag = true;
        
        if (Math.floor(value * fuseToRatio1) > fuseToStorage1 - fuseToQuantity1) {
            tooManyToStore1 = 1;
        }
        if (fuseToStorage1 === fuseToQuantity1) {
            tooManyToStore1 = 2;
        }

        const quantityToAddFuseTo1 = Math.min(
            Math.floor(value * fuseToRatio1),
            Math.floor(fuseToStorage1 - fuseToQuantity1)
        );

        let quantityToAddFuseTo2 = 0;
        let fuseToCapitalised2 = '';

        if (fuseToResource2 !== '') {
            fuseToCapitalised2 = getResourceDataObject('resources', [fuseToResource2, 'nameResource']);
            const fuseToQuantity2 = getResourceDataObject('resources', [fuseToResource2, 'quantity']);
            const fuseToStorage2 = getResourceDataObject('resources', [fuseToResource2, 'storageCapacity']);
            const fuseToRatio2 = getResourceDataObject('resources', [resource, 'fuseToRatio2']);
    
            if (Math.floor(value * fuseToRatio2) > fuseToStorage2 - fuseToQuantity2) {
                tooManyToStore2 = 1;
            }
            if (fuseToStorage2 === fuseToQuantity2) {
                tooManyToStore2 = 2;
            }
    
            quantityToAddFuseTo2 = Math.min(
                Math.floor(value * fuseToRatio2),
                Math.floor(fuseToStorage2 - fuseToQuantity2)
            );
        }

        const suffix =
        tooManyToStore1 === 0 && tooManyToStore2 === 0 ? '' :
        tooManyToStore1 > 0 || tooManyToStore2 > 0 ? '!' :
        tooManyToStore1 === 1 || tooManyToStore2 === 1 ? '!' :
        tooManyToStore1 === 2 || tooManyToStore2 === 2 ? '!!' :
        '';    
        
        suffixFusion = ` -> ${quantityToAddFuseTo1} ${fuseToCapitalised1}, ${quantityToAddFuseTo2} ${fuseToCapitalised2}${suffix}`;

        if (!getUnlockedResourcesArray().includes(fuseToResource1) && !getUnlockedResourcesArray().includes(fuseToResource2)) {
            suffixFusion = '';
        }
    }

    if (getCurrencySymbol() !== "€") {
        if (value <= resourceQuantity) {
            salePreviews[resource] =
                `<span class="green-ready-text notation sell-fuse-money">${getCurrencySymbol()}${(value * resourceSaleValueFactor).toFixed(2)}</span>` +
                ' (' +
                value + ' ' + resourceCapitalised + (fusionFlag ? suffixFusion : '') + ')';
        } else {
            salePreviews[resource] =
                `<span class="green-ready-text notation sell-fuse-money">${getCurrencySymbol()}${(resourceQuantity * resourceSaleValueFactor).toFixed(2)}</span>` +
                ' (' +
                resourceQuantity + ' ' + resourceCapitalised + (fusionFlag ? suffixFusion : '') + ')';
        }
    } else {
        if (value <= resourceQuantity) {
            salePreviews[resource] =
                `<span class="green-ready-text notation sell-fuse-money">${(value * resourceSaleValueFactor).toFixed(2)}${getCurrencySymbol()}</span>` +
                ' (' +
                value + ' ' + resourceCapitalised + (fusionFlag ? suffixFusion : '') + ')';
        } else {
            salePreviews[resource] =
                `<span class="green-ready-text notation sell-fuse-money">${(resourceQuantity * resourceSaleValueFactor).toFixed(2)}${getCurrencySymbol()}</span>` +
                ' (' +
                resourceQuantity + ' ' + resourceCapitalised + (fusionFlag ? suffixFusion : '') + ')';
        }
    } 
}

export function getResourceSalePreview(key) {
    return salePreviews[key];
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

export function getUnlockedResourcesArray() {
    return unlockedResourcesArray;
}

export function setUnlockedResourcesArray(value) {
    unlockedResourcesArray.unshift(value);
}

export function setTechSpecificUIItemsArray(key, type, value) {
    if (!techSpecificUIItemsArray[key]) {
        techSpecificUIItemsArray[key] = {};
    }
    techSpecificUIItemsArray[key][type] = value;
}

export function getTechSpecificUIItemsArray(key, type) {
    if (techSpecificUIItemsArray[key] && techSpecificUIItemsArray[key][type]) {
        return techSpecificUIItemsArray[key][type];
    }
    return null;
}

export function getOriginalFrameNumbers() {
    return originalFrameNumbers;
}

export function setOriginalFrameNumbers(value) {
    originalFrameNumbers = value;
}

export function getTemporaryRowsRepo(key) {
    return temporaryRowsRepo[key];
}

export function setTemporaryRowsRepo(containerValue, rowsValue) {
    if (!temporaryRowsRepo) {
        temporaryRowsRepo = {};
    }
    if (containerValue !== 'noChange') {
        temporaryRowsRepo.container = containerValue;
    }
    
    temporaryRowsRepo.rows = rowsValue;
}

export function getCanAffordDeferred() {
    return canAffordDeferred;
}

export function setCanAffordDeferred(value) {
    canAffordDeferred = value;
}

export function getTempSellRowValue() {
    return tempSellRowValue;
}

export function setTempSellRowValue(value) {
    tempSellRowValue = value;
}

export function getTechRenderChange() {
    return techRenderChange;
}

export function setTechRenderChange(value) {
    techRenderChange = value;
}

export function getTechRenderCounter() {
    return techRenderCounter;
}

export function setTechRenderCounter(value) {
    techRenderCounter = value;
}
