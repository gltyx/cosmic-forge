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
    getSaveData
} from './constantsAndGlobalVars.js';

import { setAchievementIconImageUrls } from './resourceDataObject.js';

import { showNotification } from './ui.js';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

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
                    'created_at': currentTimestamp
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

    if (type === 'initialise' || type === 'autoSave') {
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
      
      if (data) {
        const gameData = data.data;

            const decompressedJson = LZString.decompressFromEncodedURIComponent(gameData);
            const gameState = JSON.parse(decompressedJson);

            await initialiseLoadedGame(gameState, 'cloud');
            setAchievementIconImageUrls();
            showNotification('Game loaded successfully!', 'info', 3000, 'loadSave');
            return true;
        } else {
            showNotification('No saved game data found.', 'warning', 3000, 'loadSave');
            return false;
        }
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
        if (saveData.version < 0.56) {
            if (objectType === 'resourceData') {
                saveData.space.upgrades.ssStructural = { finished: false, builtParts: 0, parts: 20, price: 3000, resource1Price: [4000, 'steel', 'compounds'], resource2Price: [1500, 'titanium', 'compounds'], resource3Price: [4500, 'silicon', 'resources'], setPrice: 'ssStructuralPrice' };
                saveData.space.upgrades.ssLifeSupport = { finished: false, builtParts: 0, parts: 10, price: 7500, resource1Price: [5000, 'glass', 'compounds'], resource2Price: [20000, 'oxygen', 'resources'], resource3Price: [15000, 'water', 'compounds'], setPrice: 'ssLifeSupportPrice' };
                saveData.space.upgrades.ssAntimatterEngine = { finished: false, builtParts: 0, parts: 16, price: 6000, resource1Price: [3500, 'steel', 'compounds'], resource2Price: [2000, 'titanium', 'compounds'], resource3Price: [10000, 'neon', 'resources'], setPrice: 'ssAntimatterEnginePrice' };
                saveData.space.upgrades.ssFleetHangar = { finished: false, builtParts: 0, parts: 1, price: 50000, resource1Price: [40000, 'glass', 'compounds'], resource2Price: [20000, 'titanium', 'compounds'], resource3Price: [80000, 'steel', 'compounds'], setPrice: 'ssFleetHangarPrice' };
                saveData.space.upgrades.ssStellarScanner = { finished: false, builtParts: 0, parts: 8, price: 2500, resource1Price: [1500, 'glass', 'compounds'], resource2Price: [2000, 'silicon', 'resources'], resource3Price: [3000, 'neon', 'resources'], setPrice: 'ssStellarScannerPrice' };

                saveData.resources.solar.autoSell = false;
                saveData.resources.hydrogen.autoSell = false;
                saveData.resources.helium.autoSell = false;
                saveData.resources.carbon.autoSell = false;
                saveData.resources.neon.autoSell = false;
                saveData.resources.oxygen.autoSell = false;
                saveData.resources.sodium.autoSell = false;
                saveData.resources.silicon.autoSell = false;
                saveData.resources.iron.autoSell = false;
                saveData.compounds.diesel.autoSell = false;
                saveData.compounds.glass.autoSell = false;
                saveData.compounds.steel.autoSell = false;
                saveData.compounds.concrete.autoSell = false;
                saveData.compounds.water.autoSell = false;
                saveData.compounds.titanium.autoSell = false;

                saveData.techs.nanoBrokers = { appearsAt: [18000, "nanoTubeTechnology", "steelFoundries", "compounds"], prereqs: ['Nano Tube Technology', 'Steel Foundries', 'Compounds'], price: 19000, idForRenderPosition: 498 }
            } else if (objectType === 'starSystemsData') {

            } else if (objectType === 'rocketNames') {
            
            } else if (objectType === 'galacticMarketData') {

            } else if (objectType === 'ascendencyBuffsData') {
                saveData = {
                    "efficientStorage": {
                        name: "Efficient Storage",
                        description: "buffEfficientStorageRow",
                        rebuyable: true,
                        rebuyableIncreaseMultiple: 2,
                        baseCostAp: 10,
                        effectCategoryMagnitude: 2,
                        boughtYet: 0,
                        timesRebuyable: 3
                    },
                    "smartAutoBuyers": {
                        name: "Smart Auto Buyers",
                        description: "buffSmartAutoBuyersRow",
                        rebuyable: true,
                        rebuyableIncreaseMultiple: 2,
                        baseCostAp: 15,
                        effectCategoryMagnitude: 1.5,
                        boughtYet: 0,
                        timesRebuyable: 100000
                    },
                    "jumpstartResearch": {
                        name: "Jumpstart Research",
                        description: "buffJumpstartResearchRow",
                        rebuyable: false,
                        rebuyableIncreaseMultiple: 1,
                        baseCostAp: 30,
                        effectCategoryMagnitude: 100,
                        boughtYet: 0,
                        timesRebuyable: 100000
                    },
                    "optimizedPowerGrids": {
                        name: "Optimized Power Grids",
                        description: "buffOptimizedPowerGridsRow",
                        rebuyable: true,
                        rebuyableIncreaseMultiple: 2,
                        baseCostAp: 25,
                        effectCategoryMagnitude: 1.2,
                        boughtYet: 0,
                        timesRebuyable: 100000
                    },
                    "fasterAsteroidScan": {
                        name: "Faster Asteroid Scan",
                        description: "buffFasterAsteroidScanRow",
                        rebuyable: true,
                        rebuyableIncreaseMultiple: 1.2,
                        baseCostAp: 20,
                        effectCategoryMagnitude: 0.25,
                        boughtYet: 0,
                        timesRebuyable: 4
                    },
                    "deeperStarStudy": {
                        name: "Deeper Star Study",
                        description: "buffDeeperStarStudyRow",
                        rebuyable: true,
                        rebuyableIncreaseMultiple: 2,
                        baseCostAp: 50,
                        effectCategoryMagnitude: 2,
                        boughtYet: 0,
                        timesRebuyable: 3
                    },
                    "asteroidScannerBoost": {
                        name: "Asteroid Scanner Boost",
                        description: "buffAsteroidScannerBoostRow",
                        rebuyable: true,
                        rebuyableIncreaseMultiple: 1,
                        baseCostAp: 20,
                        effectCategoryMagnitude: 2,
                        boughtYet: 0,
                        timesRebuyable: 2
                    },
                    "rocketFuelOptimization": {
                        name: "Rocket Fuel Optimization",
                        description: "buffRocketFuelOptimizationRow",
                        rebuyable: false,
                        rebuyableIncreaseMultiple: 1,
                        baseCostAp: 40,
                        effectCategoryMagnitude: 0.5,
                        boughtYet: 0,
                        timesRebuyable: 100000
                    },
                    "enhancedMining": {
                        name: "Enhanced Mining",
                        description: "buffEnhancedMiningRow",
                        rebuyable: true,
                        rebuyableIncreaseMultiple: 2,
                        baseCostAp: 15,
                        effectCategoryMagnitude: 0.25,
                        boughtYet: 0,
                        timesRebuyable: 4
                    },
                    "quantumEngines": {
                        name: "Quantum Engines",
                        description: "buffQuantumEnginesRow",
                        rebuyable: true,
                        rebuyableIncreaseMultiple: 1.2,
                        baseCostAp: 15,
                        effectCategoryMagnitude: 2,
                        boughtYet: 0,
                        timesRebuyable: 10
                    }
                }
                saveData.version = 0.56;
            }
        }

        if (saveData.version < 0.60) {
            if (objectType === 'resourceData') {
                saveData.resources.solar.upgrades.autoBuyer.tier1.active = true;
                saveData.resources.solar.upgrades.autoBuyer.tier2.active = true;
                saveData.resources.solar.upgrades.autoBuyer.tier3.active = true;
                saveData.resources.solar.upgrades.autoBuyer.tier4.active = true;

                saveData.resources.hydrogen.upgrades.autoBuyer.tier1.active = true;
                saveData.resources.hydrogen.upgrades.autoBuyer.tier2.active = true;
                saveData.resources.hydrogen.upgrades.autoBuyer.tier3.active = true;
                saveData.resources.hydrogen.upgrades.autoBuyer.tier4.active = true;

                saveData.resources.helium.upgrades.autoBuyer.tier1.active = true;
                saveData.resources.helium.upgrades.autoBuyer.tier2.active = true;
                saveData.resources.helium.upgrades.autoBuyer.tier3.active = true;
                saveData.resources.helium.upgrades.autoBuyer.tier4.active = true;

                saveData.resources.carbon.upgrades.autoBuyer.tier1.active = true;
                saveData.resources.carbon.upgrades.autoBuyer.tier2.active = true;
                saveData.resources.carbon.upgrades.autoBuyer.tier3.active = true;
                saveData.resources.carbon.upgrades.autoBuyer.tier4.active = true;

                saveData.resources.neon.upgrades.autoBuyer.tier1.active = true;
                saveData.resources.neon.upgrades.autoBuyer.tier2.active = true;
                saveData.resources.neon.upgrades.autoBuyer.tier3.active = true;
                saveData.resources.neon.upgrades.autoBuyer.tier4.active = true;

                saveData.resources.oxygen.upgrades.autoBuyer.tier1.active = true;
                saveData.resources.oxygen.upgrades.autoBuyer.tier2.active = true;
                saveData.resources.oxygen.upgrades.autoBuyer.tier3.active = true;
                saveData.resources.oxygen.upgrades.autoBuyer.tier4.active = true;

                saveData.resources.sodium.upgrades.autoBuyer.tier1.active = true;
                saveData.resources.sodium.upgrades.autoBuyer.tier2.active = true;
                saveData.resources.sodium.upgrades.autoBuyer.tier3.active = true;
                saveData.resources.sodium.upgrades.autoBuyer.tier4.active = true;

                saveData.resources.silicon.upgrades.autoBuyer.tier1.active = true;
                saveData.resources.silicon.upgrades.autoBuyer.tier2.active = true;
                saveData.resources.silicon.upgrades.autoBuyer.tier3.active = true;
                saveData.resources.silicon.upgrades.autoBuyer.tier4.active = true;

                saveData.resources.iron.upgrades.autoBuyer.tier1.active = true;
                saveData.resources.iron.upgrades.autoBuyer.tier2.active = true;
                saveData.resources.iron.upgrades.autoBuyer.tier3.active = true;
                saveData.resources.iron.upgrades.autoBuyer.tier4.active = true;

                saveData.compounds.diesel.upgrades.autoBuyer.tier1.active = true;
                saveData.compounds.diesel.upgrades.autoBuyer.tier2.active = true;
                saveData.compounds.diesel.upgrades.autoBuyer.tier3.active = true;
                saveData.compounds.diesel.upgrades.autoBuyer.tier4.active = true;

                saveData.compounds.glass.upgrades.autoBuyer.tier1.active = true;
                saveData.compounds.glass.upgrades.autoBuyer.tier2.active = true;
                saveData.compounds.glass.upgrades.autoBuyer.tier3.active = true;
                saveData.compounds.glass.upgrades.autoBuyer.tier4.active = true;
                
                saveData.compounds.concrete.upgrades.autoBuyer.tier1.active = true;
                saveData.compounds.concrete.upgrades.autoBuyer.tier2.active = true;
                saveData.compounds.concrete.upgrades.autoBuyer.tier3.active = true;
                saveData.compounds.concrete.upgrades.autoBuyer.tier4.active = true;

                saveData.compounds.steel.upgrades.autoBuyer.tier1.active = true;
                saveData.compounds.steel.upgrades.autoBuyer.tier2.active = true;
                saveData.compounds.steel.upgrades.autoBuyer.tier3.active = true;
                saveData.compounds.steel.upgrades.autoBuyer.tier4.active = true;

                saveData.compounds.water.upgrades.autoBuyer.tier1.active = true;
                saveData.compounds.water.upgrades.autoBuyer.tier2.active = true;
                saveData.compounds.water.upgrades.autoBuyer.tier3.active = true;
                saveData.compounds.water.upgrades.autoBuyer.tier4.active = true;

                saveData.compounds.titanium.upgrades.autoBuyer.tier1.active = true;
                saveData.compounds.titanium.upgrades.autoBuyer.tier2.active = true;
                saveData.compounds.titanium.upgrades.autoBuyer.tier3.active = true;
                saveData.compounds.titanium.upgrades.autoBuyer.tier4.active = true;
            } else if (objectType === 'starSystemsData') {

            } else if (objectType === 'rocketNames') {
            
            } else if (objectType === 'galacticMarketData') {

            } else if (objectType === 'ascendencyBuffsData') {
            
            }
            saveData.version = 0.60;
        }

        if (saveData.version < 0.62) {
            if (objectType === 'resourceData') {
                saveData.resources.hydrogen.saleValue = 0.02;
                saveData.resources.helium.saleValue = 0.03;
                saveData.resources.carbon.saleValue = 0.1;
                saveData.resources.neon.saleValue = 0.40;
                saveData.resources.oxygen.saleValue = 0.05;
                saveData.resources.sodium.saleValue = 0.1;
                saveData.resources.silicon.saleValue = 0.08;
                saveData.resources.iron.saleValue = 0.17;

                saveData.compounds.diesel.saleValue = 0.3;
                saveData.compounds.glass.saleValue = 0.8;
                saveData.compounds.steel.saleValue = 1.8;
                saveData.compounds.concrete.saleValue = 0.8;
                saveData.compounds.water.saleValue = 1.6;
                saveData.compounds.titanium.saleValue = 6;

                saveData.research.upgrades.scienceKit.active = true;
                saveData.research.upgrades.scienceClub.active = true;
                saveData.research.upgrades.scienceLab.active = true;

            } else if (objectType === 'starSystemsData') {

            } else if (objectType === 'rocketNames') {
            
            } else if (objectType === 'galacticMarketData') {

            } else if (objectType === 'ascendencyBuffsData') {
            
            }
            saveData.version = 0.62;
        }
    
        saveData.version += 0.01;
    }   

    return saveData;
}
