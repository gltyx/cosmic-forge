import { getTimerRateRatio, getCompoundSalePreview, setSaleCompoundPreview, getCompoundCreatePreview, setCreateCompoundPreview } from './constantsAndGlobalVars.js';
import { increaseResourceStorage, createCompound, sellCompound, gain } from './game.js';
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
                }, 'createCompound', null, null, null, 'diesel', true, null, 'compound'),
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
                    gain(1, 'dieselAB1Quantity', 'autoBuyer', true, 'tier1', 'diesel', 'compounds')
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
                    gain(1, 'dieselAB2Quantity', 'autoBuyer', true, 'tier2', 'diesel', 'compounds')
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
                    gain(1, 'dieselAB3Quantity', 'autoBuyer', true, 'tier3', 'diesel', 'compounds')
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
                    gain(1, 'dieselAB4Quantity', 'autoBuyer', true, 'tier4', 'diesel', 'compounds')
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

        if (heading === 'Glass') {
            let storagePrice = getResourceDataObject('compounds', ['glass', 'storageCapacity']);
            let autobuyer1Price = getResourceDataObject('compounds', ['glass', 'upgrades', 'autoBuyer', 'tier1', 'price']);
            let autobuyer2Price = getResourceDataObject('compounds', ['glass', 'upgrades', 'autoBuyer', 'tier2', 'price']);
            let autobuyer3Price = getResourceDataObject('compounds', ['glass', 'upgrades', 'autoBuyer', 'tier3', 'price']);
            let autobuyer4Price = getResourceDataObject('compounds', ['glass', 'upgrades', 'autoBuyer', 'tier4', 'price']);
    
            const glassCreateRow = createOptionRow(
                'glassCreateRow',
                null,
                'Create Glass:',
                createDropdown('glassCreateSelectQuantity', [
                    { value: 'max', text: 'Max Possible' },
                    { value: 'threeQuarters', text: 'Up to 75%' },
                    { value: 'twoThirds', text: 'Up to 67%' },
                    { value: 'half', text: 'Up to 50%' },
                    { value: 'oneThird', text: 'Up to 33%' },
                    { value: '50000', text: '50000 - 200K Sil, 100K Oxy, 50K Sod' },
                    { value: '5000', text: '5000 - 20K Sil, 10K Oxy, 5K Sod' },
                    { value: '500', text: '500 - 2K Sil, 1K Oxy, 500 Sod' },
                    { value: '50', text: '50 - 200 Sil, 100 Oxy, 50 Sod' },
                    { value: '5', text: '5 - 20 Sil, 10 Oxy, 5 Sod' },
                    { value: '1', text: '1 - 4 Sil, 2 Oxy, 1 Sod' },
                ], 'all', (value) => {
                    setCreateCompoundPreview('glass', value);
                }),
                createButton('Create', ['option-button', 'red-disabled-text', 'compound-cost-sell-check', 'create'], () => {
                    createCompound('glass');
                }, 'createCompound', null, null, null, 'glass', true, null, 'compound'),
                null,
                null,
                null,
                `${getCompoundCreatePreview('glass')}`,
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
            optionContentElement.appendChild(glassCreateRow);
    
            const glassSellRow = createOptionRow(
                'glassSellRow',
                null,
                'Sell Glass:',
                createDropdown('glassSellSelectQuantity', [
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
                    setSaleCompoundPreview('glass', value);
                }),
                createButton('Sell', ['option-button', 'red-disabled-text', 'compound-cost-sell-check', 'sell'], () => {
                    sellCompound('glass');
                }, 'sellCompound', null, null, null, 'glass', true, null, 'compound'),
                null,
                null,
                null,
                null,
                `${getCompoundSalePreview('glass')}`,
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
            optionContentElement.appendChild(glassSellRow);
    
            const glassIncreaseStorageRow = createOptionRow(
                'glassIncreaseStorageRow',
                null,
                'Increase Storage:',
                createButton('Increase Storage', ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    increaseResourceStorage('glassQuantity', 'glass', 'compounds');
                    storagePrice = getResourceDataObject('compounds', ['glass', 'storageCapacity']);
                }, 'upgradeCheck', '', 'storage', null, 'glass', true, null, 'compound'),
                null,
                null,
                null,
                null,
                `${storagePrice + " " + getResourceDataObject('compounds', ['glass', 'nameResource'])}`,
                '',
                'upgradeCheck',
                'storage',
                null,
                'glass',
                null,
                false,
                'glass',
                null,
                'compound'
            );
            optionContentElement.appendChild(glassIncreaseStorageRow);
    
            const glassAutoBuyer1Row = createOptionRow(
                'glassAutoBuyer1Row',
                getResourceDataObject('compounds', ['glass', 'upgrades', 'autoBuyer', 'tier1', 'nameUpgrade']),
                'Glass Auto Buyer Tier 1:',
                createButton(`Add ${getResourceDataObject('compounds', ['glass', 'upgrades', 'autoBuyer', 'tier1', 'rate']) * getTimerRateRatio()} Glass /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'glassAB1Quantity', 'autoBuyer', true, 'tier1', 'glass', 'compounds')
                }, 'upgradeCheck', '', 'autoBuyer', null, 'glass', true, 'tier1', 'compound'),
                null,
                null,
                null,
                null,
                `${autobuyer1Price + " " + getResourceDataObject('compounds', ['glass', 'nameResource'])}`,
                '',
                'upgradeCheck',
                'autoBuyer',
                null,
                'glass',
                'tier1',
                false,
                null,
                null,
                'compound'
            );
            optionContentElement.appendChild(glassAutoBuyer1Row);
    
            const glassAutoBuyer2Row = createOptionRow(
                'glassAutoBuyer2Row',
                getResourceDataObject('compounds', ['glass', 'upgrades', 'autoBuyer', 'tier2', 'nameUpgrade']),
                'Glass Auto Buyer Tier 2:',
                createButton(`Add ${getResourceDataObject('compounds', ['glass', 'upgrades', 'autoBuyer', 'tier2', 'rate']) * getTimerRateRatio()} Glass /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'glassAB2Quantity', 'autoBuyer', true, 'tier2', 'glass', 'compounds')
                }, 'upgradeCheck', '', 'autoBuyer', null, 'glass', true, 'tier2', 'compound'),
                null,
                null,
                null,
                null,
                `${autobuyer2Price + " " + getResourceDataObject('compounds', ['glass', 'nameResource'])}`,
                '',
                'upgradeCheck',
                'autoBuyer',
                null,
                'glass',
                'tier2',
                false,
                null,
                null,
                'compound'
            );
            optionContentElement.appendChild(glassAutoBuyer2Row);
    
            const glassAutoBuyer3Row = createOptionRow(
                'glassAutoBuyer3Row',
                getResourceDataObject('compounds', ['glass', 'upgrades', 'autoBuyer', 'tier3', 'nameUpgrade']),
                'Glass Auto Buyer Tier 3:',
                createButton(`Add ${getResourceDataObject('compounds', ['glass', 'upgrades', 'autoBuyer', 'tier3', 'rate']) * getTimerRateRatio()} Glass /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'glassAB3Quantity', 'autoBuyer', true, 'tier3', 'glass', 'compounds')
                }, 'upgradeCheck', '', 'autoBuyer', null, 'glass', true, 'tier3', 'compound'),
                null,
                null,
                null,
                null,
                `${autobuyer3Price + " " + getResourceDataObject('compounds', ['glass', 'nameResource'])}`,
                '',
                'upgradeCheck',
                'autoBuyer',
                null,
                'glass',
                'tier3',
                false,
                null,
                null,
                'compound'
            );
            optionContentElement.appendChild(glassAutoBuyer3Row);
    
            const glassAutoBuyer4Row = createOptionRow(
                'glassAutoBuyer4Row',
                getResourceDataObject('compounds', ['glass', 'upgrades', 'autoBuyer', 'tier4', 'nameUpgrade']),
                'Glass Auto Buyer Tier 4:',
                createButton(`Add ${getResourceDataObject('compounds', ['glass', 'upgrades', 'autoBuyer', 'tier4', 'rate']) * getTimerRateRatio()} Glass /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'glassAB4Quantity', 'autoBuyer', true, 'tier4', 'glass', 'compounds')
                }, 'upgradeCheck', '', 'autoBuyer', null, 'glass', true, 'tier4', 'compound'),
                null,
                null,
                null,
                null,
                `${autobuyer4Price + " " + getResourceDataObject('compounds', ['glass', 'nameResource'])}`,
                '',
                'upgradeCheck',
                'autoBuyer',
                null,
                'glass',
                'tier4',
                false,
                null,
                null,
                'compound'
            );
            optionContentElement.appendChild(glassAutoBuyer4Row);
        }

        if (heading === 'Steel') {
            let storagePrice = getResourceDataObject('compounds', ['steel', 'storageCapacity']);
            let autobuyer1Price = getResourceDataObject('compounds', ['steel', 'upgrades', 'autoBuyer', 'tier1', 'price']);
            let autobuyer2Price = getResourceDataObject('compounds', ['steel', 'upgrades', 'autoBuyer', 'tier2', 'price']);
            let autobuyer3Price = getResourceDataObject('compounds', ['steel', 'upgrades', 'autoBuyer', 'tier3', 'price']);
            let autobuyer4Price = getResourceDataObject('compounds', ['steel', 'upgrades', 'autoBuyer', 'tier4', 'price']);
        
            const steelCreateRow = createOptionRow(
                'steelCreateRow',
                null,
                'Create Steel:',
                createDropdown('steelCreateSelectQuantity', [
                    { value: 'max', text: 'Max Possible' },
                    { value: 'threeQuarters', text: 'Up to 75%' },
                    { value: 'twoThirds', text: 'Up to 67%' },
                    { value: 'half', text: 'Up to 50%' },
                    { value: 'oneThird', text: 'Up to 33%' },
                    { value: '50000', text: '50000 - 200K Irn, 50K Crb' },
                    { value: '5000', text: '5000 - 20K Irn, 5K Crb' },
                    { value: '500', text: '500 - 2K Irn, 500 Crb' },
                    { value: '50', text: '50 - 200 Irn, 50 Crb' },
                    { value: '5', text: '5 - 20 Irn, 5 Crb' },
                    { value: '1', text: '1 - 4 Irn, 1 Crb' },
                ], 'all', (value) => {
                    setCreateCompoundPreview('steel', value);
                }),
                createButton('Create', ['option-button', 'red-disabled-text', 'compound-cost-sell-check', 'create'], () => {
                    createCompound('steel');
                }, 'createCompound', null, null, null, 'steel', true, null, 'compound'),
                null,
                null,
                null,
                `${getCompoundCreatePreview('steel')}`,
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
            optionContentElement.appendChild(steelCreateRow);
        
            const steelSellRow = createOptionRow(
                'steelSellRow',
                null,
                'Sell Steel:',
                createDropdown('steelSellSelectQuantity', [
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
                    setSaleCompoundPreview('steel', value);
                }),
                createButton('Sell', ['option-button', 'red-disabled-text', 'compound-cost-sell-check', 'sell'], () => {
                    sellCompound('steel');
                }, 'sellCompound', null, null, null, 'steel', true, null, 'compound'),
                null,
                null,
                null,
                null,
                `${getCompoundSalePreview('steel')}`,
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
            optionContentElement.appendChild(steelSellRow);
        
            const steelIncreaseStorageRow = createOptionRow(
                'steelIncreaseStorageRow',
                null,
                'Increase Storage:',
                createButton('Increase Storage', ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    increaseResourceStorage('steelQuantity', 'steel', 'compounds');
                    storagePrice = getResourceDataObject('compounds', ['steel', 'storageCapacity']);
                }, 'upgradeCheck', '', 'storage', null, 'steel', true, null, 'compound'),
                null,
                null,
                null,
                null,
                `${storagePrice + " " + getResourceDataObject('compounds', ['steel', 'nameResource'])}`,
                '',
                'upgradeCheck',
                'storage',
                null,
                'steel',
                null,
                false,
                'steel',
                null,
                'compound'
            );
            optionContentElement.appendChild(steelIncreaseStorageRow);
        
            const steelAutoBuyer1Row = createOptionRow(
                'steelAutoBuyer1Row',
                getResourceDataObject('compounds', ['steel', 'upgrades', 'autoBuyer', 'tier1', 'nameUpgrade']),
                'Steel Auto Buyer Tier 1:',
                createButton(`Add ${getResourceDataObject('compounds', ['steel', 'upgrades', 'autoBuyer', 'tier1', 'rate']) * getTimerRateRatio()} Steel /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'steelAB1Quantity', 'autoBuyer', true, 'tier1', 'steel', 'compounds')
                }, 'upgradeCheck', '', 'autoBuyer', null, 'steel', true, 'tier1', 'compound'),
                null,
                null,
                null,
                null,
                `${autobuyer1Price + " " + getResourceDataObject('compounds', ['steel', 'nameResource'])}`,
                '',
                'upgradeCheck',
                'autoBuyer',
                null,
                'steel',
                'tier1',
                false,
                null,
                null,
                'compound'
            );
            optionContentElement.appendChild(steelAutoBuyer1Row);
        
            const steelAutoBuyer2Row = createOptionRow(
                'steelAutoBuyer2Row',
                getResourceDataObject('compounds', ['steel', 'upgrades', 'autoBuyer', 'tier2', 'nameUpgrade']),
                'Steel Auto Buyer Tier 2:',
                createButton(`Add ${getResourceDataObject('compounds', ['steel', 'upgrades', 'autoBuyer', 'tier2', 'rate']) * getTimerRateRatio()} Steel /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'steelAB2Quantity', 'autoBuyer', true, 'tier2', 'steel', 'compounds')
                }, 'upgradeCheck', '', 'autoBuyer', null, 'steel', true, 'tier2', 'compound'),
                null,
                null,
                null,
                null,
                `${autobuyer2Price + " " + getResourceDataObject('compounds', ['steel', 'nameResource'])}`,
                '',
                'upgradeCheck',
                'autoBuyer',
                null,
                'steel',
                'tier2',
                false,
                null,
                null,
                'compound'
            );
            optionContentElement.appendChild(steelAutoBuyer2Row);
        
            const steelAutoBuyer3Row = createOptionRow(
                'steelAutoBuyer3Row',
                getResourceDataObject('compounds', ['steel', 'upgrades', 'autoBuyer', 'tier3', 'nameUpgrade']),
                'Steel Auto Buyer Tier 3:',
                createButton(`Add ${getResourceDataObject('compounds', ['steel', 'upgrades', 'autoBuyer', 'tier3', 'rate']) * getTimerRateRatio()} Steel /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'steelAB3Quantity', 'autoBuyer', true, 'tier3', 'steel', 'compounds')
                }, 'upgradeCheck', '', 'autoBuyer', null, 'steel', true, 'tier3', 'compound'),
                null,
                null,
                null,
                null,
                `${autobuyer3Price + " " + getResourceDataObject('compounds', ['steel', 'nameResource'])}`,
                '',
                'upgradeCheck',
                'autoBuyer',
                null,
                'steel',
                'tier3',
                false,
                null,
                null,
                'compound'
            );
            optionContentElement.appendChild(steelAutoBuyer3Row);
        
            const steelAutoBuyer4Row = createOptionRow(
                'steelAutoBuyer4Row',
                getResourceDataObject('compounds', ['steel', 'upgrades', 'autoBuyer', 'tier4', 'nameUpgrade']),
                'Steel Auto Buyer Tier 4:',
                createButton(`Add ${getResourceDataObject('compounds', ['steel', 'upgrades', 'autoBuyer', 'tier4', 'rate']) * getTimerRateRatio()} Steel /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'steelAB4Quantity', 'autoBuyer', true, 'tier4', 'steel', 'compounds')
                }, 'upgradeCheck', '', 'autoBuyer', null, 'steel', true, 'tier4', 'compound'),
                null,
                null,
                null,
                null,
                `${autobuyer4Price + " " + getResourceDataObject('compounds', ['steel', 'nameResource'])}`,
                '',
                'upgradeCheck',
                'autoBuyer',
                null,
                'steel',
                'tier4',
                false,
                null,
                null,
                'compound'
            );
            optionContentElement.appendChild(steelAutoBuyer4Row);
        }        
}