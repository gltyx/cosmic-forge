import {
    getMinimumVersion,
    getCurrentGameVersion,
    setSaveName,
    getSaveName,
    setSaveData, 
    captureGameStatusForSaving, 
    restoreGameStatus, 
    getAutoSaveFrequency,
    getAutoSaveToggle,
    getSaveData,
    getUserPlatform,
    getFeedbackGiven,
    getFeedbackContent
} from './constantsAndGlobalVars.js';

import { setAchievementIconImageUrls } from './resourceDataObject.js';

import { showNotification } from './ui.js';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { getNavigatorLanguage } from './game.js';

const supabaseUrl = 'https://riogcxvtomyjlzkcnujf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpb2djeHZ0b215amx6a2NudWpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMjY1NDgsImV4cCI6MjA1OTYwMjU0OH0.HH7KXPrcORvl6Wiefupl422gRYxAa_kFCRM2-puUcsQ';
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', async () => {

});

let autoSaveTimer = null;

export function initializeAutoSave() {
    if (autoSaveTimer) {
        console.log("Clearing existing auto-save timer.");
        clearTimeout(autoSaveTimer);
    }

    const frequency = getAutoSaveFrequency();
    console.log("Auto-save initialized with frequency:", frequency, "ms");

    let timeLeft = frequency / 1000;

    const autoSaveHandler = () => {

        if (getAutoSaveToggle()) {
            saveGame('autoSave');

            if (getSaveData()) {
                saveGameToCloud(getSaveData(), 'autosave');
            }

            setSaveData(null);
        }

        timeLeft = frequency / 1000;
        autoSaveTimer = setTimeout(autoSaveHandler, frequency);
    };

    autoSaveTimer = setTimeout(autoSaveHandler, frequency);
}

export async function destroySaveGameOnCloud() {
    try {
        const userId = getSaveName();

        const { data: existingRow, error: fetchError } = await supabase
            .from('CosmicForge_saves')
            .select('*')
            .eq('pioneer_name', userId)
            .single();

        if (fetchError) {
            throw fetchError;
        }

        const currentTimestamp = new Date().toISOString();
        const backupUserId = `graveyard_${userId}`;

        const { error: insertError } = await supabase
            .from('CosmicForge_saves')
            .insert([{
                pioneer_name: backupUserId,
                data: existingRow.data,
                created_at: currentTimestamp,
                region: existingRow.region,
                feedback: existingRow.feedback,
                feedback_content: existingRow.feedback_content
            }]);

        if (insertError) {
            throw insertError;
        }

        const { error: updateError } = await supabase
            .from('CosmicForge_saves')
            .update({ data: null })
            .eq('pioneer_name', userId);

        if (updateError) {
            throw updateError;
        }

        showNotification('Cloud Save data deleted, Pioneer name can be re-used.', 'info', 3000, 'loadSave');

    } catch (error) {
        console.error('Error archiving and nulling save data:', error);
        showNotification('Failed to delete save data.', 'error', 3000, 'loadSave');
    }
}


export async function saveGameToCloud(gameData, type) {
    try {
        const userId = getSaveName();
        const currentTimestamp = new Date().toISOString();

        const { data: existingData, error: fetchError } = await supabase
            .from('CosmicForge_saves')
            .select('*')
            .eq('pioneer_name', userId)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            throw fetchError;
        }

        if (existingData) {
            const { error: updateError } = await supabase
                .from('CosmicForge_saves')
                .update({ 
                    data: gameData,
                    'created_at': currentTimestamp,
                    'region': getUserPlatform(),
                    'feedback': getFeedbackGiven(),
                    'feedback_content': getFeedbackContent()
                })
                .eq('pioneer_name', userId);

            if (updateError) {
                throw updateError;
            }

            if (type !== 'initialise') {
                showNotification('Game updated in the cloud!', 'info', 3000, 'loadSave');
            }
        } else {
            const { error: insertError } = await supabase
                .from('CosmicForge_saves')
                .insert([{ pioneer_name: userId, data: gameData, 'created_at': currentTimestamp }]);

            if (insertError) {
                throw insertError;
            }

            if (type !== 'initialise') {
                showNotification('Game saved to the cloud!', 'info', 3000, 'loadSave');
            }
        }

    } catch (error) {
        showNotification('Error saving game to cloud!', 'error', 3000, 'loadSave');
    }
}

export function saveGame(type) {
    const gameState = captureGameStatusForSaving(type);
    gameState.timeStamp = new Date().toISOString();

    const serializedGameState = JSON.stringify(gameState);
    const compressedSaveData = LZString.compressToEncodedURIComponent(serializedGameState);

    const saveGameArea = document.getElementById('exportSaveArea');
    if (saveGameArea) {
        setSaveData(compressedSaveData);
        saveGameArea.value = compressedSaveData;
        saveGameArea.readOnly = true;
    }

    if (type === 'initialise' || type === 'autoSave' || type === 'feedbackSave') {
        setSaveData(compressedSaveData);
    }
}

export function importSaveStringFileFromComputer() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';

    input.addEventListener('change', () => {
        const file = input.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const fileContents = event.target.result;

            if (typeof fileContents === 'string') {
                const textArea = document.getElementById('importSaveArea');
                if (textArea) {
                    textArea.value = fileContents;
                }

                try {
                    await loadGame();
                } catch (err) {
                    console.error('Load failed from file import:', err);
                }
            }
        };

        reader.readAsText(file);
    });

    input.click();
}

export function downloadSaveStringToComputer() {
    const saveArea = document.getElementById('exportSaveArea');
    if (!saveArea || !saveArea.value) {
        console.warn('No save data found to download.');
        return;
    }

    const saveData = saveArea.value;
    const blob = new Blob([saveData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    const now = new Date();
    const formattedTimestamp = `${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}_${String(now.getDate()).padStart(2, '0')} : ${String(now.getHours()).padStart(2, '0')}_${String(now.getMinutes()).padStart(2, '0')}_${String(now.getSeconds()).padStart(2, '0')}`;
    a.download = `cosmic_forge_save_${formattedTimestamp}.txt`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function copySaveStringToClipBoard() {
    const textArea = document.getElementById('exportSaveArea');
    textArea.select();
    textArea.setSelectionRange(0, 99999);

    try {
        navigator.clipboard.writeText(textArea.value)
            .then(() => {
                showNotification('Data copied to clipboard!', 'info', 3000, 'loadSave');
            })
            .catch(err => {
                showNotification('Error copying data! If on Chrome, this could be expected.  Select and copy the text string manually!', 'error', 3000, 'loadSave');
                console.log('Error copying data! ' + err);
            })
            .finally(() => {
                textArea.setSelectionRange(0, 0);
            })
    } catch (err) {
        console.log('Error copying data! ' + err);
    }
}

export async function loadGameFromCloud() {
    try {
        const userId = localStorage.getItem('saveName') || getSaveName();

        const { data, error } = await supabase
            .from('CosmicForge_saves')
            .select('data')
            .eq('pioneer_name', userId)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        if (!data) {
            // No row found at all
            showNotification('No saved game data found.', 'warning', 3000, 'loadSave');
            return false;
        }

        if (data.data === null) {
            showNotification('This Pioneer name is being reused for a new game.', 'info', 5000, 'loadSave');
            return false;
        }

        const gameData = data.data;
        const decompressedJson = LZString.decompressFromEncodedURIComponent(gameData);
        const gameState = JSON.parse(decompressedJson);

        await initialiseLoadedGame(gameState, 'cloud');
        setAchievementIconImageUrls();
        getNavigatorLanguage();
        showNotification('Game loaded successfully!', 'info', 3000, 'loadSave');
        return true;

    } catch (error) {
        console.error("Error loading game from cloud:", error);
        showNotification('Error loading game data from the cloud.', 'error', 3000, 'loadSave');
        return false;
    }
}

export function loadGame() {
    return new Promise((resolve, reject) => {
        const textArea = document.getElementById('importSaveArea');
        if (!textArea || !textArea.value.trim()) {
            return reject('No valid save data found in the import area.');
        }

        try {
            const compressed = textArea.value.trim();

            // Validate the compressed string before processing
            if (!validateSaveString(compressed)) {
                showNotification('Invalid game data string. Please check and try again.', 'warning', 3000, 'loadSave');
                return reject('Invalid game data string');
            }

            const decompressedJson = LZString.decompressFromEncodedURIComponent(compressed);
            const gameState = JSON.parse(decompressedJson);

            initialiseLoadedGame(gameState, 'textImport')
                .then(() => {
                    setAchievementIconImageUrls();
                    showNotification('Game loaded successfully!', 'info', 3000, 'loadSave');
                    resolve();
                })
                .catch(error => {
                    console.error('Error initializing game:', error);
                    showNotification('Error initializing game. Please make sure the data is correct.', 'error', 3000, 'loadSave');
                    reject(error);
                });

        } catch (error) {
            console.error('Error loading game:', error);
            showNotification('Error loading game. Please make sure the string contains valid game data.', 'error', 3000, 'loadSave');
            reject(error);
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {

});

function validateSaveString(compressed) {
    try {
        const decompressedJson = LZString.decompressFromEncodedURIComponent(compressed);
        JSON.parse(decompressedJson);
        return decompressedJson !== null;
    } catch {
        return false;
    }
}

async function initialiseLoadedGame(gameState, type) {
    await restoreGameStatus(gameState, type);
}

export function generateRandomPioneerName() {
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < 8; i++) {
        randomString += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }

    const pioneerName = `Pioneer-${randomString}`;
    setSaveName(pioneerName);
}

export function migrateResourceData(saveData, objectType) { //WILL EVOLVE OVER TIME
    const currentVersion = getCurrentGameVersion();
    saveData.version = saveData.version ? saveData.version : getMinimumVersion();

    while (saveData.version < currentVersion) {

        // if (saveData.version < 0.64) { //EXAMPLE
        //     if (objectType === 'resourceData') {
        //         saveData.compounds.diesel.autoCreate = false;
        //     } else if (objectType === 'starSystemsData') {

        //     } else if (objectType === 'rocketNames') {
            
        //     } else if (objectType === 'galacticMarketData') {

        //     } else if (objectType === 'ascendencyBuffsData') {
        //     }
        //     saveData.version = 0.64;
        // }
    
        saveData.version += 0.001;
    }   

    return saveData;
}