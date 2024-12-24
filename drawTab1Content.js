import { setSalePreview, getResourceSalePreview, getTimerRateRatio } from './constantsAndGlobalVars.js';
import { sellResource, fuseResource, gain, increaseResourceStorage, startUpdateAutoBuyerTimersAndRates } from './game.js';
import { getResourceDataObject } from './resourceDataObject.js';
import { createOptionRow, createDropdown, createButton } from './ui.js';

export function drawTab1Content(heading, optionContentElement) {
    if (heading === 'Hydrogen') {
        let storagePrice = getResourceDataObject('resources', ['hydrogen', 'storageCapacity']);
        let autobuyer1Price = getResourceDataObject('resources', ['hydrogen', 'upgrades', 'autoBuyer', 'tier1', 'price']);
        let autobuyer2Price = getResourceDataObject('resources', ['hydrogen', 'upgrades', 'autoBuyer', 'tier2', 'price']);
        let autobuyer3Price = getResourceDataObject('resources', ['hydrogen', 'upgrades', 'autoBuyer', 'tier3', 'price']);
        let autobuyer4Price = getResourceDataObject('resources', ['hydrogen', 'upgrades', 'autoBuyer', 'tier4', 'price']);

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
                sellResource('hydrogen');
            }, 'sellResource', null, null, null, 'hydrogen', true, null),
            createButton('Fuse', ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'fuse'], (event) => {
                fuseResource("hydrogen", [
                    {
                        fuseTo: getResourceDataObject('resources', ['hydrogen', 'fuseTo1']),
                        ratio: getResourceDataObject('resources', ['hydrogen', 'fuseToRatio1']),
                        resourceRowToShow: document.querySelector('#simpleGases .collapsible-content .row-side-menu:nth-child(2)'),
                        categoryToShow: document.getElementById('simpleGases'),
                        mainCategoryToShow: document.getElementById('gases')
                    }
                ]);                
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
                gain(1, 'hydrogenQuantity', null, false, null, 'hydrogen');
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
            'Increase Storage:',
            createButton('Increase Storage', ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                increaseResourceStorage('hydrogenQuantity', 'hydrogen');
                storagePrice = getResourceDataObject('resources', ['hydrogen', 'storageCapacity']);
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

        const hydrogenAutoBuyer2Row = createOptionRow(
            'hydrogenAutoBuyer2Row',
            getResourceDataObject('resources', ['hydrogen', 'upgrades', 'autoBuyer', 'tier2', 'nameUpgrade']),
            'Hydrogen Auto Buyer Tier 2:',
            createButton(`Add ${getResourceDataObject('resources', ['hydrogen', 'upgrades', 'autoBuyer', 'tier2', 'rate']) * getTimerRateRatio()} Hydrogen /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'hydrogenAB2Quantity', 'autoBuyer', true, 'tier2', 'hydrogen'),
                    startUpdateAutoBuyerTimersAndRates('hydrogen', 2);
            }, 'upgradeCheck', '', 'autoBuyer', null, 'hydrogen', true, 'tier2'),
            null,
            null,
            null,
            null,
            `${autobuyer2Price + " " + getResourceDataObject('resources', ['hydrogen', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'hydrogen',
            'tier2',
            false,
            null
        );
        optionContentElement.appendChild(hydrogenAutoBuyer2Row);

        const hydrogenAutoBuyer3Row = createOptionRow(
            'hydrogenAutoBuyer3Row',
            getResourceDataObject('resources', ['hydrogen', 'upgrades', 'autoBuyer', 'tier3', 'nameUpgrade']),
            'Hydrogen Auto Buyer Tier 3:',
            createButton(`Add ${getResourceDataObject('resources', ['hydrogen', 'upgrades', 'autoBuyer', 'tier3', 'rate']) * getTimerRateRatio()} Hydrogen /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'hydrogenAB3Quantity', 'autoBuyer', true, 'tier3', 'hydrogen'),
                    startUpdateAutoBuyerTimersAndRates('hydrogen', 3);
            }, 'upgradeCheck', '', 'autoBuyer', null, 'hydrogen', true, 'tier3'),
            null,
            null,
            null,
            null,
            `${autobuyer3Price + " " + getResourceDataObject('resources', ['hydrogen', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'hydrogen',
            'tier3',
            false,
            null
        );
        optionContentElement.appendChild(hydrogenAutoBuyer3Row);

        const hydrogenAutoBuyer4Row = createOptionRow(
            'hydrogenAutoBuyer4Row',
            getResourceDataObject('resources', ['hydrogen', 'upgrades', 'autoBuyer', 'tier4', 'nameUpgrade']),
            'Hydrogen Auto Buyer Tier 4:',
            createButton(`Add ${getResourceDataObject('resources', ['hydrogen', 'upgrades', 'autoBuyer', 'tier4', 'rate']) * getTimerRateRatio()} Hydrogen /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'hydrogenAB4Quantity', 'autoBuyer', true, 'tier4', 'hydrogen'),
                    startUpdateAutoBuyerTimersAndRates('hydrogen', 4);
            }, 'upgradeCheck', '', 'autoBuyer', null, 'hydrogen', true, 'tier4'),
            null,
            null,
            null,
            null,
            `${autobuyer4Price + " " + getResourceDataObject('resources', ['hydrogen', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'hydrogen',
            'tier4',
            false,
            null
        );
        optionContentElement.appendChild(hydrogenAutoBuyer4Row);
    }
    else if (heading === 'Helium') {
        let storagePrice = getResourceDataObject('resources', ['helium', 'storageCapacity']);
        let autobuyer1Price = getResourceDataObject('resources', ['helium', 'upgrades', 'autoBuyer', 'tier1', 'price']);
        let autobuyer2Price = getResourceDataObject('resources', ['helium', 'upgrades', 'autoBuyer', 'tier2', 'price']);
        let autobuyer3Price = getResourceDataObject('resources', ['helium', 'upgrades', 'autoBuyer', 'tier3', 'price']);
        let autobuyer4Price = getResourceDataObject('resources', ['helium', 'upgrades', 'autoBuyer', 'tier4', 'price']);

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
                sellResource('helium');
            }, 'sellResource', null, null, null, 'helium', true, null),
            createButton('Fuse', ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'fuse'], (event) => {
                fuseResource("helium", [
                    {
                        fuseTo: getResourceDataObject('resources', ['helium', 'fuseTo1']),
                        ratio: getResourceDataObject('resources', ['helium', 'fuseToRatio1']),
                        resourceRowToShow: document.querySelector('#nonFerrous .collapsible-content .row-side-menu:nth-child(1)'),
                        categoryToShow: document.getElementById('nonFerrous'),
                        mainCategoryToShow: document.getElementById('solids')
                    }
                ]); 
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
                gain(1, 'heliumQuantity', null, false, null, 'helium');
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
            'Increase Storage:',
            createButton('Increase Storage', ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                increaseResourceStorage('heliumQuantity', 'helium');
                storagePrice = getResourceDataObject('resources', ['helium', 'storageCapacity']);
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

        const heliumAutoBuyer2Row = createOptionRow(
            'heliumAutoBuyer2Row',
            getResourceDataObject('resources', ['helium', 'upgrades', 'autoBuyer', 'tier2', 'nameUpgrade']),
            'Helium Auto Buyer Tier 2:',
            createButton(`Add ${getResourceDataObject('resources', ['helium', 'upgrades', 'autoBuyer', 'tier2', 'rate']) * getTimerRateRatio()} Helium /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'heliumAB2Quantity', 'autoBuyer', true, 'tier2', 'helium'),
                    startUpdateAutoBuyerTimersAndRates('helium', 2);
            }, 'upgradeCheck', '', 'autoBuyer', null, 'helium', true, 'tier2'),
            null,
            null,
            null,
            null,
            `${autobuyer2Price + " " + getResourceDataObject('resources', ['helium', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'helium',
            'tier2',
            false,
            null
        );
        optionContentElement.appendChild(heliumAutoBuyer2Row);

        const heliumAutoBuyer3Row = createOptionRow(
            'heliumAutoBuyer3Row',
            getResourceDataObject('resources', ['helium', 'upgrades', 'autoBuyer', 'tier3', 'nameUpgrade']),
            'Helium Auto Buyer Tier 3:',
            createButton(`Add ${getResourceDataObject('resources', ['helium', 'upgrades', 'autoBuyer', 'tier3', 'rate']) * getTimerRateRatio()} Helium /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'heliumAB3Quantity', 'autoBuyer', true, 'tier3', 'helium'),
                    startUpdateAutoBuyerTimersAndRates('helium', 3);
            }, 'upgradeCheck', '', 'autoBuyer', null, 'helium', true, 'tier3'),
            null,
            null,
            null,
            null,
            `${autobuyer3Price + " " + getResourceDataObject('resources', ['helium', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'helium',
            'tier3',
            false,
            null
        );
        optionContentElement.appendChild(heliumAutoBuyer3Row);

        const heliumAutoBuyer4Row = createOptionRow(
            'heliumAutoBuyer4Row',
            getResourceDataObject('resources', ['helium', 'upgrades', 'autoBuyer', 'tier4', 'nameUpgrade']),
            'Helium Auto Buyer Tier 4:',
            createButton(`Add ${getResourceDataObject('resources', ['helium', 'upgrades', 'autoBuyer', 'tier4', 'rate']) * getTimerRateRatio()} Helium /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'heliumAB4Quantity', 'autoBuyer', true, 'tier4', 'helium'),
                    startUpdateAutoBuyerTimersAndRates('helium', 4);
            }, 'upgradeCheck', '', 'autoBuyer', null, 'helium', true, 'tier4'),
            null,
            null,
            null,
            null,
            `${autobuyer4Price + " " + getResourceDataObject('resources', ['helium', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'helium',
            'tier4',
            false,
            null
        );
        optionContentElement.appendChild(heliumAutoBuyer4Row);
    }

    else if (heading === 'Carbon') {
        let storagePrice = getResourceDataObject('resources', ['carbon', 'storageCapacity']);
        let autobuyer1Price = getResourceDataObject('resources', ['carbon', 'upgrades', 'autoBuyer', 'tier1', 'price']);
        let autobuyer2Price = getResourceDataObject('resources', ['carbon', 'upgrades', 'autoBuyer', 'tier2', 'price']);
        let autobuyer3Price = getResourceDataObject('resources', ['carbon', 'upgrades', 'autoBuyer', 'tier3', 'price']);
        let autobuyer4Price = getResourceDataObject('resources', ['carbon', 'upgrades', 'autoBuyer', 'tier4', 'price']);

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
                sellResource('carbon');
            }, 'sellResource', null, null, null, 'carbon', true, null),
            createButton('Fuse', ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'fuse'], (event) => {
                fuseResource("carbon", [
                    {
                        fuseTo: getResourceDataObject('resources', ['carbon', 'fuseTo1']),
                        ratio: getResourceDataObject('resources', ['carbon', 'fuseToRatio1']),
                        resourceRowToShow: document.querySelector('#nobleGases .collapsible-content .row-side-menu:nth-child(1)'),
                        categoryToShow: document.getElementById('nobleGases'),
                        mainCategoryToShow: document.getElementById('gases')
                    },
                    {
                        fuseTo: getResourceDataObject('resources', ['carbon', 'fuseTo2']),
                        ratio: getResourceDataObject('resources', ['sodium', 'fuseToRatio2']),
                        resourceRowToShow: document.querySelector('#metals .collapsible-content .row-side-menu:nth-child(1)'),
                        categoryToShow: document.getElementById('metals'),
                        mainCategoryToShow: document.getElementById('solids')
                    }
                ]);
                event.currentTarget.classList.remove('warning-orange-text', 'disabled-red-text');
                event.currentTarget.parentElement.nextElementSibling.querySelector('label').classList.remove('warning-orange-text', 'disabled-red-text');
            }, 'fuseResource', null, 'carbon', 'neon', 'carbon', true, null),
            null,
            null,
            null,
            `${getResourceSalePreview('neon')}`,
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
                gain(1, 'carbonQuantity', null, false, null, 'carbon');
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
            'Increase Storage:',
            createButton('Increase Storage', ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                increaseResourceStorage('carbonQuantity', 'carbon');
                storagePrice = getResourceDataObject('resources', ['carbon', 'storageCapacity']);
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

        const carbonAutoBuyer2Row = createOptionRow(
            'carbonAutoBuyer2Row',
            getResourceDataObject('resources', ['carbon', 'upgrades', 'autoBuyer', 'tier2', 'nameUpgrade']),
            'Carbon Auto Buyer Tier 2:',
            createButton(`Add ${getResourceDataObject('resources', ['carbon', 'upgrades', 'autoBuyer', 'tier2', 'rate']) * getTimerRateRatio()} Carbon /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'carbonAB2Quantity', 'autoBuyer', true, 'tier2', 'carbon'),
                    startUpdateAutoBuyerTimersAndRates('carbon', 2);
            }, 'upgradeCheck', '', 'autoBuyer', null, 'carbon', true, 'tier2'),
            null,
            null,
            null,
            null,
            `${autobuyer2Price + " " + getResourceDataObject('resources', ['carbon', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'carbon',
            'tier2',
            false,
            null
        );
        optionContentElement.appendChild(carbonAutoBuyer2Row);

        const carbonAutoBuyer3Row = createOptionRow(
            'carbonAutoBuyer3Row',
            getResourceDataObject('resources', ['carbon', 'upgrades', 'autoBuyer', 'tier3', 'nameUpgrade']),
            'Carbon Auto Buyer Tier 3:',
            createButton(`Add ${getResourceDataObject('resources', ['carbon', 'upgrades', 'autoBuyer', 'tier3', 'rate']) * getTimerRateRatio()} Carbon /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'carbonAB3Quantity', 'autoBuyer', true, 'tier3', 'carbon'),
                    startUpdateAutoBuyerTimersAndRates('carbon', 3);
            }, 'upgradeCheck', '', 'autoBuyer', null, 'carbon', true, 'tier3'),
            null,
            null,
            null,
            null,
            `${autobuyer3Price + " " + getResourceDataObject('resources', ['carbon', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'carbon',
            'tier3',
            false,
            null
        );
        optionContentElement.appendChild(carbonAutoBuyer3Row);

        const carbonAutoBuyer4Row = createOptionRow(
            'carbonAutoBuyer4Row',
            getResourceDataObject('resources', ['carbon', 'upgrades', 'autoBuyer', 'tier4', 'nameUpgrade']),
            'Carbon Auto Buyer Tier 4:',
            createButton(`Add ${getResourceDataObject('resources', ['carbon', 'upgrades', 'autoBuyer', 'tier4', 'rate']) * getTimerRateRatio()} Carbon /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'carbonAB4Quantity', 'autoBuyer', true, 'tier4', 'carbon'),
                    startUpdateAutoBuyerTimersAndRates('carbon', 4);
            }, 'upgradeCheck', '', 'autoBuyer', null, 'carbon', true, 'tier4'),
            null,
            null,
            null,
            null,
            `${autobuyer4Price + " " + getResourceDataObject('resources', ['carbon', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'carbon',
            'tier4',
            false,
            null
        );
        optionContentElement.appendChild(carbonAutoBuyer4Row);
    } 
    
    else if (heading === 'Neon') {
        let storagePrice = getResourceDataObject('resources', ['neon', 'storageCapacity']);
        let autobuyer1Price = getResourceDataObject('resources', ['neon', 'upgrades', 'autoBuyer', 'tier1', 'price']);
        let autobuyer2Price = getResourceDataObject('resources', ['neon', 'upgrades', 'autoBuyer', 'tier2', 'price']);
        let autobuyer3Price = getResourceDataObject('resources', ['neon', 'upgrades', 'autoBuyer', 'tier3', 'price']);
        let autobuyer4Price = getResourceDataObject('resources', ['neon', 'upgrades', 'autoBuyer', 'tier4', 'price']);

        const neonSellRow = createOptionRow(
            'neonSellRow',
            null,
            'Sell Neon:',
            createDropdown('neonSellSelectQuantity', [
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
                setSalePreview('neon', value, 'nextElementsWillExpandOutHere');
            }),
            createButton('Sell', ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'sell'], () => {
                sellResource('neon');
            }, 'sellResource', null, null, null, 'neon', true, null),
            createButton('Fuse', ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'fuse'], (event) => {
                fuseResource("neon", [
                    {
                        fuseTo: getResourceDataObject('resources', ['neon', 'fuseTo1']),
                        ratio: getResourceDataObject('resources', ['neon', 'fuseToRatio1']),
                        resourceRowToShow: document.querySelector('#simpleGases .collapsible-content .row-side-menu:nth-child(3)'),
                        categoryToShow: document.getElementById('simpleGases'),
                        mainCategoryToShow: document.getElementById('gases')
                    }
                ]);
                event.currentTarget.classList.remove('warning-orange-text', 'disabled-red-text');
                event.currentTarget.parentElement.nextElementSibling.querySelector('label').classList.remove('warning-orange-text', 'disabled-red-text');
            }, 'fuseResource', null, 'neon', 'oxygen', 'neon', true, null),
            null,
            null,
            null,
            `${getResourceSalePreview('neon')}`,
            null,
            null,
            null,
            null,
            null,
            false,
            null
        );
        optionContentElement.appendChild(neonSellRow);

        const neonGainRow = createOptionRow(
            'neonGainRow',
            null,
            'Gain 1 Neon:',
            createButton('Gain', ['option-button'], () => {
                gain(1, 'neonQuantity', null, false, null, 'neon');
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
        optionContentElement.appendChild(neonGainRow);

        const neonIncreaseStorageRow = createOptionRow(
            'neonIncreaseStorageRow',
            null,
            'Increase Storage:',
            createButton('Increase Storage', ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                increaseResourceStorage('neonQuantity', 'neon');
                storagePrice = getResourceDataObject('resources', ['neon', 'storageCapacity']);
            }, 'upgradeCheck', '', 'storage', null, 'neon', true, null),
            null,
            null,
            null,
            null,
            `${storagePrice + " " + getResourceDataObject('resources', ['neon', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'storage',
            null,
            'neon',
            null,
            false,
            'neon'
        );
        optionContentElement.appendChild(neonIncreaseStorageRow);

        const neonAutoBuyer1Row = createOptionRow(
            'neonAutoBuyer1Row',
            getResourceDataObject('resources', ['neon', 'upgrades', 'autoBuyer', 'tier1', 'nameUpgrade']),
            'Neon Auto Buyer Tier 1:',
            createButton(`Add ${getResourceDataObject('resources', ['neon', 'upgrades', 'autoBuyer', 'tier1', 'rate']) * getTimerRateRatio()} Neon /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'neonAB1Quantity', 'autoBuyer', true, 'tier1', 'neon'),
                    startUpdateAutoBuyerTimersAndRates('neon', 1);
            }, 'upgradeCheck', '', 'autoBuyer', null, 'neon', true, 'tier0'),
            null,
            null,
            null,
            null,
            `${autobuyer1Price + " " + getResourceDataObject('resources', ['neon', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'neon',
            'tier0',
            false,
            null
        );
        optionContentElement.appendChild(neonAutoBuyer1Row);

        const neonAutoBuyer2Row = createOptionRow(
            'neonAutoBuyer2Row',
            getResourceDataObject('resources', ['neon', 'upgrades', 'autoBuyer', 'tier2', 'nameUpgrade']),
            'Neon Auto Buyer Tier 2:',
            createButton(`Add ${getResourceDataObject('resources', ['neon', 'upgrades', 'autoBuyer', 'tier2', 'rate']) * getTimerRateRatio()} Neon /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'neonAB2Quantity', 'autoBuyer', true, 'tier2', 'neon'),
                    startUpdateAutoBuyerTimersAndRates('neon', 2);
            }, 'upgradeCheck', '', 'autoBuyer', null, 'neon', true, 'tier2'),
            null,
            null,
            null,
            null,
            `${autobuyer2Price + " " + getResourceDataObject('resources', ['neon', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'neon',
            'tier2',
            false,
            null
        );
        optionContentElement.appendChild(neonAutoBuyer2Row);

        // const neonAutoBuyer3Row = createOptionRow(
        //     'neonAutoBuyer3Row',
        //     getResourceDataObject('resources', ['neon', 'upgrades', 'autoBuyer', 'tier3', 'nameUpgrade']),
        //     'Neon Auto Buyer Tier 3:',
        //     createButton(`Add ${getResourceDataObject('resources', ['neon', 'upgrades', 'autoBuyer', 'tier3', 'rate']) * getTimerRateRatio()} Neon /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
        //         gain(1, 'neonAB3Quantity', 'autoBuyer', true, 'tier3', 'neon'),
        //             startUpdateAutoBuyerTimersAndRates('neon', 3);
        //     }, 'upgradeCheck', '', 'autoBuyer', null, 'neon', true, 'tier3'),
        //     null,
        //     null,
        //     null,
        //     null,
        //     `${autobuyer3Price + " " + getResourceDataObject('resources', ['neon', 'nameResource'])}`,
        //     '',
        //     'upgradeCheck',
        //     'autoBuyer',
        //     null,
        //     'neon',
        //     'tier3',
        //     false,
        //     null
        // );
        // optionContentElement.appendChild(neonAutoBuyer3Row);

        const neonAutoBuyer4Row = createOptionRow(
            'neonAutoBuyer4Row',
            getResourceDataObject('resources', ['neon', 'upgrades', 'autoBuyer', 'tier4', 'nameUpgrade']),
            'Neon Auto Buyer Tier 4:',
            createButton(`Add ${getResourceDataObject('resources', ['neon', 'upgrades', 'autoBuyer', 'tier4', 'rate']) * getTimerRateRatio()} Neon /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'neonAB4Quantity', 'autoBuyer', true, 'tier4', 'neon'),
                    startUpdateAutoBuyerTimersAndRates('neon', 4);
            }, 'upgradeCheck', '', 'autoBuyer', null, 'neon', true, 'tier4'),
            null,
            null,
            null,
            null,
            `${autobuyer4Price + " " + getResourceDataObject('resources', ['neon', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'neon',
            'tier4',
            false,
            null
        );
        optionContentElement.appendChild(neonAutoBuyer4Row);
    }
    
    else if (heading === 'Oxygen') {
        let storagePrice = getResourceDataObject('resources', ['oxygen', 'storageCapacity']);
        let autobuyer1Price = getResourceDataObject('resources', ['oxygen', 'upgrades', 'autoBuyer', 'tier1', 'price']);
        let autobuyer2Price = getResourceDataObject('resources', ['oxygen', 'upgrades', 'autoBuyer', 'tier2', 'price']);
        let autobuyer3Price = getResourceDataObject('resources', ['oxygen', 'upgrades', 'autoBuyer', 'tier3', 'price']);
        let autobuyer4Price = getResourceDataObject('resources', ['oxygen', 'upgrades', 'autoBuyer', 'tier4', 'price']);

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
                setSalePreview('oxygen', value, 'silicon');
            }),
            createButton('Sell', ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'sell'], () => {
                sellResource('oxygen');
            }, 'sellResource', null, null, null, 'oxygen', true, null),
            createButton('Fuse', ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'fuse'], (event) => {
                fuseResource("oxygen", [
                    {
                        fuseTo: getResourceDataObject('resources', ['oxygen', 'fuseTo1']),
                        ratio: getResourceDataObject('resources', ['oxygen', 'fuseToRatio1']),
                        resourceRowToShow: document.querySelector('#nonFerrous .collapsible-content .row-side-menu:nth-child(2)'),
                        categoryToShow: document.getElementById('nonFerrous'),
                        mainCategoryToShow: document.getElementById('solids')
                    }
                ]);
                event.currentTarget.classList.remove('warning-orange-text', 'disabled-red-text');
                event.currentTarget.parentElement.nextElementSibling.querySelector('label').classList.remove('warning-orange-text', 'disabled-red-text');
            }, 'fuseResource', null, 'oxygen', 'silicon', 'oxygen', true, null),
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
                gain(1, 'oxygenQuantity', null, false, null, 'oxygen');
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
        optionContentElement.appendChild(oxygenGainRow);

        const oxygenIncreaseStorageRow = createOptionRow(
            'oxygenIncreaseStorageRow',
            null,
            'Increase Storage:',
            createButton('Increase Storage', ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                increaseResourceStorage('oxygenQuantity', 'oxygen');
                storagePrice = getResourceDataObject('resources', ['oxygen', 'storageCapacity']);
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

        const oxygenAutoBuyer2Row = createOptionRow(
            'oxygenAutoBuyer2Row',
            getResourceDataObject('resources', ['oxygen', 'upgrades', 'autoBuyer', 'tier2', 'nameUpgrade']),
            'Oxygen Auto Buyer Tier 2:',
            createButton(`Add ${getResourceDataObject('resources', ['oxygen', 'upgrades', 'autoBuyer', 'tier2', 'rate']) * getTimerRateRatio()} Oxygen /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'oxygenAB2Quantity', 'autoBuyer', true, 'tier2', 'oxygen'),
                    startUpdateAutoBuyerTimersAndRates('oxygen', 2);
            }, 'upgradeCheck', '', 'autoBuyer', null, 'oxygen', true, 'tier2'),
            null,
            null,
            null,
            null,
            `${autobuyer2Price + " " + getResourceDataObject('resources', ['oxygen', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'oxygen',
            'tier2',
            false,
            null
        );
        optionContentElement.appendChild(oxygenAutoBuyer2Row);

        const oxygenAutoBuyer3Row = createOptionRow(
            'oxygenAutoBuyer3Row',
            getResourceDataObject('resources', ['oxygen', 'upgrades', 'autoBuyer', 'tier3', 'nameUpgrade']),
            'Oxygen Auto Buyer Tier 3:',
            createButton(`Add ${getResourceDataObject('resources', ['oxygen', 'upgrades', 'autoBuyer', 'tier3', 'rate']) * getTimerRateRatio()} Oxygen /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'oxygenAB3Quantity', 'autoBuyer', true, 'tier3', 'oxygen'),
                    startUpdateAutoBuyerTimersAndRates('oxygen', 3);
            }, 'upgradeCheck', '', 'autoBuyer', null, 'oxygen', true, 'tier3'),
            null,
            null,
            null,
            null,
            `${autobuyer3Price + " " + getResourceDataObject('resources', ['oxygen', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'oxygen',
            'tier3',
            false,
            null
        );
        optionContentElement.appendChild(oxygenAutoBuyer3Row);

        const oxygenAutoBuyer4Row = createOptionRow(
            'oxygenAutoBuyer4Row',
            getResourceDataObject('resources', ['oxygen', 'upgrades', 'autoBuyer', 'tier4', 'nameUpgrade']),
            'Oxygen Auto Buyer Tier 4:',
            createButton(`Add ${getResourceDataObject('resources', ['oxygen', 'upgrades', 'autoBuyer', 'tier4', 'rate']) * getTimerRateRatio()} Oxygen /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'oxygenAB4Quantity', 'autoBuyer', true, 'tier4', 'oxygen'),
                    startUpdateAutoBuyerTimersAndRates('oxygen', 4);
            }, 'upgradeCheck', '', 'autoBuyer', null, 'oxygen', true, 'tier4'),
            null,
            null,
            null,
            null,
            `${autobuyer4Price + " " + getResourceDataObject('resources', ['oxygen', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'oxygen',
            'tier4',
            false,
            null
        );
        optionContentElement.appendChild(oxygenAutoBuyer4Row);
    }
    
    else if (heading === 'Sodium') {
        let storagePrice = getResourceDataObject('resources', ['sodium', 'storageCapacity']);
        let autobuyer1Price = getResourceDataObject('resources', ['sodium', 'upgrades', 'autoBuyer', 'tier1', 'price']);
        let autobuyer2Price = getResourceDataObject('resources', ['sodium', 'upgrades', 'autoBuyer', 'tier2', 'price']);
        let autobuyer3Price = getResourceDataObject('resources', ['sodium', 'upgrades', 'autoBuyer', 'tier3', 'price']);
        let autobuyer4Price = getResourceDataObject('resources', ['sodium', 'upgrades', 'autoBuyer', 'tier4', 'price']);

        const sodiumSellRow = createOptionRow(
            'sodiumSellRow',
            null,
            'Sell Sodium:',
            createDropdown('sodiumSellSelectQuantity', [
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
                setSalePreview('sodium', value, '');
            }),
            createButton('Sell', ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'sell'], () => {
                sellResource('sodium');
            }, 'sellResource', null, null, null, 'sodium', true, null),
            null,
            null,
            null,
            null,
            `${getResourceSalePreview('sodium')}`,
            null,
            null,
            null,
            null,
            null,
            false,
            null
        );
        optionContentElement.appendChild(sodiumSellRow);

        const sodiumGainRow = createOptionRow(
            'sodiumGainRow',
            null,
            'Gain 1 Sodium:',
            createButton('Gain', ['option-button'], () => {
                gain(1, 'sodiumQuantity', null, false, null, 'sodium');
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
        optionContentElement.appendChild(sodiumGainRow);

        const sodiumIncreaseStorageRow = createOptionRow(
            'sodiumIncreaseStorageRow',
            null,
            'Increase Storage:',
            createButton('Increase Storage', ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                increaseResourceStorage('sodiumQuantity', 'sodium');
                storagePrice = getResourceDataObject('resources', ['sodium', 'storageCapacity']);
            }, 'upgradeCheck', '', 'storage', null, 'sodium', true, null),
            null,
            null,
            null,
            null,
            `${storagePrice + " " + getResourceDataObject('resources', ['sodium', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'storage',
            null,
            'sodium',
            null,
            false,
            'sodium'
        );
        optionContentElement.appendChild(sodiumIncreaseStorageRow);

        const sodiumAutoBuyer1Row = createOptionRow(
            'sodiumAutoBuyer1Row',
            getResourceDataObject('resources', ['sodium', 'upgrades', 'autoBuyer', 'tier1', 'nameUpgrade']),
            'Sodium Auto Buyer Tier 1:',
            createButton(`Add ${getResourceDataObject('resources', ['sodium', 'upgrades', 'autoBuyer', 'tier1', 'rate']) * getTimerRateRatio()} Sodium /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'sodiumAB1Quantity', 'autoBuyer', true, 'tier1', 'sodium'),
                    startUpdateAutoBuyerTimersAndRates('sodium', 1);
            }, 'upgradeCheck', '', 'autoBuyer', null, 'sodium', true, 'tier1'),
            null,
            null,
            null,
            null,
            `${autobuyer1Price + " " + getResourceDataObject('resources', ['sodium', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'sodium',
            'tier1',
            false,
            null
        );
        optionContentElement.appendChild(sodiumAutoBuyer1Row);

        const sodiumAutoBuyer2Row = createOptionRow(
            'sodiumAutoBuyer2Row',
            getResourceDataObject('resources', ['sodium', 'upgrades', 'autoBuyer', 'tier2', 'nameUpgrade']),
            'Sodium Auto Buyer Tier 2:',
            createButton(`Add ${getResourceDataObject('resources', ['sodium', 'upgrades', 'autoBuyer', 'tier2', 'rate']) * getTimerRateRatio()} Sodium /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'sodiumAB2Quantity', 'autoBuyer', true, 'tier2', 'sodium'),
                    startUpdateAutoBuyerTimersAndRates('sodium', 2);
            }, 'upgradeCheck', '', 'autoBuyer', null, 'sodium', true, 'tier2'),
            null,
            null,
            null,
            null,
            `${autobuyer2Price + " " + getResourceDataObject('resources', ['sodium', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'sodium',
            'tier2',
            false,
            null
        );
        optionContentElement.appendChild(sodiumAutoBuyer2Row);

        const sodiumAutoBuyer3Row = createOptionRow(
            'sodiumAutoBuyer3Row',
            getResourceDataObject('resources', ['sodium', 'upgrades', 'autoBuyer', 'tier3', 'nameUpgrade']),
            'Sodium Auto Buyer Tier 3:',
            createButton(`Add ${getResourceDataObject('resources', ['sodium', 'upgrades', 'autoBuyer', 'tier3', 'rate']) * getTimerRateRatio()} Sodium /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'sodiumAB3Quantity', 'autoBuyer', true, 'tier3', 'sodium'),
                    startUpdateAutoBuyerTimersAndRates('sodium', 3);
            }, 'upgradeCheck', '', 'autoBuyer', null, 'sodium', true, 'tier3'),
            null,
            null,
            null,
            null,
            `${autobuyer3Price + " " + getResourceDataObject('resources', ['sodium', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'sodium',
            'tier3',
            false,
            null
        );
        optionContentElement.appendChild(sodiumAutoBuyer3Row);

        const sodiumAutoBuyer4Row = createOptionRow(
            'sodiumAutoBuyer4Row',
            getResourceDataObject('resources', ['sodium', 'upgrades', 'autoBuyer', 'tier4', 'nameUpgrade']),
            'Sodium Auto Buyer Tier 4:',
            createButton(`Add ${getResourceDataObject('resources', ['sodium', 'upgrades', 'autoBuyer', 'tier4', 'rate']) * getTimerRateRatio()} Sodium /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'sodiumAB4Quantity', 'autoBuyer', true, 'tier4', 'sodium'),
                    startUpdateAutoBuyerTimersAndRates('sodium', 4);
            }, 'upgradeCheck', '', 'autoBuyer', null, 'sodium', true, 'tier4'),
            null,
            null,
            null,
            null,
            `${autobuyer4Price + " " + getResourceDataObject('resources', ['sodium', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'sodium',
            'tier4',
            false,
            null
        );
        optionContentElement.appendChild(sodiumAutoBuyer4Row);
    } 
    
    else if (heading === 'Silicon') {
        let storagePrice = getResourceDataObject('resources', ['silicon', 'storageCapacity']);
        let autobuyer1Price = getResourceDataObject('resources', ['silicon', 'upgrades', 'autoBuyer', 'tier1', 'price']);
        let autobuyer2Price = getResourceDataObject('resources', ['silicon', 'upgrades', 'autoBuyer', 'tier2', 'price']);
        let autobuyer3Price = getResourceDataObject('resources', ['silicon', 'upgrades', 'autoBuyer', 'tier3', 'price']);
        let autobuyer4Price = getResourceDataObject('resources', ['silicon', 'upgrades', 'autoBuyer', 'tier4', 'price']);

        const siliconSellRow = createOptionRow(
            'siliconSellRow',
            null,
            'Sell Silicon:',
            createDropdown('siliconSellSelectQuantity', [
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
                setSalePreview('silicon', value, 'iron');
            }),
            createButton('Sell', ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'sell'], () => {
                sellResource('silicon');
            }, 'sellResource', null, null, null, 'silicon', true, null),
            createButton('Fuse', ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'fuse'], (event) => {
                fuseResource("silicon", [
                    {
                        fuseTo: getResourceDataObject('resources', ['silicon', 'fuseTo1']),
                        ratio: getResourceDataObject('resources', ['silicon', 'fuseToRatio1']),
                        resourceRowToShow: document.querySelector('#metals .collapsible-content .row-side-menu:nth-child(2)'),
                        categoryToShow: document.getElementById('metals'),
                        mainCategoryToShow: document.getElementById('solids')
                    }
                ]);
                event.currentTarget.classList.remove('warning-orange-text', 'disabled-red-text');
                event.currentTarget.parentElement.nextElementSibling.querySelector('label').classList.remove('warning-orange-text', 'disabled-red-text');
            }, 'fuseResource', null, 'silicon', 'iron', 'silicon', true, null),
            null,
            null,
            null,
            `${getResourceSalePreview('silicon')}`,
            null,
            null,
            null,
            null,
            null,
            false,
            null
        );
        optionContentElement.appendChild(siliconSellRow);

        const siliconGainRow = createOptionRow(
            'siliconGainRow',
            null,
            'Gain 1 Silicon:',
            createButton('Gain', ['option-button'], () => {
                gain(1, 'siliconQuantity', null, false, null, 'silicon');
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
        optionContentElement.appendChild(siliconGainRow);

        const siliconIncreaseStorageRow = createOptionRow(
            'siliconIncreaseStorageRow',
            null,
            'Increase Storage:',
            createButton('Increase Storage', ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                increaseResourceStorage('siliconQuantity', 'silicon');
                storagePrice = getResourceDataObject('resources', ['silicon', 'storageCapacity']);
            }, 'upgradeCheck', '', 'storage', null, 'silicon', true, null),
            null,
            null,
            null,
            null,
            `${storagePrice + " " + getResourceDataObject('resources', ['silicon', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'storage',
            null,
            'silicon',
            null,
            false,
            'silicon'
        );
        optionContentElement.appendChild(siliconIncreaseStorageRow);

        const siliconAutoBuyer1Row = createOptionRow(
            'siliconAutoBuyer1Row',
            getResourceDataObject('resources', ['silicon', 'upgrades', 'autoBuyer', 'tier1', 'nameUpgrade']),
            'Silicon Auto Buyer Tier 1:',
            createButton(`Add ${getResourceDataObject('resources', ['silicon', 'upgrades', 'autoBuyer', 'tier1', 'rate']) * getTimerRateRatio()} Silicon /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'siliconAB1Quantity', 'autoBuyer', true, 'tier1', 'silicon'),
                    startUpdateAutoBuyerTimersAndRates('silicon', 1);
            }, 'upgradeCheck', '', 'autoBuyer', null, 'silicon', true, 'tier1'),
            null,
            null,
            null,
            null,
            `${autobuyer1Price + " " + getResourceDataObject('resources', ['silicon', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'silicon',
            'tier1',
            false,
            null
        );
        optionContentElement.appendChild(siliconAutoBuyer1Row);

        const siliconAutoBuyer2Row = createOptionRow(
            'siliconAutoBuyer2Row',
            getResourceDataObject('resources', ['silicon', 'upgrades', 'autoBuyer', 'tier2', 'nameUpgrade']),
            'Silicon Auto Buyer Tier 2:',
            createButton(`Add ${getResourceDataObject('resources', ['silicon', 'upgrades', 'autoBuyer', 'tier2', 'rate']) * getTimerRateRatio()} Silicon /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'siliconAB2Quantity', 'autoBuyer', true, 'tier2', 'silicon'),
                    startUpdateAutoBuyerTimersAndRates('silicon', 2);
            }, 'upgradeCheck', '', 'autoBuyer', null, 'silicon', true, 'tier2'),
            null,
            null,
            null,
            null,
            `${autobuyer2Price + " " + getResourceDataObject('resources', ['silicon', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'silicon',
            'tier2',
            false,
            null
        );
        optionContentElement.appendChild(siliconAutoBuyer2Row);

        const siliconAutoBuyer3Row = createOptionRow(
            'siliconAutoBuyer3Row',
            getResourceDataObject('resources', ['silicon', 'upgrades', 'autoBuyer', 'tier3', 'nameUpgrade']),
            'Silicon Auto Buyer Tier 3:',
            createButton(`Add ${getResourceDataObject('resources', ['silicon', 'upgrades', 'autoBuyer', 'tier3', 'rate']) * getTimerRateRatio()} Silicon /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'siliconAB3Quantity', 'autoBuyer', true, 'tier3', 'silicon'),
                    startUpdateAutoBuyerTimersAndRates('silicon', 3);
            }, 'upgradeCheck', '', 'autoBuyer', null, 'silicon', true, 'tier3'),
            null,
            null,
            null,
            null,
            `${autobuyer3Price + " " + getResourceDataObject('resources', ['silicon', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'silicon',
            'tier3',
            false,
            null
        );
        optionContentElement.appendChild(siliconAutoBuyer3Row);

        const siliconAutoBuyer4Row = createOptionRow(
            'siliconAutoBuyer4Row',
            getResourceDataObject('resources', ['silicon', 'upgrades', 'autoBuyer', 'tier4', 'nameUpgrade']),
            'Silicon Auto Buyer Tier 4:',
            createButton(`Add ${getResourceDataObject('resources', ['silicon', 'upgrades', 'autoBuyer', 'tier4', 'rate']) * getTimerRateRatio()} Silicon /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'siliconAB4Quantity', 'autoBuyer', true, 'tier4', 'silicon'),
                    startUpdateAutoBuyerTimersAndRates('silicon', 4);
            }, 'upgradeCheck', '', 'autoBuyer', null, 'silicon', true, 'tier4'),
            null,
            null,
            null,
            null,
            `${autobuyer4Price + " " + getResourceDataObject('resources', ['silicon', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'silicon',
            'tier4',
            false,
            null
        );
        optionContentElement.appendChild(siliconAutoBuyer4Row);
    }

    else if (heading === 'Iron') {
        let storagePrice = getResourceDataObject('resources', ['iron', 'storageCapacity']);
        let autobuyer1Price = getResourceDataObject('resources', ['iron', 'upgrades', 'autoBuyer', 'tier1', 'price']);
        let autobuyer2Price = getResourceDataObject('resources', ['iron', 'upgrades', 'autoBuyer', 'tier2', 'price']);
        let autobuyer3Price = getResourceDataObject('resources', ['iron', 'upgrades', 'autoBuyer', 'tier3', 'price']);
        let autobuyer4Price = getResourceDataObject('resources', ['iron', 'upgrades', 'autoBuyer', 'tier4', 'price']);

        const ironSellRow = createOptionRow(
            'ironSellRow',
            null,
            'Sell Iron:',
            createDropdown('ironSellSelectQuantity', [
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
                setSalePreview('iron', value, 'iron');
            }),
            createButton('Sell', ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'sell'], () => {
                sellResource('iron');
            }, 'sellResource', null, null, null, 'iron', true, null),
            null,
            null,
            null,
            null,
            `${getResourceSalePreview('iron')}`,
            null,
            null,
            null,
            null,
            null,
            false,
            null
        );
        optionContentElement.appendChild(ironSellRow);

        const ironGainRow = createOptionRow(
            'ironGainRow',
            null,
            'Gain 1 Iron:',
            createButton('Gain', ['option-button'], () => {
                gain(1, 'ironQuantity', null, false, null, 'iron');
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
        optionContentElement.appendChild(ironGainRow);

        const ironIncreaseStorageRow = createOptionRow(
            'ironIncreaseStorageRow',
            null,
            'Increase Storage:',
            createButton('Increase Storage', ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                increaseResourceStorage('ironQuantity', 'iron');
                storagePrice = getResourceDataObject('resources', ['iron', 'storageCapacity']);
            }, 'upgradeCheck', '', 'storage', null, 'iron', true, null),
            null,
            null,
            null,
            null,
            `${storagePrice + " " + getResourceDataObject('resources', ['iron', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'storage',
            null,
            'iron',
            null,
            false,
            'iron'
        );
        optionContentElement.appendChild(ironIncreaseStorageRow);

        const ironAutoBuyer1Row = createOptionRow(
            'ironAutoBuyer1Row',
            getResourceDataObject('resources', ['iron', 'upgrades', 'autoBuyer', 'tier1', 'nameUpgrade']),
            'Iron Auto Buyer Tier 1:',
            createButton(`Add ${getResourceDataObject('resources', ['iron', 'upgrades', 'autoBuyer', 'tier1', 'rate']) * getTimerRateRatio()} Iron /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'ironAB1Quantity', 'autoBuyer', true, 'tier1', 'iron'),
                    startUpdateAutoBuyerTimersAndRates('iron', 1);
            }, 'upgradeCheck', '', 'autoBuyer', null, 'iron', true, 'tier1'),
            null,
            null,
            null,
            null,
            `${autobuyer1Price + " " + getResourceDataObject('resources', ['iron', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'iron',
            'tier1',
            false,
            null
        );
        optionContentElement.appendChild(ironAutoBuyer1Row);

        const ironAutoBuyer2Row = createOptionRow(
            'ironAutoBuyer2Row',
            getResourceDataObject('resources', ['iron', 'upgrades', 'autoBuyer', 'tier2', 'nameUpgrade']),
            'Iron Auto Buyer Tier 2:',
            createButton(`Add ${getResourceDataObject('resources', ['iron', 'upgrades', 'autoBuyer', 'tier2', 'rate']) * getTimerRateRatio()} Iron /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'ironAB2Quantity', 'autoBuyer', true, 'tier2', 'iron'),
                    startUpdateAutoBuyerTimersAndRates('iron', 2);
            }, 'upgradeCheck', '', 'autoBuyer', null, 'iron', true, 'tier2'),
            null,
            null,
            null,
            null,
            `${autobuyer2Price + " " + getResourceDataObject('resources', ['iron', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'iron',
            'tier2',
            false,
            null
        );
        optionContentElement.appendChild(ironAutoBuyer2Row);

        const ironAutoBuyer3Row = createOptionRow(
            'ironAutoBuyer3Row',
            getResourceDataObject('resources', ['iron', 'upgrades', 'autoBuyer', 'tier3', 'nameUpgrade']),
            'Iron Auto Buyer Tier 3:',
            createButton(`Add ${getResourceDataObject('resources', ['iron', 'upgrades', 'autoBuyer', 'tier3', 'rate']) * getTimerRateRatio()} Iron /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'ironAB3Quantity', 'autoBuyer', true, 'tier3', 'iron'),
                    startUpdateAutoBuyerTimersAndRates('iron', 3);
            }, 'upgradeCheck', '', 'autoBuyer', null, 'iron', true, 'tier3'),
            null,
            null,
            null,
            null,
            `${autobuyer3Price + " " + getResourceDataObject('resources', ['iron', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'iron',
            'tier3',
            false,
            null
        );
        optionContentElement.appendChild(ironAutoBuyer3Row);

        const ironAutoBuyer4Row = createOptionRow(
            'ironAutoBuyer4Row',
            getResourceDataObject('resources', ['iron', 'upgrades', 'autoBuyer', 'tier4', 'nameUpgrade']),
            'Iron Auto Buyer Tier 4:',
            createButton(`Add ${getResourceDataObject('resources', ['iron', 'upgrades', 'autoBuyer', 'tier4', 'rate']) * getTimerRateRatio()} Iron /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'ironAB4Quantity', 'autoBuyer', true, 'tier4', 'iron'),
                    startUpdateAutoBuyerTimersAndRates('iron', 4);
            }, 'upgradeCheck', '', 'autoBuyer', null, 'iron', true, 'tier4'),
            null,
            null,
            null,
            null,
            `${autobuyer4Price + " " + getResourceDataObject('resources', ['iron', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'iron',
            'tier4',
            false,
            null
        );
        optionContentElement.appendChild(ironAutoBuyer4Row);
    }
}
