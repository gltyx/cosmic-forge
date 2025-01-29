import { getTimerRateRatio, getCurrencySymbol, getBuildingTypeOnOff, setPowerOnOff, setRocketsFuellerStartedArray } from './constantsAndGlobalVars.js';
import { toggleBuildingTypeOnOff, addOrRemoveUsedPerSecForFuelRate, setEnergyCapacity, gain, startUpdateTimersAndRates, addBuildingPotentialRate, buildLaunchPad } from './game.js';
import { getRocketPartsNeededInTotalPerRocket, getRocketParts, setResourceDataObject, getResourceDataObject } from './resourceDataObject.js';
import { createTextElement, createOptionRow, createButton } from './ui.js';
import { capitaliseString } from './utilityFunctions.js';

export function drawTab6Content(heading, optionContentElement) {
    if (heading === 'Launch Pad') {
        const spaceBuildLaunchPadRow = createOptionRow(
                    'spaceBuildLaunchPadRow',
                    null,
                    'Launch Pad:',
                    createButton(`Build Launch Pad`, ['option-button', 'red-disabled-text', 'building-purchase-button', 'resource-cost-sell-check', 'launchPad'], () => {
                        buildLaunchPad();
                        document.getElementById('rocket1BuildRow').classList.remove('invisible');
                        document.getElementById('rocket2BuildRow').classList.remove('invisible');
                        document.getElementById('rocket3BuildRow').classList.remove('invisible');
                        document.getElementById('rocket4BuildRow').classList.remove('invisible');
                    }, 'upgradeCheck', '', 'spaceUpgrade', 'launchPad', 'cash', false, null, 'spaceMiningPurchase'),
                    createTextElement('Bought', 'launchPadAlreadyBoughtText', ['green-ready-text', 'invisible']),
                    null,
                    null,
                    null,
                    `${getCurrencySymbol() + getResourceDataObject('space', ['upgrades', 'launchPad', 'price'])}, 
                    ${getResourceDataObject('space', ['upgrades', 'launchPad', 'resource1Price'])[0]} ${capitaliseString(getResourceDataObject('space', ['upgrades', 'launchPad', 'resource1Price'])[1])}, 
                    ${getResourceDataObject('space', ['upgrades', 'launchPad', 'resource2Price'])[0]} ${capitaliseString(getResourceDataObject('space', ['upgrades', 'launchPad', 'resource2Price'])[1])}, 
                    ${getResourceDataObject('space', ['upgrades', 'launchPad', 'resource3Price'])[0]} ${capitaliseString(getResourceDataObject('space', ['upgrades', 'launchPad', 'resource3Price'])[1])}`,
                    '',
                    'upgradeCheck',
                    'spaceUpgrade',
                    'launchPad',
                    'cash',
                    null,
                    false,
                    null,
                    null,
                    'spaceMiningPurchase'
                );
                optionContentElement.appendChild(spaceBuildLaunchPadRow);

        const rocket1BuildRow = createOptionRow(
                    'rocket1BuildRow',
                    null,
                    'Rocket Miner 1:',
                    createButton(`Build Rocket Part`, ['option-button', 'red-disabled-text', 'building-purchase-button', 'resource-cost-sell-check'], () => {
                        gain(1, 'rocket1BuiltPartsQuantity', 'rocket1', false, null, 'space', 'space')
                    }, 'upgradeCheck', '', 'spaceUpgrade', 'rocket1', 'cash', false, null, 'spaceMiningPurchase'),
                    createTextElement(
                        `Built: <span id="rocket1BuiltPartsQuantity">${getRocketParts('rocket1')}</span> / <span id="rocket1TotalPartsQuantity">${getRocketPartsNeededInTotalPerRocket('rocket1')}</span>`,
                        'rocket1PartsCountText',
                        []
                      ),                      
                    null,
                    null,
                    null,
                    `${getCurrencySymbol() + getResourceDataObject('space', ['upgrades', 'rocket1', 'price'])}, 
                    ${getResourceDataObject('space', ['upgrades', 'rocket1', 'resource1Price'])[0]} ${capitaliseString(getResourceDataObject('space', ['upgrades', 'rocket1', 'resource1Price'])[1])}, 
                    ${getResourceDataObject('space', ['upgrades', 'rocket1', 'resource2Price'])[0]} ${capitaliseString(getResourceDataObject('space', ['upgrades', 'rocket1', 'resource2Price'])[1])}, 
                    ${getResourceDataObject('space', ['upgrades', 'rocket1', 'resource3Price'])[0]} ${capitaliseString(getResourceDataObject('space', ['upgrades', 'rocket1', 'resource3Price'])[1])}`,
                    '',
                    'upgradeCheck',
                    'spaceUpgrade',
                    'rocket1',
                    'cash',
                    null,
                    false,
                    null,
                    null,
                    'spaceMiningPurchase'
                );
                optionContentElement.appendChild(rocket1BuildRow);
        
                const rocket2BuildRow = createOptionRow(
                    'rocket2BuildRow',
                    null,
                    'Rocket Miner 2:',
                    createButton(`Build Rocket Part`, ['option-button', 'red-disabled-text', 'building-purchase-button', 'resource-cost-sell-check'], () => {
                        gain(1, 'rocket2BuiltPartsQuantity', 'rocket2', false, null, 'space', 'space')
                    }, 'upgradeCheck', '', 'spaceUpgrade', 'rocket2', 'cash', false, null, 'spaceMiningPurchase'),
                    createTextElement(
                        `Built: <span id="rocket2BuiltPartsQuantity">${getRocketParts('rocket2')}</span> / <span id="rocket2TotalPartsQuantity">${getRocketPartsNeededInTotalPerRocket('rocket2')}</span>`,
                        'rocket2PartsCountText',
                        []
                      ), 
                    null,
                    null,
                    null,
                    `${getCurrencySymbol() + getResourceDataObject('space', ['upgrades', 'rocket2', 'price'])}, 
                    ${getResourceDataObject('space', ['upgrades', 'rocket2', 'resource1Price'])[0]} ${capitaliseString(getResourceDataObject('space', ['upgrades', 'rocket2', 'resource1Price'])[1])}, 
                    ${getResourceDataObject('space', ['upgrades', 'rocket2', 'resource2Price'])[0]} ${capitaliseString(getResourceDataObject('space', ['upgrades', 'rocket2', 'resource2Price'])[1])}, 
                    ${getResourceDataObject('space', ['upgrades', 'rocket2', 'resource3Price'])[0]} ${capitaliseString(getResourceDataObject('space', ['upgrades', 'rocket2', 'resource3Price'])[1])}`,
                    '',
                    'upgradeCheck',
                    'spaceUpgrade',
                    'rocket2',
                    'cash',
                    null,
                    false,
                    null,
                    null,
                    'spaceMiningPurchase'
                );
                optionContentElement.appendChild(rocket2BuildRow);

        const rocket3BuildRow = createOptionRow(
                    'rocket3BuildRow',
                    null,
                    'Rocket Miner 3:',
                    createButton(`Build Rocket Part`, ['option-button', 'red-disabled-text', 'building-purchase-button', 'resource-cost-sell-check'], () => {
                        gain(1, 'rocket3BuiltPartsQuantity', 'rocket3', false, null, 'space', 'space')
                    }, 'upgradeCheck', '', 'spaceUpgrade', 'rocket3', 'cash', false, null, 'spaceMiningPurchase'),
                    createTextElement(
                        `Built: <span id="rocket3BuiltPartsQuantity">${getRocketParts('rocket3')}</span> / <span id="rocket3TotalPartsQuantity">${getRocketPartsNeededInTotalPerRocket('rocket3')}</span>`,
                        'rocket3PartsCountText',
                        []
                      ),
                    null,
                    null,
                    null,
                    `${getCurrencySymbol() + getResourceDataObject('space', ['upgrades', 'rocket3', 'price'])}, 
                    ${getResourceDataObject('space', ['upgrades', 'rocket3', 'resource1Price'])[0]} ${capitaliseString(getResourceDataObject('space', ['upgrades', 'rocket3', 'resource1Price'])[1])}, 
                    ${getResourceDataObject('space', ['upgrades', 'rocket3', 'resource2Price'])[0]} ${capitaliseString(getResourceDataObject('space', ['upgrades', 'rocket3', 'resource2Price'])[1])}, 
                    ${getResourceDataObject('space', ['upgrades', 'rocket3', 'resource3Price'])[0]} ${capitaliseString(getResourceDataObject('space', ['upgrades', 'rocket3', 'resource3Price'])[1])}`,
                    '',
                    'upgradeCheck',
                    'spaceUpgrade',
                    'rocket3',
                    'cash',
                    null,
                    false,
                    null,
                    null,
                    'spaceMiningPurchase'
                );
                optionContentElement.appendChild(rocket3BuildRow);

        const rocket4BuildRow = createOptionRow(
                    'rocket4BuildRow',
                    null,
                    'Rocket Miner 4:',
                    createButton(`Build Rocket Part`, ['option-button', 'red-disabled-text', 'building-purchase-button', 'resource-cost-sell-check'], () => {
                        gain(1, 'rocket4BuiltPartsQuantity', 'rocket4', false, null, 'space', 'space')
                    }, 'upgradeCheck', '', 'spaceUpgrade', 'rocket4', 'cash', false, null, 'spaceMiningPurchase'),
                    createTextElement(
                        `Built: <span id="rocket4BuiltPartsQuantity">${getRocketParts('rocket4')}</span> / <span id="rocket4TotalPartsQuantity">${getRocketPartsNeededInTotalPerRocket('rocket4')}</span>`,
                        'rocket4PartsCountText',
                        []
                      ),
                    null,
                    null,
                    null,
                    `${getCurrencySymbol() + getResourceDataObject('space', ['upgrades', 'rocket4', 'price'])}, 
                    ${getResourceDataObject('space', ['upgrades', 'rocket4', 'resource1Price'])[0]} ${capitaliseString(getResourceDataObject('space', ['upgrades', 'rocket4', 'resource1Price'])[1])}, 
                    ${getResourceDataObject('space', ['upgrades', 'rocket4', 'resource2Price'])[0]} ${capitaliseString(getResourceDataObject('space', ['upgrades', 'rocket4', 'resource2Price'])[1])}, 
                    ${getResourceDataObject('space', ['upgrades', 'rocket4', 'resource3Price'])[0]} ${capitaliseString(getResourceDataObject('space', ['upgrades', 'rocket4', 'resource3Price'])[1])}`,
                    '',
                    'upgradeCheck',
                    'spaceUpgrade',
                    'rocket4',
                    'cash',
                    null,
                    false,
                    null,
                    null,
                    'spaceMiningPurchase'
                );
                optionContentElement.appendChild(rocket4BuildRow);           
    }

    if (heading === 'Rocket 1') {
        let autobuyer1Price = getResourceDataObject('space', ['upgrades', 'rocket1', 'autoBuyer', 'tier1', 'price']);

        const rocket1AutoBuyerRow = createOptionRow(
            'rocket1AutoBuyerRow',
            getResourceDataObject('space', ['upgrades', 'rocket1', 'autoBuyer', 'tier1', 'nameUpgrade']),
            'Fuel:',
            createButton(`Fuel Rocket`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'rocket1'], () => {
                setRocketsFuellerStartedArray('rocket1');
            }, 'upgradeCheck', '', 'autoBuyer', null, 'cash', true, 'tier1', 'rocketFuel'),
            // progress bar like battery for fuelling
            // button to launch rocket when fuelled
            null, //to replace with progress bar for fuelling
            null, //to replace with launch button
            null,
            null,
            `${getCurrencySymbol()}${autobuyer1Price}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'cash',
            'tier1',
            false,
            null,
            null,
            'rocketFuel'
        );
        optionContentElement.appendChild(rocket1AutoBuyerRow);
    }
    
    if (heading === 'Rocket 2') {
        const autobuyer1Price = getResourceDataObject('space', ['upgrades', 'rocket2', 'autoBuyer', 'tier1', 'price']);
    
        const rocket2AutoBuyerRow = createOptionRow(
            'rocket2AutoBuyerRow',
            getResourceDataObject('space', ['upgrades', 'rocket2', 'autoBuyer', 'tier1', 'nameUpgrade']),
            'Fuel:',
            createButton(`Fuel Rocket`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'rocket2'], () => {
                setRocketsFuellerStartedArray('rocket2');
            }, 'upgradeCheck', '', 'autoBuyer', null, 'cash', true, 'tier1', 'rocketFuel'),
            // progress bar like battery for fuelling
            // button to launch rocket when fuelled
            null, //to replace with progress bar for fuelling
            null, //to replace with launch button
            null,
            null,
            `${getCurrencySymbol()}${autobuyer1Price}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'cash',
            'tier1',
            false,
            null,
            null,
            'rocketFuel'
        );
        optionContentElement.appendChild(rocket2AutoBuyerRow);
    }
    
    if (heading === 'Rocket 3') {
        const autobuyer1Price = getResourceDataObject('space', ['upgrades', 'rocket3', 'autoBuyer', 'tier1', 'price']);
    
        const rocket3AutoBuyerRow = createOptionRow(
            'rocket3AutoBuyerRow',
            getResourceDataObject('space', ['upgrades', 'rocket3', 'autoBuyer', 'tier1', 'nameUpgrade']),
            'Fuel:',
            createButton(`Fuel Rocket`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'rocket3'], () => {
                setRocketsFuellerStartedArray('rocket3');
            }, 'upgradeCheck', '', 'autoBuyer', null, 'cash', true, 'tier1', 'rocketFuel'),
            // progress bar like battery for fuelling
            // button to launch rocket when fuelled
            null, //to replace with progress bar for fuelling
            null, //to replace with launch button
            null,
            null,
            `${getCurrencySymbol()}${autobuyer1Price}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'cash',
            'tier1',
            false,
            null,
            null,
            'rocketFuel'
        );
        optionContentElement.appendChild(rocket3AutoBuyerRow);
    }
    
    if (heading === 'Rocket 4') {
        const autobuyer1Price = getResourceDataObject('space', ['upgrades', 'rocket4', 'autoBuyer', 'tier1', 'price']);
    
        const rocket4AutoBuyerRow = createOptionRow(
            'rocket4AutoBuyerRow',
            getResourceDataObject('space', ['upgrades', 'rocket4', 'autoBuyer', 'tier1', 'nameUpgrade']),
            'Fuel:',
            createButton(`Fuel Rocket`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'rocket4'], () => {
                setRocketsFuellerStartedArray('rocket4');
            }, 'upgradeCheck', '', 'autoBuyer', null, 'cash', true, 'tier1', 'rocketFuel'),
            // progress bar like battery for fuelling
            // button to launch rocket when fuelled
            null, //to replace with progress bar for fuelling
            null, //to replace with launch button
            null,
            null,
            `${getCurrencySymbol()}${autobuyer1Price}`,
            '',
            'upgradeCheck',
            'autoBuyer',
            null,
            'cash',
            'tier1',
            false,
            null,
            null,
            'rocketFuel'
        );
        optionContentElement.appendChild(rocket4AutoBuyerRow);
    }    
}
