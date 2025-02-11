import { setRocketDirection, getRocketDirection, getDestinationAsteroid, deferredActions, getSortAsteroidMethod, getAsteroidArray, getImageUrls, setCheckRocketFuellingStatus , getTimerRateRatio, getCurrencySymbol, getBuildingTypeOnOff, setPowerOnOff, setRocketsFuellerStartedArray, getLaunchedRockets, getRocketsFuellerStartedArray, getCurrentlySearchingAsteroid, getTimeLeftUntilAsteroidScannerTimerFinishes, setDestinationAsteroid, getMiningObject, setAsteroidArray } from './constantsAndGlobalVars.js';
import { timerManager, startTravelToAndFromAsteroidTimer, startSearchAsteroidTimer, launchRocket, toggleBuildingTypeOnOff, addOrRemoveUsedPerSecForFuelRate, setEnergyCapacity, gain, startUpdateTimersAndRates, addBuildingPotentialRate, buildSpaceMiningBuilding } from './game.js';
import { getRocketPartsNeededInTotalPerRocket, getRocketParts, setResourceDataObject, getResourceDataObject } from './resourceDataObject.js';
import { createSvgElement, createDropdown, handleSortAsteroidClick, sortAsteroidTable, switchFuelGaugeWhenFuellerBought, createTextElement, createOptionRow, createButton, showNotification } from './ui.js';
import { capitaliseString } from './utilityFunctions.js';

export function drawTab6Content(heading, optionContentElement) {
    const asteroids = getAsteroidArray();
    const asteroidsBeingMinedOrExhausted = getMiningObject();
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

        const rockets = [
            { id: 'rocket1', label: 'Rocket Miner 1' },
            { id: 'rocket2', label: 'Rocket Miner 2' },
            { id: 'rocket3', label: 'Rocket Miner 3' },
            { id: 'rocket4', label: 'Rocket Miner 4' }
        ];

        rockets.forEach(rocket => {
            const rocketBuildRow = createOptionRow(
                `space${capitaliseString(rocket.id)}BuildRow`,
                null,
                `${rocket.label}:`,
                createButton(`Build Rocket Part`, ['option-button', 'red-disabled-text', 'building-purchase-button', 'resource-cost-sell-check'], () => {
                    gain(1, `${rocket.id}BuiltPartsQuantity`, rocket.id, false, null, 'space', 'space')
                }, 'upgradeCheck', '', 'spaceUpgrade', rocket.id, 'cash', true, null, 'spaceMiningPurchase'),
                createTextElement(
                    `Built: <span id="${rocket.id}BuiltPartsQuantity">${getRocketParts(rocket.id)}</span> / <span id="${rocket.id}TotalPartsQuantity">${getRocketPartsNeededInTotalPerRocket(rocket.id)}</span>`,
                    `${rocket.id}PartsCountText`,
                    []
                ),
                null,
                null,
                null,
                `${getCurrencySymbol() + getResourceDataObject('space', ['upgrades', rocket.id, 'price'])}, 
                ${getResourceDataObject('space', ['upgrades', rocket.id, 'resource1Price'])[0]} ${capitaliseString(getResourceDataObject('space', ['upgrades', rocket.id, 'resource1Price'])[1])}, 
                ${getResourceDataObject('space', ['upgrades', rocket.id, 'resource2Price'])[0]} ${capitaliseString(getResourceDataObject('space', ['upgrades', rocket.id, 'resource2Price'])[1])}, 
                ${getResourceDataObject('space', ['upgrades', rocket.id, 'resource3Price'])[0]} ${capitaliseString(getResourceDataObject('space', ['upgrades', rocket.id, 'resource3Price'])[1])}`,
                '',
                'upgradeCheck',
                'spaceUpgrade',
                rocket.id,
                'cash',
                null,
                false,
                null,
                null,
                'spaceMiningPurchase'
            );
            optionContentElement.appendChild(rocketBuildRow);
        });
    }

    if (heading === 'Rocket 1') createRocketUI('rocket1', optionContentElement, asteroids, asteroidsBeingMinedOrExhausted);
    if (heading === 'Rocket 2') createRocketUI('rocket2', optionContentElement, asteroids, asteroidsBeingMinedOrExhausted);
    if (heading === 'Rocket 3') createRocketUI('rocket3', optionContentElement, asteroids, asteroidsBeingMinedOrExhausted);
    if (heading === 'Rocket 4') createRocketUI('rocket4', optionContentElement, asteroids, asteroidsBeingMinedOrExhausted);
    
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

        const asteroidsBeingMined = getMiningObject();
        let flaggedAsteroids = asteroidsArray.map(obj => {
            const asteroidName = Object.keys(obj)[0];
            if (Object.values(asteroidsBeingMined).includes(asteroidName)) {
                obj[asteroidName].beingMined = true;
            } else {
                obj[asteroidName].beingMined = false;
            }
            return obj;
        });

        flaggedAsteroids = sortAsteroidTable(flaggedAsteroids, getSortAsteroidMethod());

        flaggedAsteroids.forEach((asteroid) => {
            const asteroidName = Object.keys(asteroid)[0];

            const { name, distance, easeOfExtraction, quantity, rarity } = asteroid[asteroidName];
            const asteroidRowName = `asteroidRow_${name}`;

            let rarityElementOverride;

            if (asteroid[asteroidName].quantity[0] === 0) {
                rarityElementOverride = createTextElement("Exhausted!", 'asteroidInfoContainerRarity', ['value-asteroid', 'red-disabled-text']);
                asteroid[asteroidName].quantity[1] = 'red-disabled-text';
                asteroid[asteroidName].easeOfExtraction[1] = 'red-disabled-text';
                asteroid[asteroidName].distance[1] = 'red-disabled-text';
            } else if (asteroid[asteroidName].beingMined) {
                rarityElementOverride = createTextElement("Being Mined!", 'asteroidInfoContainerRarity', ['value-asteroid', 'green-ready-text']);
            } else {
                rarityElementOverride = createTextElement(`${rarity[0]}`, 'asteroidInfoContainerRarity', ['value-asteroid', 'rarity-asteroid', rarity[1]]);
            }
            
            const asteroidRow = createOptionRow(
                `${asteroidRowName}`,
                null,
                asteroid[asteroidName].quantity[0] === 0 
                ? [`${name}:`, 'red-disabled-text']
                : asteroid[asteroidName].beingMined 
                    ? [`${name}:`, 'green-ready-text']
                    : [`${name}:`],
                rarityElementOverride,
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
                    `${Math.floor(quantity[0])}`,
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

            if (asteroid[asteroidName].quantity[0] === 0) {
                asteroidRow.style.opacity = "0.5";
            }

            optionContentElement.appendChild(asteroidRow);
        });
    } 
    
    if (heading === 'Antimatter') {
            const antimatterSvgRow = createOptionRow(
                'antimatterSvgRow',
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
        const autoBuyerRow = document.getElementById(`space${capitaliseString(rocket)}AutoBuyerRow`);
        if (autoBuyerRow) {
            autoBuyerRow.classList.add('invisible');
        }
    }

    if (!fuellingState && !fuelledUpState && !launchedState) {
        document.getElementById(`${rocket}FuellingProgressBar`).style.width = '0%';
        document.getElementById(`${rocket}FuellingProgressBarContainer`).classList.add('invisible');
        
    }
}

function createRocketUI(rocketId, optionContentElement, asteroids, asteroidsBeingMined) {
    const autobuyerPrice = getResourceDataObject('space', ['upgrades', rocketId, 'autoBuyer', 'tier1', 'price']);
    setCheckRocketFuellingStatus(rocketId, true);
    
    const fuellingState = getRocketsFuellerStartedArray().includes(rocketId);
    const fuelledUpState = getRocketsFuellerStartedArray().includes(`${rocketId}FuelledUp`);
    const launchedState = getLaunchedRockets().includes(rocketId);

    let filteredAsteroids = asteroids.filter(obj => {
        const asteroidName = Object.keys(obj)[0];
        const asteroid = obj[asteroidName];
    
        return !Object.values(asteroidsBeingMined).includes(asteroidName) && asteroid.quantity[0] > 0;
    });
    
    const rocketAutoBuyerRow = createOptionRow(
        `space${capitaliseString(rocketId)}AutoBuyerRow`,
        getResourceDataObject('space', ['upgrades', rocketId, 'autoBuyer', 'tier1', 'nameUpgrade']),
        'Fuel:',
        createButton(`Fuel Rocket`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', rocketId], () => {
            setRocketsFuellerStartedArray(rocketId, 'add');
            switchFuelGaugeWhenFuellerBought(rocketId, 'normal');
        }, 'upgradeCheck', '', 'autoBuyer', null, 'cash', true, 'tier1', 'rocketFuel'),
        createTextElement(`<div id="${rocketId}FuellingProgressBar">`, `${rocketId}FuellingProgressBarContainer`, ['progress-bar-container', 'invisible']),
        createButton(`Power Off!`, ['option-button', 'red-disabled-text', 'rocket-fuelled-check', `${rocketId}-launch-button`, 'invisible'], () => {
            launchRocket(rocketId);
        }, 'upgradeCheck', '', null, null, null, true, null, null),
        null,
        null,
        `${getCurrencySymbol()}${autobuyerPrice}`,
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
    optionContentElement.appendChild(rocketAutoBuyerRow);

    const rocketTravelRow = createOptionRow(
        `space${capitaliseString(rocketId)}TravelRow`,
        null,
        `Travel To:`,
        createTextElement(`${getDestinationAsteroid(rocketId)}`, `${rocketId}DestinationAsteroid`, ['green-ready-text', 'invisible', 'destination-text']),
        createDropdown(`${rocketId}TravelDropdown`, filteredAsteroids
            .flatMap(asteroidObj => Object.values(asteroidObj).map(asteroid => ({
                value: asteroid.name,
                text: `${asteroid.name}: Distance: <span class="dropDownDistanceValue ${getDistanceClass(asteroid.distance[0])}">${asteroid.distance[0]}</span>, Rarity: <span class="dropDownRarityValue ${getRarityClass(asteroid.rarity[0])}">${asteroid.rarity[0]}</span>, Antimatter: <span class="dropDownQuantityValue ${getQuantityClass(asteroid.quantity[0])}">${asteroid.quantity[0]}</span>`,
                distance: asteroid.distance[0]
            })))
            .sort((a, b) => a.distance - b.distance),
            '', (value) => {
                setDestinationAsteroid(rocketId, value);
            }, ['travel-to']),                                 
        createButton(`Travel`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', `${rocketId}-travel-to-asteroid-button`], () => {
            startTravelToAndFromAsteroidTimer([0, 'buttonClick'], rocketId, false);
            setRocketDirection(rocketId, false);
        }, 'upgradeCheck', '', 'autoBuyer', 'travelToAsteroid', 'time', true, null, 'spaceMiningPurchase'),
        createTextElement(`<div id="spaceTravelToAsteroidProgressBar${capitaliseString(rocketId)}">`, `spaceTravelToAsteroidProgressBar${capitaliseString(rocketId)}Container`, ['progress-bar-container', 'invisible']),
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
    optionContentElement.appendChild(rocketTravelRow);

    setFuellingVisibility(rocketId, [fuellingState, fuelledUpState, launchedState]);
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