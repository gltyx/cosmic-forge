import { restoreHeaderDescriptionsObject, restoreResourceDataObject, restoreStarSystemsDataObject, resourceData, starSystems, getResourceDataObject, setResourceDataObject } from "./resourceDataObject.js";
import { initializeAutoSave } from './saveLoadGame.js';
import { drawTechTree, selectTheme, startWeatherEffect, stopWeatherEffect } from "./ui.js";
import { capitaliseString } from './utilityFunctions.js';
import { offlineGains, startNewsTickerTimer } from './game.js';
import { replaceHeaderDescriptions, headerDescriptions } from './descriptions.js';

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
//ALWAYS UPDATE THIS WHEN PUSHING A BUILD FOR PUBLIC
export const MINIMUM_GAME_VERSION_FOR_SAVES = 0.2;
export const GAME_VERSION_FOR_SAVES = 0.27;
export const deferredActions = [];

export const MENU_STATE = 'menuState';
export const GAME_VISIBLE_ACTIVE = 'gameVisibleActive';
export const TIMER_UPDATE_INTERVAL = 10;
export const TIMER_RATE_RATIO = 100;
export const READY_TO_SORT = 120;
export const NOW = 30; //READY TO SORT NOW needs total of 150
export const BUILDING_TYPES = ['energy'];
export const NEWS_TICKER_SCROLL_DURATION = 40000;
export const GAME_COST_MULTIPLIER = 1.15;
export const ROCKET_TRAVEL_SPEED = 0.1;
export const NORMAL_MAX_ANTIMATTER_RATE = 0.004;
export const BOOST_ANTIMATTER_RATE_MULTIPLIER = 2;
export const STARTING_STAR_SYSTEM = 'spica';
export const STAR_SEED = 53;
export const STAR_FIELD_SEED = 80;
export const NUMBER_OF_STARS = 100;

//GLOBAL VARIABLES
export let gameState;

let rocketUserName = {rocket1: 'Rocket 1', rocket2: 'Rocket 2', rocket3: 'Rocket 3', rocket4: 'Rocket 4'};
let asteroidArray = [];
let prize = [];
let rocketsBuilt = [];
let rocketsFuellerStartedArray = [];
let launchedRockets = [];
let cachedRenderedTechTree = null;
let saveName = null;
let lastSavedTimeStamp = null;
let currentTheme = 'terminal';
let autoSaveFrequency = 300000;
let currentStarSystem = getStartingStarSystem();
let currentStarSystemWeatherEfficiency = [];
let currentPrecipitationRate = 0;
let techRenderCounter = 0;
let tempRowValue = null;
let currencySymbol = '$';
let sortAsteroidMethod = 'rarity';
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
let baseSearchAsteroidTimerDuration = 120000;
let baseInvestigateStarTimerDuration = 800000;
let currentAsteroidSearchTimerDurationTotal = 0;
let currentInvestigateStarTimerDurationTotal = 0;
let timeLeftUntilAsteroidScannerTimerFinishes = 0;
let timeLeftUntilStarInvestigationTimerFinishes = 0;
let oldAntimatterRightBoxSvgData = null;
let currentDestinationDropdownText = 'Select an option';
let starVisionDistance = 0; //0
let starMapMode = 'normal';
let starVisionIncrement = 1;

let miningObject = {
    rocket1: null,
    rocket2: null,
    rocket3: null,
    rocket4: null  
}

let timeLeftUntilRocketTravelToAsteroidTimerFinishes = {
    rocket1: 0,
    rocket2: 0,
    rocket3: 0,
    rocket4: 0  
}

let rocketTravelDuration = {
    rocket1: 0,
    rocket2: 0,
    rocket3: 0,
    rocket4: 0
}

let destinationAsteroid = {
    rocket1: null,
    rocket2: null,
    rocket3: null,
    rocket4: null 
};

let rocketDirection = { //false outgoing true returning
    rocket1: false,
    rocket2: false,
    rocket3: false,
    rocket4: false 
}

export let oneOffPrizesAlreadyClaimedArray = [];

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

let checkRocketFuellingStatus = {
    rocket1: false,
    rocket2: false,
    rocket3: false,
    rocket4: false
};

let currentlyTravellingToAsteroid = {
    rocket1: false,
    rocket2: false,
    rocket3: false,
    rocket4: false
};

let rocketReadyToTravel = {
    rocket1: true,
    rocket2: true,
    rocket3: true,
    rocket4: true
}

let saveExportCloudFlag = false;
let autoSaveToggle = false;
let newsTickerSetting = true;
let weatherEffectSettingToggle = true;
let notificationsToggle = true;
let techRenderChange = false;
let losingEnergy = false;
let powerOnOff = false;
let trippedStatus = false;
let savedYetSinceOpeningSaveDialogue = false;
let techTreeDrawnYet = false;
let weatherEffectOn = false;
let weatherEfficiencyApplied = false;
let currentlySearchingAsteroid = false;
let currentlyInvestigatingStar = false;
let telescopeReadyToSearch = true;
let asteroidTimerCanContinue = false;
let starInvestigationTimerCanContinue = false;
let antimatterUnlocked = false;
let isAntimatterBoostActive = false;
let antimatterSvgEventListeners = false;
let canTravelToAsteroids = false;
let canFuelRockets = false;

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
        newsTickerContainer: document.getElementById('newsTickerContainer'),
        tabsContainer: document.getElementById('tabsContainer'),
        mainContainer: document.getElementById('mainContainer'),
        solidsMenu: document.getElementById('solids'),
        gasesMenu: document.getElementById('gas'),
        nonFerrous: document.getElementById('nonFerrous'),
        gases: document.getElementById('gases'),
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
        titaniumOption: document.getElementById('titaniumOption'),
        titaniumRate: document.getElementById('titaniumRate'),
        titaniumQuantity: document.getElementById('titaniumQuantity'),
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
        antimatterOption: document.getElementById('antimatterOption'),
        antimatterQuantity: document.getElementById('antimatterQuantity'),
        antimatterRate: document.getElementById('antimatterRate'),
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
    gameState.oneOffPrizesAlreadyClaimedArray = oneOffPrizesAlreadyClaimedArray;
    gameState.rocketsBuilt = rocketsBuilt;
    gameState.rocketsFuellerStartedArray = rocketsFuellerStartedArray;
    gameState.launchedRockets = launchedRockets;
    gameState.baseSearchTimerDuration = baseSearchAsteroidTimerDuration;
    gameState.timeLeftUntilAsteroidScannerTimerFinishes = timeLeftUntilAsteroidScannerTimerFinishes;
    gameState.timeLeftUntilStarInvestigationTimerFinishes = timeLeftUntilStarInvestigationTimerFinishes;
    gameState.currentAsteroidSearchTimerDurationTotal = currentAsteroidSearchTimerDurationTotal;
    gameState.currentInvestigateStarTimerDurationTotal = currentInvestigateStarTimerDurationTotal;
    gameState.timeLeftUntilRocketTravelToAsteroidTimerFinishes = timeLeftUntilRocketTravelToAsteroidTimerFinishes;
    gameState.asteroidArray = asteroidArray;
    gameState.rocketTravelDuration = rocketTravelDuration;
    gameState.miningObject = miningObject;
    gameState.destinationAsteroid = destinationAsteroid;
    gameState.rocketDirection = rocketDirection;
    gameState.rocketUserName = rocketUserName;
    gameState.headerDescriptions = headerDescriptions;
    gameState.starVisionDistance = starVisionDistance;
    gameState.starVisionIncrement = starVisionIncrement;

    // Flags
    gameState.flags = {
        autoSaveToggle: getAutoSaveToggle(),
        weatherEffectSettingToggle: getWeatherEffectSetting(),
        newsTickerSetting: getNewsTickerSetting(),
        notificationsToggle: getNotificationsToggle(),
        techRenderChange: getTechRenderChange(),
        losingEnergy: getLosingEnergy(),
        powerOnOff: getPowerOnOff(),
        trippedStatus: getTrippedStatus(),
        currentlySearchingAsteroid: getCurrentlySearchingAsteroid(),
        currentlyInvestigatingStar: getCurrentlyInvestigatingStar(),
        telescopeReadyToSearch: getTelescopeReadyToSearch(),
        currentlyTravellingToAsteroid: currentlyTravellingToAsteroid,
        rocketReadyToTravel: rocketReadyToTravel,
        antimatterUnlocked: antimatterUnlocked,
        canTravelToAsteroids: canTravelToAsteroids,
        canFuelRockets: canFuelRockets
    }

    return gameState;
}
export function restoreGameStatus(gameState, type) {
    return new Promise((resolve, reject) => {
        try {
            // Game variables
            if (gameState.resourceData) {
                restoreResourceDataObject(JSON.parse(JSON.stringify(gameState.resourceData)));
            } else {
                gameState.resourceData = resourceData;
            }
            
            if (gameState.starSystems) {
                restoreStarSystemsDataObject(JSON.parse(JSON.stringify(gameState.starSystems)));
            } else {
                gameState.starSystems = starSystems;
            }
            
            if (gameState.headerDescriptions) {
                restoreHeaderDescriptionsObject(JSON.parse(JSON.stringify(gameState.headerDescriptions)));
            } else {
                gameState.headerDescriptions = headerDescriptions;
            }            

            // Global variables
            if (type === 'cloud') {
                if (gameState.saveName) {
                    setSaveName(gameState.saveName);
                }
            }

            setCurrentTheme(gameState.currentTheme);
            setAutoSaveFrequency(gameState.autoSaveFrequency);
            setCurrentStarSystem(gameState.currentStarSystem);
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
            oneOffPrizesAlreadyClaimedArray = gameState.oneOffPrizesAlreadyClaimedArray;
            rocketsBuilt = gameState.rocketsBuilt;
            rocketsFuellerStartedArray = gameState.rocketsFuellerStartedArray ?? [''];
            launchedRockets = gameState.launchedRockets ?? [''];
            baseSearchAsteroidTimerDuration = gameState.baseSearchTimerDuration ?? 120000;
            timeLeftUntilAsteroidScannerTimerFinishes = gameState.timeLeftUntilAsteroidScannerTimerFinishes ?? 0;
            timeLeftUntilStarInvestigationTimerFinishes = gameState.timeLeftUntilStarInvestigationTimerFinishes ?? 0;
            timeLeftUntilRocketTravelToAsteroidTimerFinishes = gameState.timeLeftUntilRocketTravelToAsteroidTimerFinishes ?? {rocket1: 0, rocket2: 0, rocket3: 0, rocket4: 0};
            currentAsteroidSearchTimerDurationTotal = gameState.currentAsteroidSearchTimerDurationTotal ?? 0;
            currentInvestigateStarTimerDurationTotal = gameState.currentInvestigateStarTimerDurationTotal ?? 0;
            asteroidArray = (gameState.asteroidArray ?? []).filter(item => item !== '') || null;
            rocketTravelDuration = gameState.rocketTravelDuration ?? {rocket1: 0, rocket2: 0, rocket3: 0, rocket4: 0};
            miningObject = gameState.miningObject ?? {rocket1: null, rocket2: null, rocket3: null, rocket4: null};
            destinationAsteroid = gameState.destinationAsteroid ?? {rocket1: null, rocket2: null, rocket3: null, rocket4: null};
            rocketDirection = gameState.rocketDirection ?? {rocket1: false, rocket2: false, rocket3: false, rocket4: false};
            rocketUserName = gameState.rocketUserName ?? {rocket1: 'Rocket 1', rocket2: 'Rocket 2', rocket3: 'Rocket 3', rocket4: 'Rocket 4'};
            starVisionDistance = gameState.starVisionDistance ?? 0;
            starVisionIncrement = gameState.starVisionIncrement ?? 1;

            // Flags
            setAutoSaveToggle(gameState.flags.autoSaveToggle);
            setNotificationsToggle(gameState.flags.notificationsToggle);
            setWeatherEffectSetting(gameState.flags.weatherEffectSettingToggle);
            setNewsTickerSetting(gameState.flags.newsTickerSetting);
            setTechRenderChange(gameState.flags.techRenderChange);
            setLosingEnergy(gameState.flags.losingEnergy);
            setPowerOnOff(gameState.flags.powerOnOff);
            setTrippedStatus(gameState.flags.trippedStatus);
            setCurrentlySearchingAsteroid(gameState.flags.currentlySearchingAsteroid);
            setCurrentlyInvestigatingStar(gameState.flags.currentlyInvestigatingStar);
            setTelescopeReadyToSearch(gameState.flags.telescopeReadyToSearch);
            currentlyTravellingToAsteroid = gameState.flags.currentlyTravellingToAsteroid ?? {rocket1: false, rocket2: false, rocket3: false, rocket4: false};
            rocketReadyToTravel = gameState.flags.rocketReadyToTravel ?? {rocket1: true, rocket2: true, rocket3: true, rocket4: true};
            antimatterUnlocked = gameState.flags.antimatterUnlocked ?? false;
            canTravelToAsteroids = gameState.flags.canTravelToAsteroids ?? false;
            canFuelRockets = gameState.flags.canFuelRockets ?? false;

            initializeAutoSave();
            selectTheme(getCurrentTheme());
            setLastSavedTimeStamp(gameState.timeStamp);
            offlineGains(false);

            replaceHeaderDescriptions(gameState.headerDescriptions);
            
            const autoSaveToggleElement = document.getElementById('autoSaveToggle');
            const autoSaveFrequencyElement = document.getElementById('autoSaveFrequency');
            const weatherEffectSettingToggleElement = document.getElementById('weatherEffectSettingToggle');
            const newsTickerSettingToggleElement = document.getElementById('newsTickerSettingToggle');

            if (autoSaveFrequencyElement) {
                autoSaveFrequencyElement.value = getAutoSaveFrequency();
            }
            
            if (autoSaveToggleElement) {
                autoSaveToggleElement.checked = getAutoSaveToggle();
            }

            if (autoSaveToggleElement) {
                autoSaveToggleElement.checked = getAutoSaveToggle();
            }

            if (weatherEffectSettingToggleElement) {
                weatherEffectSettingToggleElement.checked = getWeatherEffectSetting();
            }

            if (newsTickerSettingToggleElement) {
                newsTickerSettingToggleElement.checked = getNewsTickerSetting();
            }

            setCurrentPrecipitationRate(0);
            stopWeatherEffect();
            setWeatherEffectOn(false);

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
        case 'All Stock':
            calculatedAmount = Math.floor(resourceQuantity);
            break;
        case '75% Stock':
            calculatedAmount = Math.floor(resourceQuantity * 0.75);
            break;
        case '67% Stock':
            calculatedAmount = Math.floor(resourceQuantity * 2 / 3);
            break;
        case '50% Stock':
            calculatedAmount = Math.floor(resourceQuantity * 0.5);
            break;
        case '33% Stock':
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
        case 'All Stock':
            calculatedAmount = Math.floor(compoundQuantity);
            break;
        case '75% Stock':
            calculatedAmount = Math.floor(compoundQuantity * 0.75);
            break;
        case '67% Stock':
            calculatedAmount = Math.floor(compoundQuantity * 2 / 3);
            break;
        case '50% Stock':
            calculatedAmount = Math.floor(compoundQuantity * 0.5);
            break;
        case '33% Stock':
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
        case 'Max Possible':
            createAmount = Math.floor(maxCompoundToCreate * 1);
            constituentPartsQuantityNeeded1 = createAmount * constituentPartsRatio1;
            constituentPartsQuantityNeeded2 = createAmount * constituentPartsRatio2;
            constituentPartsQuantityNeeded3 = createAmount * constituentPartsRatio3;
            constituentPartsQuantityNeeded4 = createAmount * constituentPartsRatio4;
            break;
        case 'Up to 75%':
            createAmount = Math.floor(maxCompoundToCreate * 0.75);
            constituentPartsQuantityNeeded1 = createAmount * constituentPartsRatio1;
            constituentPartsQuantityNeeded2 = createAmount * constituentPartsRatio2;
            constituentPartsQuantityNeeded3 = createAmount * constituentPartsRatio3;
            constituentPartsQuantityNeeded4 = createAmount * constituentPartsRatio4;
            break;
        case 'Up to 67%':
            createAmount = Math.floor(maxCompoundToCreate * (2 / 3));
            constituentPartsQuantityNeeded1 = createAmount * constituentPartsRatio1;
            constituentPartsQuantityNeeded2 = createAmount * constituentPartsRatio2;
            constituentPartsQuantityNeeded3 = createAmount * constituentPartsRatio3;
            constituentPartsQuantityNeeded4 = createAmount * constituentPartsRatio4;
            break;
        case 'Up to 50%':
            createAmount = Math.floor(maxCompoundToCreate * 0.5);
            constituentPartsQuantityNeeded1 = createAmount * constituentPartsRatio1;
            constituentPartsQuantityNeeded2 = createAmount * constituentPartsRatio2;
            constituentPartsQuantityNeeded3 = createAmount * constituentPartsRatio3;
            constituentPartsQuantityNeeded4 = createAmount * constituentPartsRatio4;
            break;
        case 'Up to 33%':
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

        if (fuseToResource2 !== '' && fuseToResource2 !== undefined) {
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

    if (getResourceDataObject('buildings', ['energy', 'batteryBoughtYet']) && getResourceDataObject('buildings', ['energy', 'quantity']) === 0 && getResourceDataObject('buildings', ['energy', 'consumption']) > totalRate) {
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

export function getStartingStarSystem() {
    return STARTING_STAR_SYSTEM;
}

export function eNCrQueen() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const result = proxyServerEngineDKrypt(
                'U2FsdGVkX18AWb6elOwkLERwy9MKHXi4kHg49lJuW7SwWFfZDVccHyATjgEPdrqQA7N5OE8qxcFguBP/szFmTA==',
                String((101 * 96) - (5 * 19) + Math.pow(3, 4) % 3)
            );
            resolve(result);
        }, 100);
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

export function getSaveExportCloudFlag() {
    return saveExportCloudFlag;
}

export function setSaveExportCloudFlag(value) {
    saveExportCloudFlag = value;
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

export function getPrize() {
    return prize;
}

export function setPrize(value) {
    prize = value;
}

export function getOneOffPrizesAlreadyClaimedArray() {
    return oneOffPrizesAlreadyClaimedArray;
}

export function setOneOffPrizesAlreadyClaimedArray(value) {
    oneOffPrizesAlreadyClaimedArray.unshift(value);
}

export function getNewsTickerScrollDuration() {
    return NEWS_TICKER_SCROLL_DURATION;
}

export function setWeatherEffectSetting(value) {
    weatherEffectSettingToggle = value;
    if (!value) {
        stopWeatherEffect();
        setWeatherEffectOn(false);
    }

    if (value && getCurrentStarSystemWeatherEfficiency()[2] === 'rain') {
        startWeatherEffect('rain');
        setWeatherEffectOn(true);
    }

    if (value && getCurrentStarSystemWeatherEfficiency()[2] === 'volcano') {
        startWeatherEffect('volcano');
        setWeatherEffectOn(true);
    }
}

export function getWeatherEffectSetting() {
    return weatherEffectSettingToggle;
}

export function setWeatherEffectOn(value) {
    weatherEffectOn = value;
}

export function getWeatherEffectOn() {
    return weatherEffectOn;
}

export function setNewsTickerSetting(value) {
    newsTickerSetting = value;
    startNewsTickerTimer();
    
    if (!value) {
        document.getElementById('newsTickerContainer').classList.add('invisible');
        document.getElementById('tabsContainer').style.marginTop = '30px';
        document.querySelector('.main-container').style.marginTop = '80px';
        document.getElementById('statsContainer').style.borderBottom = 'none';
    } else {
        document.getElementById('newsTickerContainer').classList.remove('invisible');
        document.getElementById('tabsContainer').style.marginTop = '60px';
        document.querySelector('.main-container').style.marginTop = '110px';
        document.getElementById('statsContainer').style.borderBottom = '1px dashed';
    }
}

export function getNewsTickerSetting() {
    return newsTickerSetting;
}

export function setRocketsBuilt(value) {
    rocketsBuilt.push(value);
}

export function getRocketsBuilt() {
    return rocketsBuilt;
}

export function changeAsteroidArray(key, property, value) {
    for (let obj of asteroidArray) {
        if (obj.hasOwnProperty(key)) {
            obj[key][property] = value;
            return;
        }
    }
}

export function setAsteroidArray(value) {
    asteroidArray.push(value);
}

export function getAsteroidArray() {
    return asteroidArray;
}

export function setRocketsFuellerStartedArray(value, addRemove, matchType = 'exact') {
    if (addRemove === 'add') {
        rocketsFuellerStartedArray.push(value);
    } else if (addRemove === 'remove') {
        rocketsFuellerStartedArray = rocketsFuellerStartedArray.filter(
            item => matchType === 'reset' ? !item.startsWith(value) : item !== value
        );
    }

    rocketsFuellerStartedArray = rocketsFuellerStartedArray.filter(item => item !== '');
}

export function getRocketsFuellerStartedArray() {
    return rocketsFuellerStartedArray;
}

export function setCheckRocketFuellingStatus(key, value) {
    checkRocketFuellingStatus[key] = value;
}

export function getCheckRocketFuellingStatus(key) {
    return checkRocketFuellingStatus[key];
}

export function setWeatherEfficiencyApplied(value) {
    weatherEfficiencyApplied = value;
}

export function getWeatherEfficiencyApplied(key) {
    return weatherEfficiencyApplied;
}

export function setLaunchedRockets(value, addRemove) {
    if (addRemove === 'add') {
        launchedRockets.push(value);
    } else if (addRemove === 'remove') {
        launchedRockets = launchedRockets.filter(item => item !== value);
    }
}

export function getLaunchedRockets() {
    return launchedRockets;
}

export function setMiningObject(key, value) {
    miningObject[key] = value;
}

export function getMiningObject() {
    return miningObject;
}

export function getImageUrls() {
    return IMAGE_URLS;
}

export function getCurrentGameVersion() {
    return GAME_VERSION_FOR_SAVES;
}

export function getMinimumVersion() {
    return MINIMUM_GAME_VERSION_FOR_SAVES;
}

export function getBaseSearchAsteroidTimerDuration() {
    return baseSearchAsteroidTimerDuration;
}

export function setBaseSearchAsteroidTimerDuration(value) {
    baseSearchAsteroidTimerDuration = value;
}

export function getBaseInvestigateStarTimerDuration() {
    return baseInvestigateStarTimerDuration;
}

export function setBaseInvestigateStarTimerDuration(value) {
    baseInvestigateStarTimerDuration = value;
}

export function getCurrentlySearchingAsteroid() {
    return currentlySearchingAsteroid;
}

export function setCurrentlySearchingAsteroid(value) {
    currentlySearchingAsteroid = value ?? false;
}

export function getCurrentlyInvestigatingStar() {
    return currentlyInvestigatingStar;
}

export function setCurrentlyInvestigatingStar(value) {
    currentlyInvestigatingStar = value ?? false;
}

export function getTimeLeftUntilAsteroidScannerTimerFinishes() {
    return timeLeftUntilAsteroidScannerTimerFinishes;
}

export function setTimeLeftUntilAsteroidScannerTimerFinishes(value) {
    timeLeftUntilAsteroidScannerTimerFinishes = value ?? 0;
}

export function getTimeLeftUntilStarInvestigationTimerFinishes() {
    return timeLeftUntilStarInvestigationTimerFinishes;
}

export function setTimeLeftUntilStarInvestigationTimerFinishes(value) {
    timeLeftUntilStarInvestigationTimerFinishes = value ?? 0;
}

export function getTimeLeftUntilRocketTravelToAsteroidTimerFinishes(key) {
    return timeLeftUntilRocketTravelToAsteroidTimerFinishes[key];
}

export function setTimeLeftUntilRocketTravelToAsteroidTimerFinishes(key, value) {
    timeLeftUntilRocketTravelToAsteroidTimerFinishes[key] = value ?? {rocket1: 0, rocket2: 0, rocket3: 0, rocket4: 0};
}

export function getTelescopeReadyToSearch() {
    return telescopeReadyToSearch;
}

export function setTelescopeReadyToSearch(value) {
    telescopeReadyToSearch = value ?? true;
}

export function getCurrentAsteroidSearchTimerDurationTotal() {
    return currentAsteroidSearchTimerDurationTotal;
}

export function setCurrentAsteroidSearchTimerDurationTotal(value) {
    currentAsteroidSearchTimerDurationTotal = value ?? 0;
}

export function getCurrentInvestigateStarTimerDurationTotal() {
    return currentInvestigateStarTimerDurationTotal;
}

export function setCurrentInvestigateStarTimerDurationTotal(value) {
    currentInvestigateStarTimerDurationTotal = value ?? 0;
}

export function getAsteroidTimerCanContinue() {
    return asteroidTimerCanContinue;
}

export function setAsteroidTimerCanContinue(value) {
    asteroidTimerCanContinue = value;
}

export function getStarInvestigationTimerCanContinue() {
    return starInvestigationTimerCanContinue;
}

export function setStarInvestigationTimerCanContinue(value) {
    starInvestigationTimerCanContinue = value;
}

export function getCurrentlyTravellingToAsteroid(key) {
    return currentlyTravellingToAsteroid[key];
}

export function setCurrentlyTravellingToAsteroid(key, value) {
    currentlyTravellingToAsteroid[key] = value;
}

export function setRocketReadyToTravel(key, value) {
    rocketReadyToTravel[key] = value;
}

export function getRocketReadyToTravel(key) {
    return rocketReadyToTravel[key];
}

export function setRocketTravelDuration(key, value) {
    rocketTravelDuration[key] = value;
}

export function getRocketTravelDuration() {
    return rocketTravelDuration;
}

export function setDestinationAsteroid(key, value) {
    destinationAsteroid[key] = value;
}

export function getDestinationAsteroid(key) {
    return destinationAsteroid[key];
}

export function getGameCostMultiplier() {
    return GAME_COST_MULTIPLIER;
}

export function setSortAsteroidMethod(value) {
    sortAsteroidMethod = value;
}

export function getSortAsteroidMethod() {
    return sortAsteroidMethod;
}

export function getRocketTravelSpeed() {
    return ROCKET_TRAVEL_SPEED;
}

export function getAntimatterUnlocked() {
    return antimatterUnlocked;
}

export function setAntimatterUnlocked(value) {
    antimatterUnlocked = value;
}

export function getNormalMaxAntimatterRate() {
    return NORMAL_MAX_ANTIMATTER_RATE;
}

export function getHasAntimatterSvgRightBoxDataChanged(newAntimatterSvgData) {
    return JSON.stringify(newAntimatterSvgData) !== JSON.stringify(oldAntimatterRightBoxSvgData);
}

export function setHasAntimatterSvgRightBoxDataChanged(value) {
    oldAntimatterRightBoxSvgData = value;
}

export function getIsAntimatterBoostActive() {
    return isAntimatterBoostActive;
}

export function setIsAntimatterBoostActive(value) {
    isAntimatterBoostActive = value;
}

export function getAntimatterSvgEventListeners() {
    return antimatterSvgEventListeners;
}

export function setAntimatterSvgEventListeners(value) {
    antimatterSvgEventListeners = value;
}

export function getBoostRate() {
    return BOOST_ANTIMATTER_RATE_MULTIPLIER;
}

export function setRocketDirection(key, value) {
    rocketDirection[key] = value;
}

export function getRocketDirection(key) {
    return rocketDirection[key] ?? false;
}

export function setCanTravelToAsteroids(value) {
    canTravelToAsteroids = value;
}

export function getCanTravelToAsteroids() {
    return canTravelToAsteroids ?? false;
}

export function setCanFuelRockets(value) {
    canFuelRockets = value;
}

export function getCanFuelRockets() {
    return canFuelRockets ?? false;
}

export function setCurrentDestinationDropdownText(value) {
    currentDestinationDropdownText = value;
}

export function getCurrentDestinationDropdownText() {
    return currentDestinationDropdownText ?? 'Select an option';
}

export function getRocketUserName(key) {
    return rocketUserName[key] ?? `Rocket ${capitaliseString(key).slice(-1)}`;
}

export function setRocketUserName(key, value) {
    rocketUserName[key] = value;
}

export function getStarVisionDistance() {
    return starVisionDistance ?? 0;
}

export function setStarVisionDistance(value) {
    starVisionDistance = value;
}

export function getStarMapMode() {
    return starMapMode ?? 'normal';
}

export function setStarMapMode(value) {
    starMapMode = value;
}

export function getStarVisionIncrement() {
    return starVisionIncrement ?? 1;
}

export function setStarVisionIncrement(value) {
    starVisionIncrement = value;
}

const IMAGE_URLS = {
    resources: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡾⠋⠙⢷⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡿⠁⠀⠀⠈⢿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢀⣀⣤⣤⣀⣀⡀⠀⢸⠃⠀⠀⠀⠀⠘⡇⠀⢀⣀⣀⣤⣤⣀⡀⠀⠀⠀
⠀⠀⠀⢸⠉⠀⠀⠉⠉⠛⠻⣿⣤⣀⠀⠀⣀⣤⣿⠟⠛⠉⠉⠁⠈⠉⡇⠀⠀⠀
⠀⠀⠀⠘⣧⡀⠀⠀⠀⠀⠀⣇⣀⣽⠿⠿⣯⣀⣸⠀⠀⠀⠀⠀⢀⣼⠃⠀⠀⠀
⠀⠀⠀⠀⠈⠻⣦⡀⠀⣠⣴⡟⠉⠀⢀⡀⠀⠉⢻⣦⣄⠀⢀⣴⠟⠁⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢈⣿⣿⣉⠀⡇⠀⢰⣿⣿⠆⠀⢸⠀⣉⣿⣿⡁⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢀⣴⠟⠁⠀⠙⠻⣧⣀⠀⠉⠉⠀⣀⣼⠟⠋⠀⠈⠻⣦⡀⠀⠀⠀⠀
⠀⠀⠀⢠⡟⠁⠀⠀⠀⠀⠀⡏⠉⣻⣶⣶⣟⠉⢹⠀⠀⠀⠀⠀⠈⢻⡄⠀⠀⠀
⠀⠀⠀⢸⣀⠀⠀⣀⣀⣤⣴⣿⠛⠉⠀⠀⠉⠛⣿⣦⣤⣀⣀⠀⠀⣀⡇⠀⠀⠀
⠀⠀⠀⠈⠉⠛⠛⠉⠉⠁⠀⢸⡄⠀⠀⠀⠀⢠⡇⠀⠈⠉⠉⠛⠛⠉⠁⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣷⡀⠀⠀⢀⣾⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢷⣄⣠⡾⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`,
    compounds: `
⠀⠀⠀⠀⠀⠀⠀⢀⣠⣶⣿⣿⣿⣷⣦⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⠿⠛⠋⠉⠉⠙⠛⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣿⡿⠋⣠⣴⣾⣿⣿⣿⣿⣿⣶⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠈⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⠟⢋⣁⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢰⣿⣿⣿⣿⣿⣿⣿⣿⡿⠁⣴⣿⣿⣿⣿⣿⣿⣷⡄⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣾⣿⣿⣿⣿⣿⣿⣿⣿⠃⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢻⣿⣿⣿⣿⣿⣿⣿⣿⡄⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀
⠀⠀⠀⠀⢠⣦⠈⢿⣿⣿⣿⣿⣿⣿⣿⣷⡀⠻⣿⣿⣿⣿⣿⣿⡿⠃⠀⠀⠀⠀
⠀⠀⠀⠀⣿⣿⣧⡀⠻⢿⣿⣿⣿⣿⣿⣿⣿⣦⣈⠉⠛⠛⠋⠁⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣿⣿⣿⣿⣦⣄⠉⠛⠿⠿⠿⠿⠟⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣷⣶⣶⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠈⠛⠿⣿⣿⣿⡿⠟⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
`,
    energy: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⡴⠂
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣾⡿⠋⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣶⣿⣿⠟⠋⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣾⣿⣿⣿⡟⠁⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠋⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣴⣿⣿⣿⣿⣿⡿⠋⠁⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣴⣿⣿⣿⣿⣿⣿⠟⠉⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣴⣿⣿⣿⣿⣿⣿⠿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢀⣠⣶⣿⣿⣿⣿⣿⣿⡿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣠⣶⣿⣿⣿⣿⣿⣿⣿⣿⣧⣤⣤⣤⣤⡤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣿⣿⣿⣿⣿⣿⠿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⠿⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣠⣴⣿⣿⠿⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⣠⣾⡿⠟⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠠⠞⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`,
    research: `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣾⣿⣷⠄⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣷⣄⠙⠿⠏⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠻⣿⣿⣿⣿⡦⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣾⣷⣦⡈⠛⢿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣿⣿⣿⣿⣿⣶⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣄⠙⠿⣿⣿⣿⣿⣿⣿⡿⠂⢀⣀⣀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣷⣦⡈⠛⢿⣿⣿⡿⠀⣼⠟⠉⠙⢷⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⣿⣿⣿⣿⠋⠀⠀⠉⠻⣇⠀⣿⡀⠀⢀⣼⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠀⠀⠀⠀⠀⣿⣦⣈⠙⠛⠛⠁⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⡆⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀
⠀⠀⠀⠀⣀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⣠⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀
⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀
⠀⠀⠀⠀⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠃⠀⠀⠀⠀`,
    'star map': `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⡀⠒⠒⠦⣄⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⣤⣶⡾⠿⠿⠿⠿⣿⣿⣶⣦⣄⠙⠷⣤⡀⠀⠀⠀⠀
⠀⠀⠀⣠⡾⠛⠉⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⣿⣷⣄⠘⢿⡄⠀⠀⠀
⠀⢀⡾⠋⠀⠀⠀⠀⠀⠀⠀⠀⠐⠂⠠⢄⡀⠈⢿⣿⣧⠈⢿⡄⠀⠀
⢀⠏⠀⠀⠀⢀⠄⣀⣴⣾⠿⠛⠛⠛⠷⣦⡙⢦⠀⢻⣿⡆⠘⡇⠀⠀
⠀⠀⠀⠀⡐⢁⣴⡿⠋⢀⠠⣠⠤⠒⠲⡜⣧⢸⠄⢸⣿⡇⠀⡇⠀⠀
⠀⠀⠀⡼⠀⣾⡿⠁⣠⢃⡞⢁⢔⣆⠔⣰⠏⡼⠀⣸⣿⠃⢸⠃⠀⠀
⠀⠀⢰⡇⢸⣿⡇⠀⡇⢸⡇⣇⣀⣠⠔⠫⠊⠀⣰⣿⠏⡠⠃⠀⠀⢀
⠀⠀⢸⡇⠸⣿⣷⠀⢳⡈⢿⣦⣀⣀⣀⣠⣴⣾⠟⠁⠀⠀⠀⠀⢀⡎
⠀⠀⠘⣷⠀⢻⣿⣧⠀⠙⠢⠌⢉⣛⠛⠋⠉⠀⠀⠀⠀⠀⠀⣠⠎⠀
⠀⠀⠀⠹⣧⡀⠻⣿⣷⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⡾⠃⠀⠀
⠀⠀⠀⠀⠈⠻⣤⡈⠻⢿⣿⣷⣦⣤⣤⣤⣤⣤⣴⡾⠛⠉⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠈⠙⠶⢤⣈⣉⠛⠛⠛⠛⠋⠉⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`,
    'space mining': `⠀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⢸⣿⣿⣶⣦⣄⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⢈⣿⣿⣿⣿⣿⣿⣾⡄⠀⠀⠀⠀⣼⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠙⢿⣿⣿⡟⠛⠛⠿⡄⠀⠀⢰⣿⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠙⢿⣧⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠉⠂⠀⢀⣴⣿⣿⣌⠛⠿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢀⣠⣼⠻⣿⣿⣿⣷⣤⡈⠻⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢠⣴⣶⣿⣿⣿⣿⣦⡘⢿⣿⣿⣿⣿⣦⣄⢸⣦⣄⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠙⢿⣿⣿⣿⣿⣿⣿⣄⠙⣿⣿⣿⣿⣿⣿⠿⠛⠂⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠙⠿⠿⠿⠿⠿⠛⠓⠈⠻⣿⡿⠋⠀⢴⠆⠉⠉⣀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⡿⠁⢼⠇⠀⠰⡷⠄⠉⢁⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠃⢰⡄⠀⠿⠂⣠⣶⣿⣿⣇⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠲⠀⢰⣿⣿⣿⣿⣿⣆⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠿⣿⣿⣿⣿⡀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠛⠃⠀`,
    settings: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⡀⠀⠀⠀⠀⣠⣷⣦⣄⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣶⣤⣤⣶⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣠⣶⣤⣀⣀⣠⣼⣿⠿⠛⠋⠉⠉⠙⠛⠿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀
⠀⠀⣰⣿⣿⣿⣿⣿⡿⠋⣡⡴⠞⠛⠋⠙⠛⠳⢦⣄⠙⢿⣷⣀⠀⠀⠀⢀⠀⠀
⠀⠀⠈⠙⢿⣿⣿⠟⢠⡾⠁⠀⠀⠀⠀⠀⠀⠀⠀⠈⢷⡄⠻⣿⣿⣿⣿⣿⡆⠀
⠀⠀⠀⠀⠈⣿⡟⠀⣾⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⡀⢻⣿⣿⣿⣿⣷⠀
⠀⠀⠀⢀⣼⣿⡇⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⢸⣿⡿⠋⠀⠀⠀
⠀⢶⣾⣿⣿⣿⣧⠀⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠁⣸⣿⡀⠀⠀⠀⠀
⠀⠸⣿⣿⣿⣿⣿⣆⠘⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⠃⣰⣿⣿⣷⣄⠀⠀⠀
⠀⠀⠉⠀⠀⠀⠙⢿⣷⣌⠛⠶⣤⣀⣀⣀⣀⣤⡴⠛⣡⣾⣿⣿⣿⣿⣿⡟⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣷⣦⣄⣉⣉⣉⣉⣠⣴⣾⡿⠛⠋⠛⠻⢿⠏⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⡿⠿⠿⢿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠈⠛⠿⣿⠏⠀⠀⠀⠀⠙⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠛⠋⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`,
}


