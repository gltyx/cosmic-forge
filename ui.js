import {
    getCurrentOptionPane,
    setCurrentOptionPane,
    getStorageUpgradeCostSand,
    getScienceKitPrice,
    getScienceClubPrice,
    getSandStorage,
    setSandStorage,
    getNotationType,
    setNotationType,
    getNotificationsToggle,
    setNotificationsToggle,
    setCurrentTab,
    getCurrentTab,
    getSandQuantity,
    setSandQuantity,
    getSilverQuantity,
    setSilverQuantity,
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
    setLanguage
} from './constantsAndGlobalVars.js';
import {
    increaseResourceStorage,
    manualIncrementer,
    startAutoIncrementer,
    doubleRate,
    toggleTimer,
    resetCounter,
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
            setCurrentOptionPane(this.textContent);
            updateContent(this.textContent, 'tab1');
        });
    });
    
    document.querySelectorAll('[class*="tab1"][class*="option2"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setCurrentOptionPane(this.textContent);
            updateContent(this.textContent, 'tab1');
        });
    });

    document.querySelectorAll('[class*="tab2"][class*="option1"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setCurrentOptionPane(this.textContent);
            updateContent(this.textContent, 'tab2');
        });
    });
    
    document.querySelectorAll('[class*="tab2"][class*="option2"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setCurrentOptionPane(this.textContent);
            updateContent(this.textContent, 'tab2');
        });
    });
    
    document.querySelectorAll('[class*="tab8"][class*="option1"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setCurrentOptionPane(this.textContent);
            updateContent(this.textContent, 'tab8');
        });
    });
    
    document.querySelectorAll('[class*="tab8"][class*="option2"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setCurrentOptionPane(this.textContent);
            updateContent(this.textContent, 'tab8');
        });
    });
    
    document.querySelectorAll('[class*="tab8"][class*="option3"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setCurrentOptionPane(this.textContent);
            updateContent(this.textContent,'tab8');
        });
    });
    
    document.querySelectorAll('[class*="tab8"][class*="option4"]').forEach(function(element) {
        element.addEventListener('click', function() {
            setCurrentOptionPane(this.textContent);
            updateContent(this.textContent, 'tab8');
        });
    });

    // document.getElementById("pauseResumesandTimer").addEventListener("click", () => toggleTimer("sandTimer", "pauseResumesandTimer"));
    // document.getElementById("pauseResumesilverTimer").addEventListener("click", () => toggleTimer("silverTimer", "pauseResumesilverTimer"));
    // document.getElementById("doubleRatesandTimer").addEventListener("click", () => doubleRate("sandTimer"));
    // document.getElementById("doubleRatesilverTimer").addEventListener("click", () => doubleRate("silverTimer"));
    // document.getElementById("resetCountersandTimer").addEventListener("click", () => resetCounter("sandTimer"));
    // document.getElementById("resetCountersilverTimer").addEventListener("click", () => resetCounter("silverTimer"));
    // document.getElementById("startAutoIncrementSand").addEventListener("click", () => startAutoIncrementer("sand"));
    // document.getElementById("startAutoIncrementSilver").addEventListener("click", () => startAutoIncrementer("silver"));

    const tabs = document.querySelectorAll('#tabsContainer .tab');
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            setCurrentTab(index + 1);
            highlightActiveTab(index);
            setGameState(getGameVisibleActive());
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
    if (heading === 'Sand') {
        const sandRow = createOptionRow(
            'Gain 1 Sand:',
            createButton('Gain', ['option-button'], () => {
                manualIncrementer(getSandQuantity, setSandQuantity, getSandStorage, 1, "sandQuantity")
            }, ''),
            false,
            '',
            ''
        );
        optionContentElement.appendChild(sandRow);

        const containerSizeRow = createOptionRow(
            'Increase Container Size:',
            createButton('Increase Storage', ['option-button', 'red-text', 'resource-cost-check'], () => {
                increaseResourceStorage(setSandStorage, getSandStorage, getSandQuantity, setSandQuantity, "sandQuantity");
            }, 'sandStorageCheck'),
            false,
            `${getStorageUpgradeCostSand().price + " " + getStorageUpgradeCostSand().resource}`,
            getStorageUpgradeCostSand(),
            'sandStorageCheck'
        );
        optionContentElement.appendChild(containerSizeRow);
    }
}

function drawTab2Content(heading, optionContentElement) {
    if (heading === 'Research') {
        const scienceKitRow = createOptionRow(
            'Science Kit:',
            createButton('Buy', ['option-button', 'red-text', 'resource-cost-check'], () => {
                manualIncrementer(getScienceKitQuantity, setScienceKitQuantity, getScienceKitPrice, 1, "scienceKitQuantity")
            }, 'buyUpgradeCheck'),
            false,
            `${getScienceKitPrice().price + " " + getScienceKitPrice().resource}`,
            getScienceKitPrice(),
            'buyUpgradeCheck'
        );
        optionContentElement.appendChild(scienceKitRow);

        const scienceClubRow = createOptionRow(
            'Open Science Club:',
            createButton('Buy', ['option-button', 'red-text', 'resource-cost-check'], () => {
                manualIncrementer(getScienceClubQuantity, setScienceClubQuantity, getScienceClubPrice, 1, "scienceClubQuantity")
            }, 'buyUpgradeCheck'),
            false,
            `${getScienceClubPrice().price + " " + getScienceClubPrice().resource}`,
            getScienceClubPrice(),
            'buyUpgradeCheck'
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
            false,
            'Change styling of the page.',
            ''
        );
        optionContentElement.appendChild(themeRow);

        const notationRow = createOptionRow(
            'Notation:',
            createDropdown('notationSelect', [
                { value: 'normal', text: 'Normal' },
                { value: 'scientific', text: 'Scientific' },
            ], 'normal', (value) => {
                setNotationType(value);
            }),
            false,
            'Change the notation used.',
            ''
        );
        optionContentElement.appendChild(notationRow);

        const notificationsRow = createOptionRow(
            'Notifications:',
            createToggleSwitch('notificationsToggle', true, (isEnabled) => {
                setNotificationsToggle(isEnabled);
            }),
            false,
            'Toggle notifications',
            ''
        );
        optionContentElement.appendChild(notificationsRow);

        const triggerNotificationsRow = createOptionRow(
            'Trigger Notification:',
            createButton('Send Notification', ['btn-secondary'], sendTestNotification, ''),
            true,
            'Send test notification',
            ''
        );
        optionContentElement.appendChild(triggerNotificationsRow);
    }
}

function createOptionRow(labelText, inputElement, hidden, descriptionText, resourcePriceObject, dataConditionCheck) {
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
    inputContainer.appendChild(inputElement);
    row.appendChild(inputContainer);

    const descriptionContainer = document.createElement('div');
    descriptionContainer.classList.add('label-container');
    const description = document.createElement('label');
    description.innerText = descriptionText;
    description.classList.add('red-text');
    description.classList.add('resource-cost-check');
    description.dataset.conditionCheck = dataConditionCheck;
    descriptionContainer.appendChild(description);
    row.appendChild(descriptionContainer);

    if (resourcePriceObject && resourcePriceObject.checkQuantity() >= resourcePriceObject.price) {
        description.classList.remove('red-text');
    }

    return row;
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

function createButton(text, classNames, onClick, dataConditionCheck) {
    const button = document.createElement('button');
    button.innerText = text;
    
    if (Array.isArray(classNames)) {
        classNames.forEach(className => button.classList.add(className));
    } else if (typeof classNames === 'string') {
        button.classList.add(classNames);
    }

    if (dataConditionCheck) {
        button.dataset.conditionCheck = dataConditionCheck;
    }

    button.addEventListener('click', onClick);
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