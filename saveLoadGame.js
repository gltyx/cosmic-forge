import {
    setSaveData, 
    captureGameStatusForSaving, 
    restoreGameStatus, 
    getElements, 
    // getLanguage, 
    // setLanguageChangedFlag, 
    // getLanguageChangedFlag 
} from './constantsAndGlobalVars.js';

import { startGame } from './game.js';

//import {localize} from './localization.js';
//import { handleLanguageChange } from './ui.js';

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { showNotification } from './ui.js';

const firebaseConfig = {
    apiKey: "AIzaSyCLctkVcwY2hQ-zeZsSbAjCR1VcwuRi0Kg",
    authDomain: "cosmic-forge-1981.firebaseapp.com",
    projectId: "cosmic-forge-1981",
    storageBucket: "cosmic-forge-1981.firebasestorage.app",
    messagingSenderId: "155017224771",
    appId: "1:155017224771:web:c4cb2d9f468c0571b9aaf6",
    measurementId: "G-82DCH5GJ0P"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export async function saveGameToCloud(gameData) {
    try {
        const userId = "guest";
        const saveRef = doc(db, "cosmicForgeSaves", userId);

        await setDoc(saveRef, { saveData: gameData });
        showNotification('Game saved to the cloud!', 'info');

        const timestamp = new Date().toISOString().split('T');
        const datePart = timestamp[0].replace(/-/g, '_');
        const timePart = timestamp[1].split('.')[0].replace(/:/g, '_');
        const backupSaveName = `${datePart}_${timePart}_BackupSave`;

        const backupSaveRef = doc(db, "cosmicForgeSaves", backupSaveName);

        await setDoc(backupSaveRef, { saveData: gameData });
        showNotification('Backup saved to the cloud!', 'info');

    } catch (error) {
        showNotification('Error saving game to cloud!', 'error');
        console.error("Error saving game to cloud:", error);
    }
}


export function saveGame() {
    const gameState = captureGameStatusForSaving();
    const serializedGameState = JSON.stringify(gameState);
    const compressedSaveData = LZString.compressToEncodedURIComponent(serializedGameState);

    const saveGameArea = document.getElementById('exportSaveArea');
    if (saveGameArea) {
        setSaveData(compressedSaveData);
        saveGameArea.value = compressedSaveData;
        saveGameArea.readOnly = true;
    }
}

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
        const userId = "guest";
        const saveRef = doc(db, "cosmicForgeSaves", userId);
        const docSnapshot = await getDoc(saveRef);

        if (docSnapshot.exists()) {
            const gameData = docSnapshot.data().saveData;

            const decompressedJson = LZString.decompressFromEncodedURIComponent(gameData);
            const gameState = JSON.parse(decompressedJson);

            await initialiseLoadedGame(gameState);
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

            initialiseLoadedGame(gameState)
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

function validateSaveString(compressed) {
    try {
        const decompressedJson = LZString.decompressFromEncodedURIComponent(compressed);
        JSON.parse(decompressedJson);
        return decompressedJson !== null;
    } catch {
        return false;
    }
}

async function initialiseLoadedGame(gameState) {
    await restoreGameStatus(gameState);
}