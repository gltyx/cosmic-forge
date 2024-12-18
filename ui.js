import {
    getUnlockedResourcesArray,
    setUnlockedResourcesArray,
    setTechSpecificUIItemsArray,
    getTechSpecificUIItemsArray,
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
    getResourcesToDeduct,
    setResourcesToDeduct,
    getCurrentOptionPane,
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
    getCurrencySymbol
} from './constantsAndGlobalVars.js';
import {
    getResourceDataObject,
    setResourceDataObject,
} from "./resourceConstantsAndGlobalVars.js";
import {
    getHeaderDescriptions,
    setHeaderDescriptions,
    getOptionDescription,
    setOptionDescription
} from "./descriptions.js";
import {
    getHydrogenAB1Quantity,
    setHydrogenAB1Quantity,
    getHeliumAB1Quantity,
    setHeliumAB1Quantity,
    getCarbonAB1Quantity,
    setCarbonAB1Quantity,
    getScienceKitQuantity,
    setScienceKitQuantity,
    getScienceClubQuantity,
    setScienceClubQuantity, 
    getHydrogenStorage,
    setHydrogenStorage, 
    getHeliumStorage,
    setHeliumStorage,
    getCarbonStorage,
    setCarbonStorage,
    getHydrogenQuantity,
    setHydrogenQuantity,
    getHeliumQuantity,
    setHeliumQuantity,
    getCarbonQuantity,
    setCarbonQuantity,
    getUpgradeResearch,
    setUpgradeResearch,
    getUpgradeHydrogen,
    getUpgradeHelium,
    getUpgradeCarbon,
    functionRegistryUpgrade
} from "./resourceConstantsAndGlobalVars.js";
import {
    revealElement,
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
import { capitaliseString } from './utilityFunctions.js';

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

    document.querySelectorAll('[class*="tab1"][class*="option1"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab1', 'hydrogen');
            setCurrentOptionPane(this.textContent);
            updateContent(this.textContent, 'tab1');
        });
    });
    
    document.querySelectorAll('[class*="tab1"][class*="option2"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab1', 'helium');
            setCurrentOptionPane(this.textContent);
            updateContent(this.textContent, 'tab1');
        });
    });

    document.querySelectorAll('[class*="tab1"][class*="option3"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab1', 'carbon');
            setCurrentOptionPane(this.textContent);
            updateContent(this.textContent, 'tab1');
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
        let storagePrice = getUpgradeHydrogen('storage').price;
        let autobuyer1Price = getUpgradeHydrogen('autoBuyer').tier1.price;

        const hydrogenSellRow = createOptionRow(
            'hydrogenSellRow',
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
                sellResource(getHydrogenQuantity, setHydrogenQuantity, 'hydrogen')
            }, 'sellResource', null, null, null, 'hydrogen', true, null),
            createButton('Fuse', ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'fuse'], (event) => {
                fuseResource('hydrogen', getResourceDataObject('resources', ['hydrogen', 'fuseTo1']), getResourceDataObject('resources', ['hydrogen', 'fuseToRatio1']), getHydrogenQuantity, setHydrogenQuantity, getHeliumQuantity, setHeliumQuantity, document.querySelector('.row-side-menu:nth-child(2)'));
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

        if (typeof storagePrice === 'function') {
            storagePrice = storagePrice();
        }

        const hydrogenIncreaseStorageRow = createOptionRow(
            'hydrogenIncreaseStorageRow',
            'Increase Container Size:',
            createButton('Increase Storage', ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                increaseResourceStorage(setHydrogenStorage, getHydrogenStorage, 'hydrogenQuantity', 'getUpgradeHydrogen', 'storage');
            }, 'upgradeCheck', 'getUpgradeHydrogen', 'storage', null, 'hydrogen', true, null),
            null,
            null,
            null,
            null,
            `${storagePrice + " " + capitaliseString(getUpgradeHydrogen('storage').resource)}`,
            'getUpgradeHydrogen',
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
            'Hydrogen Compressor:',
            createButton(`Add ${getUpgradeHydrogen('autoBuyer').tier1.rate * getTimerRateRatio()} Hydrogen /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'hydrogenAB1Quantity', 'autoBuyer', true, 'tier1', 'hydrogen'),
                startUpdateAutoBuyerTimersAndRates('hydrogenAB1');
            }, 'upgradeCheck', 'getUpgradeHydrogen', 'autoBuyer', null, 'hydrogen', true, 'tier1'),
            null,
            null,
            null,
            null,
            `${autobuyer1Price + " " + getUpgradeHydrogen('autoBuyer').resource}`,
            'getUpgradeHydrogen',
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
        let storagePrice = getUpgradeHelium('storage').price;
        let autobuyer1Price = getUpgradeHelium('autoBuyer').tier1.price;

        const heliumSellRow = createOptionRow(
            'heliumSellRow',
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
                sellResource(getHeliumQuantity, setHeliumQuantity, 'helium')
            }, 'sellResource', null, null, null, 'helium', true, null),
            null,
            null,
            null,
            `${getResourceSalePreview('helium')}`,
            null,
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

        if (typeof storagePrice === 'function') {
            storagePrice = storagePrice();
        }

        const heliumIncreaseStorageRow = createOptionRow(
            'heliumIncreaseStorageRow',
            'Increase Container Size:',
            createButton('Increase Storage', ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                increaseResourceStorage(setHeliumStorage, getHeliumStorage, 'heliumQuantity', 'getUpgradeHelium', 'storage');
            }, 'upgradeCheck', 'getUpgradeHelium', 'storage', null, 'helium', true, null),
            null,
            null,
            null,
            null,
            `${storagePrice + " " + capitaliseString(getUpgradeHelium('storage').resource)}`,
            'getUpgradeHelium',
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
            'Atmosphere Scraper:',
            createButton(`Add ${getUpgradeHelium('autoBuyer').tier1.rate * getTimerRateRatio()} Helium /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'heliumAB1Quantity', 'autoBuyer', true, 'tier1', 'helium'),
                startUpdateAutoBuyerTimersAndRates('heliumAB1');
            }, 'upgradeCheck', 'getUpgradeHelium', 'autoBuyer', null, 'helium', true, 'tier1'),
            null,
            null,
            null,
            null,
            `${autobuyer1Price + " " + getUpgradeHelium('autoBuyer').resource}`,
            'getUpgradeHelium',
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
        let storagePrice = getUpgradeCarbon('storage').price;
        let autobuyer1Price = getUpgradeCarbon('autoBuyer').tier1.price;

        const carbonSellRow = createOptionRow(
            'carbonSellRow',
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
                sellResource(getCarbonQuantity, setCarbonQuantity, 'carbon')
            }, 'sellResource', null, null, null, 'carbon', true, null),
            null,
            null,
            null,
            `${getResourceSalePreview('carbon')}`,
            null,
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

        if (typeof storagePrice === 'function') {
            storagePrice = storagePrice();
        }

        const carbonIncreaseStorageRow = createOptionRow(
            'carbonIncreaseStorageRow',
            'Increase Container Size:',
            createButton('Increase Storage', ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                increaseResourceStorage(setCarbonStorage, getCarbonStorage, 'carbonQuantity', 'getUpgradeCarbon', 'storage');
            }, 'upgradeCheck', 'getUpgradeCarbon', 'storage', null, 'carbon', true, null),
            null,
            null,
            null,
            null,
            `${storagePrice + " " + capitaliseString(getUpgradeCarbon('storage').resource)}`,
            'getUpgradeCarbon',
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
            'Burner:',
            createButton(`Add ${getUpgradeCarbon('autoBuyer').tier1.rate * getTimerRateRatio()} Carbon /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'carbonAB1Quantity', 'autoBuyer', true, 'tier1', 'carbon'),
                startUpdateAutoBuyerTimersAndRates('carbonAB1');
            }, 'upgradeCheck', 'getUpgradeCarbon', 'autoBuyer', null, 'carbon', true, 'tier1'),
            null,
            null,
            null,
            null,
            `${autobuyer1Price + " " + getUpgradeCarbon('autoBuyer').resource}`,
            'getUpgradeCarbon',
            'upgradeCheck',
            'autoBuyer',
            null,
            'carbon',
            'tier1',
            false,
            null
        );
        optionContentElement.appendChild(carbonAutoBuyer1Row);        
    }
}

function drawTab2Content(heading, optionContentElement) {
    if (heading === 'Research') {
        const researchScienceKitRow = createOptionRow(
            'researchScienceKitRow',
            'Science Kit:',
            createButton(`Add ${getUpgradeResearch('research', 'scienceKit').rate * getTimerRateRatio()} Research /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'scienceKitQuantity', 'scienceKit', false, null, 'scienceUpgrade'),
                startUpdateAutoBuyerTimersAndRates('scienceKit');
            }, 'upgradeCheck', 'getUpgradeResearch', 'research', 'scienceKit', 'cash', false, null),
            null,
            null,
            null,
            null,
            `${getUpgradeResearch('research', 'scienceKit').price + ' ' + getUpgradeResearch('research', 'scienceKit').resource}`,
            'getUpgradeResearch',
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
            'Open Science Club:',
            createButton(`Add ${getUpgradeResearch('research', 'scienceClub').rate * getTimerRateRatio()} Research /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'scienceClubQuantity', 'scienceClub', false, null, 'scienceUpgrade')
                startUpdateAutoBuyerTimersAndRates('scienceClub');
            }, 'upgradeCheck', 'getUpgradeResearch', 'research', 'scienceClub', 'cash', false, null),
            null,
            null,
            null,
            null,
            `${getUpgradeResearch('research', 'scienceClub').price + ' ' + getUpgradeResearch('research', 'scienceClub').resource}`,
            'getUpgradeResearch',
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
        const techKnowledgeSharingRow = createOptionRow(
            'techKnowledgeSharingRow',
            'Knowledge Sharing:',
            createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                gain('knowledgeSharing', null, null, 'techUnlock', false, null)
                event.currentTarget.classList.add('unlocked-tech');
                setTechUnlockedArray('knowledgeSharing');
            }, 'techUnlock', 'getUpgradeResearch', 'knowledgeSharing', null, 'research', false, null),
            null,
            null,
            null,
            null,
            `${getUpgradeResearch('techs', 'knowledgeSharing').price + ' Research'}`,
            'getUpgradeResearch',
            'techUnlock',
            'knowledgeSharing',
            null,
            'research',
            null,
            false,
            null
        );
        optionContentElement.appendChild(techKnowledgeSharingRow);

        const techFusionTheoryRow = createOptionRow(
            'techFusionTheoryRow',
            'Fusion Theory:',
            createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                gain('fusionTheory', null, null, 'techUnlock', false, null)
                event.currentTarget.classList.add('unlocked-tech');
                setTechUnlockedArray('fusionTheory');
            }, 'techUnlock', 'getUpgradeResearch', 'fusionTheory', null, 'research', false, null),
            null,
            null,
            null,
            null,
            `${getUpgradeResearch('techs', 'fusionTheory').price + ' Research'}`,
            'getUpgradeResearch',
            'techUnlock',
            'fusionTheory',
            null,
            'research',
            null,
            ['research', 'researchPoints'],
            null
        );
        optionContentElement.appendChild(techFusionTheoryRow);

        const techHydrogenFusionRow = createOptionRow(
            'techHydrogenFusionRow',
            'Hydrogen Fusion:',
            createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                gain('hydrogenFusion', null, null, 'techUnlock', false, 'null')
                event.currentTarget.classList.add('unlocked-tech');
                setTechUnlockedArray('hydrogenFusion');
                setTechSpecificUIItemsArray('hydrogen', 'fusionButton', 'hydrogenFusion');
                updateDescriptionRow('hydrogenSellRow', 'content2');
            }, 'techUnlock', 'getUpgradeResearch', 'hydrogenFusion', null, 'research', false, null),
            null,
            null,
            null,
            null,
            `${getUpgradeResearch('techs', 'hydrogenFusion').price} Research, <span id="hydrogenFusionPrereq" class="red-disabled-text">Fusion Theory</span>`,
            'getUpgradeResearch',
            'techUnlock',
            'hydrogenFusion',
            null,
            'research',
            null,
            ['research', 'researchPoints'],
            null
        );
        optionContentElement.appendChild(techHydrogenFusionRow);
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
            'Notation:',
            createDropdown('notationSelect', [
                { value: 'normal', text: 'Normal' },
                { value: 'scientific', text: 'Scientific' },
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
    wrapper.dataset.argumentToPass1 = objectSectionArgument1;

    // Visibility logic for mainRow
    if (dataConditionCheck === "techUnlock") {
        const functionGetResearchUpgrade = functionRegistryUpgrade[resourcePriceObject];
        const researchPointsToAppear = functionGetResearchUpgrade('techs', objectSectionArgument1).appearsAt[0];
        const prerequisiteForTech = functionGetResearchUpgrade('techs', objectSectionArgument1).appearsAt[1];
        if (getResourceDataObject('research', ['quantity']) < researchPointsToAppear && !getRevealedTechArray().includes(objectSectionArgument1)) {
            wrapper.classList.add('invisible');
        } else if (!getTechUnlockedArray().includes(prerequisiteForTech)) {
            wrapper.classList.add('invisible');
        } else if (getResourceDataObject('research', ['quantity']) >= functionGetResearchUpgrade('techs', objectSectionArgument1).appearsAt[0] && !getRevealedTechArray().includes(objectSectionArgument1)) {
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
    label.innerText = labelText;
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

    // Create the description container
    const descriptionContainer = document.createElement('div');
    descriptionContainer.classList.add('description-container');
    const description = document.createElement('label');
    description.id = generateElementId(labelText, resourceString);
    description.innerHTML = descriptionText;

    if (dataConditionCheck) {
        description.classList.add('red-disabled-text', 'resource-cost-sell-check');

        if (dataConditionCheck === 'techUnlock') {
            description.dataset.conditionCheck = dataConditionCheck;
            description.dataset.argumentToPass1 = objectSectionArgument1;
            description.dataset.argumentCheckQuantity = quantityArgument;

            description.dataset.resourceName = objectSectionArgument1;
          
            //TECH
            description.dataset.techName = objectSectionArgument1;

        } else {
            description.dataset.conditionCheck = dataConditionCheck;
            description.dataset.resourcePriceObject = resourcePriceObject;
            description.dataset.argumentToPass1 = objectSectionArgument1;
            description.dataset.argumentToPass2 = objectSectionArgument2;
            description.dataset.argumentCheckQuantity = quantityArgument;
            description.dataset.autoBuyerTier = autoBuyerTier;

            //FUSE
            description.dataset.resourceName = objectSectionArgument1;
            description.dataset.resourceToFuseTo = objectSectionArgument2;

            //BOTTOM PART
            description.dataset.type = objectSectionArgument1;
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
            button.dataset.argumentToPass1 = objectSectionArgument1;
            button.dataset.argumentToPass2 = objectSectionArgument2;

            button.dataset.resourceName = objectSectionArgument1;
            //FUSE
            button.dataset.resourceToFuseTo = objectSectionArgument2;

        } else if (dataConditionCheck === 'techUnlock') {
            button.dataset.conditionCheck = dataConditionCheck;
            button.dataset.argumentToPass1 = objectSectionArgument1;
            button.dataset.argumentCheckQuantity = quantityArgument;

            button.dataset.resourceName = objectSectionArgument1;

            //TECH
            button.dataset.techName = objectSectionArgument1;
        } else {
            button.dataset.conditionCheck = dataConditionCheck;
            button.dataset.resourcePriceObject = resourcePriceObject;
            button.dataset.argumentToPass1 = objectSectionArgument1;
            button.dataset.argumentToPass2 = objectSectionArgument2;
            button.dataset.argumentCheckQuantity = quantityArgument;
            button.dataset.autoBuyerTier = autoBuyerTier;

            button.dataset.resourceName = objectSectionArgument1;
            //BOTTOM PART
            button.dataset.type = objectSectionArgument1;
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

export function sendNotificationIfActive(message, type = 'info', time = 5000) {
    if (getNotificationsToggle()) {
        showNotification(message, type, time);
    }
}

function showNotification(message, type, duration) {
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
