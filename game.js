import {
    getUnlockedResourcesArray,
    setUnlockedResourcesArray,
    getTechSpecificUIItemsArray,
    setTechSpecificUIItemsArray,
    setRevealedTechArray,
    getTimerRateRatio,
    getTimerUpdateInterval,
    getCurrencySymbol,
    setCurrencySymbol,
    setSalePreview,
    getResourcesToIncreasePrice,
    setResourcesToIncreasePrice,
    getResourcesToDeduct,
    setResourcesToDeduct,
    getCurrentOptionPane,
    setCurrentOptionPane,
    getIncreaseStorageFactor,
    setBeginGameStatus, 
    setGameStateVariable, 
    getBeginGameStatus, 
    getMenuState, 
    getGameVisibleActive, 
    getElements, 
    getLanguage, 
    gameState, 
    getCurrentTab,
    getLastScreenOpenRegister,
    getRevealedTechArray,
    getTechUnlockedArray,
    getResourceSalePreview
} from './constantsAndGlobalVars.js';

import {
    getResourceDataObject,
    setResourceDataObject,
} from "./resourceDataObject.js";

import { 
    sendNotificationIfActive
} from "./ui.js";

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
let deferredActions = [];

export function startGame() {
    if (getBeginGameStatus()) {
        setBeginGameStatus(false);
    }
    setGameState(getGameVisibleActive());

    gameLoop();
}

export async function gameLoop() {
    if (gameState === getGameVisibleActive()) {

        //Check and update what can afford to buy
        const elementsResourcesCheck = document.querySelectorAll('.resource-cost-sell-check');
        elementsResourcesCheck.forEach((elementResourceCheck) => {
            monitorResourceCostChecks(elementResourceCheck);
        });

        const revealRowsCheck = document.querySelectorAll('.option-row');
        revealRowsCheck.forEach((revealRowCheck) => {
            monitorRevealRowsChecks(revealRowCheck);
        });

        //updateAndIncrementQuantities
        const allQuantities = getAllQuantities();
        const allStorages = getAllStorages();
        const allResourceElements = getAllResourceElements();
        const allResourceDescElements = getAllResourceDescriptionElements();
        updateUIQuantities(allQuantities, allStorages, allResourceElements, allResourceDescElements);
        updateStats();

        if (getResourcesToDeduct() && Object.keys(getResourcesToDeduct()).length > 0) {
            checkAndDeductResources();
        }

        if (getResourcesToIncreasePrice() && Object.keys(getResourcesToIncreasePrice()).length > 0) {
            checkAndIncreasePrices();
        }

        updateAllSalePricePreviews();

        while (deferredActions.length > 0) { //mainly for increasing storage at the moment
            const runDeferredJobs = deferredActions.shift();
            runDeferredJobs();
        }

        requestAnimationFrame(gameLoop);
    }
}

function updateStats() {
    const cash = getResourceDataObject('currency', ['cash']);
    if (getCurrencySymbol() !== "€") {
        getElements().cashStat.textContent = `${getCurrencySymbol()}${cash.toFixed(2)}`;
    } else {
        getElements().cashStat.textContent = `${cash.toFixed(2) + getCurrencySymbol()}`;
    }
}

export function fuseResource(resource, fuseTo, ratio, resourceRowToShow) {
    const resourceString = getResourceDataObject('resources', [resource, 'nameResource']);
    const resourceQuantity = getResourceDataObject('resources', [resource, 'quantity']);

    const fuseToString = getResourceDataObject('resources', [fuseTo, 'nameResource']);
    const fuseToStorageCapacity = getResourceDataObject('resources', [fuseTo, 'storageCapacity']);
    const fuseToQuantity = getResourceDataObject('resources', [fuseTo, 'quantity']);

    let amountToDeductFromResource;
    let amountToAddToResource;
    let fuseData;
    let realAmountToAdd = 0;

    let lostQuantity = 0;

    if (!getUnlockedResourcesArray().includes(fuseTo)) {
        resourceRowToShow.classList.remove('invisible');
        setUnlockedResourcesArray(fuseTo);
        fuseData = getResourceSalePreview(resource);
        amountToDeductFromResource = parseInt(fuseData.match(/\((\d+)/)[1], 10);
        const amountToAdd = Math.ceil((amountToDeductFromResource * ratio) / 4);

        sendNotificationIfActive(
            `Discovered ${fuseToString} and made ${amountToAdd} ${fuseToString} from ${amountToDeductFromResource} ${resourceString}!`,
            'info'
        );
        setResourceDataObject(resourceQuantity - amountToDeductFromResource, 'resources', [resource, 'quantity']);
        setResourceDataObject(fuseToQuantity + amountToAdd, 'resources', [fuseTo, 'quantity']);
        return;
    } else {
        let randomEnergyLossFactor = 1;

        if (!getTechUnlockedArray().includes("fusionEfficiencyI")) {
            randomEnergyLossFactor = Math.random() * (0.30 - 0.20) + 0.30;
        } else if (!getTechUnlockedArray().includes("fusionEfficiencyII")) {
            randomEnergyLossFactor = Math.random() * (0.60 - 0.40) + 0.60;
        } else if (!getTechUnlockedArray().includes("fusionEfficiencyIII")) {
            randomEnergyLossFactor = Math.random() * (0.80 - 0.60) + 0.80;
        }

        if (getUnlockedResourcesArray().includes(fuseTo)) {
            fuseData = getResourceSalePreview(resource);

            amountToDeductFromResource = parseInt(fuseData.match(/\((\d+)/)[1], 10);
            amountToAddToResource = parseInt(fuseData.match(/->\s*(\d+)/)[1], 10);

            realAmountToAdd = Math.floor(amountToAddToResource * randomEnergyLossFactor);
            const energyLossFuseToQuantity = Math.floor(amountToAddToResource - realAmountToAdd);

            if (Math.abs(amountToDeductFromResource * ratio - amountToAddToResource) <= 1) {
                sendNotificationIfActive(
                    `Should Fuse ${amountToDeductFromResource} ${resourceString} into ${Math.floor(amountToDeductFromResource * ratio)} ${fuseToString}. Lost ${energyLossFuseToQuantity} ${fuseToString} as energy due to sub-optimal fusion efficiency, receive ${realAmountToAdd} ${fuseToString}`,
                    'info'
                );
            } else { ;
                const availableStorageFuseTo = fuseToStorageCapacity - fuseToQuantity; 
                lostQuantity = Math.max(realAmountToAdd - availableStorageFuseTo, 0);

                sendNotificationIfActive(
                    `Should Fuse ${amountToDeductFromResource} ${resourceString} into ${Math.floor(amountToDeductFromResource * ratio)} ${fuseToString}. Max available storage is for ${availableStorageFuseTo}.  Of those, ${energyLossFuseToQuantity} lost due to sub-optimal fusion efficiency. So receive ${realAmountToAdd - lostQuantity} ${fuseToString}`,
                    'warning'
                );
                
            }
        }
    }
    setResourceDataObject(resourceQuantity - amountToDeductFromResource, 'resources', [resource, 'quantity']);
    setResourceDataObject(fuseToQuantity + Math.min(fuseToStorageCapacity - fuseToQuantity, realAmountToAdd - lostQuantity), 'resources', [fuseTo, 'quantity']);
}

export function sellResource(resource) {
    const resourceQuantity = getResourceDataObject('resources', [resource, 'quantity']);
    const saleData = getResourceSalePreview(resource);

    const currentCash = getResourceDataObject('currency', ['cash']);
    const extractedValue = saleData.split('>')[1].split('<')[0].trim().slice(1);
    const cashRaised = parseFloat(extractedValue);
    const quantityToDeduct = parseInt(saleData.match(/\((\d+)/)[1], 10);

    setResourceDataObject(resourceQuantity - quantityToDeduct, 'resources', [resource, 'quantity']);
    setResourceDataObject(currentCash + cashRaised, 'currency', ['cash']);
}

function updateAllSalePricePreviews() {
    const currentScreen = getCurrentOptionPane();
    const resources = getResourceDataObject('resources');

    for (const resource in resources) {
        const fuseTo = resources[resource]?.['fuseTo1'];
    
        if (resource === currentScreen) {
            const dropDownElementId = resource + "SellSelectQuantity";
            setSalePreview(currentScreen, document.getElementById(dropDownElementId).value, fuseTo);
    
            const salePreviewString = getResourceSalePreview(resource);
            const salePreviewElementId = resources[resource]?.salePreviewElement;
            const salePreviewElement = document.getElementById(salePreviewElementId);
    
            if (salePreviewElement) {
                salePreviewElement.innerHTML = salePreviewString;
            }
        }
    }    
}

function checkAndIncreasePrices() {
    const priceIncreaseObject = getResourcesToIncreasePrice();

    for (const resource in priceIncreaseObject) {
        if (priceIncreaseObject.hasOwnProperty(resource)) {
            const { currentPrice, setPriceTarget } = priceIncreaseObject[resource];
            setNewResourcePrice(currentPrice, setPriceTarget);
        }
    }

    setResourcesToIncreasePrice('clear');
}

function setNewResourcePrice(currentPrice, setPriceTarget) {
    if (setPriceTarget) {
        let newPrice;

        switch (setPriceTarget) {
            case 'hydrogenAB1Price':
                newPrice = Math.ceil(currentPrice * 1.15);
                setResourceDataObject(newPrice, 'resources', ['hydrogen', 'upgrades', 'autoBuyer', 'tier1', 'price']);
                break;
            case 'heliumAB1Price':
                newPrice = Math.ceil(currentPrice * 1.15);
                setResourceDataObject(newPrice, 'resources', ['helium', 'upgrades', 'autoBuyer', 'tier1', 'price']);
                break;
            case 'carbonAB1Price':
                newPrice = Math.ceil(currentPrice * 1.15);
                setResourceDataObject(newPrice, 'resources', ['carbon', 'upgrades', 'autoBuyer', 'tier1', 'price']);
                break;
            case 'scienceKitPrice':
                newPrice = Math.ceil(currentPrice * 1.15);
                setResourceDataObject(newPrice, 'research', ['upgrades', 'scienceKit', 'price']);
                break;
            case 'scienceClubPrice':
                newPrice = Math.ceil(currentPrice * 1.15);
                setResourceDataObject(newPrice, 'research', ['upgrades', 'scienceClub', 'price']);
                break;
        }
    }
}

function checkAndDeductResources() {
    const deductObject = getResourcesToDeduct();
    let deductAmount;
    let mainKey;

    for (const resource in deductObject) {
        if (deductObject.hasOwnProperty(resource)) {
            const { deductQuantity } = deductObject[resource];

            if (typeof deductQuantity === 'function') {
                deductAmount = deductQuantity();
            } else {
                deductAmount = deductQuantity;
            }

            let currentQuantity;

            if (resource === 'cash') {
                mainKey = 'currency';
                currentQuantity = getResourceDataObject(mainKey, [resource]);
                setResourceDataObject(currentQuantity - deductAmount, mainKey, [resource]);
            } else if (resource === 'research') {
                mainKey = 'research';
                currentQuantity = getResourceDataObject(mainKey, ['quantity']);
                setResourceDataObject(currentQuantity - deductAmount, mainKey, ['quantity']);
            } else {
                mainKey = 'resources';
                currentQuantity = getResourceDataObject(mainKey, [resource, 'quantity']);
                setResourceDataObject(currentQuantity - deductAmount, mainKey, [resource, 'quantity']);
            }
        }
    }

    setResourcesToDeduct('clear');
}

function getAllQuantities() {
    const resourceKeys = Object.keys(getResourceDataObject('resources'));
    const allQuantities = {};

    resourceKeys.forEach(resource => {
        const resourceName = resource;
        allQuantities[resourceName] = getResourceDataObject('resources', [resourceName, 'quantity']);
    });

    // Manually assign quantities for non-resource keys
    allQuantities.research = getResourceDataObject('research', ['quantity']);
    allQuantities.scienceKit = getResourceDataObject('research', ['upgrades', 'scienceKit', 'quantity']);
    allQuantities.scienceClub = getResourceDataObject('research', ['upgrades', 'scienceClub', 'quantity']);

    return allQuantities;
}

function getAllStorages() {
    const resourceKeys = Object.keys(getResourceDataObject('resources'));
    const allStorages = {};

    resourceKeys.forEach(resource => {
        const resourceName = resource;
        allStorages[resourceName] = getResourceDataObject('resources', [resourceName, 'storageCapacity']);
    });

    allStorages.research = null;
    allStorages.scienceKit = null;
    allStorages.scienceClub = null;

    return allStorages;
}

function getAllResourceElements() {
    const hydrogenElement = getElements().hydrogenQuantity;
    const heliumElement = getElements().heliumQuantity;
    const carbonElement = getElements().carbonQuantity;
    const researchElement = getElements().researchQuantity;
    const scienceKitElement = document.getElementById('scienceKitQuantity');
    const scienceClubElement = document.getElementById('scienceClubQuantity');

    const allResourceElements = {
        hydrogen: hydrogenElement,
        helium: heliumElement,
        carbon: carbonElement,
        research: researchElement,
        scienceKit: scienceKitElement,
        scienceClub: scienceClubElement,
    };

    return allResourceElements;
}

function getAllResourceDescriptionElements() {
    const hydrogenIncreaseStorageDescElement = document.getElementById('hydrogenIncreaseContainerSizeDescription');
    const hydrogenStoragePrice = getResourceDataObject('resources', ['hydrogen', 'storageCapacity']);

    const hydrogenAutoBuyerTier1DescElement = document.getElementById('hydrogenCompressorDescription');
    const hydrogenAutoBuyerTier1Price = getResourceDataObject('resources', ['hydrogen', 'upgrades', 'autoBuyer', 'tier1', 'price']);

    const heliumIncreaseStorageDescElement = document.getElementById('heliumIncreaseContainerSizeDescription');
    const heliumStoragePrice = getResourceDataObject('resources', ['helium', 'storageCapacity']);

    const heliumAutoBuyerTier1DescElement = document.getElementById('atmosphereScraperDescription');
    const heliumAutoBuyerTier1Price = getResourceDataObject('resources', ['helium', 'upgrades', 'autoBuyer', 'tier1', 'price']);

    const carbonIncreaseStorageDescElement = document.getElementById('carbonIncreaseContainerSizeDescription');
    const carbonStoragePrice = getResourceDataObject('resources', ['carbon', 'storageCapacity']);

    const carbonAutoBuyerTier1DescElement = document.getElementById('carbonBurnerDescription');
    const carbonAutoBuyerTier1Price = getResourceDataObject('resources', ['carbon', 'upgrades', 'autoBuyer', 'tier1', 'price']);

    const scienceKitBuyDescElement = document.getElementById('scienceKitDescription');
    const scienceKitBuyPrice = getResourceDataObject('research', ['upgrades', 'scienceKit', 'price']);

    const scienceClubBuyDescElement = document.getElementById('openScienceClubDescription');
    const scienceClubBuyPrice = getResourceDataObject('research', ['upgrades', 'scienceClub', 'price']);

    const allResourceDescElements = {
        hydrogenIncreaseStorage: {element: hydrogenIncreaseStorageDescElement, price: hydrogenStoragePrice, string: ' Hydrogen'},
        hydrogenAutoBuyerTier1: {element: hydrogenAutoBuyerTier1DescElement, price: hydrogenAutoBuyerTier1Price, string: ' Hydrogen'},
        heliumIncreaseStorage: {element: heliumIncreaseStorageDescElement, price: heliumStoragePrice, string: ' Helium'},
        heliumAutoBuyerTier1: {element: heliumAutoBuyerTier1DescElement, price: heliumAutoBuyerTier1Price, string: ' Helium'},
        carbonIncreaseStorage: {element: carbonIncreaseStorageDescElement, price: carbonStoragePrice, string: ' Carbon'},
        carbonAutoBuyerTier1: {element: carbonAutoBuyerTier1DescElement, price: carbonAutoBuyerTier1Price, string: ' Carbon'},
        scienceKitBuy: {element: scienceKitBuyDescElement, price: scienceKitBuyPrice, string: getCurrencySymbol()},
        scienceClubBuy: {element: scienceClubBuyDescElement, price: scienceClubBuyPrice, string: getCurrencySymbol()},
    };

    return allResourceDescElements;
}

function updateUIQuantities(allQuantities, allStorages, allResourceElements, allResourceDescriptionElements) {
    for (const resource in allQuantities) {
        if (allQuantities.hasOwnProperty(resource)) {
            const quantity = allQuantities[resource];
            const storage = allStorages[resource];
            const element = allResourceElements[resource];

            updateDisplay(element, quantity, storage, false);
        }
    }

    for (const allResourceDescriptionElement in allResourceDescriptionElements) {
        if (allResourceDescriptionElements.hasOwnProperty(allResourceDescriptionElement)) {
            const price = allResourceDescriptionElements[allResourceDescriptionElement].price;
            const costResourceName = allResourceDescriptionElements[allResourceDescriptionElement].string;
            const element = allResourceDescriptionElements[allResourceDescriptionElement].element;

            updateDisplay(element, price, costResourceName, true);
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

function monitorRevealRowsChecks(element) {
    if (element.classList.contains('invisible') && element.dataset.conditionCheck === 'techUnlock') { //unrevealed techs
        if (getRevealedTechArray().includes(element.dataset.argumentToPass1)) {
            element.classList.remove('invisible');
        } else if (!getRevealedTechArray().includes(element.dataset.argumentToPass1) && getResourceDataObject('research', ['quantity']) >= getResourceDataObject('techs', [element.dataset.argumentToPass1, 'appearsAt'])[0]) {
            element.classList.remove('invisible');
            setRevealedTechArray(element.dataset.argumentToPass1);
        }
    }
}

function monitorResourceCostChecks(element) {
    if (element.dataset && element.dataset.conditionCheck !== 'undefined' && element.dataset.resourcePriceObject !== 'undefined') {
        //FUSE
        let resource = element.dataset.resourceName;
        const resourceToFuseTo = element.dataset.resourceToFuseTo;
        //

        //TECH
        const techName = element.dataset.techName;
        //

        //BOTTOM PART
        const type = element.dataset.type;
        //

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

        if(element.classList.contains('fuse') || element.dataset.conditionCheck === 'fuseResource') {

            if (getTechUnlockedArray().includes(resource + 'Fusion') && getUnlockedResourcesArray().includes(resourceToFuseTo)) {
                element.classList.remove('invisible'); 
            }

            if (getTechUnlockedArray().includes(resource + 'Fusion') && quantity > 0) {
                element.classList.remove('red-disabled-text');
                if (element.tagName.toLowerCase() === 'button') {
                    const accompanyingLabel = element.parentElement.nextElementSibling.querySelector('label');
                    if (accompanyingLabel.textContent.includes('!!')) {
                        accompanyingLabel.classList.remove('warning-orange-text');
                        accompanyingLabel.classList.add('red-disabled-text');
                    } else if (accompanyingLabel.textContent.includes('!')) {  //over the storage limit for output element
                        element.classList.add('warning-orange-text');
                        //accompanyingLabel.remove('red-disabled-text');
                        accompanyingLabel.classList.add('warning-orange-text');
                    } else {
                        element.classList.remove('warning-orange-text');
                        accompanyingLabel.classList.remove('warning-orange-text');
                        accompanyingLabel.classList.remove('red-disabled-text');
                    }
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
            const prerequisite = getResourceDataObject('techs', [techName, 'appearsAt'])[1];  
            const prerequisiteSpan = element.querySelector('span');
            
            if (getTechUnlockedArray().includes(prerequisite)) {
                
                if (prerequisiteSpan) {
                    prerequisiteSpan.classList.remove('red-disabled-text');
                    prerequisiteSpan.classList.add('green-ready-text');
                }
            }

            if (!element.classList.contains('unlocked-tech') && !getTechUnlockedArray().includes(techName)) {
                if (quantity >= getResourceDataObject('techs', [techName, 'price'])) {
                    if ((getTechUnlockedArray().includes(prerequisite) || prerequisite === null) && element.tagName.toLowerCase() === 'button') {
                        element.classList.remove('red-disabled-text');
                    } else if (element.tagName.toLowerCase() !== 'button') {
                        element.classList.remove('red-disabled-text');
                    }
                } else {
                    element.classList.add('red-disabled-text');
                }
            } else {
                if (element.tagName.toLowerCase() === 'button') {
                    const accompanyingLabel = element.parentElement.nextElementSibling.querySelector('label');
                    accompanyingLabel.classList.remove('red-disabled-text');
                    accompanyingLabel.classList.add('unlocked-tech');
                    accompanyingLabel.classList.add('green-ready-text');
                    accompanyingLabel.textContent = 'Researched';
                    accompanyingLabel.style.pointerEvents = 'none';
                }
                element.classList.remove('red-disabled-text');
                element.classList.add('green-ready-text');
                element.textContent = 'Researched';
                element.style.pointerEvents = 'none';
            }
            return;
        }        

        let price;
        let mainKey;

        if (type === 'autoBuyer') {
            mainKey = 'resources';
            const autoBuyerTier = element.dataset.autoBuyerTier;
            price = getResourceDataObject(mainKey, [resource, 'upgrades', 'autoBuyer', autoBuyerTier, 'price']);
        } else {
            if (element.dataset.argumentToPass1 === "research") {
                mainKey = 'research';
                price = getResourceDataObject(mainKey, ['quantity']);
            } else if (element.dataset.argumentToPass1 === "storage") {
                mainKey = 'resources' //.storageCapacity
                price = getResourceDataObject(mainKey, [resource, 'storageCapacity']);
            }
        }
        
        // Perform the check and update the element's class
        if (element.dataset.conditionCheck === 'upgradeCheck' && quantity >= price) { 
            element.classList.remove('red-disabled-text');
        } else {
            element.classList.add('red-disabled-text');
        }
        
    }
}

const updateDisplay = (element, data1, data2, desc) => {
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
        if (element && data2) {
            element.textContent = Math.floor(data1) + '/' + Math.floor(data2);
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

export function gain(incrementAmount, elementId, resource, ABOrTechPurchase, tierAB, resourceCategory) {
    let resourceType;

    if (resourceCategory === 'research') {
        resourceType = 'research';
    } else if (resourceCategory === 'techs') { 
        resourceType = 'techs';
    } else if (resourceCategory === 'scienceUpgrade') { 
        resourceType = 'scienceUpgrade';
    } else {
        resourceType = 'resource'; 
    }

    let currentResourceQuantity;

    if (resource && resource === 'techUnlock') {
        currentResourceQuantity = getResourceDataObject('techs', [incrementAmount, 'price']);
    } else if (resource === 'scienceKit') {
        currentResourceQuantity = getResourceDataObject('research', ['upgrades', 'scienceKit', 'quantity']); 
    } else if (resource === 'scienceClub') {
        currentResourceQuantity = getResourceDataObject('research', ['upgrades', 'scienceClub', 'quantity']); 
    } else if (resource === 'autoBuyer') {
        currentResourceQuantity = getResourceDataObject('resources', [resourceCategory, 'upgrades', 'autoBuyer', tierAB, 'quantity']);
    } else {
        currentResourceQuantity = getResourceDataObject('resources', [resourceCategory, 'quantity']);
    }

    if (ABOrTechPurchase) {
        if (ABOrTechPurchase === 'techUnlock') {
            setResourceDataObject(getResourceDataObject('research', ['quantity']) - currentResourceQuantity, 'research', ['quantity']);
        } else {
            setResourceDataObject(currentResourceQuantity + incrementAmount, 'resources', [resourceCategory, 'quantity']);
        }
    } else {
        if (resourceType === 'scienceUpgrade') {
            setResourceDataObject(currentResourceQuantity + incrementAmount, 'research', ['upgrades', resource, 'quantity']); 
        } else if (resourceType === 'resource' && currentResourceQuantity < getResourceDataObject('resources', [resourceCategory, 'storageCapacity'])) { //buying upgrades affecting standard resources with storage like hydrogen
            getElements()[elementId].classList.remove('green-ready-text');
            setResourceDataObject(currentResourceQuantity + incrementAmount, 'resources', [resourceCategory, 'quantity']);
            return;
        } else if (resourceType === 'resource' && currentResourceQuantity >= getResourceDataObject('resources', [resourceCategory, 'storageCapacity'])) {
            setResourceDataObject(getResourceDataObject('resources', [resourceCategory, 'storageCapacity']), 'resources', [resourceCategory, 'quantity']);
        } else if (resourceType === 'research') {
            getElements()[elementId].classList.remove('green-ready-text');
            setResourceDataObject(currentResourceQuantity + incrementAmount, 'research', ['quantity']);
        }
    }

    let amountToDeduct;
    let resourceSetNewPrice;

    let resourceObject;
    if (resourceCategory === 'research') {
        resourceObject = getResourceDataObject('research', ['upgrades', resource]);
    } else if (resourceCategory === 'techs') {
        return;
    } else if (resourceCategory === 'scienceUpgrade') {
        resourceObject = getResourceDataObject('research', ['upgrades', resource]);
    } else {
        resourceObject = getResourceDataObject('resources', [resourceCategory]);
    }
    
    if (ABOrTechPurchase) {
        amountToDeduct = resourceObject.upgrades.autoBuyer[tierAB].price;
        resourceSetNewPrice = resourceObject.upgrades.autoBuyer[tierAB].setPrice;
    } else {
        amountToDeduct = resourceObject.price;
        resourceSetNewPrice = resourceObject.setPrice;
    }

    let resourceToDeductName;

    if (resourceCategory === 'scienceUpgrade') {
        resourceToDeductName = 'cash';
    } else {
        resourceToDeductName = resourceObject.screenName;
    } 

    //set resource to deduct
    setResourcesToDeduct(resourceToDeductName, amountToDeduct);
    setResourcesToIncreasePrice(resourceToDeductName, resourceSetNewPrice, amountToDeduct);
}

export function increaseResourceStorage(elementId, resource) {
    const increaseFactor = getIncreaseStorageFactor();

    const amountToDeduct = getResourceDataObject('resources', [resource, 'storageCapacity']);
    const resourceToDeductName = resource;

    //set resource to deduct
    setResourcesToDeduct(resourceToDeductName, amountToDeduct);

    deferredActions.push(() => {
        const updatedStorageSize = getResourceDataObject('resources', [resource, 'storageCapacity']) * increaseFactor;
        setResourceDataObject(updatedStorageSize, 'resources', [resource, 'storageCapacity']);
        getElements()[elementId].classList.remove('green-ready-text');
    });
}

export function revealElement(elementId) {
    const element = document.getElementById(elementId);
    element.classList.remove('invisible');
}

export function startUpdateAutoBuyerTimersAndRates(timerName) {
    if (timerName === 'hydrogenAB1') {
        const rateHydrogenAB1 = getResourceDataObject('resources', ['hydrogen', 'upgrades', 'autoBuyer', 'tier1', 'rate']);
        const hydrogenRate = getResourceDataObject('resources', ['hydrogen', 'rate']) + rateHydrogenAB1;
        setResourceDataObject(hydrogenRate, 'resources', ['hydrogen', 'rate']);

        getElements().hydrogenRate.textContent = `${(getResourceDataObject('resources', ['hydrogen', 'upgrades', 'autoBuyer', 'tier1', 'rate']) * getTimerRateRatio()).toFixed(1)} / s`;
        if (!timerManager.getTimer('hydrogenAB1')) {
            timerManager.addTimer('hydrogenAB1', getTimerUpdateInterval(), () => {
                const currentHydrogen = getResourceDataObject('resources', ['hydrogen', 'quantity']);
                const hydrogenStorage = getResourceDataObject('resources', ['hydrogen', 'storageCapacity']);
                setResourceDataObject(Math.min(currentHydrogen + hydrogenRate, hydrogenStorage), 'resources', ['hydrogen', 'quantity']);
            });
        }
    } else if (timerName === 'heliumAB1') {
        const rateHeliumAB1 = getResourceDataObject('resources', ['helium', 'upgrades', 'autoBuyer', 'tier1', 'rate']);
        const heliumRate = getResourceDataObject('resources', ['helium', 'rate']) + rateHeliumAB1;
        setResourceDataObject(heliumRate, 'resources', ['helium', 'rate']);

        getElements().heliumRate.textContent = `${(getResourceDataObject('resources', ['helium', 'upgrades', 'autoBuyer', 'tier1', 'rate']) * getTimerRateRatio()).toFixed(1)} / s`;
        if (!timerManager.getTimer('heliumAB1')) {
            timerManager.addTimer('heliumAB1', getTimerUpdateInterval(), () => {
                const currentHelium = getResourceDataObject('resources', ['helium', 'quantity']);
                const heliumStorage = getResourceDataObject('resources', ['helium', 'storageCapacity']);
                setResourceDataObject(Math.min(currentHelium + heliumRate, heliumStorage), 'resources', ['helium', 'quantity']);
            });
        }
    } else if (timerName === 'carbonAB1') {
        const rateCarbonAB1 = getResourceDataObject('resources', ['carbon', 'upgrades', 'autoBuyer', 'tier1', 'rate']);
        const carbonRate = getResourceDataObject('resources', ['carbon', 'rate']) + rateCarbonAB1;
        setResourceDataObject(carbonRate, 'resources', ['carbon', 'rate']);

        getElements().carbonRate.textContent = `${(getResourceDataObject('resources', ['carbon', 'upgrades', 'autoBuyer', 'tier1', 'rate']) * getTimerRateRatio()).toFixed(1)} / s`;
        if (!timerManager.getTimer('carbonAB1')) {
            timerManager.addTimer('carbonAB1', getTimerUpdateInterval(), () => {
                const currentCarbon = getResourceDataObject('resources', ['carbon', 'quantity']);
                const carbonStorage = getResourceDataObject('resources', ['carbon', 'storageCapacity']);
                setResourceDataObject(Math.min(currentCarbon + carbonRate, carbonStorage), 'resources', ['carbon', 'quantity']);
            });
        }
    } else if (timerName === 'scienceKit') {
        const rateScienceKit = getResourceDataObject('research', ['upgrades', 'scienceKit', 'rate']);
        const researchRate = getResourceDataObject('research', ['rate']) + rateScienceKit;
        setResourceDataObject(researchRate, 'research', ['rate']);
        
        getElements().researchRate.textContent = `${(getResourceDataObject('research', ['rate']) * getTimerRateRatio()).toFixed(1)} / s`;
        if (!timerManager.getTimer('research')) {
            timerManager.addTimer('research', getTimerUpdateInterval(), () => {
                const currentResearchQuantity = getResourceDataObject('research', ['quantity']);
                const currentResearchRate = getResourceDataObject('research', ['rate']);
                setResourceDataObject((currentResearchQuantity + currentResearchRate), 'research', ['quantity']);
            });
        }
    } else if (timerName === 'scienceClub') {
        const rateScienceClub = getResourceDataObject('research', ['upgrades', 'scienceClub', 'rate']);
        const researchRate = getResourceDataObject('research', ['rate']) + rateScienceClub;
        setResourceDataObject(researchRate, 'research', ['rate']);

        getElements().researchRate.textContent = `${(getResourceDataObject('research', ['rate']) * getTimerRateRatio()).toFixed(1)} / s`;
        if (!timerManager.getTimer('research')) {
            timerManager.addTimer('research', getTimerUpdateInterval(), () => {
                const currentResearchQuantity = getResourceDataObject('research', ['quantity']);
                const currentResearchRate = getResourceDataObject('research', ['rate']);
                setResourceDataObject((currentResearchQuantity + currentResearchRate), 'research', ['quantity']);
            });
        } else {

        }
    }
}

// export function toggleTimer(key, buttonId) {
//     const timer = timerManager.getTimer(key);
//     if (timer) {
//         const button = document.getElementById(buttonId);
//         if (timer.timerId) {
//             timer.stop();
//             button.textContent = `Resume ${capitaliseString(key)}`;
//         } else {
//             timer.start();
//             button.textContent = `Pause ${capitaliseString(key)}`;
//         }
//     }
// }

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