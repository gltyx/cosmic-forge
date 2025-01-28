import {
    setRocketsBuilt,
    getRocketsBuilt,
    getWeatherEffectOn,
    setWeatherEffectOn,
    getSaveExportCloudFlag,
    setSaveExportCloudFlag,
    getSaveData,
    getNewsTickerSetting,
    getWeatherEffectSetting,
    setTechTreeDrawnYet,
    getTechTreeDrawnYet,
    setUpcomingTechArray,
    getUpcomingTechArray,
    getSavedYetSinceOpeningSaveDialogue,
    setSavedYetSinceOpeningSaveDialogue,
    setLastSavedTimeStamp,
    getLastSavedTimeStamp,
    setCurrentPrecipitationRate,
    getCurrentPrecipitationRate,
    getCurrentStarSystemWeatherEfficiency,
    setCurrentStarSystemWeatherEfficiency,
    getCurrentStarSystem,
    setCurrentStarSystem,
    getTrippedStatus,
    setTrippedStatus,
    setRanOutOfFuelWhenOn,
    getRanOutOfFuelWhenOn,
    setBuildingTypeOnOff,
    getBuildingTypeOnOff,
    setActivatedFuelBurnObject,
    getActivatedFuelBurnObject,
    setConstituentPartsObject,
    getConstituentPartsObject,
    setPowerOnOff,
    getPowerOnOff,
    setTotalEnergyUse,
    getTotalEnergyUse,
    getBuildingTypes,
    getTechRenderCounter,
    setTechRenderCounter,
    setTechRenderChange,
    getTechRenderChange,
    setTempRowValue,
    getTempRowValue,
    deferredActions,
    getCanAffordDeferred,
    setCanAffordDeferred,
    getTemporaryRowsRepo,
    setTemporaryRowsRepo,
    setOriginalFrameNumbers,
    getOriginalFrameNumbers,
    getUnlockedResourcesArray,
    setUnlockedResourcesArray,
    setRevealedTechArray,
    getTimerRateRatio,
    getTimerUpdateInterval,
    getCurrencySymbol,
    setSaleResourcePreview,
    setCreateCompoundPreview,
    setSaleCompoundPreview,
    getItemsToIncreasePrice,
    setItemsToIncreasePrice,
    getItemsToDeduct,
    setItemsToDeduct,
    getCurrentOptionPane,
    getIncreaseStorageFactor,
    setGameStateVariable,  
    getGameVisibleActive, 
    getElements, 
    gameState, 
    getCurrentTab,
    getRevealedTechArray,
    getTechUnlockedArray,
    getResourceSalePreview,
    getCompoundSalePreview,
    getCompoundCreatePreview,
    getNotationType,
    getTechTreeData,
} from './constantsAndGlobalVars.js';

import {
    getStarSystemDataObject,
    setStarSystemDataObject,
    getAutoBuyerTierLevel,
    getResourceDataObject,
    setResourceDataObject,
    getStarSystemWeather,
    setStarSystemWeather,
    getRocketPartsNeededInTotalPerRocket,
    getRocketParts
} from "./resourceDataObject.js";

import { 
    updateContent,
    sortTechRows,
    showNotification,
    showTabsUponUnlock,
    getTimeInStatCell,
    updateDynamicColumns,
    checkOrderOfTabs,
    showNewsTickerMessage,
    startWeatherEffect,
    stopWeatherEffect,
    switchBatteryStatBarWhenBatteryBought,
    setBatteryIndicator
} from "./ui.js";

import { 
    capitaliseString
 } from './utilityFunctions.js';

 import { newsTickerContent } from './descriptions.js';

 import { initializeAutoSave, saveGame } from './saveLoadGame.js';

//---------------------------------------------------------------------------------------------------------

class TimerManager {
    constructor() {
        this.timers = new Map();
    }

    addTimer(key, duration, onExpire) {
        if (this.timers.has(key)) {
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

const timerManager = new TimerManager();
//--------------------------------------------------------------------------------------------------------


export function startGame() {
    setGameState(getGameVisibleActive());
    updateContent('Resources', `tab1`, 'intro');
    initializeAutoSave();
    startInitialTimers();
    startNewsTickerTimer();
    gameLoop();
}

export async function gameLoop() {
    if (gameState === getGameVisibleActive()) {
        const elements = document.querySelectorAll('.notation');

        showHideDynamicColumns();
        updateDynamicColumns();
        showTabsUponUnlock();
        checkOrderOfTabs();
        
        setEnergyUse();

        const resourceNames = Object.keys(getResourceDataObject('resources'));
        const resourceTierPairs = [];
        resourceNames.forEach(resourceName => {
            for (let tier = 1; tier <= 4; tier++) {
                resourceTierPairs.push([resourceName, tier]);
            }
        });

        const compoundNames = Object.keys(getResourceDataObject('compounds'));
        const compoundTierPairs = [];
        compoundNames.forEach(compoundName => {
            for (let tier = 1; tier <= 4; tier++) {
                compoundTierPairs.push([compoundName, tier]);
            }
        });

        addPrecipitationResource();

        if (getCurrentStarSystemWeatherEfficiency()[2] !== 'rain' && getCurrentStarSystemWeatherEfficiency()[2] !== 'volcano') {
            stopWeatherEffect();
            setWeatherEffectOn(false);
        }
        
        let allQuantities = getAllQuantities();
        allQuantities = normalizeAllQuantities(allQuantities);
        const allStorages = getAllStorages();
        const allElements = getAllElements(resourceTierPairs, compoundTierPairs);
        const allDescElements = getAllDynamicDescriptionElements(resourceTierPairs, compoundTierPairs);
        updateRates();
        updateUIQuantities(allQuantities, allStorages, allElements, allDescElements);
        
        updateStats();

        if (getItemsToDeduct() && Object.keys(getItemsToDeduct()).length > 0) {
            checkAndDeductResources();
        }

        if (getItemsToIncreasePrice() && Object.keys(getItemsToIncreasePrice()).length > 0) {
            checkAndIncreasePrices();
        }

        const elementsEnergy = document.querySelectorAll('.energy-check');
        elementsEnergy.forEach((elementEnergyCheck) => {
            checkStatusAndSetTextClasses(elementEnergyCheck);
        });

        const elementsFuel = document.querySelectorAll('.fuel-check');
        elementsFuel.forEach((elementFuelCheck) => {
            checkStatusAndSetTextClasses(elementFuelCheck);
        });

        const elementsItemsCheck = document.querySelectorAll('.resource-cost-sell-check, .compound-cost-sell-check');
        elementsItemsCheck.forEach((elementItemCheck) => {
            checkStatusAndSetTextClasses(elementItemCheck);
        });

        checkPowerBuildingsFuelLevels();

        monitorTechTree();
        
        const revealRowsCheck = document.querySelectorAll('.option-row');
        revealRowsCheck.forEach((revealRowCheck) => {
            monitorRevealRowsChecks(revealRowCheck);
        });

        getBuildingTypes().forEach(type => {
            checkAndRevealNewBuildings(type);
        });

        monitorRevealResourcesCheck();
        monitorRevealCompoundsCheck();

        updateAllSalePricePreviews();
        updateAllCreatePreviews();

        while (deferredActions.length > 0) {
            const runDeferredJobs = deferredActions.shift();
            runDeferredJobs();
        }

        if (getCurrentOptionPane() === 'technology') {
            updateClassesInRowsToRender();

            const sortedRows = sortRowsByRenderPosition(getTemporaryRowsRepo('rows'), 'techs');
            const containerToRenderTo = getTemporaryRowsRepo('container');
        
            if (getTechRenderChange()) {
                setTechRenderCounter(getTechRenderCounter() + 1);
            
                if (getTechRenderCounter() >= 150) {
                    sortedRows.forEach(item => containerToRenderTo.appendChild(item.row));
                    setTechRenderChange(false);
                    setTechRenderCounter(0);
                }
            }
        }

        setAllOriginalFrameNumberValues();

        elements.forEach(element => {
            if (document.body.contains(element)) {
                if (element.classList.contains('sell-fuse-money')) {
                    setTempRowValue(element.innerHTML);
                    complexSellStringFormatter(element, getNotationType());
                } else if (element.classList.contains('building-purchase')) {
                    setTempRowValue(element.innerHTML);
                    complexPurchaseBuildingFormatter(element, getNotationType());
                } else {
                    formatAllNotationElements(element, getNotationType());
                }
            }
        });

        if (!getSavedYetSinceOpeningSaveDialogue() && getCurrentOptionPane() === 'saving / loading') {
            saveGame('onSaveScreen');
            setSavedYetSinceOpeningSaveDialogue(true);
        } else if (getCurrentOptionPane() === 'saving / loading') {
            if (!getSaveExportCloudFlag()) {
                const saveData = getSaveData();
                const exportSaveArea = document.getElementById('exportSaveArea');
                exportSaveArea.value = saveData;
            } else {
                const saveData = getSaveExportCloudFlag();
                const exportSaveArea = document.getElementById('exportSaveArea');
                exportSaveArea.value = saveData;
            }
        } else {
            setSaveExportCloudFlag(false);
        }

        if (getSavedYetSinceOpeningSaveDialogue && getCurrentOptionPane() !== 'saving / loading') {
            setSavedYetSinceOpeningSaveDialogue(false);
        }

        requestAnimationFrame(gameLoop);
    }
}

function showHideDynamicColumns() {
    if (getCurrentOptionPane() === 'energy' || getCurrentOptionPane() === 'power plant' || getCurrentOptionPane() === 'solar power plant' || getCurrentOptionPane() === 'advanced power plant') {
        document.getElementById('energyConsumptionStats').classList.remove('invisible');
    } else {
        document.getElementById('energyConsumptionStats').classList.add('invisible');
    }
}

function addPrecipitationResource() {
    const currentStarSystemPrecipitationCategory = getStarSystemDataObject(getCurrentStarSystem(), ['precipitationResourceCategory']);
    const currentStarSystemPrecipitationType = getStarSystemDataObject(getCurrentStarSystem(), ['precipitationType']);
    const precipitationTypeRevealedYet = getTechUnlockedArray().includes(getResourceDataObject(currentStarSystemPrecipitationCategory, [currentStarSystemPrecipitationType, 'revealedBy']));

    let currentStarSystemPrecipitationTypeQuantity = getResourceDataObject(currentStarSystemPrecipitationCategory, [currentStarSystemPrecipitationType, 'quantity']);
    let precipitationStorageAvailable = getResourceDataObject(currentStarSystemPrecipitationCategory, [currentStarSystemPrecipitationType, 'storageCapacity']) > currentStarSystemPrecipitationTypeQuantity;

    if (getCurrentStarSystemWeatherEfficiency()[2] === 'rain' && precipitationTypeRevealedYet && precipitationStorageAvailable) {
        setResourceDataObject(currentStarSystemPrecipitationTypeQuantity + getCurrentPrecipitationRate(), currentStarSystemPrecipitationCategory, [currentStarSystemPrecipitationType, 'quantity']);
        getElements().waterQuantity.textContent = getResourceDataObject(currentStarSystemPrecipitationCategory, [currentStarSystemPrecipitationType, 'quantity']);
    }
}

function checkAndRevealNewBuildings(type) {
    let elements;

    switch (type) {
        case 'energy':
            elements = getResourceDataObject('buildings', ['energy', 'upgrades']);
            break;
    }

    for (const key in elements) {
        if (elements.hasOwnProperty(key)) {
            const upgrade = elements[key];
            const revealedTech = upgrade.revealedBy;
            if (getTechUnlockedArray().includes(revealedTech)) {
                const elementUpgradeOptionElement = key + 'Option';
                document.getElementById(elementUpgradeOptionElement).parentElement.parentElement.classList.remove('invisible');
            }
        }
    }
}

function updateStats() {
    //stat1
    const cash = getResourceDataObject('currency', ['cash']);
    if (getCurrencySymbol() !== "€") {
        getElements().cashStat.textContent = `${getCurrencySymbol()}${cash.toFixed(2)}`;
    } else {
        getElements().cashStat.textContent = `${cash.toFixed(2) + getCurrencySymbol()}`;
    }

    //stat2
    updateEnergyStat(document.getElementById('stat2'));

    //stat3
    checkStatusAndSetTextClasses(document.getElementById('stat3'));

    //stat4
    const batteryLevel = switchBatteryStatBarWhenBatteryBought();

    if (batteryLevel || batteryLevel === 0) {
        setBatteryIndicator(batteryLevel);
    }

    //stat8
    getTimeInStatCell();
}

function setRevealedResources(resource) {
    const resourcePairs = [
        ['hydrogen', 'helium'],
        ['helium', 'carbon'],
        ['carbon', 'neon'],
        ['carbon', 'sodium'],
        ['neon', 'oxygen'],
        ['oxygen', 'silicon'],
        ['silicon', 'iron']
    ];

    resourcePairs.forEach(pair => {
        if (pair[0] === resource) {
            setResourceDataObject(true, 'resources', [pair[1], 'revealedYet']);
        }
    });
}

export function fuseResource(resource, fuseTargets) {
    setRevealedResources(resource);
    
    const resourceString = getResourceDataObject('resources', [resource, 'nameResource']);
    const resourceQuantity = getResourceDataObject('resources', [resource, 'quantity']);
    let totalDeducted = 0;
    let iterationCounter = 0;

    for (let target of fuseTargets) {
        iterationCounter++;
        const { fuseTo, ratio, resourceRowToShow, categoryToShow, mainCategoryToShow } = target;

        const fuseToString = getResourceDataObject('resources', [fuseTo, 'nameResource']);
        const fuseToStorageCapacity = getResourceDataObject('resources', [fuseTo, 'storageCapacity']);
        const fuseToQuantity = getResourceDataObject('resources', [fuseTo, 'quantity']);
        
        let fuseData, amountToDeductFromResource, amountToAddToResource, realAmountToAdd = 0, lostQuantity = 0;

        if (!getUnlockedResourcesArray().includes(fuseTo)) {
            resourceRowToShow.classList.remove('invisible');
            mainCategoryToShow.classList.remove('invisible');
            categoryToShow.classList.remove('invisible');
            setUnlockedResourcesArray(fuseTo);
            fuseData = getResourceSalePreview(resource);
            amountToDeductFromResource = parseInt(fuseData.match(/\((\d+)/)[1], 10);
            const amountToAdd = Math.ceil((amountToDeductFromResource * ratio) / 4);

            showNotification(
                `Discovered ${fuseToString} and made ${amountToAdd} ${fuseToString} from ${amountToDeductFromResource} ${resourceString}!`,
                'info'
            );
            setResourceDataObject(resourceQuantity - amountToDeductFromResource, 'resources', [resource, 'quantity']);
            setResourceDataObject(fuseToQuantity + amountToAdd, 'resources', [fuseTo, 'quantity']);
            totalDeducted = amountToDeductFromResource;
        } else {
            let fusionEfficiency = 1;

            if (!getTechUnlockedArray().includes("fusionEfficiencyI")) {
                fusionEfficiency = Math.random() * (0.30 - 0.20) + 0.20;
            } else if (!getTechUnlockedArray().includes("fusionEfficiencyII")) {
                fusionEfficiency = Math.random() * (0.60 - 0.40) + 0.40;
            } else if (!getTechUnlockedArray().includes("fusionEfficiencyIII")) {
                fusionEfficiency = Math.random() * (0.80 - 0.60) + 0.60;
            }

            fuseData = getResourceSalePreview(resource);
            amountToDeductFromResource = parseInt(fuseData.match(/\((\d+)/)[1], 10);
            iterationCounter === 1 ? amountToAddToResource = parseInt(fuseData.match(/->\s*(\d+)/)[1], 10) : amountToAddToResource = parseInt(fuseData.match(/(?<=,\s)\d+/)[0], 10)

            realAmountToAdd = Math.floor(amountToAddToResource * fusionEfficiency);
            const energyLossFuseToQuantity = Math.floor(amountToAddToResource - realAmountToAdd);
            const availableStorageFuseTo = Math.floor(fuseToStorageCapacity - fuseToQuantity);

            if (Math.abs(amountToDeductFromResource * ratio - amountToAddToResource) <= 1) {
                showNotification(
                    `Should Fuse ${amountToDeductFromResource} ${resourceString} into ${Math.floor(amountToDeductFromResource * ratio)} ${fuseToString}. Lost ${energyLossFuseToQuantity} ${fuseToString} as energy due to sub-optimal fusion efficiency, receive ${realAmountToAdd} ${fuseToString}`,
                    'info',
                    5000
                );
            } else { ;
                
                lostQuantity = Math.max(realAmountToAdd - availableStorageFuseTo, 0);
                showNotification(
                    `Should Fuse ${amountToDeductFromResource} ${resourceString} into ${Math.floor(amountToDeductFromResource * ratio)} ${fuseToString}. Max available storage is for ${availableStorageFuseTo}.  Of those, ${energyLossFuseToQuantity} lost due to sub-optimal fusion efficiency. So receive ${realAmountToAdd - lostQuantity} ${fuseToString}`,
                    'warning',
                    5000
                );
            }

            const finalAmountToAdd = Math.min(realAmountToAdd - lostQuantity, availableStorageFuseTo);
            setResourceDataObject(fuseToQuantity + finalAmountToAdd, 'resources', [fuseTo, 'quantity']);
            totalDeducted = amountToDeductFromResource;
        }
    }

    setResourceDataObject(resourceQuantity - totalDeducted, 'resources', [resource, 'quantity']);
}

export function sellResource(resource) {
    const resourceQuantity = getResourceDataObject('resources', [resource, 'quantity']);
    const saleData = getResourceSalePreview(resource);

    const currentCash = getResourceDataObject('currency', ['cash']);
    const extractedValue = saleData.split('>')[1].split('<')[0].trim();
    let cashRaised;

    if (getCurrencySymbol() === "€") {
        cashRaised = parseFloat(extractedValue.replace('€', '').replace(',', ''));
    } else {
        cashRaised = parseFloat(extractedValue.slice(1).replace(',', '')); // Remove the currency symbol and convert
    }
    const quantityToDeduct = parseInt(saleData.match(/\((\d+)/)[1], 10);

    if (getCurrencySymbol() === "€") {
        showNotification(
            `You sold ${quantityToDeduct} ${capitaliseString(resource)} for ${cashRaised}${getCurrencySymbol()}!`,
            'info'
        );
    } else {
        showNotification(
            `You sold ${quantityToDeduct} ${capitaliseString(resource)} for ${getCurrencySymbol()}${cashRaised}!`,
            'info'
        );
    }

    setResourceDataObject(resourceQuantity - quantityToDeduct, 'resources', [resource, 'quantity']);

    if (getResourceDataObject('resources', [resource, 'quantity']) < 1) {
        setResourceDataObject(0, 'resources', [resource, 'quantity']);
    }

    setResourceDataObject(currentCash + cashRaised, 'currency', ['cash']);
}

export function createCompound(compound) {
    const constituentPartsObject = getConstituentPartsObject();
    const existingCompoundQuantity = getResourceDataObject('compounds', [compound, 'quantity']);
    const compoundMaxStorage = getResourceDataObject('compounds', [compound, 'storageCapacity']);

    let newQuantity = existingCompoundQuantity + constituentPartsObject.compoundToCreateQuantity;
    let exceededDifference = 0;

    if (newQuantity > compoundMaxStorage) {
        exceededDifference = newQuantity - compoundMaxStorage;
        newQuantity = compoundMaxStorage;
    }

    setResourceDataObject(newQuantity, 'compounds', [compound, 'quantity']);

    let notificationParts = [];

    for (let i = 1; i <= 4; i++) {
        const partNameKey = `constituentPartName${i}`;
        const partQuantityKey = `constituentPartQuantity${i}`;
        const partName = constituentPartsObject[partNameKey];
        const partQuantity = constituentPartsObject[partQuantityKey];

        if (partName && partQuantity > 0) {
            let type;

            if (getResourceDataObject('resources')[partName]) {
                type = 'resources';
            } 
            else if (getResourceDataObject('compounds')[partName]) {
                type = 'compounds';
            } 
            else {
                type = 'error';
            }

            setResourceDataObject(
                getResourceDataObject(type, [partName, 'quantity']) - partQuantity,
                type, 
                [partName, 'quantity']
            );

            notificationParts.push(`${partQuantity} ${capitaliseString(partName)}`);
        }
    }

    const compoundCreatedQuantity = constituentPartsObject.compoundToCreateQuantity;
    const compoundCreatedName = capitaliseString(compound);

    if (exceededDifference > 0) {
        showNotification(
            `You created ${compoundCreatedQuantity} ${compoundCreatedName} from ${notificationParts.join(', ')} but ${exceededDifference} ${compoundCreatedName} was wasted due to storage limit being exceeded.`,
            'warning'
        );
    } else {
        showNotification(
            `You created ${compoundCreatedQuantity} ${compoundCreatedName} from ${notificationParts.join(', ')}`,
            'info'
        );
    }
}

export function sellCompound(compound) {
    const resourceQuantity = getResourceDataObject('compounds', [compound, 'quantity']);
    const saleData = getCompoundSalePreview(compound);

    const currentCash = getResourceDataObject('currency', ['cash']);
    let extractedValue = saleData.split('>')[1].split('<')[0].trim();

    let cashRaised;

    if (getCurrencySymbol() === "€") {
        cashRaised = parseFloat(extractedValue.replace('€', '').replace(',', ''));
    } else {
        cashRaised = parseFloat(extractedValue.slice(1).replace(',', ''));
    }

    const quantityToDeduct = parseInt(saleData.match(/\((\d+)/)[1], 10);

    setResourceDataObject(resourceQuantity - quantityToDeduct, 'compounds', [compound, 'quantity']);

    if (getResourceDataObject('compounds', [compound, 'quantity']) < 1) {
        setResourceDataObject(0, 'compounds', [compound, 'quantity']);
    }

    setResourceDataObject(currentCash + cashRaised, 'currency', ['cash']);

    if (getCurrencySymbol() === "€") {
        showNotification(
            `You sold ${quantityToDeduct} ${capitaliseString(compound)} for ${cashRaised}${getCurrencySymbol()}!`,
            'info'
        );
    } else {
        showNotification(
            `You sold ${quantityToDeduct} ${capitaliseString(compound)} for ${getCurrencySymbol()}${cashRaised}!`,
            'info'
        );
    }
}

function updateAllCreatePreviews() {
    const currentScreen = getCurrentOptionPane();
    const compounds = getResourceDataObject('compounds');
   
    for (const compound in compounds) {   
        if (compound === currentScreen) {
            const dropDownElementId = compound + "CreateSelectQuantity";

            setCreateCompoundPreview(currentScreen, document.getElementById(dropDownElementId).value);
                  
            const createPreviewString = getCompoundCreatePreview(compound);
            let cleanedString = cleanString(createPreviewString);

            const createPreviewElementId = compounds[compound]?.createPreviewElement;
            const createPreviewElement = document.getElementById(createPreviewElementId);
    
            if (createPreviewElement) {
                createPreviewElement.innerHTML = cleanedString;
            }
        }
    }
}

function updateAllSalePricePreviews() {
    const currentScreen = getCurrentOptionPane();
    const resources = getResourceDataObject('resources');
    const compounds = getResourceDataObject('compounds');

    for (const resource in resources) {
        const fuseTo1 = resources[resource]?.['fuseTo1'];
        const fuseTo2 = resources[resource]?.['fuseTo2'];
    
        if (resource === currentScreen) {
            const dropDownElementId = resource + "SellSelectQuantity";

            setSaleResourcePreview(currentScreen, document.getElementById(dropDownElementId).value, fuseTo1, fuseTo2);
                  
            const salePreviewString = getResourceSalePreview(resource);
            let cleanedString = cleanString(salePreviewString);

            const salePreviewElementId = resources[resource]?.salePreviewElement;
            const salePreviewElement = document.getElementById(salePreviewElementId);
    
            if (salePreviewElement) {
                salePreviewElement.innerHTML = cleanedString;
            }
        }
    }
    
    for (const compound in compounds) {   
        if (compound === currentScreen) {
            const dropDownElementId = compound + "SellSelectQuantity";

            setSaleCompoundPreview(currentScreen, document.getElementById(dropDownElementId).value);
                  
            const salePreviewString = getCompoundSalePreview(compound);
            let cleanedString = cleanString(salePreviewString);

            const salePreviewElementId = compounds[compound]?.salePreviewElement;
            const salePreviewElement = document.getElementById(salePreviewElementId);
    
            if (salePreviewElement) {
                salePreviewElement.innerHTML = cleanedString;
            }
        }
    }
}

function cleanString(string) {
    if (string.includes("NaN") || string.includes(", 0 )")) { //clean string
        return string.split(",")[0] + ")";
    } else if (string.includes(', 0 !)')) {
        return string.split(",")[0] + "!)";
    } else if (string.includes(', 0 !!)')) {
        return string.split(",")[0] + "!!)";
    } else if (string.includes(" ()")) {
        return string.replace(" ()", "");
    } else {
        return string;
    }
}

function checkAndIncreasePrices() {
    const priceIncreaseObject = getItemsToIncreasePrice();

    for (const key in priceIncreaseObject) {
        if (key === "") {
            delete priceIncreaseObject[key];
        }
    }

    for (const priceIncrease in priceIncreaseObject) {
        if (priceIncreaseObject.hasOwnProperty(priceIncrease)) {

            if (getCanAffordDeferred()) {
                const { currentPrice, setPriceTarget, typeOfResourceCompound } = priceIncreaseObject[priceIncrease];
                if (setPriceTarget.startsWith('science')) {
                    setNewItemPrice(currentPrice, setPriceTarget, null, null, null);
                } else if (setPriceTarget.startsWith('power') || setPriceTarget.startsWith('battery') || setPriceTarget.startsWith('rocket')) { //add new building types if needed will have a bug here if add any more it will go to the else block
                    if (priceIncrease === "cash") {
                        setNewItemPrice(currentPrice, setPriceTarget, null, null, priceIncrease);
                    } else {
                        setNewItemPrice(currentPrice, setPriceTarget, null, null, priceIncreaseObject);
                    }
                } else {
                    const tierMatch = setPriceTarget.match(new RegExp(`${priceIncrease}AB(\\d+)Price`));
                    if (tierMatch && tierMatch[1]) {
                        const tier = parseInt(tierMatch[1], 10);
                        setNewItemPrice(currentPrice, setPriceTarget, tier, typeOfResourceCompound, null);
                    }
                }
            }
        }
    }

    setItemsToIncreasePrice('clear');
}

function setNewItemPrice(currentPrice, elementName, tier, typeOfResourceCompound, optionalResource) {
    let resource1Price = 0;
    let resource2Price = 0;
    let resource3Price = 0;

    let resource1Name = '';
    let resource2Name = '';
    let resource3Name = '';

    let resource1Category = '';
    let resource2Category = '';
    let resource3Category = '';

    if (elementName) {
        const newCurrencyPrice = Math.ceil(currentPrice * 1.15);

        if (optionalResource && optionalResource !== 'cash') {
            for (const item in optionalResource) {
                if (optionalResource.hasOwnProperty(item) && item !== 'cash') {
                    const resource = optionalResource[item];
                    const resourceOrder = resource.resourceOrder;
    
                    if (resourceOrder === 'resource1Price') {
                        resource1Price = resource.currentPrice;
                        resource1Name = item;
                        resource1Category = resource.typeOfResourceCompound;
                    } else if (resourceOrder === 'resource2Price') {
                        resource2Price = resource.currentPrice;;
                        resource2Name = item;
                        resource2Category = resource.typeOfResourceCompound;
                    } else if (resourceOrder === 'resource3Price') {
                        resource3Price = resource.currentPrice;;
                        resource3Name = item;
                        resource3Category = resource.typeOfResourceCompound;
                    }
                }
            }
        }

        let newResource1Price = resource1Price > 0 ? Math.ceil(resource1Price * 1.15) : 0;
        let newResource2Price = resource2Price > 0 ? Math.ceil(resource2Price * 1.15) : 0;
        let newResource3Price = resource3Price > 0 ? Math.ceil(resource3Price * 1.15) : 0;

        if (newResource1Price > 0) {
            newResource1Price = [newResource1Price, resource1Name, resource1Category];
        }

        if (newResource2Price > 0) {
            newResource2Price = [newResource2Price, resource2Name, resource2Category];
        }

        if (newResource3Price > 0) {
            newResource3Price = [newResource3Price, resource3Name, resource3Category];
        }
        

        if (elementName.startsWith('science')) {
            const strippedElementName = elementName.slice(0, -5);        
            setResourceDataObject(newCurrencyPrice, 'research', ['upgrades', strippedElementName, 'price']);
        } else if (elementName.startsWith('power') || elementName.startsWith('battery')) {
            const strippedElementName = elementName.slice(0, -5);
            if (optionalResource === 'cash') {
                setResourceDataObject(newCurrencyPrice, 'buildings', ['energy', 'upgrades', strippedElementName, 'price']);
            }        
            if (resource1Price > 0) {
                setResourceDataObject(newResource1Price, 'buildings', ['energy', 'upgrades', strippedElementName, 'resource1Price']);
            }
            if (resource2Price > 0) {
                setResourceDataObject(newResource2Price, 'buildings', ['energy', 'upgrades', strippedElementName, 'resource2Price']);
            }
            if (resource3Price > 0) {
                setResourceDataObject(newResource3Price, 'buildings', ['energy', 'upgrades', strippedElementName, 'resource3Price']);
            }
        } else if (elementName.startsWith('rocket')) {
            const strippedElementName = elementName.slice(0, -5);
            if (optionalResource === 'cash') {
                setResourceDataObject(newCurrencyPrice, 'space', ['upgrades', strippedElementName, 'price']);
            }        
            if (resource1Price > 0) {
                setResourceDataObject(newResource1Price, 'space', ['upgrades', strippedElementName, 'resource1Price']);
            }
            if (resource2Price > 0) {
                setResourceDataObject(newResource2Price, 'space', ['upgrades', strippedElementName, 'resource2Price']);
            }
            if (resource3Price > 0) {
                setResourceDataObject(newResource3Price, 'space', ['upgrades', strippedElementName, 'resource3Price']);
            }
        } else { //autoBuyer
            const itemName = elementName.replace(/([A-Z])/g, '-$1').toLowerCase().split('-')[0];
            setResourceDataObject(newCurrencyPrice, typeOfResourceCompound, [itemName, 'upgrades', 'autoBuyer', `tier${tier}`, 'price']);       
        }
    }
}

function checkAndDeductResources() {
    const deductObject = getItemsToDeduct();
    let deductAmount;
    let mainKey;

    for (const itemToDeductType in deductObject) {
        if (itemToDeductType === "" || itemToDeductType.includes(',')) {
            delete deductObject[itemToDeductType];
        }
    }

    for (const itemToDeductType in deductObject) {
        if (deductObject.hasOwnProperty(itemToDeductType)) {
            let currentQuantity;
            deductAmount = deductObject[itemToDeductType].deductQuantity;
            const typeOfResourceCompound = deductObject[itemToDeductType].typeOfResourceCompound;

            if (itemToDeductType === 'cash') {
                mainKey = 'currency';
                currentQuantity = getResourceDataObject(mainKey, [itemToDeductType]);
                if (deductAmount >  currentQuantity) {
                    setCanAffordDeferred(false);
                } else {
                    setResourceDataObject(currentQuantity - deductAmount, mainKey, [itemToDeductType]);
                    setCanAffordDeferred(true);
                }
            } else if (itemToDeductType === 'research') {
                mainKey = 'research';
                currentQuantity = getResourceDataObject(mainKey, ['quantity']);
                if (deductAmount >  currentQuantity) {
                    setCanAffordDeferred(false);
                } else {
                    setResourceDataObject(currentQuantity - deductAmount, mainKey, ['quantity']);
                    setCanAffordDeferred(true);
                }
            } else {
                mainKey = typeOfResourceCompound;
                currentQuantity = getResourceDataObject(mainKey, [itemToDeductType, 'quantity']);
                if (deductAmount >  currentQuantity) {
                    setCanAffordDeferred(false);
                } else {
                    setResourceDataObject(currentQuantity - deductAmount, mainKey, [itemToDeductType, 'quantity']);
                    setCanAffordDeferred(true);
                } 
            }
        }
    }

    setItemsToDeduct('clear');
}

function getAllQuantities() {
    const resourceKeys = Object.keys(getResourceDataObject('resources'));
    const compoundKeys = Object.keys(getResourceDataObject('compounds'));
    const rockets = Object.keys(getResourceDataObject('space', ['upgrades'])).filter(part => part !== 'launchPad');

    const allQuantities = {};

    resourceKeys.forEach(resource => {
        const resourceName = resource;
        allQuantities[resourceName] = getResourceDataObject('resources', [resourceName, 'quantity']);
        allQuantities[`${resourceName}AB1Quantity`] = getResourceDataObject('resources', [resourceName, 'upgrades', 'autoBuyer', 'tier1', 'quantity']);
        allQuantities[`${resourceName}AB2Quantity`] = getResourceDataObject('resources', [resourceName, 'upgrades', 'autoBuyer', 'tier2', 'quantity']);
        allQuantities[`${resourceName}AB3Quantity`] = getResourceDataObject('resources', [resourceName, 'upgrades', 'autoBuyer', 'tier3', 'quantity']);
        allQuantities[`${resourceName}AB4Quantity`] = getResourceDataObject('resources', [resourceName, 'upgrades', 'autoBuyer', 'tier4', 'quantity']);
    });

    compoundKeys.forEach(compound => {
        const compoundName = compound;
        allQuantities[compoundName] = getResourceDataObject('compounds', [compoundName, 'quantity']);
        allQuantities[`${compoundName}AB1Quantity`] = getResourceDataObject('compounds', [compoundName, 'upgrades', 'autoBuyer', 'tier1', 'quantity']);
        allQuantities[`${compoundName}AB2Quantity`] = getResourceDataObject('compounds', [compoundName, 'upgrades', 'autoBuyer', 'tier2', 'quantity']);
        allQuantities[`${compoundName}AB3Quantity`] = getResourceDataObject('compounds', [compoundName, 'upgrades', 'autoBuyer', 'tier3', 'quantity']);
        allQuantities[`${compoundName}AB4Quantity`] = getResourceDataObject('compounds', [compoundName, 'upgrades', 'autoBuyer', 'tier4', 'quantity']);
    });

    if (getCurrentOptionPane() === 'space mining') {
        rockets.forEach(rocket => {
            allQuantities[rocket] = getResourceDataObject('space', ['upgrades', rocket, 'builtParts']);
        })
    }

    allQuantities.energy = getResourceDataObject('buildings', ['energy', 'quantity']);
    allQuantities.battery1 = getResourceDataObject('buildings', ['energy', 'upgrades', 'battery1', 'quantity']);
    allQuantities.battery2 = getResourceDataObject('buildings', ['energy', 'upgrades', 'battery2', 'quantity']);
    allQuantities.battery3 = getResourceDataObject('buildings', ['energy', 'upgrades', 'battery3', 'quantity']);
    allQuantities.powerPlant1 = getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant1', 'quantity']);
    allQuantities.powerPlant2 = getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant2', 'quantity']);
    allQuantities.powerPlant3 = getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant3', 'quantity']);

    allQuantities.launchPad = null;

    allQuantities.research = getResourceDataObject('research', ['quantity']);
    allQuantities.scienceKit = getResourceDataObject('research', ['upgrades', 'scienceKit', 'quantity']);
    allQuantities.scienceClub = getResourceDataObject('research', ['upgrades', 'scienceClub', 'quantity']);
    allQuantities.scienceLab = getResourceDataObject('research', ['upgrades', 'scienceLab', 'quantity']);

    return allQuantities;
}

function getAllStorages() {
    const resourceKeys = Object.keys(getResourceDataObject('resources'));
    const compoundKeys = Object.keys(getResourceDataObject('compounds'));

    const allStorages = {};

    resourceKeys.forEach(resource => {
        const resourceName = resource;
        allStorages[resourceName] = getResourceDataObject('resources', [resourceName, 'storageCapacity']);
    });

    compoundKeys.forEach(compound => {
        const compoundName = compound;
        allStorages[compoundName] = getResourceDataObject('compounds', [compoundName, 'storageCapacity']);
    });

    allStorages.energy = getResourceDataObject('buildings', ['energy', 'storageCapacity']);
    allStorages.battery1 = null;
    allStorages.battery2 = null;
    allStorages.battery3 = null;
    allStorages.powerPlant1 = null;
    allStorages.powerPlant2 = null;
    allStorages.powerPlant3 = null;

    allStorages.launchPad = null;

    allStorages.research = null;
    allStorages.scienceKit = null;
    allStorages.scienceClub = null;
    allStorages.scienceLab = null;

    return allStorages;
}

function getAllElements(resourcesArray, compoundsArray) {
    const resourceNames = [];
    const compoundNames = [];

    const allElements = {};

    resourcesArray.forEach(resource => {
        if (!resourceNames.includes(resource[0])) {
            resourceNames.push(resource[0]);
            allElements[resource[0]] = getElements()[`${resource[0]}Quantity`];
            allElements[`${resource[0]}AB1Quantity`] = document.getElementById(`${resource[0]}AB1Quantity`);
            allElements[`${resource[0]}AB2Quantity`] = document.getElementById(`${resource[0]}AB2Quantity`);
            allElements[`${resource[0]}AB3Quantity`] = document.getElementById(`${resource[0]}AB3Quantity`);
            allElements[`${resource[0]}AB4Quantity`] = document.getElementById(`${resource[0]}AB4Quantity`);
        }
    });

    compoundsArray.forEach(compound => {
        if (!compoundNames.includes(compound[0])) {
            compoundNames.push(compound[0]);
            allElements[compound[0]] = getElements()[`${compound[0]}Quantity`];
            allElements[`${compound[0]}AB1Quantity`] = document.getElementById(`${compound[0]}AB1Quantity`);
            allElements[`${compound[0]}AB2Quantity`] = document.getElementById(`${compound[0]}AB2Quantity`);
            allElements[`${compound[0]}AB3Quantity`] = document.getElementById(`${compound[0]}AB3Quantity`);
            allElements[`${compound[0]}AB4Quantity`] = document.getElementById(`${compound[0]}AB4Quantity`);
        }
    });

    allElements.energy = getElements().energyQuantity;
    allElements.battery1 = getElements().battery1Quantity;
    allElements.battery2 = getElements().battery2Quantity;
    allElements.battery3 = getElements().battery3Quantity;
    allElements.powerPlant1 = getElements().powerPlant1Quantity;
    allElements.powerPlant2 = getElements().powerPlant2Quantity;
    allElements.powerPlant3 = getElements().powerPlant3Quantity;

    allElements.launchPad = null;

    if (getCurrentOptionPane() === 'space mining') {
        allElements.rocket1BuiltParts = document.getElementById('rocket1BuiltPartsQuantity');
        allElements.rocket1TotalParts = document.getElementById('rocket1TotalPartsQuantity');
    
        allElements.rocket2BuiltParts = document.getElementById('rocket2BuiltPartsQuantity');
        allElements.rocket2TotalParts = document.getElementById('rocket2TotalPartsQuantity');
    
        allElements.rocket3BuiltParts = document.getElementById('rocket3BuiltPartsQuantity');
        allElements.rocket3TotalParts = document.getElementById('rocket3TotalPartsQuantity');
    
        allElements.rocket4BuiltParts = document.getElementById('rocket4BuiltPartsQuantity');
        allElements.rocket4TotalParts = document.getElementById('rocket4TotalPartsQuantity');
    } else {
        allElements.rocket1BuiltParts = null;
        allElements.rocket1TotalParts = null;
    
        allElements.rocket2BuiltParts = null;
        allElements.rocket2TotalParts = null;
    
        allElements.rocket3BuiltParts = null;
        allElements.rocket3TotalParts = null;
    
        allElements.rocket4BuiltParts = null;
        allElements.rocket4TotalParts = null;
    }    

    allElements.research = getElements().researchQuantity;
    allElements.scienceKit = getElements().scienceKitQuantity;
    allElements.scienceClub = getElements().scienceClubQuantity;
    allElements.scienceLab = getElements().scienceLabQuantity;

    return allElements;
}

function getAllDynamicDescriptionElements(resourceTierPairs, compoundTierPairs) {
    const elements = {};

    resourceTierPairs.forEach(([resourceName, tier]) => {
        const resourceIncreaseStorageDescElement = document.getElementById(`${resourceName}IncreaseContainerSizeDescription`);
        const resourceStoragePrice = getResourceDataObject('resources', [resourceName, 'storageCapacity'] - 1); //to allow power to stay on we leave 1 if upgrading storage

        const resourceAutoBuyerDescElement = document.getElementById(`${resourceName}AutoBuyerTier${tier}Description`);
        const resourceAutoBuyerPrice = getResourceDataObject('resources', [resourceName, 'upgrades', 'autoBuyer', `tier${tier}`, 'price']);

        elements[`${resourceName}IncreaseStorage`] = { element: resourceIncreaseStorageDescElement, price: resourceStoragePrice, string1: `${capitaliseString(resourceName)}` };
        elements[`${resourceName}AutoBuyerTier${tier}`] = { element: resourceAutoBuyerDescElement, price: resourceAutoBuyerPrice, string1: `${capitaliseString(resourceName)}` };
    });

    compoundTierPairs.forEach(([compoundName, tier]) => {
        const compoundIncreaseStorageDescElement = document.getElementById(`${compoundName}IncreaseContainerSizeDescription`);
        const compoundStoragePrice = getResourceDataObject('compounds', [compoundName, 'storageCapacity'] - 1); //to allow power to stay on we leave 1 if upgrading storage

        const resourceAutoBuyerDescElement = document.getElementById(`${compoundName}AutoBuyerTier${tier}Description`);
        const resourceAutoBuyerPrice = getResourceDataObject('compounds', [compoundName, 'upgrades', 'autoBuyer', `tier${tier}`, 'price']);

        elements[`${compoundName}IncreaseStorage`] = { element: compoundIncreaseStorageDescElement, price: compoundStoragePrice, string1: `${capitaliseString(compoundName)}` };
        elements[`${compoundName}AutoBuyerTier${tier}`] = { element: resourceAutoBuyerDescElement, price: resourceAutoBuyerPrice, string1: `${capitaliseString(compoundName)}` };
    });

    const scienceElements = getScienceResourceDescriptionElements();
    const buildingsElements = getBuildingResourceDescriptionElements();
    const spaceMiningElements = getSpaceMiningResourceDescriptionElements();

    Object.assign(elements, scienceElements, buildingsElements, spaceMiningElements);

    return elements;
}

function getScienceResourceDescriptionElements() {
    const scienceKitBuyDescElement = document.getElementById('scienceKitDescription');
    const scienceKitBuyPrice = getResourceDataObject('research', ['upgrades', 'scienceKit', 'price']);
    const scienceKitBuyResource1Price = getResourceDataObject('research', ['upgrades', 'scienceKit', 'resource1Price'])[0];
    const scienceKitBuyResource2Price = getResourceDataObject('research', ['upgrades', 'scienceKit', 'resource2Price'])[0];
    const scienceKitBuyResource3Price = getResourceDataObject('research', ['upgrades', 'scienceKit', 'resource3Price'])[0];

    const scienceClubBuyDescElement = document.getElementById('openScienceClubDescription');
    const scienceClubBuyPrice = getResourceDataObject('research', ['upgrades', 'scienceClub', 'price']);
    const scienceClubBuyResource1Price = getResourceDataObject('research', ['upgrades', 'scienceClub', 'resource1Price'])[0];
    const scienceClubBuyResource2Price = getResourceDataObject('research', ['upgrades', 'scienceClub', 'resource2Price'])[0];
    const scienceClubBuyResource3Price = getResourceDataObject('research', ['upgrades', 'scienceClub', 'resource3Price'])[0];

    const scienceLabBuyDescElement = document.getElementById('openScienceLabDescription');
    const scienceLabBuyPrice = getResourceDataObject('research', ['upgrades', 'scienceLab', 'price']);
    const scienceLabBuyResource1Price = getResourceDataObject('research', ['upgrades', 'scienceLab', 'resource1Price'])[0];
    const scienceLabBuyResource2Price = getResourceDataObject('research', ['upgrades', 'scienceLab', 'resource2Price'])[0];
    const scienceLabBuyResource3Price = getResourceDataObject('research', ['upgrades', 'scienceLab', 'resource3Price'])[0];

    return {
        scienceKitBuy: { 
            element: scienceKitBuyDescElement, 
            price: scienceKitBuyPrice, 
            resource1Price: scienceKitBuyResource1Price, 
            resource2Price: scienceKitBuyResource2Price, 
            resource3Price: scienceKitBuyResource3Price, 
            string1: getCurrencySymbol(),
            string2: capitaliseString(getResourceDataObject('research', ['upgrades', 'scienceKit', 'resource1Price'])[1]),
            string3: capitaliseString(getResourceDataObject('research', ['upgrades', 'scienceKit', 'resource2Price'])[1]),
            string4: capitaliseString(getResourceDataObject('research', ['upgrades', 'scienceKit', 'resource3Price'])[1])
        },
        scienceClubBuy: { 
            element: scienceClubBuyDescElement, 
            price: scienceClubBuyPrice, 
            resource1Price: scienceClubBuyResource1Price, 
            resource2Price: scienceClubBuyResource2Price, 
            resource3Price: scienceClubBuyResource3Price, 
            string1: getCurrencySymbol(),
            string2: capitaliseString(getResourceDataObject('research', ['upgrades', 'scienceClub', 'resource1Price'])[1]),
            string3: capitaliseString(getResourceDataObject('research', ['upgrades', 'scienceClub', 'resource2Price'])[1]),
            string4: capitaliseString(getResourceDataObject('research', ['upgrades', 'scienceClub', 'resource3Price'])[1])
        },
        scienceLabBuy: { 
            element: scienceLabBuyDescElement, 
            price: scienceLabBuyPrice, 
            resource1Price: scienceLabBuyResource1Price, 
            resource2Price: scienceLabBuyResource2Price, 
            resource3Price: scienceLabBuyResource3Price, 
            string1: getCurrencySymbol(),
            string2: capitaliseString(getResourceDataObject('research', ['upgrades', 'scienceLab', 'resource1Price'])[1]),
            string3: capitaliseString(getResourceDataObject('research', ['upgrades', 'scienceLab', 'resource2Price'])[1]),
            string4: capitaliseString(getResourceDataObject('research', ['upgrades', 'scienceLab', 'resource3Price'])[1])
        }
    };
}

function getBuildingResourceDescriptionElements() {
    const battery1BuyDescElement = document.getElementById('sodiumIonBatteryDescription');
    const battery1BuyPrice = getResourceDataObject('buildings', ['energy', 'upgrades', 'battery1', 'price']);
    const battery1BuyResource1Price = getResourceDataObject('buildings', ['energy', 'upgrades', 'battery1', 'resource1Price'])[0];
    const battery1BuyResource2Price = getResourceDataObject('buildings', ['energy', 'upgrades', 'battery1', 'resource2Price'])[0];
    const battery1BuyResource3Price = getResourceDataObject('buildings', ['energy', 'upgrades', 'battery1', 'resource3Price'])[0];

    const battery2BuyDescElement = document.getElementById('battery2Description');
    const battery2BuyPrice = getResourceDataObject('buildings', ['energy', 'upgrades', 'battery2', 'price']);
    const battery2BuyResource1Price = getResourceDataObject('buildings', ['energy', 'upgrades', 'battery2', 'resource1Price'])[0];
    const battery2BuyResource2Price = getResourceDataObject('buildings', ['energy', 'upgrades', 'battery2', 'resource2Price'])[0];
    const battery2BuyResource3Price = getResourceDataObject('buildings', ['energy', 'upgrades', 'battery2', 'resource3Price'])[0];

    const battery3BuyDescElement = document.getElementById('battery3Description');
    const battery3BuyPrice = getResourceDataObject('buildings', ['energy', 'upgrades', 'battery3', 'price']);
    const battery3BuyResource1Price = getResourceDataObject('buildings', ['energy', 'upgrades', 'battery3', 'resource1Price'])[0];
    const battery3BuyResource2Price = getResourceDataObject('buildings', ['energy', 'upgrades', 'battery3', 'resource2Price'])[0];
    const battery3BuyResource3Price = getResourceDataObject('buildings', ['energy', 'upgrades', 'battery3', 'resource3Price'])[0];

    const powerPlant1BuyDescElement = document.getElementById('powerPlantDescription');
    const powerPlant1BuyPrice = getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant1', 'price']);
    const powerPlant1BuyResource1Price = getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant1', 'resource1Price'])[0];
    const powerPlant1BuyResource2Price = getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant1', 'resource2Price'])[0];
    const powerPlant1BuyResource3Price = getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant1', 'resource3Price'])[0];

    const powerPlant2BuyDescElement = document.getElementById('solarPowerPlantDescription');
    const powerPlant2BuyPrice = getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant2', 'price']);
    const powerPlant2BuyResource1Price = getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant2', 'resource1Price'])[0];
    const powerPlant2BuyResource2Price = getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant2', 'resource2Price'])[0];
    const powerPlant2BuyResource3Price = getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant2', 'resource3Price'])[0];

    const powerPlant3BuyDescElement = document.getElementById('advancedPowerPlantDescription');
    const powerPlant3BuyPrice = getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant3', 'price']);
    const powerPlant3BuyResource1Price = getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant3', 'resource1Price'])[0];
    const powerPlant3BuyResource2Price = getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant3', 'resource2Price'])[0];
    const powerPlant3BuyResource3Price = getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant3', 'resource3Price'])[0];


    return {
        battery1Buy: { 
            element: battery1BuyDescElement, 
            price: battery1BuyPrice, 
            resource1Price: battery1BuyResource1Price, 
            resource2Price: battery1BuyResource2Price, 
            resource3Price: battery1BuyResource3Price, 
            string1: getCurrencySymbol(),
            string2: capitaliseString(getResourceDataObject('buildings', ['energy', 'upgrades', 'battery1', 'resource1Price'])[1]), 
            string3: capitaliseString(getResourceDataObject('buildings', ['energy', 'upgrades', 'battery1', 'resource2Price'])[1]), 
            string4: capitaliseString(getResourceDataObject('buildings', ['energy', 'upgrades', 'battery1', 'resource3Price'])[1]) 
        },
        battery2Buy: { 
            element: battery2BuyDescElement, 
            price: battery2BuyPrice, 
            resource1Price: battery2BuyResource1Price, 
            resource2Price: battery2BuyResource2Price, 
            resource3Price: battery2BuyResource3Price, 
            string1: getCurrencySymbol(),
            string2: capitaliseString(getResourceDataObject('buildings', ['energy', 'upgrades', 'battery2', 'resource1Price'])[1]), 
            string3: capitaliseString(getResourceDataObject('buildings', ['energy', 'upgrades', 'battery2', 'resource2Price'])[1]), 
            string4: capitaliseString(getResourceDataObject('buildings', ['energy', 'upgrades', 'battery2', 'resource3Price'])[1]) 
        },
        battery3Buy: { 
            element: battery3BuyDescElement, 
            price: battery3BuyPrice, 
            resource1Price: battery3BuyResource1Price, 
            resource2Price: battery3BuyResource2Price, 
            resource3Price: battery3BuyResource3Price, 
            string1: getCurrencySymbol(),
            string2: capitaliseString(getResourceDataObject('buildings', ['energy', 'upgrades', 'battery3', 'resource1Price'])[1]), 
            string3: capitaliseString(getResourceDataObject('buildings', ['energy', 'upgrades', 'battery3', 'resource2Price'])[1]), 
            string4: capitaliseString(getResourceDataObject('buildings', ['energy', 'upgrades', 'battery3', 'resource3Price'])[1]) 
        },
        powerPlant1Buy: { 
            element: powerPlant1BuyDescElement, 
            price: powerPlant1BuyPrice, 
            resource1Price: powerPlant1BuyResource1Price, 
            resource2Price: powerPlant1BuyResource2Price, 
            resource3Price: powerPlant1BuyResource3Price, 
            string1: getCurrencySymbol(),
            string2: capitaliseString(getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant1', 'resource1Price'])[1]), 
            string3: capitaliseString(getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant1', 'resource2Price'])[1]), 
            string4: capitaliseString(getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant1', 'resource3Price'])[1]) 
        },
        powerPlant2Buy: { 
            element: powerPlant2BuyDescElement, 
            price: powerPlant2BuyPrice, 
            resource1Price: powerPlant2BuyResource1Price, 
            resource2Price: powerPlant2BuyResource2Price, 
            resource3Price: powerPlant2BuyResource3Price, 
            string1: getCurrencySymbol(),
            string2: capitaliseString(getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant2', 'resource1Price'])[1]), 
            string3: capitaliseString(getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant2', 'resource2Price'])[1]), 
            string4: capitaliseString(getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant2', 'resource3Price'])[1]) 
        },
        powerPlant3Buy: { 
            element: powerPlant3BuyDescElement, 
            price: powerPlant3BuyPrice, 
            resource1Price: powerPlant3BuyResource1Price, 
            resource2Price: powerPlant3BuyResource2Price, 
            resource3Price: powerPlant3BuyResource3Price, 
            string1: getCurrencySymbol(),
            string2: capitaliseString(getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant3', 'resource1Price'])[1]), 
            string3: capitaliseString(getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant3', 'resource2Price'])[1]), 
            string4: capitaliseString(getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant3', 'resource3Price'])[1])  
        }        
    };
}

function getSpaceMiningResourceDescriptionElements() {
    const launchPadBuyDescElement = document.getElementById('launchPadDescription');
    const launchPadBuyPrice = getResourceDataObject('space', ['upgrades', 'launchPad', 'price']);
    const launchPadBuyResource1Price = getResourceDataObject('space', ['upgrades', 'launchPad', 'resource1Price'])[0];
    const launchPadBuyResource2Price = getResourceDataObject('space', ['upgrades', 'launchPad', 'resource2Price'])[0];
    const launchPadBuyResource3Price = getResourceDataObject('space', ['upgrades', 'launchPad', 'resource3Price'])[0];

    const rocket1BuyDescElement = document.getElementById('rocketMiner1Description');
    const rocket1BuyPrice = getResourceDataObject('space', ['upgrades', 'rocket1', 'price']);
    const rocket1BuyResource1Price = getResourceDataObject('space', ['upgrades', 'rocket1', 'resource1Price'])[0];
    const rocket1BuyResource2Price = getResourceDataObject('space', ['upgrades', 'rocket1', 'resource2Price'])[0];
    const rocket1BuyResource3Price = getResourceDataObject('space', ['upgrades', 'rocket1', 'resource3Price'])[0];

    const rocket2BuyDescElement = document.getElementById('rocketMiner2Description');
    const rocket2BuyPrice = getResourceDataObject('space', ['upgrades', 'rocket2', 'price']);
    const rocket2BuyResource1Price = getResourceDataObject('space', ['upgrades', 'rocket2', 'resource1Price'])[0];
    const rocket2BuyResource2Price = getResourceDataObject('space', ['upgrades', 'rocket2', 'resource2Price'])[0];
    const rocket2BuyResource3Price = getResourceDataObject('space', ['upgrades', 'rocket2', 'resource3Price'])[0];

    const rocket3BuyDescElement = document.getElementById('rocketMiner3Description');
    const rocket3BuyPrice = getResourceDataObject('space', ['upgrades', 'rocket3', 'price']);
    const rocket3BuyResource1Price = getResourceDataObject('space', ['upgrades', 'rocket3', 'resource1Price'])[0];
    const rocket3BuyResource2Price = getResourceDataObject('space', ['upgrades', 'rocket3', 'resource2Price'])[0];
    const rocket3BuyResource3Price = getResourceDataObject('space', ['upgrades', 'rocket3', 'resource3Price'])[0];

    const rocket4BuyDescElement = document.getElementById('rocketMiner4Description');
    const rocket4BuyPrice = getResourceDataObject('space', ['upgrades', 'rocket4', 'price']);
    const rocket4BuyResource1Price = getResourceDataObject('space', ['upgrades', 'rocket4', 'resource1Price'])[0];
    const rocket4BuyResource2Price = getResourceDataObject('space', ['upgrades', 'rocket4', 'resource2Price'])[0];
    const rocket4BuyResource3Price = getResourceDataObject('space', ['upgrades', 'rocket4', 'resource3Price'])[0];

    return {
        launchPadBuy: { 
            element: launchPadBuyDescElement, 
            price: launchPadBuyPrice, 
            resource1Price: launchPadBuyResource1Price, 
            resource2Price: launchPadBuyResource2Price, 
            resource3Price: launchPadBuyResource3Price, 
            string1: getCurrencySymbol(),
            string2: capitaliseString(getResourceDataObject('space', ['upgrades', 'launchPad', 'resource1Price'])[1]), 
            string3: capitaliseString(getResourceDataObject('space', ['upgrades', 'launchPad', 'resource2Price'])[1]), 
            string4: capitaliseString(getResourceDataObject('space', ['upgrades', 'launchPad', 'resource3Price'])[1]) 
        },
        rocket1Buy: { 
            element: rocket1BuyDescElement,
            price: rocket1BuyPrice,
            resource1Price: rocket1BuyResource1Price,
            resource2Price: rocket1BuyResource2Price,
            resource3Price: rocket1BuyResource3Price,
            string1: getCurrencySymbol(),
            string2: capitaliseString(getResourceDataObject('space', ['upgrades', 'rocket1', 'resource1Price'])[1]),
            string3: capitaliseString(getResourceDataObject('space', ['upgrades', 'rocket1', 'resource2Price'])[1]),
            string4: capitaliseString(getResourceDataObject('space', ['upgrades', 'rocket1', 'resource3Price'])[1])
        },
        rocket2Buy: { 
            element: rocket2BuyDescElement,
            price: rocket2BuyPrice,
            resource1Price: rocket2BuyResource1Price,
            resource2Price: rocket2BuyResource2Price,
            resource3Price: rocket2BuyResource3Price,
            string1: getCurrencySymbol(),
            string2: capitaliseString(getResourceDataObject('space', ['upgrades', 'rocket2', 'resource1Price'])[1]),
            string3: capitaliseString(getResourceDataObject('space', ['upgrades', 'rocket2', 'resource2Price'])[1]),
            string4: capitaliseString(getResourceDataObject('space', ['upgrades', 'rocket2', 'resource3Price'])[1])
        },
        rocket3Buy: { 
            element: rocket3BuyDescElement,
            price: rocket3BuyPrice,
            resource1Price: rocket3BuyResource1Price,
            resource2Price: rocket3BuyResource2Price,
            resource3Price: rocket3BuyResource3Price,
            string1: getCurrencySymbol(),
            string2: capitaliseString(getResourceDataObject('space', ['upgrades', 'rocket3', 'resource1Price'])[1]),
            string3: capitaliseString(getResourceDataObject('space', ['upgrades', 'rocket3', 'resource2Price'])[1]),
            string4: capitaliseString(getResourceDataObject('space', ['upgrades', 'rocket3', 'resource3Price'])[1])
        },
        rocket4Buy: { 
            element: rocket4BuyDescElement,
            price: rocket4BuyPrice,
            resource1Price: rocket4BuyResource1Price,
            resource2Price: rocket4BuyResource2Price,
            resource3Price: rocket4BuyResource3Price,
            string1: getCurrencySymbol(),
            string2: capitaliseString(getResourceDataObject('space', ['upgrades', 'rocket4', 'resource1Price'])[1]),
            string3: capitaliseString(getResourceDataObject('space', ['upgrades', 'rocket4', 'resource2Price'])[1]),
            string4: capitaliseString(getResourceDataObject('space', ['upgrades', 'rocket4', 'resource3Price'])[1])
        }
    };    
}

function updateRates() {
    let currentActualResearchRate;

    if (getPowerOnOff()) {
        currentActualResearchRate = getResourceDataObject('research', ['rate']) * getTimerRateRatio();
    } else {
        currentActualResearchRate = (getResourceDataObject('research', ['rate']) - getResourceDataObject('research', ['ratePower'])) * getTimerRateRatio();
    }
    getElements().researchRate.textContent = Math.floor(currentActualResearchRate) + ' / s'; 
}

function updateUIQuantities(allQuantities, allStorages, allElements, allDescriptionElements) {
    for (const item in allQuantities) {
        if (allQuantities.hasOwnProperty(item)) {
            const quantity = allQuantities[item];
            const storage = allStorages[item];
            const element = allElements[item];

            updateQuantityDisplays(element, quantity, storage, null, null, null, false);
        }

        if (item.startsWith('science')) {
            const quantityScienceBuilding = allQuantities[item];
            const element = document.getElementById(`${item}Quantity`);
            if (element && quantityScienceBuilding) {
                element.textContent = `Quantity: ${quantityScienceBuilding}`;
            }
        }

        if (item.includes('AB')) {
            let tier;
            const quantityAutoBuyer = allQuantities[item];

            const match = item.match(/AB(\d+)/);
            if (match) {
                tier = parseInt(match[1], 10);
            } else {
                return null;
            }

            const element = document.getElementById(item);
            if (element) {
                element.textContent = `Quantity: ${quantityAutoBuyer}`;
            }
        }

        if (item.startsWith('rocket')) {
            const quantityRocketBuilding = allQuantities[item];
            if (quantityRocketBuilding || quantityRocketBuilding === 0) {
                const rocketPartsCountText = document.getElementById(`${item}PartsCountText`);
                rocketPartsCountText.innerHTML = `Built: <span id="${item}BuiltPartsQuantity">${quantityRocketBuilding}</span> / <span id="${item}TotalPartsQuantity">${getRocketPartsNeededInTotalPerRocket(item)}</span>`;
            }
        }
    }

    for (const allDescriptionElement in allDescriptionElements) {
        let resource1Price;
        let resource2Price;
        let resource3Price;

        if (allDescriptionElements.hasOwnProperty(allDescriptionElement)) { //adapt this to write the resources and price string correctly
            const price = allDescriptionElements[allDescriptionElement].price;

            if (allDescriptionElement.endsWith("Buy")) { //if cn cost cash or resources ie science or building
                resource1Price = allDescriptionElements[allDescriptionElement].resource1Price;
                resource2Price = allDescriptionElements[allDescriptionElement].resource2Price;
                resource3Price = allDescriptionElements[allDescriptionElement].resource3Price;
            }

            const costResourceOrCompoundName1 = allDescriptionElements[allDescriptionElement].string1;
            const costResourceOrCompoundName2 = allDescriptionElements[allDescriptionElement].string2;
            const costResourceOrCompoundName3 = allDescriptionElements[allDescriptionElement].string3;
            const costResourceOrCompoundName4 = allDescriptionElements[allDescriptionElement].string4;

            const element = allDescriptionElements[allDescriptionElement].element;

            const resourceData1 = [resource1Price, costResourceOrCompoundName2];
            const resourceData2 = [resource2Price, costResourceOrCompoundName3];
            const resourceData3 = [resource3Price, costResourceOrCompoundName4];

            updateQuantityDisplays(element, price, costResourceOrCompoundName1, resourceData1, resourceData2, resourceData3, true);
        } 
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

        //console.log(`Showing UI for Tab ${currentTab}.`);
    } else {
        //console.log(`No tab-specific UI to show for Tab ${currentTab}, but other tabs are hidden.`);
    }
}

function monitorRevealResourcesCheck() {
    let revealStatus;
    let resourceElementId;

    const resourceKeys = Object.keys(getResourceDataObject('resources'));

    for (const resource of resourceKeys) {
        revealStatus = getResourceDataObject('resources', [resource, 'revealedYet']);
        resourceElementId = resource + "Option";
        if (revealStatus) {
            document.getElementById(resourceElementId).parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.classList.remove('invisible');
            document.getElementById(resourceElementId).parentElement.parentElement.parentElement.parentElement.classList.remove('invisible');
            document.getElementById(resourceElementId).parentElement.parentElement.classList.remove('invisible');
        }
    }
}

function monitorRevealCompoundsCheck() {
    let revealTech;
    const compoundKeys = Object.keys(getResourceDataObject('compounds'));

    for (const compound of compoundKeys) {
        revealTech = getResourceDataObject('compounds', [compound, 'revealedBy']);
        const compoundElementId = compound + "Option";
        if (getTechUnlockedArray().includes(revealTech)) {
            document.getElementById(compoundElementId).parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.classList.remove('invisible');
            document.getElementById(compoundElementId).parentElement.parentElement.parentElement.parentElement.classList.remove('invisible');
            document.getElementById(compoundElementId).parentElement.parentElement.classList.remove('invisible');
        }
    }
}

function monitorTechTree() {
    const techs = getResourceDataObject('techs');
    
    Object.keys(techs).forEach(techKey => {
        if (!getTechUnlockedArray().includes(techKey)) {
            if (getResourceDataObject('research', ['quantity']) > techs[techKey].appearsAt[0] && !getRevealedTechArray().includes(techKey)) {
                setRevealedTechArray(techKey);
                if (getCurrentOptionPane() === 'tech tree') {
                    const tooltip = document.getElementById('techTreeTooltip');
                    if (tooltip) {
                        tooltip.remove();
                    }
                    getTechTreeData(true);
                    setTechTreeDrawnYet(true);
                }
            }
            if (getResourceDataObject('research', ['quantity']) > (techs[techKey].appearsAt[0] / 1.5) && !getUpcomingTechArray().includes(techKey)) {
                setUpcomingTechArray(techKey);
                if (getCurrentOptionPane() === 'tech tree') {
                    const tooltip = document.getElementById('techTreeTooltip');
                    if (tooltip) {
                        tooltip.remove();
                    }
                    getTechTreeData(true);
                    setTechTreeDrawnYet(true);
                }
            }
        }
    });
}

function monitorRevealRowsChecks(element) {
    if (element.classList.contains('invisible') && element.dataset.conditionCheck === 'techUnlock') { //reveal techs check
        if (getRevealedTechArray().includes(element.dataset.type)) {
            element.classList.remove('invisible');
            setTechRenderChange(true);
        } else if (!getRevealedTechArray().includes(element.dataset.type) && getResourceDataObject('research', ['quantity']) >= getResourceDataObject('techs', [element.dataset.type, 'appearsAt'])[0]) {
            element.classList.remove('invisible');
            setTechRenderChange(true);
        }
    } else if (element.dataset.conditionCheck === 'upgradeCheck' && element.dataset.type === 'autoBuyer') { //autobuyer reveal check
        const elementTier = parseInt(element.dataset.autoBuyerTier.slice(-1));
        if (getCurrentTab()[1] === 'Resources' && element.dataset.rowCategory === 'resource')  {
            if (elementTier > 0 ) {
                if (elementTier <= getAutoBuyerTierLevel(getCurrentOptionPane(), 'resources')) {
                    element.classList.remove('invisible');
                } else {
                    element.classList.add('invisible');
                }
            } else {
                element.classList.add('invisible');
            }
        } else if (getCurrentTab()[1] === 'Compounds' && element.dataset.rowCategory === 'compound')  {
            if (elementTier > 0 ) {
                if (elementTier <= getAutoBuyerTierLevel(getCurrentOptionPane(), 'compounds')) {
                    element.classList.remove('invisible');
                } else {
                    element.classList.add('invisible');
                }
            } else {
                element.classList.add('invisible');
            }
        }
    }
}

function checkStatusAndSetTextClasses(element) {
    if (element.classList.contains('fuel-check')) {
        if (element.tagName.toLowerCase() === 'button') {
            const buildingNameString = element.dataset.toggleTarget;
            const buildingQuantity = getResourceDataObject('buildings', ['energy', 'upgrades', buildingNameString, 'quantity']);

            const fuelType = getResourceDataObject('buildings', ['energy', 'upgrades', buildingNameString, 'fuel'])[0];
            const fuelCategory = getResourceDataObject('buildings', ['energy', 'upgrades', buildingNameString, 'fuel'])[2];
            const fuelQuantity = getResourceDataObject(fuelCategory, [fuelType, 'quantity']);

            const fuelTypeElement = document.getElementById(buildingNameString + 'FuelType');
            const fuelQuantityElement = document.getElementById(buildingNameString + 'FuelQuantity');

            if (buildingQuantity > 0) {
                element.classList.remove('invisible');
                fuelTypeElement.classList.remove('invisible');
                fuelQuantityElement.classList.remove('invisible');

                if (fuelQuantity <= 0) {
                    element.textContent = 'Activate';
                    element.classList.add('red-disabled-text');
                    fuelTypeElement.classList.add('red-disabled-text');
                    fuelQuantityElement.classList.add('red-disabled-text');
                    fuelTypeElement.classList.remove('green-ready-text');
                    fuelQuantityElement.classList.remove('green-ready-text');
                } else {
                    if (getBuildingTypeOnOff(buildingNameString)) {                
                        element.textContent = 'Deactivate';
                    }
                    element.classList.remove('red-disabled-text');
                    fuelTypeElement.classList.remove('red-disabled-text');
                    fuelQuantityElement.classList.remove('red-disabled-text');
                    fuelTypeElement.classList.add('green-ready-text');
                    fuelQuantityElement.classList.add('green-ready-text');
                }
                fuelQuantityElement.textContent = Math.floor(fuelQuantity);
            } 
        }
        return;
    }

    if (element.classList.contains('energy-check')) {

        const valueText = element.textContent;
        const match = valueText.match(/(-?\d+(\.\d+)?) KW \/ s/);
    
        if (match) {
            const number = parseFloat(match[1]);
            if (number < 0) {
                element.classList.add('red-disabled-text');
            } else {
                element.classList.remove('red-disabled-text');
            }
        }
        return;
    }

    if (element.classList.contains('powered-check')) {
        if (!getResourceDataObject('buildings', ['energy', 'batteryBoughtYet'])) {
            // No battery purchased yet
            if (getResourceDataObject('buildings', ['energy', 'rate']) > 0) {
                element.textContent = '• ON';
                element.classList.remove('red-disabled-text');
                element.classList.add('green-ready-text');
                element.classList.remove('warning-orange-text');
            } else if (getTrippedStatus()) { 
                element.textContent = '• TRIPPED';
                element.classList.add('warning-orange-text');
                element.classList.remove('green-ready-text');
                element.classList.remove('red-disabled-text');
            } else {
                element.textContent = '• OFF';
                element.classList.add('red-disabled-text');
                element.classList.remove('green-ready-text');
                element.classList.remove('warning-orange-text');
            }
        } else {
            // Battery is purchased
            if (getResourceDataObject('buildings', ['energy', 'quantity']) > 0.00001) {
                element.textContent = '• ON';
                element.classList.remove('red-disabled-text');
                element.classList.add('green-ready-text');
                element.classList.remove('warning-orange-text');
            } else if (getTrippedStatus()) {
                element.textContent = '• TRIPPED';
                element.classList.add('warning-orange-text');
                element.classList.remove('green-ready-text');
                element.classList.remove('red-disabled-text');
            } else {
                element.textContent = '• OFF';
                element.classList.remove('warning-orange-text');
                element.classList.add('red-disabled-text');
                element.classList.remove('green-ready-text');
            }
        }
        
        return;
    }

    if (element.classList.contains('compound-cost-sell-check') && element.dataset && element.dataset.conditionCheck !== 'undefined' && element.dataset.resourcePriceObject !== 'undefined') {
        let compound = element.dataset.type;
        let compound2;

        const type = element.dataset.type;

        if (compound === 'storage' || compound === 'autoBuyer') {
            compound = element.dataset.argumentCheckQuantity;
            compound2 = element.dataset.argumentCheckQuantity2;
        }

        const checkQuantityString = element.dataset.argumentCheckQuantity;
        const checkQuantityString2 = element.dataset.argumentCheckQuantity2;

        let quantity = getResourceDataObject('compounds', [checkQuantityString, 'quantity']);
        let quantity2;
        compound2 ? quantity2 = getResourceDataObject('compounds', [checkQuantityString2, 'quantity']) : -1;

        if (element.classList.contains('sell') || element.dataset.conditionCheck === 'sellCompound') { //sell
            if (quantity > 0) { 
                element.classList.remove('red-disabled-text');
            } else {
                element.classList.add('red-disabled-text');
            }

            return;
        }

        if (element.classList.contains('create') || element.dataset.conditionCheck === 'createCompound') { //sell           
            const createCompoundDescriptionString = document.getElementById('create' + capitaliseString(checkQuantityString) + 'Description').innerHTML;
            const accompanyingLabel = element.parentElement.nextElementSibling.querySelector('label');
            if (accompanyingLabel.textContent.startsWith('0')) {
                accompanyingLabel.classList.remove('warning-orange-text');
                accompanyingLabel.classList.add('red-disabled-text');
            } else {
                accompanyingLabel.classList.remove('red-disabled-text'); 
            }
            
            let constituentComponents = getConstituentComponents(createCompoundDescriptionString);      
            constituentComponents = unpackConstituentPartsObject(constituentComponents);
            setConstituentPartsObject(constituentComponents);

            let isDisabled = false;

            for (let i = 1; i <= 4; i++) {
                const nameKey = `constituentPartName${i}`;
                const quantityKey = `constituentPartQuantity${i}`;
                const requiredName = constituentComponents[nameKey];
                const requiredQuantity = constituentComponents[quantityKey];
        
                if (constituentComponents.compoundToCreateQuantity <= 0) {
                    isDisabled = true;
                    break;
                }

                if (!requiredName || requiredQuantity <= 0) continue;
        
                const currentQuantity = getResourceDataObject('resources', [requiredName, 'quantity']);
                if (currentQuantity < requiredQuantity) {
                    element.classList.remove('warning-orange-text');
                    element.classList.add('red-disabled-text');
                    setSellFuseCreateTextDescriptionClassesBasedOnButtonStates(element, 'create');
                    isDisabled = true;
                    break;
                }
            }
        
            if (!isDisabled) {
                if (createCompoundDescriptionString.includes('!')) {
                    element.classList.add('warning-orange-text');
                }
                if (!createCompoundDescriptionString.includes('!')) {
                    element.classList.remove('warning-orange-text');
                }
                if (getPowerOnOff()) {
                    element.classList.remove('red-disabled-text');
                } else {
                    element.classList.add('red-disabled-text');
                }
                setSellFuseCreateTextDescriptionClassesBasedOnButtonStates(element, 'create');
            }

            return;
        }

        let price;
        let price2;
        let mainKey;

        if (type === 'autoBuyer') {
            mainKey = 'compounds';
            const autoBuyerTier = element.dataset.autoBuyerTier;
            if (autoBuyerTier === 'tier0') return;
            price = getResourceDataObject(mainKey, [compound, 'upgrades', 'autoBuyer', autoBuyerTier, 'price']);
            price2 = 0;
        } else if (element.dataset.type === "storage") {
            mainKey = 'compounds' //storageCapacity
            price = getResourceDataObject(mainKey, [compound, 'storageCapacity']) - 1;
            if (element.tagName.toLowerCase() !== 'button') {
                price2 = compound2 ? Math.floor(getResourceDataObject(mainKey, [compound, 'storageCapacity']) * 0.3) : 0;
                const mainCompoundPriceText = `${price} ${getResourceDataObject(mainKey, [compound, 'nameResource'])}`;
                const secondaryCompoundPriceText = price2 > 0 ? `, ${price2} ${getResourceDataObject(mainKey, [compound2, 'nameResource'])}` : '';
            
                const mainCompoundSpan = document.createElement('span');
                mainCompoundSpan.id = 'mainCompoundPriceText';
                mainCompoundSpan.textContent = mainCompoundPriceText;
            
                const secondaryCompoundSpan = document.createElement('span');
                secondaryCompoundSpan.id = 'secondaryCompoundPriceText';
                secondaryCompoundSpan.textContent = secondaryCompoundPriceText;
            
                element.textContent = '';
                element.appendChild(mainCompoundSpan);
                element.appendChild(secondaryCompoundSpan);
            }
             else {
                price2 = 0;
            }
        }

        if (element.dataset.conditionCheck === 'upgradeCheck' && quantity >= price && quantity2 >= price2) { //reason for quantity2 being -1 higher up
            if (element.tagName.toLowerCase() !== 'button' && price2 > 0) {
                document.getElementById('mainCompoundPriceText').classList.add('green-ready-text');
                document.getElementById('secondaryCompoundPriceText').classList.add('green-ready-text');
                document.getElementById('mainCompoundPriceText').classList.remove('red-disabled-text');
                document.getElementById('secondaryCompoundPriceText').classList.remove('red-disabled-text');
            }
            element.classList.remove('red-disabled-text');
        } else {
            if (element.tagName.toLowerCase() !== 'button' && price2 > 0) {
                if (quantity < price) {
                    document.getElementById('mainCompoundPriceText').classList.add('red-disabled-text');
                    document.getElementById('mainCompoundPriceText').classList.remove('green-ready-text');
                    element.classList.add('red-disabled-text');
                } else {
                    document.getElementById('mainCompoundPriceText').classList.add('green-ready-text');
                }
                if (quantity2 < price2) {
                    document.getElementById('secondaryCompoundPriceText').classList.add('red-disabled-text');
                    document.getElementById('secondaryCompoundPriceText').classList.remove('green-ready-text'); 
                    element.classList.add('red-disabled-text');
                } else {
                    document.getElementById('secondaryCompoundPriceText').classList.add('green-ready-text');
                }
                if (quantity >= price && quantity2 >= price2) {
                    element.classList.remove('red-disabled-text');
                }
            } else if (element.tagName.toLowerCase() !== 'button') {
                if (quantity < price) {
                    element.classList.add('red-disabled-text');
                } else {
                    element.classList.remove('red-disabled-text');
                }
            } else { //buttons
                if (element.parentElement.parentElement.querySelector('.description-container').firstChild.classList.contains('red-disabled-text')) { //could cause problems with compound autobuyers if introduced, even when this is working as intended
                    element.classList.add('red-disabled-text');
                } else {
                    element.classList.remove('red-disabled-text');
                }
            }
        }

        if (getElements()[compound + 'Rate'].textContent.includes('-')) {
            getElements()[compound + 'Rate'].classList.add('red-disabled-text');
        } else {
            getElements()[compound + 'Rate'].classList.remove('red-disabled-text');
        }
    }

    if (element.classList.contains('resource-cost-sell-check') && element.dataset && element.dataset.conditionCheck !== 'undefined' && element.dataset.resourcePriceObject !== 'undefined') { //will need to add price2 and quantity2 if ever need a
        let resource = element.dataset.type;
        const techName = element.dataset.type;
        const type = element.dataset.type;
        const resourceToFuseTo = element.dataset.resourceToFuseTo;

        //science / building upgrades
        const scienceUpgradeType = element.dataset.resourceToFuseTo;
        const buildingUpgradeType = element.dataset.resourceToFuseTo;
        const spaceUpgradeType = element.dataset.resourceToFuseTo;

        if (resource === 'storage' || resource === 'autoBuyer') {
            resource = element.dataset.argumentCheckQuantity;
        }

        const checkQuantityString = element.dataset.argumentCheckQuantity;

        let quantity;

        if (checkQuantityString === 'cash') {
            quantity = getResourceDataObject('currency', ['cash']);
        } else {
            if (checkQuantityString === 'research') {
                quantity = getResourceDataObject('research', ['quantity']); //research
            } else {
                quantity = getResourceDataObject('resources', [checkQuantityString, 'quantity']); //research
            } 
        }

        if (element.classList.contains('sell') || element.dataset.conditionCheck === 'sellResource') { //sell
            if (quantity > 0) { 
                element.classList.remove('red-disabled-text');
            } else {
                element.classList.add('red-disabled-text');
            }

            return;
        }

        if (element.classList.contains('fuse') || element.dataset.conditionCheck === 'fuseResource') {
            if (getTechUnlockedArray().includes(resource + 'Fusion') && getUnlockedResourcesArray().includes(resourceToFuseTo)) {
                element.classList.remove('invisible'); 
            }

            if (getTechUnlockedArray().includes(resource + 'Fusion') && quantity > 0) {
                element.classList.remove('red-disabled-text');
                if (element.tagName.toLowerCase() === 'button') {
                    setSellFuseCreateTextDescriptionClassesBasedOnButtonStates(element, 'fuse');
                }
            } else if (!getTechUnlockedArray().includes(resource + 'Fusion')) {
                element.classList.add('invisible');
            } else {
                element.classList.remove('warning-orange-text');
                element.classList.add('red-disabled-text');
            }
            return;
        }

        if (element.classList.contains('tech-unlock') || element.dataset.conditionCheck === 'techUnlock') { 
            const prerequisiteArray = getResourceDataObject('techs', [techName, 'appearsAt']).slice(1).filter(prereq => prereq !== null && prereq !== '');
            
            if (element && quantity >= getResourceDataObject('techs', [techName, 'price'])) {
                element.classList.remove('red-disabled-text');
            } else if (element) {
                element.classList.add('red-disabled-text');
            }

            if (element.tagName.toLowerCase() === 'button') {
                if (quantity >= getResourceDataObject('techs', [techName, 'price'])) {
                    const allPrerequisitesUnlocked = prerequisiteArray.every(prerequisite => getTechUnlockedArray().includes(prerequisite));
        
                    if (allPrerequisitesUnlocked) {
                        element.classList.remove('red-disabled-text');
                    } else {
                        element.classList.add('red-disabled-text');
                    }
                }
            } else { 
                const prerequisiteSpan = element.querySelector('span');
                
                if (prerequisiteSpan) {
                    const technologiesString = prerequisiteSpan.textContent.trim();
                    if ((technologiesString !== "" && element.tagName.toLowerCase() !== 'button') || element.tagName.toLowerCase() === 'button') {
                        const technologiesArray = technologiesString.split(', ');
                        prerequisiteSpan.innerHTML = '';
        
                        technologiesArray.forEach((tech, index) => {

                            const techSpan = document.createElement('span');
                            techSpan.textContent = tech.trim();
                            const techSpanArrayName = tech.charAt(0).toLowerCase() + tech.slice(1).replace(/\s+/g, '');

                            if (getTechUnlockedArray().includes(techSpanArrayName)) {
                                techSpan.classList.add('green-ready-text');
                                techSpan.classList.remove('red-disabled-text');
                            } else {
                                techSpan.classList.remove('green-ready-text');
                                techSpan.classList.add('red-disabled-text');
                            }
                            prerequisiteSpan.appendChild(techSpan);

                            if (index < technologiesArray.length - 1) {
                                prerequisiteSpan.appendChild(document.createTextNode(', '));
                            }
                        });
                    }
                }
            }

            if (getTechUnlockedArray().includes(techName)) {
                if (element.tagName.toLowerCase() === 'button') {
                    setSellFuseCreateTextDescriptionClassesBasedOnButtonStates(element, 'green');
                }
                element.classList.remove('red-disabled-text');
                element.classList.add('green-ready-text');
                element.textContent = 'Researched';
                element.style.pointerEvents = 'none';
                setTechRenderChange(true);
            }

            return;
        }        

        let price;
        let mainKey;

        if (type === 'autoBuyer') {
            mainKey = 'resources';
            const autoBuyerTier = element.dataset.autoBuyerTier;
            if (autoBuyerTier === 'tier0') return;
            price = getResourceDataObject(mainKey, [resource, 'upgrades', 'autoBuyer', autoBuyerTier, 'price']);
        } else if (type === 'scienceUpgrade') {
            mainKey = 'research';
            price = getResourceDataObject(mainKey, ['upgrades', scienceUpgradeType, 'price']);
        } else if (type === 'energy') {
            mainKey = 'buildings';
            price = getResourceDataObject(mainKey, [resource, 'upgrades', buildingUpgradeType, 'price']);
        } else if (type === 'spaceUpgrade') {
            mainKey = 'space';
            price = getResourceDataObject(mainKey, ['upgrades', spaceUpgradeType, 'price']);
        } else {
            if (element.dataset.type === "research") {
                mainKey = 'research';
                price = getResourceDataObject(mainKey, ['quantity']);
            } else if (element.dataset.type === "storage") {
                mainKey = 'resources' //storageCapacity
                price = getResourceDataObject(mainKey, [resource, 'storageCapacity']) - 1;
                if (element.tagName.toLowerCase() !== 'button') {
                    element.textContent = `${price} ${getResourceDataObject(mainKey, [resource, 'nameResource'])}`;
                }
            }
        }

        let resourcePrices = [];
        let resourceNames = [];
        let resourceCategories = [];

        if (element.classList.contains('building-purchase')) {
            if (type === 'spaceUpgrade') {
                resourcePrices.push(
                    getResourceDataObject('space', ['upgrades', spaceUpgradeType, 'resource1Price'])[0],
                    getResourceDataObject('space', ['upgrades', spaceUpgradeType, 'resource2Price'])[0],
                    getResourceDataObject('space', ['upgrades', spaceUpgradeType, 'resource3Price'])[0]
                );
                resourceNames.push(
                    getResourceDataObject('space', ['upgrades', spaceUpgradeType, 'resource1Price'])[1],
                    getResourceDataObject('space', ['upgrades', spaceUpgradeType, 'resource2Price'])[1],
                    getResourceDataObject('space', ['upgrades', spaceUpgradeType, 'resource3Price'])[1]
                );
                resourceCategories.push(
                    getResourceDataObject('space', ['upgrades', spaceUpgradeType, 'resource1Price'])[2],
                    getResourceDataObject('space', ['upgrades', spaceUpgradeType, 'resource2Price'])[2],
                    getResourceDataObject('space', ['upgrades', spaceUpgradeType, 'resource3Price'])[2]
                );
            } else {
                resourcePrices.push(
                    getResourceDataObject('buildings', ['energy', 'upgrades', buildingUpgradeType, 'resource1Price'])[0],
                    getResourceDataObject('buildings', ['energy', 'upgrades', buildingUpgradeType, 'resource2Price'])[0],
                    getResourceDataObject('buildings', ['energy', 'upgrades', buildingUpgradeType, 'resource3Price'])[0]
                );
                resourceNames.push(
                    getResourceDataObject('buildings', ['energy', 'upgrades', buildingUpgradeType, 'resource1Price'])[1],
                    getResourceDataObject('buildings', ['energy', 'upgrades', buildingUpgradeType, 'resource2Price'])[1],
                    getResourceDataObject('buildings', ['energy', 'upgrades', buildingUpgradeType, 'resource3Price'])[1]
                );
                resourceCategories.push(
                    getResourceDataObject('buildings', ['energy', 'upgrades', buildingUpgradeType, 'resource1Price'])[2],
                    getResourceDataObject('buildings', ['energy', 'upgrades', buildingUpgradeType, 'resource2Price'])[2],
                    getResourceDataObject('buildings', ['energy', 'upgrades', buildingUpgradeType, 'resource3Price'])[2]
                );
            }
        }

        if (element.dataset.conditionCheck === 'upgradeCheck' && quantity >= price) {
            element.classList.remove('red-disabled-text');
        } else {
            element.classList.add('red-disabled-text');
        }
        
        if (element.dataset.conditionCheck === 'upgradeCheck' && quantity >= price) {
            if (element.classList.contains('building-purchase')) {
                element.querySelectorAll('span').forEach((span, index) => {
                    if (index !== 0) {
                        const category = resourceCategories[index-1];
                        const name = resourceNames[index-1];
                        const price = resourcePrices[index-1];
    
                        if (category && getResourceDataObject(category, [name, 'quantity']) > price) {
                            span.classList.remove('red-disabled-text');
                            span.classList.add('green-ready-text');
                        } else if (category) {
                            span.classList.add('red-disabled-text');
                            span.classList.remove('green-ready-text');
                        }
                    } else {
                        if (element.dataset.conditionCheck === 'upgradeCheck' && quantity >= price) {
                            span.classList.remove('red-disabled-text');
                            span.classList.add('green-ready-text');  
                        } else {
                            span.classList.add('red-disabled-text');
                            span.classList.remove('green-ready-text');
                        }
                    }
                });
            } else {
                element.classList.remove('red-disabled-text');
            }
        } else {
            if (element.classList.contains('building-purchase') && !element.classList.contains('building-purchase-button')) {
                element.querySelectorAll('span').forEach((span, index) => {
                    if (index !== 0) {
                        const category = resourceCategories[index-1];
                        const name = resourceNames[index-1];
                        const price = resourcePrices[index-1];
            
                        if (category && getResourceDataObject(category, [name, 'quantity']) > price) {
                            span.classList.remove('red-disabled-text');
                            span.classList.add('green-ready-text');
                        } else if (category) {
                            span.classList.add('red-disabled-text');
                            span.classList.remove('green-ready-text');
                        }
                    } else {
                        if (element.dataset.conditionCheck === 'upgradeCheck' && quantity >= price) {
                            span.classList.remove('red-disabled-text');
                            span.classList.add('green-ready-text');  
                        } else {
                            span.classList.add('red-disabled-text');
                            span.classList.remove('green-ready-text');
                        }
                    }
                });
            } else {
                element.classList.add('red-disabled-text');
            }
        } 

        if (element.classList.contains('building-purchase')) {
            const spans = element.querySelectorAll('span');

            let hasRedDisabledText = false;
            spans.forEach(span => {
                if (span.classList.contains('red-disabled-text')) {
                    hasRedDisabledText = true;
                }
            });

            const buyButton = element.parentElement.parentElement.querySelector('button');

            if (hasRedDisabledText) {
                buyButton.classList.add('red-disabled-text');
            } else {
                buyButton.classList.remove('red-disabled-text');
            }
        }
                
        if (element.classList.contains('building-purchase-button')) {
            if (element.classList.contains ('launchPad')) {
                if (getResourceDataObject('space', ['upgrades', 'launchPad', 'launchPadBoughtYet'])) {
                    const accompanyingLabel = element.parentElement.nextElementSibling.querySelector('label');

                    element.classList.add('invisible');
                    document.getElementById('launchPadAlreadyBoughtText').classList.remove('invisible');
                    accompanyingLabel.classList.add('invisible');
                }
            }
            return;
        }      

        if (resource !== 'energy' && resource !== 'spaceUpgrade' && resource !== 'scienceUpgrade') {
            if (getElements()[resource + 'Rate'].textContent.includes('-')) {
                getElements()[resource + 'Rate'].classList.add('red-disabled-text');
            } else {
                getElements()[resource + 'Rate'].classList.remove('red-disabled-text');
            }
        } else if (resource === 'spaceUpgrade') {
            const dataName = element.dataset.resourceToFuseTo;
            if (dataName.includes('rocket')) {
                const builtParts = getResourceDataObject('space', ['upgrades', dataName, 'builtParts']);
                const totalParts = getResourceDataObject('space', ['upgrades', dataName, 'parts']);
                if (builtParts === totalParts) {
                    const builtPartsElement = document.getElementById(`${dataName}BuiltPartsQuantity`);
                    const totalPartsElement = document.getElementById(`${dataName}TotalPartsQuantity`);
                    const rocketPartBuyButton = element.parentElement.parentElement.querySelector('.input-container button');
                    rocketPartBuyButton.classList.add('red-disabled-text');
                    element.classList.add('green-ready-text');
                    builtPartsElement.classList.add('green-ready-text');
                    totalPartsElement.classList.add('green-ready-text');
                    element.classList.remove('red-disabled-text');
                    element.textContent = 'Built!';
                }
                const rocketsBuiltArray = getRocketsBuilt();
                for (let i = 1; i <= 4; i++) {
                    const rocketElement = document.getElementById('rocket' + i);
                    if (rocketElement) {
                        if (rocketsBuiltArray.includes('rocket' + i)) {
                            rocketElement.parentElement.parentElement.classList.remove('invisible');
                        } else {
                            rocketElement.parentElement.parentElement.classList.add('invisible');
                        }
                    }
                }
            }
        }
    }
}

export function setSellFuseCreateTextDescriptionClassesBasedOnButtonStates(element, type) {
    if (type === 'create') {
        const accompanyingLabel = element.parentElement.nextElementSibling.querySelector('label');
        if (accompanyingLabel.textContent.includes('!')) {
            accompanyingLabel.classList.add('warning-orange-text');
        } else {
            accompanyingLabel.classList.remove('warning-orange-text');
        }
    } else if (type === 'green') {
        const accompanyingLabel = element.parentElement.nextElementSibling.querySelector('label');
        accompanyingLabel.classList.remove('red-disabled-text');
        accompanyingLabel.classList.add('unlocked-tech');
        accompanyingLabel.classList.add('green-ready-text');
        accompanyingLabel.textContent = 'Researched';
    } else if (type === 'fuse') {
        const accompanyingLabel = element.parentElement.nextElementSibling.querySelector('label');
        if (accompanyingLabel.textContent.includes('!!')) {
            element.classList.add('warning-orange-text');
            element.classList.remove('red-disabled-text');
            accompanyingLabel.classList.remove('warning-orange-text');
            accompanyingLabel.classList.add('red-disabled-text');
        } else if (accompanyingLabel.textContent.includes('!')) {  //over the storage limit for output element
            element.classList.add('warning-orange-text');
            accompanyingLabel.classList.add('warning-orange-text');
        } else {
            element.classList.remove('warning-orange-text');
            accompanyingLabel.classList.remove('warning-orange-text');
            accompanyingLabel.classList.remove('red-disabled-text');
        }
    }
}

const updateQuantityDisplays = (element, data1, data2, resourceData1, resourceData2, resourceData3, desc) => {
    const [resourcePrice1, resourceName1] = resourceData1 || [null, null];
    const [resourcePrice2, resourceName2] = resourceData2 || [null, null];
    const [resourcePrice3, resourceName3] = resourceData3 || [null, null];

    if (desc) {
        if (element && data2) {
            let priceString = "";
    
            if (data2 === '€') {
                priceString = data1 + data2;
            } else if (data2 === getCurrencySymbol()) {
                priceString = data2 + data1;
            } else {
                priceString = data1 + ' ' + data2;
            }
    
            const resourceParts = [];
            if (resourcePrice1 != null && resourceName1 && resourceName1.trim() !== "") {
                resourceParts.push(resourcePrice1 + " " + resourceName1);
            }
            if (resourcePrice2 != null && resourceName2 && resourceName2.trim() !== "") {
                resourceParts.push(resourcePrice2 + " " + resourceName2);
            }
            if (resourcePrice3 != null && resourceName3 && resourceName3.trim() !== "") {
                resourceParts.push(resourcePrice3 + " " + resourceName3);
            }

            element.innerHTML = "";

            const priceSpan = document.createElement("span");
            priceSpan.className = 'currency-price';
            priceSpan.innerHTML = priceString;
            element.appendChild(priceSpan);
    
            if (resourceParts.length > 0) {
                resourceParts.forEach((resource, index) => {
                    const resourceSpan = document.createElement("span");
                    resourceSpan.className = `resource-price${index + 1}`;
                    resourceSpan.innerHTML = `, ${resource}`;
                    element.appendChild(resourceSpan);
                });
            }
        }     
    } else {
        if (element && data2 >= 0) {
            if (element === getElements().energyQuantity) {
                if (getResourceDataObject('buildings', ['energy', 'batteryBoughtYet'])) {
                    element.textContent = Math.floor(data1) + '/' + Math.floor(data2);
                } else {
                    element.textContent = Math.floor(data1);
                }
            } else if (element === getElements().researchQuantity) {
                element.textContent = Math.floor(data1);
            } else if (element.id && element.id.includes('power')) {
                element.textContent = Math.floor(data1);
            } else {
                element.textContent = Math.floor(data1) + '/' + Math.floor(data2);
            }
        } else if (element) {
            element.textContent = Math.floor(data1);
        }

        if (element && data2 && data1 === data2) {
            element.classList.add('green-ready-text');
        }

        if (element && element.classList.contains('green-ready-text') && data1 !== data2) {
            element.classList.remove('green-ready-text');
        }
    }
};

export function gain(incrementAmount, elementId, item, ABOrTechPurchase, tierAB, resourceCategory, itemType) {
    let resourceType;

    if (resourceCategory === 'research') {
        resourceType = 'research';
    } else if (resourceCategory === 'techs') { 
        resourceType = 'techs';
    } else if (resourceCategory === 'scienceUpgrade') { 
        resourceType = 'scienceUpgrade';
    } else if (resourceCategory === 'energy') { 
        resourceType = 'energy';
    } else if (resourceCategory === 'space') { 
        resourceType = 'space';
    } else {
        resourceType = itemType.slice(0, -1);
    }

    let currentQuantity;

    if (item && item === 'techUnlock') {
        currentQuantity = getResourceDataObject('techs', [incrementAmount, 'price']);
    } else if (item && item.startsWith('science')) {
        currentQuantity = getResourceDataObject('research', ['upgrades', item, 'quantity']); 
    } else if ((item && item.startsWith('power')) || (item && item.startsWith('battery'))) {
        currentQuantity = getResourceDataObject('buildings', ['energy', 'upgrades', item, 'quantity']);
    } else if ((item && item.startsWith('rocket'))) {
        currentQuantity = getResourceDataObject('space', ['upgrades', item, 'builtParts']);
    } else if (item && item === 'autoBuyer') {
        currentQuantity = getResourceDataObject(itemType, [resourceCategory, 'upgrades', 'autoBuyer', tierAB, 'quantity']);
    } else {
        currentQuantity = getResourceDataObject(itemType, [resourceCategory, 'quantity']);
    }

    if (ABOrTechPurchase) {
        if (ABOrTechPurchase === 'techUnlock') {
            setResourceDataObject(getResourceDataObject('research', ['quantity']) - currentQuantity, 'research', ['quantity']);
        } else {
            setResourceDataObject(currentQuantity + incrementAmount, itemType, [resourceCategory, 'upgrades', 'autoBuyer', tierAB, 'quantity']); //ab end up here should add to ab
        }
    } else {
        if (resourceType === 'scienceUpgrade') {
            setResourceDataObject(currentQuantity + incrementAmount, 'research', ['upgrades', item, 'quantity']); 
        } else if (resourceType === 'energy') { 
            setResourceDataObject(currentQuantity + incrementAmount, 'buildings', ['energy', 'upgrades', item, 'quantity']);
            if (item.startsWith('power')) {
                const powerBuildingFuelType = getResourceDataObject('buildings', ['energy', 'upgrades', item, 'fuel'])[0];
                const powerBuildingFuelBurnRate = getResourceDataObject('buildings', ['energy', 'upgrades', item, 'fuel'])[1];
                const powerBuildingFuelCategory = getResourceDataObject('buildings', ['energy', 'upgrades', item, 'fuel'])[2];
                const fuelObject = getResourceDataObject(powerBuildingFuelCategory, [powerBuildingFuelType]);
                setResourceDataObject(fuelObject.usedForFuelPerSec + powerBuildingFuelBurnRate, powerBuildingFuelCategory, [powerBuildingFuelType, 'usedForFuelPerSec']);
                
                if (getActivatedFuelBurnObject(powerBuildingFuelType)) {
                    const actualRateOfPowerBuildingFuel = getResourceDataObject(powerBuildingFuelCategory, [powerBuildingFuelType, 'rate']);
                    setResourceDataObject(actualRateOfPowerBuildingFuel - powerBuildingFuelBurnRate, powerBuildingFuelCategory, [powerBuildingFuelType, 'rate']);
                }
            }
        } else if (resourceType === 'resource' || resourceType === 'compound') {
            const storageCapacity = getResourceDataObject(itemType, [resourceCategory, 'storageCapacity']);
            if (currentQuantity < storageCapacity) {
                getElements()[elementId].classList.remove('green-ready-text');
                setResourceDataObject(currentQuantity + incrementAmount, itemType, [resourceCategory, 'quantity']);
            } else {
                setResourceDataObject(storageCapacity, itemType, [resourceCategory, 'quantity']);
            }
            return;
        } else if (resourceType === 'research') {
            getElements()[elementId].classList.remove('green-ready-text');
            setResourceDataObject(currentQuantity + incrementAmount, 'research', ['quantity']);
        } else if (resourceType === 'space') {
            setResourceDataObject(currentQuantity + incrementAmount, 'space', ['upgrades', item, 'builtParts']);
            const builtParts = getResourceDataObject('space', ['upgrades', item, 'builtParts']);
            const totalParts = getResourceDataObject('space', ['upgrades', item, 'parts']);

            if (builtParts === totalParts) {
                setRocketsBuilt(item);
            }
        }
    }    

    let amountToDeduct;
    let resource1ToDeduct = 0;
    let resource2ToDeduct = 0;
    let resource3ToDeduct = 0;
    let itemSetNewPrice;

    let itemObject;
    if (resourceCategory === 'research') {
        itemObject = getResourceDataObject('research', ['upgrades', item]);
    } else if (resourceCategory === 'techs') {
        sortTechRows(false);
        return;
    } else if (resourceCategory === 'scienceUpgrade') {
        itemObject = getResourceDataObject('research', ['upgrades', item]);
    } else if (resourceCategory === 'energy') {
        itemObject = getResourceDataObject('buildings', ['energy', 'upgrades', item]);
    } else if (resourceCategory === 'space') {
        itemObject = getResourceDataObject('space', ['upgrades', item]);
    } else {
        itemObject = getResourceDataObject(itemType, [resourceCategory]);
    }
    
    if (ABOrTechPurchase) {
        amountToDeduct = itemObject.upgrades.autoBuyer[tierAB].price;
        itemSetNewPrice = itemObject.upgrades.autoBuyer[tierAB].setPrice;
    } else { //buildings / space
        amountToDeduct = itemObject.price;
        if (resourceCategory === 'energy' || resourceCategory === 'space') {
            resource1ToDeduct = itemObject.resource1Price[0];
            resource2ToDeduct = itemObject.resource2Price[0];
            resource3ToDeduct = itemObject.resource3Price[0];
        }
        itemSetNewPrice = itemObject.setPrice;
    }

    let itemToDeduct1Name;
    let itemToDeduct2Name = '';
    let itemToDeduct3Name = '';
    let itemToDeduct4Name = '';

    let itemCategory1 = '';
    let itemCategory2 = '';
    let itemCategory3 = '';

    let resourcePrices = [[0,''],[0,''],[0,'']];

    if (resourceCategory === 'scienceUpgrade' || resourceCategory === 'energy' || resourceCategory === 'space') {
        itemToDeduct1Name = 'cash';
        if (resourceCategory === 'energy' || resourceCategory === 'space') {
            itemToDeduct2Name = itemObject.resource1Price[1];
            itemToDeduct3Name = itemObject.resource2Price[1];
            itemToDeduct4Name = itemObject.resource3Price[1];

            itemCategory1 = itemObject.resource1Price[2];
            itemCategory2 = itemObject.resource2Price[2];
            itemCategory3 = itemObject.resource3Price[2];
        }
        resourcePrices = [[resource1ToDeduct, itemToDeduct2Name, itemCategory1], [resource2ToDeduct, itemToDeduct3Name, itemCategory2], [resource3ToDeduct, itemToDeduct4Name, itemCategory3]];
    } else {
        itemToDeduct1Name = itemObject.screenName;
    }

    let itemToDeduct1NameArray = [itemToDeduct1Name];
    let amountToDeductArray = [amountToDeduct];
    let itemTypeArray = [itemType];

    setItemsToDeduct(itemToDeduct1NameArray, amountToDeductArray, itemTypeArray, resourcePrices);
    setItemsToIncreasePrice(itemToDeduct1Name, itemSetNewPrice, amountToDeduct, itemType, resourcePrices);
}

export function increaseResourceStorage(elementIds, resource, itemTypeArray) {
    let amountToDeductArray = [];
    let resourceToDeductNamesArray;
    const increaseFactor = getIncreaseStorageFactor();

    if (resource[0] === 'water') {
        resourceToDeductNamesArray = resource;
        const firstResourceStorage = getResourceDataObject(itemTypeArray[0], [resource[0], 'storageCapacity']);

        for (let index = 0; index < resourceToDeductNamesArray.length; index++) {
            if (index > 0) {
                amountToDeductArray.push(firstResourceStorage * 0.3);
            } else {
                amountToDeductArray.push(firstResourceStorage - 1); //to leave power on if increasing storage
            }
        }
    } else {
        resourceToDeductNamesArray = [resource[0]];
        amountToDeductArray[0] = getResourceDataObject(itemTypeArray[0], [resourceToDeductNamesArray, 'storageCapacity']) - 1; //to leave power on if increasing storage
    }

    setItemsToDeduct(resourceToDeductNamesArray, amountToDeductArray, itemTypeArray, [[0,''],[0,''],[0,'']]);

    deferredActions.push(() => {
        const updatedStorageSize = getResourceDataObject(itemTypeArray[0], [resource[0], 'storageCapacity']) * increaseFactor;
        setResourceDataObject(updatedStorageSize, itemTypeArray[0], [resource[0], 'storageCapacity']);
        if (resource.length > 1) {
            setResourceDataObject(updatedStorageSize * 0.3, itemTypeArray[1], [resource[1], 'currentSecondaryIncreasePrice']);
        }
        elementIds.forEach(elementId => {
            getElements()[elementId].classList.remove('green-ready-text');
        });
    });
}

export function revealElement(elementId) {
    const element = document.getElementById(elementId);
    element.classList.remove('invisible');
}

export function startUpdateTimersAndRates(elementName, action) {
    if (elementName.startsWith('science')) {
        startUpdateScienceTimers(elementName);
        return;
    }

    if (elementName.startsWith('power')) {
        startUpdateEnergyTimers(elementName, action);
        return;
    }
}

function startInitialTimers() {
    const resources = getResourceDataObject('resources');
    const compounds = getResourceDataObject('compounds');
    const tiers = [1, 2, 3, 4];

    for (const resource in resources) {
        if (resources.hasOwnProperty(resource)) {
            tiers.forEach(tier => {
                const timerName = `${resource}AB${tier}`;
                if (!timerManager.getTimer(timerName)) {
                    timerManager.addTimer(timerName, getTimerUpdateInterval(), () => {
                        const currentQuantity = getResourceDataObject('resources', [resource, 'quantity']);
                        const storageCapacity = getResourceDataObject('resources', [resource, 'storageCapacity']);
                        if (getPowerOnOff()) {
                            const autoBuyerExtractionRate = getResourceDataObject('resources', [resource, 'upgrades', 'autoBuyer', `tier${tier}`, 'rate']);
                            const currentTierAutoBuyerQuantity = getResourceDataObject('resources', [resource, 'upgrades', 'autoBuyer', `tier${tier}`, 'quantity']);
                            const calculatedResourceRate = autoBuyerExtractionRate * currentTierAutoBuyerQuantity;
                            setResourceDataObject(Math.min(currentQuantity + calculatedResourceRate, storageCapacity), 'resources', [resource, 'quantity']);
                            
                            const allResourceRatesAddedTogether = 
                                getResourceDataObject('resources', [resource, 'upgrades', 'autoBuyer', 'tier1', 'rate']) * 
                                getResourceDataObject('resources', [resource, 'upgrades', 'autoBuyer', 'tier1', 'quantity']) +
                                getResourceDataObject('resources', [resource, 'upgrades', 'autoBuyer', 'tier2', 'rate']) * 
                                getResourceDataObject('resources', [resource, 'upgrades', 'autoBuyer', 'tier2', 'quantity']) +
                                getResourceDataObject('resources', [resource, 'upgrades', 'autoBuyer', 'tier3', 'rate']) * 
                                getResourceDataObject('resources', [resource, 'upgrades', 'autoBuyer', 'tier3', 'quantity']) +
                                getResourceDataObject('resources', [resource, 'upgrades', 'autoBuyer', 'tier4', 'rate']) * 
                                getResourceDataObject('resources', [resource, 'upgrades', 'autoBuyer', 'tier4', 'quantity']);

                            const powerPlant1FuelType = 'carbon'; 
                            const powerPlant1Consumption = getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant1', 'fuel'])[1] * getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant1', 'quantity']);

                            let amountToDeductForConsumption = 0;

                            if (getBuildingTypeOnOff('powerPlant1')) {
                                if (resource === powerPlant1FuelType) {
                                    amountToDeductForConsumption = powerPlant1Consumption;
                                    if (tier === 1) { //not important which tier just has to be one of them to make it run once per loop
                                        setCanAffordDeferred(true);
                                        //FIX HERE
                                        deferredActions.push(() => {
                                            if (getCanAffordDeferred()) { 
                                                setResourceDataObject(allResourceRatesAddedTogether + amountToDeductForConsumption, 'resources', [resource, 'rate']);
                                                setResourceDataObject(Math.min(getResourceDataObject('resources', [resource, 'quantity']) - amountToDeductForConsumption, storageCapacity), 'resources', [resource, 'quantity']);
                                            }
                                            setCanAffordDeferred(null);
                                        });
                                    }
                                }

                                if (resource !== 'solar') {
                                    getElements()[`${resource}Rate`].textContent = `${((allResourceRatesAddedTogether - amountToDeductForConsumption) * getTimerRateRatio()).toFixed(1)} / s`;
                                }

                            }
                        } else { //if power off
                            if (tier === 1) {
                                const autoBuyerExtractionRate = getResourceDataObject('resources', [resource, 'upgrades', 'autoBuyer', `tier1`, 'rate']);
                                const currentTierAutoBuyerQuantity = getResourceDataObject('resources', [resource, 'upgrades', 'autoBuyer', `tier1`, 'quantity']);
                                const calculatedResourceRate = autoBuyerExtractionRate * currentTierAutoBuyerQuantity;
                                setResourceDataObject(Math.min(currentQuantity + calculatedResourceRate, storageCapacity), 'resources', [resource, 'quantity']);
                                
                                const resourceTier1Rate = 
                                    getResourceDataObject('resources', [resource, 'upgrades', 'autoBuyer', 'tier1', 'rate']) * 
                                    getResourceDataObject('resources', [resource, 'upgrades', 'autoBuyer', 'tier1', 'quantity']);

                                setResourceDataObject(resourceTier1Rate, 'resources', [resource, 'rate']);
                                if (resource !== 'solar') {
                                    getElements()[`${resource}Rate`].textContent = `${(resourceTier1Rate * getTimerRateRatio()).toFixed(1)} / s`;
                                }
                            }
                        }
                    });
                }
            });
        }
    }

    for (const compound in compounds) {
        if (compounds.hasOwnProperty(compound)) {
            tiers.forEach(tier => {
                const timerName = `${compound}AB${tier}`;
                if (!timerManager.getTimer(timerName)) {
                    timerManager.addTimer(timerName, getTimerUpdateInterval(), () => {
                        const currentQuantity = getResourceDataObject('compounds', [compound, 'quantity']);
                        const storageCapacity = getResourceDataObject('compounds', [compound, 'storageCapacity']);
                        if (getPowerOnOff()) {
                            const autoBuyerExtractionRate = getResourceDataObject('compounds', [compound, 'upgrades', 'autoBuyer', `tier${tier}`, 'rate']);
                            const currentTierAutoBuyerQuantity = getResourceDataObject('compounds', [compound, 'upgrades', 'autoBuyer', `tier${tier}`, 'quantity']);
                            const calculatedCompoundRate = autoBuyerExtractionRate * currentTierAutoBuyerQuantity;
                            setResourceDataObject(Math.min(currentQuantity + calculatedCompoundRate, storageCapacity), 'compounds', [compound, 'quantity']);
                            
                            let allCompoundRatesAddedTogether = 
                                getResourceDataObject('compounds', [compound, 'upgrades', 'autoBuyer', 'tier1', 'rate']) * 
                                getResourceDataObject('compounds', [compound, 'upgrades', 'autoBuyer', 'tier1', 'quantity']) +
                                getResourceDataObject('compounds', [compound, 'upgrades', 'autoBuyer', 'tier2', 'rate']) * 
                                getResourceDataObject('compounds', [compound, 'upgrades', 'autoBuyer', 'tier2', 'quantity']) +
                                getResourceDataObject('compounds', [compound, 'upgrades', 'autoBuyer', 'tier3', 'rate']) * 
                                getResourceDataObject('compounds', [compound, 'upgrades', 'autoBuyer', 'tier3', 'quantity']) +
                                getResourceDataObject('compounds', [compound, 'upgrades', 'autoBuyer', 'tier4', 'rate']) * 
                                getResourceDataObject('compounds', [compound, 'upgrades', 'autoBuyer', 'tier4', 'quantity'])

                            if (compound === getStarSystemDataObject(getCurrentStarSystem(), ['precipitationType'])) {
                                allCompoundRatesAddedTogether += getCurrentPrecipitationRate();
                            }
    
                            const powerPlant3FuelType = 'diesel';                    
                            const powerPlant3Consumption = getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant3', 'fuel'])[1] * getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant3', 'quantity']);
    
                            let amountToDeductForConsumption = 0;
                            
                            if (getBuildingTypeOnOff('powerPlant3')) {
                                if (compound === powerPlant3FuelType) {
                                    amountToDeductForConsumption = powerPlant3Consumption;
                                    if (tier === 1) { //not important which tier just has to be one of them to make it run once per loop
                                        setResourceDataObject(allCompoundRatesAddedTogether + amountToDeductForConsumption, 'compounds', [compound, 'rate']);
                                        setResourceDataObject(Math.min(getResourceDataObject('compounds', [compound, 'quantity']) - amountToDeductForConsumption, storageCapacity), 'compounds', [compound, 'quantity']);
                                    }
                                }
                            }
                            getElements()[`${compound}Rate`].textContent = `${((allCompoundRatesAddedTogether - amountToDeductForConsumption) * getTimerRateRatio()).toFixed(1)} / s`;
                        } else { //if power off
                            if (tier === 1) {
                                const autoBuyerExtractionRate = getResourceDataObject('compounds', [compound, 'upgrades', 'autoBuyer', `tier1`, 'rate']);
                                const currentTierAutoBuyerQuantity = getResourceDataObject('compounds', [compound, 'upgrades', 'autoBuyer', `tier1`, 'quantity']);
                                const calculatedCompoundRate = autoBuyerExtractionRate * currentTierAutoBuyerQuantity;
                                setResourceDataObject(Math.min(currentQuantity + calculatedCompoundRate, storageCapacity), 'compounds', [compound, 'quantity']);
                                
                                let compoundTier1Rate = 
                                    getResourceDataObject('compounds', [compound, 'upgrades', 'autoBuyer', 'tier1', 'rate']) * 
                                    getResourceDataObject('compounds', [compound, 'upgrades', 'autoBuyer', 'tier1', 'quantity']);
                                
                                if (compound === getStarSystemDataObject(getCurrentStarSystem(), ['precipitationType'])) {
                                    compoundTier1Rate += getCurrentPrecipitationRate();
                                }

                                setResourceDataObject(compoundTier1Rate, 'compounds', [compound, 'rate']);
                                getElements()[`${compound}Rate`].textContent = `${(compoundTier1Rate * getTimerRateRatio()).toFixed(1)} / s`;
                            } else {
                                if (compound === getStarSystemDataObject(getCurrentStarSystem(), ['precipitationType'])) {
                                    setResourceDataObject(getCurrentPrecipitationRate(), 'compounds', [compound, 'rate']);
                                    getElements()[`${compound}Rate`].textContent = `${(getCurrentPrecipitationRate() * getTimerRateRatio()).toFixed(1)} / s`;
                                }
                            }
                        }
                    });
                }
            });
        }
    } 

    timerManager.addTimer('research', getTimerUpdateInterval(), () => {
        const currentResearchQuantity = getResourceDataObject('research', ['quantity']);
        const currentResearchRate = getResourceDataObject('research', ['rate']);
        const currentResearchRateUnpowered = getResourceDataObject('research', ['rate']) - getResourceDataObject('research', ['ratePower']);
        if (getPowerOnOff()) {
            setResourceDataObject(currentResearchQuantity + currentResearchRate, 'research', ['quantity']);
        } else {
            setResourceDataObject(currentResearchQuantity + currentResearchRateUnpowered, 'research', ['quantity']);
        }
    });
    
    timerManager.addTimer('energy', getTimerUpdateInterval(), () => {
        let newEnergyRate = 0;
        let currentEnergyQuantity = getResourceDataObject('buildings', ['energy', 'quantity']);
        const batteryBought = getResourceDataObject('buildings', ['energy', 'batteryBoughtYet']);
        const energyStorageCapacity = getResourceDataObject('buildings', ['energy', 'storageCapacity']);
        
        if (Math.floor(currentEnergyQuantity) <= energyStorageCapacity) {
            if (getPowerOnOff()) {   
                if (getBuildingTypeOnOff('powerPlant1')) {
                    newEnergyRate += getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant1', 'purchasedRate'])
                }
                if (getBuildingTypeOnOff('powerPlant2')) {
                    newEnergyRate += getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant2', 'purchasedRate']) * getCurrentStarSystemWeatherEfficiency()[1];
                }
                if (getBuildingTypeOnOff('powerPlant3')) {
                    newEnergyRate += getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant3', 'purchasedRate'])
                }

                let totalRate = newEnergyRate - getTotalEnergyUse();

                if (batteryBought) {
                    if (Math.floor(currentEnergyQuantity) === energyStorageCapacity) {
                        if (totalRate >= 0) { //max energy
                            setResourceDataObject(currentEnergyQuantity, 'buildings', ['energy', 'quantity']);
                            getElements().energyQuantity.classList.remove('red-disabled-text');
                            getElements().energyQuantity.classList.add('green-ready-text');
                            totalRate = 0;
                        } else { //energy falling
                            setResourceDataObject(currentEnergyQuantity + totalRate, 'buildings', ['energy', 'quantity']);
                            getElements().energyQuantity.classList.add('red-disabled-text');
                            getElements().energyQuantity.classList.remove('green-ready-text');
                        }
                    } else { //energy climbing
                        setResourceDataObject(currentEnergyQuantity + totalRate, 'buildings', ['energy', 'quantity']);
                        getElements().energyQuantity.classList.remove('red-disabled-text');
                        getElements().energyQuantity.classList.remove('green-ready-text');
                    }
                } //maybe add cases for no battery

                getElements().energyRate.textContent = `${Math.floor(totalRate * getTimerRateRatio())} KW / s`;
            } else {
                getElements().energyQuantity.classList.remove('red-disabled-text');
                getElements().energyQuantity.classList.remove('green-ready-text');
                getElements().energyRate.textContent = `0 KW / s`;
            }
        } else {
            getElements().energyQuantity.classList.add('green-ready-text');
            getElements().energyQuantity.classList.remove('red-disabled-text');
        }

        currentEnergyQuantity = getResourceDataObject('buildings', ['energy', 'quantity']);

        if (currentEnergyQuantity < 0) {
            setResourceDataObject(0, 'buildings', ['energy', 'quantity']);
        }

        setResourceDataObject(newEnergyRate, 'buildings', ['energy', 'rate']); 
        const powerOnNow = getPowerOnOff();
        let powerOnAfterSwitch;

        if (!batteryBought) {
            const totalRate = newEnergyRate - getTotalEnergyUse();
            setPowerOnOff(totalRate > 0);
            powerOnAfterSwitch = getPowerOnOff();
        } else {
            setPowerOnOff(currentEnergyQuantity > 0.00001);
            powerOnAfterSwitch = getPowerOnOff();
        }

        if (!getPowerOnOff() && powerOnNow !== powerOnAfterSwitch) {
            const powerBuildings = Object.fromEntries(Object.entries(getResourceDataObject('buildings', ['energy', 'upgrades'])).filter(([key]) => key.startsWith('power')));

            Object.keys(powerBuildings).forEach(powerBuilding => {
                const fuelType = getResourceDataObject('buildings', ['energy', 'upgrades', powerBuilding, 'fuel'])[0];
                const fuelCategory = getResourceDataObject('buildings', ['energy', 'upgrades', powerBuilding, 'fuel'])[2];

                toggleBuildingTypeOnOff(powerBuilding, false);
                startUpdateTimersAndRates(powerBuilding, 'toggle');
                addOrRemoveUsedPerSecForFuelRate(fuelType, null, fuelCategory, powerBuilding, true);
            });
        }
    });

    let weatherCountDownToChangeInterval;

    changeWeather();

    function changeWeather() {
        function selectNewWeather() {
            const weatherCurrentStarSystemObject = getStarSystemWeather(getCurrentStarSystem());
    
            const weatherTypes = Object.keys(weatherCurrentStarSystemObject);
            const weatherProbabilities = weatherTypes.map(weatherType => weatherCurrentStarSystemObject[weatherType][0]);
            const totalProbability = weatherProbabilities.reduce((acc, val) => acc + val, 0);
            const randomSelection = Math.random() * totalProbability;
    
            let cumulativeProbability = 0;
            let selectedWeatherType = '';
    
            for (let i = 0; i < weatherTypes.length; i++) {
                cumulativeProbability += weatherProbabilities[i];
                if (randomSelection <= cumulativeProbability) {
                    selectedWeatherType = weatherTypes[i];
                    break;
                }
            }
    
            const [probability, symbolWeather, efficiencyWeather] = weatherCurrentStarSystemObject[selectedWeatherType];
    
            const statValueSpan = document.getElementById('stat7');
            const statTitleSpan = statValueSpan.previousElementSibling;
    
            switch (selectedWeatherType) {
                case 'sunny':
                    statValueSpan.classList.add('green-ready-text');
                    statValueSpan.classList.remove('warning-orange-text');
                    statValueSpan.classList.remove('red-disabled-text');
                    break;
                case 'cloudy':
                case 'rain':
                    statValueSpan.classList.remove('green-ready-text');
                    statValueSpan.classList.add('warning-orange-text');
                    statValueSpan.classList.remove('red-disabled-text');
                    break;
                case 'volcano':
                    statValueSpan.classList.remove('green-ready-text');
                    statValueSpan.classList.remove('warning-orange-text');
                    statValueSpan.classList.add('red-disabled-text');
                    break;  
            }
    
            statTitleSpan.textContent = `${capitaliseString(getCurrentStarSystem())}:`;
            statValueSpan.textContent = `${Math.floor(efficiencyWeather * 100)}% ${symbolWeather}`;
            setCurrentStarSystemWeatherEfficiency([getCurrentStarSystem(), efficiencyWeather, selectedWeatherType]);
        }
    
        selectNewWeather();
    
        const randomDurationInMinutes = Math.floor(Math.random() * 3) + 1;
        const randomDurationInMs = randomDurationInMinutes * 60 * 1000;

        // const randomDurationInMs = 10000; //For Testing Weather

        const durationInSeconds = randomDurationInMs / 1000;

        if (weatherCountDownToChangeInterval) {
            clearInterval(weatherCountDownToChangeInterval);
        }
    
        let timeLeft = durationInSeconds;

        let precipitationRate = 0;
        let precipitationRateSet = false;
        setCurrentPrecipitationRate(0);
        
        weatherCountDownToChangeInterval = setInterval(() => {
            if (timeLeft > 0) {
                if (getCurrentStarSystemWeatherEfficiency()[2] === 'rain' && !precipitationRateSet) {
                    precipitationRate = (Math.floor(Math.random() * 4) + 1) / getTimerRateRatio();
                    setCurrentPrecipitationRate(precipitationRate);
                    precipitationRateSet = true;
                } else if (!precipitationRateSet) {
                    setCurrentPrecipitationRate(0);
                    precipitationRateSet = true;
                }

                if (getCurrentStarSystemWeatherEfficiency()[2] === 'rain' || getCurrentStarSystemWeatherEfficiency()[2] === 'volcano') {
                    if (getWeatherEffectSetting() && !getWeatherEffectOn()) {
                        startWeatherEffect(getCurrentStarSystemWeatherEfficiency()[2]);
                        setWeatherEffectOn(true);
                    }
                }

                timeLeft -= 1;
            } else {
                stopWeatherEffect();
                setWeatherEffectOn(false);
                clearInterval(weatherCountDownToChangeInterval);
                changeWeather();
            }
        }, 1000);
    }
}  

function getRandomNewsTickerInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min) * 1000;
}

export function startNewsTickerTimer() {
    if (getNewsTickerSetting()) {
        const randomDuration = getRandomNewsTickerInterval(20, 35);
        const newsTicker = document.querySelector('.news-ticker-content');

        if (timerManager.getTimer('newsTicker')) {
            timerManager.removeTimer('newsTicker');
        }
    
        timerManager.addTimer('newsTicker', randomDuration, () => {
            newsTicker.classList.remove('invisible');
            showNewsTickerMessage(newsTickerContent);
            timerManager.removeTimer('newsTicker');
        });       
    } else {
        if (timerManager.getTimer('newsTicker')) {
            timerManager.removeTimer('newsTicker');
        }
    }
}

function startUpdateScienceTimers(elementName) {
    let newResearchRate;
    let newResearchRatePower = getResourceDataObject('research', ['ratePower']);

    const upgradeRatePerUnit = getResourceDataObject('research', ['upgrades', elementName, 'rate']);
    
    if (getResourceDataObject('research', ['upgrades', elementName, 'energyUse']) > 0) {
        newResearchRatePower = getResourceDataObject('research', ['ratePower']) + upgradeRatePerUnit;
    }
        
    newResearchRate = getResourceDataObject('research', ['rate']) + upgradeRatePerUnit;

    setResourceDataObject(newResearchRatePower, 'research', ['ratePower']);
    setResourceDataObject(newResearchRate, 'research', ['rate']);
    getElements().researchRate.textContent = `${(newResearchRate * getTimerRateRatio()).toFixed(1)} / s`;
}

function startUpdateEnergyTimers(elementName, action) {
    if (elementName.startsWith('power')) {
        let newEnergyRate = 0;
        const powerBuildingPotentialPower = getResourceDataObject('buildings', ['energy', 'upgrades', elementName, 'purchasedRate']);
        
        if (action === 'toggle') {
            if (getBuildingTypeOnOff(elementName)) {
                getElements()[elementName + 'Rate'].textContent = `${Math.floor(powerBuildingPotentialPower * getTimerRateRatio())} KW / s`;
            } else {
                getElements()[elementName + 'Rate'].textContent = `0 KW / s`;
            }
        } else if (action === 'buy') {
            getElements()[elementName + 'Rate'].textContent = `${Math.floor(powerBuildingPotentialPower * getTimerRateRatio())} KW / s`;
        }

        setResourceDataObject(newEnergyRate, 'buildings', ['energy', 'rate']);
    }
}

function formatAllNotationElements(element, notationType) {
        const originalContent = element.innerHTML;
        const formattedContent = originalContent.replace(/-?\d+(\.\d+)?/g, match => {
            let number = parseFloat(match);

            if (isNaN(number)) {
                console.warn(`Invalid number found: ${match}`);
                return match;
            }

            if (notationType === 'normal') {
                return number;
            } else if (notationType === 'normalCondensed') {
                if (element.id === 'cashStat') {
                    const formatNumber = (num, divisor) => {
                        const result = num / divisor;
                        const fraction = result % 1;
                        return (fraction === 0 || fraction === 0.1 || fraction === 0.9) 
                            ? result.toFixed(0) 
                            : result.toFixed(1);
                    };
                
                    if (number >= 1e13) {
                        let exponent = Math.floor(Math.log10(number));
                        const scaledNumber = number / Math.pow(10, exponent);
                        const fraction = scaledNumber % 1;
                        return `${(fraction === 0 || fraction === 0.1 || fraction === 0.9 
                            ? scaledNumber.toFixed(0) 
                            : scaledNumber.toFixed(1))}e${exponent}`;
                    } else if (number >= 1e12) {
                        return `${formatNumber(number, 1e12)}e12`;
                    } else if (number >= 1e9) {
                        return `${formatNumber(number, 1e9)}B`;
                    } else if (number >= 1e6) {
                        return `${formatNumber(number, 1e6)}M`;
                    } else if (number >= 1e3) {
                        return `${formatNumber(number, 1e3)}K`;
                    } else {
                        return Math.round(number).toFixed(0);
                    }
                }                
            
                if (number >= 1e13) {
                    let exponent = Math.floor(Math.log10(number));
                    return `${Math.floor(number / Math.pow(10, exponent) * 10) / 10}e${exponent}`;
                } else if (number >= 1e12) {
                    return `${(Math.floor(number / 1e12 * 10) / 10).toFixed(1)}e12`;
                } else if (number >= 1e9) {
                    return `${(Math.floor(number / 1e9 * 10) / 10).toFixed(1)}B`;
                } else if (number >= 1e6) {
                    return `${(Math.floor(number / 1e6 * 10) / 10).toFixed(1)}M`;
                } else if (number >= 1e3) {
                    return `${(Math.floor(number / 1e3 * 10) / 10).toFixed(1)}K`;
                } else {
                    if (element.dataset.conditionCheck === 'techUnlock' || element.dataset.type === 'building') {
                        return number; // Return the raw number for these conditions
                    } else {
                        return number.toFixed(0); // Default formatting for other cases
                    }
                }                               
            }                       
        });

        element.innerHTML = formattedContent;
}

function complexPurchaseBuildingFormatter(element, notationType) {
    if (notationType === 'normalCondensed') {
        const spans = element.querySelectorAll("span");
    
        spans.forEach((span, index) => {
            const content = span.textContent.trim();
            const parts = content.split(' ');
    
            let numberPart;
            
            if (index !== 0) {
                numberPart = parts[1]?.replace(/[^0-9.]/g, '');
            } else {
                numberPart = parts[0].replace(/[^0-9.]/g, '');
            }
            
            const formattedNumber = formatNumber(numberPart);
    
            if (index === 0) {
                if (getCurrencySymbol() === '€') {
                    span.textContent = formattedNumber + getCurrencySymbol();
                } else {
                    span.textContent = getCurrencySymbol() + formattedNumber;
                }
                
                if (parts.length > 1) {
                    span.textContent += ' ' + parts.slice(1).join(' ');
                }
            } else {
                const prefix = content.startsWith(",") ? ", " : "";
                const remainingText = parts.slice(2).join(' ');
                span.textContent = `${prefix}${formattedNumber}${remainingText ? " " + remainingText : ""}`;
            }
        });
    }    
}

function formatNumber(value) {
    const number = parseFloat(value);
    if (isNaN(number)) return value;

    if (number >= 1e13) {
        let exponent = Math.floor(Math.log10(number));
        return `${(Math.floor(number / Math.pow(10, exponent) * 10) / 10).toFixed(1)}e${exponent}`;
    } else if (number >= 1e12) {
        return `${(Math.floor(number / 1e12 * 10) / 10).toFixed(1)}e12`;
    } else if (number >= 1e9) {
        return `${(Math.floor(number / 1e9 * 10) / 10).toFixed(1)}B`;
    } else if (number >= 1e6) {
        return `${(Math.floor(number / 1e6 * 10) / 10).toFixed(1)}M`;
    } else if (number >= 1e3) {
        return `${(Math.floor(number / 1e3 * 10) / 10).toFixed(1)}K`;
    } else {
        return number.toFixed(0);
    }
}

function complexSellStringFormatter(element, notationType) {
    if (notationType === 'normalCondensed') {
        const sellRowQuantityElement = element.parentElement;
        const match = sellRowQuantityElement.innerHTML.match(/>(.*?)</); //resource fusing from
    
        if (match) {
            const beforeMatch = sellRowQuantityElement.innerHTML.slice(0, match.index + 1);
            const afterMatch = sellRowQuantityElement.innerHTML.slice(match.index + match[0].length - 1);
            const newContent = getTempRowValue();
            
            sellRowQuantityElement.innerHTML = beforeMatch + newContent + afterMatch;
    
            if (sellRowQuantityElement.innerHTML.includes('-&gt; ')) { //first number to fuse to
                formatSellStringCondensed(sellRowQuantityElement, /&gt; (-?\d+)(\s|$)/, 5, 1);
            }
            
            if (sellRowQuantityElement.innerHTML.includes(', ')) { //second number to fuse to
                formatSellStringCondensed(sellRowQuantityElement, /, (\d+)\s/, 2, 1);
            }   
        }
    }
}

function formatSellStringCondensed(element, regex, sliceOffsetBefore, sliceOffsetAfter) {
    const match = element.innerHTML.match(regex);
    if (match) {
        const capturedNumber = parseFloat(match[1]);
        let formatted;
        if (capturedNumber < 0) {
            formatted = 0;
        }else {
            if (capturedNumber >= 1e13) {
                let exponent = Math.floor(Math.log10(capturedNumber));
                formatted = `${(Math.floor(capturedNumber / Math.pow(10, exponent) * 10) / 10).toFixed(1)}e${exponent}`;
            } else if (capturedNumber >= 1e12) {
                formatted = `${(Math.floor(capturedNumber / 1e12 * 10) / 10).toFixed(1)}e12`;
            } else if (capturedNumber >= 1e9) {
                formatted = `${(Math.floor(capturedNumber / 1e9 * 10) / 10).toFixed(1)}B`;
            } else if (capturedNumber >= 1e6) {
                formatted = `${(Math.floor(capturedNumber / 1e6 * 10) / 10).toFixed(1)}M`;
            } else if (capturedNumber >= 1e3) {
                formatted = `${(Math.floor(capturedNumber / 1e3 * 10) / 10).toFixed(1)}K`;
            } else {
                formatted = capturedNumber.toFixed(0);
            }
        }        
        const beforeMatch = element.innerHTML.slice(0, match.index + sliceOffsetBefore);
        const afterMatch = element.innerHTML.slice(match.index + match[0].length - sliceOffsetAfter);
        element.innerHTML = beforeMatch + formatted + afterMatch;
    }
}

function setAllOriginalFrameNumberValues() {
    const elements = document.querySelectorAll('.notation');
    const originalNumbers = getOriginalFrameNumbers();
    const existingSelectors = new Set();

    elements.forEach(element => {
        const originalContent = element.innerHTML;
        const elementSelector = element.id ? `#${element.id}` : `.${element.className}`;

        if (!(elementSelector in originalNumbers)) {
            originalNumbers[elementSelector] = {
                originalValue: originalContent,
                elementSelector: elementSelector
            };
            existingSelectors.add(elementSelector);
        }
    });

    setOriginalFrameNumbers(originalNumbers);
}

function sortRowsByRenderPosition(rows, mainKey) {
    const adjustedPositions = [];

    rows.forEach(item => {
        let alreadyAdjusted = false;
        const currentPos = getResourceDataObject(mainKey, [item.techName, 'idForRenderPosition']);

        if (mainKey === 'techs') {
            const researchButton = item.row.querySelector('.input-container button');
            if (researchButton.textContent === "Researched" && currentPos < 10000) {
                adjustedPositions.push({
                    ...item,
                    adjustedPos: currentPos + 10000
                });
                alreadyAdjusted = true;
            }

            if (!researchButton.classList.contains('red-disabled-text')) {
                adjustedPositions.push({
                    ...item,
                    adjustedPos: currentPos - 10000
                });
                alreadyAdjusted = true;
            }
        }

        if (!alreadyAdjusted) {
            if (item.row.classList.contains('invisible')) {
                adjustedPositions.push({
                    ...item,
                    adjustedPos: currentPos + 10000
                });
            } else {
                if (currentPos > 10000) {
                    adjustedPositions.push({
                        ...item,
                        adjustedPos: currentPos - 10000
                    });
                } else {
                    adjustedPositions.push({
                        ...item,
                        adjustedPos: currentPos
                    });
                }
            }
        }

    });

    return adjustedPositions.sort((a, b) => a.adjustedPos - b.adjustedPos);
}

function updateClassesInRowsToRender() {
    const unsortedRows = getTemporaryRowsRepo('rows');

    unsortedRows.forEach(rowObj => { 
        const domElement = document.getElementById(rowObj.row.id);
        if (domElement) {
            const classList = domElement.classList;
            rowObj.classList = Array.from(classList);
        }
    });

    setTemporaryRowsRepo('noChange', unsortedRows);
}

function setEnergyUse() {
    const resourceData = getResourceDataObject('resources');
    const compoundData = getResourceDataObject('compounds');
    const researchData = getResourceDataObject('research', ['upgrades']);

    let totalEnergyUseResources = 0;
    let totalEnergyUseCompounds = 0;
    let totalEnergyUseResearch = 0;

    for (const resourceKey in resourceData) { //autobuyer resources upgrades
        const resource = resourceData[resourceKey];
        const autoBuyer = resource.upgrades?.autoBuyer;

        if (autoBuyer) {
            for (let tierKey of ['tier1', 'tier2', 'tier3', 'tier4']) {
                const tier = autoBuyer[tierKey];

                if (tier) {
                    const energyUse = tier.energyUse || 0;
                    const quantity = tier.quantity || 0;
                    totalEnergyUseResources += energyUse * quantity;
                }
            }
        }
    }

    for (const compoundKey in compoundData) { //autobuyer compounds upgrades
        const compound = compoundData[compoundKey];
        const autoBuyer = compound.upgrades?.autoBuyer;

        if (autoBuyer) {
            for (let tierKey of ['tier1', 'tier2', 'tier3', 'tier4']) {
                const tier = autoBuyer[tierKey];

                if (tier) {
                    const energyUse = tier.energyUse || 0;
                    const quantity = tier.quantity || 0;
                    totalEnergyUseCompounds += energyUse * quantity;
                }
            }
        }
    }

    for (const researchUpgradeKey in researchData) { //science upgrades
        const researchUpgrade = researchData[researchUpgradeKey];

        if (researchUpgrade) {
            const energyUse = researchUpgrade.energyUse || 0;
            const quantity = researchUpgrade.quantity || 0;
            totalEnergyUseResearch += energyUse * quantity;
        }
    }

    setTotalEnergyUse(totalEnergyUseResources + totalEnergyUseCompounds + totalEnergyUseResearch);
}

export function setEnergyCapacity(battery) {
    const currentEnergyCap = getResourceDataObject('buildings', ['energy', 'storageCapacity']);

    const battery1Cap = getResourceDataObject('buildings', ['energy', 'upgrades', 'battery1', 'capacity']);
    const battery2Cap = getResourceDataObject('buildings', ['energy', 'upgrades', 'battery2', 'capacity']);
    const battery3Cap = getResourceDataObject('buildings', ['energy', 'upgrades', 'battery3', 'capacity']);
    
    let newEnergyCap;

    switch (battery) {
        case 'battery1':
            newEnergyCap = currentEnergyCap + battery1Cap;
            break;
        case 'battery2':
            newEnergyCap = currentEnergyCap + battery2Cap;
            break;
        case 'battery3':
            newEnergyCap = currentEnergyCap + battery3Cap;
            break;
    }
    
    setResourceDataObject(newEnergyCap, 'buildings', ['energy', 'storageCapacity']);
}

function updateEnergyStat(element) {
    const totalRate = (getResourceDataObject('buildings', ['energy', 'rate']) * getTimerRateRatio()) - (getTotalEnergyUse() * getTimerRateRatio());
    if (getPowerOnOff()) {
        element.textContent = `${Math.floor(totalRate)} KW / s`;
    } else {
        element.textContent = `0 KW / s`;
    }
}

function getConstituentComponents(createCompoundDescriptionString) {
    let compoundToCreateQuantity = 0;
    let constituentPartQuantity1 = 0;
    let constituentPartName1 = '';
    let constituentPartQuantity2 = 0;
    let constituentPartName2 = '';
    let constituentPartQuantity3 = 0;
    let constituentPartName3 = '';
    let constituentPartQuantity4 = 0;
    let constituentPartName4 = '';

    // Main compound quantity
    const regexCompoundToCreate = /(\d+(?:\.\d+)?(?:[KMGTPE]?)?)\s*/;
    const matchCompound = createCompoundDescriptionString.match(regexCompoundToCreate);
    if (matchCompound) {
        compoundToCreateQuantity = matchCompound[1];
    } else {
        //console.log('No match found for compound quantity.');
    }
    
    // Constituent Part 1
    const regexConstituentPart1 = /\((\d+(?:\.\d+)?(?:[KMGTPE]?)?)\s*([a-zA-Z]+)/;

    const matchConstituentPart1 = createCompoundDescriptionString.match(regexConstituentPart1);
    if (matchConstituentPart1) {
        constituentPartQuantity1 = matchConstituentPart1[1];
        constituentPartName1 = matchConstituentPart1[2];
    }
    
    // Constituent Part 2
    const regexConstituentPart2 = /, (\d+(?:\.\d+)?(?:[KMGTPE]?)?)\s*([a-zA-Z]+)/
    const matchConstituentPart2 = createCompoundDescriptionString.match(regexConstituentPart2);
    if (matchConstituentPart2) {
        constituentPartQuantity2 = matchConstituentPart2[1];
        constituentPartName2 = matchConstituentPart2[2];
    }
    
    // Constituent Part 3
    const regexConstituentPart3 = /(?:, \d+(?:\.\d+)?(?:[KMGTPE]?)?\s*[a-zA-Z]+){1}\s*,\s*(\d+(?:\.\d+)?(?:[KMGTPE]?)?)\s*([a-zA-Z]+)/;
                                    
    const matchConstituentPart3 = createCompoundDescriptionString.match(regexConstituentPart3);
    if (matchConstituentPart3) {
        constituentPartQuantity3 = matchConstituentPart3[1];
        constituentPartName3 = matchConstituentPart3[2];
    }
    
    // Constituent Part 4
    const regexConstituentPart4 = /(?:, \d+(?:\.\d+)?(?:[KMGTPE]?)?\s*[a-zA-Z]+){2}\s*,\s*(\d+(?:\.\d+)?(?:[KMGTPE]?)?)\s*([a-zA-Z]+)/;
    const matchConstituentPart4 = createCompoundDescriptionString.match(regexConstituentPart4);
    if (matchConstituentPart4) {
        constituentPartQuantity4 = matchConstituentPart4[1];
        constituentPartName4 = matchConstituentPart4[2];
    }
    
    return {
        compoundToCreateQuantity,
        constituentPartQuantity1,
        constituentPartName1,
        constituentPartQuantity2,
        constituentPartName2,
        constituentPartQuantity3,
        constituentPartName3,
        constituentPartQuantity4,
        constituentPartName4
    };
}

function unpackConstituentPartsObject(constituentComponents) {
    if (constituentComponents.compoundToCreateQuantity) {
        constituentComponents.compoundToCreateQuantity = parseNumber(constituentComponents.compoundToCreateQuantity);
    }

    for (let i = 1; i <= 4; i++) {
        let quantityKey = `constituentPartQuantity${i}`;
        let quantityValue = constituentComponents[quantityKey];

        if (quantityValue && quantityValue !== 0) {
            // Convert the numeric string to a number
            constituentComponents[quantityKey] = parseNumber(quantityValue);
        }

        let nameKey = `constituentPartName${i}`;
        if (constituentComponents[nameKey]) {
            constituentComponents[nameKey] = constituentComponents[nameKey].toLowerCase();
        }
    }

    return constituentComponents;
}

function parseNumber(value) {
    if (typeof value !== 'string') {
        return value;
    }

    const unitMultipliers = {
        K: 1e3,
        M: 1e6,
        B: 1e9,
        T: 1e12,
        E: 1e18,
        P: 1e15
    };

    let match = value.match(/(\d+(?:\.\d+)?)([KMGTPE]?)?/);
    if (match) {
        let [_, numPart, unitPart] = match;
        let number = parseFloat(numPart.replace(',', ''));
        if (unitPart in unitMultipliers) {
            number *= unitMultipliers[unitPart];
        }
        return number;
    }

    return value;
}

function normalizeAllQuantities(allQuantities) {
    for (let key in allQuantities) {
        if (allQuantities[key] < 0) {
            let type = 'error';

            const resources = getResourceDataObject('resources');
            const compounds = getResourceDataObject('compounds');

            if (key in resources) {
                type = 'resources';
            } else if (key in compounds) {
                type = 'compounds';
            }

            allQuantities[key] = 0;
            setResourceDataObject(0, type, [key, 'quantity']);
        }
    }
    return allQuantities;
}

export function addBuildingPotentialRate(powerBuilding) {
    const powerBuildingObject = getResourceDataObject('buildings', ['energy', 'upgrades', powerBuilding]);
    const powerBuildingQuantity = powerBuildingObject['quantity'];
    const powerBuildingEnergyRatePerUnit = powerBuildingObject['rate'];

    const powerBuildingPotentialRate = powerBuildingQuantity * powerBuildingEnergyRatePerUnit;

    setResourceDataObject(powerBuildingPotentialRate, 'buildings', ['energy', 'upgrades', powerBuilding, 'purchasedRate']);
}

export function toggleBuildingTypeOnOff(building, activeStatus) { //flag building as switched on or off
    if (getBuildingTypeOnOff(building) !== activeStatus) {
        setBuildingTypeOnOff(building, activeStatus);
        //console.log(building + 'switched on (true) or off (false): ' + activeStatus);
    }
}

export function addOrRemoveUsedPerSecForFuelRate(fuelType, activateButtonElement, fuelCategory, buildingToCheck, trippedStatus) {
    let currentState;
    let newState;

    const totalFuelBurnForBuildingType = getResourceDataObject(fuelCategory, [fuelType, 'usedForFuelPerSec']);
    const currentFuelRate = getResourceDataObject(fuelCategory, [fuelType, 'rate']);

    if (activateButtonElement) { //if clicked
        switch(activateButtonElement.textContent) { //toggle text
            case 'Activate':
                currentState = false;
                activateButtonElement.textContent = 'Deactivate';
                activateButtonElement.classList.remove('red-disabled-text');
                activateButtonElement.classList.add('green-ready-text');
                newState = !currentState;
                break;
            case 'Deactivate':
                currentState = true;
                activateButtonElement.textContent = 'Activate';
                activateButtonElement.classList.remove('green-ready-text');
                newState = !currentState;
                break;
        }
    } else {
        if (!trippedStatus) {
            newState = 'fuelExhausted';
        } else {
            newState = 'tripped';
        }
    }

    const fuelExtractionRateTier1 = getResourceDataObject(fuelCategory, [fuelType, 'upgrades', 'autoBuyer', 'tier1', 'rate']) * getResourceDataObject(fuelCategory, [fuelType, 'upgrades', 'autoBuyer', 'tier1', 'quantity']);

    if (newState && newState !== 'fuelExhausted' && newState !== 'tripped' && newState !== 'regularUpdate') { //if activating by clicking button
        setResourceDataObject(currentFuelRate - totalFuelBurnForBuildingType, fuelCategory, [fuelType, 'rate']);
        setActivatedFuelBurnObject(fuelType, true);
        return true;
    } else if (newState === 'fuelExhausted') { //if just ran out of fuel
        if (getRanOutOfFuelWhenOn(buildingToCheck)) {
            setResourceDataObject(0 + fuelExtractionRateTier1, fuelCategory, [fuelType, 'rate']);
            setActivatedFuelBurnObject(fuelType, false);
        } else { //if just gained some fuel after running out
            setResourceDataObject(currentFuelRate - totalFuelBurnForBuildingType, fuelCategory, [fuelType, 'rate']);
            setActivatedFuelBurnObject(fuelType, true);
        }
    } else if (newState === 'tripped') { //if switches off when no battery and energy consumption becomes higher than generation ie purchase of autoBuyer
        setResourceDataObject(fuelExtractionRateTier1, fuelCategory, [fuelType, 'rate']);
        setActivatedFuelBurnObject(fuelType, false);
    } else { //if deactivating by clicking button
        setResourceDataObject(currentFuelRate + totalFuelBurnForBuildingType, fuelCategory, [fuelType, 'rate']);
        setActivatedFuelBurnObject(fuelType, false);
        return false;
    }
}

export function checkPowerBuildingsFuelLevels() {
    const powerBuildings = Object.fromEntries(Object.entries(getResourceDataObject('buildings', ['energy', 'upgrades'])).filter(([key]) => key.startsWith('power')));

    Object.keys(powerBuildings).forEach(powerBuilding => {
        const fuelType = getResourceDataObject('buildings', ['energy', 'upgrades', powerBuilding, 'fuel'])[0];
        const fuelCategory = getResourceDataObject('buildings', ['energy', 'upgrades', powerBuilding, 'fuel'])[2];
        const powerBuildingQuantity = getResourceDataObject('buildings', ['energy', 'upgrades', powerBuilding, 'quantity']);
        
        if (getResourceDataObject(fuelCategory, [fuelType, 'quantity']) <= 0 && powerBuildingQuantity > 0) { //if out of fuel
            toggleBuildingTypeOnOff(powerBuilding, false);
            startUpdateTimersAndRates(powerBuilding, 'toggle');
            setRanOutOfFuelWhenOn(powerBuilding, true);
            addOrRemoveUsedPerSecForFuelRate(fuelType, null, fuelCategory, powerBuilding, false);
        } else if (powerBuildingQuantity > 0) {
            if (getRanOutOfFuelWhenOn(powerBuilding)) {
                setRanOutOfFuelWhenOn(powerBuilding, false);
            }
        }
    });
}

export function offlineGains(switchedFocus) {
    const resourcesObject = getResourceDataObject('resources');
    const compoundsObject = getResourceDataObject('compounds');

    const resources = Object.keys(resourcesObject);
    const compounds = Object.keys(compoundsObject);

    const resourceValues = {};
    const compoundValues = {};
    const energyValues = {};
    const researchValues = {};

    resources.forEach(resource => {
        resourceValues[resource] = {
            rate: getResourceDataObject('resources', [resource, 'rate']),
            quantity: getResourceDataObject('resources', [resource, 'quantity']),
            storageCapacity: getResourceDataObject('resources', [resource, 'storageCapacity']),
        };
    });

    compounds.forEach(compound => {
        compoundValues[compound] = {
            rate: getResourceDataObject('compounds', [compound, 'rate']),
            quantity: getResourceDataObject('compounds', [compound, 'quantity']),
            storageCapacity: getResourceDataObject('compounds', [compound, 'storageCapacity']),
        };
    });

    const batteryBought = getResourceDataObject('buildings', ['energy', 'batteryBoughtYet']);
    energyValues.energy = {
        rate: batteryBought ? getResourceDataObject('buildings', ['energy', 'rate']) - getResourceDataObject('buildings', ['energy', 'consumption']) : 0,
        quantity: getResourceDataObject('buildings', ['energy', 'quantity']),
    };

    researchValues.research = {
        rate: getResourceDataObject('research', ['rate']),
        quantity: getResourceDataObject('research', ['quantity']),
    };

    const combinedValues = {
        rate: {
            resources: Object.fromEntries(Object.entries(resourceValues).map(([key, value]) => [key, value.rate])),
            compounds: Object.fromEntries(Object.entries(compoundValues).map(([key, value]) => [key, value.rate])),
            energy: energyValues.energy.rate,
            research: researchValues.research.rate,
        },
        quantity: {
            resources: Object.fromEntries(Object.entries(resourceValues).map(([key, value]) => [key, value.quantity])),
            compounds: Object.fromEntries(Object.entries(compoundValues).map(([key, value]) => [key, value.quantity])),
            energy: energyValues.energy.quantity,
            research: researchValues.research.quantity,
        },
    };

    const lastSavedTimeStamp = getLastSavedTimeStamp();
    const currentTimeStamp = new Date().toISOString();

    const timeDifferenceInSeconds = Math.floor(
        (new Date(currentTimeStamp).getTime() - new Date(lastSavedTimeStamp).getTime()) / 1000
    );

    const calculateOfflineGains = (data, multiplier = 1) => {
        return Object.fromEntries(
            Object.entries(data).map(([key, rate]) => [key, rate * multiplier * timeDifferenceInSeconds])
        );
    };

    const offlineGains = {
        resources: calculateOfflineGains(combinedValues.rate.resources, getTimerRateRatio()),
        compounds: calculateOfflineGains(combinedValues.rate.compounds, getTimerRateRatio()),
        energy: combinedValues.rate.energy * getTimerRateRatio() * timeDifferenceInSeconds,
        research: combinedValues.rate.research * getTimerRateRatio() * timeDifferenceInSeconds,
    };

    Object.entries(offlineGains.resources).forEach(([resource, gain]) => {
        const currentQuantity = getResourceDataObject('resources', [resource, 'quantity']);
        const storageCapacity = resourceValues[resource].storageCapacity;
        const finalQuantity = Math.min(currentQuantity + gain, storageCapacity);
        setResourceDataObject(finalQuantity, 'resources', [resource, 'quantity']);
    });

    Object.entries(offlineGains.compounds).forEach(([compound, gain]) => {
        const currentQuantity = getResourceDataObject('compounds', [compound, 'quantity']);
        const storageCapacity = compoundValues[compound].storageCapacity;
        const finalQuantity = Math.min(currentQuantity + gain, storageCapacity);
        setResourceDataObject(finalQuantity, 'compounds', [compound, 'quantity']);
    });

    const currentEnergyQuantity = getResourceDataObject('buildings', ['energy', 'quantity']);
    setResourceDataObject(currentEnergyQuantity + offlineGains.energy, 'buildings', ['energy', 'quantity']);

    const currentResearchQuantity = getResourceDataObject('research', ['quantity']);
    setResourceDataObject(currentResearchQuantity + offlineGains.research, 'research', ['quantity']);
    
    if (!switchedFocus) {
        showNotification('Offline Gains Added!', 'info');
    }

    //console.log('Offline Gains:', offlineGains);
    //console.log('Time Offline (seconds):', timeDifferenceInSeconds);
}

export function setAllCompoundsToZeroQuantity() {
    const compoundKeys = Object.keys(getResourceDataObject('compounds'));

    compoundKeys.forEach(compound => {
        setResourceDataObject(0, 'compounds', [compound, 'quantity']);
    });
}

export function buildLaunchPad() {
    let currentResource1Quantity;
    let currentResource2Quantity;
    let currentResource3Quantity;

    const buyLaunchPadButtonElement = document.querySelector('button[data-resource-to-fuse-to="launchPad"]');
    const buyLaunchPadDescriptionElement = document.getElementById('launchPadDescription');
    const launchPadAlreadyBoughtTextElement = document.getElementById('launchPadAlreadyBoughtText');

    const currentCash = getResourceDataObject('currency', ['cash']);
    const launchPadCashPrice = getResourceDataObject('space', ['upgrades', 'launchPad', 'price']);

    const launchPadResource1PriceQuantity = getResourceDataObject('space', ['upgrades', 'launchPad', 'resource1Price'])[0];
    const launchPadResource1PriceResource = getResourceDataObject('space', ['upgrades', 'launchPad', 'resource1Price'])[1];
    const launchPadResource1PriceCategory = getResourceDataObject('space', ['upgrades', 'launchPad', 'resource1Price'])[2];
    if (launchPadResource1PriceCategory) {
        currentResource1Quantity = getResourceDataObject(launchPadResource1PriceCategory, [launchPadResource1PriceResource, 'quantity']);
    }
    const launchPadResource2PriceQuantity = getResourceDataObject('space', ['upgrades', 'launchPad', 'resource2Price'])[0];
    const launchPadResource2PriceResource = getResourceDataObject('space', ['upgrades', 'launchPad', 'resource2Price'])[1];
    const launchPadResource2PriceCategory = getResourceDataObject('space', ['upgrades', 'launchPad', 'resource2Price'])[2];
    if (launchPadResource2PriceCategory) {
        currentResource2Quantity = getResourceDataObject(launchPadResource2PriceCategory, [launchPadResource2PriceResource, 'quantity']);
    }
    const launchPadResource3PriceQuantity = getResourceDataObject('space', ['upgrades', 'launchPad', 'resource3Price'])[0];
    const launchPadResource3PriceResource = getResourceDataObject('space', ['upgrades', 'launchPad', 'resource3Price'])[1];
    const launchPadResource3PriceCategory = getResourceDataObject('space', ['upgrades', 'launchPad', 'resource3Price'])[2];
    if (launchPadResource3PriceCategory) {
        currentResource3Quantity = getResourceDataObject(launchPadResource3PriceCategory, [launchPadResource3PriceResource, 'quantity']);
    }

    setResourceDataObject(Math.floor(currentCash - launchPadCashPrice), 'currency', ['cash']);

    if (launchPadResource1PriceCategory) {
        setResourceDataObject(Math.floor(currentResource1Quantity - launchPadResource1PriceQuantity), launchPadResource1PriceCategory, [launchPadResource1PriceResource, 'quantity']);
    }

    if (launchPadResource2PriceCategory) {
        setResourceDataObject(Math.floor(currentResource2Quantity - launchPadResource2PriceQuantity), launchPadResource2PriceCategory, [launchPadResource2PriceResource, 'quantity']);
    }

    if (launchPadResource3PriceCategory) {
        setResourceDataObject(Math.floor(currentResource3Quantity - launchPadResource3PriceQuantity), launchPadResource3PriceCategory, [launchPadResource3PriceResource, 'quantity']);
    }

    setResourceDataObject(true, 'space', ['upgrades', 'launchPad', 'launchPadBoughtYet']);

    buyLaunchPadButtonElement.classList.add('invisible');
    buyLaunchPadDescriptionElement.classList.add('invisible');
    launchPadAlreadyBoughtTextElement.classList.remove('invisible');
}

export function getBatteryLevel() {
    const totalBatteryCapacity = getResourceDataObject('buildings', ['energy', 'storageCapacity']);
    const totalBatteryCharge = getResourceDataObject('buildings', ['energy', 'quantity']);

    const batteryPercentage = (totalBatteryCharge / totalBatteryCapacity) * 100;
    return Math.min(100, Math.max(0, batteryPercentage));
}


//===============================================================================================================

export function setGameState(newState) {
    setGameStateVariable(newState);

    switch (newState) {
        case getGameVisibleActive():
            getElements().statsContainer.classList.remove('d-none');
            getElements().statsContainer.classList.add('d-flex');
            getElements().tabsContainer.classList.remove('d-none');
            getElements().tabsContainer.classList.add('d-flex');
            getElements().mainContainer.classList.remove('d-none');
            getElements().mainContainer.classList.add('d-flex');

            manageTabSpecificUi();
            break;
    }
}