import { createHtmlTextAreaProse, spaceTravelButtonHideAndShowDescription, drawStarConnectionDrawings, createStarDestinationRow, sortStarTable, handleSortStarClick, createTextElement, createOptionRow, createButton, generateStarfield, showNotification } from './ui.js';
import { setDestinationStarScanned, getDestinationStarScanned, getStellarScannerBuilt, setStellarScannerBuilt, getStarShipTravelling, setStarShipTravelling, setDestinationStar, getDestinationStar, getCurrencySymbol, getSortStarMethod, getCurrentStarSystem, STAR_FIELD_SEED, NUMBER_OF_STARS, getStarMapMode, setStarMapMode } from './constantsAndGlobalVars.js';
import { copyStarDataToDestinationStarField, getResourceDataObject, getStarShipParts, getStarShipPartsNeededInTotalPerModule, getStarSystemDataObject } from './resourceDataObject.js';
import { capitaliseString, capitaliseWordsWithRomanNumerals } from './utilityFunctions.js';
import { generateDestinationStarData, gain } from './game.js';

export function drawTab5Content(heading, optionContentElement, starDestinationInfoRedraw) {
    if (heading === 'Star Map') {
        const headerRow = document.getElementById('headerContentTab5');
        
        headerRow.innerHTML = `
            <div id="starMapNameField" class="star-map-name-field">Star Map</div>
            <div id="starButtonContainer" class="header-button-container"></div>
        `;
        
        const starButtonContainer = headerRow.querySelector('#starButtonContainer');
        const buttons = ['Normal', 'Distance', 'Studied', 'In Range'];
        
        buttons.forEach(button => {
            const buttonElement = createButton(button, ['option-button', 'star-option-button'], () => { 
                document.querySelectorAll('.star-option-button').forEach(btn => {
                    btn.classList.remove('green-ready-text');
                });
    
                buttonElement.classList.add('green-ready-text');
                
                setStarMapMode(button.toLowerCase());

                const starContainer = document.querySelector('#optionContentTab5');
                starContainer.innerHTML = '';
                generateStarfield(starContainer, NUMBER_OF_STARS, STAR_FIELD_SEED, getStarMapMode());
            }, '', '', '', null, '', true, '', '');
            
            starButtonContainer.appendChild(buttonElement);

            if (buttonElement.innerHTML.toLowerCase() === getStarMapMode()) {
                buttonElement.classList.add('green-ready-text');
            }
        });
        
        const starContainer = document.querySelector('#optionContentTab5');   
        starContainer.innerHTML = '';     
        generateStarfield(starContainer, NUMBER_OF_STARS, STAR_FIELD_SEED, getStarMapMode());
        if (getStarShipTravelling()) {
            drawStarConnectionDrawings(getCurrentStarSystem(), getDestinationStar(), 'travelling');
            const starData = getStarSystemDataObject('stars');
            createStarDestinationRow(starData[getDestinationStar()], 'travelling');
            spaceTravelButtonHideAndShowDescription();
        }
    }

    if (heading === 'Star Data') {        
        let currentStarName = getCurrentStarSystem();
        let starsData = getStarSystemDataObject('stars');
        
        let starsObject = Object.fromEntries(
            Object.entries(starsData).filter(([starName]) => starName !== currentStarName && starName !== 'destinationStar')
        );        

        const starLegendRow = createOptionRow(
            `starLegendRow`,
            null,
            `Sort By:`,
            createTextElement(
                `Distance`,
                'starLegendDistance',
                ['sort-by', 'label-star'],
                (event) => handleSortStarClick('distance')
            ),           
            createTextElement(
                `Weather`,
                'starLegendWeatherProb',
                ['sort-by', 'label-star'],
                (event) => handleSortStarClick('weather')
            ),
            createTextElement(
                `Precipitation`,
                'starLegendPrecipitationType',
                ['sort-by', 'label-star'],
                (event) => handleSortStarClick('precipitationType')
            ),
            createTextElement(
                `Fuel (AM)`,
                'starLegendFuel',
                ['no-sort', 'label-star'],
                (event) => handleSortStarClick('fuel')
            ),
            createTextElement(
                `AP`,
                'starLegendAscendencyPoints',
                ['no-sort', 'label-star'],
                (event) => handleSortStarClick('ascendencyPoints')
            ),
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
            'star',
            [true, '10%', '90%']
        );
    
        optionContentElement.appendChild(starLegendRow);
    
        let sortedStars = sortStarTable(starsObject, getSortStarMethod());

        Object.entries(sortedStars).forEach(([nameStar, star]) => {
            const { distance, fuel, ascendencyPoints, name, weatherTendency, precipitationType } = star;
            const starRowName = `starRow_${name}`;
            const weatherIconSpan = `<span class="${weatherTendency[2]}">${weatherTendency[0]}</span>`;
            const weatherText = `${weatherIconSpan} (${weatherTendency[1]}%)`;

            const currentAntimatter = getResourceDataObject('antimatter', ['quantity']);
            const hasEnoughFuel = currentAntimatter >= fuel;
            const fuelClass = hasEnoughFuel ? 'green-ready-text' : 'red-disabled-text';
        
            const starDataRow = createOptionRow(
                `${starRowName}`,
                null,
                [`${capitaliseWordsWithRomanNumerals(nameStar)}:`, fuelClass],
                createTextElement(
                    `${distance.toFixed(2)} ly`,
                    'starInfoContainerDistance',
                    ['value-star', 'distance-star', fuelClass]
                ), 
                createTextElement(
                    weatherText,
                    'starInfoContainerWeatherTendency',
                    ['value-star']
                ),                       
                createTextElement(
                    `${capitaliseString(precipitationType)}`,
                    'starInfoContainerPrecipitationType',
                    ['value-star']
                ),
                createTextElement(
                    `${fuel}`,
                    'starInfoContainerFuel',
                    ['value-star', 'fuel-star', 'notation', fuelClass]
                ),
                createTextElement(
                    `${ascendencyPoints}`,
                    'starInfoContainerAscendencyPoints',
                    ['value-star', 'fuel-star', 'notation']
                ),
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
                'star',
                [true, '10%', '90%']
            );
        
            optionContentElement.appendChild(starDataRow);
        });        
    }

    if (heading === 'Star Ship') {
        if (!starDestinationInfoRedraw) {
            const starShipModules = [
                { id: 'ssStructural', label: 'Structural' },
                { id: 'ssLifeSupport', label: 'Life Support Module' },
                { id: 'ssAntimatterEngine', label: 'Antimatter Engine' },
                { id: 'ssFleetHangar', label: 'Fleet Hangar' },
                { id: 'ssStellarScanner', label: 'Stellar Scanner' }
            ];
    
            starShipModules.forEach(module => {
                const starshipComponentBuildRow = createOptionRow(
                    `space${capitaliseString(module.id)}BuildRow`,
                    null,
                    `${module.label}:`,
                    createButton(`Build Module`, ['option-button', 'red-disabled-text', 'building-purchase-button', 'resource-cost-sell-check'], () => {
                        gain(1, `${module.id}BuiltPartsQuantity`, module.id, false, null, 'space', 'space')
                    }, 'upgradeCheck', '', 'spaceUpgrade', module.id, 'cash', true, null, 'starShipPurchase'),
                    createTextElement(
                        `Built: <span id="${module.id}BuiltPartsQuantity">${getStarShipParts(module.id)}</span> / <span id="${module.id}TotalPartsQuantity">${getStarShipPartsNeededInTotalPerModule(module.id)}</span>`,
                        `${module.id}PartsCountText`,
                        []
                    ),
                    null,
                    null,
                    null,
                    `${getCurrencySymbol() + getResourceDataObject('space', ['upgrades', module.id, 'price'])}, 
                    ${getResourceDataObject('space', ['upgrades', module.id, 'resource1Price'])[0]} ${capitaliseString(getResourceDataObject('space', ['upgrades', module.id, 'resource1Price'])[1])}, 
                    ${getResourceDataObject('space', ['upgrades', module.id, 'resource2Price'])[0]} ${capitaliseString(getResourceDataObject('space', ['upgrades', module.id, 'resource2Price'])[1])}, 
                    ${getResourceDataObject('space', ['upgrades', module.id, 'resource3Price'])[0]} ${capitaliseString(getResourceDataObject('space', ['upgrades', module.id, 'resource3Price'])[1])}`,
                    '',
                    'upgradeCheck',
                    'spaceUpgrade',
                    module.id,
                    'cash',
                    null,
                    false,
                    null,
                    null,
                    'starShipPurchase'
                );
                optionContentElement.appendChild(starshipComponentBuildRow);
            });
    
            const destinationStar = getDestinationStar();
            const starShipTravelRow = createOptionRow(
                `spaceStarShipTravelRow`,
                null,
                `Travelling To:`,
                createTextElement(`${capitaliseWordsWithRomanNumerals(destinationStar || '')}`, `starShipDestinationStar`, ['green-ready-text', 'destination-text']),
                createTextElement(`<div id="spaceTravelToStarProgressBar">`, `spaceTravelToStarProgressBarContainer`, ['progress-bar-container']),
                null,                               
                null,
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
            optionContentElement.appendChild(starShipTravelRow);
    
            const starShipStellarScannerRow = createOptionRow(
                `spaceStarShipStellarScannerRow`,
                null,
                `Perform System Scan:`,
                createButton(`Scan System`, ['option-button', 'green-ready-text'], () => {
                    setDestinationStarScanned(true);
                    copyStarDataToDestinationStarField(destinationStar);
                    generateDestinationStarData();
                    showNotification(`${capitaliseWordsWithRomanNumerals(destinationStar)} System Scanned!`);
    
                    drawTab5Content('Star Ship', optionContentElement, true);
                }, '', '', '', null, '', true, null, ''),
                null,
                null,                               
                null,
                null,
                `Scan ${capitaliseWordsWithRomanNumerals(destinationStar)} System`,
                '',
                null,
                null,
                null,
                null,
                null,
                false,
                null,
                null,
                ''
            );
            optionContentElement.appendChild(starShipStellarScannerRow);
        }

        if (getDestinationStarScanned()) {
            drawLifeformData(optionContentElement);
        }

        function drawLifeformData(optionContentElement) {
            const starData = getStarSystemDataObject('stars', ['destinationStar']);
        
            const starNameRow = createOptionRow(
                'starNameRow',
                null,
                'Star Name:',
                createTextElement(
                    capitaliseWordsWithRomanNumerals(getDestinationStar()),
                    'starNameText',
                    ['value-text']
                ),
                createTextElement(
                    `<span class="ap-destination-star-element-right">AP: <span class="green-ready-text">${starData.ascendencyPoints}</span></span>
                    Life: <span class="${getStellarScannerBuilt() ? (starData.lifeDetected ? 'green-ready-text' : 'red-disabled-text') : 'red-disabled-text'}">
                        ${getStellarScannerBuilt() ? (starData.lifeDetected ? 'Yes' : 'No') : '???'}
                    </span>`,
                    'apContainer',
                    ['value-text', 'ap-destination-star-element']
                ),                             
                createTextElement(
                    `<span class="ap-destination-star-element-right">
                        Weather: <span class="${starData.weatherTendency[2]}">${starData.weatherTendency[0]}</span> 
                        (<span class="probability-text">${starData.weatherTendency[1]}</span>%) - 
                        <span class="${starData.precipitation !== 'water' ? 'green-ready-text' : ''}">
                            ${capitaliseString(starData.precipitationType)}
                        </span>
                    </span>`,
                    'weatherContainer',
                    ['value-text', 'ap-destination-star-element']
                ),                
                null,
                null,
                '',
                '',
                null,
                null,
                null,
                null,
                null,
                false,
                null,
                null,
                '',
                [true, '15%', '85%']
            );            
        
            const civilizationRow = createOptionRow(
                'civilizationLevelRow',
                null,
                'Civilization:',
                createTextElement(
                    getStellarScannerBuilt() 
                        ? (starData.raceName === 'None' 
                            ? '<span class="green-ready-text">None</span>' 
                            : starData.raceName)
                        : `<span class="red-disabled-text">???</span>`,
                    'civilizationLevelText',
                    ['value-text']
                ),                
                createTextElement(
                    `<span class="ap-destination-star-element-right">Type: 
                        <span class="${getStellarScannerBuilt() 
                            ? (starData.civilizationLevel === 'Unsentient' 
                                ? 'green-ready-text' 
                                : starData.civilizationLevel === 'Industrial' 
                                    ? 'warning-orange-text' 
                                    : starData.civilizationLevel === 'None' 
                                        ? 'green-ready-text' 
                                        : 'red-disabled-text') 
                            : 'red-disabled-text'}">
                            ${getStellarScannerBuilt() ? starData.civilizationLevel : '???'}
                        </span>
                    </span>`,
                    'apContainer',
                    ['value-text', 'ap-destination-star-element']
                ),                    
                null,                               
                null,
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
                '',
                [true, '15%', '85%']
            );            
        
        const traitsText = getStellarScannerBuilt() 
        ? starData.lifeformTraits.map(trait => 
            `<span class="${trait[1]}">${trait[0]}</span>`
        ).join(", ") 
        : `<span class="red-disabled-text">???</span>`;
        
        const populationText = getStellarScannerBuilt() 
        ? (starData.civilizationLevel === 'Unsentient' 
            ? 'N/A' 
            : (starData.populationEstimate ? starData.populationEstimate.toLocaleString() : 'N/A')) 
        : `<span class="red-disabled-text">???</span>`;
        
        
        const populationRow = createOptionRow(
            'populationRow',
            null,
            'Population:',
            createTextElement(
                populationText,
                'populationText',
                ['value-text']
            ),
            createTextElement(
                `<span class="ap-destination-star-element-right">Traits: <span class="value-text">${traitsText}</span></span>`,
                'traitsText',
                ['value-text', 'ap-destination-star-element']
            ),
            null,                               
            null,
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
            '',
            [true, '15%', '85%']
        );              
        
            let defenseClass = "";
            let defenseText = `${getStellarScannerBuilt() ? starData.defenseRating + '%' : '???'}`;
            
            if (getStellarScannerBuilt()) {
                if (starData.defenseRating > 75) {
                    defenseClass = "red-disabled-text";
                } else if (starData.defenseRating >= 50) {
                    defenseClass = "warning-orange-text";
                } else {
                    defenseClass = "green-ready-text";
                }
            } else {
                defenseClass = "red-disabled-text";
            }
            
            let threatLevelClass = "";
            const threatLevel = getStellarScannerBuilt() ? starData.threatLevel : '???';
            if (threatLevel === "None" || threatLevel === "Low") {
                threatLevelClass = "green-ready-text";
            } else if (threatLevel === "Moderate" || threatLevel === "High") {
                threatLevelClass = "warning-orange-text";
            } else if (threatLevel === "Extreme") {
                threatLevelClass = "red-disabled-text";
            } else {
                threatLevelClass = "red-disabled-text";
            }
            
            const threatRow = createOptionRow(
                'threatLevelRow',
                null,
                'Threat Level:',
                createTextElement(
                    `<span class="${threatLevelClass}">${threatLevel}</span>`,
                    'threatLevelText',
                    [threatLevelClass]
                ),
                createTextElement(
                    `<span class="ap-destination-star-element-right">Defense: <span class="value-text ${defenseClass}">${defenseText}</span></span>`,
                    'defenseRatingText',
                    ['value-text', 'ap-destination-star-element']
                ),
                null,                               
                null,
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
                '',
                [true, '15%', '85%']
            );                                           
        
            const fleetRow = createOptionRow(
                'enemyFleetsRow',
                null,
                'Enemy Fleets:',
                createTextElement(
                    `Land: <span class="${starData.civilizationLevel === 'None' 
                        ? 'green-ready-text' 
                        : (getStellarScannerBuilt() 
                            ? (starData.enemyFleets.fleetChanges.land.class || '') 
                            : 'red-disabled-text')}">
                        ${starData.civilizationLevel === 'None' 
                            ? 'None' 
                            : (getStellarScannerBuilt() 
                                ? starData.enemyFleets.land 
                                : '???')}
                    </span>`,
                    'fleetLandText',
                    ['value-text', 'ap-destination-star-element']
                ),
                createTextElement(
                    `Air: <span class="${starData.civilizationLevel === 'None' 
                        ? 'green-ready-text' 
                        : (getStellarScannerBuilt() 
                            ? (starData.enemyFleets.fleetChanges.air.class || '') 
                            : 'red-disabled-text')}">
                        ${starData.civilizationLevel === 'None' 
                            ? 'None' 
                            : (getStellarScannerBuilt() 
                                ? starData.enemyFleets.air 
                                : '???')}
                    </span>`,
                    'fleetAirText',
                    ['value-text', 'ap-destination-star-element']
                ),
                createTextElement(
                    `Sea: <span class="${starData.civilizationLevel === 'None' 
                        ? 'green-ready-text' 
                        : (getStellarScannerBuilt() 
                            ? (starData.enemyFleets.fleetChanges.sea.class || '') 
                            : 'red-disabled-text')}">
                        ${starData.civilizationLevel === 'None' 
                            ? 'None' 
                            : (getStellarScannerBuilt() 
                                ? starData.enemyFleets.sea 
                                : '???')}
                    </span>`,
                    'fleetSeaText',
                    ['value-text', 'ap-destination-star-element']
                ),                                                 
                null,
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
                '',
                [true, '15%', '85%']
            );                    
        
        let anomaliesText = (getStellarScannerBuilt() && starData.anomalies.length > 0)
        ? starData.anomalies.map(a => {
            if (a.name === 'None') {
                return `<span>N/A</span>`;
            }
            return `${a.name}: <span class="${a.class}">${a.effect}</span>`;
        }).join('<br/>')
        : '<span class="red-disabled-text">???</span>';
        
        if (starData.anomalies.length === 0) {
            anomaliesText = '<span>None</span>';
        }

        if (starData.civilizationLevel === 'None') {
            anomaliesText = '<span>N/A</span>';
        }
        
        const anomaliesRow = createOptionRow(
            'anomaliesRow',
            null,
            'Anomalies:',
            createTextElement(
                anomaliesText,
                'anomaliesTextField'
                ['value-text'],
            ),
            null,
            null,
            null,
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
            '',
            [true, '15%', '85%']
        );        
        
            optionContentElement.appendChild(starNameRow);
            optionContentElement.appendChild(civilizationRow);
            optionContentElement.appendChild(populationRow);
            optionContentElement.appendChild(threatRow);
            optionContentElement.appendChild(fleetRow);
            optionContentElement.appendChild(anomaliesRow);
        }
    }

    if (heading === 'Fleet Hangar') {
    
    }
}

        //the idea is discover stars until you can no longer be arsed, but knowing they give more ascendency points (rebirth points)
        //when you reach the point you want to rebirth, you select a star and assuming you have the right technology, and resources, and antimatter, then you can rebirth on that star
        //the game will start again but you will carry antimatter and ascendency points through with you
        //the last tab will unlock after the first rebirth where we open a market allowing purchase of buffs from antimatter left over and very strong ones from ascendency points
        //these will be permanent buffs