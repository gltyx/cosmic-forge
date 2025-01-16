import {
    setSaveData, 
    captureGameStatusForSaving, 
    restoreGameStatus, 
    getElements, 
    // getLanguage, 
    // setLanguageChangedFlag, 
    // getLanguageChangedFlag 
} from './constantsAndGlobalVars.js';

//import {localize} from './localization.js';
//import { handleLanguageChange } from './ui.js';

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

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
        console.log("Game saved to the cloud!");
    } catch (error) {
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
                alert('Text copied to clipboard!');
            })
            .catch(err => {
                alert(err);
            })
            .finally(() => {
                textArea.setSelectionRange(0, 0);
            })
    } catch (err) {
        alert(err);
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
            alert('Game loaded successfully!');
        } else {
            alert('No saved game data found.');
        }
    } catch (error) {
        console.error("Error loading game from cloud:", error);
        alert('Error loading game data from the cloud.');
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
                alert('Invalid game data string. Please check and try again.');
                return reject('Invalid game data string');
            }

            const decompressedJson = LZString.decompressFromEncodedURIComponent(compressed);
            const gameState = JSON.parse(decompressedJson);

            initialiseLoadedGame(gameState)
                .then(() => {
                    alert('Game loaded successfully!');
                    resolve();
                })
                .catch(error => {
                    console.error('Error initializing game:', error);
                    alert('Error initializing game. Please make sure the data is correct.');
                    reject(error);
                });

        } catch (error) {
            console.error('Error loading game:', error);
            alert('Error loading game. Please make sure the string contains valid game data.');
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

// export function loadGame(string) {
//     if (!string) {
//         return new Promise((resolve, reject) => {
//             const input = document.createElement('input');
//             input.type = 'file';
//             input.accept = '.txt';

//             input.addEventListener('change', (event) => {
//                 handleFileSelectAndInitialiseLoadedGame(event, false, null)
//                     .then(() => {
//                         resolve();
//                     })
//                     .catch(reject);
//             });

//             input.click();
//         });
//     } else {
//         const textArea = document.getElementById('loadSaveGameStringTextArea');
//         if (textArea) {
//             const string = {
//                 target: {
//                     result: textArea.value
//                 }
//             };
//             return handleFileSelectAndInitialiseLoadedGame(null, true, string);
//         } else {
//             return Promise.reject("Text area not found.");
//         }
//     }
// }

// function handleFileSelectAndInitialiseLoadedGame(event, stringLoad, string) {
//     return new Promise((resolve, reject) => {
//         const processGameData = (compressed) => {
//             try {
//                 // Validate the compressed string before processing
//                 if (!validateSaveString(compressed)) {
//                     alert('Invalid game data string. Please check and try again.');
//                     return reject('Invalid game data string');
//                 }

//                 let decompressedJson = LZString.decompressFromEncodedURIComponent(compressed);
//                 let gameState = JSON.parse(decompressedJson);

//                 getElements().overlay.classList.add('d-none');

//                 initialiseLoadedGame(gameState).then(() => {
//                     setLanguageChangedFlag(true);
//                     checkForLanguageChange();
//                     alert('Game loaded successfully!');
//                     resolve();
//                 }).catch(error => {
//                     console.error('Error initializing game:', error);
//                     alert('Error initializing game. Please make sure the data is correct.');
//                     reject(error);
//                 });

//             } catch (error) {
//                 console.error('Error loading game:', error);
//                 alert('Error loading game. Please make sure the file contains valid game data.');
//                 reject(error);
//             }
//         };

//         if (stringLoad) {
//             try {
//                 processGameData(string.target.result);
//             } catch (error) {
//                 console.error('Error processing string:', error);
//                 alert('Error processing string. Please make sure the string is valid.');
//                 reject(error);
//             }
//         } else {
//             const file = event.target.files[0];
//             if (!file) {
//                 return reject('No file selected');
//             }

//             const reader = new FileReader();
//             reader.onload = function(e) {
//                 try {
//                     processGameData(e.target.result);
//                 } catch (error) {
//                     console.error('Error reading file:', error);
//                     alert('Error reading file. Please make sure the file contains valid game data.');
//                     reject(error);
//                 }
//             };

//             reader.onerror = () => {
//                 reject('Error reading file');
//             };

//             reader.readAsText(file);
//         }
//     });
// }

// function validateSaveString(compressed) {
//     let decompressedJson = LZString.decompressFromEncodedURIComponent(compressed);
//     JSON.parse(decompressedJson);
//     return decompressedJson !== null;
// }

// async function initialiseLoadedGame(gameState) {    
//     await restoreGameStatus(gameState);
// }

// export function checkForLanguageChange() {
//     if (getLanguageChangedFlag()) {
//         handleLanguageChange(getLanguage());
//     }
//     setLanguageChangedFlag(false);
// }

// export function saveGame(isManualSave) {
//     const gameState = captureGameStatusForSaving();
//     const serializedGameState = JSON.stringify(gameState);
//     let compressed = LZString.compressToEncodedURIComponent(serializedGameState);
//     const blob = new Blob([compressed], {
//         type: 'text/plain'
//     });
//     const url = URL.createObjectURL(blob);

//     if (isManualSave) {
//         document.querySelector('.save-load-header').innerHTML = `${localize('headerStringSave', getLanguage())}`;
//         document.getElementById('copyButtonSavePopup').classList.remove('d-none');
//         document.getElementById('loadStringButton').classList.add('d-none');
//         getElements().saveLoadPopup.classList.remove('d-none');
//         //document.getElementById('overlay').classList.remove('d-none');

//         const reader = new FileReader();
//         reader.onload = function(event) {
//             getElements().loadSaveGameStringTextArea.value = `${event.target.result}`;
//             getElements().loadSaveGameStringTextArea.readOnly = true;
//         };
//         reader.readAsText(blob);
//     } else {
//         const a = document.createElement('a');
//         // Generate the filename with "AUTO_" prefix for auto save
//         const timestamp = getCurrentTimestamp();
//         const prefix = isManualSave ? "" : "AUTO_";
//         a.href = url;
//         a.download = `${prefix}ChipShopSave_${timestamp}.txt`;
//         a.style.display = 'none';

//         document.body.appendChild(a);
//         a.click();
//         URL.revokeObjectURL(url);
//         a.remove();
//     }
// }


// function getCurrentTimestamp() {
//     const now = new Date();
//     return `${now.getFullYear()}_${padZero(now.getMonth() + 1)}_${padZero(now.getDate())}_${padZero(now.getHours())}_${padZero(now.getMinutes())}_${padZero(now.getSeconds())}`;
// }

// function padZero(num) {
//     return num.toString().padStart(2, '0');
// }