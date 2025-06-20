import {
    getInfinitePowerRate,
    getStatRun,
    getAdditionalSystemsToSettleThisRun,
    getPlayerStartingUnitHealth,
    setPlayerPhilosophy,
    getPlayerPhilosophy,
    setFeedbackContent,
    setSaveData,
    getNotificationQueues,
    setNotificationQueues,
    getNotificationStatus,
    setNotificationStatus,
    getNotificationContainers,
    setNotificationContainers,
    getClassificationOrder,
    setClassificationOrder,
    setEnemyFleetsAdjustedForDiplomacy,
    getEnemyFleetsAdjustedForDiplomacy,
    getFleetConstantData,
    setInFormation,
    getFormationGoal,
    setFormationGoal,
    getBattleTriggeredByPlayer,
    replaceBattleUnits,
    setBattleOngoing,
    setBattleUnits,
    getBattleUnits,
    setDiplomacyPossible,
    setAlreadySeenNewsTickerArray,
    getAlreadySeenNewsTickerArray,
    getStarShipStatus,
    getStarShipArrowPosition,
    getFromStarObject,
    setFromStarObject,
    getToStarObject,
    setToStarObject,
    getStarShipTravelling,
    setDestinationStar,
    getDestinationStar,
    getStarShipBuilt,
    setSortStarMethod,
    getStarVisionDistance,
    STAR_SEED,
    setRocketUserName,
    setCurrentDestinationDropdownText,
    getBoostRate,
    setHasAntimatterSvgRightBoxDataChanged,
    getHasAntimatterSvgRightBoxDataChanged,
    getNormalMaxAntimatterRate,
    getMiningObject,
    getImageUrls,
    setUnlockedCompoundsArray,
    setUnlockedResourcesArray,
    setTechUnlockedArray,
    getNewsTickerScrollDuration,
    getOneOffPrizesAlreadyClaimedArray,
    setOneOffPrizesAlreadyClaimedArray,
    deferredActions,
    setRenderedTechTree,
    getRenderedTechTree,
    setTechTreeDrawnYet,
    getUpcomingTechArray,
    setLastSavedTimeStamp,
    setCurrentTheme,
    READY_TO_SORT,
    NOW,
    setTechRenderCounter,
    setTechRenderChange,
    getRevealedTechArray,
    setRevealedTechArray,
    getDebugVisibilityArray,
    getTechUnlockedArray,
    getLastScreenOpenRegister,
    setLastScreenOpenRegister,
    setCurrentOptionPane,
    getNotificationsToggle,
    setCurrentTab,
    getCurrentTab,
    setElements,
    getElements,
    getGameVisibleActive,
    getCurrentOptionPane,
    setSaveName,
    getSaveName,
    getSaveData,
    getTimerRateRatio,
    getBuildingTypeOnOff,
    getNewsTickerSetting,
    getPowerOnOff,
    getRocketsFuellerStartedArray,
    getCurrentStarSystemWeatherEfficiency,
    getCurrentStarSystem,
    setSortAsteroidMethod,
    getAsteroidArray,
    getIsAntimatterBoostActive,
    setRocketsBuilt,
    setAntimatterUnlocked,
    setCanFuelRockets,
    setCanTravelToAsteroids,
    getRocketUserName,
    setCurrentStarObject,
    setWarMode,
    getWarMode,
    getNeedNewBattleCanvas,
    setNeedNewBattleCanvas,
    getSettledStars,
    MAX_STACKS,
    STACK_WIDTH,
    BASE_RIGHT,
    setAchievementFlagArray,
    setActivatedWackyNewsEffectsArray,
    setFirstAccessArray,
    getFirstAccessArray,
    getFeedbackCanBeRequested,
    setFeedbackCanBeRequested,
    getRepeatableTechMultipliers,
    STAR_FIELD_SEED,
    NUMBER_OF_STARS,
    getStarMapMode,
    getPhilosophyAbilityActive,
    getStarsWithAncientManuscripts,
    getFactoryStarsArray,
    getMiaplacidusMilestoneLevel,
    getHomeStarName,
    getInfinitePower
} from './constantsAndGlobalVars.js';
import {
    getResourceDataObject,
    getStarSystemDataObject,
    setAutoBuyerTierLevel,
    setResourceDataObject,
    setStarSystemDataObject,
    getBuffEnhancedMiningData,
    getAchievementImageUrl
} from "./resourceDataObject.js";
import {
    optionDescriptions,
    getRocketNames,
    getOptionDescription,
    gameIntroHeader,
    gameIntroText,
    launchStarShipWarningHeader,
    launchStarShipWarningText,
    enterWarModeModalHeader,
    enterwarModeModalBackOutText,
    enterwarModeModalNoBackOutText,
    enterWarModeInsultedText,
    enterWarModeSurrenderText,
    enterWarModeNotVassalizedText,
    enterWarModeScaredText,
    enterWarModeModalLaughAtProspect,
    enterWarModeModalLaughAndEnterWar,
    enterWarModeModalImproveToReceptive,
    enterWarModeModalNeutral,
    enterWarModeModalReserved,
    enterWarModeModalPatience,
    modalBattleHeaderText,
    modalBattleWonText,
    modalBattleLostText,
    modalBattleNoSentientLifeHeader,
    modalBattleNoSentientLifeText,
    modalFeedbackHeaderText,
    modalFeedbackThanksHeaderText,
    modalFeedbackContentTextGood,
    modalFeedbackContentTextBad,
    modalFeedbackContentThanks,
    gameSaveNameCollect,
    initialiseDescriptions,
    rocketNames,
    getHeaderDescriptions,
    getStarNames,
    getAchievementTooltipDescription,
    refreshAchievementTooltipDescriptions,
    modalPlayerLeaderIntroContentText1,
    modalPlayerLeaderIntroContentText2,
    modalPlayerLeaderIntroContentText3,
    modalPlayerLeaderIntroContentText4
} from "./descriptions.js";

import { saveGame, loadGameFromCloud, generateRandomPioneerName, saveGameToCloud } from './saveLoadGame.js';

import {
    setSellFuseCreateTextDescriptionClassesBasedOnButtonStates,
    setGameState,
    startGame,
    offlineGains,
    startNewsTickerTimer,
    getBatteryLevel,
    toggleAllPower,
    boostAntimatterRate,
    discoverAsteroid,
    buildSpaceMiningBuilding,
    extendStarDataRange,
    generateStarDataAndAddToDataObject,
    startTravelToDestinationStarTimer,
    addToResourceAllTimeStat,
    calculateMovementVectorToTarget,
    setEnemyFleetPower,
    rebirth,
    settleSystemAfterBattle,
    setAutoSellToggleState,
    setAutoCreateToggleState,
    calculateStarTravelDuration
} from './game.js';

import { 
    capitaliseString, 
    capitaliseWordsWithRomanNumerals,
    toCamelCase
} from './utilityFunctions.js';

import { playClickSfx, playSwipeSfx, sfxPlayer } from './audioManager.js';

import { drawTab1Content } from './drawTab1Content.js';
import { drawTab2Content } from './drawTab2Content.js';
import { drawTab3Content } from './drawTab3Content.js';
import { drawTab4Content } from './drawTab4Content.js';
import { drawTab5Content } from './drawTab5Content.js';
import { drawTab6Content } from './drawTab6Content.js';
import { drawTab7Content } from './drawTab7Content.js';
import { drawTab8Content } from './drawTab8Content.js';

let modalTooltipHandlers = {};

const variableDebuggerWindow = document.getElementById('variableDebuggerWindow');
const debugWindow = document.getElementById('debugWindow');
const closeButton = document.querySelector('.close-btn');

document.addEventListener('DOMContentLoaded', async () => {
    setElements();

    setGameState(getGameVisibleActive());

    generateRandomPioneerName();

    if (localStorage.getItem('saveName')) {
        setSaveName(localStorage.getItem('saveName'));
    }

    initialiseDescriptions();

    const headerText = gameIntroHeader;
    let content = gameSaveNameCollect;
    populateModal(headerText, content);
    getElements().modalContainer.style.display = 'flex';
    getElements().overlay.style.display = 'flex';

    document.querySelector('.fullScreenCheckBox').addEventListener('click', function () {
        this.classList.toggle('checked');
    });

    document.querySelector('.fullScreenLabel').addEventListener('click', function () {
        document.querySelector('.fullScreenCheckBox').classList.toggle('checked');
    });

    await getUserSaveName();

    initialiseDescriptions();

    content = gameIntroText;
    populateModal(headerText, content);
    getElements().modalContainer.style.display = 'flex';
    document.querySelector('.fullScreenContainer').style.display = 'flex';
    getElements().overlay.style.display = 'flex';

    const modalConfirmBtn = document.getElementById('modalConfirm');

    const startGameClickHandler = () => {
        if (document.getElementById('fullScreenCheckBox').classList.contains('checked')) {
            toggleGameFullScreen();
        }
        document.querySelector('.fullScreenContainer').style.display = 'none';
        showHideModal();

        modalConfirmBtn.removeEventListener('click', startGameClickHandler);
    };

    modalConfirmBtn.addEventListener('click', startGameClickHandler);
    
    startGame();

    document.addEventListener('keydown', (event) => {
        if (event.code === 'NumpadSubtract') {
            toggleDebugWindow();
        }
    });

    document.querySelectorAll('.collapsible-header').forEach(header => {
        header.addEventListener('click', function () {
            playSwipeSfx();
            const content = this.nextElementSibling;
            content.classList.toggle('open');
            this.classList.toggle('active');
        });
    });

    //handleLanguageChange(getLanguageSelected()); //if we are using localise later on

    const powerAllButton = document.getElementById('activateGridButton');
    powerAllButton.addEventListener('click', () => {
        if (!getInfinitePower()) {
            toggleAllPower();
        }
    });
     
    window.addEventListener('resize', () => {
        if (getCurrentOptionPane()) {
            const starContainer = document.querySelector('#optionContentTab5');
            starContainer.innerHTML = '';
            generateStarfield(starContainer, NUMBER_OF_STARS, STAR_FIELD_SEED, getStarMapMode(), false, null, false);
        }
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            setLastSavedTimeStamp(new Date().toISOString());
        } else {
            offlineGains(true);
        }
    });

    document.addEventListener("mouseenter", (e) => {
        if (getResourceDataObject('antimatter', ['rate']) > 0) {
            if (e.target && e.target.id === 'svgRateBar' || e.target.id === 'svgRateBarOuter') {
                const boostTextContainer = document.getElementById('boostTextContainer');
                const antimatterRateBarOuter = document.getElementById('svgRateBarOuter');
                if (antimatterRateBarOuter) {
                    antimatterRateBarOuter.style.backgroundColor = `rgba(var(--text-color-rgb), 0.2)`;
                }
                if (boostTextContainer) {
                    boostTextContainer.style.visibility = 'visible';
                    boostTextContainer.style.opacity = "1";
                }
            }
        }
    }, true);
    
    document.addEventListener("mouseleave", (e) => {
        if (getResourceDataObject('antimatter', ['rate']) > 0) {
            if (e.target && e.target.id === 'svgRateBarOuter') {
                boostAntimatterRate(false);
            }
        }
    }, true);   
    
    document.addEventListener('mousedown', (e) => {
        if (getResourceDataObject('antimatter', ['rate']) > 0) {
            if (e.target && e.target.id === 'svgRateBarOuter') {
                boostAntimatterRate(true);
            }
        }
    });

    document.addEventListener('mouseup', (e) => {
        if (getResourceDataObject('antimatter', ['rate']) > 0) {
            if (e.target && e.target.id === 'svgRateBarOuter') {
                boostAntimatterRate(false);
            }
        }
    });
});

export function removeTabAttentionIfNoIndicators(tabId) {
    const container = document.getElementById(`${tabId}ContainerGroup`);
    const tab = document.getElementById(tabId);

    if (container && tab) {
        const hasIndicators = container.classList.contains('attention-indicator') ||
                              container.querySelector('.attention-indicator');
        if (!hasIndicators) {
            const icon = tab.querySelector('.attention-indicator');
            if (icon) {
                icon.remove();
            }
        }
    }
}

export function updateContent(heading, tab, type) {
    playClickSfx();
    const optionDescriptionElements = getElements().optionPaneDescriptions;
    let optionDescription;

    let headerContentElement;
    let optionContentElement;
    let optionDescriptionElement;

    let tabNumber = parseInt(tab.replace('tab', ''));
    headerContentElement = document.getElementById(`headerContentTab${tabNumber}`);
    optionContentElement = document.getElementById(`optionContentTab${tabNumber}`);

    headerContentElement.innerText = heading;
    
    if (heading.includes('⚠️')) {
        heading = heading.replace(/⚠️/, '').trimEnd();
        headerContentElement.innerText = heading;
    }    

    optionContentElement.innerHTML = '';
       
    if (type === 'intro') {      
        optionDescription = getHeaderDescriptions([heading]);
        optionDescriptionElement = optionDescriptionElements[tabNumber - 1];
        optionDescriptionElement.innerHTML = optionDescription;
        optionDescriptionElement.style.border = `1px dashed var(--container-border-color)`;

        const asciiArt = getImageUrls();
        const asciiContainer = document.createElement('div');
        asciiContainer.classList.add('intro-image-container');

        const asciiKey = heading.toLowerCase();
        asciiContainer.innerHTML = asciiArt[asciiKey];
    
        optionContentElement.appendChild(asciiContainer);
        return;
    } else {
        optionDescription = getHeaderDescriptions([heading.toLowerCase()]);
        switch (tab) {
            case 'tab1':
                optionDescriptionElement = optionDescriptionElements[0];
                optionDescriptionElement.innerHTML = optionDescription;
                optionDescriptionElement.style.border = `1px dashed var(--container-border-color)`;
                drawTab1Content(heading, optionContentElement);
                break;
            case 'tab2':
                optionDescriptionElement = optionDescriptionElements[1];
                optionDescriptionElement.innerHTML = optionDescription;
                optionDescriptionElement.style.border = `1px dashed var(--container-border-color)`;
                drawTab2Content(heading, optionContentElement);
                break;
            case 'tab3':
                optionDescriptionElement = optionDescriptionElements[2];
                optionDescriptionElement.innerHTML = optionDescription;
                optionDescriptionElement.style.border = `1px dashed var(--container-border-color)`;
                drawTab3Content(heading, optionContentElement);
                break;
            case 'tab4':
                optionDescriptionElement = optionDescriptionElements[3];
                optionDescriptionElement.innerHTML = optionDescription;
                optionDescriptionElement.style.border = `1px dashed var(--container-border-color)`;
                drawTab4Content(heading, optionContentElement);
                break;
            case 'tab5':
                optionDescriptionElement = optionDescriptionElements[4];
                optionDescriptionElement.innerHTML = optionDescription;
                optionDescriptionElement.style.border = `1px dashed var(--container-border-color)`;
                drawTab5Content(heading, optionContentElement, false, false);
                break;
            case 'tab6':
                optionDescriptionElement = optionDescriptionElements[5];
                if (getCurrentOptionPane().startsWith('rocket')) {
                    optionDescriptionElement.innerHTML = getRocketNames('rocketDescription');
                } else {
                    optionDescriptionElement.innerHTML = optionDescription;
                }
                optionDescriptionElement.style.border = `1px dashed var(--container-border-color)`;
                drawTab6Content(heading, optionContentElement);
                break;
            case 'tab7':
                optionDescriptionElement = optionDescriptionElements[6];
                optionDescriptionElement.innerHTML = optionDescription;
                optionDescriptionElement.style.border = `1px dashed var(--container-border-color)`;
                drawTab7Content(heading, optionContentElement);
                break;
            case 'tab8':
                optionDescriptionElement = optionDescriptionElements[7];
                optionDescriptionElement.innerHTML = optionDescription;
                optionDescriptionElement.style.border = `1px dashed var(--container-border-color)`;
                drawTab8Content(heading, optionContentElement);
                break;
            default:
                console.error('Invalid tab:', tab);
                break;
        }
    }
}

export function createOptionRow(
    labelId,
    renderNameABs,
    labelText,
    inputElement1,
    inputElement2,
    inputElement3,
    inputElement4,
    inputElement5,
    descriptionText,
    resourcePriceObject,
    dataConditionCheck,
    objectSectionArgument1,
    objectSectionArgument2,
    quantityArgument,
    autoBuyerTier,
    startInvisibleValue,
    resourceString,
    optionalIterationParam,
    rowCategory,
    noDescriptionContainer,
    specialInputContainerClasses = false,
    hideMainDescriptionRow = false
) {
    // Main wrapper container
    const wrapper = document.createElement('div');
    wrapper.classList.add('option-row', 'd-flex')
    wrapper.id = labelId;

    // Create the description row
    const descriptionRowContainer = document.createElement('div');
    descriptionRowContainer.id = labelId + 'Description';
    descriptionRowContainer.classList.add('option-row-description', 'd-flex');
    if(getOptionDescription(labelId)) {
        descriptionRowContainer.innerHTML = getOptionDescription(labelId).content1;
    }

    // Main row container
    const mainRow = document.createElement('div');
    mainRow.classList.add('option-row-main', 'd-flex');
    wrapper.dataset.conditionCheck = dataConditionCheck;
    wrapper.dataset.type = objectSectionArgument1;
    wrapper.dataset.autoBuyerTier = autoBuyerTier;
    wrapper.dataset.rowCategory = rowCategory;

    // Visibility logic for mainRow
    if (dataConditionCheck === "techUnlock") {
        const researchPointsToAppear = getResourceDataObject('techs', [objectSectionArgument1, 'appearsAt'])[0];
        const prerequisiteForTech = getResourceDataObject('techs', [objectSectionArgument1, 'appearsAt'])[1];
        if (getResourceDataObject('research', ['quantity']) < researchPointsToAppear && !getRevealedTechArray().includes(objectSectionArgument1)) {
            wrapper.classList.add('invisible');
        } else if (!getTechUnlockedArray().includes(prerequisiteForTech)) {
            wrapper.classList.add('invisible');
        } else if (getResourceDataObject('research', ['quantity']) >= researchPointsToAppear && !getRevealedTechArray().includes(objectSectionArgument1)) {
            setRevealedTechArray(objectSectionArgument1);
        }
    }

    if (getCurrentOptionPane() === 'launch pad') {
        if (objectSectionArgument2.startsWith('rocket') && !getResourceDataObject('space', ['upgrades', 'launchPad', 'launchPadBoughtYet'])) {
            wrapper.classList.add('invisible');
        } else if (objectSectionArgument2.startsWith('rocket')) {
            wrapper.classList.remove('invisible');
        }
    }

    if (getCurrentOptionPane() === 'space telescope') {
        if (['searchAsteroid', 'investigateStar', 'pillageVoid'].includes(objectSectionArgument2)) {
            if (!getResourceDataObject('space', ['upgrades', 'spaceTelescope', 'spaceTelescopeBoughtYet'])) {
                wrapper.classList.add('invisible');
            } else {
                if (objectSectionArgument2 === 'pillageVoid') {
                    if (getPlayerPhilosophy() === 'voidborn' && getPhilosophyAbilityActive() && getStatRun() > 1) {
                        wrapper.classList.remove('invisible');
                    } else {
                        wrapper.classList.add('invisible');
                    }
                } else {
                    wrapper.classList.remove('invisible');
                }
            }
        }
    }

    if (startInvisibleValue && startInvisibleValue[0] !== 'research') {
        const revealElementType = startInvisibleValue[0];
        const revealElementCondition = startInvisibleValue[1];

        if (revealElementType === 'tech') {
            if (!getTechUnlockedArray().includes(revealElementCondition)) {
                wrapper.classList.add('invisible');
            }
        }

        if (revealElementType === 'debug') {
            if (getDebugVisibilityArray().includes(revealElementCondition)) {
                wrapper.classList.add('invisible');
            }
        }
    }

    // Create the label container
    const labelContainer = document.createElement('div');
    labelContainer.classList.add('label-container');
    if (noDescriptionContainer) {
        if (noDescriptionContainer[1] !== 'invisible') {
            labelContainer.style.width = noDescriptionContainer[1];
        } else {
            labelContainer.classList.add('invisible');
        }

    }
    const label = document.createElement('label');

    if (objectSectionArgument1 === 'autoBuyer') { //to change color of label pass an array [value, class] as labeltext argument to function
        label.innerText = renderNameABs + ':';
    } else {
        if (Array.isArray(labelText)) {
            labelContainer.classList.add(labelText[1]);
            label.innerText = labelText[0];
        } else {
            label.innerText = labelText;
        }
    }
    
    labelContainer.appendChild(label);
    mainRow.appendChild(labelContainer);

    // Create the input container
    const inputContainer = document.createElement('div');
    inputContainer.classList.add('input-container');
    if (specialInputContainerClasses) {
        specialInputContainerClasses.forEach(className => {
            inputContainer.classList.add(className);
        });
    }

    if (noDescriptionContainer) {
        inputContainer.style.width = noDescriptionContainer[2];
    }

    if (inputElement1) inputContainer.appendChild(inputElement1);
    if (inputElement2) inputContainer.appendChild(inputElement2);
    if (inputElement3) inputContainer.appendChild(inputElement3);
    if (inputElement4) inputContainer.appendChild(inputElement4);
    if (inputElement5) inputContainer.appendChild(inputElement5);

    mainRow.appendChild(inputContainer);

    // Create the description container that contains prices of upgrades etc
    if (!noDescriptionContainer || getCurrentOptionPane() === 'energy' || getCurrentOptionPane() === 'power plant' || getCurrentOptionPane() === 'advanced power plant' || getCurrentOptionPane() === 'solar power plant') {
        const descriptionContainer = document.createElement('div');
        descriptionContainer.classList.add('description-container');
        const description = document.createElement('label');
        description.classList.add('notation');
    
        if (rowCategory === 'building' || rowCategory === 'spaceMiningPurchase' || rowCategory === 'starShipPurchase' || rowCategory === 'fleetPurchase') {
            description.classList.add('building-purchase');
        }
    
        description.id = generateElementId(labelText, resourceString, optionalIterationParam);
        description.innerHTML = descriptionText;
    
        if (dataConditionCheck) {
            if (rowCategory === 'resource' || rowCategory === 'building' || rowCategory === 'spaceMiningPurchase' || rowCategory === 'starShipPurchase' || rowCategory === 'fleetPurchase' || rowCategory === 'science' || rowCategory === 'tech') {
                description.classList.add('red-disabled-text', 'resource-cost-sell-check');
            } else if (rowCategory === 'compound') {
                description.classList.add('red-disabled-text', 'compound-cost-sell-check');
            }
    
            if (dataConditionCheck === 'techUnlock') {
                description.dataset.conditionCheck = dataConditionCheck;
                description.dataset.argumentCheckQuantity = quantityArgument;
                description.dataset.type = objectSectionArgument1;
            } else {
                const quantityArgument2 = descriptionText.includes(',') && objectSectionArgument1.includes('storage') ? descriptionText.split(',').pop().trim().split(' ').pop().toLowerCase() : '';            
                
                description.dataset.conditionCheck = dataConditionCheck;
                description.dataset.resourcePriceObject = resourcePriceObject;
                description.dataset.type = objectSectionArgument1;
                description.dataset.resourceToFuseTo = objectSectionArgument2;
                description.dataset.argumentCheckQuantity = quantityArgument;
                description.dataset.argumentCheckQuantity2 = quantityArgument2;
                description.dataset.autoBuyerTier = autoBuyerTier;
                description.dataset.rowCategory = rowCategory;
            }
        }
    
        descriptionContainer.appendChild(description);
        mainRow.appendChild(descriptionContainer);
    }

    if (!hideMainDescriptionRow) {
         wrapper.appendChild(descriptionRowContainer);
    }
    wrapper.appendChild(mainRow);

    return wrapper;
}

function generateElementId(labelText, resource, optionalIterationParam) {

    let id = labelText.replace(/:$/, '');
    id = id.replace(/(^\w|[A-Z]|\s+)(\w*)/g, (match, p1, p2, index) => {
        return index === 0 ? p1.toLowerCase() + p2 : p1.toUpperCase() + p2;
    });

    if (resource !== null) {
        id = resource.toLowerCase() + capitaliseString(id);
    }

    if (optionalIterationParam) {
        id += optionalIterationParam + 'Description';
    } else {
        id += 'Description';
    }

    id = id.replace(/\s+/g, '');
    
    return id;
}

export function createDropdown(id, options, selectedValue, onChange, classes = []) {
    const selectContainer = document.createElement('div');
    selectContainer.classList.add('select-container');
    selectContainer.id = id;

    if (Array.isArray(classes)) {
        classes.forEach(className => selectContainer.classList.add(className));
    }

    const dropdown = document.createElement('div');
    dropdown.classList.add('dropdown');
    dropdown.setAttribute('tabindex', '0');

    const dropdownText = document.createElement('span');
    dropdownText.classList.add('dropdown-text');

    const defaultOption = options.find(option => option.value === selectedValue);
    dropdownText.innerHTML = defaultOption ? defaultOption.text : 'Select an option';

    dropdown.appendChild(dropdownText);

    const dropdownOptions = document.createElement('div');
    dropdownOptions.classList.add('dropdown-options');

    options.forEach((option) => {
        const optionDiv = document.createElement('div');
        optionDiv.classList.add('dropdown-option');
        optionDiv.setAttribute('data-value', option.value);
        optionDiv.setAttribute('data-type', option.type);
        optionDiv.innerHTML = option.text;

        optionDiv.addEventListener('click', (event) => {
            playClickSfx();
            const value = event.target.getAttribute('data-value');
            const selectedOption = options.find(option => option.value == value);
            dropdownText.innerHTML = selectedOption ? selectedOption.text : 'Select an option';
            if (getCurrentOptionPane().startsWith('rocket')) {
                setCurrentDestinationDropdownText(dropdownText.innerHTML);
            }
            dropdownOptions.classList.remove('show');
            selectContainer.style.borderRadius = '10px 10px 10px 10px';
            onChange(value);
        });

        dropdownOptions.appendChild(optionDiv);
    });

    dropdown.addEventListener('click', (event) => {
        playSwipeSfx();
        event.stopPropagation();

        const isVisible = dropdownOptions.classList.contains('show');

        document.querySelectorAll('.dropdown-options').forEach(option => {
            option.classList.remove('show');
        });

        if (!isVisible) {
            dropdownOptions.classList.add('show');
            selectContainer.style.borderRadius = '10px 10px 0 0'; 
        } else {
            selectContainer.style.borderRadius = '10px 10px 10px 10px';
        }
    });

    document.addEventListener('click', (event) => {
        if (!selectContainer.contains(event.target)) {
            selectContainer.style.borderRadius = '10px 10px 10px 10px';
            dropdownOptions.classList.remove('show');
        }
    });

    selectContainer.appendChild(dropdown);
    selectContainer.appendChild(dropdownOptions);
    return selectContainer;
}

export function createToggleSwitch(id, isChecked, onChange, extraClasses) {
    const toggleContainer = document.createElement('div');
    toggleContainer.classList.add('toggle-container');

    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.id = id;
    toggle.checked = isChecked;

    toggle.addEventListener('change', (event) => {
        const isEnabled = event.target.checked;
        playSwipeSfx();
        onChange(isEnabled);
    });

    const toggleLabel = document.createElement('label');
    toggleLabel.htmlFor = id;

    if (Array.isArray(extraClasses)) {
        extraClasses.forEach(className => {
            toggleContainer.classList.add(className);
        });
    }

    toggleContainer.appendChild(toggle);
    toggleContainer.appendChild(toggleLabel);
    return toggleContainer;
}


export function createButton(text, classNames, onClick, dataConditionCheck, resourcePriceObject, objectSectionArgument1, objectSectionArgument2, quantityArgument, disableKeyboardForButton, autoBuyerTier, rowCategory) {
    const button = document.createElement('button');
    button.innerText = text;
    
    if (Array.isArray(classNames)) {
        classNames.forEach(className => {
            if (className.startsWith('id_')) {
                button.id = className.slice(3);
            } else {
                button.classList.add(className);
            }
        });
    } else if (typeof classNames === 'string') {
        button.classList.add(classNames);
    }

    if (dataConditionCheck) {
        if (dataConditionCheck === 'sellResource' || dataConditionCheck === 'fuseResource') {
            button.dataset.conditionCheck = dataConditionCheck;
            button.dataset.argumentCheckQuantity = quantityArgument;
            button.dataset.type = objectSectionArgument1;
            button.dataset.resourceToFuseTo = objectSectionArgument2;
        } else if (dataConditionCheck === 'techUnlock' || dataConditionCheck === 'techUnlockPhilosophy') {
            button.dataset.conditionCheck = dataConditionCheck;
            button.dataset.argumentCheckQuantity = quantityArgument;
            button.dataset.type = objectSectionArgument1;
        }else if (dataConditionCheck === 'toggle') {
            button.dataset.conditionCheck = dataConditionCheck;
            button.dataset.toggleTarget = objectSectionArgument2;
        } else {
            button.dataset.conditionCheck = dataConditionCheck;
            button.dataset.resourcePriceObject = resourcePriceObject;
            button.dataset.type = objectSectionArgument1;
            button.dataset.resourceToFuseTo = objectSectionArgument2;
            button.dataset.argumentCheckQuantity = quantityArgument;
            button.dataset.autoBuyerTier = autoBuyerTier;
            button.dataset.rowCategory = rowCategory;
        }
    }

    button.addEventListener('click', function(event) {
        if (objectSectionArgument1 && objectSectionArgument1 === 'storage') {
            sfxPlayer.playAudio('increaseStorage');
        } else {
            playClickSfx();
        }
        onClick(event);
    });
    
    if (disableKeyboardForButton) {
        button.setAttribute('tabindex', '-1');
        button.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
            }
        });
    }

    return button;
}

export function createTextElement(text, id, classList, onClick) {
    const div = document.createElement('div');
    
    div.id = id;
    div.innerHTML = text;

    if (Array.isArray(classList)) {
        div.classList.add(...classList);
    }

    if (typeof onClick === 'function') {
        div.addEventListener('click', (event) => onClick(event));
    }

    return div;
}

export function createHtmlTextAreaProse(id, classList = [], headerText = '', bodyText = '', headerClasses = [], bodyClasses = []) {
    const div = document.createElement('div');
    const headers = headerText ? headerText : [];
    const bodies = bodyText ? bodyText : [];
    let innerTextString = '';
    
    for (let i = 0; i < Math.max(headers.length, bodies.length); i++) {
        const header = headers[i] || '';
        const body = bodies[i] || '';

        if (header) {
            innerTextString += `<span class="${headerClasses.join(' ')}">${header}</span>`;
        }
        if (header && body) {
            innerTextString += '<br/><br/>';
        }
        if (body) {
            innerTextString += `<span class="${bodyClasses.join(' ')}">${body}</span>`;
        }

        if (i < Math.max(headers.length, bodies.length) - 1) {
            innerTextString += '<br/><br/>';
            innerTextString += `<div class="sub-header-seperator" style="width: 100%; height: 10px;"></div>`;
        }
    }

    div.id = id;
    div.innerHTML = innerTextString;

    if (Array.isArray(classList)) {
        div.classList.add(...classList);
    } else if (typeof classList === 'string') {
        div.classList.add(classList);
    }

    return div;
}

export function setupAchievementTooltip() {
    const tooltip = document.createElement('div');
    tooltip.id = 'achievement-tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.padding = '6px 10px';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.background = 'rgba(0, 0, 0, 0.9)';
    tooltip.style.color = 'var(--text-color)';
    tooltip.style.border = '2px solid var(--text-color)';
    tooltip.style.borderRadius = '5px';
    tooltip.style.fontSize = '12px';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.zIndex = '1000';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);
    document.body.appendChild(tooltip);

    const containerWidth = 200;

    document.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('achievement-tile')) {
            const tile = e.target;
            const gridColumnStart= parseInt(window.getComputedStyle(tile).getPropertyValue('grid-column-start'), 10);
            let tooltipContent = getAchievementTooltipDescription(tile.id);
            
            if (tooltipContent) {
                tooltip.innerHTML = tooltipContent;
                tooltip.style.display = 'block';
                if (gridColumnStart > 5) {
                    tooltip.style.left = `${e.pageX - containerWidth + 10}px`;
                } else {
                    tooltip.style.left = `${e.pageX + 10}px`;
                }
                tooltip.style.top = `${e.pageY + 10}px`;
            }
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (tooltip.style.display === 'block') {
            const tile = e.target;
            const gridColumnStart= parseInt(window.getComputedStyle(tile).getPropertyValue('grid-column-start'), 10);

            let tooltipContent = getAchievementTooltipDescription(tile.id);
            if (tooltipContent) {
                tooltip.innerHTML = tooltipContent;
            }

            if (gridColumnStart > 5) {
                tooltip.style.left = `${e.pageX - containerWidth + 10}px`;
            } else {
                tooltip.style.left = `${e.pageX + 10}px`;
            }
            tooltip.style.top = `${e.pageY + 10}px`;
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.classList.contains('achievement-tile')) {
            tooltip.style.display = 'none';
        }
    });
}

export function setupModalButtonTooltips() {
    const tooltip = document.createElement('div');
    tooltip.id = 'modal-button-tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.padding = '6px 10px';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.background = 'rgba(0, 0, 0, 0.9)';
    tooltip.style.color = 'var(--text-color)';
    tooltip.style.border = '2px solid var(--text-color)';
    tooltip.style.borderRadius = '5px';
    tooltip.style.fontSize = '12px';
    tooltip.style.zIndex = '10000000000000000000';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);

    const tooltipTextMap = {
        modalExtraChoice1: modalPlayerLeaderIntroContentText1,
        modalExtraChoice2: modalPlayerLeaderIntroContentText2,
        modalConfirm: modalPlayerLeaderIntroContentText3,
        modalCancel: modalPlayerLeaderIntroContentText4
    };

    modalTooltipHandlers.mouseover = (e) => {
        const target = e.target;
        if (target && tooltipTextMap.hasOwnProperty(target.id)) {
            tooltip.innerHTML = tooltipTextMap[target.id];
            tooltip.style.display = 'block';
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
        }
    };

    modalTooltipHandlers.mousemove = (e) => {
        if (tooltip.style.display === 'block') {
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
        }
    };

    modalTooltipHandlers.mouseout = (e) => {
        if (e.target && tooltipTextMap.hasOwnProperty(e.target.id)) {
            tooltip.style.display = 'none';
        }
    };

    document.addEventListener('mouseover', modalTooltipHandlers.mouseover);
    document.addEventListener('mousemove', modalTooltipHandlers.mousemove);
    document.addEventListener('mouseout', modalTooltipHandlers.mouseout);
}

export function removeModalButtonTooltips() {
    const tooltip = document.getElementById('modal-button-tooltip');
    if (tooltip) {
        tooltip.remove();
    }

    if (modalTooltipHandlers.mouseover) {
        document.removeEventListener('mouseover', modalTooltipHandlers.mouseover);
        document.removeEventListener('mousemove', modalTooltipHandlers.mousemove);
        document.removeEventListener('mouseout', modalTooltipHandlers.mouseout);
        modalTooltipHandlers = {};
    }
}

const attentionRules = [
    {
    selector: '#tab1',
    condition: () => {
        const container = document.getElementById('tab1ContainerGroup');
        return container && container.querySelector('.attention-indicator') !== null;
    }
    },
    {
    selector: '#tab2',
    condition: () => {
        const container = document.getElementById('tab2ContainerGroup');
        return container && container.querySelector('.attention-indicator') !== null;
    }
    },
    {
    selector: '#tab3',
    condition: () => {
        const container = document.getElementById('tab3ContainerGroup');
        return container && container.querySelector('.attention-indicator') !== null;
    }
    },
    {
    selector: '#tab4',
    condition: () => {
        const container = document.getElementById('tab4ContainerGroup');
        return container && container.querySelector('.attention-indicator') !== null;
    }
    },
    {
    selector: '#tab5',
    condition: () => {
        const container = document.getElementById('tab5ContainerGroup');
        return container && container.querySelector('.attention-indicator') !== null;
    }
    },
    {
    selector: '#tab6',
    condition: () => {
        const container = document.getElementById('tab6ContainerGroup');
        return container && container.querySelector('.attention-indicator') !== null;
    }
    },
    {
    selector: '#tab7',
    condition: () => {
        const container = document.getElementById('tab7ContainerGroup');
        return container && container.querySelector('.attention-indicator') !== null;
    }
    },
    {
    selector: '#tab8',
    condition: () => {
        const container = document.getElementById('tab8ContainerGroup');
        return container && container.querySelector('.attention-indicator') !== null;
    }
    }
  ];
  
export function updateAttentionIndicators() {
    attentionRules.forEach(rule => {
        const element = document.querySelector(rule.selector);

        if (rule.condition()) {
            element.innerHTML.includes('???')
                ? removeAttentionIndicator(element)
                : appendAttentionIndicator(element);
        } else {
            removeAttentionIndicator(element);
        }
    });
}

export function appendAttentionIndicator(element) {
    if (!element || !(element instanceof HTMLElement)) return;
    if (!element.querySelector('.attention-indicator')) {
      const icon = document.createElement('span');
      icon.className = 'attention-indicator';
      icon.textContent = ' ⚠️';
      element.appendChild(icon);
    }
  }

export function removeAttentionIndicator(element) {
    const icon = element?.querySelector('.attention-indicator');
    if (icon) {
      icon.remove();
    }
  }
  

export function createHtmlTableAchievementsGrid(id, classList = [], achievementsData = []) {
    const container = document.createElement('div');
    container.id = id;

    container.classList.add(...classList);
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(10, 80px)';
    container.style.gridTemplateRows = 'repeat(5, 80px)';
    container.style.gap = '0px';
    container.style.padding = '10px';
    container.style.justifyContent = 'start';
    container.style.alignItems = 'start';

    achievementsData.forEach(achievement => {
        const tile = document.createElement('div');
        tile.id = achievement.id;
        tile.classList.add('achievement-tile');
        tile.style.gridColumnStart = achievement.gridColumn + 1;
        tile.style.gridRowStart = achievement.gridRow + 1;
        tile.style.width = '70px';
        tile.style.height = '70px';
        tile.style.border = '1px solid var(--text-color)';
        tile.style.boxSizing = 'border-box';
        tile.style.position = 'relative';
        tile.style.opacity = 0.3;

        tile.style.backgroundImage = `url('${getAchievementImageUrl(achievement.id)}')`;
        tile.style.backgroundSize = 'contain';
        tile.style.backgroundRepeat = 'no-repeat';
        tile.style.backgroundPosition = 'center';
        container.appendChild(tile);
    });

    return container;
}

export function createHtmlTableStatistics(id, classList = [], mainHeadings, subHeadings, subBodys, mainHeaderClasses = [], subHeaderClasses = [], subBodyClasses = []) {
    const div = document.createElement('div');
    let innerTextString = '';

    classList.push('center-statistics');

    for (let i = 0; i < mainHeadings.length; i++) {
        const mainHeading = capitaliseString(mainHeadings[i]);

        innerTextString += `<span class="${mainHeaderClasses.join(' ')}">${mainHeading}</span><br/>`;

        innerTextString += `
        <table class="statistics-table">
            <thead>
                ${i === 0 || i === 1 ? '' : `  <!-- Only include the headers for tables after the first and second --> 
                    <tr class="first-row">
                        <td class="left-column"></td>
                        <td class="middle-column">Current Run</td>
                        <td class="right-column">All Time</td>
                    </tr>
                `}
            </thead>
            <tbody>
        `;

        const notationHeaders = ['Cash', 'Hydrogen', 'Helium', 'Carbon', 'Neon', 'Oxygen', 'Sodium', 'Silicon', 'Iron', 'Diesel', 'Glass', 'Concrete', 'Steel', 'Water', 'Titanium', 'Research Points'];

        for (let j = 0; j < subHeadings[i].length; j++) {
            let header = capitaliseString(subHeadings[i][j] || '');
            const body = capitaliseString(subBodys[i][j] || '');
            const isAllTimeHeader = header.endsWith(' ');
            const headerClasses = [...subHeaderClasses];
            const bodyClasses = [...subBodyClasses];

            if (header) {
                if (notationHeaders.includes(header)) {
                    bodyClasses.push('notation');
                }
                header += ':';
            }

            // Apply special rule for the first and second tables (i === 0 or i === 1)
            if (i === 0 || i === 1) {
                innerTextString += `
                    <tr>
                        <td class="left-column"><span class="${headerClasses.join(' ')}">${header}</span></td>
                        <td class="middle-column">
                            <span id="stat_${toCamelCase(header.replace(':', '').trim())}" class="${bodyClasses.join(' ')}">${body}</span>
                        </td>
                        <td class="right-column"></td>
                    </tr>
                `;
            } else {
                innerTextString += `
                    <tr>
                        <td class="left-column"><span class="${headerClasses.join(' ')}">${header}</span></td>
                        <td class="middle-column">
                            ${!isAllTimeHeader ? `<span id="stat_${toCamelCase(header.replace(':', '').trim())}" class="${bodyClasses.join(' ')}">${body}</span>` : ''}
                        </td>
                        <td class="right-column">
                            ${isAllTimeHeader ? `<span id="stat_${toCamelCase(header.replace(':', '').trim())}" class="${bodyClasses.join(' ')}">${body}</span>` : ''}
                        </td>
                    </tr>
                `;
            }
            
        }

        innerTextString += `
                </tbody>
            </table>
            <br/>
        `;
    }

    div.id = id;
    div.innerHTML = innerTextString;

    if (Array.isArray(classList)) {
        div.classList.add(...classList);
    } else if (typeof classList === 'string') {
        div.classList.add(classList);
    }

    return div;
}

export function createTextFieldArea(id, classList = [], placeholder = '', innerTextString) {
    const textArea = document.createElement('textarea');
    
    textArea.id = id;
    textArea.placeholder = placeholder;

    if (innerTextString) {
        textArea.value = innerTextString;
    }

    textArea.classList.add('text-area-height', 'text-area-width', 'text-area-style'); 

    if (Array.isArray(classList)) {
        textArea.classList.add(...classList);
    } else if (typeof classList === 'string') {
        textArea.classList.add(classList);
    }

    return textArea;
}

export function createSvgElement(id, width = "100%", height = "100%", additionalClasses = []) {
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.id = id;
    svgElement.setAttribute("width", width);
    svgElement.setAttribute("height", height);

    if (Array.isArray(additionalClasses)) {
        svgElement.classList.add(...additionalClasses);
    } else if (typeof additionalClasses === "string") {
        svgElement.classList.add(additionalClasses);
    }

    return svgElement;
}

export function selectTheme(theme) {
    const body = document.body;
    body.setAttribute('data-theme', theme);
    setCurrentTheme(theme);
}

export function showWeatherNotification(type) {
    const precipitationType = getStarSystemDataObject('stars', [getCurrentStarSystem(), 'precipitationType']);
    const tech = getTechUnlockedArray();

    if (type === 'rain') {
        const benefits = tech.includes('compounds') && tech.includes(getResourceDataObject('compounds', [precipitationType, 'revealedBy']));
        const hasRockets = tech.includes('rocketComposites');

        if (hasRockets && benefits) {
            showNotification(`Heavy Rain! No launches until it clears, but ${precipitationType} stores benefit!`, 'warning', 3000, 'weather');
        } else if (hasRockets) {
            showNotification('Heavy Rain! No launches until it clears.', 'warning');
        } else if (benefits) {
            showNotification(`Heavy Rain! ${capitaliseString(precipitationType)} stores benefit!`, 'warning', 3000, 'weather');
        } else {
            showNotification('Heavy Rain!', 'warning', 3000, 'weather');
        }
    } else if (type === 'volcano') {
        const hasRockets = tech.includes('rocketComposites');
        const hasSolar = tech.includes('solarPowerGeneration');

        if (hasRockets && hasSolar) {
            showNotification('Volcano Eruption! No launches until it clears, and solar power generation severely affected!', 'error', 3000, 'weather');
        } else if (hasRockets) {
            showNotification('Volcano Eruption! No launches until it clears.', 'error', 3000, 'weather');
        } else if (hasSolar) {
            showNotification('Volcano Eruption! Solar power severely affected!', 'error', 3000, 'weather');
        } else {
            showNotification('Volcano Eruption!', 'warning', 3000, 'weather');
        }
    } else {
        console.error('Unknown weather type:', type);
    }
}

export function showNotification(message, type = 'info', time = 3000, classification = 'default') {
    if (!getNotificationsToggle()) return;

    const queues = getNotificationQueues();
    const status = getNotificationStatus();

    if (!queues[classification]) {
        queues[classification] = [];
        status[classification] = false;
        setNotificationQueues(queues);
        setNotificationStatus(status);
        createNotificationContainer(classification);
    }

    queues[classification].push({ message, type, time });
    setNotificationQueues(queues);

    if (!status[classification]) {
        processNotificationQueue(classification);
    }
}

function createNotificationContainer(classification) {
    const container = document.createElement('div');
    container.className = `notification-container classification-${classification}`;

    document.body.appendChild(container);

    const containers = getNotificationContainers();
    containers[classification] = container;
    setNotificationContainers(containers);

    const order = getClassificationOrder();
    order.push(classification);
    setClassificationOrder(order);

    updateContainerPositions();
}

function updateContainerPositions() {
    const containers = getNotificationContainers();
    const order = getClassificationOrder();

    order.slice(0, MAX_STACKS).forEach((className, index) => {
        const container = containers[className];
        if (container) {
            container.style.right = `${BASE_RIGHT + index * STACK_WIDTH}px`;
        }
    });
}

function processNotificationQueue(classification) {
    if (!getNotificationsToggle()) return;

    const queues = getNotificationQueues();
    const status = getNotificationStatus();

    const queue = queues[classification];
    if (queue?.length > 0) {
        status[classification] = true;
        setNotificationStatus(status);

        const { message, type, time } = queue.shift();
        setNotificationQueues(queues);

        sendNotification(message, type, classification, time);
    } else {
        status[classification] = false;
        setNotificationStatus(status);

        const containers = getNotificationContainers();
        const container = containers[classification];
        if (container) {
            container.remove();
            delete containers[classification];
            setNotificationContainers(containers);
        }

        delete queues[classification];
        setNotificationQueues(queues);

        const order = getClassificationOrder().filter(c => c !== classification);
        setClassificationOrder(order);
        delete status[classification];
        setNotificationStatus(status);
        updateContainerPositions();
    }
}

function sendNotification(message, type, classification, duration) {
    const containers = getNotificationContainers();
    const container = containers[classification];
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `<div class="notification-content">${message}</div>`;

    const existing = container.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    const button = document.createElement('button');
    button.className = 'notification-button';
    button.innerText = 'Clear All';
    button.onclick = () => {
        const queues = getNotificationQueues();
        const containers = getNotificationContainers();
        const status = getNotificationStatus();
        const order = getClassificationOrder();
    
        queues[classification] = [];
        setNotificationQueues(queues);
    
        const container = containers[classification];
        if (container) {
            container.remove();
            delete containers[classification];
            setNotificationContainers(containers);
        }

        delete status[classification];
        setNotificationStatus(status);
    
        const newOrder = order.filter(c => c !== classification);
        setClassificationOrder(newOrder);
    
        updateContainerPositions();
    };

notification.appendChild(button);

    container.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        hideNotification(notification);
        processNotificationQueue(classification);
    }, duration);
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        notification.remove();
    }, 500);
}

function highlightActiveTab(activeTabText) {
    if (activeTabText.trim() === "???") return;

    const tabs = document.querySelectorAll('#tabsContainer .tab');

    tabs.forEach(tab => {
        if (tab.textContent.trim() === activeTabText.trim()) {
            tab.classList.add('selected');
        } else {
            tab.classList.remove('selected');
        }
    });
}

export function disableActivateButton(button, action, activeClass) {
    switch (action) {
        case 'active':
            button.classList.remove('disabled');
            button.classList.add(activeClass);
            break;
        case 'disable':
            button.classList.remove(activeClass);
            button.classList.add('disabled');
            break;
    }
}

export function updateDescriptionRow(rowKey, targetProperty) {
    const optionDescriptions = getOptionDescription(rowKey);

    if (
        optionDescriptions &&
        targetProperty in optionDescriptions &&
        'content1' in optionDescriptions
    ) {
        const temp = optionDescriptions['content1'];
        optionDescriptions['content1'] = optionDescriptions[targetProperty];
        optionDescriptions[targetProperty] = temp;
    } else {
        console.error(`Invalid row key or property: ${rowKey}, ${targetProperty}`);
    }
}

function getStarColorForDistanceFilterButton(distance) {
    const maxDistance = 100;
    const minDistance = 0;
    const normalizedDistance = Math.min(Math.max(distance, minDistance), maxDistance) / maxDistance;

    if (normalizedDistance <= 0) return "rgb(255, 255, 255)";
    if (normalizedDistance <= 0.25) return `rgb(${255}, ${255 - normalizedDistance * 255}, ${255 - normalizedDistance * 255})`;
    if (normalizedDistance <= 0.5) return `rgb(${255}, ${255}, ${0 + (normalizedDistance - 0.25) * 1020})`;
    return `rgb(${255}, ${255 - (normalizedDistance - 0.5) * 510}, ${0})`;
}

function getStarColorForTravel(fuelRequired, starName) {
    const currentAntimatter = getResourceDataObject('antimatter', ['quantity']);
    const canTravel = currentAntimatter >= fuelRequired;
    const themeElement = document.querySelector('[data-theme]') || document.documentElement;

    const computedStyles = getComputedStyle(themeElement);
    const readyTextColor = computedStyles.getPropertyValue('--ready-text').trim();
    const disabledTextColor = computedStyles.getPropertyValue('--disabled-text').trim();

    let color = canTravel ? readyTextColor : disabledTextColor;

    if (starName === getDestinationStar() && getStarShipStatus()[0] === 'orbiting') {
        color = readyTextColor;
    }
    return color;
}

export function getStarDataAndDistancesToAllStarsFromSettledStar(settledStar) {
    const dummyContainer = document.createElement('div');
    const { stars, starDistanceData } = generateStarfield(dummyContainer, NUMBER_OF_STARS, STAR_FIELD_SEED, null, true, settledStar, false);
    return { stars, starDistanceData };
}

export function generateStarfield(starfieldContainer, numberOfStars = 70, seed = 1, mapMode, calculationMode = false, originStarName = null, factoryStarChooserMode = false) {
    const stars = [];
    const starDistanceData = {};
    const minSize = 2;
    const maxSize = 6;
    const containerRect = starfieldContainer.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    const containerLeft = containerRect.left;
    const containerTop = containerRect.top;
    const starNames = getStarNames();
    let currentStar = null;

    for (let i = 0; i < numberOfStars; i++) {
        const name = starNames.length > 0 ? starNames.splice(Math.floor(seededRandom(seed - i * 1.2) * starNames.length), 1)[0] : `Star${i}`;
        const size = getSeededRandomInRange(seed + i, minSize, maxSize);
        const x = getSeededRandomInRange(seed + i + numberOfStars, 0, containerWidth - 30) + containerLeft;
        const y = getSeededRandomInRange(seed + i + numberOfStars * 2, 0, containerHeight) + containerTop;
        const z = getSeededRandomInRange(seed + i + numberOfStars * 3, 10, 100000);
        stars.push({ name, x, y, z, size, width: size * 1.1, height: size * 1.1, left: x, top: y });
    }

    if (calculationMode && originStarName) {
        currentStar = stars.find(star => star.name.toLowerCase() === originStarName.toLowerCase());
    } else {
        currentStar = stars.find(star => star.name === capitaliseString(getCurrentStarSystem()));
    }

    stars.forEach(star => {
        starDistanceData[star.name] = calculate3DDistance(
            currentStar.left + currentStar.width / 2,
            currentStar.top + currentStar.height / 2,
            currentStar.z,
            star.left + star.width / 2,
            star.top + star.height / 2,
            star.z
        );
    });

    if (calculationMode) {
        return { stars, starDistanceData };
    }

    if (factoryStarChooserMode) {
        const destination = getDestinationStar();
        const current = getCurrentStarSystem();
        const settled = getSettledStars();
        const visionDistance = getStarVisionDistance();
        const ancientManuscriptStars = getStarsWithAncientManuscripts();
    
        const filteredStarData = stars
            .filter(star => {
                const name = star.name;
                const distance = starDistanceData[name];
                return (
                    name !== 'Miaplacidus' &&
                    name !== destination &&
                    name !== current &&
                    !ancientManuscriptStars.includes(name) &&
                    !settled.includes(name) &&
                    distance > visionDistance
                );
            })
            .map(star => [
                star.name.toLowerCase(),
                parseFloat(starDistanceData[star.name].toFixed(2))
            ]);
    
        return filteredStarData;
    }    

    stars.forEach(star => {
        const distance = starDistanceData[star.name];
        const isInteresting = distance <= getStarVisionDistance() || star.name === currentStar.name || getSettledStars().includes(star.name.toLowerCase());
        const isFactoryStar = getFactoryStarsArray().includes(star.name.toLowerCase());
        const isHomeStar = star.name === 'Miaplacidus';

        let starElement = document.createElement('div');

        if (isHomeStar) {
            if (getMiaplacidusMilestoneLevel() === 4) {
                starElement.classList.add('star', 'home-star-accessible');
            } else {
                starElement.classList.add('star', 'home-star');
            }
            starElement.id = star.name;
        } else if (isFactoryStar) {
            starElement.classList.add('star', 'factory-star');
            starElement.id = star.name;
        } else {
            starElement.id = isInteresting ? star.name : `noneInterestingStar${star.name}`;
            if (
                isInteresting &&
                getCurrentStarSystem() !== star.name.toLowerCase() &&
                getSettledStars().includes(star.name.toLowerCase())
            ) {
                starElement.id = `settledStar${star.name}`;
            }

            starElement.classList.add(isInteresting ? 'star' : 'star-uninteresting');
            if (starElement.id.includes("settledStar")) {
                starElement.classList.add("settled-star");
            } 

            if (isHomeStar) {
                if (getMiaplacidusMilestoneLevel() === 4) {
                    starElement.classList.add('home-star-accessible');
                } else {
                    starElement.classList.add('home-star');
                }
            }
        }

        if (starElement.id.includes("settledStar")) {
            starElement.classList.add("settled-star");
        }

        if (starElement.id.includes("settledStar")) {
            starElement.setAttribute("titler", `${star.name} (SETTLED)`);
        } else if (starElement.classList.contains("star-uninteresting") || starElement.id === capitaliseString(getCurrentStarSystem())) {
            starElement.setAttribute("titler", `${star.name}`);
        } else if (starElement.classList.contains("factory-star")) {
            starElement.setAttribute("titler", `${star.name} (MEGASTRUCTURE)`);
        } else {
            starElement.setAttribute("titler", `${star.name} (${distance}ly)`);
        }        
        
        if (star.name === currentStar.name || getSettledStars().includes(star.name.toLowerCase())) {
            starElement.style.width = `${star.width * 1.5}px`;
            starElement.style.height = `${star.height * 1.5}px`;
            if (star.name === currentStar.name) {
                starElement.classList.add('current-star');
                starElement.style.width = `${star.width * 4}px`;
                starElement.style.height = `${star.height * 4}px`;
                setCurrentStarObject(currentStar);
            }
        } else if (isInteresting) {
            starElement.style.width = `${star.width * 2}px`;
            starElement.style.height = `${star.height * 2}px`;
            if (!checkIfInterestingStarIsInStarDataAlready(starElement.id.toLowerCase())) {
                generateStarDataAndAddToDataObject(starElement, distance);
            }
            if (mapMode === 'distance') {
                starElement.style.backgroundColor = getStarColorForDistanceFilterButton(distance);
            } else if (mapMode === 'in range') {
                starElement.style.backgroundColor = getStarColorForTravel(getStarSystemDataObject('stars', [star.name.toLowerCase()]).fuel, star.name.toLowerCase());
            }
        } else {
            starElement.style.width = `${star.width / 2}px`;
            starElement.style.height = `${star.height / 2}px`;
            const randomDuration = (Math.random() * 1 + 0.5).toFixed(2);
            starElement.style.animationDuration = `${randomDuration}s`;
            if (mapMode === 'studied' || mapMode === 'in range') {
                starElement.classList.add('invisible');
            } else {
                starElement.classList.remove('invisible');
            }
        }
        
        starElement.style.left = `${star.left}px`;
        starElement.style.top = `${star.top}px`;
    
        starElement.addEventListener('click', () => {
            if (!getStarShipTravelling()) {
                if (isInteresting) {
                    if (isHomeStar && getMiaplacidusMilestoneLevel() !== 4) {
                        return;
                    }
                    const starData = getStarSystemDataObject('stars');
                    if (star.name === currentStar.name) {
                        return;
                    }
                    setFromStarObject(currentStar);
                    setToStarObject(star);
                    drawStarConnectionDrawings(currentStar, star, true);
                    createStarDestinationRow(starData[star.name.toLowerCase()] || star.name, true);
                    if (starData[star.name.toLowerCase()]) {
                        setDestinationStar(starData[star.name.toLowerCase()].name);
                    }
                } else if (isHomeStar) {
                    if (getMiaplacidusMilestoneLevel() === 4) {
                        drawStarConnectionDrawings(currentStar, star, false);
                        createStarDestinationRow(star.name, false);
                    } else {
                        return;
                    }
                } else {
                    drawStarConnectionDrawings(currentStar, star, false);
                    createStarDestinationRow(star.name, false);
                }
            }
        });
        
        if (
            getFactoryStarsArray().includes(star.name.toLowerCase()) &&
            getStarsWithAncientManuscripts().some(entry => entry[1] === star.name.toLowerCase() && entry[3] === false)
        ) {
            return;
        }        
        
        starfieldContainer.appendChild(starElement);
    });
}

export function createStarDestinationRow(starData, isInteresting) {
    const starName = typeof starData === "object" ? starData.name.toLowerCase() : starData.toLowerCase();

    if (getSettledStars().includes(starName)) {
        return;
    }

    const elementRow = document.getElementById('descriptionContentTab5');
    if (!elementRow) return;
    const currentAntimatter = getResourceDataObject('antimatter', ['quantity']);
    const themeElement = document.querySelector('[data-theme]');
    if (!themeElement) return;

    const themeStyles = getComputedStyle(themeElement);
    const readyTextColor = themeStyles.getPropertyValue('--ready-text').trim();
    const disabledTextColor = themeStyles.getPropertyValue('--disabled-text').trim();

    const canTravel = isInteresting ? currentAntimatter >= starData.fuel : false;
    const textColor = canTravel ? readyTextColor : disabledTextColor;

    elementRow.innerHTML = `
        <div class="option-row-main d-flex no-vertical-padding">
            <div id="starDestinationName">Name: ${isInteresting ? capitaliseWordsWithRomanNumerals(starData.name) : starData}</div>
            <div id="starDestinationDistance" class="travel-starship-info">Distance: <span style="color: ${textColor};">${isInteresting ? `${starData.distance.toFixed(2)}ly` : '???'}</span></div>
            <div id="starDestinationFuel" class="travel-starship-info">Fuel: <span style="color: ${textColor};">${isInteresting ? `${starData.fuel} AM` : '???'}</span></div>
            <div id="starDestinationButton"></div>
            <div id="starDestinationDescription" class="green-ready-text invisible">Travelling...</div>
        </div>
    `;

    const buttonContainer = document.getElementById('starDestinationButton');
    const button = createButton(`Travel`, ['option-button', 'red-disabled-text', 'travel-starship-button'], () => {
        let content = launchStarShipWarningText;
        if (getFactoryStarsArray().includes(getDestinationStar())) {
            content += `<br><br><span class="warning-orange-text">WARNING: MegaStructure Systems are Extremely difficult to conquer!<br>Only go if you have high Production to rebuild broken Fleets multiple times!</span>`;
        } else if (getHomeStarName() === getDestinationStar()) {
            content += `<br><br><span class="red-disabled-text">WARNING: Flying to Miaplacidus is suicidal unless you are VERY strong with<br>VERY high production capabilities to rebuild broken Fleets multiple times!</span>`;
        }

        content += `<br><br><span class="${
            (() => {
                const s = Math.floor(calculateStarTravelDuration(getDestinationStar()) / 1000);
                return s >= 10800 ? 'red-disabled-text' : s >= 3600 ? 'warning-orange-text' : 'green-ready-text';
            })()
        }">Real Time Flight Time to ${capitaliseWordsWithRomanNumerals(getDestinationStar())} approximately: ${
            (() => {
                const s = Math.floor(calculateStarTravelDuration(getDestinationStar()) / 1000);
                return s >= 3600
                    ? `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m ${s % 60}s`
                    : s >= 60
                    ? `${Math.floor(s / 60)}m ${s % 60}s`
                    : `${s}s`;
            })()
        }</span>`;

        callPopupModal(
            launchStarShipWarningHeader, 
            content, 
            true, 
            true, 
            false, 
            false, 
            function() {  
                const destinationStar = getDestinationStar();  
                const starData = getStarSystemDataObject('stars', [destinationStar]);  
                showNotification(`Travelling to ${capitaliseWordsWithRomanNumerals(starData.name)}`, 'info', 3000, 'special');
                startTravelToDestinationStarTimer([0, 'buttonClick'], false);
                spendAntimatterOnFuelForStarShip(starData.fuel);
                spaceTravelButtonHideAndShowDescription();
                addToResourceAllTimeStat(1, 'starShipLaunched');
                addToResourceAllTimeStat(starData.ascendencyPoints, 'apAnticipated');
                setAchievementFlagArray('launchStarship', 'add');
                showHideModal();
            },
            function() {  
                showHideModal();
            },
            null,  
            null,
            'LAUNCH',
            'CANCEL',
            null,
            null,
            false
        );
    }, 'upgradeCheck', '', 'autoBuyer', 'travelToStar', 'time', true, null, 'starShipPurchase');
    buttonContainer.appendChild(button);
}

export async function callPopupModal(
  header,
  content,
  showConfirm,
  showCancel,
  showExtra1,
  showExtra2,
  onConfirm,
  onCancel,
  onExtra1,
  onExtra2,
  confirmLabel,
  cancelLabel,
  extra1Label,
  extra2Label,
  setupToolTips = false
) {
    await waitForModalToHide();

    if (setupToolTips) {
        setupModalButtonTooltips();
    }

    const modalContainer = document.getElementById('modal');
    const overlay = document.getElementById('overlay');

    const confirmButton = document.getElementById('modalConfirm');
    const cancelButton = document.getElementById('modalCancel');
    const extra1Button = document.getElementById('modalExtraChoice1');
    const extra2Button = document.getElementById('modalExtraChoice2');

    confirmButton.onclick = null;
    cancelButton.onclick = null;
    extra1Button.onclick = null;
    extra2Button.onclick = null;

    populateModal(header, content);

    if (showConfirm) {
        confirmButton.classList.remove('invisible');
        confirmButton.innerText = confirmLabel;
        confirmButton.onclick = () => {
            onConfirm?.();
        };
    } else {
        confirmButton.classList.add('invisible');
    }

    if (showCancel) {
        cancelButton.classList.remove('invisible');
        cancelButton.innerText = cancelLabel;
        cancelButton.onclick = () => {
            onCancel?.();
        };
    } else {
        cancelButton.classList.add('invisible');
    }

    if (showExtra1) {
        extra1Button.classList.remove('invisible');
        extra1Button.innerText = extra1Label;
        extra1Button.onclick = () => {
            onExtra1?.();
        };
    } else {
        extra1Button.classList.add('invisible');
    }

    if (showExtra2) {
        extra2Button.classList.remove('invisible');
        extra2Button.innerText = extra2Label;
        extra2Button.onclick = () => {
            onExtra2?.();
        };
    } else {
        extra2Button.classList.add('invisible');
    }

    modalContainer.style.display = 'flex';
    overlay.style.display = 'flex';
}

export function showEnterWarModeModal(reason) {
    if (getEnemyFleetsAdjustedForDiplomacy() && getResourceDataObject('fleets', ['attackPower']) <= 0) {
        return;
    }

    return new Promise((resolve) => {
        const canBackout = reason === "chooseWar";

        const modalContainer = getElements().modalContainer;
        const overlay = getElements().overlay;
        const enterWarModeConfirmButton = document.getElementById('modalConfirm');
        const enterWarModeCancelButton = document.getElementById('modalCancel');
        enterWarModeConfirmButton.innerText = 'CONFIRM';
        enterWarModeCancelButton.innerText = 'CANCEL';

        enterWarModeConfirmButton.classList.remove('invisible');
        enterWarModeCancelButton.classList.add('invisible');

        const starData = getStarSystemDataObject('stars', ['destinationStar']);

        const headerText = enterWarModeModalHeader;
        let content;
        let latestDifferenceInImpression = starData.latestDifferenceInImpression;
        let finalDifference = 0;
        let percentageChange = 0;

        if (reason === 'patience' || reason === 'receptive' || reason === 'reserved' || reason === 'neutral' || reason === 'rebuff') {
            if (reason === 'patience' && !getEnemyFleetsAdjustedForDiplomacy()) {
                finalDifference = starData.currentImpression - starData.initialImpression; 
                adjustEnemyFleetBasedOnDiplomacy(starData, finalDifference);
                setEnemyFleetPower();
                setEnemyFleetsAdjustedForDiplomacy(true);
            }

            if (latestDifferenceInImpression !== 0) {
                percentageChange = latestDifferenceInImpression;
            }
        }

        let spanClass = latestDifferenceInImpression < 0 ? 'red-disabled-text' : (latestDifferenceInImpression > 0 ? 'green-ready-text' : '');

        if (canBackout) {
            enterWarModeCancelButton.classList.remove('invisible');
            content = enterwarModeModalBackOutText;
        } else {
            switch (reason) {
                case "patience":
                    spanClass = finalDifference < 0 ? 'red-disabled-text' : (finalDifference > 0 ? 'green-ready-text' : '');
                    content = enterWarModeModalPatience + "<br>";
                    const spanText = finalDifference === 0
                    ? "No change in overall impression - Fleets unaffected."
                    : (finalDifference < 0
                        ? `Overall Impression Worsened - Enemy Fleets bolstered by ${Math.abs(finalDifference / 3).toFixed(2)}%`
                        : `Overall Impression Improved - Enemy Fleets reduced by ${Math.abs(finalDifference / 3).toFixed(2)}%`);                

                    content += `<span class="${spanClass}">${spanText}</span>`;
                    setWarUI(true);
                    break;
                case "insulted":
                    content = enterWarModeInsultedText + "<br><span class='red-disabled-text'>Enemy Defense Bolstered by 10%</span>";
                    break;
                case "scared":
                    content = enterWarModeScaredText + "<br><span class='green-ready-text'>Half of the enemy fleets have deserted through fear!</span>";
                    break;
                case "surrender":
                    content = enterWarModeSurrenderText + "<br><span class='green-ready-text'>Victory!</span>";
                    break;
                case "notVassalized":
                    content = enterWarModeNotVassalizedText;
                    break;
                case "noScanner":
                    content = enterwarModeModalNoBackOutText + "<br><span class='red-disabled-text'>Attacking Blind!</span>";
                    break;
                case "laugh":
                case "rebuff":
                    content = enterWarModeModalLaughAtProspect + "<br><span class='red-disabled-text'>Enemy Impression of you -10%</span>";
                    break;
                case "laughWar":
                    content = enterWarModeModalLaughAndEnterWar + "<br><span class='red-disabled-text'>Immediate Closure of Diplomacy!</span>";
                    break; 
                case "reserved":
                    content = enterWarModeModalReserved + (latestDifferenceInImpression !== 0 ? "<br><span class='" + spanClass + "'>Impression change: " + (latestDifferenceInImpression < 0 ? "-" : "") + Math.abs(percentageChange).toFixed(2) + "%</span>" : "");
                    break;
                case "neutral":
                    content = enterWarModeModalNeutral + (latestDifferenceInImpression !== 0 ? "<br><span class='" + spanClass + "'>Impression change: " + (latestDifferenceInImpression < 0 ? "-" : "") + Math.abs(percentageChange).toFixed(2) + "%</span>" : "");
                    break;
                case "receptive":
                    content = enterWarModeModalImproveToReceptive + (latestDifferenceInImpression !== 0 ? "<br><span class='" + spanClass + "'>Impression change: " + (latestDifferenceInImpression < 0 ? "-" : "") + Math.abs(percentageChange).toFixed(2) + "%</span>" : "");
                    break;
            }
        }

        populateModal(headerText, content);

        modalContainer.style.display = 'flex';
        overlay.style.display = 'flex';

        enterWarModeConfirmButton.onclick = function () {
            if (reason === 'surrender') {
                settleSystemAfterBattle('surrender');
                showHideModal();
                resolve();
                return;
            }
            
            if (reason !== 'laugh' && reason !== 'reserved' && reason !== 'neutral' && reason !== 'receptive' && reason !== 'rebuff') {
                setWarUI(true);
            }

            showHideModal();
            resolve();
        };

        enterWarModeCancelButton.onclick = function () {
            showHideModal();
            resolve();
        };
    });
}

export async function triggerFeedBackModal(feedback) {
    const modalContainer = getElements().modalContainer;
    const overlay = getElements().overlay;
    const sendFeedBackConfirmButton = document.getElementById('modalConfirm');
    const sendFeedBackCancelButton = document.getElementById('modalCancel');
    sendFeedBackConfirmButton.innerText = 'SEND FEEDBACK';
    sendFeedBackCancelButton.innerText = 'NO THANKS';
    
    let headerText = modalFeedbackHeaderText;
    let content;

    if (feedback === 'good') {
        content = modalFeedbackContentTextGood + `<br><br><textarea id="feedbackArea" class="text-area-style text-area-width text-area-height" placeholder="Leave your thoughts here..."></textarea>`;
    } else {
        content = modalFeedbackContentTextBad + `<br><br><textarea id="feedbackArea" class="text-area-style text-area-width text-area-height" placeholder="Leave your thoughts here..."></textarea>`;
    }

    sendFeedBackConfirmButton.classList.remove('invisible');
    sendFeedBackCancelButton.classList.remove('invisible');

    populateModal(headerText, content);

    modalContainer.style.display = 'flex';
    overlay.style.display = 'flex';

    const firstConfirmClickHandler = function () {
        setFeedbackValueAndSaveGame('accepted', document.getElementById('feedbackArea').value);
        headerText = modalFeedbackThanksHeaderText;
        content = modalFeedbackContentThanks;
        sendFeedBackConfirmButton.innerText = 'OK';
        sendFeedBackCancelButton.classList.add('invisible');
        populateModal(headerText, content);

        sendFeedBackConfirmButton.onclick = function () {
            showHideModal();
        };
    };

    sendFeedBackConfirmButton.onclick = firstConfirmClickHandler;

    sendFeedBackCancelButton.onclick = function () {
        setFeedbackValueAndSaveGame('refused', document.getElementById('feedbackArea').value);
        showHideModal();
    };
}

export async function showBattlePopup(won, apGain = 0) {
    return new Promise((resolve) => {
        const modalContainer = getElements().modalContainer;
        const overlay = getElements().overlay;
        const battleOutcomeConfirmButton = document.getElementById('modalConfirm');
        const battleOutcomeCancelButton = document.getElementById('modalCancel');
        battleOutcomeConfirmButton.innerText = 'CONFIRM';

        let headerText = modalBattleHeaderText;
        let content = won ? modalBattleWonText.replace(' X ', ` ${apGain} `) : modalBattleLostText;

        if (won) {
            if (won !== 'megastructure') {
                content += `<br>- You have conquered the -<span class="green-ready-text">${capitaliseWordsWithRomanNumerals(getDestinationStar())}</span> System!`;
            } else {
                content += `<br>- You have defeated the Mechanized army and conquered the <span class="factory-star-text">${capitaliseWordsWithRomanNumerals(getDestinationStar())}</span> System!<br>You will be able to conduct investigative research on how to harness its power on your next run!<br><br><span class="green-ready-text">Prepare for Glory!</span>`;
            }

            const extraSystems = getAdditionalSystemsToSettleThisRun();
            if (Array.isArray(extraSystems) && extraSystems.length > 0) {
                extraSystems.forEach(([name, distance]) => {
                    const formattedDistance = distance.toFixed(1);
                    content += `<br>- Leaders ${formattedDistance}ly away in the <span class="green-ready-text">${name}</span> System<br>have also heard of your greatness and have ceded their System!`;
                });
            }
        }

        if (won === 'noSentientLife') {
            headerText = modalBattleNoSentientLifeHeader;
            content = modalBattleNoSentientLifeText.replace(' X ', ` ${apGain} `);
            content += `<br>- You have settled the <span class="green-ready-text">${capitaliseWordsWithRomanNumerals(getDestinationStar())}</span> System!`;
        }

        battleOutcomeConfirmButton.classList.remove('invisible');
        battleOutcomeCancelButton.classList.add('invisible');

        populateModal(headerText, content);

        modalContainer.style.display = 'flex';
        overlay.style.display = 'flex';

        battleOutcomeConfirmButton.onclick = function () {
            showHideModal();
            resolve();
        };
    });
}

function waitForModalToHide() {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            const modalContainer = getElements().modalContainer;
            if (modalContainer && modalContainer.style.display === 'none') {
                clearInterval(interval);
                resolve();
            }
        }, 100);
    });
}

function setFeedbackValueAndSaveGame(wanted, text) {
    setFeedbackCanBeRequested(false);
    setFeedbackContent([wanted, text]);

    saveGame('feedbackSave');
    const saveData = getSaveData();
    if (saveData) {
        // saveGameToCloud(saveData, 'manualExportCloud');
    }
    setSaveData(null);
}

export function setWarUI(setWarState) {
    const starData = getStarSystemDataObject('stars', ['destinationStar']);
    const playerFleetPower = getResourceDataObject('fleets', ['attackPower']);

    if (playerFleetPower === 0) {
        return;
    }

    if (setWarState) {
        setDiplomacyPossible(false);
        setWarMode(true);
    }

    const optionContentElement = document.getElementById(`optionContentTab5`);
    const diplomacyImpressionBar = document.getElementById('diplomacyImpressionBar');
    const diplomacyOptionsRow = document.getElementById('diplomacyOptionsRow');
    const receptionStatusRowDescription = document.getElementById('receptionStatusRowDescription');

    if (!getWarMode()) {
        receptionStatusRowDescription.innerHTML = "";
    }

    createBattleCanvas(optionContentElement, starData);

    if (diplomacyOptionsRow) {
        diplomacyOptionsRow.classList.add('invisible');
    }

    if (diplomacyImpressionBar) {
        diplomacyImpressionBar.classList.add('invisible');
    } 
}

function adjustEnemyFleetBasedOnDiplomacy(starData, finalDifference) {
    const percentageFactor = Math.floor(finalDifference / 3);

    if (finalDifference < 0) {
        starData.enemyFleets.air += Math.ceil(starData.enemyFleets.air * (percentageFactor / 100));
        starData.enemyFleets.land += Math.ceil(starData.enemyFleets.land * (percentageFactor / 100));
        starData.enemyFleets.sea += Math.ceil(starData.enemyFleets.sea * (percentageFactor / 100));
    } else if (finalDifference > 0) {
        starData.enemyFleets.air -= Math.floor(starData.enemyFleets.air * (Math.abs(percentageFactor) / 100));
        starData.enemyFleets.land -= Math.floor(starData.enemyFleets.land * (Math.abs(percentageFactor) / 100));
        starData.enemyFleets.sea -= Math.floor(starData.enemyFleets.sea * (Math.abs(percentageFactor) / 100));
    }

    setStarSystemDataObject(starData.enemyFleets.air, 'stars', ['destinationStar', 'enemyFleets', 'air']);
    setStarSystemDataObject(starData.enemyFleets.land, 'stars', ['destinationStar', 'enemyFleets', 'land']);
    setStarSystemDataObject(starData.enemyFleets.sea, 'stars', ['destinationStar', 'enemyFleets', 'sea']);

    return finalDifference;
}

function spendAntimatterOnFuelForStarShip(fuelNeeded) {
    const antimatterLeft = Math.max(0, Math.floor(getResourceDataObject('antimatter', ['quantity']) - fuelNeeded));
    setResourceDataObject(antimatterLeft, 'antimatter', ['quantity']);
}

function calculate3DDistance(x1, y1, z1, x2, y2, z2) {
    return parseFloat((Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2) / 1000).toFixed(2));
}

function getSeededRandomInRange(seed, min, max) {
    return seededRandom(seed) * (max - min) + min;
}

function seededRandom(seed) {
    let x = Math.sin(seed++) * STAR_SEED;
    return x - Math.floor(x);
}

function checkIfInterestingStarIsInStarDataAlready(star) {
    const starData = getStarSystemDataObject('stars');
    return star in starData;
}

export function removeStarConnectionTooltip() {
    const starConnectionLineElement = document.getElementById('star-connection-line');
    const starConnectionLabelElement = document.getElementById('star-connection-label');
    const starConnectionArrowHeadElement = document.getElementById('arrowheadStarship');
    if (starConnectionLineElement) {
        starConnectionLineElement.remove();
    }
    if (starConnectionLabelElement) {
        starConnectionLabelElement.remove();
    }
    if (starConnectionArrowHeadElement) {
        starConnectionArrowHeadElement.remove();
    }
}

export function drawStarConnectionDrawings(fromStar, toStar, isInteresting) {
    if (toStar.name) {
        if (getSettledStars().includes(toStar.name.toLowerCase())) {
            return;
        }
    } else {
        if (getSettledStars().includes(toStar.toLowerCase())) {
            return;
        }
    }

    removeStarConnectionTooltip();

    let lineElement = null;
    let labelElement = null;
    let arrowHead = null;

    if (isInteresting !== 'orbiting') {
        let toStarData;
        let fuelNeeded = 0;
        let apGranted = 0;
    
        if (isInteresting === 'travelling') {
            fromStar = getFromStarObject();
            toStarData = getStarSystemDataObject('stars', [toStar.toLowerCase()]);
            toStar = getToStarObject();
            fuelNeeded = toStarData.fuel;
            apGranted = toStarData.ascendencyPoints;  
        } else if (isInteresting) {
            toStarData = getStarSystemDataObject('stars', [toStar.name.toLowerCase()]);
            fuelNeeded = toStarData.fuel;
            apGranted = toStarData.ascendencyPoints;  
        }
    
        const currentAntimatter = getResourceDataObject('antimatter', ['quantity']);
        const canTravel = isInteresting && fuelNeeded <= currentAntimatter;
    
        const themeElement = document.querySelector('[data-theme]') || document.documentElement;
        const themeStyles = getComputedStyle(themeElement);
        let lineColor = canTravel ? themeStyles.getPropertyValue('--ready-text') : themeStyles.getPropertyValue('--disabled-text');
        const labelColor = lineColor;
    
        const fromX = fromStar.left + fromStar.width * 2;
        const fromY = fromStar.top + fromStar.height * 2;
        const toX = toStar.left + toStar.width;
        const toY = toStar.top + toStar.height;
    
        const distance = Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2);
        const angle = Math.atan2(toY - fromY, toX - fromX) * (180 / Math.PI);
    
        lineElement = document.createElement('div');
        lineElement.id = 'star-connection-line';
        lineElement.classList.add('star-connection-line');
        lineElement.style.width = `${distance}px`;
        lineElement.style.transform = `rotate(${angle}deg)`;
        lineElement.style.left = `${fromX}px`;
        lineElement.style.top = `${fromY}px`;
    
        if (getStarShipTravelling()) {
            lineColor = themeStyles.getPropertyValue('--text-color');
            lineElement.style.borderTop = `1px dashed ${lineColor}`;
    
            lineElement.style.maskImage = `linear-gradient(to right, 
                transparent 14px, 
                black 14px, 
                black calc(100% - 10px), 
                transparent calc(100% - 10px)
            )`;
        } else {
            lineElement.style.background = `linear-gradient(to right, 
                transparent 14px, 
                ${lineColor} 14px, 
                ${lineColor} calc(100% - 10px), 
                transparent calc(100% - 10px)
            )`;
        }
    
        if (!getStarShipTravelling()) {
            labelElement = document.createElement('div');
            labelElement.id = 'star-connection-label';
            labelElement.classList.add('star-connection-label');
            labelElement.innerHTML = isInteresting 
                ? `Antimatter: ${fuelNeeded}<br>AP: ${apGranted}` 
                : `??? <br> ???`;
            labelElement.style.color = labelColor;
            labelElement.style.textAlign = 'center';
            labelElement.style.border = `1px dashed ${labelColor}`;
            labelElement.style.borderRadius = '10px';
        
            const centerX = (fromX + toX) / 2;
            const centerY = (fromY + toY) / 2;
            labelElement.style.left = `${centerX}px`;
            labelElement.style.top = `${centerY}px`;
        } else {
            arrowHead = drawStarShipArrowhead(fromStar, toStar, isInteresting, null);
        }
    }

    let orbitCircle;

    const tooltipLayer = document.getElementById('tooltipLayer') || document.body;

    if (getStarShipStatus()[0] === 'orbiting' && getCurrentTab()[1].includes('Interstellar') && getCurrentOptionPane() === 'star map') {
        orbitCircle = drawOrbitCircle(getToStarObject());
    }

    if (lineElement) {
        tooltipLayer.appendChild(lineElement);
    }
    if (labelElement) {
        tooltipLayer.appendChild(labelElement);
    }
    if (arrowHead) {
        tooltipLayer.appendChild(arrowHead);
    }
    if (orbitCircle) {
        tooltipLayer.appendChild(orbitCircle);
        arrowHead = drawStarShipArrowhead(getFromStarObject(), getToStarObject(), isInteresting, orbitCircle);
        tooltipLayer.appendChild(arrowHead);
    }
}

export function drawOrbitCircle(toStar) {
    removeOrbitCircle();

    const themeElement = document.querySelector('[data-theme]') || document.documentElement;
    const themeStyles = getComputedStyle(themeElement);
    const borderColor = themeStyles.getPropertyValue('--text-color');

    const orbitCircle = document.createElement('div');
    orbitCircle.id = 'orbit-circle';
    orbitCircle.classList.add('orbit-circle');
    orbitCircle.style.position = 'absolute';
    orbitCircle.style.border = `2px dotted ${borderColor}`;
    orbitCircle.style.borderRadius = '50%';
    orbitCircle.style.background = 'transparent';

    const starElement = document.getElementById(toStar.name);
    if (!starElement) return null;

    const starX = starElement.offsetLeft;
    const starY = starElement.offsetTop;
    const starSize = starElement.offsetWidth;
    const orbitSize = starSize * 3;

    orbitCircle.style.width = `${orbitSize}px`;
    orbitCircle.style.height = `${orbitSize}px`;

    const orbitCenterX = starX + starSize / 2;
    const orbitCenterY = starY + starSize / 2;

    orbitCircle.style.left = `${orbitCenterX - orbitSize / 2}px`;
    orbitCircle.style.top = `${orbitCenterY - orbitSize / 2}px`;

    return orbitCircle;
}

export function drawStarShipArrowhead(fromStar, toStar, isInteresting, orbitCircle) {
    document.querySelectorAll('.arrowhead-starship').forEach(arrow => arrow.remove());
    const arrowHead = document.createElement('div');
    arrowHead.id = 'arrowheadStarship';
    arrowHead.classList.add('arrowhead-starship');

    const fromX = fromStar.left + fromStar.width * 2;
    const fromY = fromStar.top + fromStar.height * 2;
    const toX = toStar.left + toStar.width;
    const toY = toStar.top + toStar.height;

    const angle = Math.atan2(toY - fromY, toX - fromX) * (180 / Math.PI);

    if ((isInteresting === 'orbiting' || isInteresting === 'readyForTravel') && orbitCircle) {
        const orbitX = orbitCircle.offsetLeft;
        const orbitY = orbitCircle.offsetTop;
        const orbitRadius = orbitCircle.offsetWidth / 2;

        const centerX = orbitX + orbitRadius;
        const centerY = orbitY + orbitRadius;
        const angleDeg = 45;
        const angleRad = (angleDeg * Math.PI) / 180;

        const arrowX = centerX + orbitRadius * Math.cos(angleRad);
        const arrowY = centerY + orbitRadius * Math.sin(angleRad);

        const tangentAngleDeg = angleDeg + 90;
        const arrowSize = 12;

        arrowHead.style.left = `${arrowX - arrowSize / 2}px`;
        arrowHead.style.top = `${arrowY - arrowSize / 2}px`;
        arrowHead.style.transform = `rotate(${tangentAngleDeg}deg)`;
    } else {
        let arrowPosition = getStarShipArrowPosition();
        arrowHead.style.transform = `rotate(${angle + 90}deg)`;
        
        const arrowSize = 12;
        const halfBase = 8;
        
        const arrowX = fromX + (toX - fromX) * arrowPosition;
        const arrowY = fromY + (toY - fromY) * arrowPosition;

        const tipOffsetX = (arrowSize / 2) * Math.cos(angle * (Math.PI / 180));
        const tipOffsetY = (arrowSize / 2) * Math.sin(angle * (Math.PI / 180));

        arrowHead.style.left = `${arrowX - tipOffsetX - halfBase}px`;
        arrowHead.style.top = `${arrowY - tipOffsetY - (arrowSize / 2)}px`; 
    }

    return arrowHead;
}

export function removeOrbitCircle() {
    const existingOrbitCircle = document.getElementById('orbit-circle');
    if (existingOrbitCircle) {
        existingOrbitCircle.remove();
    }
}

export function sortTechRows(now) {
    if (now) {
        setTechRenderCounter(READY_TO_SORT + NOW);
    } else {
        setTechRenderCounter(READY_TO_SORT);
    }
    setTechRenderChange(true);
}

export function showHideModal() {
    if (getElements().modalContainer.style.display === 'flex') {
        getElements().modalContainer.style.display = 'none';
        getElements().overlay.style.display = 'none';
    } else {
        getElements().modalContainer.style.display = 'flex';
        getElements().overlay.style.display = 'flex';
    }
}

function populateModal(headerText, content) {
    const modalTitle = getElements().modalHeader;
    modalTitle.textContent = headerText;

    const modalContent = getElements().modalContent;
    modalContent.innerHTML = content;
}

async function getUserSaveName() {
    return new Promise((resolve) => {
        const saveNameButton = document.getElementById('modalConfirm');
        const saveNameField = document.getElementById('pioneerCodeName');
        saveNameButton.classList.remove('invisible');
        saveNameButton.innerText = 'CONFIRM';

        const handleSaveNameClick = () => {
            const userName = saveNameField.value.trim();
            if (userName) {
                setSaveName(userName);
                localStorage.setItem('saveName', getSaveName());
                saveNameButton.innerText = 'START';
                showHideModal();
                // loadGameFromCloud();
                saveGame('initialise');
                saveNameButton.removeEventListener('click', handleSaveNameClick); // Remove handler after successful input
                resolve();
            } else {
                alert("Please enter a valid code name!");
            }
        };

        saveNameButton.addEventListener('click', handleSaveNameClick);
    });
}

export function getTimeInStatCell() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const timeZoneMap = {
        "GMT": "GMT", // Greenwich Mean Time
        "GMT+1": "CET", // Central European Time
        "GMT+2": "EET", // Eastern European Time
        "GMT+3": "MSK", // Moscow Standard Time
        "GMT+4": "GST", // Gulf Standard Time
        "GMT+5": "PKT", // Pakistan Standard Time
        "GMT+5:30": "IST", // Indian Standard Time
        "GMT+6": "BST", // Bangladesh Standard Time
        "GMT+7": "ICT", // Indochina Time
        "GMT+8": "CST", // China Standard Time
        "GMT+9": "JST", // Japan Standard Time
        "GMT+10": "AEST", // Australian Eastern Standard Time
        "GMT+11": "SBT", // Solomon Islands Time
        "GMT+12": "NZST", // New Zealand Standard Time
        "GMT-1": "AZOT", // Azores Time
        "GMT-2": "GST", // South Georgia Time
        "GMT-3": "BRT", // Brasília Time
        "GMT-4": "AST", // Atlantic Standard Time
        "GMT-5": "EST", // Eastern Standard Time
        "GMT-6": "CST", // Central Standard Time
        "GMT-7": "MST", // Mountain Standard Time
        "GMT-8": "PST", // Pacific Standard Time
        "GMT-9": "AKST", // Alaska Standard Time
        "GMT-10": "HST", // Hawaii Standard Time
        "GMT-11": "NUT", // Niue Time
        "GMT-12": "AoE", // Anywhere on Earth
    };

    const rawTimeZone = Intl.DateTimeFormat('en-US', { timeZoneName: 'short' })
        .formatToParts(now)
        .find(part => part.type === 'timeZoneName').value;

    const timeZone = timeZoneMap[rawTimeZone] || rawTimeZone;

    const timeString = `${hours}:${minutes} ${timeZone}`;

    const statElement = document.getElementById('stat8');
    if (statElement) {
        statElement.textContent = timeString;
    }
}

function drawStackedBarChart(canvasId, generationValues, consumptionValues, solarPlantMaxPurchasedRate) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');

    const powerPlant1Status = getBuildingTypeOnOff('powerPlant1');
    const powerPlant2Status = getBuildingTypeOnOff('powerPlant2');
    const powerPlant3Status = getBuildingTypeOnOff('powerPlant3');

    canvas.height = 1000;

    const height = canvas.height - 80;
    const width = canvas.width;

    const axisPadding = 50;
    const maxBarHeight = height - axisPadding;

    let maxValue;

    if (powerPlant2Status) {
        const difference = solarPlantMaxPurchasedRate - generationValues[1];

        const adjustedGenerationValues = [...generationValues];
        if (difference > 0) {
            adjustedGenerationValues[1] = adjustedGenerationValues[1] + difference;
        }

        maxValue = Math.max(
            ...adjustedGenerationValues,
            ...consumptionValues,
            adjustedGenerationValues.reduce((a, b) => a + b, 0),
            consumptionValues.reduce((a, b) => a + b, 0)
        );
    } else {
        maxValue = Math.max(
            ...generationValues,
            ...consumptionValues,
            generationValues.reduce((a, b) => a + b, 0),
            consumptionValues.reduce((a, b) => a + b, 0)
        );
    }

    const textColor = getComputedStyle(canvas).getPropertyValue('--text-color-hex').trim();
    const bgColor = getComputedStyle(canvas).getPropertyValue('--bg-color').trim();

    ctx.clearRect(0, 0, width, height);

    const powerPlantStatus = [powerPlant1Status, powerPlant2Status, powerPlant3Status];
    const generationData = generationValues.map((value, index) => ({
        value,
        status: powerPlantStatus[index],
        originalIndex: index
    }));

    generationData.sort((a, b) => {
        if (a.status === b.status) {
            return a.originalIndex - b.originalIndex;
        }
        return a.status ? -1 : 1;
    });

    const sortedGenerationValues = generationData.map(data => data.value);
    const sortedGenerationStatuses = generationData.map(data => data.status);

    const barWidth = width * 0.3;
    const gap = 10;

    const generationColors = getComputedStyle(canvas).getPropertyValue('--generation-colors').trim().split(',');
    const consumptionColors = getComputedStyle(canvas).getPropertyValue('--consumption-colors').trim().split(',');

    function drawBar(x, values, colors, status, powerOn, barType, solarMaxPurchasedRate) {
        const textColor = getComputedStyle(canvas).getPropertyValue('--text-color').trim();
        let currentY = height - 11;

        values.forEach((value, index) => {
            const barHeight = (value / maxValue) * maxBarHeight;

            if (barType === 'consumption' && !powerOn) {
                ctx.fillStyle = bgColor;
                ctx.fillRect(x, currentY - barHeight, barWidth, barHeight);

                ctx.save();
                ctx.setLineDash([5, 5]);
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 4;
                ctx.strokeRect(x, currentY - barHeight, barWidth, barHeight);
                ctx.restore();
            } else {
                ctx.fillStyle = (status[index] === false) ? bgColor : colors[index];
                ctx.fillRect(x, currentY - barHeight, barWidth, barHeight);

                if (status[index] === false) {
                    ctx.save();
                    ctx.setLineDash([5, 5]);
                    ctx.strokeStyle = textColor;
                    ctx.lineWidth = 4;
                    ctx.strokeRect(x, currentY - barHeight, barWidth, barHeight);
                    ctx.restore();
                }
            }

            currentY -= barHeight;
        });

        if (barType === 'generation') {
            const powerPlant2Index = generationData.findIndex(d => d.originalIndex === 1);
            if (powerPlant2Index !== -1 && getBuildingTypeOnOff('powerPlant2')) {
                const powerPlant2Value = values[powerPlant2Index];
                const solarExtra = Math.max(0, solarMaxPurchasedRate - powerPlant2Value);

                if (solarExtra > 0) {
                    const solarExtraHeight = (solarExtra / maxValue) * maxBarHeight;

                    ctx.save();
                    ctx.setLineDash([5, 5]);
                    ctx.strokeStyle = getStarSystemDataObject('stars', [getCurrentStarSystem(), 'weather', getCurrentStarSystemWeatherEfficiency()[2]])[3];
                    ctx.lineWidth = 4;
                    ctx.strokeRect(x, currentY - solarExtraHeight, barWidth, solarExtraHeight);
                    ctx.restore();

                    ctx.font = '60px Arial';
                    ctx.fillStyle = getStarSystemDataObject('stars', [getCurrentStarSystem(), 'weather', getCurrentStarSystemWeatherEfficiency()[2]])[3];
                    const symbol = getStarSystemDataObject('stars', [getCurrentStarSystem(), 'weather', getCurrentStarSystemWeatherEfficiency()[2]])[1];
                    const textWidth = ctx.measureText(symbol).width;

                    const centerX = x + (barWidth / 2) - (textWidth / 2);
                    const centerY = currentY - solarExtraHeight + 50;

                    ctx.fillText(symbol, centerX, centerY);

                    currentY -= solarExtraHeight;
                }
            }

            if (getInfinitePower()) {
                const infinitePowerValue = getInfinitePowerRate();
                const infiniteBarHeight = (infinitePowerValue / maxValue) * maxBarHeight;

                ctx.fillStyle = 'yellow';
                ctx.fillRect(x, currentY - infiniteBarHeight, barWidth, infiniteBarHeight);

                ctx.font = '30px Arial';
                ctx.fillStyle = 'yellow';
                ctx.fillText('∞', x + (barWidth / 2) - 10, currentY - infiniteBarHeight + 30);

                currentY -= infiniteBarHeight;
            }
        }
    }

    if (getInfinitePower()) {
        // Draw only the infinite power bar
        const infinitePowerValue = getInfinitePowerRate();
        maxValue = infinitePowerValue; // Override maxValue to infinite power for consistent scaling

        drawBar((gap * 6), [infinitePowerValue], ['yellow'], [true], getPowerOnOff(), 'generation', solarPlantMaxPurchasedRate);

        // Draw axis line
        ctx.beginPath();
        ctx.moveTo(0, height - 10);
        ctx.lineTo(width, height - 10);
        ctx.strokeStyle = textColor;
        ctx.lineWidth = 4;
        ctx.stroke();

        // Draw infinity symbols as vertical labels
        ctx.fillStyle = 'yellow';
        ctx.font = '30px Arial';

        for (let i = 0; i <= 5; i++) {
            const yPosition = height - (i / 5) * maxBarHeight;
            ctx.fillText('∞', gap * 2, yPosition);
        }

        const genLabelX = (gap * 4) + barWidth / 2 - 10;
        ctx.fillText('Gen.', genLabelX, height + 20);

        // Don't draw any other bars or labels
        return;
    }

    // Normal drawing (no infinite power)
    if (generationData.length > 0 && generationData[0].originalIndex === 1) {
        drawBar((gap * 6), sortedGenerationValues, generationColors, sortedGenerationStatuses, getPowerOnOff(), 'generation', solarPlantMaxPurchasedRate);
    } else {
        drawBar((gap * 6), sortedGenerationValues, generationColors, sortedGenerationStatuses, getPowerOnOff(), 'generation', solarPlantMaxPurchasedRate);
    }

    drawBar((gap * 6) + barWidth + gap, consumptionValues, consumptionColors, [true, true, true], getPowerOnOff(), 'consumption', solarPlantMaxPurchasedRate);

    ctx.beginPath();
    ctx.moveTo(0, height - 10);
    ctx.lineTo(width, height - 10);
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.font = '30px Arial';
    ctx.fillStyle = textColor;

    const labelSpacing = maxValue / 5;
    for (let i = 0; i <= 5; i++) {
        const labelValue = labelSpacing * i;
        const yPosition = height - (labelValue / maxValue) * maxBarHeight;

        if (labelValue === 0) {
            ctx.fillStyle = 'transparent';
        } else {
            ctx.fillStyle = textColor;
        }

        ctx.fillText(labelValue.toFixed(0), gap * 2, yPosition);
    }

    const genLabelX = (gap * 4) + barWidth / 2 - 10;
    const consLabelX = (gap * 4) + barWidth * 1.5 + gap - 10;

    ctx.fillText('Gen.', genLabelX, height + 20);
    ctx.fillText('Con.', consLabelX, height + 20);
}



export function removeAllIndicatorIcons(iconText = '⚠️', indicatorClass = 'attention-indicator') {
    const indicators = document.querySelectorAll(`.${indicatorClass}`);
    indicators.forEach(indicator => {
        if (indicator.innerHTML.includes(iconText)) {
            indicator.remove();
        }
    });
}

export function updateDynamicUiContent() {
    if (!document.getElementById('energyConsumptionStats').classList.contains('invisible')) {
        const powerPlant1PurchasedRate = getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant1', 'purchasedRate']);
        const powerPlant2PurchasedRate = getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant2', 'purchasedRate']);
        const solarPlantMaxPurchasedRate = getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant2', 'maxPurchasedRate']) * getTimerRateRatio();
        const powerPlant3PurchasedRate = getResourceDataObject('buildings', ['energy', 'upgrades', 'powerPlant3', 'purchasedRate']);

        const powerConsumption = getResourceDataObject('buildings', ['energy', 'consumption']);
        
        const generationValues = [powerPlant1PurchasedRate * getTimerRateRatio(), powerPlant2PurchasedRate * getTimerRateRatio(), powerPlant3PurchasedRate * getTimerRateRatio()];
        const consumptionValues = [powerConsumption * getTimerRateRatio()];
        drawStackedBarChart('powerGenerationConsumptionChart', generationValues, consumptionValues, solarPlantMaxPurchasedRate);
    }

    if (getCurrentOptionPane() !== 'tech tree') {
        setTechTreeDrawnYet(false);
    }

    if (getCurrentOptionPane() !== 'star map') {
        removeStarConnectionTooltip();
    }
}

function setupTechTreeTooltip(svgElement) {
    d3.selectAll('#techTreeTooltip').remove();

    d3.select('body').append('div')
        .style('position', 'absolute')
        .style('pointer-events', 'none')
        .style('padding', '8px')
        .style('background', 'rgba(0, 0, 0, 0.9)')
        .style('color', 'var(--text-color)')
        .style('border', '2px solid var(--text-color)')
        .style('border-radius', '5px')
        .style('font-size', '12px')
        .style('display', 'none')
        .style('z-index', 1000)
        .attr('id', 'techTreeTooltip');

    d3.selectAll(`${svgElement} title`).remove();

    d3.selectAll(`${svgElement} .node`)
        .on('mouseover', function (event, d) {
            const tooltipElement = d3.select('#techTreeTooltip');
            const nodeLabel = d3.select(this).select('text').text();

            if (nodeLabel.includes('???')) {
                tooltipElement.style('display', 'none');
                return;
            }

            const descriptionId = 'tech' + capitaliseString(nodeLabel).replace(/\s+/g, '') + 'Row';
            const tooltipContent = `<br/>${optionDescriptions[descriptionId].content2}`;
            tooltipElement.html(tooltipContent)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY + 10) + 'px')
                .style('display', 'block');
        })
        .on('mousemove', function (event) {
            d3.select('#techTreeTooltip')
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY + 10) + 'px');
        })
        .on('mouseout', function () {
            d3.select('#techTreeTooltip').style('display', 'none');
        });
}

function drawLeftSideOfAntimatterSvg(asteroidsArray, rocketData, svgElement, svgNS) {
    Array.from(svgElement.children).forEach(child => {
        if (child.id !== 'svgRateBar' && child.id !== 'svgRightScaleContainer') {
            svgElement.removeChild(child);
        }
    });

    const rockets = ["Rocket 1", "Rocket 2", "Rocket 3", "Rocket 4"];
    const numRockets = rockets.length;

    const svgWidth = svgElement.clientWidth;
    const svgHeight = svgElement.clientHeight;
    const boxWidth = svgWidth * 0.4;
    const leftOffset = svgWidth * 0.1;
    const rightOffset = svgWidth * 0.65;
    const verticalSpacing = svgHeight / (numRockets + 1);
    const boxHeight = verticalSpacing * 0.8;

    let lineClasses = [
        getMiningObject().rocket1 === "refuel" ? "warning-text" : (getMiningObject().rocket1 ? "ready-text" : "disabled-text"),
        getMiningObject().rocket2 === "refuel" ? "warning-text" : (getMiningObject().rocket2 ? "ready-text" : "disabled-text"),
        getMiningObject().rocket3 === "refuel" ? "warning-text" : (getMiningObject().rocket3 ? "ready-text" : "disabled-text"),
        getMiningObject().rocket4 === "refuel" ? "warning-text" : (getMiningObject().rocket4 ? "ready-text" : "disabled-text")
    ];       

    const titleContainer = document.createElementNS(svgNS, "foreignObject");
    titleContainer.setAttribute("x", "0px");
    titleContainer.setAttribute("y", "0");
    titleContainer.setAttribute("width", svgWidth);
    titleContainer.setAttribute("height", "60");

    const titleDiv = document.createElement("div");
    titleDiv.style.width = "100%";
    titleDiv.style.height = "100%";
    titleDiv.style.display = "flex";
    titleDiv.style.alignItems = "center";
    titleDiv.style.justifyContent = "center";
    titleDiv.style.fontSize = "36px";
    titleDiv.style.fontWeight = "bold";
    titleDiv.style.color = "var(--text-color)";
    titleDiv.style.fontFamily = "var(--font-family)";
    titleDiv.style.textAlign = "center";
    titleDiv.innerHTML = "Antimatter Mining";

    titleContainer.appendChild(titleDiv);
    svgElement.appendChild(titleContainer);

    let topMostY = null;
    let bottomMostY = null;

    rockets.forEach((rocket, index) => {
        const lineClass = lineClasses[index % lineClasses.length];

        const yOffset = verticalSpacing * (index + 1) - boxHeight / 2;
        if (topMostY === null) topMostY = yOffset;
        bottomMostY = yOffset + boxHeight;
    
        let rocketInfo = rocketData[(rocket.slice(0, rocket.length - 2) + (index + 1)).toLowerCase()];

        let asteroid;
        if (rocketInfo) {
            asteroid = asteroidsArray.find(asteroidObj => asteroidObj[rocketInfo[1]])[rocketInfo[1]];
        } else {
            asteroid = null;
        }

        let textLines = rocketInfo ? [
            ['', (() => {
                const name = getRocketUserName('rocket' + (index + 1));
                const spaceIdx = name.indexOf(' ');
                if (spaceIdx > 0) return name.slice(0, spaceIdx) + '...';
                return name.length > 13 ? name.slice(0, 13) + '...' : name;
            })()],
            ["Asteroid:", (() => {
                const name = rocketInfo[1];
                const spaceIdx = name.indexOf(' ');
                if (spaceIdx > 0) return name.slice(0, spaceIdx) + '...';
                return name.length > 13 ? name.slice(0, 13) + '...' : name;
            })()],           
            ["Complexity:", rocketInfo[2]],
            ["Antimatter Left:", Math.floor(rocketInfo[4])]
        ] : [
            ['', `Rocket ${index + 1}`],
            [getMiningObject()[`rocket${index + 1}`] === 'refuel' ? "Requires Refuelling" : "Not at Asteroid", ""],
            ["", ""],
            ["", ""]
        ];

        let easeOfExtractionColorClass;

        if (asteroid) {
            switch (asteroid.easeOfExtraction[1]) {
                case 'warning-orange-text':
                    easeOfExtractionColorClass = 'warning-text';
                    break;
                case 'red-disabled-text':
                    easeOfExtractionColorClass = 'disabled-text';
                    break;
                case 'green-ready-text':
                    easeOfExtractionColorClass = 'ready-text';
                    break;
                default:
                    easeOfExtractionColorClass = 'var(--text-color)';
                    break;
            }
        }
    
        const table = document.createElementNS(svgNS, "foreignObject");
        table.setAttribute("x", leftOffset);
        table.setAttribute("y", yOffset);
        table.setAttribute("width", boxWidth);
        table.setAttribute("height", boxHeight);
    
        const div = document.createElement("div");
        div.style.border = `2px solid var(--${lineClass})`;
        div.style.borderRadius = "10px";
        div.style.padding = "5px 10px 10px 10px";
        div.style.width = "100%";
        div.style.height = "100%";
        div.style.boxSizing = "border-box";
    
        const htmlTable = document.createElement("table");
        htmlTable.style.width = "100%";
    
        textLines.forEach(([label, value], rowIndex) => {
            const row = document.createElement("tr");
    
            const labelCell = document.createElement("td");
            labelCell.innerHTML = label;
            labelCell.style.fontWeight = "bold";
            labelCell.style.textAlign = "left";
            row.appendChild(labelCell);
    
            const valueCell = document.createElement("td");
            valueCell.innerHTML = value;
            valueCell.style.textAlign = "left";

            if (value instanceof HTMLElement) { 
                valueCell.innerHTML = ""; 
                valueCell.appendChild(value);
            } else {
                valueCell.innerHTML = value;
            }
    
            if (label === "Not at Asteroid") {
                labelCell.style.color = label === "Not at Asteroid" 
                    ? "var(--disabled-text)" 
                    : "var(--warning-text)";
            } else {
                valueCell.innerHTML = value;
            }

            let antimatterColorClass = 'var(--text-color)';
            
            if (asteroid) {
                antimatterColorClass = asteroid.quantity[1];
            }

            if (rowIndex < 2) {
                valueCell.style.color = `var(--${lineClass})`;
            } else if (rowIndex === 2) {
                valueCell.style.color = `var(--${easeOfExtractionColorClass})`;
            } else if (rowIndex === 3) {
                valueCell.style.color = `var(--${antimatterColorClass})`;
            }
    
            row.appendChild(valueCell);
            htmlTable.appendChild(row);
        });
    
        div.appendChild(htmlTable);
        table.appendChild(div);
        svgElement.appendChild(table);
    
        const centerY = yOffset + boxHeight / 2.5;
        const boxRightX = leftOffset + boxWidth;
        const lineEndX = rightOffset;

        const marker = document.createElementNS(svgNS, "marker");
        marker.setAttribute("id", `arrow${index}`);
        marker.setAttribute("markerWidth", "10");
        marker.setAttribute("markerHeight", "7");
        marker.setAttribute("refX", "10");
        marker.setAttribute("refY", "3.5");
        marker.setAttribute("orient", "auto");
        marker.setAttribute("markerUnits", "strokeWidth");
    
        const arrowPath = document.createElementNS(svgNS, "path");
        arrowPath.setAttribute("d", "M0,0 L10,3.5 L0,7");
        arrowPath.setAttribute("fill", "var(--" + lineClass + ")");
        marker.appendChild(arrowPath);
        svgElement.appendChild(marker);
    
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", boxRightX);
        line.setAttribute("y1", centerY);
        line.setAttribute("x2", lineEndX);
        line.setAttribute("y2", centerY);
        line.setAttribute("stroke", "var(--" + lineClass + ")");
        line.setAttribute("stroke-width", "2");
        line.setAttribute("marker-end", `url(#arrow${index})`);
    
        svgElement.appendChild(line);

        const label = document.createElementNS(svgNS, "text");
        label.setAttribute("x", (boxRightX + lineEndX) / 2);
        label.setAttribute("y", centerY - 10);
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("fill", "var(--" + lineClass + ")");
        label.setAttribute("font-size", "14");
        if (rocketInfo && !getIsAntimatterBoostActive()) {
            label.innerHTML = `${(rocketInfo[3] * (1 + (getBuffEnhancedMiningData().boughtYet * getBuffEnhancedMiningData().effectCategoryMagnitude)) * getTimerRateRatio()).toFixed(2)} / s`;
        } else if (rocketInfo && getIsAntimatterBoostActive()) {
            label.innerHTML = `${(rocketInfo[3] * (1 + (getBuffEnhancedMiningData().boughtYet * getBuffEnhancedMiningData().effectCategoryMagnitude)) * getTimerRateRatio() * getBoostRate()).toFixed(2)} / s`;
        } else {
            label.innerHTML = '0 / s';
        }

        svgElement.appendChild(label);
    });
    return [topMostY, bottomMostY, rightOffset, boxWidth, boxHeight];
}

export async function drawAntimatterFlowDiagram(rocketData, svgElement) {
    const asteroidsArray = getAsteroidArray();
    const svgNS = "http://www.w3.org/2000/svg";
    let topMostY;
    let bottomMostY;
    let rightOffset;
    let boxWidth;
    let boxHeight;

    if (!getHasAntimatterSvgRightBoxDataChanged(svgElement)) {
        [topMostY, bottomMostY, rightOffset, boxWidth, boxHeight] = drawLeftSideOfAntimatterSvg(asteroidsArray, rocketData, svgElement, svgNS);
        return;
    }  else {
        [topMostY, bottomMostY, rightOffset, boxWidth, boxHeight] = drawLeftSideOfAntimatterSvg(asteroidsArray, rocketData, svgElement, svgNS);
    }
    
    const rightBoxHeight = bottomMostY - topMostY;

    const rightBox = document.createElementNS(svgNS, "foreignObject");
    rightBox.setAttribute("x", rightOffset);
    rightBox.setAttribute("y", topMostY);
    rightBox.setAttribute("width", boxWidth / 2);
    rightBox.setAttribute("height", rightBoxHeight);
    rightBox.setAttribute("id", 'svgRateBar');

    const boostTextContainer = document.createElement("div");
    boostTextContainer.style.position = "absolute";
    boostTextContainer.style.top = "10px";
    boostTextContainer.style.left = "50%";
    boostTextContainer.style.transform = "translateX(-50%)";
    boostTextContainer.style.textAlign = "center";
    boostTextContainer.style.color = "var(--text-color)";
    boostTextContainer.style.fontSize = "20px";
    boostTextContainer.style.fontWeight = "bold";
    boostTextContainer.style.pointerEvents = 'none';
    boostTextContainer.setAttribute("id", 'boostTextContainer');

    const rightArrowLine = document.createElement("div");
    rightArrowLine.innerText = "🢃";
    boostTextContainer.appendChild(rightArrowLine);

    const boostWordLine = document.createElement("div");
    boostWordLine.innerText = "BOOST";
    boostTextContainer.appendChild(boostWordLine);

    const leftArrowLine = document.createElement("div");
    leftArrowLine.innerText = "🢁";
    boostTextContainer.appendChild(leftArrowLine);

    boostTextContainer.style.opacity = "0";
    boostTextContainer.style.visibility = "hidden";
    boostTextContainer.style.transition = "opacity 0.3s ease, visibility 0.3s ease";

    const antimatterRateBarOuter = document.createElement("div");
    antimatterRateBarOuter.style.position = "relative";
    antimatterRateBarOuter.style.width = "100%";
    antimatterRateBarOuter.style.height = "100%";
    antimatterRateBarOuter.style.border = "2px solid var(--text-color)";
    antimatterRateBarOuter.style.borderRadius = "10px";
    antimatterRateBarOuter.style.backgroundColor = "var(--container-bg-color)";
    antimatterRateBarOuter.style.transition = "background-color 0.3s ease-in-out";
    antimatterRateBarOuter.setAttribute("id", 'svgRateBarOuter');

    const antimatterTotalRate = getResourceDataObject('antimatter', ['rate']);
    const antimatterMaxRate = getNormalMaxAntimatterRate() * 10;
    
    const antimatterPercentage = (antimatterTotalRate / antimatterMaxRate) * 50;
    const antimatterRateBarInner = document.createElement("div");
    antimatterRateBarInner.style.position = "absolute";
    antimatterRateBarInner.style.bottom = "0";
    antimatterRateBarInner.style.width = "100%";
    antimatterRateBarInner.style.height = `${Math.min(50, Math.max(0, antimatterPercentage))}%`;
    antimatterRateBarInner.style.borderRadius = "10px";
    antimatterRateBarInner.style.backgroundColor = "var(--text-color)";
    antimatterRateBarInner.setAttribute("id", 'svgRateBarInner');

    const scaleContainer = document.createElement("div");
    scaleContainer.style.display = "flex";
    scaleContainer.style.flexDirection = "column";
    scaleContainer.style.justifyContent = "space-between";
    scaleContainer.style.alignItems = "flex-end";
    scaleContainer.style.width = "100%";
    scaleContainer.style.color = "var(--text-color)";
    scaleContainer.style.fontSize = "12px";
    
    for (let i = 0; i <= 8; i++) {  
        const scaleLabel = document.createElement("div");
        scaleLabel.innerText = `${(antimatterMaxRate * 2 * ((8 - i) / 8) * getTimerRateRatio()).toFixed(2)} / s`;
        scaleLabel.style.position = "absolute";
        scaleLabel.style.right = "5px";
        
        let topOffset = (i / 8) * 100;
        
        if (i === 0) {
            topOffset += 2;
        } else if (i === 8) {
            topOffset -= 2;
        }
    
        scaleLabel.style.top = `${topOffset}%`;
        scaleLabel.style.transform = "translateY(-50%)";
        scaleLabel.style.whiteSpace = "nowrap";
        scaleContainer.appendChild(scaleLabel);
    }
    
    const scaleForeignObject = document.createElementNS(svgNS, "foreignObject");
    scaleForeignObject.setAttribute("x", rightOffset + (boxWidth / 2) - 20);
    scaleForeignObject.setAttribute("y", topMostY);
    scaleForeignObject.setAttribute("width", 80);
    scaleForeignObject.setAttribute("height", rightBoxHeight);
    scaleForeignObject.setAttribute("id", "svgRightScaleContainer");
    scaleForeignObject.appendChild(scaleContainer);

    svgElement.appendChild(scaleForeignObject);
    antimatterRateBarOuter.appendChild(antimatterRateBarInner);
    rightBox.appendChild(antimatterRateBarOuter);
    rightBox.appendChild(boostTextContainer);

    svgElement.appendChild(rightBox);
}

export async function drawTechTree(techData, svgElement, renew) {
    const cachedTree = getRenderedTechTree();
    const container = document.querySelector(svgElement);
    container.innerHTML = '';

    const bgColor = getComputedStyle(container).getPropertyValue('--bg-color').trim();
    const textColor = getComputedStyle(container).getPropertyValue('--text-color').trim();

    const researchedBgColor = getComputedStyle(container).getPropertyValue('--text-color').trim();
    const researchedTextColor = getComputedStyle(container).getPropertyValue('--ready-text').trim();

    const researchedTechs = getTechUnlockedArray();

    const svgWidth = container.clientWidth || container.parentNode.clientWidth;
    const svgHeight = container.clientHeight || container.parentNode.clientHeight;

    if (cachedTree && !renew) {
        container.innerHTML = '';
        container.appendChild(cachedTree.cloneNode(true));
        setupTechTreeTooltip(svgElement);
        return;
    }

    let graphDef = `digraph TechTree {
        graph [bgcolor="${bgColor}", size="${svgWidth / 72},${svgHeight / 72}!", size="10,7!", rankdir="TB"];
        node [
            color="${textColor}"
            style="filled,rounded",
            shape="box",
            fontname="Arial",
            fontsize=24,
            penwidth=4
            fixedsize=true,
            width=4.5,
            height=1.3
        ];
        edge [
            color="${textColor}",
            penwidth=2,
            arrowsize=1.2,
            fontname="Arial",
            fontsize=10
        ];
    `;

    let title = `<b>???</b><br/>???`;

    for (const [key, value] of Object.entries(techData)) {
        const isResearched = researchedTechs.includes(key);
        const nodeBgColor = isResearched ? researchedBgColor : bgColor;
        const nodeTextColor = isResearched ? researchedTextColor : textColor;

        const capitalisedTechName = capitaliseString(key);
        const separatedCapitalisedTechNames = capitalisedTechName.replace(/([a-z])([A-Z])/g, '$1 $2');
        const price = value.price;
        

        if (getUpcomingTechArray().includes(key) && !getRevealedTechArray().includes(key)) {
            title = `<b>???</b><br/>Price: ${price}`;
        } else {
            title = `<b>${separatedCapitalisedTechNames}</b><br/>Price: ${price}`;
        }
        graphDef += `${key} [label=<${title}> shape="box" style="rounded,filled" fontcolor="${nodeTextColor}" fillcolor="${nodeBgColor}" fontname="Arial"];\n`;
    }

    for (const [key, value] of Object.entries(techData)) {
        const appearsAt = value.appearsAt || [];
        if (appearsAt.length > 1) {
            for (let i = 1; i < appearsAt.length; i++) {
                const prereq = appearsAt[i];
                if (prereq) {
                    graphDef += `${prereq} -> ${key};\n`;
                }
            }
        }
    }

    graphDef += "}";

    const graphviz = d3.select(svgElement)
        .graphviz()
        .zoom(false)
        .scale(0.7)
        .fit(false);  

    graphviz.renderDot(graphDef);

    setTimeout(() => {
        setupTechTreeTooltip(svgElement);
        setRenderedTechTree(container);
    }, 50);
}

export function showTabsUponUnlock() {
    const tabs = document.querySelectorAll('.tab');
    const unlockedTechs = getTechUnlockedArray();

    tabs.forEach(tab => {
        const tabTech = tab.getAttribute('data-tab');
        const tabName = tab.getAttribute('data-name');

        if (unlockedTechs.includes(tabTech)) {
            if (!getBattleTriggeredByPlayer()) {
                tab.classList.remove('tab-not-yet');
            }
            tab.textContent = tabName;
            const containerGroup = document.getElementById(`${tab.id}ContainerGroup`);

            if (containerGroup) {
                const firstAccessArray = getFirstAccessArray();            
                const optionElements = containerGroup.querySelectorAll('[id$="Option"]');
            
                optionElements.forEach(el => {
                    const grandparent = el.parentElement?.parentElement;
                    const isVisible = !grandparent?.classList.contains('invisible');
                    const normalizedElName = normalizeTabName(el.textContent);
                    const isFirstAccess = !firstAccessArray.includes(normalizedElName);
            
                    if (isVisible && isFirstAccess) {
                        appendAttentionIndicator(el);
                    } else {
                        removeAttentionIndicator(el);
                    }
                });
            }                  
        }
    });
}

function normalizeTabName(tabName) {
    return tabName
        .replace(/\s*⚠️/, '')
        .toLowerCase()
        .trimEnd();
}

export function checkOrderOfTabs() {
    const techArray = getTechUnlockedArray();

    const tabPriorities = {
        1: 1,
        2: 4,
        3: 3,
        4: 2,
        5: 6,
        6: 5,
        7: 7,
        8: 8
    };

    let unlockedTabs = [1, 3];

    if (techArray.includes('stellarCartography')) unlockedTabs.push(5);
    if (techArray.includes('basicPowerGeneration')) unlockedTabs.push(2);
    if (techArray.includes('compounds')) unlockedTabs.push(4);
    if (techArray.includes('atmosphericTelescopes')) unlockedTabs.push(6);
    if (techArray.includes('apAwardedThisRun')) unlockedTabs.push(7);

    unlockedTabs = unlockedTabs.sort((a, b) => tabPriorities[a] - tabPriorities[b]);

    const allTabs = Array.from(document.getElementById('tabsContainer').children);
    const tabsWithUnknown = allTabs.filter(tab => tab.textContent === '???');
    
    if (tabsWithUnknown.length > 0) {
        unlockedTabs = unlockedTabs.filter(tab => !tabsWithUnknown.some(t => `tab${tab}` === t.id));
        unlockedTabs.push(...tabsWithUnknown.map(tab => parseInt(tab.id.replace('tab', ''), 10)));
    }

    if (!unlockedTabs.includes(8)) {
        unlockedTabs.push(8);
    }

    allTabs.forEach(tab => {
        const container = document.getElementById(`${tab.id}ContainerGroup`);
        if (container && container.querySelector('.attention-indicator')) {
            appendAttentionIndicator(tab);
        } else {
            removeAttentionIndicator(tab);
        }
    });

    const currentOrder = Array.from(document.getElementById('tabsContainer').children).map(tab =>
        parseInt(tab.id.replace('tab', ''), 10)
    );

    if (JSON.stringify(currentOrder) === JSON.stringify(unlockedTabs)) {
        return;
    }

    reorderTabs(unlockedTabs);
}

export function updateTabHotkeys() {
    const tabs = Array.from(document.getElementById('tabsContainer').children);

    document.removeEventListener('keydown', handleTabHotkeys);
    
    function handleTabHotkeys(event) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;

        const key = event.key;
        if (key >= '1' && key <= String(tabs.length)) {
            const tabIndex = parseInt(key, 10) - 1;
            const tabElement = tabs[tabIndex];
            
            if (tabElement) {
                tabElement.click();
            }
        }
    }

    document.addEventListener('keydown', handleTabHotkeys);
}

function reorderTabs(newOrder) {
    const tabsContainer = document.getElementById('tabsContainer');

    newOrder.forEach(tabId => {
        const tab = document.getElementById(`tab${tabId}`);
        if (tab) {
            tabsContainer.appendChild(tab);
        }
    });

    initializeTabEventListeners();
    updateTabHotkeys();
}

function initializeTabEventListeners() {
    let fuseButton;

    document.querySelectorAll('[class*="tab1"][class*="option1"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab1', 'hydrogen');
            setCurrentOptionPane('hydrogen');
            updateContent('Hydrogen', 'tab1', 'content');
            fuseButton = document.querySelector('button.fuse');
            setSellFuseCreateTextDescriptionClassesBasedOnButtonStates(fuseButton, 'fuse');
            setAutoSellToggleState('hydrogen', 'resources');
            setFirstAccessArray('hydrogen');
        });
    });
    
    document.querySelectorAll('[class*="tab1"][class*="option2"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab1', 'helium');
            setCurrentOptionPane('helium');
            updateContent('Helium', 'tab1', 'content');
            fuseButton = document.querySelector('button.fuse');
            setSellFuseCreateTextDescriptionClassesBasedOnButtonStates(fuseButton, 'fuse');
            setAutoSellToggleState('helium', 'resources');
            setFirstAccessArray('helium');
        });
    });

    document.querySelectorAll('[class*="tab1"][class*="option3"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab1', 'carbon');
            setCurrentOptionPane('carbon');
            updateContent('Carbon', 'tab1', 'content');
            fuseButton = document.querySelector('button.fuse');
            setSellFuseCreateTextDescriptionClassesBasedOnButtonStates(fuseButton, 'fuse');
            setAutoSellToggleState('carbon', 'resources');
            setFirstAccessArray('carbon');
        });
    });

    document.querySelectorAll('[class*="tab1"][class*="option4"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab1', 'neon');
            setCurrentOptionPane('neon');
            updateContent('Neon', 'tab1', 'content');
            fuseButton = document.querySelector('button.fuse');
            setSellFuseCreateTextDescriptionClassesBasedOnButtonStates(fuseButton, 'fuse');
            setAutoSellToggleState('neon', 'resources');
            setFirstAccessArray('neon');
        });
    });

    document.querySelectorAll('[class*="tab1"][class*="option5"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab1', 'oxygen');
            setCurrentOptionPane('oxygen');
            updateContent('Oxygen', 'tab1', 'content');
            fuseButton = document.querySelector('button.fuse');
            setSellFuseCreateTextDescriptionClassesBasedOnButtonStates(fuseButton, 'fuse');
            setAutoSellToggleState('oxygen', 'resources');
            setFirstAccessArray('oxygen');
        });
    });

    document.querySelectorAll('[class*="tab1"][class*="option6"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab1', 'sodium');
            setCurrentOptionPane('sodium');
            updateContent('Sodium', 'tab1', 'content');
            setAutoSellToggleState('sodium', 'resources');
            setFirstAccessArray('sodium');
        });
    });

    document.querySelectorAll('[class*="tab1"][class*="option7"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab1', 'silicon');
            setCurrentOptionPane('silicon');
            updateContent('Silicon', 'tab1', 'content');
            fuseButton = document.querySelector('button.fuse');
            setSellFuseCreateTextDescriptionClassesBasedOnButtonStates(fuseButton, 'fuse');
            setAutoSellToggleState('silicon', 'resources');
            setFirstAccessArray('silicon');
        });
    });

    document.querySelectorAll('[class*="tab1"][class*="option8"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab1', 'iron');
            setCurrentOptionPane('iron');
            updateContent('Iron', 'tab1', 'content');
            setAutoSellToggleState('iron', 'resources');
            setFirstAccessArray('iron');
        });
    });

    document.querySelectorAll('[class*="tab2"][class*="option1"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab2', 'energy storage');
            setCurrentOptionPane('energy storage');
            updateContent('Energy Storage', 'tab2', 'content');
            setFirstAccessArray('energy storage');
        });
    });

    document.querySelectorAll('[class*="tab2"][class*="option2"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab2', 'power plant');
            setCurrentOptionPane('power plant');
            updateContent('Power Plant', 'tab2', 'content');
            setFirstAccessArray('power plant');
        });
    });

    document.querySelectorAll('[class*="tab2"][class*="option3"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab2', 'solar power plant');
            setCurrentOptionPane('solar power plant');
            updateContent('Solar Power Plant', 'tab2', 'content');
            setFirstAccessArray('solar power plant');
        });
    });

    document.querySelectorAll('[class*="tab2"][class*="option4"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab2', 'advanced power plant');
            setCurrentOptionPane('advanced power plant');
            updateContent('Advanced Power Plant', 'tab2', 'content');
            setFirstAccessArray('advanced power plant');
        });
    });

    document.querySelectorAll('[class*="tab3"][class*="option1"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab3', 'research');
            setCurrentOptionPane('research');
            updateContent('Research', 'tab3', 'content');
            setFirstAccessArray('research');
        });
    });
    
    document.querySelectorAll('[class*="tab3"][class*="option2"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab3', 'technology');
            setCurrentOptionPane('technology');
            updateContent('Technology', 'tab3', 'content');
            setFirstAccessArray('technology');
        });
    });

    document.querySelectorAll('[class*="tab3"][class*="option3"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab3', 'tech tree');
            setCurrentOptionPane('tech tree');
            updateContent('Tech Tree', 'tab3', 'content');
            setFirstAccessArray('tech tree');
        });
    });

    document.querySelectorAll('[class*="tab3"][class*="option4"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab3', 'philosophy');
            setCurrentOptionPane('philosophy');
            updateContent('Philosophy', 'tab3', 'content');
            setFirstAccessArray('philosophy');
        });
    });

    document.querySelectorAll('[class*="tab4"][class*="option1"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab4', 'diesel');
            setCurrentOptionPane('diesel');
            updateContent('Diesel', 'tab4', 'content');
            setAutoSellToggleState('diesel', 'compounds');
            setAutoCreateToggleState('diesel');
            setFirstAccessArray('diesel');
        });
    });

    document.querySelectorAll('[class*="tab4"][class*="option2"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab4', 'glass');
            setCurrentOptionPane('glass');
            updateContent('Glass', 'tab4', 'content');
            setAutoSellToggleState('glass', 'compounds');
            setAutoCreateToggleState('glass');
            setFirstAccessArray('glass');
        });
    });

    document.querySelectorAll('[class*="tab4"][class*="option3"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab4', 'steel');
            setCurrentOptionPane('steel');
            updateContent('Steel', 'tab4', 'content');
            setAutoSellToggleState('steel', 'compounds');
            setAutoCreateToggleState('steel');
            setFirstAccessArray('steel');
        });
    });

    document.querySelectorAll('[class*="tab4"][class*="option4"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab4', 'concrete');
            setCurrentOptionPane('concrete');
            updateContent('Concrete', 'tab4', 'content');
            setAutoSellToggleState('concrete', 'compounds');
            setAutoCreateToggleState('compounds');
            setFirstAccessArray('concrete');
        });
    });

    document.querySelectorAll('[class*="tab4"][class*="option5"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab4', 'water');
            setCurrentOptionPane('water');
            updateContent('Water', 'tab4', 'content');
            setAutoSellToggleState('water', 'compounds');
            setAutoCreateToggleState('water');
            setFirstAccessArray('water');
        });
    });

    document.querySelectorAll('[class*="tab4"][class*="option6"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab4', 'titanium');
            setCurrentOptionPane('titanium');
            updateContent('Titanium', 'tab4', 'content');
            setAutoSellToggleState('titanium', 'compounds');
            setAutoCreateToggleState('titanium');
            setFirstAccessArray('titanium');
        });
    });

    document.querySelectorAll('[class*="tab5"][class*="option1"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab5', 'star map');
            setCurrentOptionPane('star map');
            updateContent('Star Map', 'tab5', 'content');
            setFirstAccessArray('star map');
        });
    });

    document.querySelectorAll('[class*="tab5"][class*="option2"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab5', 'star data');
            setCurrentOptionPane('star data');
            updateContent('Star Data', 'tab5', 'content');
            setFirstAccessArray('star data');
        });
    });

    document.querySelectorAll('[class*="tab5"][class*="option3"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab5', 'star ship');
            setCurrentOptionPane('star ship');
            updateContent('Star Ship', 'tab5', 'content');
            setFirstAccessArray('star ship');
        });
    });

    document.querySelectorAll('[class*="tab5"][class*="option4"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab5', 'fleet hangar');
            setCurrentOptionPane('fleet hangar');
            updateContent('Fleet Hangar', 'tab5', 'content');
            setFirstAccessArray('fleet hangar');
        });
    });

    document.querySelectorAll('[class*="tab5"][class*="option5"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab5', 'colonise');
            setCurrentOptionPane('colonise');
            updateContent('Colonise', 'tab5', 'content');
            setFirstAccessArray('colonise');
        });
    });

    document.querySelectorAll('[class*="tab6"][class*="option1"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab6', 'launch pad');
            setCurrentOptionPane('launch pad');
            updateContent('Launch Pad', 'tab6', 'content');
            setFirstAccessArray('launch pad');
        });
    });

    document.querySelectorAll('[class*="tab6"][class*="option2"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab6', 'rocket1');
            setCurrentOptionPane('rocket1');
            updateContent(`${getRocketUserName('rocket1')}`, 'tab6', 'content');
            setFirstAccessArray('rocket1');
        });
    });

    document.querySelectorAll('[class*="tab6"][class*="option3"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab6', 'rocket2');
            setCurrentOptionPane('rocket2');
            updateContent(`${getRocketUserName('rocket2')}`, 'tab6', 'content');
            setFirstAccessArray('rocket2');
        });
    });

    document.querySelectorAll('[class*="tab6"][class*="option4"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab6', 'rocket3');
            setCurrentOptionPane('rocket3');
            updateContent(`${getRocketUserName('rocket3')}`, 'tab6', 'content');
            setFirstAccessArray('rocket3');
        });
    });

    document.querySelectorAll('[class*="tab6"][class*="option5"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab6', 'rocket4');
            setCurrentOptionPane('rocket4');
            updateContent(`${getRocketUserName('rocket4')}`, 'tab6', 'content');
            setFirstAccessArray('rocket4');
        });
    });

    document.querySelectorAll('[class*="tab6"][class*="option6"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab6', 'space telescope');
            setCurrentOptionPane('space telescope');
            updateContent('Space Telescope', 'tab6', 'content');
            setFirstAccessArray('space telescope');
        });
    });

    document.querySelectorAll('[class*="tab6"][class*="option7"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab6', 'asteroids');
            setCurrentOptionPane('asteroids');
            updateContent('Asteroids', 'tab6', 'content');
            setFirstAccessArray('asteroids');
        });
    });

    document.querySelectorAll('[class*="tab6"][class*="option8"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setHasAntimatterSvgRightBoxDataChanged(null);
            setLastScreenOpenRegister('tab6', 'mining');
            setCurrentOptionPane('mining');
            updateContent('Mining', 'tab6', 'content');
            setFirstAccessArray('mining');
        });
    });

    document.querySelectorAll('[class*="tab7"][class*="option1"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab7', 'rebirth');
            setCurrentOptionPane('rebirth');
            updateContent('Rebirth', 'tab7', 'content');
            setFirstAccessArray('rebirth');
        });
    });

    document.querySelectorAll('[class*="tab7"][class*="option2"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab7', 'galactic market');
            setCurrentOptionPane('galactic market');
            updateContent('Galactic Market', 'tab7', 'content');
            setFirstAccessArray('galactic market');
        });
    });

    document.querySelectorAll('[class*="tab7"][class*="option3"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab7', 'ascendency');
            setCurrentOptionPane('ascendency');
            updateContent('Ascendency', 'tab7', 'content');
            setFirstAccessArray('ascendency');
        });
    });

    document.querySelectorAll('[class*="tab7"][class*="option4"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab7', 'megastructures');
            setCurrentOptionPane('megastructures');
            updateContent('Megastructures', 'tab7', 'content');
            setFirstAccessArray('megastructures');
        });
    });
    
    document.querySelectorAll('[class*="tab8"][class*="option1"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab8', 'visual');
            setCurrentOptionPane('visual');
            updateContent('Visual', 'tab8', 'content');
            setFirstAccessArray('visual');
        });
    });
    
    document.querySelectorAll('[class*="tab8"][class*="option2"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab8', 'saving / loading');
            setCurrentOptionPane('saving / loading');
            updateContent('Saving / Loading', 'tab8', 'content');
            setFirstAccessArray('saving / loading');
        });
    });

    document.querySelectorAll('[class*="tab8"][class*="option3"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab8', 'game options');
            setCurrentOptionPane('game options');
            updateContent('Game Options', 'tab8', 'content');
            setFirstAccessArray('game options');
        });
    });

    document.querySelectorAll('[class*="tab8"][class*="option4"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab8', 'get started');
            setCurrentOptionPane('get started');
            updateContent('Get Started', 'tab8', 'content');
            setFirstAccessArray('get started');
        });
    });
    
    document.querySelectorAll('[class*="tab8"][class*="option5"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab8', 'concepts - early');
            setCurrentOptionPane('concepts - early');
            updateContent('Concepts - Early', 'tab8', 'content');
            setFirstAccessArray('concepts - early');
        });
    });
    
    document.querySelectorAll('[class*="tab8"][class*="option6"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab8', 'concepts - mid');
            setCurrentOptionPane('concepts - mid');
            updateContent('Concepts - Mid', 'tab8', 'content');
            setFirstAccessArray('concepts - mid');
        });
    });
    
    document.querySelectorAll('[class*="tab8"][class*="option7"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab8', 'concepts - late');
            setCurrentOptionPane('concepts - late');
            updateContent('Concepts - Late', 'tab8', 'content');
            setFirstAccessArray('concepts - late');
        });    
    });

    document.querySelectorAll('[class*="tab8"][class*="option8"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab8', 'statistics');
            setCurrentOptionPane('statistics');
            updateContent('Statistics', 'tab8', 'content');
            setFirstAccessArray('statistics');
        });    
    });

    document.querySelectorAll('[class*="tab8"][class*="option9"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab8', 'contact');
            setCurrentOptionPane('contact');
            updateContent('Contact', 'tab8', 'content');
            setFirstAccessArray('contact');
        });    
    });

    document.querySelectorAll('[class*="tab8"][class*="option10"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab8', 'achievements');
            setCurrentOptionPane('achievements');
            refreshAchievementTooltipDescriptions();
            updateContent('Achievements', 'tab8', 'content');
            setFirstAccessArray('achievements');
        });    
    });

    document.querySelectorAll('[class*="tab8"][class*="option11"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab8', 'philosophies');
            setLastScreenOpenRegister('tab8', 'philosophies');
            setCurrentOptionPane('philosophies');
            updateContent('Philosophies', 'tab8', 'content');
            setFirstAccessArray('philosophies');
        });    
    });

    document.querySelectorAll('[class*="tab8"][class*="option12"]').forEach(function(element) {
        element.addEventListener('click', function() {
            selectRowCss(this);
            setLastScreenOpenRegister('tab8', 'story');
            setLastScreenOpenRegister('tab8', 'story');
            setCurrentOptionPane('story');
            updateContent('Story', 'tab8', 'content');
            setFirstAccessArray('story');
        });    
    });

    function selectRowCss(clickedItem) {
        const tabClassName = Array.from(clickedItem.classList).find(cls => cls.startsWith('tab'));
        if (!tabClassName) return;
        const [tabClass, optionClass] = tabClassName.split('.');
        if (!tabClass || !optionClass) return;
        
        document.querySelectorAll('.row-side-menu').forEach(i => i.classList.remove('row-side-menu-selected'));
        clickedItem.parentElement?.parentElement?.classList.add('row-side-menu-selected');
    }

    const tabsContainer = document.getElementById('tabsContainer');

    if (tabsContainer) {
        const tabs = Array.from(tabsContainer.children);
    
        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                playClickSfx();

                const dynamicIndex = parseInt(tab.id.replace('tab', ''), 10);
    
                setCurrentTab([dynamicIndex, document.getElementById('tab' + dynamicIndex).textContent]);
                highlightActiveTab(tab.textContent);
                setGameState(getGameVisibleActive());
    
                let content = tab.textContent;
                if (content === '☰') {
                    content = 'Settings';
                }

                if (!content.includes('Interstellar')) {
                    removeStarConnectionTooltip();
                    if (document.getElementById('descriptionContentTab5') && !getStarShipTravelling()) {
                        document.getElementById('descriptionContentTab5').innerHTML = getHeaderDescriptions('star map');
                    }
                } else {
                    if (getStarShipTravelling() && getCurrentOptionPane() === 'star map') {
                        drawStarConnectionDrawings(getCurrentStarSystem(), getDestinationStar(), 'travelling');
                        const starData = getStarSystemDataObject('stars');
                        createStarDestinationRow(starData[getDestinationStar()], 'travelling');
                        spaceTravelButtonHideAndShowDescription();
                    }
                }
    
                if (!getLastScreenOpenRegister(`tab${dynamicIndex}`)) {
                    updateContent(content, `tab${dynamicIndex}`, 'intro');
                }
    
                const lastOpenOptionPane = getLastScreenOpenRegister('tab' + getCurrentTab()[0]);
                if (lastOpenOptionPane) {
                    if (lastOpenOptionPane === 'space telescope') { //hack to refresh timer if ongoing
                        const optionContentElement = document.getElementById(`optionContentTab6`);
                        optionContentElement.innerHTML = '';
                        drawTab6Content('Space Telescope', optionContentElement);
                    } else if (lastOpenOptionPane === 'galactic market') {
                        const optionContentElement = document.getElementById(`optionContentTab7`);
                        optionContentElement.innerHTML = '';
                        drawTab7Content('Galactic Market', optionContentElement);
                    } else if (["power plant", "advanced power plant", "solar power plant"].includes(lastOpenOptionPane)) {
                        const optionContentElement = document.getElementById(`optionContentTab2`);
                        optionContentElement.innerHTML = '';
                        const formattedPaneName = lastOpenOptionPane
                            .split(' ')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ');
                    
                        drawTab2Content(formattedPaneName, optionContentElement);
                    } else if (["hydrogen", "helium", "carbon", "neon", "oxygen", "sodium", "silicon", "iron"].includes(lastOpenOptionPane)) {
                        const optionContentElement = document.getElementById(`optionContentTab1`);
                        optionContentElement.innerHTML = '';
                        setCurrentOptionPane(lastOpenOptionPane);
                        updateContent(capitaliseString(lastOpenOptionPane), 'tab1', 'content');
                        fuseButton = document.querySelector('button.fuse');
                        setSellFuseCreateTextDescriptionClassesBasedOnButtonStates(fuseButton, 'fuse');
                        setAutoSellToggleState(lastOpenOptionPane, 'resources');
                    } else if (["diesel", "glass", "steel", "concrete", "water", "titanium"].includes(lastOpenOptionPane)) {
                        const optionContentElement = document.getElementById(`optionContentTab4`);
                        optionContentElement.innerHTML = '';
                        setCurrentOptionPane(lastOpenOptionPane);
                        updateContent(capitaliseString(lastOpenOptionPane), 'tab4', 'content');
                        setAutoSellToggleState(lastOpenOptionPane, 'compounds');
                        setAutoCreateToggleState(lastOpenOptionPane);
                    }
                    setCurrentOptionPane(lastOpenOptionPane);
                }
            });
        });
    }  
}

export function spaceTravelButtonHideAndShowDescription() {
    const descriptionDiv = document.getElementById('starDestinationDescription');
    const buttonDiv = document.getElementById('starDestinationButton');
    if (descriptionDiv && getStarShipTravelling()) {
        descriptionDiv.classList.remove('invisible');
    }
    if (buttonDiv && (getStarShipTravelling() || !getStarShipBuilt())) {
        buttonDiv.classList.add('invisible');
    }
}

export async function showNewsTickerMessage(newsTickerContainer) {
    const randomValue = Math.random();
    let category;

    if (randomValue < 0.03) {
        category = "oneOff";
    } else if (randomValue < 0.13) {
        category = "prize";
    } else if (randomValue < 0.28) {
        category = "wackyEffects";
    } else {
        category = "noPrize";
    }

    const randomIndex = Math.floor(Math.random() * newsTickerContainer[category].length);

    let message = newsTickerContainer[category][randomIndex];
    // let message = newsTickerContainer['wackyEffects'][newsTickerContainer['wackyEffects'].length - 1]; //DEBUG MESSAGES
    // category = 'wackyEffects'; //DEBUG

    if (category === 'prize' || category === 'oneOff' || category === 'wackyEffects') {
        if (category === 'oneOff') {
            if (getOneOffPrizesAlreadyClaimedArray().includes(randomIndex)) {
                message = false;
            } else {
                addMessageToSeenArray(message.id);
                message = await specialMessageBuilder(message, category);
            }
        } else {
            addMessageToSeenArray(message.id)
           message = await specialMessageBuilder(message, category);
        }
    }

    if (message === false || message === undefined || message.includes('Wanna Give FeedBack') && !getFeedbackCanBeRequested()) {
        showNewsTickerMessage(newsTickerContainer);
    } else {
        if (category === 'noPrize') {
            addMessageToSeenArray(randomIndex);
        }
        displayNewsTickerMessage(message);
    }  
}

function addMessageToSeenArray(id) {
    if (!getAlreadySeenNewsTickerArray().includes(id)) {
        setAlreadySeenNewsTickerArray(id);
    }
}

function displayNewsTickerMessage(message) {
    const newsTicker = document.querySelector('.news-ticker-content');
    const container = document.querySelector('.news-ticker-container');

    newsTicker.innerHTML = '';

    const textElement = document.createElement('div');
    textElement.classList.add('news-ticker-text');
    textElement.innerHTML = message;

    newsTicker.appendChild(textElement);

    const containerWidth = container.offsetWidth;
    const additionalOffset = containerWidth * 0.3;
    const scrollDuration = getNewsTickerScrollDuration();

    textElement.style.animation = `scrollNews ${scrollDuration / 1000}s linear infinite`;
    textElement.style.animationName = 'scrollNews';

    const keyframes = `
        @keyframes scrollNews {
            0% {
                transform: translateX(${containerWidth}px);
            }
            100% {
                transform: translateX(-${containerWidth + additionalOffset}px);
            }
        }
    `;

    const styleTag = document.createElement('style');
    styleTag.textContent = keyframes;
    document.head.appendChild(styleTag);

    let timeoutId;
    let prizeElement = document.getElementById('prizeTickerSpan');
    let prizeElement2 = document.getElementById('prizeTickerSpan2');

    function handleVisibilityChange() {
        if (document.hidden) {
            newsTicker.classList.add('invisible');
            if (prizeElement) {
                document.querySelector('.news-ticker-content').style.animation = 'none';
                prizeElement.remove();
            }
            if (prizeElement2) {
                document.querySelector('.news-ticker-content').style.animation = 'none';
                prizeElement2.remove();
            }
            clearTimeout(timeoutId);
        } else {
            if (getNewsTickerSetting()) {
                startNewsTickerTimer();
            }
        }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    timeoutId = setTimeout(() => {
        newsTicker.classList.add('invisible');
        if (prizeElement) {
            document.querySelector('.news-ticker-content').style.animation = 'none';
            prizeElement.remove();
        } 
        if (prizeElement2) {
            document.querySelector('.news-ticker-content').style.animation = 'none';
            prizeElement2.remove();
        }       
        document.head.removeChild(styleTag);
        startNewsTickerTimer();
        clearTimeout(timeoutId);
    }, scrollDuration);
}

function specialMessageBuilder(message, prizeCategory) {
    if (prizeCategory === 'prize') {
        if (message.type === 'giftResource') {
            let amountToAdd = 0;

            const visible = !getElements()[message.item + 'Option'].parentElement.parentElement.classList.contains('invisible');
            if (message.condition === 'visible' && visible) {
                let currentResourceQuantity, resourceStorageCapacity;

                if (message.category === "antimatter") {
                    currentResourceQuantity = getResourceDataObject("antimatter", ["quantity"]);
                    resourceStorageCapacity = getResourceDataObject("antimatter", ["storageCapacity"]);
                } else {
                    currentResourceQuantity = getResourceDataObject(message.category, [message.item, "quantity"]);
                    resourceStorageCapacity = getResourceDataObject(message.category, [message.item, "storageCapacity"]);
                }

                const difference = resourceStorageCapacity - currentResourceQuantity;
            
                if (difference === 0) {
                    return false;
                }
            
                amountToAdd = Math.min(Math.floor(Math.random() * difference) + 1, resourceStorageCapacity / 10);
            } else {
                return false;
            }

            let newMessage = message.body;
            newMessage = newMessage.replace('xxx', amountToAdd);
    
            const linkWord = message.linkWord;
            const linkWordRegex = new RegExp(`\\b${linkWord}\\b`, 'g');
    
            newMessage = newMessage.replace(linkWordRegex, `
                <span id="prizeTickerSpan" 
                    data-prize-type="giftResource" 
                    data-category="${message.category}" 
                    data-item="${message.item}"
                    data-data1="${amountToAdd}">
                    ${linkWord}
                </span>
            `);
    
            deferredActions.push(() => {
                addPrizeEventListeners();
            });
    
            return newMessage;
        }

    } else if (prizeCategory === 'oneOff') {
        if (!getOneOffPrizesAlreadyClaimedArray().includes(message.id)) {
            setOneOffPrizesAlreadyClaimedArray(message.id);
            const multiplier = message.type[1];
    
            let newMessage = message.body;
            const linkWord = message.linkWord;
            const linkWordRegex = new RegExp(`\\b${linkWord}\\b`, 'g');
    
            newMessage = newMessage.replace(linkWordRegex, `
                <span 
                    id="prizeTickerSpan"
                    data-oneoff-id='${message.id}' 
                    data-category='${JSON.stringify(message.category)}'
                    data-item='${typeof message.item === 'string' ? message.item : JSON.stringify(message.item)}'  
                    data-type='${message.type[0]}' 
                    data-multiplier='${multiplier}'>
                    ${linkWord}
                </span>
            `);
    
            deferredActions.push(() => {
                addOneOffEventListeners(); //at this point we have not already claimed it and we are definitely applying it no matter what
            });
    
            return newMessage;
        } else {
            return false;
        }
    } else if (prizeCategory === 'wackyEffects') {
        let newMessage = message.body;
        const linkWord = message.linkWord;
        const linkWord2 = message.linkWord2;

        if (newMessage.includes(linkWord)) {
            newMessage = newMessage.split(linkWord).join(`
                <span 
                    id="prizeTickerSpan"
                    ${message.class ? `class="${message.class}"` : ''} 
                    data-effect-item='${message.item}'>
                    ${linkWord}
                </span>
            `);
        }

        if (linkWord2 !== '' && newMessage.includes(linkWord2)) {
            newMessage = newMessage.split(linkWord2).join(`
                <span 
                    id="prizeTickerSpan2"
                    ${message.class ? `class="${message.class}"` : ''} 
                    data-effect-item='${message.item}'>
                    ${linkWord2}
                </span>
            `);
        }
    
        deferredActions.push(() => {
            addWackyEffectsEventListeners();
        });
    
        return newMessage;
    }
}

function addOneOffEventListeners() {
    const oneOffElement = document.getElementById('prizeTickerSpan');

    if (oneOffElement !== null) {
        oneOffElement.addEventListener('click', function () {
            addToResourceAllTimeStat(1, 'newsTickerPrizesCollected');
            sfxPlayer.playAudio('goodPrize');
            const multiplier = parseFloat(this.getAttribute('data-multiplier'));
    
            let categoryArray;
            if (this.getAttribute("data-category") === "antimatter") {
                categoryArray = ["antimatter"];
            } else {
                categoryArray = JSON.parse(this.getAttribute("data-category"));
            }
    
            let item = this.getAttribute('data-item');
    
            if (item.startsWith('[') && item.endsWith(']')) {
                item = JSON.parse(item);
            }
    
            const type = this.getAttribute('data-type');
    
            let resourcesToInclude = getResourceDataObject('resources');
            let compoundsToInclude = getResourceDataObject('compounds');
    
            let resourcesAndCompoundsToInclude = {
                resources: resourcesToInclude,
                compounds: compoundsToInclude
            };
    
            resourcesToInclude = filterObjectsByCondition(resourcesToInclude);
            compoundsToInclude = filterObjectsByCondition(compoundsToInclude);
    
            if (type === 'storageMultiplier') {
                categoryArray.forEach(category => { // resource or compounds storage capacity
                    if (category === 'resources' || category === 'compounds') {
                        const categoryTypeToUse = category === 'resources' ? resourcesToInclude : compoundsToInclude;
                        Object.keys(categoryTypeToUse).forEach(element => {
                            setResourceDataObject(
                                Math.floor(
                                    getResourceDataObject(category, [element, 'storageCapacity']) * multiplier
                                ),
                                category,
                                [element, 'storageCapacity']
                            );
                        });
                    } else if (category === 'buildings') { //battery storage capacity
                        const buyBuildingButtonElement = document.querySelector(`#${item[0]}${capitaliseString(item[1])}Row .option-row-main .input-container .building-purchase-button`);
    
                        const quantityOfBuilding = getResourceDataObject('buildings', [item[0], 'upgrades', item[1], 'quantity']);
                        const currentCapacityOfBuilding = Math.floor(quantityOfBuilding * getResourceDataObject('buildings', [item[0], 'upgrades', item[1], 'capacity']) * quantityOfBuilding);
                        const currentTotalCapacityMinusBuildingType = Math.floor(getResourceDataObject('buildings', [item[0], 'storageCapacity']) - currentCapacityOfBuilding);
                        const newTotalCapacity = Math.floor(currentTotalCapacityMinusBuildingType + (currentCapacityOfBuilding * multiplier));
    
                        setResourceDataObject(newTotalCapacity, 'buildings', [item[0], 'storageCapacity']);
                        setResourceDataObject(Math.floor(getResourceDataObject('buildings', [item[0], 'upgrades', item[1], 'capacity']) * multiplier),'buildings',[item[0], 'upgrades', item[1], 'capacity']);
                       
                        if (buyBuildingButtonElement)  {
                            buyBuildingButtonElement.innerHTML = `Add ${Math.floor(getResourceDataObject('buildings', [item[0], 'upgrades', item[1], 'capacity']) / 1000)} MWh`;
                        }
                    }
                });
            } else if (type === 'rateMultiplier') {
                categoryArray.forEach(category => { // resource, compounds, or building rate multiplier
                    if (category === 'resources' || category === 'compounds') {
                        const categoryTypeToUse = category === 'resources' ? resourcesToInclude : compoundsToInclude;
                        Object.keys(categoryTypeToUse).forEach(element => { //set future purchase rate * multiplier
                            setResourceDataObject(getResourceDataObject(category, [element, 'upgrades', 'autoBuyer', item[1], 'rate']) * multiplier, category, [element, 'upgrades', 'autoBuyer', item[1], 'rate']
                            );
    
                            if (getCurrentOptionPane() === element) { //set autobuyer button text if on that screen at the moment prize is clicked
                                const buyBuildingButtonElement = document.querySelector(`#${element}AutoBuyer${item[1].replace(/^\D+/g, '')}Row .option-row-main .input-container button[data-auto-buyer-tier="${item[1]}`);
                                buyBuildingButtonElement.innerHTML = `Add ${getResourceDataObject(category, [element, 'upgrades', 'autoBuyer', item[1], 'rate']) * getTimerRateRatio()} ${capitaliseString(element)} /s`;
                            }
                        });
                    } else if (category === 'buildings') { // building rate multiplier e.g. Power Plants
                        const buyBuildingButtonElement = document.querySelector(`#${item[0]}${capitaliseString(item[1])}Row .option-row-main .input-container .building-purchase-button`);
                        const rateElement = document.getElementById(`${item[1]}Rate`);
                        
                        const currentPurchasedRateOfBuilding = getResourceDataObject('buildings', [item[0], 'upgrades', item[1], 'purchasedRate']);
                        const newPurchasedRateOfBuilding = (currentPurchasedRateOfBuilding * multiplier);
    
                        const currentRatePerBuilding = getResourceDataObject('buildings', [item[0], 'upgrades', item[1], 'rate']);
                        const newRateOfBuilding = (currentRatePerBuilding * multiplier);
    
                        setResourceDataObject(newPurchasedRateOfBuilding, 'buildings', [item[0], 'upgrades', item[1], 'purchasedRate']);
                        setResourceDataObject(newRateOfBuilding, 'buildings', [item[0], 'upgrades', item[1], 'rate']);
            
                        if (buyBuildingButtonElement) {
                            buyBuildingButtonElement.innerHTML = `Add ${Math.floor(newRateOfBuilding * getTimerRateRatio())} KW /s`;
                        }
    
                        if (rateElement) {
                            const quantityOfBuilding = getResourceDataObject('buildings', [item[0], 'upgrades', item[1], 'quantity']);
                            rateElement.innerHTML = `${Math.floor((newRateOfBuilding * getTimerRateRatio()) * quantityOfBuilding)} KW / s`;
                        }
                    }
                });
            } else if (type === 'adder') {
                const itemToAddType = categoryArray;
                const quantityToAdd = multiplier;
                setResourceDataObject(getResourceDataObject(itemToAddType, ['quantity']) + quantityToAdd, itemToAddType, ['quantity']);
                if (itemToAddType === 'antimatter') {
                    addToResourceAllTimeStat(quantityToAdd, 'antimatter');
                    addToResourceAllTimeStat(quantityToAdd, 'antimatterThisRun');
                } else if (itemToAddType === 'ascendencyPoints') {
                    addToResourceAllTimeStat(quantityToAdd, 'totalApGain')
                }
            }
    
            this.style.pointerEvents = 'none';
            this.style.opacity = '0.5';
        });
    }
}

function filterObjectsByCondition(dataObject) {
    let filteredObject = {};
    for (let key in dataObject) {
        if (dataObject.hasOwnProperty(key)) {
            let element = document.getElementById(key + 'Option');
            if (
                element &&
                element.parentElement &&
                element.parentElement.parentElement &&
                !element.parentElement.parentElement.classList.contains('invisible')
            ) {
                filteredObject[key] = dataObject[key];
            }
        }
    }
    return filteredObject;
}

function addPrizeEventListeners() {
    const prizeElement = document.getElementById('prizeTickerSpan');
    if (prizeElement) {
        prizeElement.addEventListener('click', function () {
            sfxPlayer.playAudio('goodPrize');
            const prizeType = this.getAttribute('data-prize-type');
            const category = this.getAttribute('data-category');
            const item = this.getAttribute('data-item');
            const quantityToAdd = parseInt(this.getAttribute('data-data1'));
            addToResourceAllTimeStat(1, 'newsTickerPrizesCollected');

            switch (prizeType) {
                case 'giftResource': //storage checks already done before getting here
                    setResourceDataObject(
                        getResourceDataObject(category, [item, 'quantity']) + quantityToAdd,
                        category,
                        [item, 'quantity']
                    );
                    addToResourceAllTimeStat(quantityToAdd, item);
                    break;
                default:
                    break;
            }

            this.style.pointerEvents = 'none';
            this.style.opacity = '0.5';
        });
    }
}

function addWackyEffectsEventListeners() {
    const prizeTickerSpan = document.getElementById('prizeTickerSpan');
    const prizeTickerSpan2 = document.getElementById('prizeTickerSpan2');
    
    if (!prizeTickerSpan) return;

    prizeTickerSpan.addEventListener('click', () => {
        const effectItem = prizeTickerSpan.getAttribute('data-effect-item');
        let targetElement = prizeTickerSpan.parentElement;

        if (!targetElement) return;

        const existingAnimation = targetElement.style.animation || '';
        let newAnimation = existingAnimation;
        let otherElement = prizeTickerSpan.parentElement.parentElement.querySelector('span#prizeTickerSpan2');

        switch (effectItem) {
            case 'wave':
                //add sound effect
                targetElement = prizeTickerSpan.parentElement.parentElement;
                newAnimation += ', waveAnimation 2s infinite alternate ease-in-out';
                prizeTickerSpan.style.opacity = '0.5';
                break;
            case 'disco':
                //add sound effect
                targetElement = prizeTickerSpan.parentElement;
                prizeTickerSpan.classList.add('disco');
                break;
            case 'bounce':
                //add sound effect
                targetElement = prizeTickerSpan.parentElement.parentElement;
                newAnimation += ', bounceAnimation 1s infinite ease-in-out';
                prizeTickerSpan.style.opacity = '0.8';
                break;
            case 'fade':
                //add sound effect
                newAnimation += ', fadeAnimation 1s infinite alternate';
                prizeTickerSpan.style.opacity = '0.5';
                break;
            case 'glitch':
                //add sound effect
                targetElement = prizeTickerSpan.parentElement.parentElement;
                newAnimation += ', glitchAnimation 0.1s infinite';
                prizeTickerSpan.style.opacity = '0.5';
                break;
            case 'wobble':
                //add sound effect
                targetElement = prizeTickerSpan.parentElement.parentElement;
                newAnimation += ', wobbleAnimation 1s infinite ease-in-out';
                prizeTickerSpan.style.opacity = '0.5';
                break;
            case 'boo':
                //add sound effect
                prizeTickerSpan.classList.remove('boo');
                break;
            case 'feedback':
                targetElement = prizeTickerSpan.parentElement.parentElement;
                newAnimation += ', feedbackGood 0.4s ease-in-out forwards';
                prizeTickerSpan.style.opacity = '0.5';
                if (otherElement) {
                    otherElement.style.opacity = '0.5';
                }
                break;
            default:
                console.warn('Unknown effect item:', effectItem);
                break;
        }

        if (effectItem === 'feedback') {
            setActivatedWackyNewsEffectsArray(effectItem, 'good');
            if (getFeedbackCanBeRequested()) {
                triggerFeedBackModal('good');
            }
        } else {
            setActivatedWackyNewsEffectsArray(effectItem);
        }
        
        targetElement.style.animation = newAnimation;

        prizeTickerSpan.style.pointerEvents = 'none';
        if (otherElement) {
            otherElement.style.pointerEvents = 'none';
        }
    });

    if (prizeTickerSpan2) {
        prizeTickerSpan2.addEventListener('click', () => {
            const effectItem = prizeTickerSpan2.getAttribute('data-effect-item');
            let targetElement = prizeTickerSpan2.parentElement;
        
            if (!targetElement) return;
        
            const existingAnimation = targetElement.style.animation || '';
            let newAnimation = existingAnimation;
            let otherElement = prizeTickerSpan2.parentElement.parentElement.querySelector('span#prizeTickerSpan');
        
            switch (effectItem) {
                case 'feedback':
                    targetElement = prizeTickerSpan2.parentElement.parentElement;
                    newAnimation += ', feedbackBad 0.4s ease-in-out forwards';
                    prizeTickerSpan2.style.opacity = '0.5';
                    if (otherElement) {
                        otherElement.style.opacity = '0.5';
                        otherElement.style.pointerEvents = 'none';
                    }
                    break;
                default:
                    console.warn('Unknown effect item:', effectItem);
                    break;
            }
        
            if (effectItem === 'feedback') {
                setActivatedWackyNewsEffectsArray(effectItem, 'bad');
                if (getFeedbackCanBeRequested()) {
                    triggerFeedBackModal('bad');
                }
            }  else {
                setActivatedWackyNewsEffectsArray(effectItem);
            }
            
            targetElement.style.animation = newAnimation;
        
            prizeTickerSpan2.style.pointerEvents = 'none';
            if (otherElement) {
                otherElement.style.pointerEvents = 'none';
            }
        });
    }
}

let particleInterval;

export function startWeatherEffect(type) {
    const weatherEffectOverlay = document.getElementById('weatherEffectOverlay');
    if (!weatherEffectOverlay) return;

    weatherEffectOverlay.style.display = 'block';

    const overlayHeight = 1000;
    const fallDuration = 0.003;

    const classNameToAddToParticle = type === 'rain' ? 'raindrop' : type === 'volcano' ? 'lavadrop' : null;

    if (!classNameToAddToParticle) {
        console.error('Invalid weather effect type:', type);
        return;
    }

    if (particleInterval) {
        clearInterval(particleInterval);
    }

    particleInterval = setInterval(() => {
        const drop = document.createElement('div');
        drop.classList.add(classNameToAddToParticle);

        const randomX = Math.random() * 5000;
        drop.style.left = `${randomX}px`;

        const adjustedDuration = overlayHeight * fallDuration;
        drop.style.animationDuration = `${adjustedDuration}s`;

        weatherEffectOverlay.appendChild(drop);

        setTimeout(() => {
            drop.remove();
        }, adjustedDuration * 1000);
    }, 20);
}

export function stopWeatherEffect() {
    const weatherEffectOverlay = document.getElementById('weatherEffectOverlay');

    if (!weatherEffectOverlay) return;

    if (particleInterval) {
        clearInterval(particleInterval);
    }

    particleInterval = null;

    weatherEffectOverlay.style.display = 'none';

    const particles = weatherEffectOverlay.querySelectorAll('.raindrop, .lavadrop');
    particles.forEach(particle => particle.remove());
}

export function toggleGameFullScreen() {
    if (!document.fullscreenElement) {
        if (document.body.requestFullscreen) {
            document.body.requestFullscreen();
        } else if (document.body.mozRequestFullScreen) {
            document.body.mozRequestFullScreen();
        } else if (document.body.webkitRequestFullscreen) {
            document.body.webkitRequestFullscreen();
        } else if (document.body.msRequestFullscreen) {
            document.body.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

export function switchFuelGaugeWhenFuellerBought(rocket, type) {
    const fuellerBought = getRocketsFuellerStartedArray().some(item => item === rocket && !item.includes('FuelledUp'));

    if ((fuellerBought || type !== 'normal') && getCurrentOptionPane() === rocket) {
        if (type === 'normal') {
            const progressFuelingElement = document.getElementById(rocket + 'FuellingProgressBarContainer');
            const rocketLaunchButton = document.querySelector('button.rocket-fuelled-check');
            progressFuelingElement.classList.remove('invisible');
            rocketLaunchButton.classList.remove('invisible');
        } else {
            const optionContentElement = document.getElementById(`optionContentTab6`);
            optionContentElement.innerHTML = '';
            drawTab6Content(`${getRocketUserName(rocket)}`, optionContentElement);
        }

    }
}

export function switchBatteryStatBarWhenBatteryBought() {
    const batteryNo = document.getElementById('batteryNo');
    const batteryIndicatorBarContainer = document.getElementById('batteryBarContainer');

    if (getResourceDataObject('buildings', ['energy', 'batteryBoughtYet'])) {
        if (batteryNo && batteryIndicatorBarContainer) {
            batteryNo.classList.add('invisible');
            batteryIndicatorBarContainer.classList.remove('invisible');
            return getBatteryLevel();
        }
    } else {
        batteryNo.classList.remove('invisible');
        batteryIndicatorBarContainer.classList.add('invisible');
        return null;
    }
}

export function setBatteryIndicator(value) {
    const batteryBarContainer = document.getElementById('batteryBarContainer');
    batteryBarContainer.classList.remove('invisible');

    let batteryBar = document.getElementById('batteryBar');
    if (!batteryBar) {
        batteryBar = document.createElement('div');
        batteryBar.id = 'batteryBar';
        batteryBarContainer.appendChild(batteryBar);
    }

    let indicatorSymbol = document.getElementById('indicatorSymbol');
    if (!indicatorSymbol) {
        indicatorSymbol = document.createElement('span');
        indicatorSymbol.id = 'indicatorSymbol';
        batteryBarContainer.parentElement.appendChild(indicatorSymbol);
    }

    const energyRate = getInfinitePower() ? getInfinitePowerRate() : getResourceDataObject('buildings', ['energy', 'rate']);
    const consumption = getResourceDataObject('buildings', ['energy', 'consumption']);

    if (energyRate > consumption && getPowerOnOff()) {
        indicatorSymbol.innerHTML = '▲';
        indicatorSymbol.style.color = 'var(--ready-text)';
    } else if (energyRate < consumption && getPowerOnOff()) {
        indicatorSymbol.innerHTML = '▼';
        indicatorSymbol.style.color = 'var(--disabled-text)';
    } else {
        indicatorSymbol.innerHTML = '-';
        indicatorSymbol.style.color = 'var(--text-color)';
    }

    batteryBar.style.width = `${value}%`;

    if (value === 100) {
        batteryBar.style.setProperty('background-color', 'var(--ready-text)', 'important');
    } else if (value > 25) {
        batteryBar.style.setProperty('background-color', 'var(--text-color)', 'important');
    } else if (value > 10) {
        batteryBar.style.setProperty('background-color', 'var(--warning-text)', 'important');
    } else {
        batteryBar.style.setProperty('background-color', 'var(--disabled-text)', 'important');
    }
}

export function handleSortAsteroidClick(sortMethod) {
    setSortAsteroidMethod(sortMethod);
    const optionContentElement = document.getElementById(`optionContentTab6`);
    optionContentElement.innerHTML = '';
    drawTab6Content('Asteroids', optionContentElement);
}

export function handleSortStarClick(sortMethod) {
    setSortStarMethod(sortMethod);
    const optionContentElement = document.getElementById(`optionContentTab5`);
    optionContentElement.innerHTML = '';
    drawTab5Content('Star Data', optionContentElement, false, false);
}

export function sortStarTable(starsObject, sortMethod) {
    const labels = {
        distance: document.getElementById('starLegendDistance'),
        weather: document.getElementById('starLegendWeatherProb'),
        precipitationType: document.getElementById('starLegendPrecipitationType'),
        fuel: document.getElementById('starLegendFuel'),
        ascendencyPoints: document.getElementById('starLegendAscendencyPoints')
    };

    Object.values(labels).forEach(label => label.classList.remove('sort-by'));

    if (labels[sortMethod]) {
        labels[sortMethod].classList.add('sort-by');
    }

    Object.entries(labels).forEach(([key, label]) => {
        if (key !== sortMethod) {
            label.classList.add('no-sort');
        }
    });

    let sortedEntries = Object.entries(starsObject).sort(([keyA, starA], [keyB, starB]) => {
        switch (sortMethod) {
            case "distance":
                return starA.distance - starB.distance;
            case "weather":
                const weatherPriority = {
                    "☀": 1,
                    "☁": 2,
                    "☂": 3,
                    "⛰": 4
                };
                const weatherIconA = starA.weatherTendency[0]; 
                const weatherIconB = starB.weatherTendency[0];
                const weatherProbabilityA = starA.weatherTendency[1];
                const weatherProbabilityB = starB.weatherTendency[1];

                if (weatherPriority[weatherIconA] !== weatherPriority[weatherIconB]) {
                    return weatherPriority[weatherIconA] - weatherPriority[weatherIconB];
                }

                return weatherProbabilityB - weatherProbabilityA;
            case "precipitationType":
                return starA.precipitationType.localeCompare(starB.precipitationType);
            case "fuel":
                return starA.fuel - starB.fuel;
            case "ascendencyPoints":
                return starA.ascendencyPoints - starB.ascendencyPoints;
            default:
                return 0;
        }
    });

    const factoryStars = getFactoryStarsArray();
    const manuscripts = getStarsWithAncientManuscripts();

    sortedEntries = sortedEntries.filter(([name, star]) => {
        return !(
            factoryStars.includes(name) &&
            manuscripts.some(entry => entry[1] === name && entry[3] === false)
        );
    });

    return Object.fromEntries(sortedEntries);
}

export function sortAsteroidTable(asteroidsArray, sortMethod) {
    const labels = {
        rarity: document.getElementById('asteroidLegendRarity'),
        distance: document.getElementById('asteroidLegendDistance'),
        eoe: document.getElementById('asteroidLegendEOE'),
        quantity: document.getElementById('asteroidLegendQuantity')
    };

    Object.values(labels).forEach(label => label.classList.remove('sort-by'));

    if (labels[sortMethod]) {
        labels[sortMethod].classList.add('sort-by');
    }

    Object.entries(labels).forEach(([key, label]) => {
        if (key !== sortMethod) {
            label.classList.add('no-sort');
        }
    });

    asteroidsArray.sort((a, b) => {
        const nameA = Object.keys(a)[0];
        const nameB = Object.keys(b)[0];

        const asteroidA = a[nameA];
        const asteroidB = b[nameB];

        const isExhaustedA = asteroidA.quantity[0] === 0;
        const isExhaustedB = asteroidB.quantity[0] === 0;
        const isMinedA = asteroidA.beingMined;
        const isMinedB = asteroidB.beingMined;

        if (isExhaustedA && !isExhaustedB) return 1;
        if (!isExhaustedA && isExhaustedB) return -1;

        if (isMinedA && !isMinedB) return 1;
        if (!isMinedA && isMinedB) return -1;

        switch (sortMethod) {
            case "rarity":
                const rarityOrder = { "Legendary": 1, "Rare": 2, "Uncommon": 3, "Common": 4 };
                return rarityOrder[asteroidA.rarity[0]] - rarityOrder[asteroidB.rarity[0]];

            case "distance":
                return asteroidA.distance[0] - asteroidB.distance[0];

            case "eoe":
                return asteroidA.easeOfExtraction[0] - asteroidB.easeOfExtraction[0];

            case "quantity":
                return asteroidB.quantity[0] - asteroidA.quantity[0];

            default:
                return 0;
        }
    });

    return asteroidsArray;
}

export function renameRocket(rocketId, originalRocketKey) {
    const newRocketName = document.getElementById(`${rocketId}NameField`).textContent.trim(); 
    const newRocketKey = newRocketName.toLowerCase();

    setRocketUserName(rocketId, newRocketName);

    if (originalRocketKey in rocketNames) {
        rocketNames[newRocketKey] = rocketNames[originalRocketKey];
        delete rocketNames[originalRocketKey];
    }
}

export function getStats(statFunctions) {
    Object.keys(statFunctions).forEach(stat => {
        const statElement = document.getElementById(stat);
        if (statElement) {
            const statValue = statFunctions[stat]();
            statElement.innerHTML = `<span>${(typeof statValue === 'number' && !Number.isInteger(statValue)) ? Math.floor(statValue) : statValue}</span>`;
            const classColor = determineStatClassColor(statValue);
            statElement.firstChild.classList.add(classColor);
        }
    });
}

function determineStatClassColor(value) {
    if (value === 'No' || value === 0 || value === 'OFF' || value === '⛰') {
        return 'red-disabled-text';
    }
    if (value === '☁' || value === '☂' || value === 'TRIPPED') {
        return 'warning-orange-text';
    }
    return 'green-ready-text';
}

export function createColoniseOpinionProgressBar(parentElement) {
    const diplomacyImpressionBarContainer = document.createElement("div");
    diplomacyImpressionBarContainer.classList.add("diplomacy-impression-bar-container");
    diplomacyImpressionBarContainer.id = 'diplomacyImpressionBar';

    const underBar = document.createElement("div");
    underBar.classList.add("diplomacy-impression-bar-underbar-horizontal");

    const percentageBar = document.createElement("div");
    percentageBar.classList.add("diplomacy-impression-bar-horizontal");

    const progressText = document.createElement("span");
    progressText.classList.add("diplomacy-impression-bar-text");
    progressText.textContent = "Opinion: 0%";

    diplomacyImpressionBarContainer.appendChild(underBar);
    diplomacyImpressionBarContainer.appendChild(percentageBar);
    diplomacyImpressionBarContainer.appendChild(progressText);

    parentElement.appendChild(diplomacyImpressionBarContainer);
}

export function setColoniseOpinionProgressBar(value, parentElement) {
    value = Math.max(0, Math.min(100, value));

    const horizontalBar = parentElement.querySelector(".diplomacy-impression-bar-horizontal");
    const barText = parentElement.querySelector(".diplomacy-impression-bar-text");

    const rect = parentElement.getBoundingClientRect();
    const horizontalWidth = rect.width;

    const percentageBarFill = (value / 100) * horizontalWidth;
    horizontalBar.style.width = `${percentageBarFill}px`;
    barText.textContent = `Impression: ${value}%`;
}

//-------------------------------------------------------------------------------------------------
//--------------BATTLECANVAS-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------

    export function drawFleets(canvasId, enemyFleets = [], playerFleets = [], createNew = true) {
        //DEBUG
         //enemyFleets = [10,18,26]; //DEBUG
        // playerFleets = [1,0,0,0]; //DEBUG
        //
        const canvas = document.getElementById(canvasId);

        const optionContentElement = document.getElementById(`optionContentTab5`);
        const starData = getStarSystemDataObject('stars', ['destinationStar']);
        if (!canvas)  {
            setNeedNewBattleCanvas(true);
            createBattleCanvas(optionContentElement, starData);
            return;
        }

        const ctx = canvas.getContext('2d');
    
        const canvasWidth = canvas.offsetWidth;
        const canvasHeight = canvas.offsetHeight;
    
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
    
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        let idCounter = 0;
    
        const getUnitSize = (unitType) => {
            if (unitType === 'air_marauder') return 6;
            return unitType.includes('air') ? 4 : (unitType.includes('land') ? 8 : 12);
        };
    
        if (!createNew) {
            return;
        }
    
        setBattleOngoing(true); //USE THIS TO BLOCK SAVING IN FUTURE LIKE SET TO FALSE NOT IN COLONISE SCREEN AND STORE BATTLEUNITS WHEN LEAVING THE SCREEN TO RELOAD LATER
        let newUnits = { player: [], enemy: [] };
    
        const fleetTypes = {
            enemy: ['air', 'land', 'sea'],
            player: ['air_scout', 'air_marauder', 'land_landStalker', 'sea_navalStrafer']
        };
    
        const generateFleetUnits = (fleets, owner) => {
            fleets.forEach((fleetCount, i) => {
                const unitType = fleetTypes[owner][i];
                let speed;
                if (owner === 'player') {
                    const resourceFleetName = "fleet" + capitaliseString(unitType.split("_").slice(1).join("_"));
                    speed = getResourceDataObject('space', ['upgrades', resourceFleetName, 'speed']);
                } else if (owner === 'enemy') {
                    let airSpeed = getFleetConstantData("air").speed;
                    let landSpeed = getFleetConstantData("land").speed;
                    let seaSpeed = getFleetConstantData("sea").speed;

                    if (starData.lifeformTraits[2][0] === 'Hypercharge') {
                        airSpeed *= 2;
                        landSpeed *= 2;
                        seaSpeed *= 2;
                    }

                    const speedMap = { air: airSpeed, land: landSpeed, sea: seaSpeed };
                    speed = speedMap[unitType] || 0;
                }
                
                for (let j = 0; j < fleetCount; j++) {
                    newUnits[owner].push(createUnit(unitType, owner, canvasWidth, canvasHeight, idCounter, speed));
                    idCounter++;
                }
            });
        };
    
        generateFleetUnits(enemyFleets, 'enemy');
        generateFleetUnits(playerFleets, 'player');
    
        replaceBattleUnits(newUnits);

        function createUnit(unitType, owner, canvasWidth, canvasHeight, idCounter, speed) {
            const size = getUnitSize(unitType);
            const { x, y, width, height, columnNumber, columnNumberWithinType } = getUnitPosition(unitType, owner, canvasWidth, canvasHeight, size);
            const visionDistanceAir = getFleetConstantData('air').visionDistance;
            const visionDistanceLand = getFleetConstantData('land').visionDistance;
            const visionDistanceSea = getFleetConstantData('sea').visionDistance;
            let accelerationAir = getFleetConstantData('air').acceleration;
            let accelerationLand = getFleetConstantData('land').acceleration;
            let accelerationSea = getFleetConstantData('sea').acceleration;

            if (getPlayerPhilosophy() === 'supremacist' && owner === 'player') {
                const speedUpgradeBoughtTimes = getRepeatableTechMultipliers('3') - 1;
                const multiplier = Math.pow(1.05, speedUpgradeBoughtTimes);
            
                accelerationAir *= multiplier;
                accelerationLand *= multiplier;
                accelerationSea *= multiplier;
            }

            return { 
                id: `${idCounter}_${unitType}`, 
                x, 
                y, 
                width, 
                height,
                size, 
                health: owner === 'enemy' ? (starData.lifeformTraits[2][0] === 'Hive Mind' ? 50 : 100) : getPlayerStartingUnitHealth(),
                owner, 
                speed: speed,
                verticalSpeed: 0,
                horizontalSpeed: 0,
                movementVector: [0, 0],
                columnNumber,
                columnNumberWithinType,
                rotation: owner === 'player' ? Math.PI / 2 : -Math.PI / 2,
                inFormation: false,
                currentGoal: null,
                visionDistance: unitType.includes('air') ? visionDistanceAir : unitType.includes('land') ? visionDistanceLand : visionDistanceSea,
                acceleration: (owner === 'enemy' && starData.lifeformTraits[2][0] === 'Hypercharge') ? (unitType.includes('air') ? accelerationAir : unitType.includes('land') ? accelerationLand : accelerationSea) * 2 : (unitType.includes('air') ? accelerationAir : unitType.includes('land') ? accelerationLand : accelerationSea),
                currentSpeed: 0,
                huntX: null,
                huntY: null,
                disabled: false
            };
        }
    
        function getUnitPosition(unitType, owner, canvasWidth, canvasHeight, size) {
            const padding = 4;
            const boundingBox = size + padding * 2;
            const doubleSpacing = boundingBox * 1.5;
        
            let isPlayer = owner === 'player';
        
            const playerTypeOrder = ['air_scout', 'air_marauder', 'land_landStalker', 'sea_navalStrafer'];
            const enemyTypeOrder = ['air', 'land', 'sea'];
        
            let typeKey = unitType;
        
            if (!getUnitPosition.columns) {
                getUnitPosition.columns = { player: {}, enemy: {} };
                getUnitPosition.columnCounts = { player: {}, enemy: {} };
        
                let playerX = boundingBox;
                let enemyX = canvasWidth - boundingBox;
        
                playerTypeOrder.forEach(type => {
                    getUnitPosition.columns.player[type] = { x: playerX, y: boundingBox };
                    getUnitPosition.columnCounts.player[type] = 0;
                    playerX += doubleSpacing;
                });
        
                enemyTypeOrder.forEach(type => {
                    getUnitPosition.columns.enemy[type] = { x: enemyX, y: boundingBox };
                    getUnitPosition.columnCounts.enemy[type] = 0;
                    enemyX -= doubleSpacing;
                });
            }
        
            let position = getUnitPosition.columns[owner][typeKey];
        
            if (position.y + boundingBox > canvasHeight) {
                position.y = boundingBox;
                position.x += isPlayer ? doubleSpacing : -doubleSpacing;
                getUnitPosition.columnCounts[owner][typeKey]++;
            }
        
            let columnNumber;

            if (isPlayer) {
                columnNumber = playerTypeOrder.indexOf(typeKey) + 1;
            } else {
                columnNumber = enemyTypeOrder.indexOf(typeKey) + 1;
            }
            
            const columnNumberWithinType = getUnitPosition.columnCounts[owner][typeKey] + 1;
        
            let newPosition = { x: position.x, y: position.y };
            position.y += boundingBox;
        
            if (owner === 'player') {
                newPosition.x -= 150;
            } else if (owner === 'enemy') {
                newPosition.x += 150;
            }
        
            return { 
                ...newPosition, 
                width: size, 
                height: size, 
                columnNumber,
                columnNumberWithinType
            };
        } 
    }           
    
    function drawUnit(ctx, unit) {
        ctx.save();
        ctx.translate(unit.x, unit.y);

        if (unit.id.includes('air')) {
            ctx.rotate(unit.rotation);
        }
    
        switch (unit.id.split('_')[1]) {
            case 'air':
            case 'air_scout':
            case 'air_marauder':
                ctx.beginPath();
                ctx.moveTo(0, -unit.size);
                ctx.lineTo(-unit.size, unit.size);
                ctx.lineTo(unit.size, unit.size);
                ctx.closePath();
                ctx.fill();
                break;
            case 'land':
            case 'land_landStalker':
                ctx.fillRect(-unit.size, -unit.size / 2, unit.size * 2, unit.size);
                break;
            case 'sea':
            case 'sea_navalStrafer':
                ctx.beginPath();
                ctx.arc(0, 0, unit.size / 2, 0, Math.PI * 2);
                ctx.fill();
                break;
        }
    
        ctx.restore();
    }  

    export function explosionAnimation(x, y) {
        const animationContainer = document.getElementById('explosionAnimation');
        animationContainer.classList.remove('invisible');
        animationContainer.classList.add('animate-explosion');
        
        animationContainer.style.left = `${x}px`;
        animationContainer.style.top = `${y}px`;
        
        setTimeout(() => {
            animationContainer.classList.remove('animate-explosion');
            animationContainer.classList.add('invisible');
        }, 1000);
    }

    export function shootLaser(unit, enemy) {
        const canvas = document.getElementById('battleCanvas');
        const ctx = canvas.getContext("2d");
    
        ctx.lineWidth = 2;
        let strokeColor = "transparent";
    
        if (unit.currentGoal && unit.currentGoal.id === enemy.id) {
            if (unit.owner === "player") {
                if (unit.id.includes('air')) {
                    strokeColor = "magenta";
                } else if (unit.id.includes('sea')) {
                    strokeColor = "turquoise";
                } else if (unit.id.includes('land')) {
                    strokeColor = "yellow";
                }
            } else if (unit.owner === "enemy") {
                if (unit.id.includes('air')) {
                    strokeColor = "rgb(255, 0, 255)";
                } else if (unit.id.includes('sea')) {
                    strokeColor = "rgb(64, 224, 208)";
                } else if (unit.id.includes('land')) {
                    strokeColor = "rgb(255, 255, 0)";
                }
            }
        }
    
        ctx.strokeStyle = strokeColor;
        ctx.beginPath();
        ctx.moveTo(unit.x, unit.y);
        ctx.lineTo(enemy.x, enemy.y);
        ctx.stroke();
    }

    
    export function createBattleCanvas(optionContentElement, starData) {
        const playerFleetScout = getResourceDataObject('space', ['upgrades', 'fleetScout', 'quantity']);
        const playerFleetMarauder = getResourceDataObject('space', ['upgrades', 'fleetMarauder', 'quantity']);
        const playerFleetLandStalker = getResourceDataObject('space', ['upgrades', 'fleetLandStalker', 'quantity']);
        const playerFleetNavalStrafer = getResourceDataObject('space', ['upgrades', 'fleetNavalStrafer', 'quantity']);
        const enemyFleets = [starData.enemyFleets.air, starData.enemyFleets.land, starData.enemyFleets.sea];
        const playerFleets = [playerFleetScout, playerFleetMarauder, playerFleetLandStalker, playerFleetNavalStrafer];

        if (!document.getElementById('battleCanvas') && getNeedNewBattleCanvas()) {
            const battleContainer = document.createElement('div');
            battleContainer.classList.add('battle-container');
            battleContainer.id = 'battleCanvasContainer';

            const canvas = document.createElement('canvas');
            canvas.id = 'battleCanvas';
            
            battleContainer.appendChild(canvas);

            const explosion = document.createElement('div');
            explosion.id = 'explosionAnimation';
            explosion.classList.add('invisible', 'explosion');
            battleContainer.appendChild(explosion);
            
            optionContentElement.prepend(battleContainer);

            canvas.style.width = '100%';
            canvas.style.height = '100%';
            
            if (getBattleUnits()) {
                const battleUnits = getBattleUnits();
                
                if (battleUnits.player.length === 0 && battleUnits.enemy.length === 0) {
                    drawFleets('battleCanvas', enemyFleets, playerFleets, true);
                } else {
                    drawFleets('battleCanvas', enemyFleets, playerFleets, false);
                }
            }
            setNeedNewBattleCanvas(false);
        }
    }

    export function moveBattleUnits(canvasId) {
        const canvas = document.getElementById(canvasId);

        const optionContentElement = document.getElementById(`optionContentTab5`);
        const starData = getStarSystemDataObject('stars', ['destinationStar']);
        if (!canvas)  {
            setNeedNewBattleCanvas(true);
            createBattleCanvas(optionContentElement, starData);
            return;
        }

        const ctx = canvas.getContext('2d');
        const battleUnits = getBattleUnits();
    
        if (!battleUnits) return;
    
        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

        const highestColumnEnemy = battleUnits.enemy.reduce((max, unit) =>
            Math.max(max, unit.columnNumber || 0), 0);
        
        const highestColumnNumberWithinHighestColumnEnemy = battleUnits.enemy
            .filter(unit => unit.columnNumber === highestColumnEnemy)
            .reduce((max, unit) => Math.max(max, unit.columnNumberWithinType || 0), 0);
        
        const lowestColumnPlayer = battleUnits.player.reduce((min, unit) =>
            Math.min(min, unit.columnNumber || Infinity), Infinity);
        
        const lowestColumnNumberWithinLowestColumnPlayer = battleUnits.player
            .filter(unit => unit.columnNumber === lowestColumnPlayer)
            .reduce((min, unit) => Math.min(min, unit.columnNumberWithinType || Infinity), Infinity);
        
        const lastPlayerUnits = battleUnits.player.filter(unit => 
            unit.columnNumber === lowestColumnPlayer && unit.columnNumberWithinType === lowestColumnNumberWithinLowestColumnPlayer
        );

        const lastEnemyUnits = battleUnits.enemy.filter(unit => 
            unit.columnNumber === highestColumnEnemy && unit.columnNumberWithinType === highestColumnNumberWithinHighestColumnEnemy
        );

        const lastPlayerOnScreen = lastPlayerUnits.some(unit => unit.x >= 10);
        const lastEnemyOnScreen = lastEnemyUnits.some(unit => unit.x <= (canvas.offsetWidth - 10));

        const allUnitsOnScreen = lastPlayerOnScreen && lastEnemyOnScreen;
    
        battleUnits.player.forEach(unit => {
            if (!unit.hasBeenOnCanvas && unit.x > 3 && unit.y >= 0) {
                unit.hasBeenOnCanvas = true;
            }
    
            if (!allUnitsOnScreen && !getBattleTriggeredByPlayer()) {
                unit.x += 1;
            } else if (unit.hasBeenOnCanvas) {

                if (getBattleTriggeredByPlayer()) {
                    calculateMovement(unit, canvas, 'player', 'fight');
                } else {
                    if (!getFormationGoal()) {
                        setFormationGoal(moveIntoFormation(canvas));
                    } else {
                        calculateMovement(unit, canvas, 'player', 'formation')
                    }
                }
            } else {
                console.log('unit drawn out of bounds of ever being on canvas:', unit);
            }
        });
    
        battleUnits.enemy.forEach(unit => {
            if (!unit.hasBeenOnCanvas && unit.x + unit.width < (canvas.offsetWidth + 1) && unit.y >= 0) {
                unit.hasBeenOnCanvas = true;
            }
    
            if (!allUnitsOnScreen && !getBattleTriggeredByPlayer()) {
                unit.x -= 1;
            } else if (unit.hasBeenOnCanvas) {
                if (getBattleTriggeredByPlayer()) {
                    calculateMovement(unit, canvas, 'enemy', 'fight');
                } else {
                    if (!getFormationGoal()) {
                        setFormationGoal(moveIntoFormation(canvas));
                    } else {
                        calculateMovement(unit, canvas, 'enemy', 'formation')
                    }
                }
            } else {
                console.log('unit drawn out of bounds of ever being on canvas:', unit);
            }
        });
    
        battleUnits.player.forEach(unit => {
            if (!unit.disabled) {
                // ctx.fillStyle = 
                //     unit.currentGoal?.id === 'hunt' ? 'magenta' : 
                //     (unit.currentGoal?.id ? 'blue' : 
                //     getComputedStyle(document.querySelector('[data-theme]')).getPropertyValue('--ready-text').trim());
                
                ctx.fillStyle = getComputedStyle(document.querySelector('[data-theme]')).getPropertyValue('--ready-text').trim();  
                drawUnit(ctx, unit);
            }

        });
        
        battleUnits.enemy.forEach(unit => {
            if (!unit.disabled) {
                            // ctx.fillStyle = 
            //     unit.currentGoal?.id === 'hunt' ? 'magenta' : 
            //     (unit.currentGoal?.id ? 'blue' : 
            //     getComputedStyle(document.querySelector('[data-theme]')).getPropertyValue('--disabled-text').trim());
            
            ctx.fillStyle = getComputedStyle(document.querySelector('[data-theme]')).getPropertyValue('--disabled-text').trim();  
            drawUnit(ctx, unit);
            }
        });
    }        

    function moveIntoFormation(canvas) {
        const battleUnits = getBattleUnits();
        
        const totalColumnsPlayer = getTotalColumnsData(battleUnits.player);
        const totalColumnsEnemy = getTotalColumnsData(battleUnits.enemy);
    
        const columnHeight = canvas.offsetHeight - 4;
        
        let newPositions = [];
    
        function calculatePositions(units, totalColumns) {
            totalColumns.forEach(column => {
                const columnKey = `${column.columnNumber}-${column.columnNumberWithinType}`;
                const unitCount = column.unitCount;
                const unitSpacing = columnHeight / (unitCount + 1);
    
                const columnUnits = units.filter(unit => 
                    `${unit.columnNumber}-${unit.columnNumberWithinType}` === columnKey
                );
    
                columnUnits.forEach((unit, index) => {
                    const yPosition = unitSpacing * (index + 1);
                    newPositions.push({ id: unit.id, y: yPosition });
                });
            });
        }
    
        calculatePositions(battleUnits.player, totalColumnsPlayer);
        calculatePositions(battleUnits.enemy, totalColumnsEnemy);
    
        return newPositions;
    }    
    
    function getTotalColumnsData(units) {
        const columnMap = new Map();
        
        units.forEach(unit => {
            const key = `${unit.columnNumber}-${unit.columnNumberWithinType}`;
            
            if (!columnMap.has(key)) {
                columnMap.set(key, {
                    columnNumber: unit.columnNumber,
                    columnNumberWithinType: unit.columnNumberWithinType,
                    unitCount: 0,
                    unitHeights: []
                });
            }
    
            const columnData = columnMap.get(key);
            columnData.unitCount += 1;
            columnData.unitHeights.push(unit.height);
        });
    
        return Array.from(columnMap.values());
    }

    function calculateMovementVector(unit, type, canvas) {
        let movementVector = [0, 0];
    
        switch (type) {
            case 'formation':
                const formationGoals = getFormationGoal();
                const goal = formationGoals.find(goal => goal.id === unit.id);
    
                if (goal) {
                    const goalY = goal.y;
                
                    if (unit.y < goalY) {
                        movementVector = [0, 100];
                    } else {
                        const battleUnits = getBattleUnits();
                        const owner = unit.owner;
                        const unitIndex = battleUnits[owner].findIndex(u => u.id === unit.id);
                        
                        if (unitIndex !== -1) {
                            battleUnits[owner][unitIndex].inFormation = true;
                            setBattleUnits(owner, battleUnits[owner]);
                        }
                    }
                }
                
                if (
                    getBattleUnits().player.every(unit => unit.inFormation) &&
                    getBattleUnits().enemy.every(unit => unit.inFormation)
                ) {
                    setInFormation(true);
                }                                                                         

                break;
            
            case 'fight':
                movementVector = calculateMovementVectorToTarget(unit, unit.currentGoal, canvas);
                break;
        }
    
        return movementVector;
    }   

    function checkCanvasBounds(unit, canvas) {
        if (unit.x < 0) {
            unit.x = 10;
        } else if (unit.x > canvas.offsetWidth) {
            unit.x = canvas.offsetWidth - 10;
        }
        
        if (unit.y < 0) {
            unit.y = 10;
        } else if (unit.y > canvas.offsetHeight) {
            unit.y = canvas.offsetHeight - 10;
        }
    }

    function calculateMovement(unit, canvas, key, type) {
        checkCanvasBounds(unit, canvas);
        const newMovementVector = calculateMovementVector(unit, type, canvas);

        let baseSpeed;
    
        if (type === "formation") {
            baseSpeed = 3 + (Math.random() * 3 - 1);
        } else {
            let acceleration = unit.acceleration; // /3 is DEBUG
            unit.currentSpeed = Math.min(unit.speed, unit.currentSpeed + acceleration);
            
            baseSpeed = unit.currentSpeed;
        }
    
        const xFactor = newMovementVector[0] / 100;
        const yFactor = newMovementVector[1] / 100;
            
        unit.horizontalSpeed = Math.max(-unit.speed, Math.min(unit.speed, baseSpeed * xFactor));
        unit.verticalSpeed = Math.max(-unit.speed, Math.min(unit.speed, baseSpeed * yFactor));        

        if (type !== 'formation') {
            if (newMovementVector[0] < 0) {
                unit.horizontalSpeed = -Math.abs(unit.horizontalSpeed);
            } else {
                unit.horizontalSpeed = Math.abs(unit.horizontalSpeed);
            }
            
            unit.horizontalSpeed = Math.max(-unit.speed, Math.min(unit.horizontalSpeed, unit.speed));
            
            if (newMovementVector[1] < 0) {
                unit.verticalSpeed = -Math.abs(unit.verticalSpeed);
            } else {
                unit.verticalSpeed = Math.abs(unit.verticalSpeed);
            }
            
            unit.verticalSpeed = Math.max(-unit.speed, Math.min(unit.verticalSpeed, unit.speed));
        }
    
        unit.x += unit.horizontalSpeed;
        unit.y += unit.verticalSpeed;
        unit.movementVector = newMovementVector;
        
        if (type === 'fight') {
            updateUnitRotation(newMovementVector, unit);  
        }

        const latestUnits = getBattleUnits()[key];
        const latestUnit = latestUnits.find(u => u.id === unit.id);

        const mergedUnit = {
            ...unit,
            currentGoal: latestUnit.currentGoal !== unit.currentGoal ? latestUnit.currentGoal : unit.currentGoal,
            huntX: latestUnit.huntX !== unit.huntX ? latestUnit.huntX : unit.huntX,
            huntY: latestUnit.huntY !== unit.huntY ? latestUnit.huntY : unit.huntY
        };

        const updatedUnits = latestUnits.map(u => (u.id === unit.id ? mergedUnit : u));
        setBattleUnits(key, updatedUnits);
    }

    function updateUnitRotation(movementVector, unit) {
        const x = movementVector[0];
        const y = movementVector[1];
        const desiredAngle = Math.atan2(y, x) + Math.PI / 2;
        unit.rotation = desiredAngle;
        return unit;
    }

    export function resetTabsOnRebirth() {
        const tabData = [
            { id: "tab1", classes: ["tab", "selected"], dataTab: "", dataName: "Resources", text: "Resources" },
            { id: "tab2", classes: ["tab", "tab-not-yet"], dataTab: "basicPowerGeneration", dataName: "Energy", text: "???" },
            { id: "tab3", classes: ["tab"], dataTab: "", dataName: "Research", text: "Research" },
            { id: "tab4", classes: ["tab", "tab-not-yet"], dataTab: "compounds", dataName: "Compounds", text: "???" },
            { id: "tab5", classes: ["tab", "tab-not-yet"], dataTab: "stellarCartography", dataName: "Interstellar", text: "???" },
            { id: "tab6", classes: ["tab", "tab-not-yet"], dataTab: "atmosphericTelescopes", dataName: "Space Mining", text: "???" },
            { id: "tab7", classes: ["tab", "tab-not-yet"], dataTab: "apAwardedThisRun", dataName: "Galactic", text: "???" },
            { id: "tab8", classes: ["tab"], dataTab: "", dataName: "☰", text: "☰" }
        ];
        
        tabData.forEach(tab => {
            const element = document.getElementById(tab.id);
            if (element) {
                element.className = tab.classes.join(" ");
                element.setAttribute("data-tab", tab.dataTab);
                element.setAttribute("data-name", tab.dataName);
                element.textContent = tab.text;
            }
        });
    }

    //reset classes on rebirth
    export function resetTab1ClassesRebirth() {
        const collapsibles = document.querySelectorAll('.collapsible');
        collapsibles.forEach(collapsible => {
            if (collapsible.id === "gas" || collapsible.id === "solids") {
                collapsible.classList.add('open');
            } else {
                collapsible.classList.remove('open');
            }
        });
    
        const collapsibleHeaders = document.querySelectorAll('.collapsible-header');
        collapsibleHeaders.forEach(header => {
            header.classList.add('active');
        });
    
        const collapsibleContents = document.querySelectorAll('.collapsible-content');
        collapsibleContents.forEach(content => {
            content.classList.add('open');
        });
    
        const rowSideMenuItems = document.querySelectorAll('.row-side-menu');
        rowSideMenuItems.forEach(row => {
            if (row.classList.contains('invisible')) {
                row.classList.add('invisible');
            } else {
                row.classList.remove('invisible');
            }
        });
    
        const invisibleElements = document.querySelectorAll('.row-side-menu');
        invisibleElements.forEach(element => {
            if (element.querySelector('.invisible')) {
                element.classList.add('invisible');
            } else {
                element.classList.remove('invisible');
            }
        });
    
        const hydrogenRow = document.getElementById('hydrogenOption').closest('.row-side-menu');
        hydrogenRow.classList.remove('invisible');
    
        const heliumRow = document.getElementById('heliumOption').closest('.row-side-menu');
        heliumRow.classList.add('invisible');
    
        const neonRow = document.getElementById('neonOption').closest('.row-side-menu');
        neonRow.classList.add('invisible');
    
        const oxygenRow = document.getElementById('oxygenOption').closest('.row-side-menu');
        oxygenRow.classList.add('invisible');
    
        const carbonRow = document.getElementById('carbonOption').closest('.row-side-menu');
        carbonRow.classList.add('invisible');
    
        const siliconRow = document.getElementById('siliconOption').closest('.row-side-menu');
        siliconRow.classList.add('invisible');
    
        const sodiumRow = document.getElementById('sodiumOption').closest('.row-side-menu');
        sodiumRow.classList.add('invisible');
    
        const ironRow = document.getElementById('ironOption').closest('.row-side-menu');
        ironRow.classList.add('invisible');
    }

    export function resetTab2ClassesRebirth() {
        const collapsibles = document.querySelectorAll('.collapsible');
        collapsibles.forEach(collapsible => {
            if (collapsible.id === "energyBuildings") {
                collapsible.classList.add('open');
            } else {
                collapsible.classList.remove('open');
            }
        });
    
        const collapsibleHeaders = document.querySelectorAll('.collapsible-header');
        collapsibleHeaders.forEach(header => {
            header.classList.add('active');
        });
    
        const collapsibleContents = document.querySelectorAll('.collapsible-content');
        collapsibleContents.forEach(content => {
            content.classList.add('open');
        });
    
        const rowSideMenuItems = document.querySelectorAll('.row-side-menu');
        rowSideMenuItems.forEach(row => {
            if (row.classList.contains('invisible')) {
                row.classList.add('invisible');
            } else {
                row.classList.remove('invisible');
            }
        });
    
        const energyStats = document.getElementById('energyConsumptionStats');
        energyStats?.classList.add('invisible');
    
        const energyRow = document.getElementById('energyOption').closest('.row-side-menu');
        energyRow.classList.remove('invisible');
    
        const powerPlant1Row = document.getElementById('powerPlant1Option').closest('.row-side-menu');
        powerPlant1Row.classList.add('invisible');
    
        const powerPlant2Row = document.getElementById('powerPlant2Option').closest('.row-side-menu');
        powerPlant2Row.classList.add('invisible');
    
        const powerPlant3Row = document.getElementById('powerPlant3Option').closest('.row-side-menu');
        powerPlant3Row.classList.add('invisible');
    }   
    
    export function resetTab4ClassesRebirth() {
        const collapsibles = document.querySelectorAll('.tab-4 .collapsible');
        collapsibles.forEach(collapsible => {
            if (collapsible.id === "liquidCompounds" || collapsible.id === "solidCompounds" ||
                collapsible.id === "hydroCarbons" || collapsible.id === "silicates" || collapsible.id === "metalAlloys") {
                collapsible.classList.add('open', 'invisible');
            } else {
                collapsible.classList.remove('open', 'invisible');
            }
        });
    
        const collapsibleHeaders = document.querySelectorAll('.tab-4 .collapsible-header');
        collapsibleHeaders.forEach(header => {
            header.classList.add('active');
        });
    
        const collapsibleContents = document.querySelectorAll('.tab-4 .collapsible-content');
        collapsibleContents.forEach(content => {
            content.classList.add('open');
        });
    
        const rowSideMenuItems = document.querySelectorAll('.tab-4 .row-side-menu');
        rowSideMenuItems.forEach(row => {
            if (row.classList.contains('invisible')) {
                row.classList.add('invisible');
            } else {
                row.classList.remove('invisible');
            }
        });
    
        const specificInvisibleRows = [
            'dieselOption', 'waterOption', 'glassOption', 'concreteOption', 'steelOption', 'titaniumOption'
        ];
        
        specificInvisibleRows.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                const row = element.closest('.row-side-menu');
                row.classList.add('invisible');
            }
        });
    }

    export function resetTab5ClassesRebirth() {
        const collapsibles = document.querySelectorAll('.collapsible');
        collapsibles.forEach(collapsible => {
            if (collapsible.id === "starMapOption" || collapsible.id === "starShipOption") {
                collapsible.classList.add('open');
            } else {
                collapsible.classList.remove('open');
            }
        });

        const collapsibleHeaders = document.querySelectorAll('.collapsible-header');
        collapsibleHeaders.forEach(header => {
            header.classList.add('active');
        });
    
        const collapsibleContents = document.querySelectorAll('.collapsible-content');
        collapsibleContents.forEach(content => {
            content.classList.add('open');
        });
    
        const starDataRow = document.getElementById('starDataOption').closest('.row-side-menu');
        starDataRow.classList.add('invisible');
    
        const starShipRow = document.getElementById('starShipOption').closest('.row-side-menu');
        starShipRow.classList.remove('invisible');
    
        const fleetHangarRow = document.getElementById('fleetHangarOption').closest('.row-side-menu');
        fleetHangarRow.classList.add('invisible');
    
        const coloniseRow = document.getElementById('coloniseOption').closest('.row-side-menu');
        coloniseRow.classList.add('invisible');
    }

    export function resetTab6ClassesRebirth() {
        const collapsibleHeaders = document.querySelectorAll('.tab-6 .collapsible-header');
        collapsibleHeaders.forEach(header => {
            header.classList.add('active');
        });
    
        const collapsibleContents = document.querySelectorAll('.tab-6 .collapsible-content');
        collapsibleContents.forEach(content => {
            content.classList.add('open');
        });
    
        const rowSideMenuItems = document.querySelectorAll('.tab-6 .row-side-menu');
        rowSideMenuItems.forEach(row => {
            row.classList.add('invisible');
        });
    
        const visibleRows = ['spaceTelescopeOption'];
        visibleRows.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                const row = element.closest('.row-side-menu');
                row.classList.remove('invisible');
            }
        });
    }

export function createMegaStructureDiagram() {
    const container = document.createElement('div');
    container.className = 'mega-structure-diagram-container';
    container.id = 'container';

    const forceFieldBox = document.createElement('div');
    forceFieldBox.className = 'force-field-container';
    forceFieldBox.id = 'forceFieldBox';
    container.appendChild(forceFieldBox);

    const starSystemBox = document.createElement('div');
    starSystemBox.className = 'star-system-container';
    starSystemBox.id = 'starSystemBox';
    container.appendChild(starSystemBox);

    const dysonSphereContainer = document.createElement('div');
    dysonSphereContainer.className = 'dyson-sphere-container';
    dysonSphereContainer.id = 'dysonSphereContainer';
    container.appendChild(dysonSphereContainer);

    const celestialProcessingCoreContainer = document.createElement('div');
    celestialProcessingCoreContainer.className = 'celestial-processing-core-container';
    celestialProcessingCoreContainer.id = 'celestialProcessingCoreContainer';
    container.appendChild(celestialProcessingCoreContainer);

    const plasmaForgeContainer = document.createElement('div');
    plasmaForgeContainer.className = 'plasma-forge-container';
    plasmaForgeContainer.id = 'plasmaForgeContainer';
    container.appendChild(plasmaForgeContainer);

    const galacticMemoryArchiveContainer = document.createElement('div');
    galacticMemoryArchiveContainer.className = 'galactic-memory-archive-container';
    galacticMemoryArchiveContainer.id = 'galacticMemoryArchiveContainer';
    container.appendChild(galacticMemoryArchiveContainer);

    return container;
}

export function createMegaStructureTable() {
    const tableContainer = document.createElement('div');
    tableContainer.className = 'mega-structure-table-container';
    tableContainer.id = 'tableContainer';

    const infoGrid = document.createElement('div');
    infoGrid.className = 'mega-info-grid';

    const megaStructures = [
        {
            name: 'Dyson Sphere',
            key: 'DysonSphere',
            research: ['ds1', 'ds2', 'ds3', 'ds4', 'ds5'],
            effects: ['effect1', 'effect2', 'effect3', 'effect4', 'effect5']
        },
        {
            name: 'Celestial Processing Core',
            key: 'CelestialProcessingCore',
            research: ['cpc1', 'cpc2', 'cpc3', 'cpc4', 'cpc5'],
            effects: ['effect1', 'effect2', 'effect3', 'effect4', 'effect5']
        },
        {
            name: 'Plasma Forge',
            key: 'PlasmaForge',
            research: ['pf1', 'pf2', 'pf3', 'pf4', 'pf5'],
            effects: ['effect1', 'effect2', 'effect3', 'effect4', 'effect5']
        },
        {
            name: 'Galactic Memory Archive',
            key: 'GalacticMemoryArchive',
            research: ['gma1', 'gma2', 'gma3', 'gma4', 'gma5'],
            effects: ['effect1', 'effect2', 'effect3', 'effect4', 'effect5']
        }
    ];

    megaStructures.forEach(structure => {
        const nameCell = document.createElement('div');
        nameCell.className = 'info-cell name-cell';
        nameCell.id = `name${structure.key}`;
        nameCell.textContent = structure.name;
        infoGrid.appendChild(nameCell);

        const researchCell = document.createElement('div');
        researchCell.className = 'info-cell research-cell';
        structure.research.forEach((text, index) => {
            const line = document.createElement('div');
            line.textContent = text;
            line.id = `research${structure.key}${index + 1}`;
            researchCell.appendChild(line);
        });
        infoGrid.appendChild(researchCell);

        const effectCell = document.createElement('div');
        effectCell.className = 'info-cell effect-cell';
        structure.effects.forEach((text, index) => {
            const line = document.createElement('div');
            line.textContent = text;
            line.id = `effect${structure.key}${index + 1}`;
            effectCell.appendChild(line);
        });
        infoGrid.appendChild(effectCell);
    });

    tableContainer.appendChild(infoGrid);
    return tableContainer;
}
    
//-------------------------------------------------------------------------------------------------
//--------------DEBUG-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------

function toggleDebugWindow() {
    if (debugWindow.style.display === 'none' || !debugWindow.style.display) {
        showDebugWindow();
    } else {
        debugWindow.style.display = 'none';
    }
}

function showDebugWindow() {
    debugWindow.style.display = 'block';
}

let isDragging = false;
let offsetX = 0;
let offsetY = 0;
let currentWindow = null;

function onMouseDown(e, windowElement) {
    isDragging = true;
    currentWindow = windowElement;
    offsetX = e.clientX - windowElement.offsetLeft;
    offsetY = e.clientY - windowElement.offsetTop;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

function onMouseMove(e) {
    if (isDragging && currentWindow) {
        currentWindow.style.left = `${e.clientX - offsetX}px`;
        currentWindow.style.top = `${e.clientY - offsetY}px`;
    }
}

function onMouseUp() {
    isDragging = false;
    currentWindow = null;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}

document.querySelector('.debug-header').addEventListener('mousedown', (e) => onMouseDown(e, document.getElementById('debugWindow')));
document.querySelector('.debug-variables-header').addEventListener('mousedown', (e) => onMouseDown(e, document.getElementById('variableDebuggerWindow')));

closeButton.addEventListener('click', () => {
    debugWindow.style.display = 'none';
});

const grantAllTechsButton = document.getElementById('grantAllTechsButton');
grantAllTechsButton.addEventListener('click', () => {
    const techArray = getResourceDataObject('techs');
    setResourceDataObject(getResourceDataObject('research', ['quantity']) + 1000000, 'research', ['quantity']);

    Object.keys(techArray).forEach((techKey) => {
        setTechUnlockedArray(techKey);
    });

    setUnlockedCompoundsArray('diesel');
    setUnlockedCompoundsArray('glass');
    setUnlockedCompoundsArray('steel');
    setUnlockedCompoundsArray('concrete');
    setUnlockedCompoundsArray('water');
    setUnlockedCompoundsArray('titanium');

    setCanFuelRockets(true);
    setCanTravelToAsteroids(true);

    grantAllTechsButton.classList.add('red-disabled-text');
    setRenderedTechTree(false);
    showNotification('CHEAT! All techs unlocked!', 'info', 3000, 'debug');

    console.log('All techs unlocked!');
});

const give1BButton = document.getElementById('give1BButton');
give1BButton.addEventListener('click', () => {
    const currentCash = getResourceDataObject('currency', ['cash']);
    const newCash = currentCash + 1000000000;

    setResourceDataObject(newCash, 'currency', ['cash']);
    
    showNotification('CHEAT! $1B added', 'info', 3000, 'debug');
    console.log('$ 1B granted! Current cash:', newCash);
});

const give100Button = document.getElementById('give100Button');
give100Button.addEventListener('click', () => {
    const newCash = 100;

    setResourceDataObject(newCash, 'currency', ['cash']);
    
    showNotification('CHEAT! $100 set', 'info', 3000, 'debug');
    console.log('$100 set! Current cash:', newCash);
});

const give1MResearchButton = document.getElementById('give1MResearch');
give1MResearchButton.addEventListener('click', () => {
    setResourceDataObject(1000000, 'research', ['quantity']);
    
    showNotification('CHEAT! 1M research points added!', 'info', 3000, 'debug');
    console.log('1M storage capacity granted to all resources and compounds!');
});

const give1MAllResourcesAndCompoundsButton = document.getElementById('give1MAllResourcesAndCompounds');
give1MAllResourcesAndCompoundsButton.addEventListener('click', () => {
    const resources = getResourceDataObject('resources');
    const compounds = getResourceDataObject('compounds');

    const resourceGases = document.getElementById('gas');
    const resourceSolids = document.getElementById('solids');
    const compoundLiquids = document.getElementById('liquidCompounds');
    const compoundSolids = document.getElementById('solidCompounds');

    resourceGases.classList.remove('invisible');
    resourceSolids.classList.remove('invisible');
    compoundLiquids.classList.remove('invisible');
    compoundSolids.classList.remove('invisible');

    [resourceGases, resourceSolids, compoundLiquids, compoundSolids].forEach(category => {
        category.querySelectorAll('.invisible').forEach(child => {
            child.classList.remove('invisible');
        });
    });

    Object.keys(resources).forEach(resourceKey => {
        setResourceDataObject(1000000, 'resources', [resourceKey, 'storageCapacity']);
        setResourceDataObject(1000000, 'resources', [resourceKey, 'quantity']);
        setUnlockedResourcesArray(resourceKey);
        setAutoBuyerTierLevel(resourceKey, 4, false, 'resources');
    });

    Object.keys(compounds).forEach(compoundKey => {
        setResourceDataObject(1000000, 'compounds', [compoundKey, 'storageCapacity']);
        setResourceDataObject(1000000, 'compounds', [compoundKey, 'quantity']);
        setUnlockedCompoundsArray(compoundKey);
        setAutoBuyerTierLevel(compoundKey, 4, false, 'compounds');
    });
    
    showNotification('CHEAT! 1M of every resource and compound added!', 'info', 3000, 'debug');
    console.log('1M storage capacity granted to all resources and compounds!');
});

const give100AllResourcesAndCompoundsButton = document.getElementById('give100AllResourcesAndCompounds');
give100AllResourcesAndCompoundsButton.addEventListener('click', () => {
    const resources = getResourceDataObject('resources');
    const compounds = getResourceDataObject('compounds');

    const resourceGases = document.getElementById('gas');
    const resourceSolids = document.getElementById('solids');
    const compoundLiquids = document.getElementById('liquidCompounds');
    const compoundSolids = document.getElementById('solidCompounds');

    resourceGases.classList.remove('invisible');
    resourceSolids.classList.remove('invisible');
    compoundLiquids.classList.remove('invisible');
    compoundSolids.classList.remove('invisible');

    [resourceGases, resourceSolids, compoundLiquids, compoundSolids].forEach(category => {
        category.querySelectorAll('.invisible').forEach(child => {
            child.classList.remove('invisible');
        });
    });

    Object.keys(resources).forEach(resourceKey => {
        setResourceDataObject(100, 'resources', [resourceKey, 'storageCapacity']);
        setResourceDataObject(100, 'resources', [resourceKey, 'quantity']);
        setUnlockedResourcesArray(resourceKey);
        setAutoBuyerTierLevel(resourceKey, 1, false, 'resources');
    });

    Object.keys(compounds).forEach(compoundKey => {
        setResourceDataObject(100, 'compounds', [compoundKey, 'storageCapacity']);
        setResourceDataObject(100, 'compounds', [compoundKey, 'quantity']);
        setUnlockedCompoundsArray(compoundKey);
        setAutoBuyerTierLevel(compoundKey, 1, false, 'compounds');
    });
    
    showNotification('CHEAT! 100 of every resource and compound!', 'info', 3000, 'debug');
    console.log('100 of all resources and compounds!');
});

const add10AsteroidsButton = document.getElementById('add10AsteroidsButton');
add10AsteroidsButton.addEventListener('click', () => {
    for (let i = 0; i < 10; i++) {
        discoverAsteroid(true);
    }
    showNotification('CHEAT! Discovered 10 Asteroids!', 'info', 3000, 'debug');
});

const addStarButton = document.getElementById('addStarButton');
addStarButton.addEventListener('click', () => {
    // for (let i = 0; i < 10; i++) {
        extendStarDataRange(true);
    // }
    showNotification('CHEAT! Discovered Star Data!', 'info', 3000, 'debug');
});

const buildLaunchPadScannerAndAllRocketsButton = document.getElementById('buildLaunchPadScannerAndAllRocketsButton');
buildLaunchPadScannerAndAllRocketsButton.addEventListener('click', () => {
    buildSpaceMiningBuilding('spaceTelescope', true);
    buildSpaceMiningBuilding('launchPad', true);

    setResourceDataObject(getResourceDataObject('space', ['upgrades', 'rocket1', 'parts']), 'space', ['upgrades', 'rocket1', 'builtParts']);
    setResourceDataObject(getResourceDataObject('space', ['upgrades', 'rocket2', 'parts']), 'space', ['upgrades', 'rocket2', 'builtParts']);
    setResourceDataObject(getResourceDataObject('space', ['upgrades', 'rocket3', 'parts']), 'space', ['upgrades', 'rocket3', 'builtParts']);
    setResourceDataObject(getResourceDataObject('space', ['upgrades', 'rocket4', 'parts']), 'space', ['upgrades', 'rocket4', 'builtParts']);

    setRocketsBuilt('rocket1');
    setRocketsBuilt('rocket2');
    setRocketsBuilt('rocket3');
    setRocketsBuilt('rocket4');

    buildLaunchPadScannerAndAllRocketsButton.classList.add('red-disabled-text');
    showNotification('CHEAT! Launch Pad, Space Scanner and all Rockets Built!', 'info', 3000, 'debug');
});

const gain10000AntimatterButton = document.getElementById('gain10000AntimatterButton');
gain10000AntimatterButton.addEventListener('click', () => {
    setAntimatterUnlocked(true);
    setResourceDataObject(getResourceDataObject('antimatter', ['quantity']) + 10000, 'antimatter', ['quantity']);
    showNotification('CHEAT! 10000 Antimatter added!', 'info', 3000, 'debug');
});

const unlockAllTabsButton = document.getElementById('unlockAllTabsButton');
unlockAllTabsButton.addEventListener('click', () => {
    const allTabs = document.querySelectorAll('.tab');

    allTabs.forEach(tab => {
        if (tab.classList.contains('tab-not-yet')) {
            tab.classList.remove('tab-not-yet');
            tab.textContent = tab.getAttribute('data-name');
        }
    });

    const techsToUnlock = [
        'stellarCartography',
        'basicPowerGeneration',
        'compounds',
        'atmosphericTelescopes',
        'apAwardedThisRun'
    ];
    
    const unlockedTechs = getTechUnlockedArray();
    
    techsToUnlock.forEach(tech => {
        if (!unlockedTechs.includes(tech)) {
            setTechUnlockedArray(tech);
        }
    });

    reorderTabs([1, 4, 3, 2, 6, 5, 7, 8]);

    showNotification('CHEAT! All tabs unlocked!', 'info', 3000, 'debug');
});

function toggleVariableDebuggerWindow() {
    if (variableDebuggerWindow.style.display === 'none' || !variableDebuggerWindow.style.display) {
        variableDebuggerWindow.style.display = 'block';
        document.body.classList.add('debug-window-open');
    } else {
        variableDebuggerWindow.style.display = 'none';
        document.body.classList.remove('debug-window-open');
    }
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'NumpadMultiply') {
        toggleVariableDebuggerWindow();
    }
});

const variableDebuggerCloseButton = document.querySelector('.variable-debugger-close-btn');
variableDebuggerCloseButton.addEventListener('click', () => {
    toggleVariableDebuggerWindow();
});
