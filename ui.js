import {
    setCurrentTab,
    getCurrentTab,
    getGold,
    setGold,
    getSilver,
    setSilver,
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
    manualIncrementer,
    startAutoIncrementer,
    doubleSpeed,
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

    document.getElementById("pauseResumegoldTimer").addEventListener("click", () => toggleTimer("goldTimer", "pauseResumegoldTimer"));
    document.getElementById("pauseResumesilverTimer").addEventListener("click", () => toggleTimer("silverTimer", "pauseResumesilverTimer"));
    document.getElementById("doubleSpeedgoldTimer").addEventListener("click", () => doubleSpeed("goldTimer"));
    document.getElementById("doubleSpeedsilverTimer").addEventListener("click", () => doubleSpeed("silverTimer"));
    document.getElementById("resetCountergoldTimer").addEventListener("click", () => resetCounter("goldTimer"));
    document.getElementById("resetCountersilverTimer").addEventListener("click", () => resetCounter("silverTimer"));
    document.getElementById("incrementGold").addEventListener("click", () => manualIncrementer(getGold, setGold, 1, "goldQuantity"));
    document.getElementById("incrementSilver").addEventListener("click", () => manualIncrementer(getSilver, setSilver, 1, "silverQuantity"));
    document.getElementById("startAutoIncrementGold").addEventListener("click", () => startAutoIncrementer("gold"));
    document.getElementById("startAutoIncrementSilver").addEventListener("click", () => startAutoIncrementer("silver"));

    const tabs = document.querySelectorAll('#tabsContainer .tab');
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            setCurrentTab(index + 1);
            highlightActiveTab(index);
            setGameState(getGameVisibleActive());
            if (getCurrentTab() === 8) { //
                updateContent('', '');
            }
        });
    });

    document.querySelector('.option1').addEventListener('click', function() {
        updateContent('Visual');
    });

    document.querySelector('.option2').addEventListener('click', function() {
        updateContent('Additional Menu Content 1');
    });

    document.querySelector('.option3').addEventListener('click', function() {
        updateContent('Additional Menu Content 2');
    });

    document.querySelector('.option4').addEventListener('click', function() {
        updateContent('Additional Menu Content 3');
    });

    function updateContent(heading) {
        document.getElementById('headingContent').innerText = heading;
    
        const optionContent = document.getElementById('optionContent');
        optionContent.innerHTML = '';
    
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
                })
            );
            optionContent.appendChild(themeRow);
    
            const notationRow = createOptionRow(
                'Notation:',
                createDropdown('notationSelect', [
                    { value: 'normal', text: 'Normal' },
                    { value: 'scientific', text: 'Scientific' },
                ], 'normal', (value) => {
                    console.log('Notation selected:', value);
                })
            );
            optionContent.appendChild(notationRow);
    
            const notificationsRow = createOptionRow(
                'Notifications:',
                createToggleSwitch('notificationsToggle', true, (isEnabled) => {
                    console.log('Notifications:', isEnabled ? 'Enabled' : 'Disabled');
                })
            );
            optionContent.appendChild(notificationsRow);
        }
    }    
    
    function createOptionRow(labelText, inputElement) {
        const row = document.createElement('div');
        row.classList.add('option-row', 'd-flex');
    
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
            onChange(event.target.checked);
        });
    
        const toggleLabel = document.createElement('label');
        toggleLabel.htmlFor = id;
    
        toggleContainer.appendChild(toggle);
        toggleContainer.appendChild(toggleLabel);
        return toggleContainer;
    }
    
    
    function selectTheme(theme) {
        const body = document.body;
        body.setAttribute('data-theme', theme);
    }
});

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