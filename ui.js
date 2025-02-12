import { ProxyServer } from './saveLoadGame.js';
import {
    setRocketUserName,
    setCurrentDestinationDropdownText,
    getCurrentDestinationDropdownText,
    getCurrencySymbol,
    getBoostRate,
    setHasAntimatterSvgRightBoxDataChanged,
    getHasAntimatterSvgRightBoxDataChanged,
    getNormalMaxAntimatterRate,
    getMiningObject,
    getImageUrls,
    setUnlockedCompoundsArray,
    setUnlockedResourcesArray,
    setTechSpecificUIItemsArray,
    setTechUnlockedArray,
    getNewsTickerScrollDuration,
    oneOffPrizesAlreadyClaimedArray,
    getOneOffPrizesAlreadyClaimedArray,
    setOneOffPrizesAlreadyClaimedArray,
    getPrize,
    setPrize,
    deferredActions,
    setRenderedTechTree,
    getRenderedTechTree,
    setTechTreeDrawnYet,
    getTechTreeDrawnYet,
    getUpcomingTechArray,
    setLastSavedTimeStamp,
    getCurrentTheme,
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
    // getLanguage,
    setElements,
    getElements,
    getGameVisibleActive,
    // getLanguageSelected,
    // setLanguageSelected,
    // setLanguage,
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
    setAntimatterSvgEventListeners,
    setAntimatterUnlocked,
    setCanFuelRockets,
    setCanTravelToAsteroids,
    getRocketUserName
} from './constantsAndGlobalVars.js';
import {
    getResourceDataObject,
    getStarSystemDataObject,
    setAutoBuyerTierLevel,
    setResourceDataObject,
} from "./resourceDataObject.js";
import {
    optionDescriptions,
    getHeaderDescriptions,
    getOptionDescription,
    gameIntroHeader,
    gameIntroText,
    gameSaveNameCollect,
    initialiseDescriptions,
    headerDescriptions
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
    resetRocketForRefuelling,
    discoverAsteroid,
    buildSpaceMiningBuilding,

} from './game.js';

// import {
//     initLocalization,
//     localize
// } from './localization.js';

import { 
    capitaliseString 
} from './utilityFunctions.js';

import { drawTab1Content } from './drawTab1Content.js';
import { drawTab2Content } from './drawTab2Content.js';
import { drawTab3Content } from './drawTab3Content.js';
import { drawTab4Content } from './drawTab4Content.js';
import { drawTab5Content } from './drawTab5Content.js';
import { drawTab6Content } from './drawTab6Content.js';
import { drawTab7Content } from './drawTab7Content.js';
import { drawTab8Content } from './drawTab8Content.js';

let notificationContainer;
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

    content = gameIntroText;
    populateModal(headerText, content);
    getElements().modalContainer.style.display = 'flex';
    document.querySelector('.fullScreenContainer').style.display = 'flex';
    getElements().overlay.style.display = 'flex';

    getElements().modalOKButton.addEventListener('click', () => {
        if (document.getElementById('fullScreenCheckBox').classList.contains('checked')) {
            toggleGameFullScreen();
        }
        const handleClick = async () => {
            showHideModal();
            try {
                await loadGameFromCloud(); 
    
                saveGame('initialise');
                saveGameToCloud(getSaveData(), 'initialise');
            } catch (error) {
                console.error("Error during game loading:", error);
            }
        };
        handleClick();
    });
    
    startGame();

    notificationContainer = getElements().notificationContainer;
    // Event listeners

    document.addEventListener('keydown', (event) => {
        if (event.code === 'NumpadSubtract') {
            toggleDebugWindow();
        }
    });

    document.querySelectorAll('.collapsible-header').forEach(header => {
        header.addEventListener('click', function () {
            const content = this.nextElementSibling;
            content.classList.toggle('open');
            this.classList.toggle('active');
        });
    });

    //handleLanguageChange(getLanguageSelected()); //if we are using localise later on

    initializeTabEventListeners();

    const powerAllButton = document.getElementById('activateGridButton');
    powerAllButton.addEventListener('click', () => {
        toggleAllPower();
    });
     
    window.addEventListener('resize', () => {
        if (getCurrentOptionPane()) {
            const starContainer = document.querySelector('#optionContentTab5');
            starContainer.innerHTML = '';
            generateStarfield(starContainer, 100, 80);
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

    window.proxyServerEngineDKrypt = (a1a, viv) => {
        const AsZd = ProxyServer.AES.decrypt(a1a, viv);
        const c3RT = AsZd.toString(CryptoJS.enc.Utf8);
        return c3RT;
    };
});

export function updateContent(heading, tab, type) {
    const optionDescriptionElements = getElements().optionPaneDescriptions;
    let optionDescription;

    let headerContentElement;
    let optionContentElement;
    let optionDescriptionElement;

    let tabNumber = parseInt(tab.replace('tab', ''));
    headerContentElement = document.getElementById(`headerContentTab${tabNumber}`);
    optionContentElement = document.getElementById(`optionContentTab${tabNumber}`);

    headerContentElement.innerText = heading;
    optionContentElement.innerHTML = '';
       
    if (type === 'intro') {
        optionDescription = getHeaderDescriptions([heading]);
        optionDescriptionElement = optionDescriptionElements[tabNumber - 1];
        optionDescriptionElement.textContent = optionDescription;
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
                optionDescriptionElement.textContent = optionDescription;
                optionDescriptionElement.style.border = `1px dashed var(--container-border-color)`;
                drawTab1Content(heading, optionContentElement);
                break;
            case 'tab2':
                optionDescriptionElement = optionDescriptionElements[1];
                optionDescriptionElement.textContent = optionDescription;
                optionDescriptionElement.style.border = `1px dashed var(--container-border-color)`;
                drawTab2Content(heading, optionContentElement);
                break;
            case 'tab3':
                optionDescriptionElement = optionDescriptionElements[2];
                optionDescriptionElement.textContent = optionDescription;
                optionDescriptionElement.style.border = `1px dashed var(--container-border-color)`;
                drawTab3Content(heading, optionContentElement);
                break;
            case 'tab4':
                optionDescriptionElement = optionDescriptionElements[3];
                optionDescriptionElement.textContent = optionDescription;
                optionDescriptionElement.style.border = `1px dashed var(--container-border-color)`;
                drawTab4Content(heading, optionContentElement);
                break;
            case 'tab5':
                optionDescriptionElement = optionDescriptionElements[4];
                optionDescriptionElement.textContent = optionDescription;
                optionDescriptionElement.style.border = `1px dashed var(--container-border-color)`;
                drawTab5Content(heading, optionContentElement);
                break;
            case 'tab6':
                optionDescriptionElement = optionDescriptionElements[5];
                optionDescriptionElement.textContent = optionDescription;
                optionDescriptionElement.style.border = `1px dashed var(--container-border-color)`;
                drawTab6Content(heading, optionContentElement);
                break;
            case 'tab7':
                optionDescriptionElement = optionDescriptionElements[6];
                optionDescriptionElement.textContent = optionDescription;
                optionDescriptionElement.style.border = `1px dashed var(--container-border-color)`;
                drawTab7Content(heading, optionContentElement);
                break;
            case 'tab8':
                optionDescriptionElement = optionDescriptionElements[7];
                optionDescriptionElement.textContent = optionDescription;
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
    noDescriptionContainer
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
        descriptionRowContainer.textContent = getOptionDescription(labelId).content1;
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
        if (objectSectionArgument2 === 'searchAsteroid' && !getResourceDataObject('space', ['upgrades', 'spaceTelescope', 'spaceTelescopeBoughtYet'])) {
            wrapper.classList.add('invisible');
        } else if (objectSectionArgument2 === 'searchAsteroid') {
            wrapper.classList.remove('invisible');
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
    
        if (rowCategory === 'building' || rowCategory === 'spaceMiningPurchase') {
            description.classList.add('building-purchase');
        }
    
        description.id = generateElementId(labelText, resourceString, optionalIterationParam);
        description.innerHTML = descriptionText;
    
        if (dataConditionCheck) {
            if (rowCategory === 'resource' || rowCategory === 'building' || rowCategory === 'spaceMiningPurchase' || rowCategory === 'science' || rowCategory === 'tech') {
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

    wrapper.appendChild(descriptionRowContainer);
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
        optionDiv.innerHTML = option.text;

        optionDiv.addEventListener('click', (event) => {
            const value = event.target.getAttribute('data-value');
            const selectedOption = options.find(option => option.value == value);
            dropdownText.innerHTML = selectedOption ? selectedOption.text : 'Select an option';
            setCurrentDestinationDropdownText(dropdownText.innerHTML);
            dropdownOptions.classList.remove('show');
            selectContainer.style.borderRadius = '10px 10px 10px 10px';
            onChange(value);
        });

        dropdownOptions.appendChild(optionDiv);
    });

    dropdown.addEventListener('click', (event) => {
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
        } else if (dataConditionCheck === 'techUnlock') {
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

    button.addEventListener('click', onClick);

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

let notificationQueue = [];
let isNotificationActive = false;

export function showNotification(message, type = 'info', time = 3000) {
    if (getNotificationsToggle()) {
        notificationQueue.push({ message, type, time });

        if (!isNotificationActive) {
            processNotificationQueue();
        }
    }
}

function processNotificationQueue() {
    if (notificationQueue.length > 0) {
        isNotificationActive = true;

        const { message, type, time } = notificationQueue.shift();
        sendNotificationIfActive(message, type, time);
    } else {
        isNotificationActive = false;
    }
}

function sendNotificationIfActive(message, type, duration) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = message;

    const allNotifications = document.querySelectorAll('.notification');
    allNotifications.forEach((notification, index) => {
        notification.style.transform = `translateY(-${(index + 1) * 110}px)`;
    });

    notificationContainer.prepend(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 50);

    setTimeout(() => {
        hideNotification(notification);
        processNotificationQueue();
    }, duration);
}

function hideNotification(notification) {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(100px)';

    setTimeout(() => {
        notification.remove();
    }, 500);
}

function highlightActiveTab(activeIndex) {
    const tabs = document.querySelectorAll('#tabsContainer .tab');
    tabs.forEach((tab, index) => {
        if (index === activeIndex) {
            tab.classList.add('selected');
        } else {
            tab.classList.remove('selected');
        }
    });
}

// async function setElementsLanguageText() {
//     getElements().menuTitle.innerHTML = `<h2>${localize('menuTitle', getLanguage())}</h2>`;
//     getElements().newGameMenuButton.innerHTML = `${localize('newGame', getLanguage())}`;
// }

// export async function handleLanguageChange(languageCode) {
//     setLanguageSelected(languageCode);
//     await setupLanguageAndLocalization();
//     setElementsLanguageText();
// }

// async function setupLanguageAndLocalization() {
//     setLanguage(getLanguageSelected());
//     await initLocalization(getLanguage());
// }

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

export function generateStarfield(starfieldContainer, numberOfStars = 70, seed = 1) {
    const minSize = 2;
    const maxSize = 6;

    const containerRect = starfieldContainer.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    const containerLeft = containerRect.left;
    const containerTop = containerRect.top;

    const starNames= ["Absolutno","Acamar","Achernar","Achird","Acrab","Acrux","Acubens","Adhafera","Adhara","Adhil","Ain","Ainalrami","Aiolos","Aladfar","Alasia","Alathfar†","Albaldah","Albali","Albireo","Alchiba","Alcor","Alcyone","Aldebaran","Alderamin","Aldhanab","Aldhibah","Aldulfin","Alfirk","Algedi","Algenib","Algieba","Algol","Algorab","Alhena","Alioth","Aljanah","Alkaid","Alkalurops","Alkaphrah","Alkarab","Alkes","Almaaz","Almach","Alnair","Alnasl","Alnilam","Alnitak","Alniyat","Alphard","Alphecca","Alpheratz","Alpherg","Alrakis","Alrescha","Alruba","Alsafi","Alsciaukat","Alsephina","Alshain","Alshat","Altair","Altais","Alterf","Aludra","Alula Australis","Alula Borealis","Alya","Alzirr","Amadioha","Amansinaya","Anadolu","Añañuca","Ancha","Angetenar","Aniara","Ankaa","Anser","Antares","Arcalís","Arcturus","Arkab Posterior","Arkab Prior","Arneb","Ascella","Asellus Australis","Asellus Borealis","Ashlesha","Asellus Primus†","Asellus Secundus†","Asellus Tertius†","Aspidiske","Asterope","Atakoraka","Athebyne","Atik","Atlas","Atria","Avior","Axólotl","Ayeyarwady","Azelfafage","Azha","Azmidi","Baekdu","Barnard's Star","Baten Kaitos","Batsũ̀","Beemim","Beid","Belel","Bélénos","Bellatrix","Berehynia","Betelgeuse","Bharani","Bibhā","Biham","Bosona","Botein","Brachium","Bubup","Buna","Bunda","Canopus","Capella","Caph","Castor","Castula","Cebalrai","Ceibo","Celaeno","Cervantes","Chalawan","Chamukuy","Chaophraya","Chara","Chasoň","Chechia","Chertan","Citadelle","Citalá","Cocibolca","Copernicus","Cor Caroli","Cujam","Cursa","Dabih","Dalim","Danfeng","Deneb","Deneb Algedi","Denebola","Diadem","Dilmun","Dingolay","Diphda","Dìwö","Diya","Dofida","Dombay","Dschubba","Dubhe","Dziban","Ebla","Edasich","Electra","Elgafar","Elkurud","Elnath","Eltanin","Emiw","Enif","Errai","Fafnir","Fang","Fawaris","Felis","Felixvarela","Filetdor","Flegetonte","Fomalhaut","Formosa","Franz","Fulu","Fumalsamakah","Funi","Furud","Fuyue","Gacrux","Gakyid","Gar","Garnet Star†","Geminga","Giausar","Gienah","Ginan","Gloas","Gnomon","Gomeisa","Graffias†","Guahayona","Grumium","Gudja","Gumala","Guniibuu","Hadar","Haedus","Hamal","Hassaleh","Hatysa","Helvetios","Heze","Hoggar","Homam","Horna","Hunahpú","Hunor","Iklil","Illyrian","Imai","Inquill","Intan","Intercrus","Irena","Itonda","Izar","Jabbah","Jishui","Kaffaljidhma","Kaewkosin","Kalausi","Kamuy","Kang","Karaka","Kaus Australis","Kaus Borealis","Kaus Media","Kaveh","Keid","Khambalia","Kitalpha","Kochab","Koeia","Koit","Komondor","Kornephoros","Kosjenka","Kraz","Kuma†","Kurhah","La Superba","Larawag","Lerna","Lesath","Libertas","Lich","Liesma","Lilii Borea","Lionrock","Lucilinburhuc","Lusitânia","Maasym","Macondo","Mago","Mahasim","Mahsati","Maia","Malmok","Marfik","Markab","Markeb","Márohu","Marsic","Matar","Matza","Maru","Mazaalai","Mebsuta","Megrez","Meissa","Mekbuda","Meleph","Menkalinan","Menkar","Menkent","Menkib","Merak","Merga","Meridiana","Merope","Mesarthim","Miaplacidus","Mimosa","Minchir","Minelauva","Mintaka","Mira","Mirach","Miram","Mirfak","Mirzam","Misam","Mizar","Moldoveanu","Mönch","Montuno","Morava","Moriah","Mothallah","Mouhoun","Mpingo","Muliphein","Muphrid","Muscida","Musica","Muspelheim","Nahn","Naledi","Naos","Nashira","Násti","Natasha","Navi†","Nekkar","Nembus","Nenque","Nervia","Nihal","Nikawiy","Noquisi","Nosaxa","Nunki","Nusakan","Nushagak","Nyamien","Ogma","Okab","Orkaria","Paikauhale","Parumleo","Peacock","Petra","Phact","Phecda","Pherkad","Phoenicia","Piautos","Pincoya","Pipirima","Pipoltr","Pleione","Poerava","Polaris","Polaris Australis","Polis","Pollux","Porrima","Praecipua","Prima Hyadum","Procyon","Propus","Proxima Centauri","Ran","Rana","Rapeto","Rasalas","Rasalgethi","Rasalhague","Rastaban","Regor†","Regulus","Revati","Rigel","Rigil Kentaurus","Rosalíadecastro","Rotanev","Ruchbah","Rukbat","Sabik","Saclateni","Sadachbia","Sadalbari","Sadalmelik","Sadalsuud","Sadr","Sagarmatha","Saiph","Salm","Sāmaya","Sansuna","Sargas","Sarin","Sceptrum","Scheat","Schedar","Secunda Hyadum","Segin","Seginus","Sham","Shama","Sharjah","Shaula","Sheliak","Sheratan","Sika","Sirius","Situla","Skat","Solaris","Spica","Sterrennacht","Stribor","Sualocin","Subra","Suhail","Sulafat","Syrma","Tabit","Taika","Taiyangshou","Taiyi","Talitha","Tangra","Tania Australis","Tania Borealis","Tapecue","Tarazed","Tarf","Taygeta","Tegmine","Tejat","Terebellum","Tevel","Thabit†","Theemin","Thuban","Tiaki","Tianguan","Tianyi","Timir","Tislit","Titawin","Tojil","Toliman","Tonatiuh","Torcular","Tuiren","Tupã","Tupi","Tureis","Ukdah","Uklun","Unukalhai","Unurgunite","Uruk","Uúba","Vega","Veritate","Vindemiatrix","Wasat","Wattle","Wazn","Wezen","Wouri","Wurren","Xamidimura","Xihe","Xuange","Yed Posterior","Yed Prior","Yildun","Zaniah","Zaurak","Zembra","Zhang","Zibal","Zosma","Zubenelgenubi","Zubenelhakrabi","Zubeneschamali"];
    
    const usedNames = new Set();

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');

        const size = getSeededRandomInRange(seed + i, minSize, maxSize);
       // console.log('start size: ' + size);
                const x = getSeededRandomInRange(seed + i + numberOfStars, 0, containerWidth) + containerLeft;
        const y = getSeededRandomInRange(seed + i + numberOfStars * 2, 0, containerHeight) + containerTop;

        let name;
        if (size > maxSize - 0.4) {
            star.classList.add('star');

            if (starNames.length > 0) {
                const index = Math.floor(seededRandom(seed - i * 1.2) * starNames.length);
                name = starNames[index];
                starNames.splice(index, 1);
                usedNames.add(name);
            } else {
                name = `Star${i}`;
            }
    
            star.id = name;
            star.style.width = `${size * 1.6}px`;
            star.style.height = `${size * 1.6}px`;
            star.style.left = `${x}px`;
            star.style.top = `${y}px`;
    
            star.title = name;
        } else {
            star.id = `noneInterestingStar${i}`;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${x}px`;
            star.style.top = `${y}px`;

            star.classList.add('star-uninteresting');
            star.title = '';
        }
        starfieldContainer.appendChild(star);
    }

    function getSeededRandomInRange(seed, min, max) {
        return seededRandom(seed) * (max - min) + min;
    }

    function seededRandom(seed) {
        let x = Math.sin(seed++) * 9390;
        return x - Math.floor(x);
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

function showHideModal() {
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
        const saveNameButton = getElements().modalSaveButton;
        const saveNameField = document.getElementById('pioneerCodeName');

        saveNameButton.addEventListener('click', () => {
            const userName = saveNameField.value.trim();
            if (userName) {
                setSaveName(userName);
                localStorage.setItem('saveName', getSaveName());
                getElements().modalSaveButton.classList.add('invisible');
                getElements().modalOKButton.classList.remove('invisible');
                resolve();
            } else {
                alert("Please enter a valid code name!");
            }
        });
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

    const textColor = getComputedStyle(canvas).getPropertyValue('--text-color').trim();
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
    
            // Move the currentY position up
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
        }        
    }    
    
    const barWidth = width * 0.3;
    const gap = 10;

    const generationColors = getComputedStyle(canvas).getPropertyValue('--generation-colors').trim().split(',');
    const consumptionColors = getComputedStyle(canvas).getPropertyValue('--consumption-colors').trim().split(',');

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

export function updateDynamicColumns() {
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
}

function setupTooltip(svgElement) {
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
            ['', `${getRocketUserName('rocket' + (index + 1))}`],
            ["Asteroid:", rocketInfo[1]],
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
            label.innerHTML = `${(rocketInfo[3] * getTimerRateRatio()).toFixed(2)} / s`;
        } else if (rocketInfo && getIsAntimatterBoostActive()) {
            label.innerHTML = `${(rocketInfo[3] * getTimerRateRatio() * getBoostRate()).toFixed(2)} / s`;
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
    antimatterRateBarOuter.style.backgroundColor = "var(--bg-color)";
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
    
    for (let i = 0; i <= 4; i++) {  
        const scaleLabel = document.createElement("div");
        scaleLabel.innerText = `${(antimatterMaxRate * ((4 - i) / 4) * getTimerRateRatio()).toFixed(2)} / s`;
        scaleLabel.style.position = "absolute";
        scaleLabel.style.right = "5px";
        
        let topOffset = (i / 4) * 100;
        
        if (i === 0) {
            topOffset += 2;
        } else if (i === 4) {
            topOffset -= 2;
        }
    
        scaleLabel.style.top = `${topOffset}%`;
        scaleLabel.style.transform = "translateY(-50%)";
        scaleLabel.style.whiteSpace = "nowrap";
        scaleContainer.appendChild(scaleLabel);
    }
    
    const scaleForeignObject = document.createElementNS(svgNS, "foreignObject");
    scaleForeignObject.setAttribute("x", rightOffset + (boxWidth / 2) - 20);
    scaleForeignObject.setAttribute("y", topMostY + (rightBoxHeight / 2));
    scaleForeignObject.setAttribute("width", 80);
    scaleForeignObject.setAttribute("height", rightBoxHeight / 2);
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
        setupTooltip(svgElement);
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
        setupTooltip(svgElement);
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
            tab.classList.remove('tab-not-yet');
            tab.textContent = tabName;
        }
    });
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

    const currentOrder = Array.from(document.getElementById('tabsContainer').children).map(tab =>
        parseInt(tab.id.replace('tab', ''), 10)
    );

    if (JSON.stringify(currentOrder) === JSON.stringify(unlockedTabs)) {
        return;
    }

    reorderTabs(unlockedTabs);
}

function reorderTabs(newOrder) {
    const tabsContainer = document.getElementById('tabsContainer');
    const tabs = Array.from(tabsContainer.children);

    newOrder.forEach(tabId => {
        const tab = document.getElementById(`tab${tabId}`);
        if (tab) {
            tabsContainer.appendChild(tab);
        }
    });

    initializeTabEventListeners();
}


function initializeTabEventListeners() {
    let fuseButton;

    document.querySelectorAll('[class*="tab1"][class*="option1"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab1', 'hydrogen');
            setCurrentOptionPane('hydrogen');
            updateContent('Hydrogen', 'tab1', 'content');
            fuseButton = document.querySelector('button.fuse');
            setSellFuseCreateTextDescriptionClassesBasedOnButtonStates(fuseButton, 'fuse');
        });
    });
    
    document.querySelectorAll('[class*="tab1"][class*="option2"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab1', 'helium');
            setCurrentOptionPane('helium');
            updateContent('Helium', 'tab1', 'content');
            fuseButton = document.querySelector('button.fuse');
            setSellFuseCreateTextDescriptionClassesBasedOnButtonStates(fuseButton, 'fuse');
        });
    });

    document.querySelectorAll('[class*="tab1"][class*="option3"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab1', 'carbon');
            setCurrentOptionPane('carbon');
            updateContent('Carbon', 'tab1', 'content');
            fuseButton = document.querySelector('button.fuse');
            setSellFuseCreateTextDescriptionClassesBasedOnButtonStates(fuseButton, 'fuse');
        });
    });

    document.querySelectorAll('[class*="tab1"][class*="option4"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab1', 'neon');
            setCurrentOptionPane('neon');
            updateContent('Neon', 'tab1', 'content');
            fuseButton = document.querySelector('button.fuse');
            setSellFuseCreateTextDescriptionClassesBasedOnButtonStates(fuseButton, 'fuse');
        });
    });

    document.querySelectorAll('[class*="tab1"][class*="option5"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab1', 'oxygen');
            setCurrentOptionPane('oxygen');
            updateContent('Oxygen', 'tab1', 'content');
            fuseButton = document.querySelector('button.fuse');
            setSellFuseCreateTextDescriptionClassesBasedOnButtonStates(fuseButton, 'fuse');
        });
    });

    document.querySelectorAll('[class*="tab1"][class*="option6"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab1', 'sodium');
            setCurrentOptionPane('sodium');
            updateContent('Sodium', 'tab1', 'content');
        });
    });

    document.querySelectorAll('[class*="tab1"][class*="option7"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab1', 'silicon');
            setCurrentOptionPane('silicon');
            updateContent('Silicon', 'tab1', 'content');
            fuseButton = document.querySelector('button.fuse');
            setSellFuseCreateTextDescriptionClassesBasedOnButtonStates(fuseButton, 'fuse');
        });
    });

    document.querySelectorAll('[class*="tab1"][class*="option8"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab1', 'iron');
            setCurrentOptionPane('iron');
            updateContent('Iron', 'tab1', 'content');
        });
    });

    document.querySelectorAll('[class*="tab2"][class*="option1"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab2', 'energy storage');
            setCurrentOptionPane('energy storage');
            updateContent('Energy Storage', 'tab2', 'content');
        });
    });

    document.querySelectorAll('[class*="tab2"][class*="option2"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab2', 'power plant');
            setCurrentOptionPane('power plant');
            updateContent('Power Plant', 'tab2', 'content');
        });
    });

    document.querySelectorAll('[class*="tab2"][class*="option3"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab2', 'solar power plant');
            setCurrentOptionPane('solar power plant');
            updateContent('Solar Power Plant', 'tab2', 'content');
        });
    });

    document.querySelectorAll('[class*="tab2"][class*="option4"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab2', 'advanced power plant');
            setCurrentOptionPane('advanced power plant');
            updateContent('Advanced Power Plant', 'tab2', 'content');
        });
    });

    document.querySelectorAll('[class*="tab3"][class*="option1"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab3', 'research');
            setCurrentOptionPane('research');
            updateContent('Research', 'tab3', 'content');
        });
    });
    
    document.querySelectorAll('[class*="tab3"][class*="option2"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab3', 'technology');
            setCurrentOptionPane('technology');
            updateContent('Technology', 'tab3', 'content');
        });
    });

    document.querySelectorAll('[class*="tab3"][class*="option3"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab3', 'tech tree');
            setCurrentOptionPane('tech tree');
            updateContent('Tech Tree', 'tab3', 'content');
        });
    });

    document.querySelectorAll('[class*="tab4"][class*="option1"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab4', 'diesel');
            setCurrentOptionPane('diesel');
            updateContent('Diesel', 'tab4', 'content');
        });
    });

    document.querySelectorAll('[class*="tab4"][class*="option2"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab4', 'glass');
            setCurrentOptionPane('glass');
            updateContent('Glass', 'tab4', 'content');
        });
    });

    document.querySelectorAll('[class*="tab4"][class*="option3"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab4', 'steel');
            setCurrentOptionPane('steel');
            updateContent('Steel', 'tab4', 'content');
        });
    });

    document.querySelectorAll('[class*="tab4"][class*="option4"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab4', 'concrete');
            setCurrentOptionPane('concrete');
            updateContent('Concrete', 'tab4', 'content');
        });
    });

    document.querySelectorAll('[class*="tab4"][class*="option5"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab4', 'water');
            setCurrentOptionPane('water');
            updateContent('Water', 'tab4', 'content');
        });
    });

    document.querySelectorAll('[class*="tab4"][class*="option6"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab4', 'titanium');
            setCurrentOptionPane('titanium');
            updateContent('Titanium', 'tab4', 'content');
        });
    });

    document.querySelectorAll('[class*="tab5"][class*="option1"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab5', 'star map');
            setCurrentOptionPane('star map');
            updateContent('Star Map', 'tab5', 'content');
        });
    });

    document.querySelectorAll('[class*="tab6"][class*="option1"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab6', 'launch pad');
            setCurrentOptionPane('launch pad');
            updateContent('Launch Pad', 'tab6', 'content');
        });
    });

    document.querySelectorAll('[class*="tab6"][class*="option2"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab6', 'rocket1');
            setCurrentOptionPane('rocket1');
            updateContent(`${getRocketUserName('rocket1')}`, 'tab6', 'content');
        });
    });

    document.querySelectorAll('[class*="tab6"][class*="option3"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab6', 'rocket2');
            setCurrentOptionPane('rocket2');
            updateContent(`${getRocketUserName('rocket2')}`, 'tab6', 'content');
        });
    });

    document.querySelectorAll('[class*="tab6"][class*="option4"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab6', 'rocket3');
            setCurrentOptionPane('rocket3');
            updateContent(`${getRocketUserName('rocket3')}`, 'tab6', 'content');
        });
    });

    document.querySelectorAll('[class*="tab6"][class*="option5"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab6', 'rocket4');
            setCurrentOptionPane('rocket4');
            updateContent(`${getRocketUserName('rocket4')}`, 'tab6', 'content');
        });
    });

    document.querySelectorAll('[class*="tab6"][class*="option6"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab6', 'space telescope');
            setCurrentOptionPane('space telescope');
            updateContent('Space Telescope', 'tab6', 'content');
        });
    });

    document.querySelectorAll('[class*="tab6"][class*="option7"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab6', 'asteroids');
            setCurrentOptionPane('asteroids');
            updateContent('Asteroids', 'tab6', 'content');
        });
    });

    document.querySelectorAll('[class*="tab6"][class*="option8"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setHasAntimatterSvgRightBoxDataChanged(null);
            setLastScreenOpenRegister('tab6', 'antimatter');
            setCurrentOptionPane('antimatter');
            updateContent('Antimatter', 'tab6', 'content');
        });
    });
    
    document.querySelectorAll('[class*="tab8"][class*="option1"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab8', 'visual');
            setCurrentOptionPane('visual');
            updateContent('Visual', 'tab8', 'content');
        });
    });
    
    document.querySelectorAll('[class*="tab8"][class*="option2"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab8', 'saving / loading');
            setCurrentOptionPane('saving / loading');
            updateContent('Saving / Loading', 'tab8', 'content');
        });
    });

    document.querySelectorAll('[class*="tab8"][class*="option3"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab8', 'game options');
            setCurrentOptionPane('game options');
            updateContent('Game Options', 'tab8', 'content');
        });
    });

    const tabsContainer = document.getElementById('tabsContainer');

    if (tabsContainer) {
        const tabs = Array.from(tabsContainer.children);
    
        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const dynamicIndex = parseInt(tab.id.replace('tab', ''), 10);
    
                setCurrentTab([dynamicIndex, document.getElementById('tab' + dynamicIndex).textContent]);
                highlightActiveTab(tab.textContent);
                setGameState(getGameVisibleActive());
    
                let content = tab.textContent;
                if (content === '☰') {
                    content = 'Settings';
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
                    }

                    setCurrentOptionPane(lastOpenOptionPane);
                }
            });
        });
    }  
}

export function showNewsTickerMessage(newsTickerContainer) {
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

    if (category === 'prize' || category === 'oneOff' || category === 'wackyEffects') {
        if (category === 'oneOff') {
            if (getOneOffPrizesAlreadyClaimedArray().includes(randomIndex)) {
                message = false;
            } else {
                message = specialMessageBuilder(message, category);
            }
        } else {
            message = specialMessageBuilder(message, category);
        }
    }

    if (message === false || message === undefined) {
        showNewsTickerMessage(newsTickerContainer);
    } else {
        displayNewsTickerMessage(message);
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

    function handleVisibilityChange() {
        if (document.hidden) {
            newsTicker.classList.add('invisible');
            if (prizeElement) {
                document.querySelector('.news-ticker-content').style.animation = 'none';
                prizeElement.remove();
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
                const currentResourceQuantity = getResourceDataObject(message.category, [message.item, 'quantity']);
                const resourceStorageCapacity = getResourceDataObject(message.category, [message.item, 'storageCapacity']);
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
    
        deferredActions.push(() => {
            addWackyEffectsEventListeners();
        });
    
        return newMessage;
    }
}

function addOneOffEventListeners() {
    const oneOffElement = document.getElementById('prizeTickerSpan');

    oneOffElement.addEventListener('click', function () {
        const multiplier = parseFloat(this.getAttribute('data-multiplier'));
        const categoryArray = JSON.parse(this.getAttribute('data-category'));
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
        }

        this.style.pointerEvents = 'none';
        this.style.opacity = '0.5';
    });
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
            const prizeType = this.getAttribute('data-prize-type');
            const category = this.getAttribute('data-category');
            const item = this.getAttribute('data-item');
            const data1 = parseInt(this.getAttribute('data-data1'));

            switch (prizeType) {
                case 'giftResource':
                    setResourceDataObject(
                        getResourceDataObject(category, [item, 'quantity']) + data1,
                        category,
                        [item, 'quantity']
                    );
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
    
    if (!prizeTickerSpan) return;

    prizeTickerSpan.addEventListener('click', () => {
        const effectItem = prizeTickerSpan.getAttribute('data-effect-item');
        let targetElement = prizeTickerSpan.parentElement;

        if (!targetElement) return;

        const existingAnimation = targetElement.style.animation || '';
        let newAnimation = existingAnimation;

        switch (effectItem) {
            case 'wave':
                targetElement = prizeTickerSpan.parentElement.parentElement;
                newAnimation += ', waveAnimation 2s infinite alternate ease-in-out';
                prizeTickerSpan.style.opacity = '0.5';
                break;
            case 'disco':
                targetElement = prizeTickerSpan.parentElement;
                prizeTickerSpan.classList.add('disco');
                break;
            case 'bounce':
                targetElement = prizeTickerSpan.parentElement.parentElement;
                newAnimation += ', bounceAnimation 1s infinite ease-in-out';
                prizeTickerSpan.style.opacity = '0.8';
                break;
            case 'fade':
                newAnimation += ', fadeAnimation 1s infinite alternate';
                prizeTickerSpan.style.opacity = '0.5';
                break;
            case 'glitch':
                targetElement = prizeTickerSpan.parentElement.parentElement;
                newAnimation += ', glitchAnimation 0.1s infinite';
                prizeTickerSpan.style.opacity = '0.5';
                break;
            case 'wobble':
                targetElement = prizeTickerSpan.parentElement.parentElement;
                newAnimation += ', wobbleAnimation 1s infinite ease-in-out';
                prizeTickerSpan.style.opacity = '0.5';
                break;
            case 'boo':
                prizeTickerSpan.classList.remove('boo');
                break;
            default:
                console.warn('Unknown effect item:', effectItem);
                break;
        }

        targetElement.style.animation = newAnimation;

        prizeTickerSpan.style.pointerEvents = 'none';

    });
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

    const energyRate = getResourceDataObject('buildings', ['energy', 'rate']);
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

    if (originalRocketKey in headerDescriptions) {
        headerDescriptions[newRocketKey] = headerDescriptions[originalRocketKey];
        delete headerDescriptions[originalRocketKey];
    }
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

const header = document.querySelector('.debug-header');
header.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - debugWindow.offsetLeft;
    offsetY = e.clientY - debugWindow.offsetTop;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});

function onMouseMove(e) {
    if (isDragging) {
        debugWindow.style.left = `${e.clientX - offsetX}px`;
        debugWindow.style.top = `${e.clientY - offsetY}px`;
    }
}

function onMouseUp() {
    isDragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}

closeButton.addEventListener('click', () => {
    debugWindow.style.display = 'none';
});

const grantAllTechsButton = document.getElementById('grantAllTechsButton');
grantAllTechsButton.addEventListener('click', () => {
    const techArray = getResourceDataObject('techs');
    setResourceDataObject(getResourceDataObject('research', ['quantity']) + 1000000, 'research', ['quantity']);

    const fusionKeys = [
        'hydrogenFusion',
        'heliumFusion',
        'carbonFusion',
        'neonFusion',
        'oxygenFusion',
        'siliconFusion',
    ];

    Object.keys(techArray).forEach((techKey) => {
        setTechUnlockedArray(techKey);

        if (fusionKeys.includes(techKey)) {
            const fusionElement = techKey.split('Fusion')[0];
            setTechSpecificUIItemsArray(fusionElement, 'fusionButton', techKey);
        }
    });

    setCanFuelRockets(true);
    setCanTravelToAsteroids(true);

    grantAllTechsButton.classList.add('red-disabled-text');
    setRenderedTechTree(false);
    showNotification('CHEAT! All techs unlocked!', 'info');

    console.log('All techs unlocked!');
});

const give1BButton = document.getElementById('give1BButton');
give1BButton.addEventListener('click', () => {
    const currentCash = getResourceDataObject('currency', ['cash']);
    const newCash = currentCash + 1000000000;

    setResourceDataObject(newCash, 'currency', ['cash']);
    
    showNotification('CHEAT! $1B added', 'info');
    console.log('$ 1B granted! Current cash:', newCash);
});

const give100Button = document.getElementById('give100Button');
give100Button.addEventListener('click', () => {
    const newCash = 100;

    setResourceDataObject(newCash, 'currency', ['cash']);
    
    showNotification('CHEAT! $100 set', 'info');
    console.log('$100 set! Current cash:', newCash);
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
    
    showNotification('CHEAT! 1M of every resource and compound added!', 'info');
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
    
    showNotification('CHEAT! 100 of every resource and compound!', 'info');
    console.log('100 of all resources and compounds!');
});

const add10AsteroidsButton = document.getElementById('add10AsteroidsButton');
add10AsteroidsButton.addEventListener('click', () => {
    for (let i = 0; i < 10; i++) {
        discoverAsteroid(true);
    }
    showNotification('CHEAT! Discovered 10 Asteroids!', 'info');
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
    showNotification('CHEAT! Launch Pad, Space Scanner and all Rockets Built!', 'info');
});

const gain10000AntimatterButton = document.getElementById('gain10000AntimatterButton');
gain10000AntimatterButton.addEventListener('click', () => {
    setAntimatterUnlocked(true);
    setResourceDataObject(getResourceDataObject('antimatter', ['quantity']) + 10000, 'antimatter', ['quantity']);
    showNotification('CHEAT! 10000 Antimatter added!', 'info');
});

