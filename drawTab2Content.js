import { getTimerRateRatio, getCurrencySymbol, getBuildingTypeOnOff, setPowerOnOff } from './constantsAndGlobalVars.js';
import { toggleBuildingTypeOnOff, addOrRemoveUsedPerSecForFuelRate, setEnergyCapacity, gain, startUpdateTimersAndRates, addBuildingPotentialRate } from './game.js';
import { setResourceDataObject, getResourceDataObject } from './resourceDataObject.js';
import { createTextElement, createOptionRow, createButton } from './ui.js';
import { capitaliseString } from './utilityFunctions.js';

export function drawTab2Content(heading, optionContentElement) {
    let toggleButtonText;
    if (heading === 'Energy') {

        const battery1Row = createOptionRow(
            'energyBattery1Row',
            null,
            'Sodium Ion Battery:',
            createButton(`Add ${getResourceDataObject('buildings', ['energy', 'upgrades', 'battery1', 'capacity'])} kwH`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'battery1Quantity', 'battery1', false, null, 'energy', 'resources'),
                setResourceDataObject(true, 'buildings', ['energy', 'batteryBoughtYet']),
                setEnergyCapacity('battery1');
            }, 'upgradeCheck', '', 'energy', 'battery1', 'cash', false, null, 'building'),
            null,
            null,
            null,
            null,
            `${getCurrencySymbol() + getResourceDataObject('buildings', ['energy', 'upgrades', 'battery1', 'price'])}`,
            '',
            'upgradeCheck',
            'energy',
            'battery1',
            'cash',
            null,
            ['tech', 'sodiumIonPowerStorage'],
            null,
            null,
            'building'
        );
        optionContentElement.appendChild(battery1Row);

        const battery2Row = createOptionRow(
            'energyBattery2Row',
            null,
            'Battery 2:',
            createButton(`Add ${getResourceDataObject('buildings', ['energy', 'upgrades', 'battery2', 'capacity'])} kwH`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'battery2Quantity', 'battery2', false, null, 'energy', 'resources'),
                setResourceDataObject(true, 'buildings', ['energy', 'batteryBoughtYet']),
                setEnergyCapacity('battery2');
            }, 'upgradeCheck', '', 'energy', 'battery2', 'cash', false, null, 'building'),
            null,
            null,
            null,
            null,
            `${getCurrencySymbol() + getResourceDataObject('buildings', ['energy', 'upgrades', 'battery2', 'price'])}`,
            '',
            'upgradeCheck',
            'energy',
            'battery2',
            'cash',
            null,
            ['tech', 'sodiumIonPowerStorage'],
            null,
            null,
            'building'
        );
        optionContentElement.appendChild(battery2Row);

        const battery3Row = createOptionRow(
            'energyBattery3Row',
            null,
            'Battery 3:',
            createButton(`Add ${getResourceDataObject('buildings', ['energy', 'upgrades', 'battery3', 'capacity'])} kwH`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'battery3Quantity', 'battery3', false, null, 'energy', 'resources'),
                setResourceDataObject(true, 'buildings', ['energy', 'batteryBoughtYet']),
                setEnergyCapacity('battery3');
            }, 'upgradeCheck', '', 'energy', 'battery3', 'cash', false, null, 'building'),
            null,
            null,
            null,
            null,
            `${getCurrencySymbol() + getResourceDataObject('buildings', ['energy', 'upgrades', 'battery3', 'price'])}`,
            '',
            'upgradeCheck',
            'energy',
            'battery3',
            'cash',
            null,
            ['tech', 'sodiumIonPowerStorage'],
            null,
            null,
            'building'
        );
        optionContentElement.appendChild(battery3Row);
    }
    if (heading === 'Power Plant') {
        const activeStatus = getBuildingTypeOnOff('powerPlant1');
        if (activeStatus) {
            toggleButtonText = 'Deactivate';
        } else {
            toggleButtonText = 'Activate';
        }

        const powerPlant1Row = createOptionRow(
            'energyPowerPlant1Row',
            null,
            'Power Plant:',
            createButton(`Add ${getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant1', 'rate']) * getTimerRateRatio()} kw /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'powerPlant1Quantity', 'powerPlant1', false, null, 'energy', 'resources')
                addBuildingPotentialRate('powerPlant1');
                if (getBuildingTypeOnOff('powerPlant1')) {
                    startUpdateTimersAndRates('powerPlant1', 'buy');
                }
            }, 'upgradeCheck', '', 'energy', 'powerPlant1', 'cash', false, null, 'building'),
            createButton(toggleButtonText, ['option-button', 'toggle-timer', 'fuel-check', 'invisible', 'id_powerPlant1Toggle'], (event) => {
                const activeState = addOrRemoveUsedPerSecForFuelRate('carbon', event.target, 'resources', null, false, false);
                toggleBuildingTypeOnOff('powerPlant1', activeState);
                startUpdateTimersAndRates('powerPlant1', 'toggle');
                setPowerOnOff(true);
            }, 'toggle', null, null, 'powerPlant1', null, false, null, 'building'),
            createTextElement(`${capitaliseString(getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant1', 'fuel'])[0])}:`, 'powerPlant1FuelType', ['red-disabled-text', 'fuel-type', 'invisible']),
            createTextElement(`${getResourceDataObject(getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant1', 'fuel'])[2], [getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant1', 'fuel'])[0], 'quantity'])}`, 'powerPlant1FuelQuantity', ['red-disabled-text', 'fuel-quantity', 'invisible']),
            null,
            `${getCurrencySymbol() + getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant1', 'price'])}`,
            '',
            'upgradeCheck',
            'energy',
            'powerPlant1',
            'cash',
            null,
            false,
            null,
            null,
            'building'
        );
        optionContentElement.appendChild(powerPlant1Row);
    }

    else if (heading === 'Solar Power Plant') {
        const activeStatus = getBuildingTypeOnOff('powerPlant2');
        if (activeStatus) {
            toggleButtonText = 'Deactivate';
        } else {
            toggleButtonText = 'Activate';
        }

        const powerPlant2Row = createOptionRow(
            'energyPowerPlant2Row',
            null,
            'Solar Power Plant:',
            createButton(`Add ${getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant2', 'rate']) * getTimerRateRatio()} kw /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'powerPlant2Quantity', 'powerPlant2', false, null, 'energy', 'resources')
                addBuildingPotentialRate('powerPlant2');
                if (getBuildingTypeOnOff('powerPlant2')) {
                    startUpdateTimersAndRates('powerPlant2', 'buy');
                }
            }, 'upgradeCheck', '', 'energy', 'powerPlant2', 'cash', false, null, 'building'),
            createButton(toggleButtonText, ['option-button', 'toggle-timer', 'fuel-check', 'invisible', 'id_powerPlant2Toggle'], (event) => {
                const activeState = addOrRemoveUsedPerSecForFuelRate('hydrogen', event.target, 'resources', null, false, false);
                toggleBuildingTypeOnOff('powerPlant2', activeState);
                startUpdateTimersAndRates('powerPlant2', 'toggle');
                setPowerOnOff(true);
            }, 'toggle', null, null, 'powerPlant2', null, false, null, 'building'),
            null,
            null,
            null,
            `${getCurrencySymbol() + getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant2', 'price'])}`,
            '',
            'upgradeCheck',
            'energy',
            'powerPlant2',
            'cash',
            null,
            false,
            null,
            null,
            'building'
        );
        optionContentElement.appendChild(powerPlant2Row);
    }

    else if (heading === 'Advanced Power Plant') {
        const activeStatus = getBuildingTypeOnOff('powerPlant3');
        if (activeStatus) {
            toggleButtonText = 'Deactivate';
        } else {
            toggleButtonText = 'Activate';
        }

        const powerPlant3Row = createOptionRow(
            'energyPowerPlant3Row',
            null,
            'Advanced Power Plant:',
            createButton(`Add ${getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant3', 'rate']) * getTimerRateRatio()} kw /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'powerPlant3Quantity', 'powerPlant3', false, null, 'energy', 'resources')
                addBuildingPotentialRate('powerPlant3');
                if (getBuildingTypeOnOff('powerPlant3')) {
                    startUpdateTimersAndRates('powerPlant3', 'buy');
                }
            }, 'upgradeCheck', '', 'energy', 'powerPlant3', 'cash', false, null, 'building'),
            createButton(toggleButtonText, ['option-button', 'toggle-timer', 'fuel-check', 'invisible', 'id_powerPlant3Toggle'], (event) => {
                const activeState = addOrRemoveUsedPerSecForFuelRate('diesel', event.target, 'resources', null, false, false);
                toggleBuildingTypeOnOff('powerPlant3', activeState);
                startUpdateTimersAndRates('powerPlant3', 'toggle');
                setPowerOnOff(true);
            }, 'toggle', null, null, 'powerPlant3', null, false, null, 'building'),
            null,
            null,
            null,
            `${getCurrencySymbol() + getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant3', 'price'])}`,
            '',
            'upgradeCheck',
            'energy',
            'powerPlant3',
            'cash',
            null,
            false,
            null,
            null,
            'building'
        );
        optionContentElement.appendChild(powerPlant3Row);
    }
}
