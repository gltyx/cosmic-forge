import { getCurrentTheme, setCurrentTheme, setAutoSaveToggle, getAutoSaveToggle, getAutoSaveFrequency, setAutoSaveFrequency, getSaveData, setSaveData, getCurrencySymbol, setCurrencySymbol, getNotationType, setNotationType, setNotificationsToggle, getNotificationsToggle } from './constantsAndGlobalVars.js';
import { createButton, createTextFieldArea, createOptionRow, createDropdown, createToggleSwitch, selectTheme } from './ui.js';
import { initializeAutoSave, saveGame, saveGameToCloud, loadGameFromCloud, copySaveStringToClipBoard, loadGame } from './saveLoadGame.js';

export function drawTab8Content(heading, optionContentElement) {
    if (heading === 'Visual') {
        const settingsCurrencySymbolRow = createOptionRow(
            'settingsCurrencySymbolRow',
            null,
            'Currency:',
            createDropdown('currencySelect', [
                { value: '$', text: 'Dollar ($)' },
                { value: '€', text: 'Euro (€)' },
                { value: '£', text: 'Pound (£)' },
                { value: '¥', text: 'Yen (¥)' },
                { value: '₹', text: 'Rupee (₹)' },
                { value: '₩', text: 'Won (₩)' },
                { value: '₣', text: 'Franc (₣)' },
                { value: '₿', text: 'Bitcoin (₿)' },
            ], getCurrencySymbol(), (value) => {
                setCurrencySymbol(value);
            }),
            null,
            null,
            null,
            null,
            'Change the symbol used for Cash (Visual Only).',
            null,
            null,
            null,
            null,
            null,
            null,
            false,
            null,
            null,
            null
        );
        optionContentElement.appendChild(settingsCurrencySymbolRow);

        const settingsNotationRow = createOptionRow(
            'settingsNotationRow',
            null,
            'Notation:',
            createDropdown('notationSelect', [
                { value: 'normalCondensed', text: 'Normal Condensed' },
                { value: 'normal', text: 'Normal' },
            ], getNotationType(), (value) => {
                setNotationType(value);
            }),
            null,
            null,
            null,
            null,
            'Change the notation used.',
            null,
            null,
            null,
            null,
            null,
            null,
            false,
            null,
            null,
            null
        );
        optionContentElement.appendChild(settingsNotationRow);

        const settingsToggleNotificationsRow = createOptionRow(
            'settingsToggleNotificationsRow',
            null,
            'Toggle Notifications:',
            createToggleSwitch('notificationsToggle', true, (isEnabled) => {
                setNotificationsToggle(isEnabled);
            }, null),
            null,
            null,
            null,
            null,
            'Toggle notifications',
            null,
            null,
            null,
            null,
            null,
            null,
            false,
            null,
            null,
            null
        );
        optionContentElement.appendChild(settingsToggleNotificationsRow);

        const settingsThemeRow = createOptionRow(
            'settingsThemeRow',
            null,
            'Theme:',
            createDropdown('themeSelect', [
                { value: 'terminal', text: 'Terminal' },
                { value: 'dark', text: 'Dark' },
                { value: 'misty', text: 'Misty' },
                { value: 'light', text: 'Light' },
                { value: 'frosty', text: 'Frosty' },
                { value: 'summer', text: 'Summer' },
                { value: 'forest', text: 'Forest' },
            ], document.body.getAttribute('data-theme'), (value) => {
                selectTheme(value);
            }),
            null,
            null,
            null,
            null,
            'Change styling of the page.',
            null,
            null,
            null,
            null,
            null,
            null,
            false,
            null,
            null,
            null
        );
        optionContentElement.appendChild(settingsThemeRow);

        const notificationsToggleElement = document.getElementById('notificationsToggle');
        if (notificationsToggleElement) {
            notificationsToggleElement.checked = getNotificationsToggle();
        }
        
        const currencyDropdownElement = document.getElementById('currencySelect');
        if (currencyDropdownElement) {
            currencyDropdownElement.value = getCurrencySymbol();
        }
        
        const notationDropdownElement = document.getElementById('notationSelect');
        if (notationDropdownElement) {
            notationDropdownElement.value = getNotationType();
        }
        
        const themeDropdownElement = document.getElementById('themeSelect');
        if (themeDropdownElement) {
            themeDropdownElement.value = getCurrentTheme();
        }     
    }

    if (heading === 'Saving / Loading') {   
        const autoSaveConfigRow = createOptionRow(
            'autoSaveConfigRow',
            null,
            'Auto Save:',
            createDropdown('autoSaveFrequency', [
                { value: 30000, text: '30 Seconds' },
                { value: 60000, text: '60 Seconds' },
                { value: 120000, text: '2 Minutes' },
                { value: 180000, text: '3 Minutes' },
                { value: 300000, text: '5 Minutes' },
                { value: 600000, text: '10 Minutes' },
            ], getAutoSaveFrequency(), (value) => {
                setAutoSaveFrequency(value);
                initializeAutoSave();
            }),
            createToggleSwitch('autoSaveToggle', false, (isEnabled) => {
                setAutoSaveToggle(isEnabled),
                initializeAutoSave();
            }, ['toggle-switch-spacing']),
            null,
            null,
            null,
            '',
            null,
            null,
            null,
            null,
            null,
            null,
            false,
            null,
            null,
            null
        );
        optionContentElement.appendChild(autoSaveConfigRow);

        const exportSaveRow = createOptionRow(
            'exportSaveRow',
            null,
            'Export Save:',
            createTextFieldArea('exportSaveArea', ['export-save'], 'Save Data should appear here'),
            createButton(`Export`, ['option-button', 'save-load-button'], () => {
                copySaveStringToClipBoard();
            }),
            null,
            null,
            null,
            '',
            null,
            null,
            null,
            null,
            null,
            null,
            false,
            null,
            null,
            null
        );
        optionContentElement.appendChild(exportSaveRow);

        const importSaveRow = createOptionRow(
            'importSaveRow',
            null,
            'Import Save:',
            createTextFieldArea('importSaveArea', ['import-save'], 'Please paste your Save Data here...'),
            createButton(`Import`, ['option-button', 'save-load-button'], () => {
                loadGame();
            }),
            null,
            null,
            null,
            '',
            null,
            null,
            null,
            null,
            null,
            null,
            false,
            null,
            null,
            null
        );
        optionContentElement.appendChild(importSaveRow);

        const exportCloudSaveRow = createOptionRow(
            'exportCloudSaveRow',
            null,
            'Export Cloud Save:',
            createButton(`Export Cloud Save`, ['option-button', 'save-load-button'], () => {
                saveGame();
                if (getSaveData()) {
                    saveGameToCloud(getSaveData());
                }
                setSaveData(null);
            }),
            null,
            null,
            null,
            null,
            '',
            null,
            null,
            null,
            null,
            null,
            null,
            false,
            null,
            null,
            null
        );
        optionContentElement.appendChild(exportCloudSaveRow);

        const importCloudSaveRow = createOptionRow(
            'importCloudSaveRow',
            null,
            'Import Recent Cloud Save:',
            createButton(`Import Cloud Save`, ['option-button', 'save-load-button'], () => {
                loadGameFromCloud();
            }),
            null,
            null,
            null,
            null,
            '',
            null,
            null,
            null,
            null,
            null,
            null,
            false,
            null,
            null,
            null
        );
        optionContentElement.appendChild(importCloudSaveRow);

        const autoSaveToggleElement = document.getElementById('autoSaveToggle');
        if (autoSaveToggleElement) {
            autoSaveToggleElement.checked = getAutoSaveToggle();
        }
        
        const autoSaveFrequencyElement = document.getElementById('autoSaveFrequency');
        if (autoSaveFrequencyElement) {
            autoSaveFrequencyElement.value = getAutoSaveFrequency();
        }  

        saveGame();
    }
}
