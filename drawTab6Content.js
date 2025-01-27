import { getTimerRateRatio, getCurrencySymbol, getBuildingTypeOnOff, setPowerOnOff } from './constantsAndGlobalVars.js';
import { toggleBuildingTypeOnOff, addOrRemoveUsedPerSecForFuelRate, setEnergyCapacity, gain, startUpdateTimersAndRates, addBuildingPotentialRate, buildLaunchPad } from './game.js';
import { getRocketPartsNeededInTotalPerRocket, getRocketParts, setResourceDataObject, getResourceDataObject } from './resourceDataObject.js';
import { createTextElement, createOptionRow, createButton } from './ui.js';
import { capitaliseString } from './utilityFunctions.js';

export function drawTab6Content(heading, optionContentElement) {
    if (heading === 'Space Mining') {
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
                        addRocketPart('rocket1');
                    }, 'upgradeCheck', '', 'spaceUpgrade', 'rocket1', 'cash', false, null, 'spaceMiningPurchase'),
                    createTextElement(`Built: ${getRocketParts('rocket1')} / ${getRocketPartsNeededInTotalPerRocket('rocket1')}`, 'rocket1PartsCountText', []),
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
                        addRocketPart('rocket2');
                    }, 'upgradeCheck', '', 'spaceUpgrade', 'rocket2', 'cash', false, null, 'spaceMiningPurchase'),
                    createTextElement(`Built: ${getRocketParts('rocket2')} / ${getRocketPartsNeededInTotalPerRocket('rocket2')}`, 'rocket2PartsCountText', []),
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
                        addRocketPart('rocket3');
                    }, 'upgradeCheck', '', 'spaceUpgrade', 'rocket3', 'cash', false, null, 'spaceMiningPurchase'),
                    createTextElement(`Built: ${getRocketParts('rocket3')} / ${getRocketPartsNeededInTotalPerRocket('rocket3')}`, 'rocket3PartsCountText', []),
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
                        addRocketPart('rocket4');
                    }, 'upgradeCheck', '', 'spaceUpgrade', 'rocket4', 'cash', false, null, 'spaceMiningPurchase'),
                    createTextElement(`Built: ${getRocketParts('rocket4')} / ${getRocketPartsNeededInTotalPerRocket('rocket4')}`, 'rocket4PartsCountText', []),
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
}
