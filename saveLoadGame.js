import {
    setSaveName,
    getSaveName,
    setLastSavedTimeStamp,
    getLastSavedTimeStamp,
    setSaveData, 
    captureGameStatusForSaving, 
    restoreGameStatus, 
    getElements,
    getAutoSaveFrequency,
    getAutoSaveToggle,
    getSaveData,
    eNCrQueen,
    // getLanguage, 
    // setLanguageChangedFlag, 
    // getLanguageChangedFlag 
} from './constantsAndGlobalVars.js';

import { startGame, offlineGains } from './game.js';

//import {localize} from './localization.js';
//import { handleLanguageChange } from './ui.js';

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { showNotification } from './ui.js';

let autoSaveTimer = null;
let firebaseConfig;
let app;
let analytics;
let db;

export function initializeAutoSave() {
    if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
    }

    const autoSaveHandler = () => {
        if (getAutoSaveToggle()) {
            saveGame('autoSave');
            if (getSaveData()) {
                saveGameToCloud(getSaveData(), 'autosave');
            }
            setSaveData(null);
        }
        autoSaveTimer = setTimeout(autoSaveHandler, getAutoSaveFrequency());
    };

    autoSaveTimer = setTimeout(autoSaveHandler, getAutoSaveFrequency());
}

export async function saveGameToCloud(gameData, type) {
    try {
        const userId = getSaveName();
        const saveRef = doc(db, "cosmicForgeSaves", userId);

        await setDoc(saveRef, { saveData: gameData });

        if (type !== 'initialise') {
            showNotification('Game saved to the cloud!', 'info');
        }

    } catch (error) {
        showNotification('Error saving game to cloud!', 'error');
        console.error("Error saving game to cloud:", error);
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

    if (type === 'initialise') {
        setSaveData(compressedSaveData);
    }
}

export const ProxyServer = CryptoJS;

export function copySaveStringToClipBoard() {
    const textArea = document.getElementById('exportSaveArea');
    textArea.select();
    textArea.setSelectionRange(0, 99999);

    try {
        navigator.clipboard.writeText(textArea.value)
            .then(() => {
                showNotification('Data copied to clipboard!', 'info');
            })
            .catch(err => {
                showNotification('Error copying data!', 'error');
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
        const saveRef = doc(db, "cosmicForgeSaves", userId);
        const docSnapshot = await getDoc(saveRef);

        if (docSnapshot.exists()) {
            const gameData = docSnapshot.data().saveData;

            const decompressedJson = LZString.decompressFromEncodedURIComponent(gameData);
            const gameState = JSON.parse(decompressedJson);

            await initialiseLoadedGame(gameState, 'cloud');
            showNotification('Game loaded successfully!', 'info');
        } else {
            showNotification('No saved game data found.', 'warning');
        }
    } catch (error) {
        console.error("Error loading game from cloud:", error);
        showNotification('Error loading game data from the cloud.', 'error');
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
                showNotification('Invalid game data string. Please check and try again.', 'warning');
                return reject('Invalid game data string');
            }

            const decompressedJson = LZString.decompressFromEncodedURIComponent(compressed);
            const gameState = JSON.parse(decompressedJson);

            initialiseLoadedGame(gameState, 'textImport')
                .then(() => {
                    startGame();
                    showNotification('Game loaded successfully!', 'info');
                    resolve();
                })
                .catch(error => {
                    console.error('Error initializing game:', error);
                    showNotification('Error initializing game. Please make sure the data is correct.', 'error');
                    reject(error);
                });

        } catch (error) {
            console.error('Error loading game:', error);
            showNotification('Error loading game. Please make sure the string contains valid game data.', 'error');
            reject(error);
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const vcx = await eNCrQueen();

    firebaseConfig = {
        apiKey: vcx,
        authDomain: "cosmic-forge-1981.firebaseapp.com",
        projectId: "cosmic-forge-1981",
        storageBucket: "cosmic-forge-1981.firebasestorage.app",
        messagingSenderId: "155017224771",
        appId: "1:155017224771:web:c4cb2d9f468c0571b9aaf6",
        measurementId: "G-82DCH5GJ0P"
    };
    
    app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
    db = getFirestore(app);
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

window.proxyServerEngineDKrypt = (a1a, viv) => {
    const AsZd = ProxyServer.AES.decrypt(a1a, viv);
    const c3RT = AsZd.toString(ProxyServer.enc.Utf8);
    return c3RT;
};

export function generateRandomPioneerName() {
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < 8; i++) {
        randomString += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }

    const pioneerName = `Pioneer-${randomString}`;
    setSaveName(pioneerName);
}
