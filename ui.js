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
        updateContent('Themes', 'Select theme.');
    });

    document.querySelector('.option2').addEventListener('click', function() {
        updateContent('Additional Menu Content 1', 'Content for option 2 goes here.');
    });

    document.querySelector('.option3').addEventListener('click', function() {
        updateContent('Additional Menu Content 2', 'Content for option 3 goes here.');
    });

    document.querySelector('.option4').addEventListener('click', function() {
        updateContent('Additional Menu Content 3', 'Content for option 4 goes here.');
    });

    function updateContent(heading, content) {
        document.getElementById('headingContent').innerText = heading;
    
        const labelContainer = document.getElementById('labelContainer');
        const inputContainer = document.getElementById('inputContainer');
    
        labelContainer.innerHTML = '';
        inputContainer.innerHTML = '';
    
        if (heading === 'Themes') {
            const themeLabel = document.createElement('label');
            themeLabel.setAttribute('for', 'themeSelect');
            themeLabel.innerText = 'Theme:';
            labelContainer.appendChild(themeLabel);
    
            const selectContainer = document.createElement('div');
            selectContainer.classList.add('select-container'); 
    
            const themeSelect = document.createElement('select');
            themeSelect.id = 'themeSelect';
            themeSelect.innerHTML = `
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="frosty">Frosty</option>
                <option value="summer">Summer</option>
                <option value="forest">Forest</option>
            `;
    
            const currentTheme = document.body.getAttribute('data-theme') || 'dark';
            themeSelect.value = currentTheme;
    
            themeSelect.addEventListener('change', (event) => {
                selectTheme(event.target.value);
            });

            selectContainer.appendChild(themeSelect);
            inputContainer.appendChild(selectContainer);
    
        } else {
            const contentContainer = document.createElement('div');
            contentContainer.innerHTML = content;
            inputContainer.appendChild(contentContainer);
        }
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