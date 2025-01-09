import {
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
    setLosingEnergy,
    getLosingEnergy,
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
    setBeginGameStatus, 
    setGameStateVariable, 
    getBeginGameStatus, 
    getMenuState, 
    getGameVisibleActive, 
    getElements, 
    gameState, 
    getCurrentTab,
    getRevealedTechArray,
    getTechUnlockedArray,
    getResourceSalePreview,
    getCompoundSalePreview,
    getCompoundCreatePreview,
    getNotationType
} from './constantsAndGlobalVars.js';

import {
    getAutoBuyerTierLevel,
    getResourceDataObject,
    setResourceDataObject,
} from "./resourceDataObject.js";

import { 
    updateContent,
    sortTechRows,
    showNotification,
    showTabsUponUnlock,
    getTimeInStatCell
} from "./ui.js";

import { 
    capitaliseString
 } from './utilityFunctions.js';

//---------------------------------------------------------------------------------------------------------

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

//--------------------------------------------------------------------------------------------------------
const timerManager = new TimerManager();

export function startGame() {
    if (getBeginGameStatus()) {
        setBeginGameStatus(false);
    }
    setGameState(getGameVisibleActive());
    updateContent('Resources', `tab1`, 'intro');
    startInitialTimers();
    gameLoop();
}

export async function gameLoop() {
    if (gameState === getGameVisibleActive()) {
        const elements = document.querySelectorAll('.notation');

        showTabsUponUnlock();
        
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
        
        const revealRowsCheck = document.querySelectorAll('.option-row');
        revealRowsCheck.forEach((revealRowCheck) => {
            monitorRevealRowsChecks(revealRowCheck);
        });

        getBuildingTypes().forEach(type => {
            checkAndRevealNewBuildings(type);
        });

        monitorRevealCompoundsCheck();

        updateAllSalePricePreviews();
        updateAllCreatePreviews();

        while (deferredActions.length > 0) {
            const runDeferredJobs = deferredActions.shift();
            runDeferredJobs();
        }

        if (getCurrentOptionPane() === 'tech tree') {
            updateClassesInRowsToRender();

            const sortedRows = sortRowsByRenderPosition(getTemporaryRowsRepo('rows'), 'techs');
            const containerToRenderTo = getTemporaryRowsRepo('container');
        
            if (getTechRenderChange()) {
                setTechRenderCounter(getTechRenderCounter() + 1);
            
                if (getTechRenderCounter() >= 150) { //minimise interaction disruptions while sorting rows
                    sortedRows.forEach(item => containerToRenderTo.appendChild(item.row));
                    setTechRenderChange(false);
                    setTechRenderCounter(0);
                }
            }
        }

        setAllOriginalFrameNumberValues();

        elements.forEach(element => { //format numbers
            if (document.body.contains(element)) {
                if (element.classList.contains('sell-fuse-money')) {
                    setTempRowValue(element.innerHTML);
                    complexSellStringFormatter(element, getNotationType());
                } else {
                    formatAllNotationElements(element, getNotationType());
                }
            }
        });

        requestAnimationFrame(gameLoop);
    }
}

function checkAndRevealNewBuildings(type) {
    let elements;

    switch(type) {
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

    //stat8
    getTimeInStatCell();
}

export function fuseResource(resource, fuseTargets) {
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
            let fusionEfficiency = 1; // Default full efficiency

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

    for (const priceIncrease in priceIncreaseObject) {
        if (priceIncreaseObject.hasOwnProperty(priceIncrease)) {
            if (getCanAffordDeferred()) {
                const { currentPrice, setPriceTarget, typeOfResourceCompound } = priceIncreaseObject[priceIncrease];
                if (setPriceTarget.startsWith('science') || setPriceTarget.startsWith('power') || setPriceTarget.startsWith('battery')) {
                    setNewItemPrice(currentPrice, setPriceTarget, '');
                } else {
                    const tierMatch = setPriceTarget.match(new RegExp(`${priceIncrease}AB(\\d+)Price`));
                    if (tierMatch && tierMatch[1]) {
                        const tier = parseInt(tierMatch[1], 10);
                        setNewItemPrice(currentPrice, setPriceTarget, tier, typeOfResourceCompound);
                    }
                }
            }
        }
    }

    setItemsToIncreasePrice('clear');
}

function setNewItemPrice(currentPrice, elementName, tier, typeOfResourceCompound) {
    if (elementName) {
        const newPrice = Math.ceil(currentPrice * 1.15);

        if (elementName.startsWith('science')) {
            const strippedElementName = elementName.slice(0, -5);        
            setResourceDataObject(newPrice, 'research', ['upgrades', strippedElementName, 'price']);
        } else if (elementName.startsWith('power') || elementName.startsWith('battery')) {
            const strippedElementName = elementName.slice(0, -5);        
            setResourceDataObject(newPrice, 'buildings', ['energy', 'upgrades', strippedElementName, 'price']);
        } else {
            const itemName = elementName.replace(/([A-Z])/g, '-$1').toLowerCase().split('-')[0];
            if (typeOfResourceCompound === 'resource') {
                setResourceDataObject(newPrice, 'resources', [itemName, 'upgrades', 'autoBuyer', `tier${tier}`, 'price']);
            } else if (typeOfResourceCompound === 'compound') {
                setResourceDataObject(newPrice, 'compounds', [itemName, 'upgrades', 'autoBuyer', `tier${tier}`, 'price']); 
            }            
        }
    }
}

function checkAndDeductResources() {
    const deductObject = getItemsToDeduct();
    let deductAmount;
    let mainKey;

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

    const allQuantities = {};

    resourceKeys.forEach(resource => {
        const resourceName = resource;
        allQuantities[resourceName] = getResourceDataObject('resources', [resourceName, 'quantity']);
    });

    compoundKeys.forEach(compound => {
        const compoundName = compound;
        allQuantities[compoundName] = getResourceDataObject('compounds', [compoundName, 'quantity']);
    });

    allQuantities.energy = getResourceDataObject('buildings', ['energy', 'quantity']);
    allQuantities.battery1 = getResourceDataObject('buildings', ['energy', 'upgrades', 'battery1', 'quantity']);
    allQuantities.battery2 = getResourceDataObject('buildings', ['energy', 'upgrades', 'battery2', 'quantity']);
    allQuantities.battery3 = getResourceDataObject('buildings', ['energy', 'upgrades', 'battery3', 'quantity']);
    allQuantities.powerPlant1 = getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant1', 'quantity']);
    allQuantities.powerPlant2 = getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant2', 'quantity']);
    allQuantities.powerPlant3 = getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant3', 'quantity']);

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
        }
    });

    compoundsArray.forEach(compound => {
        if (!compoundNames.includes(compound[0])) {
            compoundNames.push(compound[0]);
            allElements[compound[0]] = getElements()[`${compound[0]}Quantity`];
        }
    });

    allElements.energy = getElements().energyQuantity;
    allElements.battery1 = getElements().battery1Quantity;
    allElements.battery2 = getElements().battery2Quantity;
    allElements.battery3 = getElements().battery3Quantity;
    allElements.powerPlant1 = getElements().powerPlant1Quantity;
    allElements.powerPlant2 = getElements().powerPlant2Quantity;
    allElements.powerPlant3 = getElements().powerPlant3Quantity;

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
        const resourceStoragePrice = getResourceDataObject('resources', [resourceName, 'storageCapacity']);

        const resourceAutoBuyerDescElement = document.getElementById(`${resourceName}AutoBuyerTier${tier}Description`);
        const resourceAutoBuyerPrice = getResourceDataObject('resources', [resourceName, 'upgrades', 'autoBuyer', `tier${tier}`, 'price']);

        elements[`${resourceName}IncreaseStorage`] = { element: resourceIncreaseStorageDescElement, price: resourceStoragePrice, string: `${capitaliseString(resourceName)}` };
        elements[`${resourceName}AutoBuyerTier${tier}`] = { element: resourceAutoBuyerDescElement, price: resourceAutoBuyerPrice, string: `${capitaliseString(resourceName)}` };
    });

    compoundTierPairs.forEach(([compoundName, tier]) => {
        const compoundIncreaseStorageDescElement = document.getElementById(`${compoundName}IncreaseContainerSizeDescription`);
        const compoundStoragePrice = getResourceDataObject('compounds', [compoundName, 'storageCapacity']);

        const resourceAutoBuyerDescElement = document.getElementById(`${compoundName}AutoBuyerTier${tier}Description`);
        const resourceAutoBuyerPrice = getResourceDataObject('compounds', [compoundName, 'upgrades', 'autoBuyer', `tier${tier}`, 'price']);

        elements[`${compoundName}IncreaseStorage`] = { element: compoundIncreaseStorageDescElement, price: compoundStoragePrice, string: `${capitaliseString(compoundName)}` };
        elements[`${compoundName}AutoBuyerTier${tier}`] = { element: resourceAutoBuyerDescElement, price: resourceAutoBuyerPrice, string: `${capitaliseString(compoundName)}` };
    });

    const scienceElements = getScienceResourceDescriptionElements();
    const buildingsElements = getBuildingResourceDescriptionElements();
    Object.assign(elements, scienceElements, buildingsElements);

    return elements;
}

function getScienceResourceDescriptionElements() {
    const scienceKitBuyDescElement = document.getElementById('scienceKitDescription');
    const scienceKitBuyPrice = getResourceDataObject('research', ['upgrades', 'scienceKit', 'price']);

    const scienceClubBuyDescElement = document.getElementById('openScienceClubDescription');
    const scienceClubBuyPrice = getResourceDataObject('research', ['upgrades', 'scienceClub', 'price']);

    const scienceLabBuyDescElement = document.getElementById('openScienceLabDescription');
    const scienceLabBuyPrice = getResourceDataObject('research', ['upgrades', 'scienceLab', 'price']);

    return {
        scienceKitBuy: { element: scienceKitBuyDescElement, price: scienceKitBuyPrice, string: getCurrencySymbol() },
        scienceClubBuy: { element: scienceClubBuyDescElement, price: scienceClubBuyPrice, string: getCurrencySymbol() },
        scienceLabBuy: { element: scienceLabBuyDescElement, price: scienceLabBuyPrice, string: getCurrencySymbol() },
    };
}

function getBuildingResourceDescriptionElements() {
    const battery1BuyDescElement = document.getElementById('sodiumIonBatteryDescription');
    const battery1BuyPrice = getResourceDataObject('buildings', ['energy', 'upgrades', 'battery1', 'price']);

    const battery2BuyDescElement = document.getElementById('battery2Description');
    const battery2BuyPrice = getResourceDataObject('buildings', ['energy', 'upgrades', 'battery2', 'price']);

    const battery3BuyDescElement = document.getElementById('battery3Description');
    const battery3BuyPrice = getResourceDataObject('buildings', ['energy', 'upgrades', 'battery3', 'price']);

    const powerPlant1BuyDescElement = document.getElementById('powerPlantDescription');
    const powerPlant1BuyPrice = getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant1', 'price']);

    const powerPlant2BuyDescElement = document.getElementById('solarPowerPlantDescription');
    const powerPlant2BuyPrice = getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant2', 'price']);

    const powerPlant3BuyDescElement = document.getElementById('advancedPowerPlantDescription');
    const powerPlant3BuyPrice = getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant3', 'price']);

    return {
        battery1Buy: { element: battery1BuyDescElement, price: battery1BuyPrice, string: getCurrencySymbol() },
        battery2Buy: { element: battery2BuyDescElement, price: battery2BuyPrice, string: getCurrencySymbol() },
        battery3Buy: { element: battery3BuyDescElement, price: battery3BuyPrice, string: getCurrencySymbol() },
        powerPlant1Buy: { element: powerPlant1BuyDescElement, price: powerPlant1BuyPrice, string: getCurrencySymbol() },
        powerPlant2Buy: { element: powerPlant2BuyDescElement, price: powerPlant2BuyPrice, string: getCurrencySymbol() },
        powerPlant3Buy: { element: powerPlant3BuyDescElement, price: powerPlant3BuyPrice, string: getCurrencySymbol() },
    };
}

function updateRates() {
    const resourceKeys = Object.keys(getResourceDataObject('resources'));
    const compoundKeys = Object.keys(getResourceDataObject('compounds'));

    let currentActualResourceRate;
    let currentActualCompoundRate;
    let currentActualResearchRate;

    for (const resourceName of resourceKeys) {
        const resourceRateElement = document.getElementById(resourceName + 'Rate');
        if (getPowerOnOff()) {
            currentActualResourceRate = getResourceDataObject('resources', [resourceName, 'rate']) * getTimerRateRatio();
        } else {
            currentActualResourceRate = (getResourceDataObject('resources', [resourceName, 'rate']) - getResourceDataObject('resources', [resourceName, 'ratePower'])) * getTimerRateRatio();
        }
        resourceRateElement.textContent = Math.floor(currentActualResourceRate) + ' / s';
    }

    for (const compoundName of compoundKeys) {
        const compoundRateElement = document.getElementById(compoundName + 'Rate');
        if (getPowerOnOff()) {
            currentActualCompoundRate = getResourceDataObject('compounds', [compoundName, 'rate']) * getTimerRateRatio();
        } else {
            currentActualCompoundRate = (getResourceDataObject('compounds', [compoundName, 'rate']) - getResourceDataObject('compounds', [compoundName, 'ratePower'])) * getTimerRateRatio();
        }
        compoundRateElement.textContent = Math.floor(currentActualCompoundRate) + ' / s';
    }

    if (getPowerOnOff()) {
        currentActualResearchRate = getResourceDataObject('research', ['rate']) * getTimerRateRatio();
    } else {
        currentActualResearchRate = (getResourceDataObject('research', ['rate']) - getResourceDataObject('research', ['ratePower'])) * getTimerRateRatio();
    }
    getElements().researchRate.textContent = Math.floor(currentActualResearchRate) + ' / s'; 
}

function updateUIQuantities(allQuantities, allStorages, allElements, allDescriptionElements) {
    for (const resourceOrCompound in allQuantities) {
        if (allQuantities.hasOwnProperty(resourceOrCompound)) {
            const quantity = allQuantities[resourceOrCompound];
            const storage = allStorages[resourceOrCompound];
            const element = allElements[resourceOrCompound];

            updateQuantityDisplays(element, quantity, storage, false);
        }
    }

    for (const allDescriptionElement in allDescriptionElements) {
        if (allDescriptionElements.hasOwnProperty(allDescriptionElement)) {
            const price = allDescriptionElements[allDescriptionElement].price;
            const costResourceOrCompoundName = allDescriptionElements[allDescriptionElement].string;
            const element = allDescriptionElements[allDescriptionElement].element;

            updateQuantityDisplays(element, price, costResourceOrCompoundName, true);
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

        console.log(`Showing UI for Tab ${currentTab}.`);
    } else {
        console.log(`No tab-specific UI to show for Tab ${currentTab}, but other tabs are hidden.`);
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

function monitorRevealRowsChecks(element) {
    if (element.classList.contains('invisible') && element.dataset.conditionCheck === 'techUnlock') { //reveal techs check
        if (getRevealedTechArray().includes(element.dataset.type)) {
            element.classList.remove('invisible');
            setTechRenderChange(true);
        } else if (!getRevealedTechArray().includes(element.dataset.type) && getResourceDataObject('research', ['quantity']) >= getResourceDataObject('techs', [element.dataset.type, 'appearsAt'])[0]) {
            element.classList.remove('invisible');
            setTechRenderChange(true);
            setRevealedTechArray(element.dataset.type);
        }
    } else if (element.dataset.conditionCheck === 'upgradeCheck' && element.dataset.type === 'autoBuyer') { //autobuyer reveal check
        const elementTier = parseInt(element.dataset.autoBuyerTier.slice(-1));
        if (getCurrentTab() === 1 && element.dataset.rowCategory === 'resource')  {
            if (elementTier > 0 ) {
                if (elementTier <= getAutoBuyerTierLevel(getCurrentOptionPane(), 'resources')) {
                    element.classList.remove('invisible');
                } else {
                    element.classList.add('invisible');
                }
            } else {
                element.classList.add('invisible');
            }
        } else if (getCurrentTab() === 4 && element.dataset.rowCategory === 'compound')  {
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
    const totalEnergyRate = getResourceDataObject('buildings', ['energy', 'rate']) * getTimerRateRatio();
    const totalEnergyConsumption = getTotalEnergyUse() * getTimerRateRatio();

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
        const match = valueText.match(/(-?\d+(\.\d+)?) kW \/ s/);
    
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
            } else {
                element.textContent = '• OFF';
                element.classList.add('red-disabled-text');
                element.classList.remove('green-ready-text');
            }
        } else {
            // Battery is purchased
            if (getResourceDataObject('buildings', ['energy', 'quantity']) > 0.00001) {
                element.textContent = '• ON';
                element.classList.remove('red-disabled-text');
                element.classList.add('green-ready-text');
            } else {
                element.textContent = '• OFF';
                element.classList.add('red-disabled-text');
                element.classList.remove('green-ready-text');
            }
        }
        
        return;
    }

    if (element.classList.contains('compound-cost-sell-check') && element.dataset && element.dataset.conditionCheck !== 'undefined' && element.dataset.resourcePriceObject !== 'undefined') {
        let compound = element.dataset.type;
        const type = element.dataset.type;

        if (compound === 'storage' || compound === 'autoBuyer') {
            compound = element.dataset.argumentCheckQuantity;
        }

        const checkQuantityString = element.dataset.argumentCheckQuantity;
        let quantity = getResourceDataObject('compounds', [checkQuantityString, 'quantity']);

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
                    setTextDescriptionClassesBasedOnButtonStates(element, 'create');
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
                element.classList.remove('red-disabled-text');
                setTextDescriptionClassesBasedOnButtonStates(element, 'create');
            }

            return;
        }

        let price;
        let mainKey;

        if (type === 'autoBuyer') {
            mainKey = 'compounds';
            const autoBuyerTier = element.dataset.autoBuyerTier;
            if (autoBuyerTier === 'tier0') return;
            price = getResourceDataObject(mainKey, [compound, 'upgrades', 'autoBuyer', autoBuyerTier, 'price']);
        } else if (element.dataset.type === "storage") {
            mainKey = 'compounds' //storageCapacity
            price = getResourceDataObject(mainKey, [compound, 'storageCapacity']);
            if (element.tagName.toLowerCase() !== 'button') {
                element.textContent = `${price} ${getResourceDataObject(mainKey, [compound, 'nameResource'])}`;
            }
        }

        if (element.dataset.conditionCheck === 'upgradeCheck' && quantity >= price) { 
            element.classList.remove('red-disabled-text');
        } else {
            element.classList.add('red-disabled-text');
        }

        if (getResourceDataObject('compounds', [compound, 'rate']) < 0) {
            getElements()[compound + 'Rate'].classList.add('red-disabled-text');
        } else {
            getElements()[compound + 'Rate'].classList.remove('red-disabled-text');
        }
    }

    if (element.classList.contains('resource-cost-sell-check') && element.dataset && element.dataset.conditionCheck !== 'undefined' && element.dataset.resourcePriceObject !== 'undefined') {
        let resource = element.dataset.type;
        const techName = element.dataset.type;
        const type = element.dataset.type;
        const resourceToFuseTo = element.dataset.resourceToFuseTo;

        //science / building upgrades
        const scienceUpgradeType = element.dataset.resourceToFuseTo;
        const buildingUpgradeType = element.dataset.resourceToFuseTo;

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
                    setTextDescriptionClassesBasedOnButtonStates(element, 'fuse');
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
                    setTextDescriptionClassesBasedOnButtonStates(element, 'green');
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
            price = getResourceDataObject(mainKey, ['upgrades', scienceUpgradeType, 'price']); //yes correct but bad naming
        } else if (type === 'energy') {
            mainKey = 'buildings';
            price = getResourceDataObject(mainKey, [resource, 'upgrades', buildingUpgradeType, 'price']);
        } else {
            if (element.dataset.type === "research") {
                mainKey = 'research';
                price = getResourceDataObject(mainKey, ['quantity']);
            } else if (element.dataset.type === "storage") {
                mainKey = 'resources' //storageCapacity
                price = getResourceDataObject(mainKey, [resource, 'storageCapacity']);
                if (element.tagName.toLowerCase() !== 'button') {
                    element.textContent = `${price} ${getResourceDataObject(mainKey, [resource, 'nameResource'])}`;
                }
            }
        }
        
        if (element.dataset.conditionCheck === 'upgradeCheck' && quantity >= price) { 
            element.classList.remove('red-disabled-text');
        } else {
            element.classList.add('red-disabled-text');
        }

        if (resource !== 'energy' && resource !== 'scienceUpgrade') {
            if (getResourceDataObject('resources', [resource, 'rate']) < 0) {
                getElements()[resource + 'Rate'].classList.add('red-disabled-text');
            } else {
                getElements()[resource + 'Rate'].classList.remove('red-disabled-text');
            }
        }
    }
}

export function setTextDescriptionClassesBasedOnButtonStates(element, type) {
    if (type === 'create') {
        const accompanyingLabel = element.parentElement.nextElementSibling.querySelector('label');
        if (accompanyingLabel.textContent.includes('!')) {  //over the storage limit for output compound
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

const updateQuantityDisplays = (element, data1, data2, desc) => {
    if (desc) {
        if (element && data2) {
            if (data2 === '€') {
                element.textContent = data1 + data2;
            } else if (data2 === getCurrencySymbol()) {
                element.textContent = data2 + data1;
            } else {
                element.textContent = data1 + ' ' + data2;
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
    } else {
        resourceType = itemType.slice(0, -1);
    }

    let currentResourceOrCompoundQuantity;

    if (item && item === 'techUnlock') {
        currentResourceOrCompoundQuantity = getResourceDataObject('techs', [incrementAmount, 'price']);
    } else if (item && item.startsWith('science')) {
        currentResourceOrCompoundQuantity = getResourceDataObject('research', ['upgrades', item, 'quantity']); 
    } else if ((item && item.startsWith('power')) || (item && item.startsWith('battery'))) {
        currentResourceOrCompoundQuantity = getResourceDataObject('buildings', ['energy', 'upgrades', item, 'quantity']);
    } else if (item && item === 'autoBuyer') {
        currentResourceOrCompoundQuantity = getResourceDataObject(itemType, [resourceCategory, 'upgrades', 'autoBuyer', tierAB, 'quantity']);
    } else {
        currentResourceOrCompoundQuantity = getResourceDataObject(itemType, [resourceCategory, 'quantity']);
    }

    if (ABOrTechPurchase) {
        if (ABOrTechPurchase === 'techUnlock') {
            setResourceDataObject(getResourceDataObject('research', ['quantity']) - currentResourceOrCompoundQuantity, 'research', ['quantity']);
        } else {
            setResourceDataObject(currentResourceOrCompoundQuantity + incrementAmount, itemType, [resourceCategory, 'upgrades', 'autoBuyer', tierAB, 'quantity']); //ab end up here should add to ab
        }
    } else {
        if (resourceType === 'scienceUpgrade') {
            setResourceDataObject(currentResourceOrCompoundQuantity + incrementAmount, 'research', ['upgrades', item, 'quantity']); 
        } else if (resourceType === 'energy') { 
            setResourceDataObject(currentResourceOrCompoundQuantity + incrementAmount, 'buildings', ['energy', 'upgrades', item, 'quantity']);
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
            if (currentResourceOrCompoundQuantity < storageCapacity) {
                getElements()[elementId].classList.remove('green-ready-text');
                setResourceDataObject(currentResourceOrCompoundQuantity + incrementAmount, itemType, [resourceCategory, 'quantity']);
            } else {
                setResourceDataObject(storageCapacity, itemType, [resourceCategory, 'quantity']);
            }
            return;
        } else if (resourceType === 'research') {
            getElements()[elementId].classList.remove('green-ready-text');
            setResourceDataObject(currentResourceOrCompoundQuantity + incrementAmount, 'research', ['quantity']);
        }
    }    

    let amountToDeduct;
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
    } else {
        itemObject = getResourceDataObject(itemType, [resourceCategory]);
    }
    
    if (ABOrTechPurchase) {
        amountToDeduct = itemObject.upgrades.autoBuyer[tierAB].price;
        itemSetNewPrice = itemObject.upgrades.autoBuyer[tierAB].setPrice;
    } else {
        amountToDeduct = itemObject.price;
        itemSetNewPrice = itemObject.setPrice;
    }

    let itemToDeductName;

    if (resourceCategory === 'scienceUpgrade' || resourceCategory === 'energy') {
        itemToDeductName = 'cash';
    } else {
        itemToDeductName = itemObject.screenName;
    } 

    //set resource to deduct
    setItemsToDeduct(itemToDeductName, amountToDeduct, itemType);
    setItemsToIncreasePrice(itemToDeductName, itemSetNewPrice, amountToDeduct);
}

export function increaseResourceStorage(elementId, resource, itemType) {
    const increaseFactor = getIncreaseStorageFactor();

    const amountToDeduct = getResourceDataObject(itemType, [resource, 'storageCapacity']);
    const resourceToDeductName = resource;

    //set resource to deduct
    setItemsToDeduct(resourceToDeductName, amountToDeduct, itemType);

    deferredActions.push(() => {
        const updatedStorageSize = getResourceDataObject(itemType, [resource, 'storageCapacity']) * increaseFactor;
        setResourceDataObject(updatedStorageSize, itemType, [resource, 'storageCapacity']);
        getElements()[elementId].classList.remove('green-ready-text');
    });
}

export function revealElement(elementId) {
    const element = document.getElementById(elementId);
    element.classList.remove('invisible');
}

export function startUpdateTimersAndRates(elementName, tier, itemType, action) {
    if (elementName.startsWith('science')) {
        startUpdateScienceTimers(elementName);
        return;
    }

    if (elementName.startsWith('power')) {
        startUpdateEnergyTimers(elementName, action);
        return;
    }

    //no battery condition needed

    let newExtractionRate;
    let newExtractionRatePower = getResourceDataObject(itemType, [elementName, 'ratePower']);

    const upgradeRatePerUnit = getResourceDataObject(itemType, [elementName, 'upgrades', 'autoBuyer', `tier${tier}`, 'rate']);
    
    if (getResourceDataObject(itemType, [elementName, 'upgrades', 'autoBuyer', `tier${tier}`, 'energyUse']) > 0) {
        newExtractionRatePower = getResourceDataObject(itemType, [elementName, 'ratePower']) + upgradeRatePerUnit;
    }
    
    newExtractionRate = getResourceDataObject(itemType, [elementName, 'rate']) + upgradeRatePerUnit;

    setResourceDataObject(newExtractionRate, itemType, [elementName, 'rate']);
    setResourceDataObject(newExtractionRatePower, itemType, [elementName, 'ratePower']);
    getElements()[`${elementName}Rate`].textContent = `${(newExtractionRate * getTimerRateRatio()).toFixed(1)} / s`;

    const timerName = `${elementName}AB${tier}`;
    if (!timerManager.getTimer(timerName)) {
        timerManager.addTimer(timerName, getTimerUpdateInterval(), () => {
            const currentQuantity = getResourceDataObject(itemType, [elementName, 'quantity']);
            const storageCapacity = getResourceDataObject(itemType, [elementName, 'storageCapacity']);
            const currentExtractionRate = getResourceDataObject(itemType, [elementName, 'rate']);
            const currentExtractionRateUnpowered = getResourceDataObject(itemType, [elementName, 'rate']) - getResourceDataObject(itemType, [elementName, 'ratePower']);
            if (getPowerOnOff()) {
                setResourceDataObject(Math.min(currentQuantity + currentExtractionRate, storageCapacity), itemType, [elementName, 'quantity']);
            } else {
                setResourceDataObject(Math.min(currentQuantity + currentExtractionRateUnpowered, storageCapacity), itemType, [elementName, 'quantity']);
            }
        });
    }
}

function startInitialTimers() {
    const resources = getResourceDataObject('resources');
    const compounds = getResourceDataObject('compounds');

    for (const resource in resources) {
        if (resources.hasOwnProperty(resource)) {
            const timerName = `${resource}AB${1}`;
            if (!timerManager.getTimer(timerName)) {
                timerManager.addTimer(timerName, getTimerUpdateInterval(), () => {
                    const currentQuantity = getResourceDataObject('resources', [resource, 'quantity']);
                    const storageCapacity = getResourceDataObject('resources', [resource, 'storageCapacity']);
                    let currentExtractionRate;
                    if (getPowerOnOff()) {
                        currentExtractionRate = getResourceDataObject('resources', [resource, 'rate']);
                    } else {
                        const aB1Rate = getResourceDataObject('resources', [resource, 'upgrades', 'autoBuyer', 'tier1', 'rate']) * getResourceDataObject('resources', [resource, 'upgrades', 'autoBuyer', 'tier1', 'quantity']);
                        currentExtractionRate = aB1Rate;
                    }
                    
                    setResourceDataObject(Math.min(currentQuantity + currentExtractionRate, storageCapacity), 'resources', [resource, 'quantity']);
                });
            }
        }
    }

    for (const compound in compounds) {
        if (compounds.hasOwnProperty(compound)) {
            const timerName = `${compound}AB${1}`;
            if (!timerManager.getTimer(timerName)) {
                timerManager.addTimer(timerName, getTimerUpdateInterval(), () => {
                    const currentQuantity = getResourceDataObject('compounds', [compound, 'quantity']);
                    const storageCapacity = getResourceDataObject('compounds', [compound, 'storageCapacity']);
                    const currentExtractionRate = getResourceDataObject('compounds', [compound, 'rate']);
                    
                    setResourceDataObject(Math.min(currentQuantity + currentExtractionRate, storageCapacity), 'compounds', [compound, 'quantity']);
                });
            }
        }
    }

    timerManager.addTimer('energy', getTimerUpdateInterval(), () => {
        let newEnergyRate = 0;
        const currentEnergyQuantity = getResourceDataObject('buildings', ['energy', 'quantity']);
        const batteryBought = getResourceDataObject('buildings', ['energy', 'batteryBoughtYet']);
        
        if (getResourceDataObject('buildings', ['energy', 'quantity']) <= getResourceDataObject('buildings', ['energy', 'storageCapacity'])) {
            if (getPowerOnOff()) {    
                if (getBuildingTypeOnOff('powerPlant1')) {
                    newEnergyRate += getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant1', 'purchasedRate'])
                }
                if (getBuildingTypeOnOff('powerPlant2')) {
                    newEnergyRate += getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant2', 'purchasedRate'])
                }
                if (getBuildingTypeOnOff('powerPlant3')) {
                    newEnergyRate += getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant3', 'purchasedRate'])
                }

                getElements().energyQuantity.classList.add('red-disabled-text');
                getElements().energyQuantity.classList.remove('green-ready-text');
                getElements().energyRate.textContent = `${Math.floor((newEnergyRate * getTimerRateRatio()) - (getTotalEnergyUse() * getTimerRateRatio()))} kW / s`;
            } else {
                getElements().energyQuantity.classList.remove('red-disabled-text');
                getElements().energyQuantity.classList.remove('green-ready-text');
                getElements().energyRate.textContent = `0 kW / s`;
            }
        } else {
            getElements().energyQuantity.classList.add('green-ready-text');
            getElements().energyQuantity.classList.remove('red-disabled-text');
        } 

        if (currentEnergyQuantity <= getResourceDataObject('buildings', ['energy', 'storageCapacity'])) {
            if (batteryBought) {
                const totalRate = newEnergyRate - getTotalEnergyUse();
                setResourceDataObject(getResourceDataObject('buildings', ['energy', 'quantity']) + totalRate, 'buildings', ['energy', 'quantity']);
                getElements().energyQuantity.classList.remove('red-disabled-text');
                getElements().energyQuantity.classList.remove('green-ready-text');
            }
        }

        const energyQuantity = getResourceDataObject('buildings', ['energy', 'quantity']);

        if (energyQuantity < 0) {
            setResourceDataObject(0, 'buildings', ['energy', 'quantity']);
        }

        setResourceDataObject(newEnergyRate, 'buildings', ['energy', 'rate']); 
        
        if (!batteryBought) {
            setPowerOnOff(newEnergyRate - getTotalEnergyUse() > 0);
        } else {
            setPowerOnOff(energyQuantity > 0.00001);
        }
    });
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

    if (!timerManager.getTimer('research')) {
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
    }
}

function startUpdateEnergyTimers(elementName, action) {
    if (elementName.startsWith('power')) {
        let newEnergyRate = 0;
        const powerBuildingPotentialPower = getResourceDataObject('buildings', ['energy', 'upgrades', elementName, 'purchasedRate']);
        
        if (action === 'toggle') {
            if (getBuildingTypeOnOff(elementName)) {
                getElements()[elementName + 'Rate'].textContent = `${powerBuildingPotentialPower * getTimerRateRatio()} kW / s`;
            } else {
                getElements()[elementName + 'Rate'].textContent = `0 kW / s`;
            }
        } else if (action === 'buy') {
            getElements()[elementName + 'Rate'].textContent = `${Math.floor(powerBuildingPotentialPower * getTimerRateRatio())} kW / s`;
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
                    return `${(number / Math.pow(10, exponent)).toFixed(1)}e${exponent}`;
                } else if (number >= 1e12) {
                    return `${(number / 1e12).toFixed(1)}e12`;
                } else if (number >= 1e9) {
                    return `${(number / 1e9).toFixed(1)}B`;
                } else if (number >= 1e6) {
                    return `${(number / 1e6).toFixed(1)}M`;
                } else if (number >= 1e3) {
                    return `${(number / 1e3).toFixed(1)}K`;
                } else {
                    if (element.dataset.conditionCheck === 'techUnlock' || element.dataset.type === 'building' ) {
                        return number;
                    } else {
                        return number.toFixed(0);
                    }
                }
            }                       
        });

        element.innerHTML = formattedContent;
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
        } else {
            if (capturedNumber >= 1e13) {
                let exponent = Math.floor(Math.log10(capturedNumber));
                formatted = `${(capturedNumber / Math.pow(10, exponent)).toFixed(1)}e${exponent}`;
            } else if (capturedNumber >= 1e12) {
                formatted = `${(capturedNumber / 1e12).toFixed(1)}e12`;
            } else if (capturedNumber >= 1e9) {
                formatted = `${(capturedNumber / 1e9).toFixed(1)}B`;
            } else if (capturedNumber >= 1e6) {
                formatted = `${(capturedNumber / 1e6).toFixed(1)}M`;
            } else if (capturedNumber >= 1e3) {
                formatted = `${(capturedNumber / 1e3).toFixed(1)}K`;
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
    const totalRate = (getResourceDataObject('buildings', ['energy', 'rate'])  * getTimerRateRatio()) - (getTotalEnergyUse() * getTimerRateRatio());
    if (getPowerOnOff()) {
        element.textContent = `${Math.floor(totalRate)} kW / s`;
    } else {
        element.textContent = `0 kW / s`;
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
        console.log('No match found for compound quantity.');
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
        console.log(building + 'switched on (true) or off (false): ' + activeStatus);
    }
}

export function addOrRemoveUsedPerSecForFuelRate(fuelType, activateButtonElement, fuelCategory, buildingToCheck) {
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
        newState = 'fuelExhausted';
    }

    const fuelExtractionRateTier1 = getResourceDataObject(fuelCategory, [fuelType, 'upgrades', 'autoBuyer', 'tier1', 'rate']) * getResourceDataObject(fuelCategory, [fuelType, 'upgrades', 'autoBuyer', 'tier1', 'quantity']);
    // const fuelExtractionRateTier2 = getResourceDataObject(fuelCategory, [fuelType, 'upgrades', 'autoBuyer', 'tier2', 'rate']) * getResourceDataObject(fuelCategory, [fuelType, 'upgrades', 'autoBuyer', 'tier2', 'quantity']);
    // const fuelExtractionRateTier3 = getResourceDataObject(fuelCategory, [fuelType, 'upgrades', 'autoBuyer', 'tier3', 'rate']) * getResourceDataObject(fuelCategory, [fuelType, 'upgrades', 'autoBuyer', 'tier3', 'quantity']);
    // const fuelExtractionRateTier4 = getResourceDataObject(fuelCategory, [fuelType, 'upgrades', 'autoBuyer', 'tier4', 'rate']) * getResourceDataObject(fuelCategory, [fuelType, 'upgrades', 'autoBuyer', 'tier4', 'quantity']);

    if (newState && newState !== 'fuelExhausted') { //if activating by clicking button
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
            startUpdateTimersAndRates(powerBuilding, null, null, 'toggle');
            setRanOutOfFuelWhenOn(powerBuilding, true);
            addOrRemoveUsedPerSecForFuelRate(fuelType, null, fuelCategory, powerBuilding);
        } else if (powerBuildingQuantity > 0) {
            if (getRanOutOfFuelWhenOn(powerBuilding)) {
                //toggleBuildingTypeOnOff(powerBuilding, true);
                //startUpdateTimersAndRates(powerBuilding, null, null, 'toggle');
                setRanOutOfFuelWhenOn(powerBuilding, false);
                //addOrRemoveUsedPerSecForFuelRate(fuelType, null, fuelCategory, powerBuilding);
            }
        }
    });
}

//===============================================================================================================

export function setGameState(newState) {
    console.log("Setting game state to " + newState);
    setGameStateVariable(newState);

    switch (newState) {
        case getMenuState():
            getElements().menu.classList.remove('d-none');
            getElements().menu.classList.add('d-flex');
            getElements().statsContainer.classList.remove('d-flex');
            getElements().statsContainer.classList.add('d-none');
            getElements().tabsContainer.classList.remove('d-flex');
            getElements().tabsContainer.classList.add('d-none');
            getElements().mainContainer.classList.remove('d-flex');
            getElements().mainContainer.classList.add('d-none');
            break;
        case getGameVisibleActive():
            getElements().menu.classList.remove('d-flex');
            getElements().menu.classList.add('d-none');
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