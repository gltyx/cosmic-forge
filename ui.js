import {
    getHydrogenAB1Quantity,
    setHydrogenAB1Quantity,
    getLastScreenOpenRegister,
    setLastScreenOpenRegister,
    getHydrogenSalePreview,
    setSalePreview,
    getResourcesToDeduct,
    setResourcesToDeduct,
    getScienceKitQuantity,
    setScienceKitQuantity,
    getScienceClubQuantity,
    setScienceClubQuantity,
    getCurrentOptionPane,
    setCurrentOptionPane,
    getUpgradeHydrogen,
    getUpgradeResearch,
    setUpgradeResearch,
    getHydrogenStorage,
    setHydrogenStorage,
    getNotationType,
    setNotationType,
    getNotificationsToggle,
    setNotificationsToggle,
    setCurrentTab,
    getCurrentTab,
    getHydrogenQuantity,
    setHydrogenQuantity,
    getResearchQuantity,
    setResearchQuantity,
    getLanguage,
    setElements,
    getElements,
    setBeginGameStatus,
    getGameInProgress,
    setGameInProgress,
    getGameVisibleActive,
    getMenuState,
    getLanguageSelected,
    setLanguageSelected,
    setLanguage,
    setCurrencySymbol
} from './constantsAndGlobalVars.js';
import {
    sellResource,
    increaseResourceStorage,
    gain,
    setGameState,
    startGame
} from './game.js';
import {
    initLocalization,
    localize
} from './localization.js';

document.addEventListener('DOMContentLoaded', async () => {
    setElements();
    // Event listeners
    getElements().newGameMenuButton.addEventListener('click', async () => {
        setBeginGameStatus(true);
        if (!getGameInProgress()) {
            setGameInProgress(true);
        }
        setGameState(getGameVisibleActive());
        //PRE GAME START CODE HERE AFTER NEW GAME CLICKED
        startGame();
    });

    setGameState(getMenuState());
    handleLanguageChange(getLanguageSelected());

    let notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    document.body.appendChild(notificationContainer);

    document.querySelectorAll('[class*="tab1"][class*="option1"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab1', 'hydrogen');
            setCurrentOptionPane(this.textContent);
            updateContent(this.textContent, 'tab1');
        });
    });
    
    document.querySelectorAll('[class*="tab1"][class*="option2"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab1', 'option2');
            setCurrentOptionPane(this.textContent);
            updateContent(this.textContent, 'tab1');
        });
    });

    document.querySelectorAll('[class*="tab2"][class*="option1"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab2', 'research');
            setCurrentOptionPane(this.textContent);
            updateContent(this.textContent, 'tab2');
        });
    });
    
    document.querySelectorAll('[class*="tab2"][class*="option2"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab2', 'tech tree');
            setCurrentOptionPane(this.textContent);
            updateContent(this.textContent, 'tab2');
        });
    });
    
    document.querySelectorAll('[class*="tab8"][class*="option1"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab8', 'visual');
            setCurrentOptionPane(this.textContent);
            updateContent(this.textContent, 'tab8');
        });
    });
    
    document.querySelectorAll('[class*="tab8"][class*="option2"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab8', 'option2');
            setCurrentOptionPane(this.textContent);
            updateContent(this.textContent, 'tab8');
        });
    });
    
    document.querySelectorAll('[class*="tab8"][class*="option3"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab8', 'option3');
            setCurrentOptionPane(this.textContent);
            updateContent(this.textContent,'tab8');
        });
    });
    
    document.querySelectorAll('[class*="tab8"][class*="option4"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setLastScreenOpenRegister('tab8', 'option4');
            setCurrentOptionPane(this.textContent);
            updateContent(this.textContent, 'tab8');
        });
    });

    // document.getElementById("pauseResumehydrogenTimer").addEventListener("click", () => toggleTimer("hydrogenTimer", "pauseResumehydrogenTimer"));
    // document.getElementById("pauseResumesilverTimer").addEventListener("click", () => toggleTimer("silverTimer", "pauseResumesilverTimer"));
    // document.getElementById("doubleRatehydrogenTimer").addEventListener("click", () => doubleRate("hydrogenTimer"));
    // document.getElementById("doubleRatesilverTimer").addEventListener("click", () => doubleRate("silverTimer"));
    // document.getElementById("resetCounterhydrogenTimer").addEventListener("click", () => resetCounter("hydrogenTimer"));
    // document.getElementById("resetCountersilverTimer").addEventListener("click", () => resetCounter("silverTimer"));
    // document.getElementById("startAutoIncrementHydrogen").addEventListener("click", () => startAutoIncrementer("hydrogen"));
    // document.getElementById("startAutoIncrementSilver").addEventListener("click", () => startAutoIncrementer("silver"));

    const tabs = document.querySelectorAll('#tabsContainer .tab');
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            setCurrentTab(index + 1);
            highlightActiveTab(index);
            setGameState(getGameVisibleActive());
            const lastOpenOptionPane = getLastScreenOpenRegister('tab' + getCurrentTab());
            if (lastOpenOptionPane) {
                setCurrentOptionPane(lastOpenOptionPane);
            }
        });
    });   
});

function updateContent(heading, tab) {
    let headerContentElement;
    let optionContentElement;

    let tabNumber = parseInt(tab.replace('tab', ''));
    headerContentElement = document.getElementById(`headerContentTab${tabNumber}`);
    optionContentElement = document.getElementById(`optionContentTab${tabNumber}`);

    headerContentElement.innerText = heading;
    optionContentElement.innerHTML = '';
        
    switch (tab) {
        case 'tab1':
            drawTab1Content(heading, optionContentElement);
            break;
        case 'tab2':
            drawTab2Content(heading, optionContentElement);
            break;
        case 'tab3':
            drawTab3Content(heading, optionContentElement);
            break;
        case 'tab4':
            drawTab4Content(heading, optionContentElement);
            break;
        case 'tab5':
            drawTab5Content(heading, optionContentElement);
            break;
        case 'tab6':
            drawTab6Content(heading, optionContentElement);
            break;
        case 'tab7':
            drawTab7Content(heading, optionContentElement);
            break;
        case 'tab8':
            drawTab8Content(heading, optionContentElement);
            break;
        default:
            console.error('Invalid tab:', tab);
            break;
    }   
}

function drawTab1Content(heading, optionContentElement) {
    if (heading === 'Hydrogen') {
        let storagePrice = getUpgradeHydrogen('storage').price;
        let autobuyer1Price = getUpgradeHydrogen('autoBuyer').tier1.price;

        const sellHydrogenRow = createOptionRow(
            'Sell Hydrogen:',
            createDropdown('hydrogenSellSelectQuantity', [
                { value: 'all', text: 'All Stock' },
                { value: 'threeQuarters', text: '75% Stock' },
                { value: 'twoThirds', text: '67% Stock' },
                { value: 'half', text: '50% Stock' },
                { value: 'oneThird', text: '33% Stock' },
                { value: '100000', text: '100,000' },
                { value: '10000', text: '10,000' },
                { value: '1000', text: '1,000' },
                { value: '100', text: '100' },
                { value: '10', text: '10' },
                { value: '1', text: '1' },
            ], 'all', (value) => {
                setSalePreview('hydrogen', value);
            }),
            createButton('Sell', ['option-button', 'red-text', 'resource-cost-sell-check', 'sell'], () => {
                sellResource(getHydrogenQuantity, setHydrogenQuantity, 'hydrogen')
            }, 'sellResource', null, null, 'getHydrogenQuantity', true, null),
            null,
            null,
            null,
            false,
            `${getHydrogenSalePreview()}`,
            null,
            null,
            null,
            null,
            null
        );
        optionContentElement.appendChild(sellHydrogenRow);

        const hydrogenRow = createOptionRow(
            'Gain 1 Hydrogen:',
            createButton('Gain', ['option-button'], () => {
                gain(getHydrogenQuantity, setHydrogenQuantity, getHydrogenStorage, 1, 'hydrogenQuantity', null, null, false, null)
            }, null, null, null, null, false, null), //set false to true out of development to stop fast gains by holding enter
            null,
            null,
            null,
            null,
            false,
            null,
            null,
            null,
            null,
            null,
            null
        );
        optionContentElement.appendChild(hydrogenRow);

        if (typeof storagePrice === 'function') {
            storagePrice = storagePrice();
        }

        const containerSizeRow = createOptionRow(
            'Increase Container Size:',
            createButton('Increase Storage', ['option-button', 'red-text', 'resource-cost-sell-check'], () => {
                increaseResourceStorage(setHydrogenStorage, getHydrogenStorage, 'hydrogenQuantity', 'getUpgradeHydrogen', 'storage');
            }, 'upgradeCheck', 'getUpgradeHydrogen', 'storage', 'getHydrogenQuantity', true, null),
            null,
            null,
            null,
            null,
            false,
            `${storagePrice + " " + getUpgradeHydrogen('storage').resource}`,
            'getUpgradeHydrogen',
            'upgradeCheck',
            'storage',
            'getHydrogenQuantity',
            null
        );
        optionContentElement.appendChild(containerSizeRow);

        const autoBuyerRow = createOptionRow(
            'Hydrogen Compressor:',
            createButton(`Add ${getUpgradeHydrogen('autoBuyer').tier1.rate} Hydrogen /s`, ['option-button', 'red-text', 'resource-cost-sell-check'], () => {
                gain(getHydrogenAB1Quantity, setHydrogenAB1Quantity, null, 1, 'hydrogenAB1Quantity', 'getUpgradeHydrogen', 'autoBuyer', true, 'tier1')
            }, 'upgradeCheck', 'getUpgradeHydrogen', 'autoBuyer', 'getHydrogenQuantity', true, 'tier1'),
            null,
            null,
            null,
            null,
            false,
            `${autobuyer1Price + " " + getUpgradeHydrogen('autoBuyer').resource}`,
            'getUpgradeHydrogen',
            'upgradeCheck',
            'autoBuyer',
            'getHydrogenQuantity',
            'tier1'
        );
        optionContentElement.appendChild(autoBuyerRow);
    }
}

function drawTab2Content(heading, optionContentElement) {
    if (heading === 'Research') {
        const scienceKitRow = createOptionRow(
            'Science Kit:',
            createButton('Buy', ['option-button', 'red-text', 'resource-cost-sell-check'], () => {
                gain(getScienceKitQuantity, setScienceKitQuantity, null, 1, 'scienceKitQuantity', 'getUpgradeResearch', 'scienceKit', false, null, null)
            }, 'upgradeCheck', 'getUpgradeResearch', 'scienceKit', 'getHydrogenQuantity', false),
            null,
            null,
            null,
            null,
            false,
            `${getUpgradeResearch('scienceKit').price + ' ' + getUpgradeResearch('scienceKit').resource}`,
            'getUpgradeResearch',
            'upgradeCheck',
            'scienceKit',
            'getHydrogenQuantity',
            null
        );
        optionContentElement.appendChild(scienceKitRow);

        const scienceClubRow = createOptionRow(
            'Open Science Club:',
            createButton('Buy', ['option-button', 'red-text', 'resource-cost-sell-check'], () => {
                gain(getScienceClubQuantity, setScienceClubQuantity, null, 1, 'scienceClubQuantity', 'getUpgradeResearch', 'scienceClub', false, null, null)
            }, 'upgradeCheck', 'getUpgradeResearch', 'scienceClub', 'getHydrogenQuantity', false),
            null,
            null,
            null,
            null,
            false,
            `${getUpgradeResearch('scienceClub').price + ' ' + getUpgradeResearch('scienceClub').resource}`,
            'getUpgradeResearch',
            'upgradeCheck',
            'scienceClub',
            'getHydrogenQuantity',
            null
        );
        optionContentElement.appendChild(scienceClubRow);
    }
}

function drawTab3Content(heading, optionContentElement) {
    // Your logic for tab 3
}

function drawTab4Content(heading, optionContentElement) {
    // Your logic for tab 4
}

function drawTab5Content(heading, optionContentElement) {
    // Your logic for tab 5
}

function drawTab6Content(heading, optionContentElement) {
    // Your logic for tab 6
}

function drawTab7Content(heading, optionContentElement) {
    // Your logic for tab 7
}

function drawTab8Content(heading, optionContentElement) {
    if (heading === 'Visual') {
        const currencySymbolRow = createOptionRow(
            'Currency:',
            createDropdown('notationSelect', [
                { value: '$', text: 'Dollar ($)' },
                { value: '€', text: 'Euro (€)' },
                { value: '£', text: 'Pound (£)' },
                { value: '¥', text: 'Yen (¥)' },
                { value: '₹', text: 'Rupee (₹)' },
                { value: '₩', text: 'Won (₩)' },
                { value: '₣', text: 'Franc (₣)' },
                { value: '₿', text: 'Bitcoin (₿)' },
            ], '$', (value) => {
                setCurrencySymbol(value);
            }),
            null,
            null,
            null,
            null,
            false,
            'Change the symbol used for Cash (Visual Only).',
            null,
            null,
            null,
            null,
            null
        );
        optionContentElement.appendChild(currencySymbolRow);

        const notationRow = createOptionRow(
            'Notation:',
            createDropdown('notationSelect', [
                { value: 'normal', text: 'Normal' },
                { value: 'scientific', text: 'Scientific' },
            ], 'normal', (value) => {
                setNotationType(value);
            }),
            null,
            null,
            null,
            null,
            false,
            'Change the notation used.',
            null,
            null,
            null,
            null,
            null
        );
        optionContentElement.appendChild(notationRow);

        const notificationsRow = createOptionRow(
            'Notifications:',
            createToggleSwitch('notificationsToggle', true, (isEnabled) => {
                setNotificationsToggle(isEnabled);
            }),
            null,
            null,
            null,
            null,
            false,
            'Toggle notifications',
            null,
            null,
            null,
            null,
            null
        );
        optionContentElement.appendChild(notificationsRow);

        const themeRow = createOptionRow(
            'Theme:',
            createDropdown('themeSelect', [
                { value: 'light', text: 'Light' },
                { value: 'dark', text: 'Dark' },
                { value: 'frosty', text: 'Frosty' },
                { value: 'summer', text: 'Summer' },
                { value: 'forest', text: 'Forest' },
            ], document.body.getAttribute('data-theme') || 'dark', (value) => {
                selectTheme(value);
            }),
            null,
            null,
            null,
            null,
            false,
            'Change styling of the page.',
            null,
            null,
            null,
            null,
            null
        );
        optionContentElement.appendChild(themeRow);

        const triggerNotificationsRow = createOptionRow(
            'Trigger Notification:',
            createButton('Send Notification', ['btn-secondary'], sendTestNotification, null, null, null, null, false, null),
            null,
            null,
            null,
            null,
            true,
            'Send test notification',
            null,
            null,
            null,
            null,
            null
        );
        optionContentElement.appendChild(triggerNotificationsRow);
    }
}

function createOptionRow(labelText, inputElement1, inputElement2, inputElement3, inputElement4, inputElement5, hidden, descriptionText, resourcePriceObject, dataConditionCheck, objectSectionArgument, quantityArgument, autoBuyerTier) {
    const row = document.createElement('div');

    if (hidden) {
        row.classList.add('option-row', 'd-none');
    } else {
        row.classList.add('option-row', 'd-flex');
    }

    const labelContainer = document.createElement('div');
    labelContainer.classList.add('label-container');
    const label = document.createElement('label');
    label.innerText = labelText;
    labelContainer.appendChild(label);
    row.appendChild(labelContainer);

    const inputContainer = document.createElement('div');
    inputContainer.classList.add('input-container');

    if (inputElement1) {
        inputContainer.appendChild(inputElement1);
    }
    if (inputElement2) {
        inputContainer.appendChild(inputElement2);
    }
    if (inputElement3) {
        inputContainer.appendChild(inputElement3);
    }
    if (inputElement4) {
        inputContainer.appendChild(inputElement4);
    }
    if (inputElement5) {
        inputContainer.appendChild(inputElement5);
    }

    row.appendChild(inputContainer);

    const descriptionContainer = document.createElement('div');
    descriptionContainer.classList.add('description-container');
    const description = document.createElement('label');
    description.id = generateElementId(labelText);
    description.innerText = descriptionText;

    if (dataConditionCheck) {
        description.classList.add('red-text');
        description.classList.add('resource-cost-sell-check');

        description.dataset.conditionCheck = dataConditionCheck;
        description.dataset.resourcePriceObject = resourcePriceObject;
        description.dataset.argumentToPass = objectSectionArgument;
        description.dataset.argumentCheckQuantity = quantityArgument;
        description.dataset.autoBuyerTier = autoBuyerTier;
    }

    descriptionContainer.appendChild(description);
    row.appendChild(descriptionContainer);

    return row;
}

function generateElementId(labelText) {
    let id = labelText.replace(/:$/, '');
    id = id.replace(/(^\w|[A-Z]|\s+)(\w*)/g, (match, p1, p2, index) => {
        return index === 0 ? p1.toLowerCase() + p2 : p1.toUpperCase() + p2;
    });

    id += 'Description';
    id = id.replace(/\s+/g, '');
    return id;
}

function createDropdown(id, options, selectedValue, onChange) {
    const selectContainer = document.createElement('div');
    selectContainer.classList.add('select-container');

    const select = document.createElement('select');
    select.id = id;
    options.forEach((option) => {
        const opt = document.createElement('option');
        opt.value = option.value;
        opt.innerText = option.text;
        if (option.value === selectedValue) {
            opt.selected = true;
        }
        select.appendChild(opt);
    });

    select.addEventListener('change', (event) => {
        onChange(event.target.value);
    });

    selectContainer.appendChild(select);
    return selectContainer;
}

function createToggleSwitch(id, isChecked, onChange) {
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

    toggleContainer.appendChild(toggle);
    toggleContainer.appendChild(toggleLabel);
    return toggleContainer;
}

function createButton(text, classNames, onClick, dataConditionCheck, resourcePriceObject, objectSectionArgument, quantityArgument, disableKeyboardForButton, autoBuyerTier) {
    const button = document.createElement('button');
    button.innerText = text;
    
    if (Array.isArray(classNames)) {
        classNames.forEach(className => button.classList.add(className));
    } else if (typeof classNames === 'string') {
        button.classList.add(classNames);
    }

    if (dataConditionCheck) {
        if (dataConditionCheck === 'sellResource') {
            button.dataset.conditionCheck = dataConditionCheck;
            button.dataset.argumentCheckQuantity = quantityArgument;
        } else {
            button.dataset.conditionCheck = dataConditionCheck;
            button.dataset.resourcePriceObject = resourcePriceObject;
            button.dataset.argumentToPass = objectSectionArgument;
            button.dataset.argumentCheckQuantity = quantityArgument;
            button.dataset.autoBuyerTier = autoBuyerTier;
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

function selectTheme(theme) {
    const body = document.body;
    body.setAttribute('data-theme', theme);
}

function sendTestNotification() {
    showNotification("This is a Test!", 'info', 5000);
}

function showNotification(message, type = 'info', duration = 5000, test) {
    if (getNotificationsToggle()) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerText = `${message}`;
        
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
        }, duration);
    }
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

async function setElementsLanguageText() {
    getElements().menuTitle.innerHTML = `<h2>${localize('menuTitle', getLanguage())}</h2>`;
    getElements().newGameMenuButton.innerHTML = `${localize('newGame', getLanguage())}`;
}

export async function handleLanguageChange(languageCode) {
    setLanguageSelected(languageCode);
    await setupLanguageAndLocalization();
    setElementsLanguageText();
}

async function setupLanguageAndLocalization() {
    setLanguage(getLanguageSelected());
    await initLocalization(getLanguage());
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