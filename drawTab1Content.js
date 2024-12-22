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
                fuseResource('hydrogen', getResourceDataObject('resources', ['hydrogen', 'fuseTo1']), getResourceDataObject('resources', ['hydrogen', 'fuseToRatio1']), document.querySelector('#simpleGases .collapsible-content .row-side-menu:nth-child(2)'), document.getElementById('simpleGases'), document.getElementById('gases'));
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
                fuseResource('helium', getResourceDataObject('resources', ['helium', 'fuseTo1']), getResourceDataObject('resources', ['helium', 'fuseToRatio1']), document.querySelector('#nonFerrous .collapsible-content .row-side-menu:nth-child(1)'), document.getElementById('nonFerrous'), document.getElementById('solids'));
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
                fuseResource('helium', getResourceDataObject('resources', ['carbon', 'fuseTo1']), getResourceDataObject('resources', ['carbon', 'fuseToRatio1']), document.querySelector('#nobleGases .collapsible-content .row-side-menu:nth-child(1)'), document.getElementById('nobleGases'), document.getElementById('gases'));
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
    } else if (heading === 'Neon') {
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
                fuseResource('neon', getResourceDataObject('resources', ['neon', 'fuseTo1']), getResourceDataObject('resources', ['neon', 'fuseToRatio1']), document.querySelector('.row-side-menu:nth-child(2)'), document.querySelector('.'));
                event.currentTarget.classList.remove('warning-orange-text', 'disabled-red-text');
                event.currentTarget.parentElement.nextElementSibling.querySelector('label').classList.remove('warning-orange-text', 'disabled-red-text');
            }, 'fuseResource', null, 'neon', 'silver', 'neon', true, null),
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
            }, 'upgradeCheck', '', 'autoBuyer', null, 'neon', true, 'tier1'),
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
            'tier1',
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

        const neonAutoBuyer3Row = createOptionRow(
            'neonAutoBuyer3Row',
            getResourceDataObject('resources', ['neon', 'upgrades', 'autoBuyer', 'tier3', 'nameUpgrade']),
            'Neon Auto Buyer Tier 3:',
            createButton(`Add ${getResourceDataObject('resources', ['neon', 'upgrades', 'autoBuyer', 'tier3', 'rate']) * getTimerRateRatio()} Neon /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'neonAB3Quantity', 'autoBuyer', true, 'tier3', 'neon'),
                    startUpdateAutoBuyerTimersAndRates('neon', 3);
            }, 'upgradeCheck', '', 'autoBuyer', null, 'neon', true, 'tier3'),
            null,
            null,
            null,
            null,
            `${autobuyer3Price + " " + getResourceDataObject('resources', ['neon', 'nameResource'])}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'neon',
            'tier3',
            false,
            null
        );
        optionContentElement.appendChild(neonAutoBuyer3Row);

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
}
