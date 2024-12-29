import { getTimerRateRatio, getCompoundSalePreview, setSaleCompoundPreview, getCompoundCreatePreview, setCreateCompoundPreview } from './constantsAndGlobalVars.js';
import { increaseResourceStorage, createCompound, sellCompound, gain, startUpdateAutoBuyerTimersAndRates } from './game.js';
import { getResourceDataObject } from './resourceDataObject.js';
import { createOptionRow, createDropdown, createButton } from './ui.js';

export function drawTab4Content(heading, optionContentElement) {
        if (heading === 'Diesel') {
            let storagePrice = getResourceDataObject('compounds', ['diesel', 'storageCapacity']);
            let autobuyer1Price = getResourceDataObject('compounds', ['diesel', 'upgrades', 'autoBuyer', 'tier1', 'price']);
            let autobuyer2Price = getResourceDataObject('compounds', ['diesel', 'upgrades', 'autoBuyer', 'tier2', 'price']);
            let autobuyer3Price = getResourceDataObject('compounds', ['diesel', 'upgrades', 'autoBuyer', 'tier3', 'price']);
            let autobuyer4Price = getResourceDataObject('compounds', ['diesel', 'upgrades', 'autoBuyer', 'tier4', 'price']);
    
            const dieselCreateRow = createOptionRow(
                'dieselCreateRow',
                null,
                'Create Diesel:',
                createDropdown('dieselCreateSelectQuantity', [
                    { value: 'max', text: 'Max Possible' },
                    { value: 'threeQuarters', text: 'Up to 75%' },
                    { value: 'twoThirds', text: 'Up to 67%' },
                    { value: 'half', text: 'Up to 50%' },
                    { value: 'oneThird', text: 'Up to 33%' },
                    { value: '50000', text: '50000 - 1.3M Hyd, 600K Crb' },
                    { value: '5000', text: '5000 - 130K Hyd, 60K Crb' },
                    { value: '500', text: '500 - 13K Hyd, 6K Crb' },
                    { value: '50', text: '50 - 1.3K Hyd, 600 Crb' },
                    { value: '5', text: '5 - 130 Hyd, 60 Crb' },
                    { value: '1', text: '1 - 26 Hyd, 12 Crb' },
                ], 'all', (value) => {
                    setCreateCompoundPreview('diesel', value);
                }),
                createButton('Create', ['option-button', 'red-disabled-text', 'compound-cost-sell-check', 'create'], () => {
                    createCompound('diesel');
                }, 'createCompound', null, null, null, 'diesel', true, null),
                null,
                null,
                null,
                `${getCompoundCreatePreview('diesel')}`,
                null,
                null,
                null,
                null,
                null,
                null,
                false,
                null,
                null,
                'compound'
            );
            optionContentElement.appendChild(dieselCreateRow);
    
            const dieselSellRow = createOptionRow(
                'dieselSellRow',
                null,
                'Sell Diesel:',
                createDropdown('dieselSellSelectQuantity', [
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
                    setSaleCompoundPreview('diesel', value);
                }),
                createButton('Sell', ['option-button', 'red-disabled-text', 'compound-cost-sell-check', 'sell'], () => {
                    sellCompound('diesel');
                }, 'sellCompound', null, null, null, 'diesel', true, null, 'compound'),
                null,
                null,
                null,
                null,
                `${getCompoundSalePreview('diesel')}`,
                null,
                null,
                null,
                null,
                null,
                false,
                null,
                null,
                'compound'
            );
            optionContentElement.appendChild(dieselSellRow);
    
            const dieselIncreaseStorageRow = createOptionRow(
                'dieselIncreaseStorageRow',
                null,
                'Increase Storage:',
                createButton('Increase Storage', ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    increaseResourceStorage('dieselQuantity', 'diesel', 'compounds');
                    storagePrice = getResourceDataObject('compounds', ['diesel', 'storageCapacity']);
                }, 'upgradeCheck', '', 'storage', null, 'diesel', true, null, 'compound'),
                null,
                null,
                null,
                null,
                `${storagePrice + " " + getResourceDataObject('compounds', ['diesel', 'nameResource'])}`,
                '',
                'upgradeCheck',
                'storage',
                null,
                'diesel',
                null,
                false,
                'diesel',
                null,
                'compound'
            );
            optionContentElement.appendChild(dieselIncreaseStorageRow);
    
            const dieselAutoBuyer1Row = createOptionRow(
                'dieselAutoBuyer1Row',
                getResourceDataObject('compounds', ['diesel', 'upgrades', 'autoBuyer', 'tier1', 'nameUpgrade']),
                'Diesel Auto Buyer Tier 1:',
                createButton(`Add ${getResourceDataObject('compounds', ['diesel', 'upgrades', 'autoBuyer', 'tier1', 'rate']) * getTimerRateRatio()} Diesel /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'dieselAB1Quantity', 'autoBuyer', true, 'tier1', 'diesel', 'compound'),
                        startUpdateAutoBuyerTimersAndRates('diesel', 1, 'compounds');
                }, 'upgradeCheck', '', 'autoBuyer', null, 'diesel', true, 'tier1', 'compound'),
                null,
                null,
                null,
                null,
                `${autobuyer1Price + " " + getResourceDataObject('compounds', ['diesel', 'nameResource'])}`,
                '',
                'upgradeCheck',
                'autoBuyer',
                null,
                'diesel',
                'tier1',
                false,
                null,
                null,
                'compound'
            );
            optionContentElement.appendChild(dieselAutoBuyer1Row);
    
            const dieselAutoBuyer2Row = createOptionRow(
                'dieselAutoBuyer2Row',
                getResourceDataObject('compounds', ['diesel', 'upgrades', 'autoBuyer', 'tier2', 'nameUpgrade']),
                'Diesel Auto Buyer Tier 2:',
                createButton(`Add ${getResourceDataObject('compounds', ['diesel', 'upgrades', 'autoBuyer', 'tier2', 'rate']) * getTimerRateRatio()} Diesel /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'dieselAB2Quantity', 'autoBuyer', true, 'tier2', 'diesel', 'compound'),
                        startUpdateAutoBuyerTimersAndRates('diesel', 2, 'compounds');
                }, 'upgradeCheck', '', 'autoBuyer', null, 'diesel', true, 'tier2', 'compound'),
                null,
                null,
                null,
                null,
                `${autobuyer2Price + " " + getResourceDataObject('compounds', ['diesel', 'nameResource'])}`,
                '',
                'upgradeCheck',
                'autoBuyer',
                null,
                'diesel',
                'tier2',
                false,
                null,
                null,
                'compound'
            );
            optionContentElement.appendChild(dieselAutoBuyer2Row);
    
            const dieselAutoBuyer3Row = createOptionRow(
                'dieselAutoBuyer3Row',
                getResourceDataObject('compounds', ['diesel', 'upgrades', 'autoBuyer', 'tier3', 'nameUpgrade']),
                'Diesel Auto Buyer Tier 3:',
                createButton(`Add ${getResourceDataObject('compounds', ['diesel', 'upgrades', 'autoBuyer', 'tier3', 'rate']) * getTimerRateRatio()} Diesel /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'dieselAB3Quantity', 'autoBuyer', true, 'tier3', 'diesel', 'compound'),
                        startUpdateAutoBuyerTimersAndRates('diesel', 3, 'compounds');
                }, 'upgradeCheck', '', 'autoBuyer', null, 'diesel', true, 'tier3', 'compound'),
                null,
                null,
                null,
                null,
                `${autobuyer3Price + " " + getResourceDataObject('compounds', ['diesel', 'nameResource'])}`,
                '',
                'upgradeCheck',
                'autoBuyer',
                null,
                'diesel',
                'tier3',
                false,
                null,
                null,
                'compound'
            );
            optionContentElement.appendChild(dieselAutoBuyer3Row);
    
            const dieselAutoBuyer4Row = createOptionRow(
                'dieselAutoBuyer4Row',
                getResourceDataObject('compounds', ['diesel', 'upgrades', 'autoBuyer', 'tier4', 'nameUpgrade']),
                'Diesel Auto Buyer Tier 4:',
                createButton(`Add ${getResourceDataObject('compounds', ['diesel', 'upgrades', 'autoBuyer', 'tier4', 'rate']) * getTimerRateRatio()} Diesel /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'dieselAB4Quantity', 'autoBuyer', true, 'tier4', 'diesel', 'compound'),
                        startUpdateAutoBuyerTimersAndRates('diesel', 4, 'compounds');
                }, 'upgradeCheck', '', 'autoBuyer', null, 'diesel', true, 'tier4', 'compound'),
                null,
                null,
                null,
                null,
                `${autobuyer4Price + " " + getResourceDataObject('compounds', ['diesel', 'nameResource'])}`,
                '',
                'upgradeCheck',
                'autoBuyer',
                null,
                'diesel',
                'tier4',
                false,
                null,
                null,
                'compound'
            );
            optionContentElement.appendChild(dieselAutoBuyer4Row);
        }
}