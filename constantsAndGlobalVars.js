import { restoreAscendencyBuffsDataObject, restoreGalacticMarketDataObject, restoreRocketNamesObject, restoreResourceDataObject, restoreStarSystemsDataObject, resourceData, starSystems, getResourceDataObject, setResourceDataObject, galacticMarket, ascendencyBuffs } from "./resourceDataObject.js";
import { initializeAutoSave } from './saveLoadGame.js';
import { drawTechTree, selectTheme, startWeatherEffect, stopWeatherEffect } from "./ui.js";
import { capitaliseWordsWithRomanNumerals, capitaliseString } from './utilityFunctions.js';
import { offlineGains, startNewsTickerTimer } from './game.js';
import { rocketNames } from './descriptions.js';
import { boostSoundManager } from './audioManager.js';

//DEBUG
export let debugFlag = false;
export let debugOptionFlag = false;
export let stateLoading = false;
export const debugVisibilityArray = ['settingsNotificationTestRow'];

//ELEMENTS
let elements;
let saveData = null;

//CONSTANTS
export const MINIMUM_GAME_VERSION_FOR_SAVES = 0.2;
export const GAME_VERSION_FOR_SAVES = 0.54;
export const deferredActions = [];

export const MENU_STATE = 'menuState';
export const INCREASE_STORAGE_FACTOR = 2;
export const GAME_VISIBLE_ACTIVE = 'gameVisibleActive';
export const TIMER_UPDATE_INTERVAL = 10;
export const TIMER_RATE_RATIO = 100;
export const READY_TO_SORT = 120;
export const NOW = 30; //READY TO SORT NOW needs total of 150
export const BUILDING_TYPES = ['energy', 'space', 'starShip', 'fleetHangar', 'colonise'];
export const NEWS_TICKER_SCROLL_DURATION = 40000;
export const GAME_COST_MULTIPLIER = 1.15;
export const ROCKET_TRAVEL_SPEED = 0.1;
export const STARSHIP_TRAVEL_SPEED = 36000; //3600000 one real hour per light year
export const NORMAL_MAX_ANTIMATTER_RATE = 0.004;
export const BOOST_ANTIMATTER_RATE_MULTIPLIER = 2;
export const STARTING_STAR_SYSTEM = 'spica';
export const STAR_SEED = 53;
export const STAR_FIELD_SEED = 80;
export const NUMBER_OF_STARS = 100;
export const STELLAR_SCANNER_RANGE = 0.75;
export const OFFLINE_GAINS_RATE = 0.334;
export const ENEMY_FLEET_SPEED_AIR = 5;
export const ENEMY_FLEET_SPEED_LAND = 2;
export const ENEMY_FLEET_SPEED_SEA = 1;
export const AP_BASE_SELL_PRICE = 1000000;
export const AP_BASE_BUY_PRICE = 4000000;
export const CASH_LIQUIDATION_MODIFIER = 10;

export const enemyFleetData = {
    air: {
        speed: ENEMY_FLEET_SPEED_AIR,
        visionDistance: 300, //300
        acceleration: 0.020
    },
    land: {
        speed: ENEMY_FLEET_SPEED_LAND,
        visionDistance: 150, //150
        acceleration: 0.012
    },
    sea: {
        speed: ENEMY_FLEET_SPEED_SEA,
        visionDistance: 200, //200
        acceleration: 0.006
    }
}

//GLOBAL VARIABLES
export let gameState;

let gameStartTimeStamp = null;
let runStartTimeStamp = null;
let rocketUserName = {rocket1: 'Rocket 1', rocket2: 'Rocket 2', rocket3: 'Rocket 3', rocket4: 'Rocket 4'};
let asteroidArray = [];
let alreadySeenNewsTickerArray = [];
let rocketsBuilt = [];
let starShipModulesBuilt = [];
let rocketsFuellerStartedArray = [];
let launchedRockets = [];
let cachedRenderedTechTree = null;
let saveName = null;
let lastSavedTimeStamp = null;
let currentTheme = 'terminal';
let autoSaveFrequency = 60000;
let currentStarSystem = getStartingStarSystem();
let currentStarSystemWeatherEfficiency = [];
let currentPrecipitationRate = 0;
let techRenderCounter = 0;
let tempRowValue = null;
let currencySymbol = '$';
let sortAsteroidMethod = 'rarity';
let sortStarMethod = 'distance';
let saleResourcePreviews = {};
let saleCompoundPreviews = {};
let createCompoundPreviews = {};
let constituentPartsObject = {};
let itemsToDeduct = {};
let itemsToIncreasePrice = {};
let techUnlockedArray = ['apAwardedThisRun'];
let revealedTechArray = [];
let upcomingTechArray = [];
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
let timeLeftUntilTravelToDestinationStarTimerFinishes = 0;
let timeLeftUntilStarInvestigationTimerFinishes = 0;
let oldAntimatterRightBoxSvgData = null;
let currentDestinationDropdownText = 'Select an option';
let starVisionDistance = 0;
let starMapMode = 'normal';
let starVisionIncrement = 1;
let destinationStar = null;
let fromStarObject = null;
let toStarObject = null;
let currentStarObject = null;
let starShipStatus = ['preconstruction', null];
let runNumber = 1;
let settledStars = [STARTING_STAR_SYSTEM];
let apSellForCashPrice = AP_BASE_SELL_PRICE;
let apBuyForCashPrice = AP_BASE_BUY_PRICE;
let apLiquidationQuantity = 0;

let battleUnits = { 
    player: [], 
    enemy: [] 
};

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

let starTravelDuration = 0;

let destinationAsteroid = {
    rocket1: null,
    rocket2: null,
    rocket3: null,
    rocket4: null 
};

let rocketDirection = {
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

let battleResolved = [false, null];

let galacticMarketOutgoingStockType = 'select';
let galacticMarketIncomingStockType = 'select';
let galacticMarketOutgoingQuantitySelectionType = 'select';
let galacticMarketSellApForCashQuantity = 'select';
let galacticMarketIncomingQuantity = 0;
let currentGalacticMarketCommission = 10;

let currentTab = [1, 'Resources'];
let currentOptionPane = null;
let notationType = 'normalCondensed';

//STATS PAGE LOGGERS
let allTimeTotalHydrogen = 0;
let allTimeTotalHelium = 0;
let allTimeTotalCarbon = 0;
let allTimeTotalNeon = 0;
let allTimeTotalOxygen = 0;
let allTimeTotalSodium = 0;
let allTimeTotalSilicon = 0;
let allTimeTotalIron = 0;
let allTimeTotalDiesel = 0;
let allTimeTotalGlass = 0;
let allTimeTotalSteel = 0;
let allTimeTotalConcrete = 0;
let allTimeTotalWater = 0;
let allTimeTotalTitanium = 0;
let allTimeTotalResearchPoints = 0;
let allTimeTotalScienceKits = 0;
let allTimeTotalScienceClubs = 0;
let allTimeTotalScienceLabs = 0;
let allTimeTotalRocketsLaunched = 0;
let allTimeTotalStarShipsLaunched = 0;
let allTimeTotalAsteroidsDiscovered = 0;
let allTimeTotalLegendaryAsteroidsDiscovered = 0;
let starStudyRange = 0;
let allTimeTotalAntimatterMined = 0;
let antimatterMinedThisRun = 0;
let allTimeTotalApGain = 0;
let currentRunNumber = 0;
let currentRunTimer = 0;
let totalNewsTickerPrizesCollected = 0;
let apAnticipatedThisRun = 0;
let allTimeStarShipsBuilt = 0;
let starShipTravelDistance = 0;
let allTimesTripped = 0;
let allTimeBasicPowerPlantsBuilt = 0;
let allTimeAdvancedPowerPlantsBuilt = 0;
let allTimeSolarPowerPlantsBuilt = 0;
let allTimeSodiumIonBatteriesBuilt = 0;
let allTimeBattery2Built = 0;
let allTimeBattery3Built = 0;
let asteroidsMinedThisRun = 0;
let formationGoal = null;
let liquidationValue = 0;

//FLAGS
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

let rebirthPossible = false;
let sfx = false;
let backgroundAudio = false;
let saveExportCloudFlag = false;
let autoSaveToggle = true;
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
let starShipBuilt = false;
let starShipTravelling = false;
let starShipArrowPosition = 0;
let stellarScannerBuilt = false;
let destinationStarScanned = false;
let diplomacyPossible = true;
let warMode = false;
let fleetChangedSinceLastDiplomacy = false;
let battleOngoing = false;
let battleTriggeredByPlayer = false;
let needNewBattleCanvas = false;
let redrawBattleDescription = true;
let inFormation = false;
let wasAutoSaveToggled = false;
let enemyFleetAdjustedForDiplomacy = false;
let apAwardedThisRun = false;
let galacticMarketOutgoingQuantitySelectionTypeDisabledStatus = true;
let galacticMarketLiquidationAuthorization = 'no';
let hasClickedOutgoingOptionGalacticMarket = false;
let liquidatedThisRun = false;

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
        miningOption: document.getElementById('miningOption'),
        miningQuantity: document.getElementById('miningQuantity'),
        miningRate: document.getElementById('miningRate'),
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

export const statFunctionsGets = {
    // Overview
    "stat_timePlayed": getStatTotalTimePlayed,
    "stat_pioneer": getStatPioneer,
    "stat_currentAp": getStatCurrentAp,
    "stat_apGain": getStatTotalApGain,
    "stat_run": getStatRun,
    "stat_runTime": getStatRunTime,
    "stat_uniqueNewsTickersSeen": getStatTotalUniqueNewsTickersSeen,
    "stat_newsTickerPrizesCollected": getStatNewsTickerPrizesCollected,
    "stat_theme": getStatTheme,
    "stat_antimatterMined": getStatTotalAntimatterMined,
    "stat_totalAsteroidsDiscovered": getStatTotalAsteroidsDiscovered,
    "stat_legendaryAsteroidsDiscovered": getStatTotalLegendaryAsteroidsDiscovered,
    "stat_rocketsLaunched": getStatTotalRocketsLaunched,
    "stat_starShipsLaunched": getStatTotalStarShipsLaunched,

    // Run
    "stat_starSystem": getStatStarSystem,
    "stat_currentWeather": getStatCurrentWeather,
    "stat_cash": getStatCash,
    "stat_apAnticipated": getStatApAnticipated,
    "stat_antimatter": getStatAntimatter,

    // Resources
    "stat_hydrogen": getStatHydrogen,
    "stat_helium": getStatHelium,
    "stat_carbon": getStatCarbon,
    "stat_neon": getStatNeon,
    "stat_oxygen": getStatOxygen,
    "stat_sodium": getStatSodium,
    "stat_silicon": getStatSilicon,
    "stat_iron": getStatIron,

    // Compounds
    "stat_diesel": getStatDiesel,
    "stat_glass": getStatGlass,
    "stat_steel": getStatSteel,
    "stat_concrete": getStatConcrete,
    "stat_water": getStatWater,
    "stat_titanium": getStatTitanium,

    // Research
    "stat_researchPoints": getStatResearchPoints,
    "stat_scienceKits": getStatScienceKits,
    "stat_scienceClubs": getStatScienceClubs,
    "stat_scienceLabs": getStatScienceLabs,
    "stat_techsUnlocked": getStatTechsUnlocked,

    // Energy
    "stat_power": getStatPower,
    "stat_totalEnergy": getStatTotalEnergy,
    "stat_totalProduction": getStatTotalProduction,
    "stat_totalConsumption": getStatTotalConsumption,
    "stat_totalBatteryStorage": getStatTotalBatteryStorage,
    "stat_timesTripped": getStatTimesTripped,
    "stat_basicPowerPlants": getStatBasicPowerPlants,
    "stat_advancedPowerPlants": getStatAdvancedPowerPlants,
    "stat_solarPowerPlants": getStatSolarPowerPlants,
    "stat_sodiumIonBatteries": getStatSodiumIonBatteries,
    "stat_battery2": getStatBattery2,
    "stat_battery3": getStatBattery3,

    // Space Mining
    "stat_spaceTelescopeBuilt": getStatSpaceTelescopeBuilt,
    "stat_launchPadBuilt": getStatLaunchPadBuilt,
    "stat_rocketsBuilt": getStatRocketsBuilt,
    "stat_asteroidsDiscovered": getStatAsteroidsDiscovered,
    "stat_asteroidsMined": getStatAsteroidsMined,

    // Interstellar
    "stat_starStudyRange": getStatStarStudyRange,
    "stat_starShipBuilt": getStatStarShipBuilt,
    "stat_starShipDistanceTravelled": getStatStarShipDistanceTravelled,
    "stat_systemScanned": getStatSystemScanned,
    "stat_fleetAttackStrength": getStatFleetAttackStrength,
    "stat_fleet1": getStatFleet1,
    "stat_fleet2": getStatFleet2,
    "stat_fleet3": getStatFleet3,
    "stat_fleet4": getStatFleet4,
    "stat_fleet5": getStatFleet5,
    "stat_enemy": getStatEnemy,
    "stat_enemyTotalDefenceOvercome": getStatEnemyTotalDefenceOvercome,
    "stat_enemyTotalDefenceRemaining": getStatEnemyTotalDefenceRemaining,
    "stat_apFromStarVoyage": getStatApFromStarVoyage,
};

export const statFunctionsSets = {
    "set_hydrogen": setStatHydrogen,
    "set_helium": setStatHelium,
    "set_carbon": setStatCarbon,
    "set_neon": setStatNeon,
    "set_oxygen": setStatOxygen,
    "set_sodium": setStatSodium,
    "set_silicon": setStatSilicon,
    "set_iron": setStatIron,
    "set_diesel": setStatDiesel,
    "set_glass": setStatGlass,
    "set_steel": setStatSteel,
    "set_concrete": setStatConcrete,
    "set_water": setStatWater,
    "set_titanium": setStatTitanium,
    "set_researchPoints": setStatResearchPoints,
    "set_scienceKits": setStatScienceKits,
    "set_scienceClubs": setStatScienceClubs,
    "set_scienceLabs": setStatScienceLabs,
    "set_antimatter": setStatAntimatter,
    "set_antimatterThisRun": setStatAntimatterThisRun,
    "set_apAnticipated": setStatApAnticipated,
    "set_newsTickerPrizesCollected": setStatNewsTickerPrizesCollected,
    "set_totalApGain": setStatTotalApGain,
    "set_starStudyRange": setStatStarStudyRange,
    "set_starShipTravelDistance": setStatStarShipTravelDistance,
    "set_totalLegendaryAsteroidsDiscovered": setStatTotalLegendaryAsteroidsDiscovered,
    "set_totalAsteroidsDiscovered": setStatTotalAsteroidsDiscovered,
    "set_totalRocketsLaunched": setStatTotalRocketsLaunched,
    "set_starShipLaunched": setStatStarShipLaunched,
    "set_allTimesTripped": setStatTimesTripped,
    "set_allTimeBasicPowerPlantsBuilt": setStatBasicPowerPlants,
    "set_allTimeAdvancedPowerPlantsBuilt": setStatAdvancedPowerPlants,
    "set_allTimeSolarPowerPlantsBuilt": setStatSolarPowerPlants,
    "set_allTimeSodiumIonBatteriesBuilt": setStatSodiumIonBatteries,
    "set_allTimeBattery2Built": setStatBattery2,
    "set_allTimeBattery3Built": setStatBattery3,
    "set_asteroidsMined": setStatAsteroidsMined,
};

export function setGameStateVariable(value) {
    gameState = value;
}

export function getGameStateVariable() {
    return gameState;
}

export function getElements() {
    return elements;
}

export function resetAllVariablesOnRebirth() {

    runStartTimeStamp = null;
    rocketUserName = {rocket1: 'Rocket 1', rocket2: 'Rocket 2', rocket3: 'Rocket 3', rocket4: 'Rocket 4'};
    asteroidArray = [];
    rocketsBuilt = [];
    starShipModulesBuilt = [];
    rocketsFuellerStartedArray = [];
    launchedRockets = [];
    cachedRenderedTechTree = null;
    currentStarSystemWeatherEfficiency = [];
    currentPrecipitationRate = 0;
    techRenderCounter = 0;
    tempRowValue = null;
    sortAsteroidMethod = 'rarity';
    sortStarMethod = 'distance';
    saleResourcePreviews = {};
    saleCompoundPreviews = {};
    createCompoundPreviews = {};
    constituentPartsObject = {};
    itemsToDeduct = {};
    itemsToIncreasePrice = {};
    techUnlockedArray = ['apAwardedThisRun'];
    revealedTechArray = [];
    upcomingTechArray = [];
    unlockedResourcesArray = ['hydrogen'];
    unlockedCompoundsArray = [];
    temporaryRowsRepo = null;
    canAffordDeferred = null;
    originalFrameNumbers = {};
    baseSearchAsteroidTimerDuration = 120000;
    baseInvestigateStarTimerDuration = 800000;
    currentAsteroidSearchTimerDurationTotal = 0;
    currentInvestigateStarTimerDurationTotal = 0;
    timeLeftUntilAsteroidScannerTimerFinishes = 0;
    timeLeftUntilTravelToDestinationStarTimerFinishes = 0;
    timeLeftUntilStarInvestigationTimerFinishes = 0;
    oldAntimatterRightBoxSvgData = null;
    currentDestinationDropdownText = 'Select an option';
    starVisionDistance = 0; //0
    starMapMode = 'normal';
    starVisionIncrement = 1;
    destinationStar = null;
    fromStarObject = null;
    toStarObject = null;
    currentStarObject = null;
    starShipStatus = ['preconstruction', null];

    runNumber++;
    
    battleUnits = { 
        player: [], 
        enemy: [] 
    };
    
    miningObject = {
        rocket1: null,
        rocket2: null,
        rocket3: null,
        rocket4: null  
    }
    
    timeLeftUntilRocketTravelToAsteroidTimerFinishes = {
        rocket1: 0,
        rocket2: 0,
        rocket3: 0,
        rocket4: 0  
    }
    
    rocketTravelDuration = {
        rocket1: 0,
        rocket2: 0,
        rocket3: 0,
        rocket4: 0
    }
    
    starTravelDuration = 0;
    
    destinationAsteroid = {
        rocket1: null,
        rocket2: null,
        rocket3: null,
        rocket4: null 
    };
    
    rocketDirection = {
        rocket1: false,
        rocket2: false,
        rocket3: false,
        rocket4: false 
    }
    
    oneOffPrizesAlreadyClaimedArray = []; //reset this on rebirth as can claim once per run
    
    activatedFuelBurnObject = {
        carbon: false,
    };
    
    buildingTypeOnOff = {
        powerPlant1: false,
        powerPlant2: false,
        powerPlant3: false,
    }
    
    ranOutOfFuelWhenOn = {
        powerPlant1: false,
        powerPlant2: false,
        powerPlant3: false,
    }
    
    battleResolved = [false, null];

    galacticMarketOutgoingStockType = 'select';
    galacticMarketIncomingStockType = 'select';
    galacticMarketOutgoingQuantitySelectionType = 'select';
    galacticMarketSellApForCashQuantity = 'select';
    currentGalacticMarketCommission = 10;
    apSellForCashPrice = AP_BASE_SELL_PRICE;
    apBuyForCashPrice = AP_BASE_BUY_PRICE;
    liquidationValue = 0;
    apLiquidationQuantity = 0;
    
    //STATS PAGE LOGGERS
    starStudyRange = 0;
    antimatterMinedThisRun = 0;
    currentRunNumber = runNumber;
    currentRunTimer = 0;
    apAnticipatedThisRun = 0;
    starShipTravelDistance = 0;
    asteroidsMinedThisRun = 0;
    
    formationGoal = null;

    //FLAGS    
    checkRocketFuellingStatus = {
        rocket1: false,
        rocket2: false,
        rocket3: false,
        rocket4: false
    };
    
    currentlyTravellingToAsteroid = {
        rocket1: false,
        rocket2: false,
        rocket3: false,
        rocket4: false
    };
    
    rocketReadyToTravel = {
        rocket1: true,
        rocket2: true,
        rocket3: true,
        rocket4: true
    }
    
    techRenderChange = false;
    losingEnergy = false;
    powerOnOff = false;
    trippedStatus = false;
    techTreeDrawnYet = false;
    weatherEffectOn = false;
    weatherEfficiencyApplied = false;
    currentlySearchingAsteroid = false;
    currentlyInvestigatingStar = false;
    telescopeReadyToSearch = true;
    asteroidTimerCanContinue = false;
    starInvestigationTimerCanContinue = false;
    antimatterUnlocked = false;
    isAntimatterBoostActive = false;
    antimatterSvgEventListeners = false;
    canTravelToAsteroids = false;
    canFuelRockets = false;
    starShipBuilt = false;
    starShipTravelling = false;
    starShipArrowPosition = 0;
    stellarScannerBuilt = false;
    destinationStarScanned = false;
    diplomacyPossible = true;
    warMode = false;
    fleetChangedSinceLastDiplomacy = false;
    battleOngoing = false;
    battleTriggeredByPlayer = false;
    needNewBattleCanvas = false;
    redrawBattleDescription = true;
    inFormation = false;
    enemyFleetAdjustedForDiplomacy = false;
    apAwardedThisRun = false;
    galacticMarketOutgoingQuantitySelectionTypeDisabledStatus = true;
    galacticMarketLiquidationAuthorization = 'no';
    hasClickedOutgoingOptionGalacticMarket = false;
    liquidatedThisRun = false;

    setCurrentPrecipitationRate(0);
    stopWeatherEffect();
    setWeatherEffectOn(false);
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
    gameState.galacticMarket = JSON.parse(JSON.stringify(galacticMarket));
    gameState.ascendencyBuffs = JSON.parse(JSON.stringify(ascendencyBuffs));

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
    gameState.unlockedResourcesArray = unlockedResourcesArray;
    gameState.unlockedCompoundsArray = unlockedResourcesArray;
    gameState.activatedFuelBurnObject = activatedFuelBurnObject;
    gameState.buildingTypeOnOff = buildingTypeOnOff;
    gameState.ranOutOfFuelWhenOn = ranOutOfFuelWhenOn;
    gameState.notationType = getNotationType();
    gameState.oneOffPrizesAlreadyClaimedArray = oneOffPrizesAlreadyClaimedArray;
    gameState.rocketsBuilt = rocketsBuilt;
    gameState.starShipModulesBuilt = starShipModulesBuilt;
    gameState.rocketsFuellerStartedArray = rocketsFuellerStartedArray;
    gameState.launchedRockets = launchedRockets;
    gameState.baseSearchTimerDuration = baseSearchAsteroidTimerDuration;
    gameState.timeLeftUntilAsteroidScannerTimerFinishes = timeLeftUntilAsteroidScannerTimerFinishes;
    gameState.timeLeftUntilStarInvestigationTimerFinishes = timeLeftUntilStarInvestigationTimerFinishes;
    gameState.timeLeftUntilTravelToDestinationStarTimerFinishes = timeLeftUntilTravelToDestinationStarTimerFinishes;
    gameState.currentAsteroidSearchTimerDurationTotal = currentAsteroidSearchTimerDurationTotal;
    gameState.currentInvestigateStarTimerDurationTotal = currentInvestigateStarTimerDurationTotal;
    gameState.timeLeftUntilRocketTravelToAsteroidTimerFinishes = timeLeftUntilRocketTravelToAsteroidTimerFinishes;
    gameState.asteroidArray = asteroidArray;
    gameState.rocketTravelDuration = rocketTravelDuration;
    gameState.starTravelDuration = starTravelDuration;
    gameState.miningObject = miningObject;
    gameState.destinationAsteroid = destinationAsteroid;
    gameState.rocketDirection = rocketDirection;
    gameState.rocketUserName = rocketUserName;
    gameState.rocketNames = rocketNames;
    gameState.starVisionDistance = starVisionDistance;
    gameState.starVisionIncrement = starVisionIncrement;
    gameState.destinationStar = destinationStar;
    gameState.fromStarObject = fromStarObject;
    gameState.toStarObject = toStarObject;
    gameState.currentStarObject = currentStarObject;
    gameState.starShipStatus = starShipStatus;
    gameState.destinationStar = destinationStar;
    gameState.allTimeTotalHydrogen = allTimeTotalHydrogen;
    gameState.allTimeTotalHelium = allTimeTotalHelium;
    gameState.allTimeTotalCarbon = allTimeTotalCarbon;
    gameState.allTimeTotalNeon = allTimeTotalNeon;
    gameState.allTimeTotalOxygen = allTimeTotalOxygen;
    gameState.allTimeTotalSodium = allTimeTotalSodium;
    gameState.allTimeTotalSilicon = allTimeTotalSilicon;
    gameState.allTimeTotalIron = allTimeTotalIron;
    gameState.allTimeTotalDiesel = allTimeTotalDiesel;
    gameState.allTimeTotalGlass = allTimeTotalGlass;
    gameState.allTimeTotalSteel = allTimeTotalSteel;
    gameState.allTimeTotalConcrete = allTimeTotalConcrete;
    gameState.allTimeTotalWater = allTimeTotalWater;
    gameState.allTimeTotalTitanium = allTimeTotalTitanium;
    gameState.allTimeTotalResearchPoints = allTimeTotalResearchPoints;
    gameState.allTimeTotalScienceKits = allTimeTotalScienceKits;
    gameState.allTimeTotalScienceClubs = allTimeTotalScienceClubs;
    gameState.allTimeTotalScienceLabs = allTimeTotalScienceLabs;
    gameState.allTimeTotalRocketsLaunched = allTimeTotalRocketsLaunched;
    gameState.allTimeTotalStarShipsLaunched = allTimeTotalStarShipsLaunched;
    gameState.allTimeTotalAsteroidsDiscovered = allTimeTotalAsteroidsDiscovered;
    gameState.allTimeTotalLegendaryAsteroidsDiscovered = allTimeTotalLegendaryAsteroidsDiscovered;
    gameState.allTimeTotalStarsStudied = starStudyRange;
    gameState.allTimeTotalAntimatterMined = allTimeTotalAntimatterMined;
    gameState.antimatterMinedThisRun = antimatterMinedThisRun;
    gameState.allTimeTotalApGain = allTimeTotalApGain;
    gameState.currentRunNumber = currentRunNumber;
    gameState.currentRunTimer = currentRunTimer;
    gameState.totalNewsTickerPrizesCollected = totalNewsTickerPrizesCollected;
    gameState.apAnticipatedThisRun = apAnticipatedThisRun;
    gameState.allTimeStarShipsBuilt = allTimeStarShipsBuilt;
    gameState.alreadySeenNewsTickerArray = alreadySeenNewsTickerArray;
    gameState.runNumber = runNumber;
    gameState.starShipTravelDistance = starShipTravelDistance;
    gameState.allTimesTripped = allTimesTripped;
    gameState.allTimeBasicPowerPlantsBuilt = allTimeBasicPowerPlantsBuilt;
    gameState.allTimeAdvancedPowerPlantsBuilt = allTimeAdvancedPowerPlantsBuilt;
    gameState.allTimeSolarPowerPlantsBuilt = allTimeSolarPowerPlantsBuilt;
    gameState.allTimeSodiumIonBatteriesBuilt = allTimeSodiumIonBatteriesBuilt;
    gameState.allTimeBattery2Built = allTimeBattery2Built;
    gameState.allTimeBattery3Built = allTimeBattery3Built;
    gameState.asteroidsMinedThisRun = asteroidsMinedThisRun;
    gameState.runStartTimeStamp = runStartTimeStamp;
    gameState.gameStartTimeStamp = gameStartTimeStamp;
    gameState.battleUnits = battleUnits;
    gameState.battleResolved = battleResolved;
    gameState.settledStars = settledStars;
    gameState.currentGalacticMarketCommission = currentGalacticMarketCommission;

    // Flags
    gameState.flags = {
        autoSaveToggle: autoSaveToggle,
        weatherEffectSettingToggle: weatherEffectSettingToggle,
        newsTickerSetting: newsTickerSetting,
        notificationsToggle: notificationsToggle,
        techRenderChange: techRenderChange,
        losingEnergy: losingEnergy,
        powerOnOff: powerOnOff,
        trippedStatus: trippedStatus,
        currentlySearchingAsteroid: currentlySearchingAsteroid,
        currentlyInvestigatingStar: currentlyInvestigatingStar,
        telescopeReadyToSearch: telescopeReadyToSearch,
        currentlyTravellingToAsteroid: currentlyTravellingToAsteroid,
        rocketReadyToTravel: rocketReadyToTravel,
        antimatterUnlocked: antimatterUnlocked,
        canTravelToAsteroids: canTravelToAsteroids,
        canFuelRockets: canFuelRockets,
        backgroundAudio: backgroundAudio,
        sfx: sfx,
        starShipBuilt: starShipBuilt,
        starShipTravelling: starShipTravelling,
        stellarScannerBuilt: stellarScannerBuilt,
        destinationStarScanned: destinationStarScanned,
        diplomacyPossible: diplomacyPossible,
        warMode: warMode,
        enemyFleetAdjustedForDiplomacy: enemyFleetAdjustedForDiplomacy,
        apAwardedThisRun: apAwardedThisRun,
        rebirthPossible: rebirthPossible,
        liquidatedThisRun: liquidatedThisRun
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
            
            if (gameState.rocketNames) {
                restoreRocketNamesObject(JSON.parse(JSON.stringify(gameState.rocketNames)));
            } else {
                gameState.rocketNames = rocketNames;
            }      
            
            if (gameState.galacticMarket) {
                restoreGalacticMarketDataObject(JSON.parse(JSON.stringify(gameState.galacticMarket)));
            } else {
                gameState.galacticMarket = galacticMarket;
            }

            if (gameState.ascendencyBuffs) {
                restoreAscendencyBuffsDataObject(JSON.parse(JSON.stringify(gameState.ascendencyBuffs)));
            } else {
                gameState.ascendencyBuffs = ascendencyBuffs;
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
            unlockedResourcesArray = gameState.unlockedResourcesArray;
            unlockedCompoundsArray = gameState.unlockedCompoundsArray;
            activatedFuelBurnObject = gameState.activatedFuelBurnObject;
            buildingTypeOnOff = gameState.buildingTypeOnOff;
            ranOutOfFuelWhenOn = gameState.ranOutOfFuelWhenOn;
            setNotationType(gameState.notationType);
            oneOffPrizesAlreadyClaimedArray = gameState.oneOffPrizesAlreadyClaimedArray;
            rocketsBuilt = gameState.rocketsBuilt;
            starShipModulesBuilt = gameState.starShipModulesBuilt ?? [''];
            rocketsFuellerStartedArray = gameState.rocketsFuellerStartedArray ?? [''];
            launchedRockets = gameState.launchedRockets ?? [''];
            baseSearchAsteroidTimerDuration = gameState.baseSearchTimerDuration ?? 120000;
            timeLeftUntilAsteroidScannerTimerFinishes = gameState.timeLeftUntilAsteroidScannerTimerFinishes ?? 0;
            timeLeftUntilStarInvestigationTimerFinishes = gameState.timeLeftUntilStarInvestigationTimerFinishes ?? 0;
            timeLeftUntilRocketTravelToAsteroidTimerFinishes = gameState.timeLeftUntilRocketTravelToAsteroidTimerFinishes ?? {rocket1: 0, rocket2: 0, rocket3: 0, rocket4: 0};
            timeLeftUntilTravelToDestinationStarTimerFinishes = gameState.timeLeftUntilTravelToDestinationStarTimerFinishes ?? 0;
            currentAsteroidSearchTimerDurationTotal = gameState.currentAsteroidSearchTimerDurationTotal ?? 0;
            currentInvestigateStarTimerDurationTotal = gameState.currentInvestigateStarTimerDurationTotal ?? 0;
            asteroidArray = (gameState.asteroidArray ?? []).filter(item => item !== '') || null;
            rocketTravelDuration = gameState.rocketTravelDuration ?? {rocket1: 0, rocket2: 0, rocket3: 0, rocket4: 0};
            starTravelDuration = gameState.starTravelDuration ?? 0;
            miningObject = gameState.miningObject ?? {rocket1: null, rocket2: null, rocket3: null, rocket4: null};
            destinationAsteroid = gameState.destinationAsteroid ?? {rocket1: null, rocket2: null, rocket3: null, rocket4: null};
            rocketDirection = gameState.rocketDirection ?? {rocket1: false, rocket2: false, rocket3: false, rocket4: false};
            rocketUserName = gameState.rocketUserName ?? {rocket1: 'Rocket 1', rocket2: 'Rocket 2', rocket3: 'Rocket 3', rocket4: 'Rocket 4'};
            starVisionDistance = gameState.starVisionDistance ?? 0;
            starVisionIncrement = gameState.starVisionIncrement ?? 1;
            destinationStar = gameState.destinationStar ?? null;
            fromStarObject = gameState.fromStarObject ?? null;
            toStarObject = gameState.toStarObject ?? null;
            currentStarObject = gameState.currentStarObject ?? null;
            starShipStatus = gameState.starShipStatus ?? ['preconstruction', null];
            destinationStar = gameState.destinationStar ?? null;
            allTimeTotalHydrogen = gameState.allTimeTotalHydrogen ?? 0;
            allTimeTotalHelium = gameState.allTimeTotalHelium ?? 0;
            allTimeTotalCarbon = gameState.allTimeTotalCarbon ?? 0;
            allTimeTotalNeon = gameState.allTimeTotalNeon ?? 0;
            allTimeTotalOxygen = gameState.allTimeTotalOxygen ?? 0;
            allTimeTotalSodium = gameState.allTimeTotalSodium ?? 0;
            allTimeTotalSilicon = gameState.allTimeTotalSilicon ?? 0;
            allTimeTotalIron = gameState.allTimeTotalIron ?? 0;
            allTimeTotalDiesel = gameState.allTimeTotalDiesel ?? 0;
            allTimeTotalGlass = gameState.allTimeTotalGlass ?? 0;
            allTimeTotalSteel = gameState.allTimeTotalSteel ?? 0;
            allTimeTotalConcrete = gameState.allTimeTotalConcrete ?? 0;
            allTimeTotalWater = gameState.allTimeTotalWater ?? 0;
            allTimeTotalTitanium = gameState.allTimeTotalTitanium ?? 0;
            allTimeTotalResearchPoints = gameState.allTimeTotalResearchPoints ?? 0;
            allTimeTotalScienceKits = gameState.allTimeTotalScienceKits ?? 0;
            allTimeTotalScienceClubs = gameState.allTimeTotalScienceClubs ?? 0;
            allTimeTotalScienceLabs = gameState.allTimeTotalScienceLabs ?? 0;
            allTimeTotalRocketsLaunched = gameState.allTimeTotalRocketsLaunched ?? 0;
            allTimeTotalStarShipsLaunched = gameState.allTimeTotalStarShipsLaunched ?? 0;
            allTimeTotalAsteroidsDiscovered = gameState.allTimeTotalAsteroidsDiscovered ?? 0;
            allTimeTotalLegendaryAsteroidsDiscovered = gameState.allTimeTotalLegendaryAsteroidsDiscovered ?? 0;
            starStudyRange = gameState.allTimeTotalStarsStudied ?? 0;
            allTimeTotalAntimatterMined = gameState.allTimeTotalAntimatterMined ?? 0;
            antimatterMinedThisRun = gameState.antimatterMinedThisRun ?? 0;
            allTimeTotalApGain = gameState.allTimeTotalApGain ?? 0;
            currentRunNumber = gameState.currentRunNumber ?? 0;
            currentRunTimer = gameState.currentRunTimer ?? 0;
            totalNewsTickerPrizesCollected = gameState.totalNewsTickerPrizesCollected ?? 0;
            apAnticipatedThisRun = gameState.apAnticipatedThisRun ?? 0;
            allTimeStarShipsBuilt = gameState.allTimeStarShipsBuilt ?? 0;
            alreadySeenNewsTickerArray = gameState.alreadySeenNewsTickerArray ?? [];
            runNumber = gameState.runNumber ?? 1;
            starShipTravelDistance = gameState.starShipTravelDistance ?? 0;
            allTimesTripped = gameState.allTimesTripped ?? 0;
            allTimeBasicPowerPlantsBuilt = gameState.allTimeBasicPowerPlantsBuilt ?? 0;
            allTimeAdvancedPowerPlantsBuilt = gameState.allTimeAdvancedPowerPlantsBuilt ?? 0;
            allTimeSolarPowerPlantsBuilt = gameState.allTimeSolarPowerPlantsBuilt ?? 0;
            allTimeSodiumIonBatteriesBuilt = gameState.allTimeSodiumIonBatteriesBuilt ?? 0;
            allTimeBattery2Built = gameState.allTimeBattery2Built ?? 0;
            allTimeBattery3Built = gameState.allTimeBattery3Built ?? 0;
            asteroidsMinedThisRun = gameState.asteroidsMinedThisRun ?? 0;
            runStartTimeStamp = gameState.runStartTimeStamp ?? null;
            gameStartTimeStamp = gameState.gameStartTimeStamp ?? null;
            battleUnits = gameState.battleUnits ?? { player: [], enemy: [] };
            battleResolved = gameState.battleResolved ?? [false, null];
            settledStars = gameState.settledStars ?? [STARTING_STAR_SYSTEM];
            currentGalacticMarketCommission = gameState.currentGalacticMarketCommission ?? 10;

            // Flags
            autoSaveToggle = gameState.flags.autoSaveToggle ?? false;
            notificationsToggle = gameState.flags.notificationsToggle ?? true;
            weatherEffectSettingToggle = gameState.flags.weatherEffectSettingToggle ?? true;
            newsTickerSetting = gameState.flags.newsTickerSetting ?? true;
            techRenderChange = gameState.flags.techRenderChange ?? false;
            losingEnergy = gameState.flags.losingEnergy ?? false;
            powerOnOff = gameState.flags.powerOnOff ?? false;
            trippedStatus = gameState.flags.trippedStatus ?? false;
            currentlySearchingAsteroid = gameState.flags.currentlySearchingAsteroid ?? false;
            currentlyInvestigatingStar = gameState.flags.currentlyInvestigatingStar ?? false;
            telescopeReadyToSearch = gameState.flags.telescopeReadyToSearch ?? true;            
            currentlyTravellingToAsteroid = gameState.flags.currentlyTravellingToAsteroid ?? { rocket1: false, rocket2: false, rocket3: false, rocket4: false };
            rocketReadyToTravel = gameState.flags.rocketReadyToTravel ?? { rocket1: true, rocket2: true, rocket3: true, rocket4: true };
            antimatterUnlocked = gameState.flags.antimatterUnlocked ?? false;
            canTravelToAsteroids = gameState.flags.canTravelToAsteroids ?? false;
            canFuelRockets = gameState.flags.canFuelRockets ?? false;
            backgroundAudio = gameState.flags.backgroundAudio ?? false;      
            sfx = gameState.flags.sfx ?? false;
            starShipBuilt = gameState.flags.starShipBuilt ?? false;
            starShipTravelling = gameState.flags.starShipTravelling ?? false;
            stellarScannerBuilt = gameState.flags.stellarScannerBuilt ?? false;
            destinationStarScanned = gameState.flags.destinationStarScanned ?? false;
            diplomacyPossible = gameState.flags.diplomacyPossible ?? true;
            warMode = gameState.flags.warMode ?? false;
            enemyFleetAdjustedForDiplomacy = gameState.flags.enemyFleetAdjustedForDiplomacy ?? false;
            apAwardedThisRun = gameState.flags.apAwardedThisRun ?? false;
            rebirthPossible = gameState.flags.rebirthPossible ?? false;
            liquidatedThisRun = gameState.flags.liquidatedThisRun ?? false;

            initializeAutoSave();
            selectTheme(getCurrentTheme());
            setLastSavedTimeStamp(gameState.timeStamp);
            offlineGains(false);

            if (warMode && getBattleResolved()[0] === false) {
                battleUnits = { player: [], enemy: [] };
            }

            //replaceRocketNames(gameState.rocketNames);
            fixLaunchPadAndSpaceTelescope(rocketsBuilt, asteroidArray);
            
            const autoSaveToggleElement = document.getElementById('autoSaveToggle');
            const autoSaveFrequencyElement = document.getElementById('autoSaveFrequency');
            const weatherEffectSettingToggleElement = document.getElementById('weatherEffectSettingToggle');
            const newsTickerSettingToggleElement = document.getElementById('newsTickerSettingToggle');
            const backgroundAudioToggleElement = document.getElementById('backgroundAudioToggle');
            const sfxToggleElement = document.getElementById('sfxToggle');


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

            if (backgroundAudioToggleElement) {
                backgroundAudioToggleElement.checked = getBackgroundAudio();
            }

            if (sfxToggleElement) {
                sfxToggleElement.checked = getSfx();
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

function fixLaunchPadAndSpaceTelescope(rocketsBuilt, asteroidArray) { //for fixing saves broken by my carelessness in migration.
    if (rocketsBuilt.length > 0) {
        setResourceDataObject(true, 'space', ['upgrades', 'launchPad', 'launchPadBoughtYet']);
    
        if (!canFuelRockets && getTechUnlockedArray().includes('advancedFuels')) {
            canFuelRockets = true;
        }
    
        rocketsBuilt.forEach(rocket => {
            const partsRequired = getResourceDataObject('space', ['upgrades', rocket, 'parts']);
            setResourceDataObject(partsRequired, 'space', ['upgrades', rocket, 'builtParts']);
        });
    }
    
    if (asteroidArray.length > 0 || starVisionDistance > 0) {
        setResourceDataObject(true, 'space', ['upgrades', 'spaceTelescope', 'spaceTelescopeBoughtYet']);
    }
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

export function getWasAutoSaveToggled() {
    return wasAutoSaveToggled;
}

export function setWasAutoSaveToggled(value) {
    wasAutoSaveToggled = value;
}


export function getNotationType() {
    return notationType;
}

export function setNotationType(value) {
    notationType = value;
}

export function getIncreaseStorageFactor() {
    return INCREASE_STORAGE_FACTOR;
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

export function setCreateCompoundPreview(compoundToCreate, dropDownString) {
    let amount = /^[A-Za-z]/.test(dropDownString) 
    ? dropDownString 
    : dropDownString.split(" ")[0];
    
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

export function getOfflineGainsRate() {
    return OFFLINE_GAINS_RATE;
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
    if (value === 'run1' && techUnlockedArray.length === 1 && techUnlockedArray[0] === 'apAwardedThisRun') {
        techUnlockedArray = [];
        return;
    }

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

export function getAlreadySeenNewsTickerArray() {
    return alreadySeenNewsTickerArray;
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

export function setBackgroundAudio(value) {
    backgroundAudio = value ?? false;
}

export function getBackgroundAudio() {
    return backgroundAudio;
}

export function getSfx() {
    return sfx;
}

export function setSfx(value) {
    sfx = value ?? false;
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

export function setStarShipModulesBuilt(value) {
    starShipModulesBuilt.push(value);
}

export function getStarShipModulesBuilt() {
    return starShipModulesBuilt ?? [''];
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

export function getTimeLeftUntilTravelToDestinationStarTimerFinishes() {
    return timeLeftUntilTravelToDestinationStarTimerFinishes;
}

export function setTimeLeftUntilTravelToDestinationStarTimerFinishes(value) {
    timeLeftUntilTravelToDestinationStarTimerFinishes = value ?? 0;
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

export function setStarTravelDuration(value) {
    starTravelDuration = value;
}

export function getStarTravelDuration() {
    return starTravelDuration;
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

export function setSortStarMethod(value) {
    sortStarMethod = value;
}

export function getSortStarMethod() {
    return sortStarMethod;
}

export function getRocketTravelSpeed() {
    return ROCKET_TRAVEL_SPEED;
}

export function getStarShipTravelSpeed() {
    return STARSHIP_TRAVEL_SPEED;
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
    if (getSfx() && value) {
        boostSoundManager.startBoostLoop();
    }

    if (!value) {
        boostSoundManager.stopBoostLoop();
    }

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

export function getAscendencyPoints() {
    return getResourceDataObject('ascendencyPoints', ['quantity']) ?? 0;
}

export function setAscendencyPoints(value) {
    setResourceDataObject(value, 'ascendencyPoints', ['quantity']);
}

export function getStarShipBuilt() {
    return starShipBuilt;
}

export function setStarShipBuilt(value) {
    starShipBuilt = value;
}

export function getDestinationStar() {
    return destinationStar ?? null;
}

export function setDestinationStar(value) {
    destinationStar = value;
}

export function getStarShipTravelling() {
    return starShipTravelling ?? false;
}

export function setStarShipTravelling(value) {
    starShipTravelling = value;
}

export function getFromStarObject() {
    return fromStarObject ?? null;
}

export function setFromStarObject(value) {
    fromStarObject = value;
}

export function getToStarObject() {
    return toStarObject ?? null;
}

export function setToStarObject(value) {
    toStarObject = value;
}

export function getCurrentStarObject(value) {
    return currentStarObject;
}

export function setCurrentStarObject(value) {
    currentStarObject = value;
}

export function getStarShipArrowPosition() {
    return starShipArrowPosition ?? 0;
}

export function setStarShipArrowPosition(value) {
    starShipArrowPosition = value;
}

export function getStarShipStatus() {
    return starShipStatus ?? ['preconstruction', null];
}

export function setStarShipStatus(value) {
    starShipStatus = value;
}

export function getStellarScannerBuilt() {
    return stellarScannerBuilt ?? false;
}

export function setStellarScannerBuilt(value) {
    stellarScannerBuilt = value;
}

export function getDestinationStarScanned() {
    return destinationStarScanned;
}

export function setDestinationStarScanned(value) {
    destinationStarScanned = value;
}

export function getStellarScannerRange() {
    return STELLAR_SCANNER_RANGE;
}

export function setDiplomacyPossible(value) {
    diplomacyPossible = value
}

export function getWarMode() {
    return warMode;
}

export function setWarMode(value) {
    warMode = value;
}

export function getDiplomacyPossible() {
    return diplomacyPossible;
}

export function setFleetChangedSinceLastDiplomacy(value) {
    fleetChangedSinceLastDiplomacy = value
}

export function getFleetChangedSinceLastDiplomacy() {
    return fleetChangedSinceLastDiplomacy;
}

export function setBattleUnits(key, value) {
    battleUnits[key] = value;
}

export function replaceBattleUnits(value) {
    battleUnits = value;
}

export function getNeedNewBattleCanvas() {
    return needNewBattleCanvas;
}

export function setNeedNewBattleCanvas(value) {
    needNewBattleCanvas = value;
}

export function getBattleUnits() {
    return battleUnits;
}

export function getBattleOngoing() {
    return battleOngoing ?? false;
}

export function setBattleOngoing(value) {
    battleOngoing = value;
}

export function getBattleTriggeredByPlayer() {
    return battleTriggeredByPlayer ?? false;
}

export function setBattleTriggeredByPlayer(value) {
    battleTriggeredByPlayer = value;
}

export function getFormationGoal() {
    return formationGoal;
}

export function setFormationGoal(value) {
    formationGoal = value;
}

export function getFleetConstantData(key) {
    return enemyFleetData[key] ? enemyFleetData[key] : null;
}

export function setFleetConstantData(key, value) {
    if (enemyFleetData[key]) {
        enemyFleetData[key] = value;
    }
}

export function getRedrawBattleDescription() {
    return redrawBattleDescription;
}

export function setRedrawBattleDescription(value) {
    redrawBattleDescription = value;
}

export function getInFormation() {
    return inFormation;
}

export function setInFormation(value) {
    inFormation = value;
}

export function getEnemyFleetsAdjustedForDiplomacy() {
    return enemyFleetAdjustedForDiplomacy;
}

export function setEnemyFleetsAdjustedForDiplomacy(value) {
    enemyFleetAdjustedForDiplomacy = value;
}

export function getBattleResolved() {
    return battleResolved;
}

export function setBattleResolved(status, winner) {
    battleResolved = [status, winner];
}

export function getApAwardedThisRun() {
    return apAwardedThisRun;
}

export function setApAwardedThisRun(value) {
    apAwardedThisRun = value;
}

export function getRebirthPossible() {
    return rebirthPossible;
}

export function setRebirthPossible(value) {
    rebirthPossible = value;
}

export function setGalacticMarketOutgoingStockType(value) {
    galacticMarketOutgoingStockType = value;
}

export function getGalacticMarketOutgoingStockType() {
    return galacticMarketOutgoingStockType;
}

export function setGalacticMarketIncomingStockType(value) {
    galacticMarketIncomingStockType = value;
}

export function getGalacticMarketIncomingStockType() {
    return galacticMarketIncomingStockType;
}

export function setGalacticMarketOutgoingQuantitySelectionType(value) {
    galacticMarketOutgoingQuantitySelectionType = value;
}

export function getGalacticMarketOutgoingQuantitySelectionType() {
    return galacticMarketOutgoingQuantitySelectionType;
}

export function setGalacticMarketOutgoingQuantitySelectionTypeDisabledStatus(value) {
    galacticMarketOutgoingQuantitySelectionTypeDisabledStatus = value;
}

export function getGalacticMarketOutgoingQuantitySelectionTypeDisabledStatus() {
    return galacticMarketOutgoingQuantitySelectionTypeDisabledStatus;
}

export function setGalacticMarketSellApForCashQuantity(value) {
    galacticMarketSellApForCashQuantity = value;
}

export function getGalacticMarketSellApForCashQuantity() {
    return galacticMarketSellApForCashQuantity;
}

export function setGalacticMarketLiquidationAuthorization(value) {
    galacticMarketLiquidationAuthorization = value;
}

export function getGalacticMarketLiquidationAuthorization() {
    return galacticMarketLiquidationAuthorization;
}

export function setHasClickedOutgoingOptionGalacticMarket(value) {
    hasClickedOutgoingOptionGalacticMarket = value;
}

export function getHasClickedOutgoingOptionGalacticMarket(value) {
    return hasClickedOutgoingOptionGalacticMarket;
}

export function setGalacticMarketIncomingQuantity(value) {
    galacticMarketIncomingQuantity = value;
}

export function getGalacticMarketIncomingQuantity() {
    return galacticMarketIncomingQuantity;
}

export function setCurrentGalacticMarketCommission(value) {
    currentGalacticMarketCommission = value;
}

export function getCurrentGalacticMarketCommission() {
    return currentGalacticMarketCommission;
}

export function setApSellForCashPrice(value) {
    apSellForCashPrice = value;
}

export function getApSellForCashPrice() {
    return apSellForCashPrice;
}

export function getApBaseSellPrice() {
    return AP_BASE_SELL_PRICE;
}

export function setApBuyPrice(value) {
    apBuyForCashPrice = value;
}

export function getApBuyPrice() {
    return apBuyForCashPrice;
}

export function getApBaseBuyPrice() {
    return AP_BASE_BUY_PRICE;
}

export function setLiquidationValue(value) {
    liquidationValue = value;
}

export function getLiquidationValue() {
    return liquidationValue;
}

export function setApLiquidationQuantity(value) {
    apLiquidationQuantity = value;
}

export function getApLiquidationQuantity() {
    return apLiquidationQuantity;
}

export function getCashLiquidationModifier() {
    return CASH_LIQUIDATION_MODIFIER;
}

export function getLiquidatedThisRun() {
    return liquidatedThisRun;
}

export function setLiquidatedThisRun(value) {
    liquidatedThisRun = value;
}

//stat retrievers-------------------------------------------------------------------------------------------------------

function getStatPioneer() {//
    return getSaveName();
}

function getStatCurrentAp() {//
    return getAscendencyPoints();
}

function getStatTotalApGain() {//
    return allTimeTotalApGain;
}

export function getStatRun() {//
    return runNumber;
}

function getStatTotalTimePlayed() {
    const elapsedMilliseconds = Date.now() - getGameStartTime();
    return formatTime(elapsedMilliseconds);
}

function getStatRunTime() {
    const elapsedMilliseconds = Date.now() - getRunStartTime();
    return formatTime(elapsedMilliseconds);
}

function formatTime(milliseconds) {
    let totalSeconds = Math.floor(milliseconds / 1000);
    let days = Math.floor(totalSeconds / (3600 * 24));
    totalSeconds %= (3600 * 24);
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    let timeString = '';
    if (days > 0) timeString += `${days}d `;
    if (hours > 0) timeString += `${hours}h `;
    if (minutes > 0) timeString += `${minutes}m `;
    if (seconds > 0 || timeString === '') timeString += `${seconds}s`;

    return timeString.trim();
}

function getStatTotalUniqueNewsTickersSeen() {//
    return alreadySeenNewsTickerArray.length;
}

function getStatNewsTickerPrizesCollected() {//
    return totalNewsTickerPrizesCollected;
}

function getStatTheme() {//
    return capitaliseString(getCurrentTheme());
}

function getStatTotalAntimatterMined() {//
    return allTimeTotalAntimatterMined;
}

function getStatTotalAsteroidsDiscovered() {//
    return allTimeTotalAsteroidsDiscovered;
}

function getStatTotalLegendaryAsteroidsDiscovered() {//
    return allTimeTotalLegendaryAsteroidsDiscovered;
}

function getStatTotalRocketsLaunched() {//
    return allTimeTotalRocketsLaunched;
}

function getStatTotalStarShipsLaunched() {//
    return allTimeTotalStarShipsLaunched;
}

function getStatStarSystem() {//
    return capitaliseWordsWithRomanNumerals(getCurrentStarSystem());
}

function getStatCurrentWeather() {//
    return document.getElementById('stat7').textContent.trim().slice(-1);
}

function getStatCash() {//
    return document.getElementById('cashStat').textContent;
}

function getStatApAnticipated() {//
    return apAnticipatedThisRun;
}

function getStatAntimatter() {//
    return resourceData.antimatter.quantity;
}

function getStatHydrogen() {//
    return allTimeTotalHydrogen;
}

function getStatHelium() {//
    return allTimeTotalHelium;
}

function getStatCarbon() {//
    return allTimeTotalCarbon;
}

function getStatNeon() {//
    return allTimeTotalNeon;
}

function getStatOxygen() {//
    return allTimeTotalOxygen;
}

function getStatSodium() {//
    return allTimeTotalSodium;
}

function getStatSilicon() {//
    return allTimeTotalSilicon;
}

function getStatIron() {//
    return allTimeTotalIron;
}

function getStatDiesel() {//
    return allTimeTotalDiesel;
}

function getStatGlass() {//
    return allTimeTotalGlass;
}

function getStatSteel() {//
    return allTimeTotalSteel;
}

function getStatConcrete() {//
    return allTimeTotalConcrete;
}

function getStatWater() {//
    return allTimeTotalWater;
}

function getStatTitanium() {//
    return allTimeTotalTitanium;
}

function getStatResearchPoints() {//
    return allTimeTotalResearchPoints;
}

function getStatScienceKits() {//
    return allTimeTotalScienceKits;
}

function getStatScienceClubs() {//
    return allTimeTotalScienceClubs;
}

function getStatScienceLabs() {//
    return allTimeTotalScienceLabs;
}

function getStatTechsUnlocked() {//
    return getTechUnlockedArray().length;
}

function getStatPower() {//
    return document.getElementById('stat3').textContent.split(' ')[1];
}

function getStatTotalEnergy() {//
    return document.getElementById('stat2').textContent;
}

function getStatTotalProduction() {//
    return Math.floor((resourceData.buildings.energy.upgrades.powerPlant1.quantity * resourceData.buildings.energy.upgrades.powerPlant1.rate 
        + resourceData.buildings.energy.upgrades.powerPlant2.quantity * resourceData.buildings.energy.upgrades.powerPlant2.rate
        + resourceData.buildings.energy.upgrades.powerPlant3.quantity * resourceData.buildings.energy.upgrades.powerPlant3.rate) 
        * getTimerRateRatio()) + ' KW / s';
}

function getStatTotalConsumption() {//
    return Math.floor(getTotalEnergyUse() * getTimerRateRatio()) + ' KW / s';
}

function getStatTotalBatteryStorage() {//
    return Math.floor(getResourceDataObject('buildings', ['energy', 'storageCapacity']) / 1000)  + ' MWh';
}

function getStatTimesTripped() {//
    return allTimesTripped;
}

function getStatBasicPowerPlants() {//
    return allTimeBasicPowerPlantsBuilt;
}

function getStatAdvancedPowerPlants() {//
    return allTimeAdvancedPowerPlantsBuilt;
}

function getStatSolarPowerPlants() {//
    return allTimeSolarPowerPlantsBuilt;
}

function getStatSodiumIonBatteries() {//
    return allTimeSodiumIonBatteriesBuilt;
}

function getStatBattery2() {//
    return allTimeBattery2Built;
}

function getStatBattery3() {//
    return allTimeBattery3Built;
}

function getStatSpaceTelescopeBuilt() {//
    return getResourceDataObject('space', ['upgrades', 'spaceTelescope', 'spaceTelescopeBoughtYet']) ? "Yes" : "No";
}

function getStatLaunchPadBuilt() {//
    return getResourceDataObject('space', ['upgrades', 'launchPad', 'launchPadBoughtYet']) ? "Yes" : "No";
}

function getStatRocketsBuilt() {//
    return getRocketsBuilt().length;
}

function getStatAsteroidsDiscovered() {//
    return getAsteroidArray().length;
}

function getStatAsteroidsMined() {
    return asteroidsMinedThisRun;
}

function getStatStarStudyRange() {//
    return `${starStudyRange} ly`;
}

function getStatStarShipBuilt() {//
    return starShipBuilt ? "Yes" : "No";
}

function getStatStarShipDistanceTravelled() {//
    return `${starShipTravelDistance} ly`;
}

function getStatSystemScanned() {//
    return destinationStarScanned ? "Yes" : "No";
}

function getStatFleetAttackStrength() {
    return 1;
}

function getStatFleet1() {
    return 1;
}

function getStatFleet2() {
    return 1;
}

function getStatFleet3() {
    return 1;
}

function getStatFleet4() {
    return 1;
}

function getStatFleet5() {
    return 1;
}

function getStatEnemy() {
    return 1;
}

function getStatEnemyTotalDefenceOvercome() {
    return 1;
}

function getStatEnemyTotalDefenceRemaining() {
    return 1;
}

function getStatApFromStarVoyage() {
    return 1;
}

//setters
function setStatHydrogen(valueToAdd) {
    allTimeTotalHydrogen += valueToAdd;
}

function setStatHelium(valueToAdd) {
    allTimeTotalHelium += valueToAdd;
}

function setStatCarbon(valueToAdd) {
    allTimeTotalCarbon += valueToAdd;
}

function setStatNeon(valueToAdd) {
    allTimeTotalNeon += valueToAdd;
}

function setStatOxygen(valueToAdd) {
    allTimeTotalOxygen += valueToAdd;
}

function setStatSodium(valueToAdd) {
    allTimeTotalSodium += valueToAdd;
}

function setStatSilicon(valueToAdd) {
    allTimeTotalSilicon += valueToAdd;
}

function setStatIron(valueToAdd) {
    allTimeTotalIron += valueToAdd;
}

function setStatDiesel(valueToAdd) {
    allTimeTotalDiesel += valueToAdd;
}

function setStatGlass(valueToAdd) {
    allTimeTotalGlass += valueToAdd;
}

function setStatSteel(valueToAdd) {
    allTimeTotalSteel += valueToAdd;
}

function setStatConcrete(valueToAdd) {
    allTimeTotalConcrete += valueToAdd;
}

function setStatWater(valueToAdd) {
    if (getTechUnlockedArray().includes('compounds')) {
        allTimeTotalWater += valueToAdd;
    }
}

function setStatTitanium(valueToAdd) {
    allTimeTotalTitanium += valueToAdd;
}

function setStatResearchPoints(valueToAdd) {
    allTimeTotalResearchPoints += valueToAdd;
}

function setStatScienceKits(valueToAdd) {
    allTimeTotalScienceKits += valueToAdd;
}

function setStatScienceClubs(valueToAdd) {
    allTimeTotalScienceClubs += valueToAdd;
}

function setStatScienceLabs(valueToAdd) {
    allTimeTotalScienceLabs += valueToAdd;
}

function setStatAntimatter(valueToAdd) {
    allTimeTotalAntimatterMined += valueToAdd;
}

function setStatAntimatterThisRun(valueToAdd) {
    antimatterMinedThisRun += valueToAdd;
}

function setStatApAnticipated(valueToAdd) {
    apAnticipatedThisRun += valueToAdd;
}

function setStatNewsTickerPrizesCollected(valueToAdd) {
    totalNewsTickerPrizesCollected += valueToAdd;
}

function setStatTotalApGain(valueToAdd) {
    allTimeTotalApGain += valueToAdd;
}

function setStatStarStudyRange(value) {
    starStudyRange = value;
}

function setStatStarShipTravelDistance(value) {
    starShipTravelDistance = value;
}

function setStatTotalLegendaryAsteroidsDiscovered(valueToAdd) {
    allTimeTotalLegendaryAsteroidsDiscovered += valueToAdd;
}

function setStatTotalAsteroidsDiscovered(valueToAdd) {
    allTimeTotalAsteroidsDiscovered += valueToAdd;
}

function setStatTotalRocketsLaunched(valueToAdd) {
    allTimeTotalRocketsLaunched += valueToAdd;
}

function setStatStarShipLaunched(valueToAdd) {
    allTimeTotalStarShipsLaunched += valueToAdd;
}

function setStatTimesTripped(valueToAdd) {
    allTimesTripped += valueToAdd;
}

function setStatBasicPowerPlants(valueToAdd) {
    allTimeBasicPowerPlantsBuilt += valueToAdd;
}

function setStatAdvancedPowerPlants(valueToAdd) {
    allTimeAdvancedPowerPlantsBuilt += valueToAdd;
}

function setStatSolarPowerPlants(valueToAdd) {
    allTimeSolarPowerPlantsBuilt += valueToAdd;
}

function setStatSodiumIonBatteries(valueToAdd) {
    allTimeSodiumIonBatteriesBuilt += valueToAdd;
}

function setStatBattery2(valueToAdd) {
    allTimeBattery2Built += valueToAdd;
}

function setStatBattery3(valueToAdd) {
    allTimeBattery3Built += valueToAdd;
}

function setStatAsteroidsMined(valueToAdd) {
    asteroidsMinedThisRun += valueToAdd;
}

export function setAlreadySeenNewsTickerArray(value) {
    alreadySeenNewsTickerArray.push(value);
}

export function setGameStartTime() {
    gameStartTimeStamp = Date.now();
}

export function setRunStartTime() {
    runStartTimeStamp = Date.now();
}

export function getGameStartTime() {
    return gameStartTimeStamp;
}

export function getRunStartTime() {
    return runStartTimeStamp;
}

export function getSettledStars() {
    return settledStars;
}

export function setSettledStars(value) {
    settledStars.push(value);
}

//image urls----------------------------------------------------------------------------------------------------------------------

const IMAGE_URLS = {
    'resources': `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
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
    'compounds': `
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
    'energy': `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⡴⠂
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
    'research': `
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
    'galactic': `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⡀⠒⠒⠦⣄⡀⠀⠀⠀⠀⠀⠀⠀
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
    'interstellar': `⠀⠀⠀⡖⠐⠖⠂⡀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⢰⣤⡗⣬⣞⣭⢉⢣⢦⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⣮⣫⣴⢅⣧⠺⠾⡋⣌⣧⣵⣄⠀⠀⠀⠀⠀⠀⠀
⠀⣏⣯⣋⡼⡟⡂⣦⣓⡻⣍⢻⣝⡂⡀⢀⣀⡴⠂⠀
⠀⢭⢾⣛⡷⣳⣟⠭⡌⠱⡖⣇⣬⢖⡯⣣⠋⠀⠀⠀
⠀⠸⣻⣾⣿⣩⡧⣎⢼⡾⣛⠷⣺⢩⡵⠋⡠⠀⠀⠀
⠀⠀⣳⣭⣾⣿⣿⣷⣶⣓⣩⢇⣼⣏⣀⡴⠄⠲⡀⠀
⠀⠀ ⢿⢿⣿⣿⡝⡾⣿⢺⠾⢯⡭⣇⣬⡨⠔⠑⠀
⠀  ⠹⢾⣿⣿⣿⣿⣟⣿⣧⢼⣫⢶⠀⢠⣴⡂⡅
⠀⠀⠀ ⣸⡟⠿⢫⣿⣿⣿⡽⡻⣟⢞⠥⣷⣷⠀⢀
⠀⠀ ⡿⣿⡔⡦⢾⠍⠣⠏⣻⢿⣯⡞⣋⢰⠎⠌⠒
⠀⠀ ⠃⢹⣿⣧⣴⡂⠀⠀⠈⠙⠋⠈⠙⠉⠚⠉⠀
⠀⠀ ⠀⢸⢿⢷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀  ⠰⢸⢸⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀  ⠀⠸⣴⣰⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
  ⡀⢀⣘⣀⣃⢀`,

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
    'settings': `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
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
    'battleArt': `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡀⠤⠠⠐⠒⠀⠉⣉⣉⠀⠁⠀⠀⠄⠤⠤⠬⠤⠭⢈⡉⠍⢁⠒⡒⠀⠤⠀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⠤⠐⠒⣋⢁⡀⢀⢲⣔⣂⣀⣒⣊⣴⣚⢁⡤⣍⣻⣛⣒⣺⠶⣬⣁⣤⣍⡋⠝⢒⠴⠭⢦⣀⡒⣤⣉⡐⠂⠤⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠤⢒⠈⠀⣀⣤⣴⠿⠖⠯⠹⠛⠓⠒⠛⠛⢿⠿⣷⠾⢿⢾⡿⢯⣙⣑⣋⠛⣽⠛⢛⡩⣟⣟⣢⣽⣶⣦⣤⣀⣛⣏⠉⠛⡓⠦⢄⣁⡒⠠⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠄⢂⣁⣴⠞⠒⣊⡝⡋⢁⣠⣠⣤⣴⣴⡴⣿⢲⡖⣮⣍⡛⠙⢺⡿⣷⡤⠶⣏⢿⣻⣿⠾⣞⣓⣛⣛⠻⠟⠛⠛⢿⣻⠛⣗⣩⣭⣷⡟⢻⡉⢛⠲⢤⣀⡈⠐⡠⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡠⠐⣩⣴⢞⣩⣤⣍⣁⡐⡺⡆⠴⠟⠋⠉⠭⢛⠻⣿⣟⣿⣛⣿⡱⣯⡵⣶⢫⣿⡷⣍⣸⣟⣫⠭⠿⠛⠉⠉⠉⢁⠤⠤⢤⡆⣽⣿⢟⣛⣁⣁⣤⣄⣜⣿⣽⣶⣼⣿⣴⣭⣆⢈⠂⢄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠔⣨⣴⣿⣯⠰⢟⣟⠭⡤⣲⣏⡔⠒⢂⣤⡦⣶⣶⢶⡔⠙⣿⣾⣽⣷⣿⣳⣿⣽⢿⡽⠖⠋⢁⣀⣤⣀⣔⣀⠤⢄⣿⣿⡟⣶⣦⣾⣿⠿⣮⣿⣯⣉⣿⣿⣿⣟⠋⠉⠉⠛⠿⣯⣿⣧⣝⣞⠯⢆⢄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠔⠊⠠⣼⣷⣿⣷⢿⣞⣯⢆⡍⣻⡿⣙⣳⣦⠾⣿⣿⣭⣷⣎⣄⣴⣿⣟⡿⣿⣿⡿⢿⣛⣭⡀⣠⣦⣵⣟⡿⣴⣿⠞⠃⠀⠹⣿⣿⣿⣿⣿⣹⣿⣿⣿⣿⣝⢼⢻⡿⣿⣷⣖⣤⣐⣄⢍⠻⣿⣾⣝⢿⣯⣜⡈⠢⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠔⠁⢀⣤⣾⣿⣿⣯⢖⣋⣍⣼⣟⣩⡞⣿⣛⣿⣶⠿⢻⣿⡿⣯⡻⣝⠿⣞⡾⣽⣿⣭⠞⠨⣋⠁⢋⣿⣿⣯⣿⣿⣿⣿⣿⢶⣄⣦⣿⣿⣿⡉⢈⠓⣿⡁⠈⢉⠙⡏⣿⡿⡿⠋⠉⢽⣯⣿⢭⣧⣴⡽⣿⣿⣶⣯⣷⡆⠈⣤⢄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡠⠊⠀⣠⣴⣿⣿⣿⣿⡿⣱⣭⡿⣳⣿⣋⣩⣿⣟⣳⡳⡏⣁⡚⣩⣷⣳⢳⡯⣟⠺⠹⣞⣳⢶⣿⣶⣤⡾⣿⣿⢻⡗⣯⣿⣿⣿⡿⢾⣿⣿⣿⣿⣿⣿⣆⣽⣸⣄⣠⣿⣡⣷⣽⡅⠀⢠⠀⢀⣈⢻⣿⣷⣿⣽⣿⣿⣿⣿⣶⣼⣿⣹⣷⢕⢄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠞⠀⠐⣿⣿⣿⣿⣿⣻⣟⣴⣿⣿⣳⣟⣳⣿⣿⡟⡒⠙⣛⡽⣿⠋⣽⢧⢯⣳⢿⣭⣛⣟⡼⡵⠹⣖⣫⠷⣾⣿⣳⢟⣶⣿⣿⡿⠟⣻⣾⣿⣷⣯⣿⣿⣿⣿⣿⣷⣽⣿⣿⣿⣿⣿⣿⣳⡌⠦⣄⠋⣮⡿⣿⣿⣿⣿⣻⣿⣯⣿⣿⣿⣷⣿⣮⣷⢕⢄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠔⠁⠐⣠⣼⣿⣿⣿⣿⡧⣿⣧⣦⣿⣯⢵⣻⣹⣿⣾⠛⣡⣩⡲⠧⣷⣾⡹⣞⡧⢟⡽⣲⡽⢾⣽⢟⡯⠔⠒⣼⣟⣰⣟⡿⣿⠋⠁⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣮⣶⣄⡀⢘⣿⣽⠿⣿⣿⣿⣿⣿⡿⣿⣿⣿⣿⡽⡻⣿⣱⡤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡠⢃⢤⣿⣻⣿⣿⣿⣿⡿⣿⣾⣯⢙⠿⢿⣷⣞⣩⣿⣭⡴⣓⣼⠯⢙⣪⠵⡼⣋⠿⡽⢊⡴⢧⣟⣳⢮⢣⢌⢦⡊⠴⣨⣿⣿⣿⣧⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣎⣿⣿⣿⣟⣿⣿⣿⣿⣿⣿⣿⣭⡺⣳⣶⣮⠢⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠌⢠⣷⣏⣿⣿⣿⣿⢻⣿⠐⠋⣹⡏⠈⣦⣾⢻⢋⣵⣾⣷⢿⠟⠩⢈⣟⢌⠲⡱⣯⡟⣶⢫⡞⡽⡲⢧⠏⣞⡸⣆⢳⣿⣿⣿⣿⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡷⡑⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⡠⢂⣼⣽⣿⡿⠻⠋⣿⣾⣽⡧⢒⣽⡟⣼⡇⣿⣿⣿⢿⣾⢿⢫⣧⣀⡿⢏⢫⠚⣩⣵⣶⣬⣵⣧⣼⣿⣿⣿⣿⣿⣷⢲⢹⣿⠟⣿⣿⣿⣿⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⣱⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠽⣎⢆⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⡔⢀⣾⣟⡾⣿⣦⡔⡚⢿⣾⣉⣴⣿⣿⠟⣻⣷⢿⣿⡿⣼⣻⢆⣿⣿⡋⢤⣲⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⢟⡿⣟⣈⣽⠿⠉⣰⣾⣿⣿⣿⣿⣿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⢻⣧⠢⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠜⣠⣾⣿⣽⣿⣿⣿⣿⣄⣩⠟⣡⣿⣿⣿⣷⣭⣿⣏⢿⣯⣿⣷⢎⣽⢷⣿⣐⢤⣿⣿⣿⣿⣿⣿⣿⢟⣿⣥⣶⢹⢽⣿⣿⡿⣍⣶⡟⢫⣿⣻⣿⣿⣿⣿⡦⣿⣍⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿⣿⣿⣿⡻⣾⣷⡡⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠜⣰⣿⣿⡿⣿⣿⣿⣿⣭⣿⣷⣿⣿⣿⣿⠟⡣⠺⠟⠻⣿⣿⣼⣿⡗⢻⣽⣿⣽⣿⣿⣿⣿⣾⣿⣟⡿⢻⣏⣠⣾⣽⣿⣿⢿⡿⠿⣯⣷⣄⣻⣝⣿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⡟⣿⣿⣿⣧⣿⢯⣷⣡⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠌⣀⣿⣛⣽⠃⠻⠿⠿⢿⠋⢘⣿⣻⡿⢳⣵⠞⠓⠫⣕⣦⣌⢻⣿⣿⢲⡽⣷⣟⡼⣿⣿⣿⣾⣿⣿⣿⣿⣛⣽⢻⣿⣿⣷⣿⣽⣿⣿⣷⣤⢮⡻⠿⣿⣿⣿⣿⣹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿⣿⣿⡿⠹⣿⣏⠉⡟⣯⢿⣻⣷⡡⠀⠀⠀⠀⠀
⠀⠀⠀⠀⡘⡰⣿⡿⣿⣿⣧⣄⠴⣀⣜⣠⣿⣿⠛⢀⡟⢡⡤⠶⡛⠪⣯⢻⣈⢿⣫⣗⣻⣼⣿⢶⣿⣾⣿⣿⣿⣿⢯⢾⠽⢻⣿⣿⠟⠟⣿⣿⣿⣿⣿⣿⣿⣷⣿⣷⣽⣿⣻⡿⣿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣽⣿⣿⣿⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣼⣿⣿⣿⣿⣿⣿⣿⠀⢷⡜⢿⣿⣿⣵⢡⠀⠀⠀⠀
⠀⠀⠀⢠⢡⣷⣿⣷⣨⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⠘⠏⣿⠐⡀⡇⣄⣿⣞⣯⠸⡿⠳⣿⣿⢿⣾⡷⡽⠛⣿⣝⣮⣟⢣⡶⣿⣿⡇⢰⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣾⣷⣶⣿⣯⣹⣟⣿⣟⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣗⣳⡺⣿⣿⣻⣧⠃⠀⠀⠀
⠀⠀⢀⠃⣾⣿⣿⣿⢿⣮⡙⠻⣿⣽⣿⣿⣿⢿⣿⡐⠀⠉⠊⡜⣰⣿⡿⣿⡯⣷⣷⡄⣻⣹⣯⣯⣻⣿⣿⡻⣾⡷⠮⣵⣶⡿⣿⣿⣿⠶⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣿⣿⣿⣿⣿⣿⡿⠟⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⡟⢿⣹⣿⣯⡟⡀⠀⠀
⠀⠀⡜⣸⡟⢿⡿⠃⣾⣿⣿⣷⣾⣿⣿⣿⣿⣿⣿⣷⣖⣤⣾⣼⣷⣗⠃⢠⣿⣻⣿⣿⣿⣭⣿⣿⣿⣿⣿⣿⣦⣹⡻⣿⣛⣧⣊⣡⣯⣤⣼⣯⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣾⣿⣏⢙⣿⣿⣿⣿⣿⣷⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣿⣇⣿⣿⣿⣿⡽⣱⠀⠀
⠀⢠⢡⣿⣷⡾⣧⠀⣿⣿⣿⣿⣿⣿⡟⠿⣿⣿⣿⣿⣵⣷⣿⣿⣿⣧⠖⣿⣿⣷⡿⢻⣿⣿⣿⣿⣿⣿⣿⢿⣿⣽⣿⣿⣿⣾⣟⣿⠿⢻⣍⣻⣿⣿⣿⣿⡿⣿⣿⣿⣿⣿⣿⠿⣿⣿⣿⣿⣿⣿⣿⣿⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡽⣯⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣾⣿⣿⣿⣿⡃⡄⠀
⠀⡌⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠛⢯⡖⠘⠉⢿⣽⣿⣿⣿⢿⠟⢃⣴⣿⣿⣿⢿⢵⣿⣿⣿⣿⣿⣯⢞⣞⣹⡟⠧⠉⠛⠿⣿⣿⣮⡤⡹⠟⢿⣿⣿⣿⣿⣿⣿⣟⣛⣯⡷⣟⢫⡵⣯⣿⣿⣿⣿⣿⣿⣿⣿⣟⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠠⠀
⢀⠁⣿⣿⣿⣿⣿⣿⡿⣿⣿⣿⣿⣿⡎⢀⣴⠀⣿⣿⣿⣿⣰⣿⣶⣿⢝⣿⡿⢁⡾⠐⣿⣿⣿⣿⣿⣿⣟⡿⣿⣿⣷⣶⣶⣶⣩⣽⣷⣽⣧⣟⣁⢸⣯⣛⢿⡿⣛⣎⣝⣾⣟⡾⢛⣼⣯⢹⡻⢯⣿⣩⠻⡝⢯⣭⠿⣿⣿⣿⣿⣿⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣯⣿⣿⣿⡀⡄
⡞⢘⣿⣿⣿⣿⣿⣿⣾⣿⣿⣿⣿⣿⣿⣿⡣⢊⣽⣿⣿⣿⣿⣿⣿⣧⣞⣟⡃⣦⢇⣬⣿⡟⣿⣿⣏⣿⣻⣷⣦⠿⣿⣿⣿⠿⡿⠿⢿⠻⢿⣿⣧⣿⣿⡛⢿⢿⣿⣴⣾⣻⣿⢻⣿⣙⡶⠯⢭⡿⣤⣾⣧⣹⣿⣿⠿⣼⢿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣯⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⣿⢯⣿⢩⣿⣿⡇⢁
⡇⣸⣿⣿⣿⠏⣯⣿⣾⣿⣿⣿⡿⣿⣫⣟⣾⢛⣡⣾⣿⣿⣿⣿⣿⣿⣿⣧⣮⢾⡫⡽⠿⠓⢈⣿⡿⢻⣿⣿⣿⢻⣉⣽⣿⣶⣶⣶⣿⡷⠀⠙⠛⣿⠿⠃⢹⣯⣹⣿⣿⡿⣻⣽⢏⣬⢗⢻⡹⣷⣿⣿⣺⣹⣻⣿⣿⣿⣳⣎⡽⣟⠯⣝⡻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣄⡿⣻⣿⢾⣿⣿⣧⠀
⡇⠉⣿⠋⢻⡘⣿⣿⣿⣿⣿⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣫⣹⢿⣿⣿⣏⢼⣡⢎⠏⡀⠰⢢⠊⠳⠟⣿⣿⣿⣿⣟⣿⣿⡟⣿⣿⣿⣿⠇⣤⣄⣀⣀⠀⠀⣹⣾⣿⡏⠐⡿⣡⣽⣾⣿⣯⣷⣾⣼⣿⣿⣿⣽⡷⠿⠾⣿⣳⢽⢾⣻⢽⣳⣧⡏⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣾⣿⣿⣷⣿⣿⠀
⡇⣰⡷⣠⣿⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣽⣿⣯⣿⣿⣿⣿⣿⣿⡿⢜⠜⡤⣾⢸⣧⣷⣷⣿⣇⢈⣯⡄⣻⣿⣴⣿⠟⣀⡹⣾⠟⠟⣿⣻⣀⣾⣿⣯⣽⣵⣿⣿⣿⣬⣗⣝⣶⣯⡖⣯⣿⣽⣿⣻⢿⣴⣋⡷⢯⣯⠿⣯⡿⣧⣟⣾⡝⢯⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣾⣿⣿⣿⠀
⡅⣟⣡⣾⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣾⣿⣿⣿⣿⣿⣿⣏⣈⣽⣯⣶⣿⡿⢻⢋⣽⣿⣿⣿⣖⣨⣾⣩⣯⢯⣿⣫⡗⣝⣿⣷⢏⡾⢓⡇⡧⣟⣟⣯⢏⣷⣻⣽⣷⢯⡿⢼⡇⢻⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠄
⡇⣻⢃⣿⣿⢿⣿⣿⣮⣿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿⣿⣿⣿⣿⡟⣿⣹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⣿⣿⣿⣿⣿⣾⣷⣿⣿⣿⣿⣟⣃⣼⣼⢋⣿⡟⢻⣤⡿⣫⣎⡁⢴⡾⣵⢺⣭⠽⣬⢚⣶⣓⠾⣵⣛⢾⣭⡿⣧⣿⣟⣿⣞⡟⣾⡼⣽⢧⠧⣿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⢩⣿⣿⣿⠂
⡇⢳⣿⣿⣿⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣯⣤⡾⡧⠿⢩⠎⠁⢲⣶⣎⡷⣦⣞⢷⡳⣏⣞⣻⡘⣯⢳⣭⡻⡵⢫⡟⢞⣓⡵⣬⣬⢷⡾⣝⣳⢏⡟⡎⣿⣍⡽⣭⣛⣿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣥⣰⣿⣿⣿⠀
⡇⠈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣿⣿⣿⠿⣿⣿⣿⣿⣇⣿⣿⣻⡷⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡫⢾⡏⠀⡟⢩⣾⠷⡀⠋⠿⣗⣿⣎⢷⡓⢮⠼⠓⣷⢶⣱⢲⣕⣞⣹⣜⣳⢏⣞⡵⣯⣻⡼⣯⣝⣯⣿⣽⣿⣷⢶⢯⡿⣬⡟⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀
⡇⠀⣛⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣽⣿⣿⣿⣿⣿⣹⣯⣿⣧⡩⡿⣿⣿⣿⣿⣿⣿⣿⣿⢷⡈⣷⣬⣒⣌⢻⣦⡴⣷⣬⠍⢻⣮⣓⣹⢋⡿⣛⡥⡿⢭⡻⣶⣝⠶⣍⡞⣯⢿⣹⢯⣽⣷⣯⣾⢿⣹⣿⠽⣭⣿⣿⣿⢅⣿⣿⣿⢏⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀
⢣⢠⣿⣾⣿⣿⣿⣿⣿⣿⣿⣿⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣿⣻⣿⣿⣟⡿⡟⣿⣿⣿⣿⡟⣽⢝⣽⣿⠏⠓⠉⠉⣿⡻⣿⣿⣿⣜⠾⢦⢿⢷⣯⣷⢿⣛⠾⣯⣛⣶⢧⣟⣞⡳⡝⣽⢹⢯⡷⣯⣟⣷⣚⢧⣟⣼⢻⣶⢿⣳⣿⣿⢸⣧⢽⡾⣿⣿⣯⠟⣿⣿⢿⣾⣿⣿⣻⣿⣿⣿⣟⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀
⠈⡄⢻⣿⣯⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣯⣟⣿⣿⣿⣾⣬⣞⣻⣿⣶⣶⣴⣦⣸⡁⠙⢻⣿⣿⡞⡿⣷⣿⣿⡿⣏⠟⡿⣴⣛⢮⠻⢼⡝⣳⢽⢪⡽⣶⡽⣟⡖⣷⣻⣧⣟⠾⣿⣻⡿⣷⣿⢣⣿⣟⣍⣿⣿⢽⣧⣿⣿⣿⣿⣽⣿⣿⣿⢿⣿⣿⣿⣷⣽⣿⣿⣿⣿⣿⣿⣿⣿⠁⠀
⠀⢃⢸⣿⣿⣷⣟⣿⢿⣿⣿⣿⣿⣿⣿⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣻⣿⣿⡻⣿⣟⣻⣻⣿⣟⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⣠⣬⣿⣛⣿⣏⢆⠻⣿⢶⣽⣞⣻⢖⣊⢷⣹⠾⣝⣫⠾⣧⣳⣈⠿⣝⣞⣲⣟⢧⣾⣻⣿⣯⢷⣻⢷⢻⣟⣧⣾⣿⣯⣿⣷⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣏⢼⣿⣿⣿⡟⠀⠀
⠀⠘⡈⣿⣿⣿⣽⣿⣿⣻⣿⣽⣿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣿⣿⣯⣿⣿⣿⣾⣿⣿⣿⣷⣿⣿⣿⡿⣿⣿⣿⣿⣿⣿⢿⡿⣿⠛⡾⢷⡹⣿⣏⠻⣿⣧⡯⣝⡼⢚⠝⣿⠿⣧⣻⣗⡛⣾⣟⣿⢽⣻⠳⣿⣿⣵⢿⣿⣻⡿⣻⣿⣿⣦⣟⣲⣿⢛⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣼⣶⣿⣿⣿⢇⠃⠀
⠀⠀⢣⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣯⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣯⣇⠈⢻⣿⣼⣷⣍⡟⢻⣷⣧⣯⢷⣿⣭⣲⣸⣴⡟⣳⡿⣏⣷⣽⣬⣾⣿⡾⣏⣟⣴⣿⡏⣿⣵⣽⣣⣿⣾⣿⣿⣿⠍⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡘⠀⠀
⠀⠀⠈⡄⠽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣻⣿⣿⣗⣿⣿⡛⢟⢿⠉⢛⣳⣯⠻⣿⣿⣦⡽⢿⣟⣿⣿⣟⣷⣽⣱⣟⣿⣱⢾⣽⣽⣓⡽⣿⣾⢿⣻⣟⣿⣷⣯⣿⣟⣽⣿⣿⠄⠠⡔⣤⣭⣛⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢣⠁⠀⠀
⠀⠀⠀⠐⢀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢽⣿⣿⣿⣯⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣿⣄⢐⣟⣿⣤⣤⣟⣿⣿⣎⢫⢿⡳⣿⣿⣾⠣⣜⠓⣿⣷⣻⢿⣍⣷⡾⢹⣿⣿⣏⣿⣿⡿⣿⣿⣿⡟⠁⠀⢠⡾⠛⠋⠛⠻⠶⢌⣹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠂⠀⠀⠀
⠀⠀⠀⠀⢡⠀⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⣻⡟⠛⠙⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣻⣷⡿⡗⡘⠿⣤⠈⣛⣿⡼⢪⣷⣹⣿⣿⡽⣏⢿⡼⢻⣿⣷⢞⣟⣿⣻⣽⢟⣿⢽⢾⣿⣿⣿⡏⠀⠞⡏⢧⣷⣿⣏⣐⣷⣶⡳⣍⡙⢿⢿⣿⣿⣿⣿⣿⣿⡟⡘⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢃⠱⣆⠣⡈⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣿⣿⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⢿⣻⣿⣿⣾⣍⡳⣟⣿⡿⣤⠝⣧⡵⡿⣿⣪⣿⣿⣿⣿⠻⣜⠯⢞⣽⣳⡟⣾⣻⢻⢿⠛⣹⣾⣋⡾⣿⣿⣿⣀⢀⣾⣴⣿⣿⣿⣿⣿⣿⣿⡓⠼⣿⣪⣝⣿⣿⣿⣿⣿⡿⡑⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢣⠈⣧⡈⠢⠀⢨⠛⢯⢻⣟⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣽⡻⢿⣿⣿⣿⣿⣿⣽⣗⣄⡛⣿⣿⢿⣶⣿⣿⢿⣇⣘⣯⣟⣿⣿⣻⣿⣿⢣⡽⢞⣽⣫⢞⣻⣿⣿⡿⣏⣧⣿⣿⣲⣷⣾⣽⣫⣾⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣳⣯⣽⣿⣿⣿⣿⣿⡿⡑⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢢⠹⣿⣦⣄⠀⠁⠀⠡⠈⠛⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⣈⡁⢶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣷⣿⣿⣿⣿⣷⣿⣿⣿⣿⣼⢏⣿⣿⣿⣿⣏⢷⡹⣟⣾⣵⢯⣷⣿⣿⣷⣿⣿⡿⣯⣿⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⡑⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠢⡘⣿⣿⣷⣤⡀⠀⠀⠐⡀⢉⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣻⡿⣿⣿⣿⣿⣿⣿⣿⣯⣿⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢓⡇⢀⣷⣿⡿⣿⣘⢧⡟⣵⢿⠞⠳⣾⠿⣿⣿⣿⣿⢿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠔⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠌⠻⣿⣿⣿⣦⡀⠀⢤⡀⠀⠈⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⡾⣿⣿⣿⢾⢿⣳⣟⣾⡹⣭⢿⣅⣤⣁⣊⣉⠍⠉⢀⡾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢋⠌⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢃⠘⢿⣿⣿⣷⣦⡀⠐⡄⠀⠈⠱⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣽⠃⣿⠿⣿⡟⣶⣿⡕⣮⢷⣭⣯⣽⣯⣎⣁⡀⢁⣤⠴⣿⣻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⡱⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠑⡌⠙⣿⣿⣿⣿⣦⣈⡀⠀⡀⠀⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡻⣿⣿⣿⣿⣮⣿⠿⣽⣟⣿⣿⣿⣿⣽⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠆⣿⣗⣿⣿⣿⢯⢿⣹⣞⡷⣿⣻⣿⣽⣿⡓⠶⣽⠹⠛⣵⣯⠿⣿⣽⡿⢩⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢟⠔⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠢⡀⠛⢿⡻⣿⣿⣿⣤⣈⢄⡀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⢡⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠇⣸⣽⣿⣏⢞⡷⣯⣛⠷⣮⢻⣽⣾⣿⣿⣿⣿⣷⡆⠐⢠⣿⣭⡾⣿⣿⣥⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢟⠑⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢦⠉⠻⣾⣿⣿⣿⣿⣷⣭⣦⡀⠈⠺⠻⣿⣿⣿⡿⣿⣿⡆⣤⣿⣿⡿⣭⠉⠳⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⡘⣸⣿⡿⡏⠞⣽⢾⠝⣮⣿⣾⣿⣟⢻⠿⠿⢿⠿⣿⣧⡴⢯⣍⡵⠴⢿⣿⣿⣿⣿⡿⢿⣿⣿⣿⣿⣿⣿⣿⡟⡣⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢦⠈⠻⣟⣿⣿⣿⣿⡿⣿⣦⣀⠀⠑⢽⡻⣿⣽⡙⢿⣮⣿⡉⠻⠿⢷⣦⣄⣈⡑⠻⠽⣛⣿⠿⢿⣿⣿⣷⣿⣿⣿⡿⡟⢲⣿⠛⠻⡟⢾⣭⣯⣿⣿⣏⣋⠙⢿⣶⡄⠀⠂⣀⣩⡝⣳⣶⢋⢤⣶⣿⢽⡿⢛⣏⡉⣾⣿⣿⣿⣿⣿⠟⡩⠊⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠢⡈⠛⢽⢿⣿⣿⣮⣽⣿⣷⣦⠀⠻⣿⣿⣧⡀⠉⠉⠉⠀⠀⠓⠒⠲⢮⣝⣻⣻⢶⣮⡭⣓⡲⠿⣿⣫⡯⢟⣻⢏⣼⣿⣷⣿⠷⣿⣿⣿⣿⣿⣿⡿⢿⣶⡢⠤⣇⣁⣀⣩⡶⣫⣿⣟⣾⠿⣾⢿⣾⣛⣶⣾⣿⣿⣿⡿⢟⠁⠊⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠢⢄⠑⠳⣾⣿⣿⠻⣻⡷⡑⡀⠙⢿⣿⣿⣿⣶⣦⣄⡤⠀⠀⢀⣤⣾⡫⠉⠡⢶⢬⠝⠻⠫⠶⢌⠙⢿⠼⣵⠿⢿⣿⣷⣿⣿⣿⣿⣿⣷⣉⡛⢻⡿⢿⣭⣿⣯⣽⣽⣿⣿⣷⣜⣶⡶⣾⣯⣝⣫⣽⣿⣿⠟⣋⠔⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠢⣌⠙⠛⠿⣯⣿⠷⣱⣄⡀⠈⠹⠿⣿⡛⢿⠿⣷⣀⠘⢿⣟⠁⠀⢩⢃⣭⣻⣟⣳⣄⣀⠀⠘⠀⣶⣆⣛⠛⣷⣿⣿⠿⣿⡿⣷⣟⣿⣿⣟⣿⣶⣾⣿⣿⣿⣿⡿⠿⠻⣟⡿⣿⣿⣿⣿⠿⢋⠕⠊⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠑⠢⣀⠈⠻⣆⣫⣽⡿⣗⢦⡐⣤⣉⣈⡽⠚⢻⡿⠟⠚⡩⠔⣣⣾⣿⣋⣩⡍⠿⢿⣿⣦⡄⠿⣾⣧⣶⣍⣉⣛⣳⣥⣴⣮⡽⠿⠟⢻⠿⣛⣟⡏⣡⣴⣶⣿⣟⡵⣿⣽⣿⠿⢋⠅⠊⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠂⠤⡉⠉⠛⢋⣝⢪⠬⣑⣂⣠⣙⣩⣄⣶⣿⣶⣿⠿⠷⠟⠋⠩⣭⣿⣷⣿⣿⣿⣷⣄⠈⠉⠉⠉⢉⣀⣤⣴⣶⣾⣿⣿⢛⣛⣯⠳⠞⣛⣻⡿⣿⠻⢛⣋⠫⠐⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠒⠄⢀⡀⠙⠥⣘⠛⠛⡛⢋⣉⢩⣫⣭⣵⣶⣶⡿⠿⠛⢏⠾⠾⠥⢒⠛⣛⠻⠟⠛⠛⠛⢚⡹⠋⡭⠒⠉⣀⠈⣀⣄⣳⠶⠟⢉⣉⠦⠒⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠒⠀⠤⣀⠈⠈⠉⠉⠋⠉⠹⠩⠄⠀⠀⠀⠁⠀⠀⠀⠀⠉⠀⠀⠀⠀⠉⠈⠁⠀⢀⠀⣤⠤⡴⢛⣉⠱⠔⠚⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠁⠒⠂⠤⠤⠄⣀⢀⣠⣀⣀⣀⣀⣀⣀⣀⣀⣈⣠⣤⣴⣂⣰⡮⠦⠔⠓⠈⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`
}

export function populateVariableDebugger() {
    const debugTextAreaContainer = document.getElementById('debugTextAreaContainer');
    
    const variables = [
        { label: "", value: "" },
        { label: "Game Settings:", value: "" },
        { label: "", value: "" },

        { label: "gamestate", value: getGameStateVariable() },
        { label: "gameStartTimeStamp", value: gameStartTimeStamp },
        { label: "runStartTimeStamp", value: runStartTimeStamp },        
        { label: "alreadySeenNewsTickerArray", value: alreadySeenNewsTickerArray },
        { label: "currencySymbol", value: currencySymbol },
        { label: "currentTheme", value: currentTheme },
        { label: "sfx", value: sfx },
        { label: "backgroundAudio", value: backgroundAudio },
        { label: "saveExportCloudFlag", value: saveExportCloudFlag },
        { label: "autoSaveToggle", value: autoSaveToggle },
        { label: "newsTickerSetting", value: newsTickerSetting },
        { label: "weatherEffectSettingToggle", value: weatherEffectSettingToggle },
        { label: "notificationsToggle", value: notificationsToggle },
        { label: "saveName", value: saveName },
        { label: "lastSavedTimeStamp", value: lastSavedTimeStamp },
        { label: "autoSaveFrequency", value: autoSaveFrequency },
        { label: "savedYetSinceOpeningSaveDialogue", value: savedYetSinceOpeningSaveDialogue },

        { label: "", value: "" },
        { label: "Run:", value: "" },
        { label: "", value: "" },

        { label: "rebirthPossible", value: rebirthPossible },
        { label: "runNumber", value: runNumber },
        { label: "apAwardedThisRun", value: apAwardedThisRun },
        { label: "currentStarSystem", value: currentStarSystem },

        { label: "", value: "" },
        { label: "Resources / Compounds / AutoBuyers:", value: "" },
        { label: "", value: "" },

        { label: "saleResourcePreviews", value: saleResourcePreviews },
        { label: "saleCompoundPreviews", value: saleCompoundPreviews },
        { label: "createCompoundPreviews", value: createCompoundPreviews },
        { label: "constituentPartsObject", value: constituentPartsObject },
        { label: "itemsToDeduct", value: itemsToDeduct },
        { label: "itemsToIncreasePrice", value: itemsToIncreasePrice },
        { label: "unlockedResourcesArray", value: unlockedResourcesArray },
        { label: "unlockedCompoundsArray", value: unlockedCompoundsArray },
        { label: "temporaryRowsRepo", value: temporaryRowsRepo },
        { label: "canAffordDeferred", value: canAffordDeferred },
        { label: "originalFrameNumbers", value: originalFrameNumbers },

        { label: "", value: "" },
        { label: "Tech:", value: "" },
        { label: "", value: "" },

        { label: "techRenderCounter", value: techRenderCounter },
        { label: "techUnlockedArray", value: techUnlockedArray },
        { label: "revealedTechArray", value: revealedTechArray },
        { label: "upcomingTechArray", value: upcomingTechArray },
        { label: "tempRowValue", value: tempRowValue },
        { label: "cachedRenderedTechTree", value: cachedRenderedTechTree },
        { label: "techRenderChange", value: techRenderChange },
        { label: "techTreeDrawnYet", value: techTreeDrawnYet },

        { label: "", value: "" },
        { label: "Energy:", value: "" },
        { label: "", value: "" },

        { label: "losingEnergy", value: losingEnergy },
        { label: "powerOnOff", value: powerOnOff },
        { label: "trippedStatus", value: trippedStatus },

        { label: "", value: "" },
        { label: "Statistics:", value: "" },
        { label: "", value: "" },

        { label: "allTimeTotalHydrogen", value: allTimeTotalHydrogen },
        { label: "allTimeTotalHelium", value: allTimeTotalHelium },
        { label: "allTimeTotalCarbon", value: allTimeTotalCarbon },
        { label: "allTimeTotalNeon", value: allTimeTotalNeon },
        { label: "allTimeTotalOxygen", value: allTimeTotalOxygen },
        { label: "allTimeTotalSodium", value: allTimeTotalSodium },
        { label: "allTimeTotalSilicon", value: allTimeTotalSilicon },
        { label: "allTimeTotalIron", value: allTimeTotalIron },
        { label: "allTimeTotalDiesel", value: allTimeTotalDiesel },
        { label: "allTimeTotalGlass", value: allTimeTotalGlass },
        { label: "allTimeTotalSteel", value: allTimeTotalSteel },
        { label: "allTimeTotalConcrete", value: allTimeTotalConcrete },
        { label: "allTimeTotalWater", value: allTimeTotalWater },
        { label: "allTimeTotalTitanium", value: allTimeTotalTitanium },
        { label: "allTimeTotalResearchPoints", value: allTimeTotalResearchPoints },
        { label: "allTimeTotalScienceKits", value: allTimeTotalScienceKits },
        { label: "allTimeTotalScienceClubs", value: allTimeTotalScienceClubs },
        { label: "allTimeTotalScienceLabs", value: allTimeTotalScienceLabs },
        { label: "allTimeTotalRocketsLaunched", value: allTimeTotalRocketsLaunched },
        { label: "allTimeTotalStarShipsLaunched", value: allTimeTotalStarShipsLaunched },
        { label: "allTimeTotalAsteroidsDiscovered", value: allTimeTotalAsteroidsDiscovered },
        { label: "allTimeTotalLegendaryAsteroidsDiscovered", value: allTimeTotalLegendaryAsteroidsDiscovered },
        { label: "starStudyRange", value: starStudyRange },
        { label: "allTimeTotalAntimatterMined", value: allTimeTotalAntimatterMined },
        { label: "antimatterMinedThisRun", value: antimatterMinedThisRun },
        { label: "allTimeTotalApGain", value: allTimeTotalApGain },
        { label: "currentRunNumber", value: currentRunNumber },
        { label: "currentRunTimer", value: currentRunTimer },
        { label: "totalNewsTickerPrizesCollected", value: totalNewsTickerPrizesCollected },
        { label: "apAnticipatedThisRun", value: apAnticipatedThisRun },
        { label: "allTimeStarShipsBuilt", value: allTimeStarShipsBuilt },
        { label: "starShipTravelDistance", value: starShipTravelDistance },
        { label: "allTimesTripped", value: allTimesTripped },
        { label: "allTimeBasicPowerPlantsBuilt", value: allTimeBasicPowerPlantsBuilt },
        { label: "allTimeAdvancedPowerPlantsBuilt", value: allTimeAdvancedPowerPlantsBuilt },
        { label: "allTimeSolarPowerPlantsBuilt", value: allTimeSolarPowerPlantsBuilt },
        { label: "allTimeSodiumIonBatteriesBuilt", value: allTimeSodiumIonBatteriesBuilt },
        { label: "allTimeBattery2Built", value: allTimeBattery2Built },
        { label: "allTimeBattery3Built", value: allTimeBattery3Built },
        { label: "asteroidsMinedThisRun", value: asteroidsMinedThisRun },

        { label: "", value: "" },
        { label: "Weather:", value: "" },
        { label: "", value: "" },

        { label: "weatherEffectOn", value: weatherEffectOn },
        { label: "weatherEfficiencyApplied", value: weatherEfficiencyApplied },
        { label: "currentStarSystemWeatherEfficiency", value: currentStarSystemWeatherEfficiency },
        { label: "currentPrecipitationRate", value: currentPrecipitationRate },

        { label: "", value: "" },
        { label: "Space Telescope:", value: "" },
        { label: "", value: "" },

        { label: "currentlySearchingAsteroid", value: currentlySearchingAsteroid },
        { label: "currentlyInvestigatingStar", value: currentlyInvestigatingStar },
        { label: "telescopeReadyToSearch", value: telescopeReadyToSearch },
        { label: "asteroidTimerCanContinue", value: asteroidTimerCanContinue },
        { label: "starInvestigationTimerCanContinue", value: starInvestigationTimerCanContinue },
        { label: "sortAsteroidMethod", value: sortAsteroidMethod },
        { label: "sortStarMethod", value: sortStarMethod },
        { label: "baseSearchAsteroidTimerDuration", value: baseSearchAsteroidTimerDuration },
        { label: "baseInvestigateStarTimerDuration", value: baseInvestigateStarTimerDuration },
        { label: "currentAsteroidSearchTimerDurationTotal", value: currentAsteroidSearchTimerDurationTotal },
        { label: "currentInvestigateStarTimerDurationTotal", value: currentInvestigateStarTimerDurationTotal },
        { label: "timeLeftUntilAsteroidScannerTimerFinishes", value: timeLeftUntilAsteroidScannerTimerFinishes },
        { label: "timeLeftUntilTravelToDestinationStarTimerFinishes", value: timeLeftUntilTravelToDestinationStarTimerFinishes },
        { label: "timeLeftUntilStarInvestigationTimerFinishes", value: timeLeftUntilStarInvestigationTimerFinishes },
        { label: "oldAntimatterRightBoxSvgData", value: oldAntimatterRightBoxSvgData },

        { label: "", value: "" },
        { label: "Rockets And Asteroid Mining:", value: "" },
        { label: "", value: "" },

        { label: "antimatterUnlocked", value: antimatterUnlocked },
        { label: "isAntimatterBoostActive", value: isAntimatterBoostActive },
        { label: "antimatterSvgEventListeners", value: antimatterSvgEventListeners },
        { label: "canTravelToAsteroids", value: canTravelToAsteroids },
        { label: "canFuelRockets", value: canFuelRockets },
        { label: "checkRocketFuellingStatus - rocket1", value: checkRocketFuellingStatus.rocket1 },
        { label: "checkRocketFuellingStatus - rocket2", value: checkRocketFuellingStatus.rocket2 },
        { label: "checkRocketFuellingStatus - rocket3", value: checkRocketFuellingStatus.rocket3 },
        { label: "checkRocketFuellingStatus - rocket4", value: checkRocketFuellingStatus.rocket4 },
        { label: "currentlyTravellingToAsteroid - rocket1", value: currentlyTravellingToAsteroid.rocket1 },
        { label: "currentlyTravellingToAsteroid - rocket2", value: currentlyTravellingToAsteroid.rocket2 },
        { label: "currentlyTravellingToAsteroid - rocket3", value: currentlyTravellingToAsteroid.rocket3 },
        { label: "currentlyTravellingToAsteroid - rocket4", value: currentlyTravellingToAsteroid.rocket4 },
        { label: "rocketReadyToTravel - rocket1", value: rocketReadyToTravel.rocket1 },
        { label: "rocketReadyToTravel - rocket2", value: rocketReadyToTravel.rocket2 },
        { label: "rocketReadyToTravel - rocket3", value: rocketReadyToTravel.rocket3 },
        { label: "rocketReadyToTravel - rocket4", value: rocketReadyToTravel.rocket4 },
        { label: "rocketUserName", value: rocketUserName },
        { label: "rocketsBuilt", value: rocketsBuilt },
        { label: "asteroidArray", value: asteroidArray },
        { label: "rocketsFuellerStartedArray", value: rocketsFuellerStartedArray },
        { label: "launchedRockets", value: launchedRockets },

        { label: "", value: "" },
        { label: "Star Ship:", value: "" },
        { label: "", value: "" },

        { label: "starShipBuilt", value: starShipBuilt },
        { label: "starShipTravelling", value: starShipTravelling },
        { label: "starShipArrowPosition", value: starShipArrowPosition },
        { label: "stellarScannerBuilt", value: stellarScannerBuilt },
        { label: "destinationStarScanned", value: destinationStarScanned },
        { label: "currentDestinationDropdownText", value: currentDestinationDropdownText },
        { label: "starVisionDistance", value: starVisionDistance },
        { label: "starMapMode", value: starMapMode },
        { label: "starVisionIncrement", value: starVisionIncrement },
        { label: "destinationStar", value: destinationStar },
        { label: "fromStarObject", value: fromStarObject },
        { label: "toStarObject", value: toStarObject },
        { label: "currentStarObject", value: currentStarObject },
        { label: "starShipStatus", value: starShipStatus },
        { label: "starShipModulesBuilt", value: starShipModulesBuilt },

        { label: "", value: "" },
        { label: "Diplomacy:", value: "" },
        { label: "", value: "" },

        { label: "diplomacyPossible", value: diplomacyPossible },

        { label: "", value: "" },
        { label: "Battle:", value: "" },
        { label: "", value: "" },

        { label: "needNewBattleCanvas", value: needNewBattleCanvas },
        { label: "redrawBattleDescription", value: redrawBattleDescription },
        { label: "warMode", value: warMode },
        { label: "fleetChangedSinceLastDiplomacy", value: fleetChangedSinceLastDiplomacy },
        { label: "battleOngoing", value: battleOngoing },
        { label: "formationGoal", value: formationGoal },
        { label: "battleTriggeredByPlayer", value: battleTriggeredByPlayer },
        { label: "inFormation", value: inFormation },
        { label: "wasAutoSaveToggled", value: wasAutoSaveToggled },
        { label: "enemyFleetAdjustedForDiplomacy", value: enemyFleetAdjustedForDiplomacy },
    ];    

    debugTextAreaContainer.innerHTML = "";

    variables.forEach((variable) => {
        const div = document.createElement("div");
        const label = document.createElement("span");

        if (variable.value === "" && variable.label !== "") {
            label.style.fontSize = "2rem";
        }

        if (variable.label === "") {
            const blankLineDiv = document.createElement("div");
            blankLineDiv.style.height = "10px";
            debugTextAreaContainer.appendChild(blankLineDiv);
        } else {
            label.innerHTML = variable.value === "" ? `${variable.label}` : `${variable.label}:&nbsp;&nbsp;`;
    
            const valueDiv = document.createElement("span");
            const className = variable.value === null ? "red-disabled-text" : "green-ready-text";
            valueDiv.classList.add(className);
            valueDiv.textContent = formatVariableDebuggerValue(variable.value);
    
            div.appendChild(label);
            div.appendChild(valueDiv);
    
            debugTextAreaContainer.appendChild(div);
        }
    });
}

function formatVariableDebuggerValue(value) {
    if (Array.isArray(value) || typeof value === 'object') {
        const stringifiedValue = JSON.stringify(value);
        return stringifiedValue.length > 2000 ? `${stringifiedValue.slice(0, 2000)}...` : stringifiedValue;
    } else {
        return value;
    }
}
