import { getImageUrls, getTimerRateRatio, getCompoundSalePreview, setSaleCompoundPreview, getCompoundCreatePreview, setCreateCompoundPreview } from './constantsAndGlobalVars.js';
import { increaseResourceStorage, createCompound, sellCompound, gain } from './game.js';
import { setResourceDataObject, getResourceDataObject } from './resourceDataObject.js';
import { createTextElement, createToggleSwitch, createOptionRow, createDropdown, createButton } from './ui.js';

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
                ], 'max', (value) => {
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
                    { value: '100000', text: '100000' },
                    { value: '10000', text: '10000' },
                    { value: '1000', text: '1000' },
                    { value: '100', text: '100' },
                    { value: '10', text: '10' },
                    { value: '1', text: '1' },
                ], 'all', (value) => {
                    setSaleCompoundPreview('diesel', value);
                }),
                createButton('Sell', ['option-button', 'red-disabled-text', 'compound-cost-sell-check', 'sell'], () => {
                    sellCompound('diesel');
                }, 'sellCompound', null, null, null, 'diesel', true, null, 'compound'),
                createTextElement(`Auto:`, '', ['autoBuyer-building-quantity']),
                createToggleSwitch('autoSellToggle', false, (isEnabled) => {
                    setResourceDataObject(isEnabled, 'compounds', ['diesel', 'autoSell']);
                }, ['toggle-switch-spacing']),
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
            const toggleSwitch = dieselSellRow.querySelector('#autoSellToggle');
            if (toggleSwitch) {
                toggleSwitch.setAttribute('data-type', 'compounds');
            }
    
            const dieselIncreaseStorageRow = createOptionRow(
                'dieselIncreaseStorageRow',
                null,
                'Increase Storage:',
                createButton('Increase Storage', ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    increaseResourceStorage(['dieselQuantity'], ['diesel'], ['compounds']);
                    storagePrice = getResourceDataObject('compounds', ['diesel', 'storageCapacity']) - 1;
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
                createButton(`Add ${Math.floor(getResourceDataObject('compounds', ['diesel', 'upgrades', 'autoBuyer', 'tier1', 'rate']) * getTimerRateRatio())} Diesel /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'dieselAB1Quantity', 'autoBuyer', true, 'tier1', 'diesel', 'compounds')
                }, 'upgradeCheck', '', 'autoBuyer', null, 'diesel', true, 'tier1', 'compound'),
                createTextElement(`Quantity: ${getResourceDataObject('compounds', ['diesel', 'upgrades', 'autoBuyer', 'tier1', 'quantity'])}`, 'dieselAB1Quantity', ['autoBuyer-building-quantity']),
                createToggleSwitch('diesel1Toggle', true, (isEnabled) => {
                    setResourceDataObject(isEnabled, 'compounds', ['diesel', 'upgrades', 'autoBuyer', 'tier1', 'active']);
                }, ['toggle-switch-spacing']),
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
                createButton(`Add ${Math.floor(getResourceDataObject('compounds', ['diesel', 'upgrades', 'autoBuyer', 'tier2', 'rate']) * getTimerRateRatio())} Diesel /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'dieselAB2Quantity', 'autoBuyer', true, 'tier2', 'diesel', 'compounds')
                }, 'upgradeCheck', '', 'autoBuyer', null, 'diesel', true, 'tier2', 'compound'),
                createTextElement(`Quantity: ${getResourceDataObject('compounds', ['diesel', 'upgrades', 'autoBuyer', 'tier2', 'quantity'])}`, 'dieselAB2Quantity', ['autoBuyer-building-quantity']),
                createToggleSwitch('diesel2Toggle', true, (isEnabled) => {
                    setResourceDataObject(isEnabled, 'compounds', ['diesel', 'upgrades', 'autoBuyer', 'tier2', 'active']);
                }, ['toggle-switch-spacing']),
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
                createButton(`Add ${Math.floor(getResourceDataObject('compounds', ['diesel', 'upgrades', 'autoBuyer', 'tier3', 'rate']) * getTimerRateRatio())} Diesel /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'dieselAB3Quantity', 'autoBuyer', true, 'tier3', 'diesel', 'compounds')
                }, 'upgradeCheck', '', 'autoBuyer', null, 'diesel', true, 'tier3', 'compound'),
                createTextElement(`Quantity: ${getResourceDataObject('compounds', ['diesel', 'upgrades', 'autoBuyer', 'tier3', 'quantity'])}`, 'dieselAB3Quantity', ['autoBuyer-building-quantity']),
                createToggleSwitch('diesel3Toggle', true, (isEnabled) => {
                    setResourceDataObject(isEnabled, 'compounds', ['diesel', 'upgrades', 'autoBuyer', 'tier3', 'active']);
                }, ['toggle-switch-spacing']),
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
                createButton(`Add ${Math.floor(getResourceDataObject('compounds', ['diesel', 'upgrades', 'autoBuyer', 'tier4', 'rate']) * getTimerRateRatio())} Diesel /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'dieselAB4Quantity', 'autoBuyer', true, 'tier4', 'diesel', 'compounds')
                }, 'upgradeCheck', '', 'autoBuyer', null, 'diesel', true, 'tier4', 'compound'),
                createTextElement(`Quantity: ${getResourceDataObject('compounds', ['diesel', 'upgrades', 'autoBuyer', 'tier4', 'quantity'])}`, 'dieselAB4Quantity', ['autoBuyer-building-quantity']),
                createToggleSwitch('diesel4Toggle', true, (isEnabled) => {
                    setResourceDataObject(isEnabled, 'compounds', ['diesel', 'upgrades', 'autoBuyer', 'tier4', 'active']);
                }, ['toggle-switch-spacing']),
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
                ], 'max', (value) => {
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
                    { value: '100000', text: '100000' },
                    { value: '10000', text: '10000' },
                    { value: '1000', text: '1000' },
                    { value: '100', text: '100' },
                    { value: '10', text: '10' },
                    { value: '1', text: '1' },
                ], 'all', (value) => {
                    setSaleCompoundPreview('glass', value);
                }),
                createButton('Sell', ['option-button', 'red-disabled-text', 'compound-cost-sell-check', 'sell'], () => {
                    sellCompound('glass');
                }, 'sellCompound', null, null, null, 'glass', true, null, 'compound'),
                createTextElement(`Auto:`, '', ['autoBuyer-building-quantity']),
                createToggleSwitch('autoSellToggle', false, (isEnabled) => {
                    setResourceDataObject(isEnabled, 'compounds', ['glass', 'autoSell']);
                }, ['toggle-switch-spacing']),
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
            const toggleSwitch = glassSellRow.querySelector('#autoSellToggle');
            if (toggleSwitch) {
                toggleSwitch.setAttribute('data-type', 'compounds');
            }
    
            const glassIncreaseStorageRow = createOptionRow(
                'glassIncreaseStorageRow',
                null,
                'Increase Storage:',
                createButton('Increase Storage', ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    increaseResourceStorage(['glassQuantity'], ['glass'], ['compounds']);
                    storagePrice = getResourceDataObject('compounds', ['glass', 'storageCapacity']) - 1;
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
                createButton(`Add ${Math.floor(getResourceDataObject('compounds', ['glass', 'upgrades', 'autoBuyer', 'tier1', 'rate']) * getTimerRateRatio())} Glass /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'glassAB1Quantity', 'autoBuyer', true, 'tier1', 'glass', 'compounds')
                }, 'upgradeCheck', '', 'autoBuyer', null, 'glass', true, 'tier1', 'compound'),
                createTextElement(`Quantity: ${getResourceDataObject('compounds', ['glass', 'upgrades', 'autoBuyer', 'tier1', 'quantity'])}`, 'glassAB1Quantity', ['autoBuyer-building-quantity']),
                createToggleSwitch('glass1Toggle', true, (isEnabled) => {
                    setResourceDataObject(isEnabled, 'compounds', ['glass', 'upgrades', 'autoBuyer', 'tier1', 'active']);
                }, ['toggle-switch-spacing']),
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
                createButton(`Add ${Math.floor(getResourceDataObject('compounds', ['glass', 'upgrades', 'autoBuyer', 'tier2', 'rate']) * getTimerRateRatio())} Glass /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'glassAB2Quantity', 'autoBuyer', true, 'tier2', 'glass', 'compounds')
                }, 'upgradeCheck', '', 'autoBuyer', null, 'glass', true, 'tier2', 'compound'),
                createTextElement(`Quantity: ${getResourceDataObject('compounds', ['glass', 'upgrades', 'autoBuyer', 'tier2', 'quantity'])}`, 'glassAB2Quantity', ['autoBuyer-building-quantity']),
                createToggleSwitch('glass2Toggle', true, (isEnabled) => {
                    setResourceDataObject(isEnabled, 'compounds', ['glass', 'upgrades', 'autoBuyer', 'tier2', 'active']);
                }, ['toggle-switch-spacing']),
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
                createButton(`Add ${Math.floor(getResourceDataObject('compounds', ['glass', 'upgrades', 'autoBuyer', 'tier3', 'rate']) * getTimerRateRatio())} Glass /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'glassAB3Quantity', 'autoBuyer', true, 'tier3', 'glass', 'compounds')
                }, 'upgradeCheck', '', 'autoBuyer', null, 'glass', true, 'tier3', 'compound'),
                createTextElement(`Quantity: ${getResourceDataObject('compounds', ['glass', 'upgrades', 'autoBuyer', 'tier3', 'quantity'])}`, 'glassAB3Quantity', ['autoBuyer-building-quantity']),
                createToggleSwitch('glass3Toggle', true, (isEnabled) => {
                    setResourceDataObject(isEnabled, 'compounds', ['glass', 'upgrades', 'autoBuyer', 'tier3', 'active']);
                }, ['toggle-switch-spacing']),
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
                createButton(`Add ${Math.floor(getResourceDataObject('compounds', ['glass', 'upgrades', 'autoBuyer', 'tier4', 'rate']) * getTimerRateRatio())} Glass /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'glassAB4Quantity', 'autoBuyer', true, 'tier4', 'glass', 'compounds')
                }, 'upgradeCheck', '', 'autoBuyer', null, 'glass', true, 'tier4', 'compound'),
                createTextElement(`Quantity: ${getResourceDataObject('compounds', ['glass', 'upgrades', 'autoBuyer', 'tier4', 'quantity'])}`, 'glassAB4Quantity', ['autoBuyer-building-quantity']),
                createToggleSwitch('glass4Toggle', true, (isEnabled) => {
                    setResourceDataObject(isEnabled, 'compounds', ['glass', 'upgrades', 'autoBuyer', 'tier4', 'active']);
                }, ['toggle-switch-spacing']),
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
                ], 'max', (value) => {
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
                    { value: '100000', text: '100000' },
                    { value: '10000', text: '10000' },
                    { value: '1000', text: '1000' },
                    { value: '100', text: '100' },
                    { value: '10', text: '10' },
                    { value: '1', text: '1' },
                ], 'all', (value) => {
                    setSaleCompoundPreview('steel', value);
                }),
                createButton('Sell', ['option-button', 'red-disabled-text', 'compound-cost-sell-check', 'sell'], () => {
                    sellCompound('steel');
                }, 'sellCompound', null, null, null, 'steel', true, null, 'compound'),
                createTextElement(`Auto:`, '', ['autoBuyer-building-quantity']),
                createToggleSwitch('autoSellToggle', false, (isEnabled) => {
                    setResourceDataObject(isEnabled, 'compounds', ['steel', 'autoSell']);
                }, ['toggle-switch-spacing']),
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
            const toggleSwitch = steelSellRow.querySelector('#autoSellToggle');
            if (toggleSwitch) {
                toggleSwitch.setAttribute('data-type', 'compounds');
            }
        
            const steelIncreaseStorageRow = createOptionRow(
                'steelIncreaseStorageRow',
                null,
                'Increase Storage:',
                createButton('Increase Storage', ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    increaseResourceStorage(['steelQuantity'], ['steel'], ['compounds']);
                    storagePrice = getResourceDataObject('compounds', ['steel', 'storageCapacity']) - 1;
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
                createButton(`Add ${Math.floor(getResourceDataObject('compounds', ['steel', 'upgrades', 'autoBuyer', 'tier1', 'rate']) * getTimerRateRatio())} Steel /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'steelAB1Quantity', 'autoBuyer', true, 'tier1', 'steel', 'compounds')
                }, 'upgradeCheck', '', 'autoBuyer', null, 'steel', true, 'tier1', 'compound'),
                createTextElement(`Quantity: ${getResourceDataObject('compounds', ['steel', 'upgrades', 'autoBuyer', 'tier1', 'quantity'])}`, 'steelAB1Quantity', ['autoBuyer-building-quantity']),
                createToggleSwitch('steel1Toggle', true, (isEnabled) => {
                    setResourceDataObject(isEnabled, 'compounds', ['steel', 'upgrades', 'autoBuyer', 'tier1', 'active']);
                }, ['toggle-switch-spacing']),
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
                createButton(`Add ${Math.floor(getResourceDataObject('compounds', ['steel', 'upgrades', 'autoBuyer', 'tier2', 'rate']) * getTimerRateRatio())} Steel /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'steelAB2Quantity', 'autoBuyer', true, 'tier2', 'steel', 'compounds')
                }, 'upgradeCheck', '', 'autoBuyer', null, 'steel', true, 'tier2', 'compound'),
                createTextElement(`Quantity: ${getResourceDataObject('compounds', ['steel', 'upgrades', 'autoBuyer', 'tier2', 'quantity'])}`, 'steelAB2Quantity', ['autoBuyer-building-quantity']),
                createToggleSwitch('steel2Toggle', true, (isEnabled) => {
                    setResourceDataObject(isEnabled, 'compounds', ['steel', 'upgrades', 'autoBuyer', 'tier2', 'active']);
                }, ['toggle-switch-spacing']),
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
                createButton(`Add ${Math.floor(getResourceDataObject('compounds', ['steel', 'upgrades', 'autoBuyer', 'tier3', 'rate']) * getTimerRateRatio())} Steel /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'steelAB3Quantity', 'autoBuyer', true, 'tier3', 'steel', 'compounds')
                }, 'upgradeCheck', '', 'autoBuyer', null, 'steel', true, 'tier3', 'compound'),
                createTextElement(`Quantity: ${getResourceDataObject('compounds', ['steel', 'upgrades', 'autoBuyer', 'tier3', 'quantity'])}`, 'steelAB3Quantity', ['autoBuyer-building-quantity']),
                createToggleSwitch('steel3Toggle', true, (isEnabled) => {
                    setResourceDataObject(isEnabled, 'compounds', ['steel', 'upgrades', 'autoBuyer', 'tier3', 'active']);
                }, ['toggle-switch-spacing']),
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
                createButton(`Add ${Math.floor(getResourceDataObject('compounds', ['steel', 'upgrades', 'autoBuyer', 'tier4', 'rate']) * getTimerRateRatio())} Steel /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'steelAB4Quantity', 'autoBuyer', true, 'tier4', 'steel', 'compounds')
                }, 'upgradeCheck', '', 'autoBuyer', null, 'steel', true, 'tier4', 'compound'),
                createTextElement(`Quantity: ${getResourceDataObject('compounds', ['steel', 'upgrades', 'autoBuyer', 'tier4', 'quantity'])}`, 'steelAB4Quantity', ['autoBuyer-building-quantity']),
                createToggleSwitch('steel4Toggle', true, (isEnabled) => {
                    setResourceDataObject(isEnabled, 'compounds', ['steel', 'upgrades', 'autoBuyer', 'tier4', 'active']);
                }, ['toggle-switch-spacing']),
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
        
        if (heading === 'Concrete') {
            let storagePrice = getResourceDataObject('compounds', ['concrete', 'storageCapacity']);
            let autobuyer1Price = getResourceDataObject('compounds', ['concrete', 'upgrades', 'autoBuyer', 'tier1', 'price']);
            let autobuyer2Price = getResourceDataObject('compounds', ['concrete', 'upgrades', 'autoBuyer', 'tier2', 'price']);
            let autobuyer3Price = getResourceDataObject('compounds', ['concrete', 'upgrades', 'autoBuyer', 'tier3', 'price']);
            let autobuyer4Price = getResourceDataObject('compounds', ['concrete', 'upgrades', 'autoBuyer', 'tier4', 'price']);
        
            const concreteCreateRow = createOptionRow(
                'concreteCreateRow',
                null,
                'Create Concrete:',
                createDropdown('concreteCreateSelectQuantity', [
                    { value: 'max', text: 'Max Possible' },
                    { value: 'threeQuarters', text: 'Up to 75%' },
                    { value: 'twoThirds', text: 'Up to 67%' },
                    { value: 'half', text: 'Up to 50%' },
                    { value: 'oneThird', text: 'Up to 33%' },
                    { value: '50000', text: '50000 - 250K Sil, 100K Sod, 150K Hyd' },
                    { value: '5000', text: '5000 - 25K Sil, 10K Sod, 15K Hyd' },
                    { value: '500', text: '500 - 2.5K Sil, 1K Sod, 1.5K Hyd' },
                    { value: '50', text: '50 - 250 Sil, 100 Sod, 150 Hyd' },
                    { value: '5', text: '5 - 25 Sil, 10 Sod, 15 Hyd' },
                    { value: '1', text: '1 - 5 Sil, 2 Sod, 3 Hyd' },
                ], 'max', (value) => {
                    setCreateCompoundPreview('concrete', value);
                }),
                createButton('Create', ['option-button', 'red-disabled-text', 'compound-cost-sell-check', 'create'], () => {
                    createCompound('concrete');
                }, 'createCompound', null, null, null, 'concrete', true, null, 'compound'),
                null,
                null,
                null,
                `${getCompoundCreatePreview('concrete')}`,
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
            optionContentElement.appendChild(concreteCreateRow);
        
            const concreteSellRow = createOptionRow(
                'concreteSellRow',
                null,
                'Sell Concrete:',
                createDropdown('concreteSellSelectQuantity', [
                    { value: 'all', text: 'All Stock' },
                    { value: 'threeQuarters', text: '75% Stock' },
                    { value: 'twoThirds', text: '67% Stock' },
                    { value: 'half', text: '50% Stock' },
                    { value: 'oneThird', text: '33% Stock' },
                    { value: '100000', text: '100000' },
                    { value: '10000', text: '10000' },
                    { value: '1000', text: '1000' },
                    { value: '100', text: '100' },
                    { value: '10', text: '10' },
                    { value: '1', text: '1' },
                ], 'all', (value) => {
                    setSaleCompoundPreview('concrete', value);
                }),
                createButton('Sell', ['option-button', 'red-disabled-text', 'compound-cost-sell-check', 'sell'], () => {
                    sellCompound('concrete');
                }, 'sellCompound', null, null, null, 'concrete', true, null, 'compound'),
                createTextElement(`Auto:`, '', ['autoBuyer-building-quantity']),
                createToggleSwitch('autoSellToggle', false, (isEnabled) => {
                    setResourceDataObject(isEnabled, 'compounds', ['concrete', 'autoSell']);
                }, ['toggle-switch-spacing']),
                null,
                null,
                `${getCompoundSalePreview('concrete')}`,
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
            optionContentElement.appendChild(concreteSellRow);
            const toggleSwitch = concreteSellRow.querySelector('#autoSellToggle');
            if (toggleSwitch) {
                toggleSwitch.setAttribute('data-type', 'compounds');
            }
        
            const concreteIncreaseStorageRow = createOptionRow(
                'concreteIncreaseStorageRow',
                null,
                'Increase Storage:',
                createButton('Increase Storage', ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    increaseResourceStorage(['concreteQuantity'], ['concrete'], ['compounds']);
                    storagePrice = getResourceDataObject('compounds', ['concrete', 'storageCapacity']) - 1;
                }, 'upgradeCheck', '', 'storage', null, 'concrete', true, null, 'compound'),
                null,
                null,
                null,
                null,
                `${storagePrice + " " + getResourceDataObject('compounds', ['concrete', 'nameResource'])}`,
                '',
                'upgradeCheck',
                'storage',
                null,
                'concrete',
                null,
                false,
                'concrete',
                null,
                'compound'
            );
            optionContentElement.appendChild(concreteIncreaseStorageRow);
        
            const concreteAutoBuyer1Row = createOptionRow(
                'concreteAutoBuyer1Row',
                getResourceDataObject('compounds', ['concrete', 'upgrades', 'autoBuyer', 'tier1', 'nameUpgrade']),
                'Concrete Auto Buyer Tier 1:',
                createButton(`Add ${Math.floor(getResourceDataObject('compounds', ['concrete', 'upgrades', 'autoBuyer', 'tier1', 'rate']) * getTimerRateRatio())} Concrete /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'concreteAB1Quantity', 'autoBuyer', true, 'tier1', 'concrete', 'compounds')
                }, 'upgradeCheck', '', 'autoBuyer', null, 'concrete', true, 'tier1', 'compound'),
                createTextElement(`Quantity: ${getResourceDataObject('compounds', ['concrete', 'upgrades', 'autoBuyer', 'tier1', 'quantity'])}`, 'concreteAB1Quantity', ['autoBuyer-building-quantity']),
                createToggleSwitch('concrete1Toggle', true, (isEnabled) => {
                    setResourceDataObject(isEnabled, 'compounds', ['concrete', 'upgrades', 'autoBuyer', 'tier1', 'active']);
                }, ['toggle-switch-spacing']),
                null,
                null,
                `${autobuyer1Price + " " + getResourceDataObject('compounds', ['concrete', 'nameResource'])}`,
                '',
                'upgradeCheck',
                'autoBuyer',
                null,
                'concrete',
                'tier1',
                false,
                null,
                null,
                'compound'
            );
            optionContentElement.appendChild(concreteAutoBuyer1Row);
        
            const concreteAutoBuyer2Row = createOptionRow(
                'concreteAutoBuyer2Row',
                getResourceDataObject('compounds', ['concrete', 'upgrades', 'autoBuyer', 'tier2', 'nameUpgrade']),
                'Concrete Auto Buyer Tier 2:',
                createButton(`Add ${Math.floor(getResourceDataObject('compounds', ['concrete', 'upgrades', 'autoBuyer', 'tier2', 'rate']) * getTimerRateRatio())} Concrete /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'concreteAB2Quantity', 'autoBuyer', true, 'tier2', 'concrete', 'compounds')
                }, 'upgradeCheck', '', 'autoBuyer', null, 'concrete', true, 'tier2', 'compound'),
                createTextElement(`Quantity: ${getResourceDataObject('compounds', ['concrete', 'upgrades', 'autoBuyer', 'tier2', 'quantity'])}`, 'concreteAB2Quantity', ['autoBuyer-building-quantity']),
                createToggleSwitch('concrete2Toggle', true, (isEnabled) => {
                    setResourceDataObject(isEnabled, 'compounds', ['concrete', 'upgrades', 'autoBuyer', 'tier2', 'active']);
                }, ['toggle-switch-spacing']),
                null,
                null,
                `${autobuyer2Price + " " + getResourceDataObject('compounds', ['concrete', 'nameResource'])}`,
                '',
                'upgradeCheck',
                'autoBuyer',
                null,
                'concrete',
                'tier2',
                false,
                null,
                null,
                'compound'
            );
            optionContentElement.appendChild(concreteAutoBuyer2Row);
        
            const concreteAutoBuyer3Row = createOptionRow(
                'concreteAutoBuyer3Row',
                getResourceDataObject('compounds', ['concrete', 'upgrades', 'autoBuyer', 'tier3', 'nameUpgrade']),
                'Concrete Auto Buyer Tier 3:',
                createButton(`Add ${Math.floor(getResourceDataObject('compounds', ['concrete', 'upgrades', 'autoBuyer', 'tier3', 'rate']) * getTimerRateRatio())} Concrete /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'concreteAB3Quantity', 'autoBuyer', true, 'tier3', 'concrete', 'compounds')
                }, 'upgradeCheck', '', 'autoBuyer', null, 'concrete', true, 'tier3', 'compound'),
                createTextElement(`Quantity: ${getResourceDataObject('compounds', ['concrete', 'upgrades', 'autoBuyer', 'tier3', 'quantity'])}`, 'concreteAB3Quantity', ['autoBuyer-building-quantity']),
                createToggleSwitch('concrete3Toggle', true, (isEnabled) => {
                    setResourceDataObject(isEnabled, 'compounds', ['concrete', 'upgrades', 'autoBuyer', 'tier3', 'active']);
                }, ['toggle-switch-spacing']),
                null,
                null,
                `${autobuyer3Price + " " + getResourceDataObject('compounds', ['concrete', 'nameResource'])}`,
                '',
                'upgradeCheck',
                'autoBuyer',
                null,
                'concrete',
                'tier3',
                false,
                null,
                null,
                'compound'
            );
            optionContentElement.appendChild(concreteAutoBuyer3Row);
        
            const concreteAutoBuyer4Row = createOptionRow(
                'concreteAutoBuyer4Row',
                getResourceDataObject('compounds', ['concrete', 'upgrades', 'autoBuyer', 'tier4', 'nameUpgrade']),
                'Concrete Auto Buyer Tier 4:',
                createButton(`Add ${Math.floor(getResourceDataObject('compounds', ['concrete', 'upgrades', 'autoBuyer', 'tier4', 'rate']) * getTimerRateRatio())} Concrete /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'concreteAB4Quantity', 'autoBuyer', true, 'tier4', 'concrete', 'compounds')
                }, 'upgradeCheck', '', 'autoBuyer', null, 'concrete', true, 'tier4', 'compound'),
                createTextElement(`Quantity: ${getResourceDataObject('compounds', ['concrete', 'upgrades', 'autoBuyer', 'tier4', 'quantity'])}`, 'concreteAB4Quantity', ['autoBuyer-building-quantity']),
                createToggleSwitch('concrete4Toggle', true, (isEnabled) => {
                    setResourceDataObject(isEnabled, 'compounds', ['concrete', 'upgrades', 'autoBuyer', 'tier4', 'active']);
                }, ['toggle-switch-spacing']),
                null,
                null,
                `${autobuyer4Price + " " + getResourceDataObject('compounds', ['concrete', 'nameResource'])}`,
                '',
                'upgradeCheck',
                'autoBuyer',
                null,
                'concrete',
                'tier4',
                false,
                null,
                null,
                'compound'
            );
            optionContentElement.appendChild(concreteAutoBuyer4Row);
        }
        
        if (heading === 'Water') {
            let storagePrice = getResourceDataObject('compounds', ['water', 'storageCapacity']);
            let extraResourceName;

            let autobuyer1Price = getResourceDataObject('compounds', ['water', 'upgrades', 'autoBuyer', 'tier1', 'price']);
            let autobuyer2Price = getResourceDataObject('compounds', ['water', 'upgrades', 'autoBuyer', 'tier2', 'price']);
            let autobuyer3Price = getResourceDataObject('compounds', ['water', 'upgrades', 'autoBuyer', 'tier3', 'price']);
            let autobuyer4Price = getResourceDataObject('compounds', ['water', 'upgrades', 'autoBuyer', 'tier4', 'price']);
        
            const waterCreateRow = createOptionRow(
                'waterCreateRow',
                null,
                'Create Water:',
                createDropdown('waterCreateSelectQuantity', [
                    { value: 'max', text: 'Max Possible' },
                    { value: 'threeQuarters', text: 'Up to 75%' },
                    { value: 'twoThirds', text: 'Up to 67%' },
                    { value: 'half', text: 'Up to 50%' },
                    { value: 'oneThird', text: 'Up to 33%' },
                    { value: '50000', text: '50000 - 1M Hyd, 500K Oxy' },
                    { value: '5000', text: '5000 - 100K Hyd, 50K Oxy' },
                    { value: '500', text: '500 - 10K Hyd, 5K Oxy' },
                    { value: '50', text: '50 - 1K Hyd, 500 Oxy' },
                    { value: '5', text: '5 - 100 Hyd, 50 Oxy' },
                    { value: '1', text: '1 - 20 Hyd, 10 Oxy' },
                ], 'max', (value) => {
                    setCreateCompoundPreview('water', value);
                }),
                createButton('Create', ['option-button', 'red-disabled-text', 'compound-cost-sell-check', 'create'], () => {
                    createCompound('water');
                }, 'createCompound', null, null, null, 'water', true, null, 'compound'),
                null,
                null,
                null,
                `${getCompoundCreatePreview('water')}`,
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
            optionContentElement.appendChild(waterCreateRow);
        
            const waterSellRow = createOptionRow(
                'waterSellRow',
                null,
                'Sell Water:',
                createDropdown('waterSellSelectQuantity', [
                    { value: 'all', text: 'All Stock' },
                    { value: 'threeQuarters', text: '75% Stock' },
                    { value: 'twoThirds', text: '67% Stock' },
                    { value: 'half', text: '50% Stock' },
                    { value: 'oneThird', text: '33% Stock' },
                    { value: '100000', text: '100000' },
                    { value: '10000', text: '10000' },
                    { value: '1000', text: '1000' },
                    { value: '100', text: '100' },
                    { value: '10', text: '10' },
                    { value: '1', text: '1' },
                ], 'all', (value) => {
                    setSaleCompoundPreview('water', value);
                }),
                createButton('Sell', ['option-button', 'red-disabled-text', 'compound-cost-sell-check', 'sell'], () => {
                    sellCompound('water');
                }, 'sellCompound', null, null, null, 'water', true, null, 'compound'),
                createTextElement(`Auto:`, '', ['autoBuyer-building-quantity']),
                createToggleSwitch('autoSellToggle', false, (isEnabled) => {
                    setResourceDataObject(isEnabled, 'compounds', ['water', 'autoSell']);
                }, ['toggle-switch-spacing']),
                null,
                null,
                `${getCompoundSalePreview('water')}`,
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
            optionContentElement.appendChild(waterSellRow);
            const toggleSwitch = waterSellRow.querySelector('#autoSellToggle');
            if (toggleSwitch) {
                toggleSwitch.setAttribute('data-type', 'compounds');
            }
        
            const waterIncreaseStorageRow = createOptionRow(
                'waterIncreaseStorageRow',
                null,
                'Enlarge Reservoir:',
                createButton('Enlarge Reservoir', ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    increaseResourceStorage(['waterQuantity', 'concreteQuantity'], ['water', 'concrete'], ['compounds', 'compounds']);
                    storagePrice = getResourceDataObject('compounds', ['water', 'storageCapacity']) - 1;
                    extraResourceName = 'Concrete';
                }, 'upgradeCheck', '', 'storage', null, 'water', true, null, 'compound'),
                null,
                null,
                null,
                null,
                `${storagePrice + " " + getResourceDataObject('compounds', ['water', 'nameResource'])}, ${getResourceDataObject('compounds', ['concrete', 'currentSecondaryIncreasePrice'])} ${getResourceDataObject('compounds', ['concrete', 'nameResource'])}`,
                '',
                'upgradeCheck',
                'storage',
                null,
                'water',
                null,
                false,
                'water',
                null,
                'compound'
            );
            optionContentElement.appendChild(waterIncreaseStorageRow);
        
            const waterAutoBuyer1Row = createOptionRow(
                'waterAutoBuyer1Row',
                getResourceDataObject('compounds', ['water', 'upgrades', 'autoBuyer', 'tier1', 'nameUpgrade']),
                'Water Auto Buyer Tier 1:',
                createButton(`Add ${Math.floor(getResourceDataObject('compounds', ['water', 'upgrades', 'autoBuyer', 'tier1', 'rate']) * getTimerRateRatio())} Water /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'waterAB1Quantity', 'autoBuyer', true, 'tier1', 'water', 'compounds')
                }, 'upgradeCheck', '', 'autoBuyer', null, 'water', true, 'tier1', 'compound'),
                createTextElement(`Quantity: ${getResourceDataObject('compounds', ['water', 'upgrades', 'autoBuyer', 'tier1', 'quantity'])}`, 'waterAB1Quantity', ['autoBuyer-building-quantity']),
                createToggleSwitch('water1Toggle', true, (isEnabled) => {
                    setResourceDataObject(isEnabled, 'compounds', ['water', 'upgrades', 'autoBuyer', 'tier1', 'active']);
                }, ['toggle-switch-spacing']),
                null,
                null,
                `${autobuyer1Price + " " + getResourceDataObject('compounds', ['water', 'nameResource'])}`,
                '',
                'upgradeCheck',
                'autoBuyer',
                null,
                'water',
                'tier1',
                false,
                null,
                null,
                'compound'
            );
            optionContentElement.appendChild(waterAutoBuyer1Row);
        
            const waterAutoBuyer2Row = createOptionRow(
                'waterAutoBuyer2Row',
                getResourceDataObject('compounds', ['water', 'upgrades', 'autoBuyer', 'tier2', 'nameUpgrade']),
                'Water Auto Buyer Tier 2:',
                createButton(`Add ${Math.floor(getResourceDataObject('compounds', ['water', 'upgrades', 'autoBuyer', 'tier2', 'rate']) * getTimerRateRatio())} Water /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'waterAB2Quantity', 'autoBuyer', true, 'tier2', 'water', 'compounds')
                }, 'upgradeCheck', '', 'autoBuyer', null, 'water', true, 'tier2', 'compound'),
                createTextElement(`Quantity: ${getResourceDataObject('compounds', ['water', 'upgrades', 'autoBuyer', 'tier2', 'quantity'])}`, 'waterAB2Quantity', ['autoBuyer-building-quantity']),
                createToggleSwitch('water2Toggle', true, (isEnabled) => {
                    setResourceDataObject(isEnabled, 'compounds', ['water', 'upgrades', 'autoBuyer', 'tier2', 'active']);
                }, ['toggle-switch-spacing']),
                null,
                null,
                `${autobuyer2Price + " " + getResourceDataObject('compounds', ['water', 'nameResource'])}`,
                '',
                'upgradeCheck',
                'autoBuyer',
                null,
                'water',
                'tier2',
                false,
                null,
                null,
                'compound'
            );
            optionContentElement.appendChild(waterAutoBuyer2Row);
        
            const waterAutoBuyer3Row = createOptionRow(
                'waterAutoBuyer3Row',
                getResourceDataObject('compounds', ['water', 'upgrades', 'autoBuyer', 'tier3', 'nameUpgrade']),
                'Water Auto Buyer Tier 3:',
                createButton(`Add ${Math.floor(getResourceDataObject('compounds', ['water', 'upgrades', 'autoBuyer', 'tier3', 'rate']) * getTimerRateRatio())} Water /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'waterAB3Quantity', 'autoBuyer', true, 'tier3', 'water', 'compounds')
                }, 'upgradeCheck', '', 'autoBuyer', null, 'water', true, 'tier3', 'compound'),
                createTextElement(`Quantity: ${getResourceDataObject('compounds', ['water', 'upgrades', 'autoBuyer', 'tier3', 'quantity'])}`, 'waterAB3Quantity', ['autoBuyer-building-quantity']),
                createToggleSwitch('water31Toggle', true, (isEnabled) => {
                    setResourceDataObject(isEnabled, 'compounds', ['water', 'upgrades', 'autoBuyer', 'tier3', 'active']);
                }, ['toggle-switch-spacing']),
                null,
                null,
                `${autobuyer3Price + " " + getResourceDataObject('compounds', ['water', 'nameResource'])}`,
                '',
                'upgradeCheck',
                'autoBuyer',
                null,
                'water',
                'tier3',
                false,
                null,
                null,
                'compound'
            );
            optionContentElement.appendChild(waterAutoBuyer3Row);
        
            const waterAutoBuyer4Row = createOptionRow(
                'waterAutoBuyer4Row',
                getResourceDataObject('compounds', ['water', 'upgrades', 'autoBuyer', 'tier4', 'nameUpgrade']),
                'Water Auto Buyer Tier 4:',
                createButton(`Add ${Math.floor(getResourceDataObject('compounds', ['water', 'upgrades', 'autoBuyer', 'tier4', 'rate']) * getTimerRateRatio())} Water /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'waterAB4Quantity', 'autoBuyer', true, 'tier4', 'water', 'compounds')
                }, 'upgradeCheck', '', 'autoBuyer', null, 'water', true, 'tier4', 'compound'),
                createTextElement(`Quantity: ${getResourceDataObject('compounds', ['water', 'upgrades', 'autoBuyer', 'tier4', 'quantity'])}`, 'waterAB4Quantity', ['autoBuyer-building-quantity']),
                createToggleSwitch('water4Toggle', true, (isEnabled) => {
                    setResourceDataObject(isEnabled, 'compounds', ['water', 'upgrades', 'autoBuyer', 'tier4', 'active']);
                }, ['toggle-switch-spacing']),
                null,
                null,
                `${autobuyer4Price + " " + getResourceDataObject('compounds', ['water', 'nameResource'])}`,
                '',
                'upgradeCheck',
                'autoBuyer',
                null,
                'water',
                'tier4',
                false,
                null,
                null,
                'compound'
            );
            optionContentElement.appendChild(waterAutoBuyer4Row);
        }
        if (heading === 'Titanium') {
            let storagePrice = getResourceDataObject('compounds', ['titanium', 'storageCapacity']);
            let autobuyer1Price = getResourceDataObject('compounds', ['titanium', 'upgrades', 'autoBuyer', 'tier1', 'price']);
            let autobuyer2Price = getResourceDataObject('compounds', ['titanium', 'upgrades', 'autoBuyer', 'tier2', 'price']);
            let autobuyer3Price = getResourceDataObject('compounds', ['titanium', 'upgrades', 'autoBuyer', 'tier3', 'price']);
            let autobuyer4Price = getResourceDataObject('compounds', ['titanium', 'upgrades', 'autoBuyer', 'tier4', 'price']);
        
            const titaniumCreateRow = createOptionRow(
                'titaniumCreateRow',
                null,
                'Create Titanium:',
                createDropdown('titaniumCreateSelectQuantity', [
                    { value: 'max', text: 'Max Possible' },
                    { value: 'threeQuarters', text: 'Up to 75%' },
                    { value: 'twoThirds', text: 'Up to 67%' },
                    { value: 'half', text: 'Up to 50%' },
                    { value: 'oneThird', text: 'Up to 33%' },
                    { value: '50000', text: '50000 - 1.1M Irn, 900K Sod, 2M Neo' },
                    { value: '5000', text: '5000 - 110K Irn, 90K Sod, 200K Neo' },
                    { value: '500', text: '500 - 11K Irn, 9K Sod, 20K Neo' },
                    { value: '50', text: '50 - 1.1K Irn, 900 Sod, 2K Neo' },
                    { value: '5', text: '5 - 110 Irn, 90 Sod, 200 Neo' },
                    { value: '1', text: '1 - 22 Irn, 18 Sod, 40 Neo' },
                ], 'max', (value) => {
                    setCreateCompoundPreview('titanium', value);
                }),
                createButton('Create', ['option-button', 'red-disabled-text', 'compound-cost-sell-check', 'create'], () => {
                    createCompound('titanium');
                }, 'createCompound', null, null, null, 'titanium', true, null, 'compound'),
                null,
                null,
                null,
                `${getCompoundCreatePreview('titanium')}`,
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
            optionContentElement.appendChild(titaniumCreateRow);
        
            const titaniumSellRow = createOptionRow(
                'titaniumSellRow',
                null,
                'Sell Titanium:',
                createDropdown('titaniumSellSelectQuantity', [
                    { value: 'all', text: 'All Stock' },
                    { value: 'threeQuarters', text: '75% Stock' },
                    { value: 'twoThirds', text: '67% Stock' },
                    { value: 'half', text: '50% Stock' },
                    { value: 'oneThird', text: '33% Stock' },
                    { value: '100000', text: '100000' },
                    { value: '10000', text: '10000' },
                    { value: '1000', text: '1000' },
                    { value: '100', text: '100' },
                    { value: '10', text: '10' },
                    { value: '1', text: '1' },
                ], 'all', (value) => {
                    setSaleCompoundPreview('titanium', value);
                }),
                createButton('Sell', ['option-button', 'red-disabled-text', 'compound-cost-sell-check', 'sell'], () => {
                    sellCompound('titanium');
                }, 'sellCompound', null, null, null, 'titanium', true, null, 'compound'),
                createTextElement(`Auto:`, '', ['autoBuyer-building-quantity']),
                createToggleSwitch('autoSellToggle', false, (isEnabled) => {
                    setResourceDataObject(isEnabled, 'compounds', ['titanium', 'autoSell']);
                }, ['toggle-switch-spacing']),
                null,
                null,
                `${getCompoundSalePreview('titanium')}`,
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
            optionContentElement.appendChild(titaniumSellRow);
            const toggleSwitch = titaniumSellRow.querySelector('#autoSellToggle');
            if (toggleSwitch) {
                toggleSwitch.setAttribute('data-type', 'compounds');
            }
        
            const titaniumIncreaseStorageRow = createOptionRow(
                'titaniumIncreaseStorageRow',
                null,
                'Increase Storage:',
                createButton('Increase Storage', ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    increaseResourceStorage(['titaniumQuantity'], ['titanium'], ['compounds']);
                    storagePrice = getResourceDataObject('compounds', ['titanium', 'storageCapacity']) - 1;
                }, 'upgradeCheck', '', 'storage', null, 'titanium', true, null, 'compound'),
                null,
                null,
                null,
                null,
                `${storagePrice + " " + getResourceDataObject('compounds', ['titanium', 'nameResource'])}`,
                '',
                'upgradeCheck',
                'storage',
                null,
                'titanium',
                null,
                false,
                'titanium',
                null,
                'compound'
            );
            optionContentElement.appendChild(titaniumIncreaseStorageRow);
        
            const titaniumAutoBuyer1Row = createOptionRow(
                'titaniumAutoBuyer1Row',
                getResourceDataObject('compounds', ['titanium', 'upgrades', 'autoBuyer', 'tier1', 'nameUpgrade']),
                'Titanium Auto Buyer Tier 1:',
                createButton(`Add ${Math.floor(getResourceDataObject('compounds', ['titanium', 'upgrades', 'autoBuyer', 'tier1', 'rate']) * getTimerRateRatio())} Titanium /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'titaniumAB1Quantity', 'autoBuyer', true, 'tier1', 'titanium', 'compounds')
                }, 'upgradeCheck', '', 'autoBuyer', null, 'titanium', true, 'tier1', 'compound'),
                createTextElement(`Quantity: ${getResourceDataObject('compounds', ['titanium', 'upgrades', 'autoBuyer', 'tier1', 'quantity'])}`, 'titaniumAB1Quantity', ['autoBuyer-building-quantity']),
                createToggleSwitch('titanium1Toggle', true, (isEnabled) => {
                    setResourceDataObject(isEnabled, 'compounds', ['titanium', 'upgrades', 'autoBuyer', 'tier1', 'active']);
                }, ['toggle-switch-spacing']),
                null,
                null,
                `${autobuyer1Price + " " + getResourceDataObject('compounds', ['titanium', 'nameResource'])}`,
                '',
                'upgradeCheck',
                'autoBuyer',
                null,
                'titanium',
                'tier1',
                false,
                null,
                null,
                'compound'
            );
            optionContentElement.appendChild(titaniumAutoBuyer1Row);
        
            const titaniumAutoBuyer2Row = createOptionRow(
                'titaniumAutoBuyer2Row',
                getResourceDataObject('compounds', ['titanium', 'upgrades', 'autoBuyer', 'tier2', 'nameUpgrade']),
                'Titanium Auto Buyer Tier 2:',
                createButton(`Add ${Math.floor(getResourceDataObject('compounds', ['titanium', 'upgrades', 'autoBuyer', 'tier2', 'rate']) * getTimerRateRatio())} Titanium /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'titaniumAB2Quantity', 'autoBuyer', true, 'tier2', 'titanium', 'compounds')
                }, 'upgradeCheck', '', 'autoBuyer', null, 'titanium', true, 'tier2', 'compound'),
                createTextElement(`Quantity: ${getResourceDataObject('compounds', ['titanium', 'upgrades', 'autoBuyer', 'tier2', 'quantity'])}`, 'titaniumAB2Quantity', ['autoBuyer-building-quantity']),
                createToggleSwitch('titanium2Toggle', true, (isEnabled) => {
                    setResourceDataObject(isEnabled, 'compounds', ['titanium', 'upgrades', 'autoBuyer', 'tier2', 'active']);
                }, ['toggle-switch-spacing']),
                null,
                null,
                `${autobuyer2Price + " " + getResourceDataObject('compounds', ['titanium', 'nameResource'])}`,
                '',
                'upgradeCheck',
                'autoBuyer',
                null,
                'titanium',
                'tier2',
                false,
                null,
                null,
                'compound'
            );
            optionContentElement.appendChild(titaniumAutoBuyer2Row);
        
            const titaniumAutoBuyer3Row = createOptionRow(
                'titaniumAutoBuyer3Row',
                getResourceDataObject('compounds', ['titanium', 'upgrades', 'autoBuyer', 'tier3', 'nameUpgrade']),
                'Titanium Auto Buyer Tier 3:',
                createButton(`Add ${Math.floor(getResourceDataObject('compounds', ['titanium', 'upgrades', 'autoBuyer', 'tier3', 'rate']) * getTimerRateRatio())} Titanium /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'titaniumAB3Quantity', 'autoBuyer', true, 'tier3', 'titanium', 'compounds')
                }, 'upgradeCheck', '', 'autoBuyer', null, 'titanium', true, 'tier3', 'compound'),
                createTextElement(`Quantity: ${getResourceDataObject('compounds', ['titanium', 'upgrades', 'autoBuyer', 'tier3', 'quantity'])}`, 'titaniumAB3Quantity', ['autoBuyer-building-quantity']),
                createToggleSwitch('titanium3Toggle', true, (isEnabled) => {
                    setResourceDataObject(isEnabled, 'compounds', ['titanium', 'upgrades', 'autoBuyer', 'tier3', 'active']);
                }, ['toggle-switch-spacing']),
                null,
                null,
                `${autobuyer3Price + " " + getResourceDataObject('compounds', ['titanium', 'nameResource'])}`,
                '',
                'upgradeCheck',
                'autoBuyer',
                null,
                'titanium',
                'tier3',
                false,
                null,
                null,
                'compound'
            );
            optionContentElement.appendChild(titaniumAutoBuyer3Row);
        
            const titaniumAutoBuyer4Row = createOptionRow(
                'titaniumAutoBuyer4Row',
                getResourceDataObject('compounds', ['titanium', 'upgrades', 'autoBuyer', 'tier4', 'nameUpgrade']),
                'Titanium Auto Buyer Tier 4:',
                createButton(`Add ${Math.floor(getResourceDataObject('compounds', ['titanium', 'upgrades', 'autoBuyer', 'tier4', 'rate']) * getTimerRateRatio())} Titanium /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
                    gain(1, 'titaniumAB4Quantity', 'autoBuyer', true, 'tier4', 'titanium', 'compounds')
                }, 'upgradeCheck', '', 'autoBuyer', null, 'titanium', true, 'tier4', 'compound'),
                createTextElement(`Quantity: ${getResourceDataObject('compounds', ['titanium', 'upgrades', 'autoBuyer', 'tier4', 'quantity'])}`, 'titaniumAB4Quantity', ['autoBuyer-building-quantity']),
                createToggleSwitch('titanium4Toggle', true, (isEnabled) => {
                    setResourceDataObject(isEnabled, 'compounds', ['titanium', 'upgrades', 'autoBuyer', 'tier4', 'active']);
                }, ['toggle-switch-spacing']),
                null,
                null,
                `${autobuyer4Price + " " + getResourceDataObject('compounds', ['titanium', 'nameResource'])}`,
                '',
                'upgradeCheck',
                'autoBuyer',
                null,
                'titanium',
                'tier4',
                false,
                null,
                null,
                'compound'
            );
            optionContentElement.appendChild(titaniumAutoBuyer4Row);
        }        
}