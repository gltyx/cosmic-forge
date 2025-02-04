import { getDestinationAsteroid, deferredActions, getSortAsteroidMethod, getAsteroidArray, getImageUrls, setCheckRocketFuellingStatus , getTimerRateRatio, getCurrencySymbol, getBuildingTypeOnOff, setPowerOnOff, setRocketsFuellerStartedArray, getLaunchedRockets, getRocketsFuellerStartedArray, getCurrentlySearchingAsteroid, getTimeLeftUntilAsteroidScannerTimerFinishes, setDestinationAsteroid } from './constantsAndGlobalVars.js';
import { timerManager, startTravelToAsteroidTimer, startSearchAsteroidTimer, launchRocket, toggleBuildingTypeOnOff, addOrRemoveUsedPerSecForFuelRate, setEnergyCapacity, gain, startUpdateTimersAndRates, addBuildingPotentialRate, buildSpaceMiningBuilding } from './game.js';
import { getRocketPartsNeededInTotalPerRocket, getRocketParts, setResourceDataObject, getResourceDataObject } from './resourceDataObject.js';
import { createSvgElement, createDropdown, handleSortAsteroidClick, sortAsteroidTable, switchFuelGaugeWhenFuellerBought, createTextElement, createOptionRow, createButton, showNotification } from './ui.js';
import { capitaliseString } from './utilityFunctions.js';

export function drawTab6Content(heading, optionContentElement) {
    const asteroids = getAsteroidArray();
    if (heading === 'Space Telescope') {
        const spaceBuildTelescopeRow = createOptionRow(
                    'spaceBuildTelescopeRow',
                    null,
                    'Space Telescope:',
                    createButton(`Build Space Telescope`, ['option-button', 'red-disabled-text', 'building-purchase-button', 'resource-cost-sell-check', 'spaceTelescope'], () => {
                        buildSpaceMiningBuilding('spaceTelescope');
                        document.getElementById('spaceTelescopeSearchAsteroidRow').classList.remove('invisible');
                        spaceBuildTelescopeRow.classList.add('invisible');
                        showNotification('Space Telescope Built!', 'info');
                    }, 'upgradeCheck', '', 'spaceUpgrade', 'spaceTelescope', 'cash', true, null, 'spaceMiningPurchase'),
                    createTextElement('Bought', 'spaceTelescopeAlreadyBoughtText', ['green-ready-text', 'invisible']),
                    null,
                    null,
                    null,
                    `${getCurrencySymbol() + getResourceDataObject('space', ['upgrades', 'spaceTelescope', 'price'])}, 
                    ${getResourceDataObject('space', ['upgrades', 'spaceTelescope', 'resource1Price'])[0]} ${capitaliseString(getResourceDataObject('space', ['upgrades', 'spaceTelescope', 'resource1Price'])[1])}, 
                    ${getResourceDataObject('space', ['upgrades', 'spaceTelescope', 'resource2Price'])[0]} ${capitaliseString(getResourceDataObject('space', ['upgrades', 'spaceTelescope', 'resource2Price'])[1])}, 
                    ${getResourceDataObject('space', ['upgrades', 'spaceTelescope', 'resource3Price'])[0]} ${capitaliseString(getResourceDataObject('space', ['upgrades', 'spaceTelescope', 'resource3Price'])[1])}`,
                    '',
                    'upgradeCheck',
                    'spaceUpgrade',
                    'spaceTelescope',
                    'cash',
                    null,
                    false,
                    null,
                    null,
                    'spaceMiningPurchase'
                );
                optionContentElement.appendChild(spaceBuildTelescopeRow);

        const spaceTelescopeSearchAsteroidRow = createOptionRow(
                    'spaceTelescopeSearchAsteroidRow',
                    'Scan Asteroids',
                    'Scan Asteroids',
                    createButton(`Scan Asteroids`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                        startSearchAsteroidTimer([0, 'buttonClick']);
                    }, 'upgradeCheck', '', 'autoBuyer', 'searchAsteroid', 'time', true, null, 'spaceMiningPurchase'),
                    createTextElement(
                        `<div id="spaceTelescopeSearchProgressBar">`,
                        'spaceTelescopeSearchProgressBarContainer',
                        ['progress-bar-container', 'invisible']
                    ),                     
                    null,
                    null,
                    null,
                    `Ready To Search`,
                    '',
                    'upgradeCheck',
                    'autoBuyer',
                    'searchAsteroid',
                    'time',
                    null,
                    false,
                    null,
                    null,
                    null
                );
                optionContentElement.appendChild(spaceTelescopeSearchAsteroidRow);

                if (getResourceDataObject('space', ['upgrades', 'spaceTelescope', 'spaceTelescopeBoughtYet'])) {
                    spaceBuildTelescopeRow.classList.add('invisible');
                    timerManager.removeTimer('searchAsteroidTimer');
                    if (getCurrentlySearchingAsteroid()) {
                        deferredActions.push(() => {
                            const timeRemaining = getTimeLeftUntilAsteroidScannerTimerFinishes();
                            startSearchAsteroidTimer([timeRemaining, 'reEnterSpaceTelescopeScreen']);
                        });
                    }
                }
    }

    if (heading === 'Launch Pad') {
        const spaceBuildLaunchPadRow = createOptionRow(
                    'spaceBuildLaunchPadRow',
                    null,
                    'Launch Pad:',
                    createButton(`Build Launch Pad`, ['option-button', 'red-disabled-text', 'building-purchase-button', 'resource-cost-sell-check', 'launchPad'], () => {
                        buildSpaceMiningBuilding('launchPad');
                        document.getElementById('spaceRocket1BuildRow').classList.remove('invisible');
                        document.getElementById('spaceRocket2BuildRow').classList.remove('invisible');
                        document.getElementById('spaceRocket3BuildRow').classList.remove('invisible');
                        document.getElementById('spaceRocket4BuildRow').classList.remove('invisible');
                        spaceBuildLaunchPadRow.classList.add('invisible');
                        showNotification('Launch Pad Built!', 'info');
                    }, 'upgradeCheck', '', 'spaceUpgrade', 'launchPad', 'cash', true, null, 'spaceMiningPurchase'),
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

                if (getResourceDataObject('space', ['upgrades', 'launchPad', 'launchPadBoughtYet'])) {
                    spaceBuildLaunchPadRow.classList.add('invisible');
                }

        const spaceRocket1BuildRow = createOptionRow(
                    'spaceRocket1BuildRow',
                    null,
                    'Rocket Miner 1:',
                    createButton(`Build Rocket Part`, ['option-button', 'red-disabled-text', 'building-purchase-button', 'resource-cost-sell-check'], () => {
                        gain(1, 'rocket1BuiltPartsQuantity', 'rocket1', false, null, 'space', 'space')
                    }, 'upgradeCheck', '', 'spaceUpgrade', 'rocket1', 'cash', true, null, 'spaceMiningPurchase'),
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
                optionContentElement.appendChild(spaceRocket1BuildRow);
        
                const spaceRocket2BuildRow = createOptionRow(
                    'spaceRocket2BuildRow',
                    null,
                    'Rocket Miner 2:',
                    createButton(`Build Rocket Part`, ['option-button', 'red-disabled-text', 'building-purchase-button', 'resource-cost-sell-check'], () => {
                        gain(1, 'rocket2BuiltPartsQuantity', 'rocket2', false, null, 'space', 'space')
                    }, 'upgradeCheck', '', 'spaceUpgrade', 'rocket2', 'cash', true, null, 'spaceMiningPurchase'),
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
                optionContentElement.appendChild(spaceRocket2BuildRow);

        const spaceRocket3BuildRow = createOptionRow(
                    'spaceRocket3BuildRow',
                    null,
                    'Rocket Miner 3:',
                    createButton(`Build Rocket Part`, ['option-button', 'red-disabled-text', 'building-purchase-button', 'resource-cost-sell-check'], () => {
                        gain(1, 'rocket3BuiltPartsQuantity', 'rocket3', false, null, 'space', 'space')
                    }, 'upgradeCheck', '', 'spaceUpgrade', 'rocket3', 'cash', true, null, 'spaceMiningPurchase'),
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
                optionContentElement.appendChild(spaceRocket3BuildRow);

        const spaceRocket4BuildRow = createOptionRow(
                    'spaceRocket4BuildRow',
                    null,
                    'Rocket Miner 4:',
                    createButton(`Build Rocket Part`, ['option-button', 'red-disabled-text', 'building-purchase-button', 'resource-cost-sell-check'], () => {
                        gain(1, 'rocket4BuiltPartsQuantity', 'rocket4', false, null, 'space', 'space')
                    }, 'upgradeCheck', '', 'spaceUpgrade', 'rocket4', 'cash', true, null, 'spaceMiningPurchase'),
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
                optionContentElement.appendChild(spaceRocket4BuildRow);           
    }

    if (heading === 'Rocket 1') {
        let autobuyer1Price = getResourceDataObject('space', ['upgrades', 'rocket1', 'autoBuyer', 'tier1', 'price']);
        setCheckRocketFuellingStatus('rocket1', true);
        const fuellingState = getRocketsFuellerStartedArray().includes('rocket1');
        const fuelledUpState = getRocketsFuellerStartedArray().includes('rocket1FuelledUp');
        const launchedState = getLaunchedRockets().includes('rocket1');

        const spaceRocket1AutoBuyerRow = createOptionRow(
            'spaceRocket1AutoBuyerRow',
            getResourceDataObject('space', ['upgrades', 'rocket1', 'autoBuyer', 'tier1', 'nameUpgrade']),
            'Fuel:',
            createButton(`Fuel Rocket`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'rocket1'], () => {
                setRocketsFuellerStartedArray('rocket1', 'add');
                switchFuelGaugeWhenFuellerBought('rocket1');
            }, 'upgradeCheck', '', 'autoBuyer', null, 'cash', true, 'tier1', 'rocketFuel'),
            createTextElement(
                `<div id="rocket1FuellingProgressBar">`,
                'rocket1FuellingProgressBarContainer',
                ['progress-bar-container', 'invisible']
            ),
            createButton(`Power Off!`, ['option-button', 'red-disabled-text', 'rocket-fuelled-check', 'rocket1-launch-button', 'invisible'], () => {
                launchRocket('rocket1');
            }, 'upgradeCheck', '', null, null, null, true, null, null),
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
        optionContentElement.appendChild(spaceRocket1AutoBuyerRow);

        const spaceRocket1TravelRow = createOptionRow(
            `spaceRocket1TravelRow`,
            null,
            `Travel To:`,
            createTextElement(`${getDestinationAsteroid('rocket1')}`, 'rocket1DestinationAsteroid', ['green-ready-text', 'invisible', 'destination-text']),
            createDropdown('rocket1TravelDropdown', asteroids
                .map((asteroidObj) => {
                    return Object.keys(asteroidObj).map((key) => {
                        const asteroid = asteroidObj[key];
                        const rarityClass = getRarityClass(asteroid.rarity[0]);
                        const distanceClass = getDistanceClass(asteroid.distance[0]);
                        const quantityClass = getQuantityClass(asteroid.quantity[0]);
        
                        return {
                            value: asteroid.name,
                            text: `${asteroid.name}: Distance: <span class="dropDownDistanceValue ${distanceClass}">${asteroid.distance[0]}</span>, Rarity: <span class="dropDownRarityValue ${rarityClass}">${asteroid.rarity[0]}</span>, Antimatter: <span class="dropDownQuantityValue ${quantityClass}">${asteroid.quantity[0]}</span>`,
                            distance: asteroid.distance[0]
                        };
                    });
                })
                .flat()
                .sort((a, b) => a.distance - b.distance),
                '', (value) => {
                    setDestinationAsteroid('rocket1', value);
                    console.log('Selected asteroid name:', value);
                }, ['travel-to']),                                 
            createButton(`Travel`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'rocket1-travel-to-asteroid-button'], () => {
                startTravelToAsteroidTimer([0, 'buttonClick'], 'rocket1');
            }, 'upgradeCheck', '', 'autoBuyer', 'travelToAsteroid', 'time', true, null, 'spaceMiningPurchase'),
            createTextElement(
                `<div id="spaceTravelToAsteroidProgressBarRocket1">`,
                'spaceTravelToAsteroidProgressBarRocket1Container',
                ['progress-bar-container', 'invisible']
            ),        
            null,
            `Travelling...`,
            '',
            null,
            null,
            null,
            null,
            null,
            false,
            null,
            null,
            'travel'
        );
        optionContentElement.appendChild(spaceRocket1TravelRow);

        setFuellingVisibility('rocket1', [fuellingState, fuelledUpState, launchedState]);
    }
    
    if (heading === 'Rocket 2') {
        const autobuyer1Price = getResourceDataObject('space', ['upgrades', 'rocket2', 'autoBuyer', 'tier1', 'price']);
        setCheckRocketFuellingStatus('rocket2', true);
        const fuellingState = getRocketsFuellerStartedArray().includes('rocket2');
        const fuelledUpState = getRocketsFuellerStartedArray().includes('rocket2FuelledUp');
        const launchedState = getLaunchedRockets().includes('rocket2');

        const spaceRocket2AutoBuyerRow = createOptionRow(
            'spaceRocket2AutoBuyerRow',
            getResourceDataObject('space', ['upgrades', 'rocket2', 'autoBuyer', 'tier1', 'nameUpgrade']),
            'Fuel:',
            createButton(`Fuel Rocket`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'rocket2'], () => {
                setRocketsFuellerStartedArray('rocket2', 'add');
                switchFuelGaugeWhenFuellerBought('rocket2');
            }, 'upgradeCheck', '', 'autoBuyer', null, 'cash', true, 'tier1', 'rocketFuel'),
            createTextElement(
                `<div id="rocket2FuellingProgressBar">`,
                'rocket2FuellingProgressBarContainer',
                ['progress-bar-container', 'invisible']
            ),
            createButton(`Power Off!`, ['option-button', 'red-disabled-text', 'rocket-fuelled-check', 'rocket2-launch-button', 'invisible'], () => {
                launchRocket('rocket2');
            }, 'upgradeCheck', '', null, null, null, true, null, null),
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

        optionContentElement.appendChild(spaceRocket2AutoBuyerRow);

        const spaceRocket2TravelRow = createOptionRow(
            `spaceRocket2TravelRow`,
            null,
            `Travel To:`,
            createTextElement(`${getDestinationAsteroid('rocket2')}`, 'rocket2DestinationAsteroid', ['green-ready-text', 'invisible', 'destination-text']),
            createDropdown('rocket2TravelDropdown', asteroids
                .map((asteroidObj) => {
                    return Object.keys(asteroidObj).map((key) => {
                        const asteroid = asteroidObj[key];
                        const rarityClass = getRarityClass(asteroid.rarity[0]);
                        const distanceClass = getDistanceClass(asteroid.distance[0]);
                        const quantityClass = getQuantityClass(asteroid.quantity[0]);
        
                        return {
                            value: asteroid.name,
                            text: `${asteroid.name}: Distance: <span class="dropDownDistanceValue ${distanceClass}">${asteroid.distance[0]}</span>, Rarity: <span class="dropDownRarityValue ${rarityClass}">${asteroid.rarity[0]}</span>, Antimatter: <span class="dropDownQuantityValue ${quantityClass}">${asteroid.quantity[0]}</span>`,
                            distance: asteroid.distance[0]
                        };
                    });
                })
                .flat()
                .sort((a, b) => a.distance - b.distance),
                '', (value) => {
                    console.log('Selected asteroid name:', value);
                }, ['travel-to']),                                 
            createButton(`Travel`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'rocket2-travel-to-asteroid-button'], () => {
                startTravelToAsteroidTimer([0, 'buttonClick'], 'rocket2');
            }, 'upgradeCheck', '', 'autoBuyer', 'travelToAsteroid', 'time', true, null, 'spaceMiningPurchase'),
            createTextElement(
                `<div id="spaceTravelToAsteroidProgressBarRocket2">`,
                'spaceTravelToAsteroidProgressBarRocket2Container',
                ['progress-bar-container', 'invisible']
            ),          
            null,
            `Travelling...`,
            '',
            null,
            null,
            null,
            null,
            null,
            false,
            null,
            null,
            'travel'
        );
        optionContentElement.appendChild(spaceRocket2TravelRow);

        setFuellingVisibility('rocket2', [fuellingState, fuelledUpState, launchedState]);
    }
    
    if (heading === 'Rocket 3') {
        const autobuyer1Price = getResourceDataObject('space', ['upgrades', 'rocket3', 'autoBuyer', 'tier1', 'price']);
        setCheckRocketFuellingStatus('rocket3', true);
        const fuellingState = getRocketsFuellerStartedArray().includes('rocket3');
        const fuelledUpState = getRocketsFuellerStartedArray().includes('rocket3FuelledUp');
        const launchedState = getLaunchedRockets().includes('rocket3');

        const spaceRocket3AutoBuyerRow = createOptionRow(
            'spaceRocket3AutoBuyerRow',
            getResourceDataObject('space', ['upgrades', 'rocket3', 'autoBuyer', 'tier1', 'nameUpgrade']),
            'Fuel:',
            createButton(`Fuel Rocket`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'rocket3'], () => {
                setRocketsFuellerStartedArray('rocket3', 'add');
                switchFuelGaugeWhenFuellerBought('rocket3');
            }, 'upgradeCheck', '', 'autoBuyer', null, 'cash', true, 'tier1', 'rocketFuel'),
            createTextElement(
                `<div id="rocket3FuellingProgressBar">`,
                'rocket3FuellingProgressBarContainer',
                ['progress-bar-container', 'invisible']
            ),
            createButton(`Power Off!`, ['option-button', 'red-disabled-text', 'rocket-fuelled-check', 'rocket3-launch-button', 'invisible'], () => {
                launchRocket('rocket3');
            }, 'upgradeCheck', '', null, null, null, true, null, null),
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

        optionContentElement.appendChild(spaceRocket3AutoBuyerRow);

        const spaceRocket3TravelRow = createOptionRow(
            `spaceRocket3TravelRow`,
            null,
            `Travel To:`,
            createTextElement(`${getDestinationAsteroid('rocket3')}`, 'rocket3DestinationAsteroid', ['green-ready-text', 'invisible', 'destination-text']),
            createDropdown('rocket3TravelDropdown', asteroids
                .map((asteroidObj) => {
                    return Object.keys(asteroidObj).map((key) => {
                        const asteroid = asteroidObj[key];
                        const rarityClass = getRarityClass(asteroid.rarity[0]);
                        const distanceClass = getDistanceClass(asteroid.distance[0]);
                        const quantityClass = getQuantityClass(asteroid.quantity[0]);
        
                        return {
                            value: asteroid.name,
                            text: `${asteroid.name}: Distance: <span class="dropDownDistanceValue ${distanceClass}">${asteroid.distance[0]}</span>, Rarity: <span class="dropDownRarityValue ${rarityClass}">${asteroid.rarity[0]}</span>, Antimatter: <span class="dropDownQuantityValue ${quantityClass}">${asteroid.quantity[0]}</span>`,
                            distance: asteroid.distance[0]
                        };
                    });
                })
                .flat()
                .sort((a, b) => a.distance - b.distance),
                '', (value) => {
                    console.log('Selected asteroid name:', value);
                }, ['travel-to']),                                 
            createButton(`Travel`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'rocket3-travel-to-asteroid-button'], () => {
                startTravelToAsteroidTimer([0, 'buttonClick'], 'rocket3');
            }, 'upgradeCheck', '', 'autoBuyer', 'travelToAsteroid', 'time', true, null, 'spaceMiningPurchase'),
            createTextElement(
                `<div id="spaceTravelToAsteroidProgressBarRocket3">`,
                'spaceTravelToAsteroidProgressBarRocket3Container',
                ['progress-bar-container', 'invisible']
            ),           
            null,
            `Travelling...`,
            '',
            null,
            null,
            null,
            null,
            null,
            false,
            null,
            null,
            'travel'
        );
        optionContentElement.appendChild(spaceRocket3TravelRow);

        setFuellingVisibility('rocket3', [fuellingState, fuelledUpState, launchedState]);
    }
    
    if (heading === 'Rocket 4') {
        const autobuyer1Price = getResourceDataObject('space', ['upgrades', 'rocket4', 'autoBuyer', 'tier1', 'price']);
        setCheckRocketFuellingStatus('rocket4', true);
        const fuellingState = getRocketsFuellerStartedArray().includes('rocket4');
        const fuelledUpState = getRocketsFuellerStartedArray().includes('rocket4FuelledUp');
        const launchedState = getLaunchedRockets().includes('rocket4');

        const spaceRocket4AutoBuyerRow = createOptionRow(
            'spaceRocket4AutoBuyerRow',
            getResourceDataObject('space', ['upgrades', 'rocket4', 'autoBuyer', 'tier1', 'nameUpgrade']),
            'Fuel:',
            createButton(`Fuel Rocket`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'rocket4'], () => {
                setRocketsFuellerStartedArray('rocket4', 'add');
                switchFuelGaugeWhenFuellerBought('rocket4');
            }, 'upgradeCheck', '', 'autoBuyer', null, 'cash', true, 'tier1', 'rocketFuel'),
            createTextElement(
                `<div id="rocket1FuellingProgressBar">`,
                'rocket4FuellingProgressBarContainer',
                ['progress-bar-container', 'invisible']
            ),
            createButton(`Power Off!`, ['option-button', 'red-disabled-text', 'rocket-fuelled-check', 'rocket4-launch-button', 'invisible'], () => {
                launchRocket('rocket4');
            }, 'upgradeCheck', '', null, null, null, true, null, null),
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

        optionContentElement.appendChild(spaceRocket4AutoBuyerRow);

        const spaceRocket4TravelRow = createOptionRow(
            `spaceRocket4TravelRow`,
            null,
            `Travel To:`,
            createTextElement(`${getDestinationAsteroid('rocket4')}`, 'rocket4DestinationAsteroid', ['green-ready-text', 'invisible', 'destination-text']),
            createDropdown('rocket4TravelDropdown', asteroids
                .map((asteroidObj) => {
                    return Object.keys(asteroidObj).map((key) => {
                        const asteroid = asteroidObj[key];
                        const rarityClass = getRarityClass(asteroid.rarity[0]);
                        const distanceClass = getDistanceClass(asteroid.distance[0]);
                        const quantityClass = getQuantityClass(asteroid.quantity[0]);
        
                        return {
                            value: asteroid.name,
                            text: `${asteroid.name}: Distance: <span class="dropDownDistanceValue ${distanceClass}">${asteroid.distance[0]}</span>, Rarity: <span class="dropDownRarityValue ${rarityClass}">${asteroid.rarity[0]}</span>, Antimatter: <span class="dropDownQuantityValue ${quantityClass}">${asteroid.quantity[0]}</span>`,
                            distance: asteroid.distance[0]
                        };
                    });
                })
                .flat()
                .sort((a, b) => a.distance - b.distance),
                '', (value) => {
                    console.log('Selected asteroid name:', value);
                }, ['travel-to']),                                 
            createButton(`Travel`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'rocket4-travel-to-asteroid-button'], () => {
                startTravelToAsteroidTimer([0, 'buttonClick'], 'rocket4');
            }, 'upgradeCheck', '', 'autoBuyer', 'travelToAsteroid', 'time', true, null, 'spaceMiningPurchase'),
            createTextElement(
                `<div id="spaceTravelToAsteroidProgressBarRocket4">`,
                'spaceTravelToAsteroidProgressBarRocket4Container',
                ['progress-bar-container', 'invisible']
            ),          
            null,
            `Travelling...`,
            '',
            null,
            null,
            null,
            null,
            null,
            false,
            null,
            null,
            'travel'
        );
        optionContentElement.appendChild(spaceRocket4TravelRow);

        setFuellingVisibility('rocket4', [fuellingState, fuelledUpState, launchedState]);
    }
    
    if (heading === 'Asteroids') {
        let asteroidsArray = getAsteroidArray();
    
        if (asteroidsArray.length === 0) {
            return;
        }

        const asteroidLegendRow = createOptionRow(
            `asteroidLegendRow`,
            null,
            `Sort By:`,
            createTextElement(
                `Rarity`,
                'asteroidLegendRarity',
                ['sort-by', 'label-asteroid'],
                (event) => handleSortAsteroidClick('rarity')
            ),
            createTextElement(
                `Distance`,
                'asteroidLegendDistance',
                ['no-sort', 'label-asteroid'],
                (event) => handleSortAsteroidClick('distance')
            ),
            createTextElement(
                `Complexity`,
                'asteroidLegendEOE',
                ['no-sort', 'label-asteroid'],
                (event) => handleSortAsteroidClick('eoe')
            ),
            createTextElement(
                `Antimatter`,
                'asteroidLegendQuantity',
                ['no-sort', 'label-asteroid'],
                (event) => handleSortAsteroidClick('quantity')
            ),            
            null,
            ``,
            '',
            null,
            null,
            null,
            null,
            null,
            false,
            null,
            null,
            'asteroid',
            [true, '25%', '75%']
        );
        optionContentElement.appendChild(asteroidLegendRow);

        asteroidsArray = sortAsteroidTable(asteroidsArray, getSortAsteroidMethod());

        asteroidsArray.forEach((asteroid) => {
            const asteroidName = Object.keys(asteroid)[0];

            const { name, distance, easeOfExtraction, quantity, rarity } = asteroid[asteroidName];
            const asteroidRowName = `asteroidRow_${name}`;
    
            const asteroidRow = createOptionRow(
                `${asteroidRowName}`,
                null,
                `${name}:`,
                createTextElement(
                    `${rarity[0]}`,
                    'asteroidInfoContainerRarity',
                    ['value-asteroid', 'rarity-asteroid', rarity[1]]
                ),
                createTextElement(
                    `${distance[0]}`,
                    'asteroidInfoContainerDistance',
                    ['value-asteroid', 'distance-asteroid', distance[1]]
                ),
                createTextElement(
                    `${easeOfExtraction[0]}`,
                    'asteroidInfoContainerEOE',
                    ['value-asteroid', 'eoe-asteroid', easeOfExtraction[1]]
                ),
                createTextElement(
                    `${quantity[0]}`,
                    'asteroidInfoContainerQuantity',
                    ['value-asteroid', 'quantity-asteroid', quantity[1]]
                ),                             
                null,
                ``,
                '',
                null,
                null,
                null,
                null,
                null,
                false,
                null,
                null,
                'asteroid',
                [true, '25%', '75%']
            );
            optionContentElement.appendChild(asteroidRow);
        });
    } 
    
    if (heading === 'Antimatter') {
            const antimatterSvgRow = createOptionRow(
                'techTreeSvgRow',
                null,
                '',
                createSvgElement('antimatterSvg', '100%', '700px', ['antimatter-svg']),
                null,
                null,
                null,
                null,
                '',
                '',
                'antimatterRender',
                '',
                '',
                '',
                null,
                false,
                null,
                null,
                'antimatter',
                [true, 'invisible', '100%']
            );
        
            optionContentElement.appendChild(antimatterSvgRow);    
        }  
}

function setFuellingVisibility(rocket, params) {
    const [fuellingState, fuelledUpState, launchedState] = params;
    if (fuellingState || fuelledUpState) {
        const fuelUpButton = document.querySelector(`.${rocket}`);
        fuelUpButton.classList.add('invisible');
        document.getElementById(`${rocket}FuellingProgressBarContainer`).classList.remove('invisible');
        const launchButton = document.querySelector(`.${rocket}-launch-button`);
        launchButton.classList.remove('invisible');
        launchButton.textContent = 'Launch!';
        document.getElementById('fuelDescription').textContent = 'Fuelling...'
        document.getElementById('fuelDescription').classList.remove('red-disabled-text');
    }
    if (fuelledUpState) {
        document.getElementById(`${rocket}FuellingProgressBar`).style.width = '100%';
        const launchButton = document.querySelector(`.${rocket}-launch-button`);
        launchButton.classList.add('green-ready-text');
        launchButton.classList.remove('red-disabled-text');
        launchButton.textContent = 'Launch!';
        document.getElementById('fuelDescription').textContent = 'Ready For Launch...'
        document.getElementById('fuelDescription').classList.add('green-ready-text');
    }
    if (launchedState) {
        spaceRocket1AutoBuyerRow.classList.add('invisible');
    }
}

function getRarityClass(rarity) {
    if (rarity === 'Common') {
        return 'red-disabled-text';
    } else if (rarity === 'Uncommon') {
        return 'warning-orange-text';
    } else if (rarity === 'Legendary') {
        return 'green-ready-text';
    }
    return '';
}

function getDistanceClass(distance) {
    if (distance < 100000) {
        return 'green-ready-text';
    } else if (distance < 200000) {
        return '';
    } else if (distance < 300000) {
        return 'warning-orange-text';
    } else {
        return 'red-disabled-text';
    }
}

function getQuantityClass(quantity) {
    if (quantity <= 300) {
        return 'red-disabled-text';
    } else if (quantity <= 600) {
        return 'warning-orange-text';
    } else if (quantity <= 750) {
        return '';
    } else {
        return 'green-ready-text';
    }
}

