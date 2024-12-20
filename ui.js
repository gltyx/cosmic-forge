import {
    deferredActions,
    getCanAffordDeferred,
    setCanAffordDeferred,
    getTemporaryRowsRepo,
    setTemporaryRowsRepo,
    setTechSpecificUIItemsArray,
    getRevealedTechArray,
    setRevealedTechArray,
    setTechUnlockedArray,
    getDebugVisibilityArray,
    getTechUnlockedArray,
    getTimerRateRatio,
    getLastScreenOpenRegister,
    setLastScreenOpenRegister,
    getResourceSalePreview,
    setSalePreview,
    setCurrentOptionPane,
    getNotationType,
    setNotationType,
    getNotificationsToggle,
    setNotificationsToggle,
    setCurrentTab,
    getCurrentTab,
    getLanguage,
    setElements,
    getElements,
    setBeginGameStatus,
    getGameInProgress,
    setGameInProgress,
    getGameVisibleActive,
    getMenuState,
    getLanguageSelected,
    setLanguageSelected,
    setLanguage,
    setCurrencySymbol,
    getCurrencySymbol,
    getCurrentOptionPane
} from './constantsAndGlobalVars.js';
import {
    getResourceDataObject,
} from "./resourceDataObject.js";
import {
    getHeaderDescriptions,
    getOptionDescription,
} from "./descriptions.js";

import {
    //updateOriginalValue,
    setTextDescriptionClassesBasedOnButtonStates,
    startUpdateAutoBuyerTimersAndRates,
    fuseResource,
    sellResource,
    increaseResourceStorage,
    gain,
    setGameState,
    startGame
} from './game.js';

import {
    initLocalization,
    localize
} from './localization.js';

import { 
    capitaliseString 
} from './utilityFunctions.js';

let notificationContainer;

document.addEventListener('DOMContentLoaded', async () => {
    setElements();

    notificationContainer = getElements().notificationContainer;
    // Event listeners
    getElements().newGameMenuButton.addEventListener('click', async () => {
        setBeginGameStatus(true);
        if (!getGameInProgress()) {
            setGameInProgress(true);
        }
        setGameState(getGameVisibleActive());
        //PRE GAME START CODE HERE AFTER NEW GAME CLICKED
        startGame();
    });

    document.querySelectorAll('.collapsible-header').forEach(header => {
        header.addEventListener('click', function () {
            const content = this.nextElementSibling;
            content.classList.toggle('open');
            this.classList.toggle('active');
        });
    });

    setGameState(getMenuState());
    handleLanguageChange(getLanguageSelected());

    let fuseButton;

    document.querySelectorAll('[class*="tab1"][class*="option1"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab1', 'hydrogen');
            setCurrentOptionPane(this.textContent);
            updateContent(this.textContent, 'tab1');
            fuseButton = document.querySelector('button.fuse');
            setTextDescriptionClassesBasedOnButtonStates(fuseButton, 'fuse');
        });
    });
    
    document.querySelectorAll('[class*="tab1"][class*="option2"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab1', 'helium');
            setCurrentOptionPane(this.textContent);
            updateContent(this.textContent, 'tab1');
            fuseButton = document.querySelector('button.fuse');
            setTextDescriptionClassesBasedOnButtonStates(fuseButton, 'fuse');
        });
    });

    document.querySelectorAll('[class*="tab1"][class*="option3"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab1', 'carbon');
            setCurrentOptionPane(this.textContent);
            updateContent(this.textContent, 'tab1');
            fuseButton = document.querySelector('button.fuse');
            setTextDescriptionClassesBasedOnButtonStates(fuseButton, 'fuse');
        });
    });

    document.querySelectorAll('[class*="tab1"][class*="option4"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab1', 'oxygen');
            setCurrentOptionPane(this.textContent);
            updateContent(this.textContent, 'tab1');
            fuseButton = document.querySelector('button.fuse');
            setTextDescriptionClassesBasedOnButtonStates(fuseButton, 'fuse');
        });
    });

    document.querySelectorAll('[class*="tab2"][class*="option1"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab2', 'research');
            setCurrentOptionPane(this.textContent);
            updateContent(this.textContent, 'tab2');
        });
    });
    
    document.querySelectorAll('[class*="tab2"][class*="option2"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab2', 'tech tree');
            setCurrentOptionPane(this.textContent);
            updateContent(this.textContent, 'tab2');
        });
    });
    
    document.querySelectorAll('[class*="tab8"][class*="option1"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab8', 'visual');
            setCurrentOptionPane(this.textContent);
            updateContent(this.textContent, 'tab8');
        });
    });
    
    document.querySelectorAll('[class*="tab8"][class*="option2"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab8', 'option2');
            setCurrentOptionPane(this.textContent);
            updateContent(this.textContent, 'tab8');
        });
    });
    
    document.querySelectorAll('[class*="tab8"][class*="option3"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab8', 'option3');
            setCurrentOptionPane(this.textContent);
            updateContent(this.textContent,'tab8');
        });
    });
    
    document.querySelectorAll('[class*="tab8"][class*="option4"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab8', 'option4');
            setCurrentOptionPane(this.textContent);
            updateContent(this.textContent, 'tab8');
        });
    });

    const tabs = document.querySelectorAll('#tabsContainer .tab');
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            setCurrentTab(index + 1);
            highlightActiveTab(index);
            setGameState(getGameVisibleActive());
            const lastOpenOptionPane = getLastScreenOpenRegister('tab' + getCurrentTab());
            if (lastOpenOptionPane) {
                setCurrentOptionPane(lastOpenOptionPane);
            }
        });
    });   
});

export function updateContent(heading, tab) {
    const optionDescriptionElements = getElements().optionPaneDescriptions;
    const optionDescription = getHeaderDescriptions([heading.toLowerCase()]);

    let headerContentElement;
    let optionContentElement;
    let optionDescriptionElement;

    let tabNumber = parseInt(tab.replace('tab', ''));
    headerContentElement = document.getElementById(`headerContentTab${tabNumber}`);
    optionContentElement = document.getElementById(`optionContentTab${tabNumber}`);

    headerContentElement.innerText = heading;
    optionContentElement.innerHTML = '';
        
    switch (tab) {
        case 'tab1':
            optionDescriptionElement = optionDescriptionElements[0];
            optionDescriptionElement.textContent = optionDescription;
            optionDescriptionElement.style.border = `1px dashed var(--container-border-color)`;
            drawTab1Content(heading, optionContentElement);
            break;
        case 'tab2':
            optionDescriptionElement = optionDescriptionElements[1];
            optionDescriptionElement.textContent = optionDescription;
            optionDescriptionElement.style.border = `1px dashed var(--container-border-color)`;
            drawTab2Content(heading, optionContentElement);
            break;
        case 'tab3':
            optionDescriptionElement = optionDescriptionElements[2];
            optionDescriptionElement.textContent = optionDescription;
            optionDescriptionElement.style.border = `1px dashed var(--container-border-color)`;
            drawTab3Content(heading, optionContentElement);
            break;
        case 'tab4':
            optionDescriptionElement = optionDescriptionElements[3];
            optionDescriptionElement.textContent = optionDescription;
            optionDescriptionElement.style.border = `1px dashed var(--container-border-color)`;
            drawTab4Content(heading, optionContentElement);
            break;
        case 'tab5':
            optionDescriptionElement = optionDescriptionElements[4];
            optionDescriptionElement.textContent = optionDescription;
            optionDescriptionElement.style.border = `1px dashed var(--container-border-color)`;
            drawTab5Content(heading, optionContentElement);
            break;
        case 'tab6':
            optionDescriptionElement = optionDescriptionElements[5];
            optionDescriptionElement.textContent = optionDescription;
            optionDescriptionElement.style.border = `1px dashed var(--container-border-color)`;
            drawTab6Content(heading, optionContentElement);
            break;
        case 'tab7':
            optionDescriptionElement = optionDescriptionElements[6];
            optionDescriptionElement.textContent = optionDescription;
            optionDescriptionElement.style.border = `1px dashed var(--container-border-color)`;
            drawTab7Content(heading, optionContentElement);
            break;
        case 'tab8':
            optionDescriptionElement = optionDescriptionElements[7];
            optionDescriptionElement.textContent = optionDescription;
            optionDescriptionElement.style.border = `1px dashed var(--container-border-color)`;
            drawTab8Content(heading, optionContentElement);
            break;
        default:
            console.error('Invalid tab:', tab);
            break;
    }   
}

function drawTab1Content(heading, optionContentElement) {
    if (heading === 'Hydrogen') {
        let storagePrice = getResourceDataObject('resources', ['hydrogen', 'storageCapacity']);
        let autobuyer1Price = getResourceDataObject('resources', ['hydrogen', 'upgrades', 'autoBuyer', 'tier1', 'price']);

        const hydrogenSellRow = createOptionRow(
            'hydrogenSellRow',
            null,
            'Sell Hydrogen:',
            createDropdown('hydrogenSellSelectQuantity', [
                { value: 'all', text: 'All Stock' },
                { value: 'threeQuarters', text: '75% Stock' },
                { value: 'twoThirds', text: '67% Stock' },
                { value: 'half', text: '50% Stock' },
                { value: 'oneThird', text: '33% Stock' },
                { value: '100000', text: '100,000' },
                { value: '10000', text: '10,000' },
                { value: '1000', text: '1,000' },
                { value: '100', text: '100' },
                { value: '10', text: '10' },
                { value: '1', text: '1' },
            ], 'all', (value) => {
                setSalePreview('hydrogen', value, 'helium');
            }),
            createButton('Sell', ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'sell'], () => {
                sellResource('hydrogen')
            }, 'sellResource', null, null, null, 'hydrogen', true, null),
            createButton('Fuse', ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'fuse'], (event) => {
                fuseResource('hydrogen', getResourceDataObject('resources', ['hydrogen', 'fuseTo1']), getResourceDataObject('resources', ['hydrogen', 'fuseToRatio1']), document.querySelector('#simpleGases .collapsible-content .row-side-menu:nth-child(2)'), document.getElementById('simpleGases'));
                event.currentTarget.classList.remove('warning-orange-text', 'disabled-red-text');
                event.currentTarget.parentElement.nextElementSibling.querySelector('label').classList.remove('warning-orange-text', 'disabled-red-text');
            }, 'fuseResource', null, 'hydrogen', 'helium', 'hydrogen', true, null),
            null,
            null,
            `${getResourceSalePreview('hydrogen')}`,
            null,
            null,
            null,
            null,
            null,
            null,
            false,
            null
        );
        optionContentElement.appendChild(hydrogenSellRow);

        const hydrogenGainRow = createOptionRow(
            'hydrogenGainRow',
            null,
            'Gain 1 Hydrogen:',
            createButton('Gain', ['option-button'], () => {
                gain(1, 'hydrogenQuantity', null, false, null, 'hydrogen')
            }, null, null, null, null, null, false, null), //set false to true out of development to stop fast gains by holding enter
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            false,
            null
        );
        optionContentElement.appendChild(hydrogenGainRow);

        const hydrogenIncreaseStorageRow = createOptionRow(
            'hydrogenIncreaseStorageRow',
            null,
            'Increase Container Size:',
            createButton('Increase Storage', ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                increaseResourceStorage('hydrogenQuantity', 'hydrogen');
            }, 'upgradeCheck', '', 'storage', null, 'hydrogen', true, null),
            null,
            null,
            null,
            null,
            `${storagePrice + " " + getResourceDataObject('resources', ['hydrogen', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'storage',
            null,
            'hydrogen',
            null,
            false,
            'hydrogen'
        );
        optionContentElement.appendChild(hydrogenIncreaseStorageRow);

        const hydrogenAutoBuyer1Row = createOptionRow(
            'hydrogenAutoBuyer1Row',
            getResourceDataObject('resources', ['hydrogen', 'upgrades', 'autoBuyer', 'tier1', 'nameUpgrade']),
            'Hydrogen Auto Buyer Tier 1:',
            createButton(`Add ${getResourceDataObject('resources', ['hydrogen', 'upgrades', 'autoBuyer', 'tier1', 'rate']) * getTimerRateRatio()} Hydrogen /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'hydrogenAB1Quantity', 'autoBuyer', true, 'tier1', 'hydrogen'),
                startUpdateAutoBuyerTimersAndRates('hydrogen', 1);
            }, 'upgradeCheck', '', 'autoBuyer', null, 'hydrogen', true, 'tier1'),
            null,
            null,
            null,
            null,
            `${autobuyer1Price + " " + getResourceDataObject('resources', ['hydrogen', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'hydrogen',
            'tier1',
            false,
            null
        );
        optionContentElement.appendChild(hydrogenAutoBuyer1Row);
    } 
    
    else if (heading === 'Helium') {
        let storagePrice = getResourceDataObject('resources', ['helium', 'storageCapacity']);
        let autobuyer1Price = getResourceDataObject('resources', ['helium', 'upgrades', 'autoBuyer', 'tier1', 'price']);

        const heliumSellRow = createOptionRow(
            'heliumSellRow',
            null,
            'Sell Helium:',
            createDropdown('heliumSellSelectQuantity', [
                { value: 'all', text: 'All Stock' },
                { value: 'threeQuarters', text: '75% Stock' },
                { value: 'twoThirds', text: '67% Stock' },
                { value: 'half', text: '50% Stock' },
                { value: 'oneThird', text: '33% Stock' },
                { value: '100000', text: '100,000' },
                { value: '10000', text: '10,000' },
                { value: '1000', text: '1,000' },
                { value: '100', text: '100' },
                { value: '10', text: '10' },
                { value: '1', text: '1' },
            ], 'all', (value) => {
                setSalePreview('helium', value, 'carbon');
            }),
            createButton('Sell', ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'sell'], () => {
                sellResource('helium')
            }, 'sellResource', null, null, null, 'helium', true, null),
            createButton('Fuse', ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'fuse'], (event) => {
                fuseResource('helium', getResourceDataObject('resources', ['helium', 'fuseTo1']), getResourceDataObject('resources', ['helium', 'fuseToRatio1']), document.querySelector('#simpleSolids .collapsible-content .row-side-menu:nth-child(1)'), document.getElementById('simpleSolids'));
                event.currentTarget.classList.remove('warning-orange-text', 'disabled-red-text');
                event.currentTarget.parentElement.nextElementSibling.querySelector('label').classList.remove('warning-orange-text', 'disabled-red-text');
            }, 'fuseResource', null, 'helium', 'carbon', 'helium', true, null),
            null,
            null,
            null,
            `${getResourceSalePreview('helium')}`,
            null,
            null,
            null,
            null,
            null,
            false,
            null
        );
        optionContentElement.appendChild(heliumSellRow);

        const heliumGainRow = createOptionRow(
            'heliumGainRow',
            null,
            'Gain 1 Helium:',
            createButton('Gain', ['option-button'], () => {
                gain(1, 'heliumQuantity', null, false, null, 'helium')
            }, null, null, null, null, null, false, null), //set false to true out of development to stop fast gains by holding enter
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            false,
            null
        );
        optionContentElement.appendChild(heliumGainRow);

        const heliumIncreaseStorageRow = createOptionRow(
            'heliumIncreaseStorageRow',
            null,
            'Increase Container Size:',
            createButton('Increase Storage', ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                increaseResourceStorage('heliumQuantity', 'helium');
            }, 'upgradeCheck', '', 'storage', null, 'helium', true, null),
            null,
            null,
            null,
            null,
            `${storagePrice + " " + getResourceDataObject('resources', ['helium', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'storage',
            null,
            'helium',
            null,
            false,
            'helium'
        );
        optionContentElement.appendChild(heliumIncreaseStorageRow);

        const heliumAutoBuyer1Row = createOptionRow(
            'heliumAutoBuyer1Row',
            getResourceDataObject('resources', ['helium', 'upgrades', 'autoBuyer', 'tier1', 'nameUpgrade']),
            'Helium Auto Buyer Tier 1:',
            createButton(`Add ${getResourceDataObject('resources', ['helium', 'upgrades', 'autoBuyer', 'tier1', 'rate']) * getTimerRateRatio()} Helium /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'heliumAB1Quantity', 'autoBuyer', true, 'tier1', 'helium'),
                startUpdateAutoBuyerTimersAndRates('helium', 1);
            }, 'upgradeCheck', '', 'autoBuyer', null, 'helium', true, 'tier1'),
            null,
            null,
            null,
            null,
            `${autobuyer1Price + " " + getResourceDataObject('resources', ['helium', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'helium',
            'tier1',
            false,
            null
        );
        optionContentElement.appendChild(heliumAutoBuyer1Row);
    }

    else if (heading === 'Carbon') {
        let storagePrice = getResourceDataObject('resources', ['carbon', 'storageCapacity']);
        let autobuyer1Price = getResourceDataObject('resources', ['carbon', 'upgrades', 'autoBuyer', 'tier1', 'price']);

        const carbonSellRow = createOptionRow(
            'carbonSellRow',
            null,
            'Sell Carbon:',
            createDropdown('carbonSellSelectQuantity', [
                { value: 'all', text: 'All Stock' },
                { value: 'threeQuarters', text: '75% Stock' },
                { value: 'twoThirds', text: '67% Stock' },
                { value: 'half', text: '50% Stock' },
                { value: 'oneThird', text: '33% Stock' },
                { value: '100000', text: '100,000' },
                { value: '10000', text: '10,000' },
                { value: '1000', text: '1,000' },
                { value: '100', text: '100' },
                { value: '10', text: '10' },
                { value: '1', text: '1' },
            ], 'all', (value) => {
                setSalePreview('carbon', value, 'nextElementsWillExpandOutHere');
            }),
            createButton('Sell', ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'sell'], () => {
                sellResource('carbon')
            }, 'sellResource', null, null, null, 'carbon', true, null),
            createButton('Fuse', ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'fuse'], (event) => {
                fuseResource('helium', getResourceDataObject('resources', ['carbon', 'fuseTo1']), getResourceDataObject('resources', ['carbon', 'fuseToRatio1']), document.querySelector('#simpleGases .collapsible-content .row-side-menu:nth-child(3)'), document.getElementById('simpleGases'));
                event.currentTarget.classList.remove('warning-orange-text', 'disabled-red-text');
                event.currentTarget.parentElement.nextElementSibling.querySelector('label').classList.remove('warning-orange-text', 'disabled-red-text');
            }, 'fuseResource', null, 'carbon', 'oxygen', 'carbon', true, null),
            null,
            null,
            null,
            `${getResourceSalePreview('oxygen')}`,
            null,
            null,
            null,
            null,
            null,
            false,
            null
        );
        optionContentElement.appendChild(carbonSellRow);

        const carbonGainRow = createOptionRow(
            'carbonGainRow',
            null,
            'Gain 1 Carbon:',
            createButton('Gain', ['option-button'], () => {
                gain(1, 'carbonQuantity', null, false, null, 'carbon')
            }, null, null, null, null, null, false, null),
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            false,
            null
        );
        optionContentElement.appendChild(carbonGainRow);

        const carbonIncreaseStorageRow = createOptionRow(
            'carbonIncreaseStorageRow',
            null,
            'Increase Container Size:',
            createButton('Increase Storage', ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                increaseResourceStorage('carbonQuantity','carbon');
            }, 'upgradeCheck', '', 'storage', null, 'carbon', true, null),
            null,
            null,
            null,
            null,
            `${storagePrice + " " + getResourceDataObject('resources', ['carbon', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'storage',
            null,
            'carbon',
            null,
            false,
            'carbon'
        );
        optionContentElement.appendChild(carbonIncreaseStorageRow);

        const carbonAutoBuyer1Row = createOptionRow(
            'carbonAutoBuyer1Row',
            getResourceDataObject('resources', ['carbon', 'upgrades', 'autoBuyer', 'tier1', 'nameUpgrade']),
            'Carbon Auto Buyer Tier 1:',
            createButton(`Add ${getResourceDataObject('resources', ['carbon', 'upgrades', 'autoBuyer', 'tier1', 'rate']) * getTimerRateRatio()} Carbon /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'carbonAB1Quantity', 'autoBuyer', true, 'tier1', 'carbon'),
                startUpdateAutoBuyerTimersAndRates('carbon', 1);
            }, 'upgradeCheck', '', 'autoBuyer', null, 'carbon', true, 'tier1'),
            null,
            null,
            null,
            null,
            `${autobuyer1Price + " " + getResourceDataObject('resources', ['carbon', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'carbon',
            'tier1',
            false,
            null
        );
        optionContentElement.appendChild(carbonAutoBuyer1Row);        
    } else if (heading === 'Oxygen') {
        let storagePrice = getResourceDataObject('resources', ['oxygen', 'storageCapacity']);
        let autobuyer1Price = getResourceDataObject('resources', ['oxygen', 'upgrades', 'autoBuyer', 'tier1', 'price']);
    
        const oxygenSellRow = createOptionRow(
            'oxygenSellRow',
            null,
            'Sell Oxygen:',
            createDropdown('oxygenSellSelectQuantity', [
                { value: 'all', text: 'All Stock' },
                { value: 'threeQuarters', text: '75% Stock' },
                { value: 'twoThirds', text: '67% Stock' },
                { value: 'half', text: '50% Stock' },
                { value: 'oneThird', text: '33% Stock' },
                { value: '100000', text: '100,000' },
                { value: '10000', text: '10,000' },
                { value: '1000', text: '1,000' },
                { value: '100', text: '100' },
                { value: '10', text: '10' },
                { value: '1', text: '1' },
            ], 'all', (value) => {
                setSalePreview('oxygen', value, 'nextElementsWillExpandOutHere');
            }),
            createButton('Sell', ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'sell'], () => {
                sellResource('oxygen')
            }, 'sellResource', null, null, null, 'oxygen', true, null),
            createButton('Fuse', ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'fuse'], (event) => {
                fuseResource('oxygen', getResourceDataObject('resources', ['oxygen', 'fuseTo1']), getResourceDataObject('resources', ['oxygen', 'fuseToRatio1']), document.querySelector('.row-side-menu:nth-child(2)'), document.querySelector('.'));
                event.currentTarget.classList.remove('warning-orange-text', 'disabled-red-text');
                event.currentTarget.parentElement.nextElementSibling.querySelector('label').classList.remove('warning-orange-text', 'disabled-red-text');
            }, 'fuseResource', null, 'oxygen', 'neon', 'oxygen', true, null),
            null,
            null,
            null,
            `${getResourceSalePreview('oxygen')}`,
            null,
            null,
            null,
            null,
            null,
            false,
            null
        );
        optionContentElement.appendChild(oxygenSellRow);
    
        const oxygenGainRow = createOptionRow(
            'oxygenGainRow',
            null,
            'Gain 1 Oxygen:',
            createButton('Gain', ['option-button'], () => {
                gain(1, 'oxygenQuantity', null, false, null, 'oxygen')
            }, null, null, null, null, null, false, null),
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            false,
            null
        );
        optionContentElement.appendChild(oxygenGainRow);
    
        const oxygenIncreaseStorageRow = createOptionRow(
            'oxygenIncreaseStorageRow',
            null,
            'Increase Container Size:',
            createButton('Increase Storage', ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                increaseResourceStorage('oxygenQuantity','oxygen');
            }, 'upgradeCheck', '', 'storage', null, 'oxygen', true, null),
            null,
            null,
            null,
            null,
            `${storagePrice + " " + getResourceDataObject('resources', ['oxygen', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'storage',
            null,
            'oxygen',
            null,
            false,
            'oxygen'
        );
        optionContentElement.appendChild(oxygenIncreaseStorageRow);
    
        const oxygenAutoBuyer1Row = createOptionRow(
            'oxygenAutoBuyer1Row',
            getResourceDataObject('resources', ['oxygen', 'upgrades', 'autoBuyer', 'tier1', 'nameUpgrade']),
            'Oxygen Auto Buyer Tier 1:',
            createButton(`Add ${getResourceDataObject('resources', ['oxygen', 'upgrades', 'autoBuyer', 'tier1', 'rate']) * getTimerRateRatio()} Oxygen /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'oxygenAB1Quantity', 'autoBuyer', true, 'tier1', 'oxygen'),
                startUpdateAutoBuyerTimersAndRates('oxygen', 1);
            }, 'upgradeCheck', '', 'autoBuyer', null, 'oxygen', true, 'tier1'),
            null,
            null,
            null,
            null,
            `${autobuyer1Price + " " + getResourceDataObject('resources', ['oxygen', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'oxygen',
            'tier1',
            false,
            null
        );
        optionContentElement.appendChild(oxygenAutoBuyer1Row);        
    }
}

function drawTab2Content(heading, optionContentElement) {
    if (heading === 'Research') {
        const researchScienceKitRow = createOptionRow(
            'researchScienceKitRow',
            null,
            'Science Kit:',
            createButton(`Add ${getResourceDataObject('research', ['upgrades', 'scienceKit', 'rate']) * getTimerRateRatio()} Research /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'scienceKitQuantity', 'scienceKit', false, null, 'scienceUpgrade'),
                deferredActions.push(() => {
                    if (getCanAffordDeferred()) {
                        startUpdateAutoBuyerTimersAndRates('scienceKit');
                    }
                    setCanAffordDeferred(null);
                });
            }, 'upgradeCheck', '', 'scienceUpgrade', 'scienceKit', 'cash', false, null),
            null,
            null,
            null,
            null,
            `${getResourceDataObject('research', ['upgrades', 'scienceKit', 'price']) + ' Research'}`,
            '',
            'upgradeCheck',
            'research',
            'scienceKit',
            'cash',
            null,
            false,
            null
        );
        optionContentElement.appendChild(researchScienceKitRow);

        const researchScienceClubRow = createOptionRow(
            'researchScienceClubRow',
            null,
            'Open Science Club:',
            createButton(`Add ${getResourceDataObject('research', ['upgrades', 'scienceClub', 'rate']) * getTimerRateRatio()} Research /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'scienceClubQuantity', 'scienceClub', false, null, 'scienceUpgrade');
                deferredActions.push(() => {
                    if (getCanAffordDeferred()) {
                        startUpdateAutoBuyerTimersAndRates('scienceClub');
                    }
                    setCanAffordDeferred(null);
                });
            }, 'upgradeCheck', '', 'scienceUpgrade', 'scienceClub', 'cash', false, null),
            null,
            null,
            null,
            null,
            `${getResourceDataObject('research', ['upgrades', 'scienceClub', 'price']) + ' Research'}`,
            '',
            'upgradeCheck',
            'research',
            'scienceClub',
            'cash',
            null,
            ['tech', 'knowledgeSharing'],
            null
        );
        optionContentElement.appendChild(researchScienceClubRow);
    } else if (heading === 'Tech Tree') {
        const rows = [
            {
                techName: 'knowledgeSharing',
                row: createOptionRow(
                    'techKnowledgeSharingRow',
                    null,
                    'Knowledge Sharing:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('knowledgeSharing', null, 'techUnlock', 'techUnlock', false, 'techs');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('knowledgeSharing');
                        showNotification('Knowledge Sharing Researched\n\nYou can now open Science Clubs!', 'info');
                    }, 'techUnlock', '', 'knowledgeSharing', null, 'research', false, null),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['knowledgeSharing', 'price']) + ' Research'}`,
                    '',
                    'techUnlock',
                    'knowledgeSharing',
                    null,
                    'research',
                    null,
                    false,
                    null
                )
            },
            {
                techName: 'fusionTheory',
                row: createOptionRow(
                    'techFusionTheoryRow',
                    null,
                    'Fusion Theory:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('fusionTheory', null, 'techUnlock', 'techUnlock', false, 'techs');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('fusionTheory');
                        showNotification('Fusion Theory Researched\n\nUseful for future experiments!', 'info');
                    }, 'techUnlock', '', 'fusionTheory', null, 'research', false, null),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['fusionTheory', 'price']) + ' Research'}`,
                    '',
                    'techUnlock',
                    'fusionTheory',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null
                )
            },
            {
                techName: 'hydrogenFusion',
                row: createOptionRow(
                    'techHydrogenFusionRow',
                    null,
                    'Hydrogen Fusion:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('hydrogenFusion', null, 'techUnlock', 'techUnlock', false, 'techs');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('hydrogenFusion');
                        setTechSpecificUIItemsArray('hydrogen', 'fusionButton', 'hydrogenFusion');
                        updateDescriptionRow('hydrogenSellRow', 'content2');
                        showNotification('Hydrogen Fusion Researched\n\nYou can now fuse Hydrogen!', 'info');
                    }, 'techUnlock', '', 'hydrogenFusion', null, 'research', false, null),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['hydrogenFusion', 'price'])} Research, <span id="hydrogenFusionPrereq" class="red-disabled-text">Fusion Theory</span>`,
                    '',
                    'techUnlock',
                    'hydrogenFusion',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null
                )
            },
            {
                techName: 'stellarCartography',
                row: createOptionRow(
                    'techStellarCartographyRow',
                    null,
                    'Stellar Cartography:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('stellarCartography', null, 'techUnlock', 'techUnlock', false, 'techs');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('stellarCartography');
                        setTechSpecificUIItemsArray('tab3', 'tab3', 'stellarCartography');
                        showNotification('Stellar Cartography Researched\n\nYou unlocked The Star Map!', 'info');
                    }, 'techUnlock', '', 'stellarCartography', null, 'research', false, null),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['stellarCartography', 'price'])} Research`,
                    '',
                    'techUnlock',
                    'stellarCartography',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null
                )
            },
            {
                techName: 'heliumFusion',
                row: createOptionRow(
                    'techHeliumFusionRow',
                    null,
                    'Helium Fusion:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('heliumFusion', null, 'techUnlock', 'techUnlock', false, 'techs');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('heliumFusion');
                        setTechSpecificUIItemsArray('hydrogen', 'fusionButton', 'heliumFusion');
                        updateDescriptionRow('hydrogenSellRow', 'content2');
                        showNotification('Helium Fusion Researched\n\nYou can now fuse Helium!', 'info');
                    }, 'techUnlock', '', 'heliumFusion', null, 'research', false, null),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['heliumFusion', 'price'])} Research, <span id="heliumFusionPrereq" class="red-disabled-text">Hydrogen Fusion</span>`,
                    '',
                    'techUnlock',
                    'heliumFusion',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null
                )
            },
            {
                techName: 'fusionEfficiencyI',
                row: createOptionRow(
                    'techfusionEfficiencyIRow',
                    null,
                    'Fusion Efficiency Stage I:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('fusionEfficiencyI', null, 'techUnlock', 'techUnlock', false, 'techs');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('fusionEfficiencyI');
                        setTechSpecificUIItemsArray('', '', 'fusionEfficiencyI');
                        showNotification('Fusion Efficiency Stage I Researched\n\n20% Boost to Fusion returns!', 'info');
                    }, 'techUnlock', '', 'fusionEfficiencyI', null, 'research', false, null),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['fusionEfficiencyI', 'price'])} Research, <span id="fusionEfficiencyIPrereq" class="red-disabled-text">Fusion Theory</span>`,
                    '',
                    'techUnlock',
                    'fusionEfficiencyI',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null
                )
            },
            {
                techName: 'fusionEfficiencyII',
                row: createOptionRow(
                    'techfusionEfficiencyIIRow',
                    null,
                    'Fusion Efficiency Stage II:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('fusionEfficiencyII', null, 'techUnlock', 'techUnlock', false, 'techs');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('fusionEfficiencyII');
                        setTechSpecificUIItemsArray('', '', 'fusionEfficiencyII');
                        showNotification('Fusion Efficiency Stage II Researched\n\nFurther 20% Boost to Fusion returns!', 'info');
                    }, 'techUnlock', '', 'fusionEfficiencyII', null, 'research', false, null),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['fusionEfficiencyII', 'price'])} Research, <span id="fusionEfficiencyIIPrereq" class="red-disabled-text">Fusion Efficiency Stage I</span>`,
                    '',
                    'techUnlock',
                    'fusionEfficiencyII',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null
                )
            },
            {
                techName: 'fusionEfficiencyIII',
                row: createOptionRow(
                    'techfusionEfficiencyIIIRow',
                    null,
                    'Fusion Efficiency Stage III:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('fusionEfficiencyIII', null, 'techUnlock', 'techUnlock', false, 'techs');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('fusionEfficiencyIII');
                        setTechSpecificUIItemsArray('', '', 'fusionEfficiencyIII');
                        showNotification('Fusion Efficiency Stage III Researched\n\n100% Fusion returns!', 'info');
                    }, 'techUnlock', '', 'fusionEfficiencyIII', null, 'research', false, null),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['fusionEfficiencyIII', 'price'])} Research, <span id="fusionEfficiencyIIIPrereq" class="red-disabled-text">Fusion Efficiency Stage II</span>`,
                    '',
                    'techUnlock',
                    'fusionEfficiencyIII',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null
                )
            },
        ];

        rows.forEach(item => {
            const rowElement = item.row;
            if (rowElement) {
                optionContentElement.appendChild(rowElement);
            }
        });
        
        const container = optionContentElement;
        setTemporaryRowsRepo(container, rows);
    }
}

function drawTab3Content(heading, optionContentElement) {
    // Your logic for tab 3
}

function drawTab4Content(heading, optionContentElement) {
    // Your logic for tab 4
}

function drawTab5Content(heading, optionContentElement) {
    // Your logic for tab 5
}

function drawTab6Content(heading, optionContentElement) {
    // Your logic for tab 6
}

function drawTab7Content(heading, optionContentElement) {
    // Your logic for tab 7
}

function drawTab8Content(heading, optionContentElement) {
    if (heading === 'Visual') {
        const settingsCurrencySymbolRow = createOptionRow(
            'settingsCurrencySymbolRow',
            null,
            'Currency:',
            createDropdown('notationSelect', [
                { value: '$', text: 'Dollar ($)' },
                { value: '€', text: 'Euro (€)' },
                { value: '£', text: 'Pound (£)' },
                { value: '¥', text: 'Yen (¥)' },
                { value: '₹', text: 'Rupee (₹)' },
                { value: '₩', text: 'Won (₩)' },
                { value: '₣', text: 'Franc (₣)' },
                { value: '₿', text: 'Bitcoin (₿)' },
            ], getCurrencySymbol(), (value) => {
                setCurrencySymbol(value);
            }),
            null,
            null,
            null,
            null,
            'Change the symbol used for Cash (Visual Only).',
            null,
            null,
            null,
            null,
            null,
            null,
            false,
            null
        );
        optionContentElement.appendChild(settingsCurrencySymbolRow);

        const settingsNotationRow = createOptionRow(
            'settingsNotationRow',
            null,
            'Notation:',
            createDropdown('notationSelect', [
                { value: 'normalCondensed', text: 'Normal Condensed' },
                { value: 'normal', text: 'Normal' },
            ], getNotationType(), (value) => {
                setNotationType(value);
            }),
            null,
            null,
            null,
            null,
            'Change the notation used.',
            null,
            null,
            null,
            null,
            null,
            null,
            false,
            null
        );
        optionContentElement.appendChild(settingsNotationRow);

        const settingsToggleNotificationsRow = createOptionRow(
            'settingsToggleNotificationsRow',
            null,
            'Toggle Notifications:',
            createToggleSwitch('notificationsToggle', true, (isEnabled) => {
                setNotificationsToggle(isEnabled);
            }),
            null,
            null,
            null,
            null,
            'Toggle notifications',
            null,
            null,
            null,
            null,
            null,
            null,
            false,
            null
        );
        optionContentElement.appendChild(settingsToggleNotificationsRow);

        const settingsThemeRow = createOptionRow(
            'settingsThemeRow',
            null,
            'Theme:',
            createDropdown('themeSelect', [
                { value: 'terminal', text: 'Terminal' },
                { value: 'dark', text: 'Dark' },
                { value: 'misty', text: 'Misty' },
                { value: 'light', text: 'Light' },
                { value: 'frosty', text: 'Frosty' },
                { value: 'summer', text: 'Summer' },
                { value: 'forest', text: 'Forest' },

            ], document.body.getAttribute('data-theme'), (value) => {
                selectTheme(value);
            }),
            null,
            null,
            null,
            null,
            'Change styling of the page.',
            null,
            null,
            null,
            null,
            null,
            null,
            false,
            null
        );
        optionContentElement.appendChild(settingsThemeRow);
    }
}

function createOptionRow(
    labelId,
    renderNameABs,
    labelText,
    inputElement1,
    inputElement2,
    inputElement3,
    inputElement4,
    inputElement5,
    descriptionText,
    resourcePriceObject,
    dataConditionCheck,
    objectSectionArgument1,
    objectSectionArgument2,
    quantityArgument,
    autoBuyerTier,
    startInvisibleValue,
    resourceString
) {
    // Main wrapper container
    const wrapper = document.createElement('div');
    wrapper.classList.add('option-row', 'd-flex')
    wrapper.id = labelId;

    // Create the description row
    const descriptionRowContainer = document.createElement('div');
    descriptionRowContainer.id = labelId + 'Description';
    descriptionRowContainer.classList.add('option-row-description', 'd-flex');
    if(getOptionDescription(labelId)) {
        descriptionRowContainer.textContent = getOptionDescription(labelId).content1;
    }


    // Main row container
    const mainRow = document.createElement('div');
    mainRow.classList.add('option-row-main', 'd-flex');
    wrapper.dataset.conditionCheck = dataConditionCheck;
    wrapper.dataset.type = objectSectionArgument1;

    // Visibility logic for mainRow
    if (dataConditionCheck === "techUnlock") {
        const researchPointsToAppear = getResourceDataObject('techs', [objectSectionArgument1, 'appearsAt'])[0];
        const prerequisiteForTech = getResourceDataObject('techs', [objectSectionArgument1, 'appearsAt'])[1];
        if (getResourceDataObject('research', ['quantity']) < researchPointsToAppear && !getRevealedTechArray().includes(objectSectionArgument1)) {
            wrapper.classList.add('invisible');
        } else if (!getTechUnlockedArray().includes(prerequisiteForTech)) {
            wrapper.classList.add('invisible');
        } else if (getResourceDataObject('research', ['quantity']) >= researchPointsToAppear && !getRevealedTechArray().includes(objectSectionArgument1)) {
            setRevealedTechArray(objectSectionArgument1);
        }
    }

    if (startInvisibleValue && startInvisibleValue[0] !== 'research') {
        const revealElementType = startInvisibleValue[0];
        const revealElementCondition = startInvisibleValue[1];

        if (revealElementType === 'tech') {
            if (!getTechUnlockedArray().includes(revealElementCondition)) {
                wrapper.classList.add('invisible');
            }
        }

        if (revealElementType === 'debug') {
            if (getDebugVisibilityArray().includes(revealElementCondition)) {
                wrapper.classList.add('invisible');
            }
        }
    }

    // Create the label container
    const labelContainer = document.createElement('div');
    labelContainer.classList.add('label-container');
    const label = document.createElement('label');
    objectSectionArgument1 === 'autoBuyer' ? label.innerText = renderNameABs + ':' : label.innerText = labelText;
    labelContainer.appendChild(label);
    mainRow.appendChild(labelContainer);

    // Create the input container
    const inputContainer = document.createElement('div');
    inputContainer.classList.add('input-container');

    if (inputElement1) inputContainer.appendChild(inputElement1);
    if (inputElement2) inputContainer.appendChild(inputElement2);
    if (inputElement3) inputContainer.appendChild(inputElement3);
    if (inputElement4) inputContainer.appendChild(inputElement4);
    if (inputElement5) inputContainer.appendChild(inputElement5);

    mainRow.appendChild(inputContainer);

    // Create the description container that contains prices of upgrades etc
    const descriptionContainer = document.createElement('div');
    descriptionContainer.classList.add('description-container');
    const description = document.createElement('label');
    description.classList.add('notation');
    description.id = generateElementId(labelText, resourceString);
    description.innerHTML = descriptionText;

    if (dataConditionCheck) {
        description.classList.add('red-disabled-text', 'resource-cost-sell-check');

        if (dataConditionCheck === 'techUnlock') {
            description.dataset.conditionCheck = dataConditionCheck;
            description.dataset.argumentCheckQuantity = quantityArgument;
            description.dataset.type = objectSectionArgument1;
        } else {
            description.dataset.conditionCheck = dataConditionCheck;
            description.dataset.resourcePriceObject = resourcePriceObject;
            description.dataset.type = objectSectionArgument1;
            description.dataset.resourceToFuseTo = objectSectionArgument2;
            description.dataset.argumentCheckQuantity = quantityArgument;
            description.dataset.autoBuyerTier = autoBuyerTier;
        }
    }

    descriptionContainer.appendChild(description);
    mainRow.appendChild(descriptionContainer);

    wrapper.appendChild(descriptionRowContainer);
    wrapper.appendChild(mainRow);

    return wrapper;
}


function generateElementId(labelText, resource) {

    let id = labelText.replace(/:$/, '');
    id = id.replace(/(^\w|[A-Z]|\s+)(\w*)/g, (match, p1, p2, index) => {
        return index === 0 ? p1.toLowerCase() + p2 : p1.toUpperCase() + p2;
    });

    if (resource !== null) {
        id = resource.toLowerCase() + capitaliseString(id);
    }

    id += 'Description';
    id = id.replace(/\s+/g, '');
    
    return id;
}

function createDropdown(id, options, selectedValue, onChange) {
    const selectContainer = document.createElement('div');
    selectContainer.classList.add('select-container');

    const select = document.createElement('select');
    select.id = id;
    options.forEach((option) => {
        const opt = document.createElement('option');
        opt.value = option.value;
        opt.innerText = option.text;
        if (option.value === selectedValue) {
            opt.selected = true;
        }
        select.appendChild(opt);
    });

    select.addEventListener('change', (event) => {
        onChange(event.target.value);
    });

    selectContainer.appendChild(select);
    return selectContainer;
}

function createToggleSwitch(id, isChecked, onChange) {
    const toggleContainer = document.createElement('div');
    toggleContainer.classList.add('toggle-container');

    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.id = id;
    toggle.checked = isChecked;

    toggle.addEventListener('change', (event) => {
        const isEnabled = event.target.checked;
        onChange(isEnabled);
    });

    const toggleLabel = document.createElement('label');
    toggleLabel.htmlFor = id;

    toggleContainer.appendChild(toggle);
    toggleContainer.appendChild(toggleLabel);
    return toggleContainer;
}

function createButton(text, classNames, onClick, dataConditionCheck, resourcePriceObject, objectSectionArgument1, objectSectionArgument2, quantityArgument, disableKeyboardForButton, autoBuyerTier) {
    const button = document.createElement('button');
    button.innerText = text;
    
    if (Array.isArray(classNames)) {
        classNames.forEach(className => button.classList.add(className));
    } else if (typeof classNames === 'string') {
        button.classList.add(classNames);
    }

    if (dataConditionCheck) {
        if (dataConditionCheck === 'sellResource' || dataConditionCheck === 'fuseResource') {
            button.dataset.conditionCheck = dataConditionCheck;
            button.dataset.argumentCheckQuantity = quantityArgument;
            button.dataset.type = objectSectionArgument1;
            button.dataset.resourceToFuseTo = objectSectionArgument2;
        } else if (dataConditionCheck === 'techUnlock') {
            button.dataset.conditionCheck = dataConditionCheck;
            button.dataset.argumentCheckQuantity = quantityArgument;
            button.dataset.type = objectSectionArgument1;
        } else {
            button.dataset.conditionCheck = dataConditionCheck;
            button.dataset.resourcePriceObject = resourcePriceObject;
            button.dataset.type = objectSectionArgument1;
            button.dataset.resource = objectSectionArgument2;
            button.dataset.argumentCheckQuantity = quantityArgument;
            button.dataset.autoBuyerTier = autoBuyerTier;
        }
    }

    button.addEventListener('click', onClick);

    if (disableKeyboardForButton) {
        button.setAttribute('tabindex', '-1');
        button.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
            }
        });
    }

    return button;
}

function selectTheme(theme) {
    const body = document.body;
    body.setAttribute('data-theme', theme);
}

export function showNotification(message, type = 'info', time = 4000) {
    if (getNotificationsToggle()) {
        sendNotificationIfActive(message, type, time);
    }
}

function sendNotificationIfActive(message, type, duration) {
    if (getNotificationsToggle()) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerText = message;

        const allNotifications = document.querySelectorAll('.notification');

        allNotifications.forEach((notification, index) => {
            notification.style.transform = `translateY(-${(index + 1) * 110}px)`;
        });

        notificationContainer.prepend(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 50);

        setTimeout(() => {
            hideNotification(notification);
        }, duration);
    }
}


function hideNotification(notification) {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(100px)';
    
    setTimeout(() => {
        notification.remove();
    }, 500);
} 

function highlightActiveTab(activeIndex) {
    const tabs = document.querySelectorAll('#tabsContainer .tab');
    tabs.forEach((tab, index) => {
        if (index === activeIndex) {
            tab.classList.add('selected');
        } else {
            tab.classList.remove('selected');
        }
    });
}

async function setElementsLanguageText() {
    getElements().menuTitle.innerHTML = `<h2>${localize('menuTitle', getLanguage())}</h2>`;
    getElements().newGameMenuButton.innerHTML = `${localize('newGame', getLanguage())}`;
}

export async function handleLanguageChange(languageCode) {
    setLanguageSelected(languageCode);
    await setupLanguageAndLocalization();
    setElementsLanguageText();
}

async function setupLanguageAndLocalization() {
    setLanguage(getLanguageSelected());
    await initLocalization(getLanguage());
}

export function disableActivateButton(button, action, activeClass) {
    switch (action) {
        case 'active':
            button.classList.remove('disabled');
            button.classList.add(activeClass);
            break;
        case 'disable':
            button.classList.remove(activeClass);
            button.classList.add('disabled');
            break;
    }
}

export function updateDescriptionRow(rowKey, targetProperty) {
    const optionDescriptions = getOptionDescription(rowKey);

    if (
        optionDescriptions &&
        targetProperty in optionDescriptions &&
        'content1' in optionDescriptions
    ) {
        const temp = optionDescriptions['content1'];
        optionDescriptions['content1'] = optionDescriptions[targetProperty];
        optionDescriptions[targetProperty] = temp;
    } else {
        console.error(`Invalid row key or property: ${rowKey}, ${targetProperty}`);
    }
}

export function showTabsUponUnlock() {
    const tabs = document.querySelectorAll('.tab');
    const unlockedTechs = getTechUnlockedArray();

    tabs.forEach(tab => {
        const tabTech = tab.getAttribute('data-tab');

        if (unlockedTechs.includes(tabTech)) {
            tab.classList.remove('invisible');
        }
    });
}