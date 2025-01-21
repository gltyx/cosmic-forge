import { restoreResourceDataObject, restoreStarSystemsDataObject, resourceData, starSystems, getResourceDataObject, setResourceDataObject } from "./resourceDataObject.js";
import { initializeAutoSave } from './saveLoadGame.js';
import { drawTechTree, selectTheme } from "./ui.js";
import { capitaliseString } from './utilityFunctions.js';
import { offlineGains } from './game.js';


//DEBUG
export let debugFlag = false;
export let debugOptionFlag = false;
export let stateLoading = false;
export const debugVisibilityArray = ['settingsNotificationTestRow'];

//ELEMENTS
let elements;
let saveData = null;
// let localization = {};
// let language = 'en';
// let languageSelected = 'en';
// let oldLanguage = 'en';

//CONSTANTS
export const MENU_STATE = 'menuState';
export const GAME_VISIBLE_ACTIVE = 'gameVisibleActive';
export const TIMER_UPDATE_INTERVAL = 10;
export const TIMER_RATE_RATIO = 100;
export const READY_TO_SORT = 120;
export const NOW = 30; //READY TO SORT NOW needs total of 150
export const BUILDING_TYPES = ['energy'];
export const deferredActions = [];

//GLOBAL VARIABLES
export let gameState;

let cachedRenderedTechTree = null;
let saveName = null;
let lastSavedTimeStamp = null;
let currentTheme = 'terminal';
let autoSaveFrequency = 300000;
let currentStarSystem = 'spica';
let currentStarSystemWeatherEfficiency = [];
let currentPrecipitationRate = 0;
let techRenderCounter = 0;
let tempRowValue = null;
let currencySymbol = '$';
let increaseStorageFactor = 2;
let saleResourcePreviews = {};
let saleCompoundPreviews = {};
let createCompoundPreviews = {};
let constituentPartsObject = {};
let itemsToDeduct = {};
let itemsToIncreasePrice = {};
let techUnlockedArray = [];
let revealedTechArray = [];
let upcomingTechArray = [];
let techSpecificUIItemsArray = {};
let unlockedResourcesArray = ['hydrogen'];
let unlockedCompoundsArray = [];
let temporaryRowsRepo = null;
let canAffordDeferred = null;
let originalFrameNumbers = {};

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

let activatedFuelBurnObject = {
    carbon: false,
};

let buildingTypeOnOff = {
    powerPlant1: false,
    powerPlant2: false,
    powerPlant3: false,
}

let ranOutOfFuelWhenOn = {
    powerPlant1: false,
    powerPlant2: false,
    powerPlant3: false,
}

let currentTab = [1, 'Resources'];
let currentOptionPane = null;
let notationType = 'normalCondensed';

//FLAGS
// let audioMuted;
// let languageChangedFlag;
let autoSaveToggle = false;
let notificationsToggle = true;
let techRenderChange = false;
let losingEnergy = false;
let powerOnOff = false;
let trippedStatus = false;
let savedYetSinceOpeningSaveDialogue = false;
let techTreeDrawnYet = false;

// let autoSaveOn = false;
// export let pauseAutoSaveCountdown = true;

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
        dieselOption: document.getElementById('dieselOption'),
        dieselRate: document.getElementById('dieselRate'),
        dieselQuantity: document.getElementById('dieselQuantity'),
        waterOption: document.getElementById('waterOption'),
        waterRate: document.getElementById('waterRate'),
        waterQuantity: document.getElementById('waterQuantity'),
        glassOption: document.getElementById('glassOption'),
        glassRate: document.getElementById('glassRate'),
        glassQuantity: document.getElementById('glassQuantity'),
        steelOption: document.getElementById('steelOption'),
        steelRate: document.getElementById('steelRate'),
        steelQuantity: document.getElementById('steelQuantity'),
        concreteOption: document.getElementById('concreteOption'),
        concreteRate: document.getElementById('concreteRate'),
        concreteQuantity: document.getElementById('concreteQuantity'),
        energyRate: document.getElementById('energyRate'),
        energyQuantity: document.getElementById('energyQuantity'),
        powerPlant1Quantity: document.getElementById('powerPlant1Quantity'),
        powerPlant1Rate: document.getElementById('powerPlant1Rate'),
        powerPlant2Quantity: document.getElementById('powerPlant2Quantity'),
        powerPlant2Rate: document.getElementById('powerPlant2Rate'),
        powerPlant3Quantity: document.getElementById('powerPlant3Quantity'),
        powerPlant3Rate: document.getElementById('powerPlant3Rate'),
        battery1Quantity: document.getElementById('battery1Quantity'),
        battery2Quantity: document.getElementById('battery2Quantity'),
        battery3Quantity: document.getElementById('battery3Quantity'),
        researchRate: document.getElementById('researchRate'),
        researchQuantity: document.getElementById('researchQuantity'),
        scienceKitQuantity: document.getElementById('scienceKitQuantity'),
        scienceClubQuantity: document.getElementById('scienceClubQuantity'),
        scienceLabQuantity: document.getElementById('scienceLabQuantity'),
        cashStat: document.getElementById('cashStat'),
        optionPaneDescriptions: document.querySelectorAll('.option-pane-description'),
        notificationContainer: document.getElementById('notificationContainer'),
        modalContainer: document.getElementById('modal'),
        modalHeader: document.querySelector('.modal-header h4'),
        modalContent: document.querySelector('.modal-content p'),
        modalOKButton: document.getElementById('modalButton'),
        modalSaveButton: document.getElementById('modalSaveButton'),
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

// export function getLanguageChangedFlag() {
//     return languageChangedFlag;
// }

// export function setLanguageChangedFlag(value) {
//     languageChangedFlag = value;
// }

export function resetAllVariables() {
    // GLOBAL VARIABLES

    // FLAGS
}

export function captureGameStatusForSaving(type) {
    let gameState = {};

    if (type === 'manualExportCloud') {
        setSaveName(document.getElementById('saveName').value);
        localStorage.setItem('saveName', getSaveName());
    }

    if (type === 'initialise') {
        localStorage.setItem('saveName', getSaveName());
    }

    // Large objects directly
    gameState.resourceData = JSON.parse(JSON.stringify(resourceData));
    gameState.starSystems = JSON.parse(JSON.stringify(starSystems));

    // Global variables
    gameState.saveName = getSaveName();
    gameState.currentTheme = getCurrentTheme();
    gameState.autoSaveFrequency = getAutoSaveFrequency();
    gameState.currentStarSystem = getCurrentStarSystem();
    gameState.currentStarSystemWeatherEfficiency = getCurrentStarSystemWeatherEfficiency();
    gameState.currentPrecipitationRate = getCurrentPrecipitationRate();
    gameState.currencySymbol = getCurrencySymbol();
    gameState.constituentPartsObject = getConstituentPartsObject();
    gameState.techUnlockedArray = techUnlockedArray;
    gameState.revealedTechArray = revealedTechArray;
    gameState.upcomingTechArray = upcomingTechArray;
    gameState.techSpecificUIItemsArray = techSpecificUIItemsArray;
    gameState.unlockedResourcesArray = unlockedResourcesArray;
    gameState.unlockedCompoundsArray = unlockedResourcesArray;
    gameState.activatedFuelBurnObject = activatedFuelBurnObject;
    gameState.buildingTypeOnOff = buildingTypeOnOff;
    gameState.ranOutOfFuelWhenOn = ranOutOfFuelWhenOn;
    gameState.notationType = getNotationType();

    // Flags
    gameState.flags = {
        autoSaveToggle: getAutoSaveToggle(),
        notificationsToggle: getNotificationsToggle(),
        techRenderChange: getTechRenderChange(),
        losingEnergy: getLosingEnergy(),
        powerOnOff: getPowerOnOff(),
        trippedStatus: getTrippedStatus(),
    };

    return gameState;
}
export function restoreGameStatus(gameState, type) {
    return new Promise((resolve, reject) => {
        try {
            // Game variables
            restoreResourceDataObject(JSON.parse(JSON.stringify(gameState.resourceData)));
            restoreStarSystemsDataObject(JSON.parse(JSON.stringify(gameState.starSystems)));

            // Global variables
            if (type === 'cloud') {
                if (gameState.saveName) {
                    setSaveName(gameState.saveName);
                }
            }

            setCurrentTheme(gameState.currentTheme);
            setAutoSaveFrequency(gameState.autoSaveFrequency);
            setCurrentStarSystem(gameState.currentStarSystem);
            setCurrentStarSystemWeatherEfficiency(gameState.currentStarSystemWeatherEfficiency);
            setCurrentPrecipitationRate(gameState.currentPrecipitationRate);
            setCurrencySymbol(gameState.currencySymbol);
            setConstituentPartsObject(gameState.constituentPartsObject);
            techUnlockedArray = gameState.techUnlockedArray;
            revealedTechArray = gameState.revealedTechArray;
            upcomingTechArray = gameState.upcomingTechArray;
            techSpecificUIItemsArray = gameState.techSpecificUIItemsArray;
            unlockedResourcesArray = gameState.unlockedResourcesArray;
            unlockedCompoundsArray = gameState.unlockedCompoundsArray;
            activatedFuelBurnObject = gameState.activatedFuelBurnObject;
            buildingTypeOnOff = gameState.buildingTypeOnOff;
            ranOutOfFuelWhenOn = gameState.ranOutOfFuelWhenOn;
            setNotationType(gameState.notationType);

            // Flags
            setAutoSaveToggle(gameState.flags.autoSaveToggle);
            setNotificationsToggle(gameState.flags.notificationsToggle);
            setTechRenderChange(gameState.flags.techRenderChange);
            setLosingEnergy(gameState.flags.losingEnergy);
            setPowerOnOff(gameState.flags.powerOnOff);
            setTrippedStatus(gameState.flags.trippedStatus);

            initializeAutoSave();
            selectTheme(getCurrentTheme());
            setLastSavedTimeStamp(gameState.timeStamp);
            offlineGains(false);
            
            const autoSaveToggleElement = document.getElementById('autoSaveToggle');
            const autoSaveFrequencyElement = document.getElementById('autoSaveFrequency');

            if (autoSaveFrequencyElement) {
                autoSaveFrequencyElement.value = getAutoSaveFrequency();
            }
            
            if (autoSaveToggleElement) {
                autoSaveToggleElement.checked = getAutoSaveToggle();
            }

            resolve();
        } catch (error) {
            reject(error);
        }
    });
}


// export function setLocalization(value) {
//     localization = value;
// }

// export function getLocalization() {
//     return localization;
// }

// export function setLanguage(value) {
//     language = value;
// }

// export function getLanguage() {
//     return language;
// }

// export function setOldLanguage(value) {
//     oldLanguage = value;
// }

// export function getOldLanguage() {
//     return oldLanguage;
// }

// export function setAudioMuted(value) {
//     audioMuted = value;
// }

// export function getAudioMuted() {
//     return audioMuted;
// }

export function getMenuState() {
    return MENU_STATE;
}

export function getGameVisibleActive() {
    return GAME_VISIBLE_ACTIVE;
}

// export function getLanguageSelected() {
//     return languageSelected;
// }

// export function setLanguageSelected(value) {
//     languageSelected = value;
// }

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

export function getAutoSaveToggle() {
    return autoSaveToggle;
}

export function setAutoSaveToggle(value) {
    autoSaveToggle = value;
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

export function setItemsToDeduct(nameArray, amountArray, itemTypeArray, resourcePrices) {
    if (nameArray === 'clear') {
        itemsToDeduct = {};
        return;
    }

    let optionalName1 = resourcePrices[0][1];
    let optionalName2 = resourcePrices[1][1];
    let optionalName3 = resourcePrices[2][1];

    if (!itemsToDeduct[nameArray]) {
        itemsToDeduct[nameArray] = {};
    }

    if (!itemsToDeduct[optionalName1]) {
        itemsToDeduct[optionalName1] = {};
    }
    if (!itemsToDeduct[optionalName2]) {
        itemsToDeduct[optionalName2] = {};
    }
    if (!itemsToDeduct[optionalName3]) {
        itemsToDeduct[optionalName3] = {};
    }

    nameArray.forEach((name, index) => {
        itemsToDeduct[name] = {
            deductQuantity: amountArray[index],
            typeOfResourceCompound: itemTypeArray[index],
        };
    });    

    itemsToDeduct[optionalName1].deductQuantity = resourcePrices[0][0];
    itemsToDeduct[optionalName1].typeOfResourceCompound = resourcePrices[0][2];
    itemsToDeduct[optionalName1].resourceOrder = 'resource1Price';

    itemsToDeduct[optionalName2].deductQuantity = resourcePrices[1][0];
    itemsToDeduct[optionalName2].typeOfResourceCompound = resourcePrices[1][2];
    itemsToDeduct[optionalName2].resourceOrder = 'resource2Price';

    itemsToDeduct[optionalName3].deductQuantity = resourcePrices[2][0];
    itemsToDeduct[optionalName3].typeOfResourceCompound = resourcePrices[2][2];
    itemsToDeduct[optionalName3].resourceOrder = 'resource3Price';
}

export function getItemsToDeduct() {
    return itemsToDeduct;
}

export function setItemsToIncreasePrice(name, setPriceTarget, currentPrice, itemResourceOrCompound, resourcePrices) {
    if (name === 'clear') {
        itemsToIncreasePrice = {};
        return;
    }

    let optionalName1 = resourcePrices[0][1];
    let optionalName2 = resourcePrices[1][1];
    let optionalName3 = resourcePrices[2][1];

    if (!itemsToIncreasePrice[name]) {
        itemsToIncreasePrice[name] = {};
    }
    if (!itemsToIncreasePrice[optionalName1]) {
        itemsToIncreasePrice[optionalName1] = {};
    }
    if (!itemsToIncreasePrice[optionalName2]) {
        itemsToIncreasePrice[optionalName2] = {};
    }
    if (!itemsToIncreasePrice[optionalName3]) {
        itemsToIncreasePrice[optionalName3] = {};
    }

    itemsToIncreasePrice[name].currentPrice = currentPrice;
    itemsToIncreasePrice[name].setPriceTarget = setPriceTarget;
    itemsToIncreasePrice[name].typeOfResourceCompound = itemResourceOrCompound;

    itemsToIncreasePrice[optionalName1].currentPrice = resourcePrices[0][0];
    itemsToIncreasePrice[optionalName1].setPriceTarget = setPriceTarget;
    itemsToIncreasePrice[optionalName1].typeOfResourceCompound = resourcePrices[0][2];
    itemsToIncreasePrice[optionalName1].resourceOrder = 'resource1Price';
    
    itemsToIncreasePrice[optionalName2].currentPrice = resourcePrices[1][0];
    itemsToIncreasePrice[optionalName2].setPriceTarget = setPriceTarget;
    itemsToIncreasePrice[optionalName2].typeOfResourceCompound = resourcePrices[1][2];
    itemsToIncreasePrice[optionalName2].resourceOrder = 'resource2Price';
    
    itemsToIncreasePrice[optionalName3].currentPrice = resourcePrices[2][0];
    itemsToIncreasePrice[optionalName3].setPriceTarget = setPriceTarget;
    itemsToIncreasePrice[optionalName3].typeOfResourceCompound = resourcePrices[2][2];
    itemsToIncreasePrice[optionalName3].resourceOrder = 'resource3Price';
}

export function getItemsToIncreasePrice() {
    return itemsToIncreasePrice;
}

export function setSaleResourcePreview(resource, amount, fusionTo1, fusionTo2) {
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

export function setSaleCompoundPreview(compound, amount) {
    const compoundQuantity = getResourceDataObject('compounds', [compound, 'quantity']);

    let calculatedAmount;

    switch (amount) {
        case 'all':
            calculatedAmount = Math.floor(compoundQuantity);
            break;
        case 'threeQuarters':
            calculatedAmount = Math.floor(compoundQuantity * 0.75);
            break;
        case 'twoThirds':
            calculatedAmount = Math.floor(compoundQuantity * 2 / 3);
            break;
        case 'half':
            calculatedAmount = Math.floor(compoundQuantity * 0.5);
            break;
        case 'oneThird':
            calculatedAmount = Math.floor(compoundQuantity / 3);
            break;
        case '100000':
            calculatedAmount = Math.min(100000, compoundQuantity);
            break;
        case '10000':
            calculatedAmount = Math.min(10000, compoundQuantity);
            break;
        case '1000':
            calculatedAmount = Math.min(1000, compoundQuantity);
            break;
        case '100':
            calculatedAmount = Math.min(100, compoundQuantity);
            break;
        case '10':
            calculatedAmount = Math.min(10, compoundQuantity);
            break;
        case '1':
            calculatedAmount = Math.min(1, compoundQuantity);
            break;
        default:
            calculatedAmount = 0;
            break;
    }
    setCompoundSalePreview(compound, calculatedAmount);
}

export function setCreateCompoundPreview(compoundToCreate, amount) {
    const type1 = getResourceDataObject('compounds', [compoundToCreate, 'createsFrom1'])[1];
    const type2 = getResourceDataObject('compounds', [compoundToCreate, 'createsFrom2'])[1];
    const type3 = getResourceDataObject('compounds', [compoundToCreate, 'createsFrom3'])[1];
    const type4 = getResourceDataObject('compounds', [compoundToCreate, 'createsFrom4'])[1];

    const constituentParts1 = getResourceDataObject('compounds', [compoundToCreate, 'createsFrom1'])[0];
    const constituentParts2 = getResourceDataObject('compounds', [compoundToCreate, 'createsFrom2'])[0];
    const constituentParts3 = getResourceDataObject('compounds', [compoundToCreate, 'createsFrom3'])[0];
    const constituentParts4 = getResourceDataObject('compounds', [compoundToCreate, 'createsFrom4'])[0];

    const constituentPartsRatio1 = getResourceDataObject('compounds', [compoundToCreate, 'createsFromRatio1']) || 0;
    const constituentPartsRatio2 = getResourceDataObject('compounds', [compoundToCreate, 'createsFromRatio2']) || 0;
    const constituentPartsRatio3 = getResourceDataObject('compounds', [compoundToCreate, 'createsFromRatio3']) || 0;
    const constituentPartsRatio4 = getResourceDataObject('compounds', [compoundToCreate, 'createsFromRatio4']) || 0;

    const constituentParts1Quantity = type1 ? getResourceDataObject(type1, [constituentParts1, 'quantity']) || 0 : 0;
    const constituentParts2Quantity = type2 ? getResourceDataObject(type2, [constituentParts2, 'quantity']) || 0 : 0;
    const constituentParts3Quantity = type3 ? getResourceDataObject(type3, [constituentParts3, 'quantity']) || 0 : 0;
    const constituentParts4Quantity = type4 ? getResourceDataObject(type4, [constituentParts4, 'quantity']) || 0 : 0;
    
    // Calculate max constituent parts that can be used
    const maxConstituentParts1 = constituentPartsRatio1 > 0 ? Math.floor(constituentParts1Quantity / constituentPartsRatio1) : Infinity;
    const maxConstituentParts2 = constituentPartsRatio2 > 0 ? Math.floor(constituentParts2Quantity / constituentPartsRatio2) : Infinity;
    const maxConstituentParts3 = constituentPartsRatio3 > 0 ? Math.floor(constituentParts3Quantity / constituentPartsRatio3) : Infinity;
    const maxConstituentParts4 = constituentPartsRatio4 > 0 ? Math.floor(constituentParts4Quantity / constituentPartsRatio4) : Infinity;

    const maxCompoundToCreate = Math.min(maxConstituentParts1, maxConstituentParts2, maxConstituentParts3, maxConstituentParts4);

    let createAmount;
    let constituentPartsQuantityNeeded1 = 0;
    let constituentPartsQuantityNeeded2 = 0;
    let constituentPartsQuantityNeeded3 = 0;
    let constituentPartsQuantityNeeded4 = 0;

    switch (amount) {
        case 'max':
            createAmount = Math.floor(maxCompoundToCreate * 1);
            constituentPartsQuantityNeeded1 = createAmount * constituentPartsRatio1;
            constituentPartsQuantityNeeded2 = createAmount * constituentPartsRatio2;
            constituentPartsQuantityNeeded3 = createAmount * constituentPartsRatio3;
            constituentPartsQuantityNeeded4 = createAmount * constituentPartsRatio4;
            break;
        case 'threeQuarters':
            createAmount = Math.floor(maxCompoundToCreate * 0.75);
            constituentPartsQuantityNeeded1 = createAmount * constituentPartsRatio1;
            constituentPartsQuantityNeeded2 = createAmount * constituentPartsRatio2;
            constituentPartsQuantityNeeded3 = createAmount * constituentPartsRatio3;
            constituentPartsQuantityNeeded4 = createAmount * constituentPartsRatio4;
            break;
        case 'twoThirds':
            createAmount = Math.floor(maxCompoundToCreate * (2 / 3));
            constituentPartsQuantityNeeded1 = createAmount * constituentPartsRatio1;
            constituentPartsQuantityNeeded2 = createAmount * constituentPartsRatio2;
            constituentPartsQuantityNeeded3 = createAmount * constituentPartsRatio3;
            constituentPartsQuantityNeeded4 = createAmount * constituentPartsRatio4;
            break;
        case 'half':
            createAmount = Math.floor(maxCompoundToCreate * 0.5);
            constituentPartsQuantityNeeded1 = createAmount * constituentPartsRatio1;
            constituentPartsQuantityNeeded2 = createAmount * constituentPartsRatio2;
            constituentPartsQuantityNeeded3 = createAmount * constituentPartsRatio3;
            constituentPartsQuantityNeeded4 = createAmount * constituentPartsRatio4;
            break;
        case 'oneThird':
            createAmount = Math.floor(maxCompoundToCreate * (1 / 3));
            constituentPartsQuantityNeeded1 = createAmount * constituentPartsRatio1;
            constituentPartsQuantityNeeded2 = createAmount * constituentPartsRatio2;
            constituentPartsQuantityNeeded3 = createAmount * constituentPartsRatio3;
            constituentPartsQuantityNeeded4 = createAmount * constituentPartsRatio4;
            break;
        case '50000':
            createAmount = Math.min(maxCompoundToCreate, 50000);
            constituentPartsQuantityNeeded1 = createAmount * constituentPartsRatio1;
            constituentPartsQuantityNeeded2 = createAmount * constituentPartsRatio2;
            constituentPartsQuantityNeeded3 = createAmount * constituentPartsRatio3;
            constituentPartsQuantityNeeded4 = createAmount * constituentPartsRatio4;
            break;
        case '5000':
            createAmount = Math.min(maxCompoundToCreate, 5000);
            constituentPartsQuantityNeeded1 = createAmount * constituentPartsRatio1;
            constituentPartsQuantityNeeded2 = createAmount * constituentPartsRatio2;
            constituentPartsQuantityNeeded3 = createAmount * constituentPartsRatio3;
            constituentPartsQuantityNeeded4 = createAmount * constituentPartsRatio4;
            break;
        case '500':
            createAmount = Math.min(maxCompoundToCreate, 500);
            constituentPartsQuantityNeeded1 = createAmount * constituentPartsRatio1;
            constituentPartsQuantityNeeded2 = createAmount * constituentPartsRatio2;
            constituentPartsQuantityNeeded3 = createAmount * constituentPartsRatio3;
            constituentPartsQuantityNeeded4 = createAmount * constituentPartsRatio4;
            break;
        case '50':
            createAmount = Math.min(maxCompoundToCreate, 50);
            constituentPartsQuantityNeeded1 = createAmount * constituentPartsRatio1;
            constituentPartsQuantityNeeded2 = createAmount * constituentPartsRatio2;
            constituentPartsQuantityNeeded3 = createAmount * constituentPartsRatio3;
            constituentPartsQuantityNeeded4 = createAmount * constituentPartsRatio4;
            break;
        case '5':
            createAmount = Math.min(maxCompoundToCreate, 5);
            constituentPartsQuantityNeeded1 = createAmount * constituentPartsRatio1;
            constituentPartsQuantityNeeded2 = createAmount * constituentPartsRatio2;
            constituentPartsQuantityNeeded3 = createAmount * constituentPartsRatio3;
            constituentPartsQuantityNeeded4 = createAmount * constituentPartsRatio4;
            break;
        case '1':
            createAmount = Math.min(maxCompoundToCreate, 1);
            constituentPartsQuantityNeeded1 = createAmount * constituentPartsRatio1;
            constituentPartsQuantityNeeded2 = createAmount * constituentPartsRatio2;
            constituentPartsQuantityNeeded3 = createAmount * constituentPartsRatio3;
            constituentPartsQuantityNeeded4 = createAmount * constituentPartsRatio4;
            break;
        default:
            createAmount = 0;
            break;
    }

    setCompoundCreatePreview(compoundToCreate, createAmount, 
        constituentPartsQuantityNeeded1, 
        constituentPartsQuantityNeeded2, 
        constituentPartsQuantityNeeded3, 
        constituentPartsQuantityNeeded4);
}

export function setCompoundCreatePreview(compoundToCreate, createAmount, amountConstituentPart1, amountConstituentPart2, amountConstituentPart3, amountConstituentPart4) {
    const compoundToCreateCapitalised = getResourceDataObject('compounds', [compoundToCreate, 'nameResource']);
    const compoundToCreateQuantity = getResourceDataObject('compounds', [compoundToCreate, 'quantity']);
    const compoundToCreateStorage = getResourceDataObject('compounds', [compoundToCreate, 'storageCapacity']);
    
    const constituentPartString1 = capitaliseString(getResourceDataObject('compounds', [compoundToCreate, 'createsFrom1'])[0]);
    const constituentPartString2 = capitaliseString(getResourceDataObject('compounds', [compoundToCreate, 'createsFrom2'])[0]);
    const constituentPartString3 = capitaliseString(getResourceDataObject('compounds', [compoundToCreate, 'createsFrom3'])[0]);
    const constituentPartString4 = capitaliseString(getResourceDataObject('compounds', [compoundToCreate, 'createsFrom4'])[0]);
    
    let constituentParts = [];
    
    if (amountConstituentPart1 > 0) {
        constituentParts.push(`${amountConstituentPart1} ${constituentPartString1}`);
    }
    if (amountConstituentPart2 > 0) {
        constituentParts.push(`${amountConstituentPart2} ${constituentPartString2}`);
    }
    if (amountConstituentPart3 > 0) {
        constituentParts.push(`${amountConstituentPart3} ${constituentPartString3}`);
    }
    if (amountConstituentPart4 > 0) {
        constituentParts.push(`${amountConstituentPart4} ${constituentPartString4}`);
    }
    
    const suffix = (compoundToCreateQuantity + createAmount > compoundToCreateStorage) ? '!' : '';
    const partsString = constituentParts.join(', ');

    createCompoundPreviews[compoundToCreate] =
        `${createAmount} ${compoundToCreateCapitalised} (${partsString}${suffix})`;
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
            saleResourcePreviews[resource] =
                `<span class="green-ready-text notation sell-fuse-money">${getCurrencySymbol()}${(value * resourceSaleValueFactor).toFixed(2)}</span>` +
                ' (' +
                value + ' ' + resourceCapitalised + (fusionFlag ? suffixFusion : '') + ')';
        } else {
            saleResourcePreviews[resource] =
                `<span class="green-ready-text notation sell-fuse-money">${getCurrencySymbol()}${(resourceQuantity * resourceSaleValueFactor).toFixed(2)}</span>` +
                ' (' +
                resourceQuantity + ' ' + resourceCapitalised + (fusionFlag ? suffixFusion : '') + ')';
        }
    } else {
        if (value <= resourceQuantity) {
            saleResourcePreviews[resource] =
                `<span class="green-ready-text notation sell-fuse-money">${(value * resourceSaleValueFactor).toFixed(2)}${getCurrencySymbol()}</span>` +
                ' (' +
                value + ' ' + resourceCapitalised + (fusionFlag ? suffixFusion : '') + ')';
        } else {
            saleResourcePreviews[resource] =
                `<span class="green-ready-text notation sell-fuse-money">${(resourceQuantity * resourceSaleValueFactor).toFixed(2)}${getCurrencySymbol()}</span>` +
                ' (' +
                resourceQuantity + ' ' + resourceCapitalised + (fusionFlag ? suffixFusion : '') + ')';
        }
    } 
}

export function setCompoundSalePreview(compound, value) {
    const compoundCapitalised = getResourceDataObject('compounds', [compound, 'nameResource']);
    const compoundQuantity = getResourceDataObject('compounds', [compound, 'quantity']);
    const compoundSaleValueFactor = getResourceDataObject('compounds', [compound, 'saleValue']);

    if (getCurrencySymbol() !== "€") {
        if (value <= compoundQuantity) {
            saleCompoundPreviews[compound] =
                `<span class="green-ready-text notation sell-fuse-money">${getCurrencySymbol()}${(value * compoundSaleValueFactor).toFixed(2)}</span>` +
                ' (' +
                value + ' ' + compoundCapitalised + ')';
        } else {
            saleCompoundPreviews[compound] =
                `<span class="green-ready-text notation sell-fuse-money">${getCurrencySymbol()}${(compoundQuantity * compoundSaleValueFactor).toFixed(2)}</span>` +
                ' (' +
                compoundQuantity + ' ' + compoundCapitalised + ')';
        }
    } else {
        if (value <= compoundQuantity) {
            saleCompoundPreviews[compound] =
                `<span class="green-ready-text notation sell-fuse-money">${(value * compoundSaleValueFactor).toFixed(2)}${getCurrencySymbol()}</span>` +
                ' (' +
                value + ' ' + compoundCapitalised + ')';
        } else {
            saleCompoundPreviews[compound] =
                `<span class="green-ready-text notation sell-fuse-money">${(compoundQuantity * compoundSaleValueFactor).toFixed(2)}${getCurrencySymbol()}</span>` +
                ' (' +
                compoundQuantity + ' ' + compoundCapitalised + ')';
        }
    } 
}

export function getCompoundCreatePreview(key) {
    return createCompoundPreviews[key];
}

export function getResourceSalePreview(key) {
    return saleResourcePreviews[key];
}

export function getCompoundSalePreview(key) {
    return saleCompoundPreviews[key];
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

export function getUpcomingTechArray() {
    return upcomingTechArray;
}

export function setUpcomingTechArray(value) {
    upcomingTechArray.unshift(value);
}

export function getUnlockedResourcesArray() {
    return unlockedResourcesArray;
}

export function setUnlockedResourcesArray(value) {
    unlockedResourcesArray.unshift(value);
}

export function getUnlockedCompoundsArray() {
    return unlockedCompoundsArray;
}

export function setUnlockedCompoundsArray(value) {
    unlockedCompoundsArray.unshift(value);
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

export function getTempRowValue() {
    return tempRowValue;
}

export function setTempRowValue(value) {
    tempRowValue = value;
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

export function getBuildingTypes() {
    return BUILDING_TYPES;
}

export function setTotalEnergyUse(value) {
    setResourceDataObject(value, 'buildings', ['energy', 'consumption']);
}

export function getTotalEnergyUse() {
    return getResourceDataObject('buildings', ['energy', 'consumption']);
}

export function setLosingEnergy(value) {
    losingEnergy = value;
}

export function getLosingEnergy() {
    return losingEnergy;
}

export function setPowerOnOff(value) {
    powerOnOff = value;

    if (!value) { //if power cuts off set all buttons to Activate mode ie deactivated.
        const powerBuildings = getResourceDataObject('buildings', ['energy', 'upgrades']);

        Object.keys(powerBuildings).forEach(powerBuilding => {
            if (powerBuilding.startsWith('power')) {
                const powerBuildingToggleButtonId = powerBuilding + 'Toggle';
                if (document.getElementById(powerBuildingToggleButtonId)) {
                    setBuildingTypeOnOff(powerBuilding, false);
                    document.getElementById(powerBuildingToggleButtonId).textContent = 'Activate';
                }
            }
        });
    }
}

export function getPowerOnOff() {
    return powerOnOff;
}

export function setConstituentPartsObject(value) {
    constituentPartsObject = value;
}

export function getConstituentPartsObject() {
    return constituentPartsObject;
}

export function getActivatedFuelBurnObject(fuelType) {
    return activatedFuelBurnObject[fuelType];
}

export function setActivatedFuelBurnObject(fuelType, value) {
    activatedFuelBurnObject[fuelType] = value;
}

export function getBuildingTypeOnOff(building) {
    return buildingTypeOnOff[building];
}

export function setBuildingTypeOnOff(building, value) {
    if (value) {
        setTrippedStatus(false);
    }

    const powerPlant1PurchasedRate = getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant1', 'purchasedRate']);
    const powerPlant2PurchasedRate = getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant2', 'purchasedRate']);
    const powerPlant3PurchasedRate = getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant3', 'purchasedRate']);
    
    const totalRate = powerPlant1PurchasedRate + powerPlant2PurchasedRate + powerPlant3PurchasedRate;

    if (!getResourceDataObject('buildings', ['energy', 'batteryBoughtYet']) && getResourceDataObject('buildings', ['energy', 'consumption']) > totalRate) {
        setTrippedStatus(true);
    }

    buildingTypeOnOff[building] = value;
}

export function getRanOutOfFuelWhenOn(building) {
    return ranOutOfFuelWhenOn[building];
}

export function setRanOutOfFuelWhenOn(building, value) {
    ranOutOfFuelWhenOn[building] = value;
}

export function getTrippedStatus() {
    return trippedStatus;
}

export function setTrippedStatus(value) {
    trippedStatus = value;
}

export function getCurrentStarSystem() {
    return currentStarSystem;
}

export function setCurrentStarSystem(value) {
    currentStarSystem = value;
}

export function eNCrQueen() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const result = proxyServerEngineDKrypt(
                'U2FsdGVkX18AWb6elOwkLERwy9MKHXi4kHg49lJuW7SwWFfZDVccHyATjgEPdrqQA7N5OE8qxcFguBP/szFmTA==',
                String((101 * 96) - (5 * 19) + Math.pow(3, 4) % 3)
            );
            resolve(result);  // Resolve the promise after the delay
        }, 100); // 1-second delay
    });
}

export function getCurrentStarSystemWeatherEfficiency() {
    return currentStarSystemWeatherEfficiency;
}

export function setCurrentStarSystemWeatherEfficiency(value) {
    currentStarSystemWeatherEfficiency = value;
}

export function getCurrentPrecipitationRate() {
    return currentPrecipitationRate;
}

export function setCurrentPrecipitationRate(value) {
    currentPrecipitationRate = value;
}

export function getSaveData() {
    return saveData;
}

export function setSaveData(value) {
    saveData = value;
}

export function getAutoSaveFrequency() {
    return autoSaveFrequency;
}

export function setAutoSaveFrequency(value) {
    autoSaveFrequency = value;
}

export function getCurrentTheme() {
    return currentTheme;
}

export function setCurrentTheme(value) {
    currentTheme = value;
}

export function getLastSavedTimeStamp() {
    return lastSavedTimeStamp;
}

export function setLastSavedTimeStamp(value) {
    lastSavedTimeStamp = value;
}

export function getSaveName() {
    return saveName;
}

export function setSaveName(value) {
    saveName = value;
}

export function getSavedYetSinceOpeningSaveDialogue() {
    return savedYetSinceOpeningSaveDialogue;
}

export function setSavedYetSinceOpeningSaveDialogue(value) {
    savedYetSinceOpeningSaveDialogue = value;
}

export function getTechTreeDrawnYet() {
    return techTreeDrawnYet;
}

export function setTechTreeDrawnYet(value) {
    techTreeDrawnYet = value;
}

export function setRenderedTechTree(renderedTree) {
    cachedRenderedTechTree = renderedTree;
}

export function getRenderedTechTree() {
    return cachedRenderedTechTree;
}

export async function getTechTreeData(renew) {

    let techData = getResourceDataObject('techs');
    const unlockedTechs = getTechUnlockedArray();
    const upcomingTechs = getUpcomingTechArray();

    techData = Object.fromEntries(
        Object.entries(techData).filter(([key]) => 
            unlockedTechs.includes(key) || upcomingTechs.includes(key)
        )
    );

    await drawTechTree(techData, '#techTreeSvg', renew);
}