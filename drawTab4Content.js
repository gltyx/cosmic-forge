export function drawTab4Content(heading, optionContentElement) {
//         if (heading === 'Water') {
//             let storagePrice = getResourceDataObject('compounds', ['water', 'storageCapacity']);
//             let autobuyer1Price = getResourceDataObject('compounds', ['water', 'upgrades', 'autoBuyer', 'tier1', 'price']);
//             let autobuyer2Price = getResourceDataObject('compounds', ['water', 'upgrades', 'autoBuyer', 'tier2', 'price']);
//             let autobuyer3Price = getResourceDataObject('compounds', ['water', 'upgrades', 'autoBuyer', 'tier3', 'price']);
//             let autobuyer4Price = getResourceDataObject('compounds', ['water', 'upgrades', 'autoBuyer', 'tier4', 'price']);
    
//             const waterCreateRow = createOptionRow(
//                 'waterCreateRow',
//                 null,
//                 'Create Water:',
//                 createDropdown('waterCreateSelectQuantity', [
//                     { value: 'max', text: 'Max Possible' },
//                     { value: 'threeQuarters', text: 'Up to 75%' },
//                     { value: 'twoThirds', text: 'Up to 67%' },
//                     { value: 'half', text: 'Up to 50%' },
//                     { value: 'oneThird', text: 'Up to 33%' },
//                     { value: '50000', text: '100K Hyd. 50K Oxy' },
//                     { value: '5000', text: '10K Hyd. 5K Oxy' },
//                     { value: '500', text: '1K Hyd. 500 Oxy' },
//                     { value: '50', text: '100 Hyd. 50 Oxy' },
//                     { value: '5', text: '10 Hyd. 5 Oxy' },
//                     { value: '1', text: '2 Hyd. 1 Oxy' },
//                 ], 'all', (value) => {
//                     setCompoundCreatePreview('water', value, 'hydrogen', 'oxygen', '', '');
//                 }),
//                 createButton('Create', ['option-button', 'red-disabled-text', 'compound-cost-sell-check', 'create'], () => {
//                     createCompound('water');
//                 }, 'createCompound', null, null, null, 'water', true, null),
//                 null,
//                 null,
//                 null,
//                 `${getCompoundCreatePreview('water')}`,
//                 null,
//                 null,
//                 null,
//                 null,
//                 null,
//                 null,
//                 false,
//                 null,
//                 null
//             );
//             optionContentElement.appendChild(waterCreateRow);
    
//             const waterSellRow = createOptionRow(
//                 'waterSellRow',
//                 null,
//                 'Sell Water:',
//                 createDropdown('waterSellSelectQuantity', [
//                     { value: 'all', text: 'All Stock' },
//                     { value: 'threeQuarters', text: '75% Stock' },
//                     { value: 'twoThirds', text: '67% Stock' },
//                     { value: 'half', text: '50% Stock' },
//                     { value: 'oneThird', text: '33% Stock' },
//                     { value: '100000', text: '100,000' },
//                     { value: '10000', text: '10,000' },
//                     { value: '1000', text: '1,000' },
//                     { value: '100', text: '100' },
//                     { value: '10', text: '10' },
//                     { value: '1', text: '1' },
//                 ], 'all', (value) => {
//                     setCompoundSalePreview('water', value);
//                 }),
//                 createButton('Sell', ['option-button', 'red-disabled-text', 'compound-cost-sell-check', 'sell'], () => {
//                     sellCompound('water');
//                 }, 'sellCompound', null, null, null, 'water', true, null),
//                 null,
//                 null,
//                 null,
//                 null,
//                 `${getCompoundSalePreview('water')}`,
//                 null,
//                 null,
//                 null,
//                 null,
//                 null,
//                 false,
//                 null,
//                 null
//             );
//             optionContentElement.appendChild(waterSellRow);
    
//             const waterIncreaseStorageRow = createOptionRow(
//                 'waterIncreaseStorageRow',
//                 null,
//                 'Increase Storage:',
//                 createButton('Increase Storage', ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
//                     increaseCompoundStorage('waterQuantity', 'water');
//                     storagePrice = getResourceDataObject('compounds', ['water', 'storageCapacity']);
//                 }, 'upgradeCheck', '', 'storage', null, 'water', true, null),
//                 null,
//                 null,
//                 null,
//                 null,
//                 `${storagePrice + " " + getResourceDataObject('compounds', ['water', 'nameResource'])}`,
//                 '',
//                 'upgradeCheck',
//                 'storage',
//                 null,
//                 'water',
//                 null,
//                 false,
//                 'water',
//                 null
//             );
//             optionContentElement.appendChild(waterIncreaseStorageRow);
    
//             const waterAutoBuyer1Row = createOptionRow(
//                 'waterAutoBuyer1Row',
//                 getResourceDataObject('compounds', ['water', 'upgrades', 'autoBuyer', 'tier1', 'nameUpgrade']),
//                 'Water Auto Buyer Tier 1:',
//                 createButton(`Add ${getResourceDataObject('compounds', ['water', 'upgrades', 'autoBuyer', 'tier1', 'rate']) * getTimerRateRatio()} Water /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
//                     gain(1, 'waterAB1Quantity', 'autoBuyer', true, 'tier1', 'water'),
//                         startUpdateAutoBuyerTimersAndRates('water', 1);
//                 }, 'upgradeCheck', '', 'autoBuyer', null, 'water', true, 'tier1'),
//                 null,
//                 null,
//                 null,
//                 null,
//                 `${autobuyer1Price + " " + getResourceDataObject('compounds', ['water', 'nameResource'])}`,
//                 '',
//                 'upgradeCheck',
//                 'autoBuyer',
//                 null,
//                 'water',
//                 'tier1',
//                 false,
//                 null,
//                 null
//             );
//             optionContentElement.appendChild(waterAutoBuyer1Row);
    
//             const waterAutoBuyer2Row = createOptionRow(
//                 'waterAutoBuyer2Row',
//                 getResourceDataObject('compounds', ['water', 'upgrades', 'autoBuyer', 'tier2', 'nameUpgrade']),
//                 'Water Auto Buyer Tier 2:',
//                 createButton(`Add ${getResourceDataObject('compounds', ['water', 'upgrades', 'autoBuyer', 'tier2', 'rate']) * getTimerRateRatio()} Water /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
//                     gain(1, 'waterAB2Quantity', 'autoBuyer', true, 'tier2', 'water'),
//                         startUpdateAutoBuyerTimersAndRates('water', 2);
//                 }, 'upgradeCheck', '', 'autoBuyer', null, 'water', true, 'tier2'),
//                 null,
//                 null,
//                 null,
//                 null,
//                 `${autobuyer2Price + " " + getResourceDataObject('compounds', ['water', 'nameResource'])}`,
//                 '',
//                 'upgradeCheck',
//                 'autoBuyer',
//                 null,
//                 'water',
//                 'tier2',
//                 false,
//                 null,
//                 null
//             );
//             optionContentElement.appendChild(waterAutoBuyer2Row);
    
//             const waterAutoBuyer3Row = createOptionRow(
//                 'waterAutoBuyer3Row',
//                 getResourceDataObject('compounds', ['water', 'upgrades', 'autoBuyer', 'tier3', 'nameUpgrade']),
//                 'Water Auto Buyer Tier 3:',
//                 createButton(`Add ${getResourceDataObject('compounds', ['water', 'upgrades', 'autoBuyer', 'tier3', 'rate']) * getTimerRateRatio()} Water /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
//                     gain(1, 'waterAB3Quantity', 'autoBuyer', true, 'tier3', 'water'),
//                         startUpdateAutoBuyerTimersAndRates('water', 3);
//                 }, 'upgradeCheck', '', 'autoBuyer', null, 'water', true, 'tier3'),
//                 null,
//                 null,
//                 null,
//                 null,
//                 `${autobuyer3Price + " " + getResourceDataObject('compounds', ['water', 'nameResource'])}`,
//                 '',
//                 'upgradeCheck',
//                 'autoBuyer',
//                 null,
//                 'water',
//                 'tier3',
//                 false,
//                 null,
//                 null
//             );
//             optionContentElement.appendChild(waterAutoBuyer3Row);
    
//             const waterAutoBuyer4Row = createOptionRow(
//                 'waterAutoBuyer4Row',
//                 getResourceDataObject('compounds', ['water', 'upgrades', 'autoBuyer', 'tier4', 'nameUpgrade']),
//                 'Water Auto Buyer Tier 4:',
//                 createButton(`Add ${getResourceDataObject('compounds', ['water', 'upgrades', 'autoBuyer', 'tier4', 'rate']) * getTimerRateRatio()} Water /s`, ['option-button', 'red-disabled-text', 'compound-cost-sell-check'], () => {
//                     gain(1, 'waterAB4Quantity', 'autoBuyer', true, 'tier4', 'water'),
//                         startUpdateAutoBuyerTimersAndRates('water', 4);
//                 }, 'upgradeCheck', '', 'autoBuyer', null, 'water', true, 'tier4'),
//                 null,
//                 null,
//                 null,
//                 null,
//                 `${autobuyer4Price + " " + getResourceDataObject('compounds', ['water', 'nameResource'])}`,
//                 '',
//                 'upgradeCheck',
//                 'autoBuyer',
//                 null,
//                 'water',
//                 'tier4',
//                 false,
//                 null,
//                 null
//             );
//             optionContentElement.appendChild(waterAutoBuyer4Row);
//         }
}