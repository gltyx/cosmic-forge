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

import { showNotification } from './ui.js';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://riogcxvtomyjlzkcnujf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpb2djeHZ0b215amx6a2NudWpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMjY1NDgsImV4cCI6MjA1OTYwMjU0OH0.HH7KXPrcORvl6Wiefupl422gRYxAa_kFCRM2-puUcsQ';
const supabase = createClient(supabaseUrl, supabaseKey);

let db;

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
                showNotification('Game updated in the cloud!', 'info');
            }
        } else {
            const { error: insertError } = await supabase
                .from('CosmicForge_saves')
                .insert([{ pioneer_name: userId, data: gameData, created: currentTimestamp }]);

            if (insertError) {
                throw insertError;
            }

            if (type !== 'initialise') {
                showNotification('Game saved to the cloud!', 'info');
            }
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
                showNotification('Data copied to clipboard!', 'info');
            })
            .catch(err => {
                showNotification('Error copying data! If on Chrome, this could be expected.  Select and copy the text string manually!', 'error');
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
            showNotification('Game loaded successfully!', 'info');
            return true;
        } else {
            showNotification('No saved game data found.', 'warning');
            return false;
        }
    } catch (error) {
        console.error("Error loading game from cloud:", error);
        showNotification('Error loading game data from the cloud.', 'error');
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
                showNotification('Invalid game data string. Please check and try again.', 'warning');
                return reject('Invalid game data string');
            }

            const decompressedJson = LZString.decompressFromEncodedURIComponent(compressed);
            const gameState = JSON.parse(decompressedJson);

            initialiseLoadedGame(gameState, 'textImport')
                .then(() => {
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
        if (saveData.version < 0.26) {
            if (objectType === 'resourceData') {
                saveData.version = 0.26;
                //add a loop if necessary to change structure of all keys
                if (!saveData.space.upgrades.spaceTelescope) {
                    saveData.space.upgrades.spaceTelescope = { 
                        spaceTelescopeBoughtYet: false,
                        price: 10000,
                        resource1Price: [20000, 'steel', 'compounds'],
                        resource2Price: [15000, 'glass', 'compounds'],
                        resource3Price: [20000, 'silicon', 'resources'],
                        energyUseSearchAsteroid: 0.4,
                        energyUseInvestigateStar: 0.7
                    }
                }

                if (!saveData.techs.planetaryNavigation) {
                    saveData.techs.planetaryNavigation = {
                        appearsAt: [27000, "atmosphericTelescopes", "rocketComposites", "quantumComputing"], prereqs: ['Atmospheric Telescopes', 'Rocket Composites', 'Quantum Computing'], price: 29000, idForRenderPosition: 57
                    }
                }

                if (!saveData.antimatter) {
                    saveData.antimatter = {
                        quantity: 0,
                        rate: 0,
                        storageCapacity: 100000
                    }
                }
            } else if (objectType === 'starSystemsData') {
                saveData = {
                    stars: {
                        spica: {
                            starCode: 'SPC',
                            precipitationResourceCategory: 'compounds',
                            precipitationType: 'water',
                            weather: {
                                sunny: [30, '☀', 1, 'white'],
                                cloudy: [47, '☁', 0.6, 'orange'],
                                rain: [20, '☂', 0.4, 'orange'],
                                volcano: [3, '⛰', 0.05, 'red']
                            }
                        }
                    }
                };
            } else if (objectType === 'rocketNames') {
            }
        }

        if (saveData.version < 0.28) {
            if (objectType === 'resourceData') {
                saveData.space.upgrades.spaceTelescope = { 
                    price: 10000,
                    resource1Price: [20000, 'steel', 'compounds'],
                    resource2Price: [15000, 'glass', 'compounds'],
                    resource3Price: [20000, 'silicon', 'resources'],
                    energyUseSearchAsteroid: 0.4,
                    energyUseInvestigateStar: 0.7
                }
            } else if (objectType === 'starSystemsData') {
                saveData = {
                    stars: {
                        spica: {
                            mapSize: 5.504440179536064,
                            startingStar: true,
                            starCode: 'SPC',
                            precipitationResourceCategory: 'compounds',
                            precipitationType: 'water',
                            weather: {
                                sunny: [30, '☀', 1, 'green-ready-text'],
                                cloudy: [47, '☁', 0.6, 'warning-orange-text'],
                                rain: [20, '☂', 0.4, 'warning-orange-text'],
                                volcano: [3, '⛰', 0.05, 'red-disabled-text']
                            }
                        }
                    }
                };
            } else if (objectType === 'rocketNames') {
            }
        }

        if (saveData.version < 0.29) {
            if (objectType === 'resourceData') {
                saveData.ascendencyPoints = { 
                    quantity: 0,
                }
            } else if (objectType === 'starSystemsData') {

            } else if (objectType === 'rocketNames') {
                saveData.rocketDescription = 'Build the launch pad to launch built rockets and mine asteroids for Antimatter.'
            }
        }

        if (saveData.version < 0.50) {
            if (objectType === 'resourceData') {
                saveData.fleets = {
                    attackPower: 0,
                    defensePower: 0
                }

                saveData.space = saveData.space || {};

                Object.assign(saveData.space, {
                    upgrades: {
                        spaceTelescope: Object.assign(saveData.space.upgrades?.spaceTelescope || {}, {
                            price: 10000,
                            resource1Price: [20000, 'iron', 'resources'],
                            resource2Price: [15000, 'glass', 'compounds'],
                            resource3Price: [20000, 'silicon', 'resources'],
                            energyUseSearchAsteroid: 0.4,
                            energyUseInvestigateStar: 0.7,
                        }),
                        launchPad: Object.assign(saveData.space.upgrades?.launchPad || {}, {
                            price: 40000,
                            resource1Price: [10000, 'iron', 'resources'],
                            resource2Price: [1000, 'titanium', 'compounds'],
                            resource3Price: [20000, 'concrete', 'compounds'],
                        }),
                        rocket1: Object.assign(saveData.space.upgrades?.rocket1 || {}, {
                            parts: 15,
                            price: 1000,
                            resource1Price: [1000, 'glass', 'compounds'],
                            resource2Price: [1000, 'titanium', 'compounds'],
                            resource3Price: [3000, 'steel', 'compounds'],
                            setPrice: 'rocket1Price',
                            fuelQuantityToLaunch: 10000,
                            autoBuyer: Object.assign(saveData.space.upgrades?.rocket1?.autoBuyer || {}, {
                                currentTierLevel: 1,
                                normalProgression: false,
                                tier1: { 
                                    nameUpgrade: 'Fuel', 
                                    screen: 'rocket1', 
                                    place: 'rocket1Autobuyer1Row', 
                                    price: 5000, 
                                    rate: 0.02, 
                                    quantity: 0, 
                                    setPrice: 'rocket1AB1Price', 
                                    energyUse: 0.7 
                                },
                            }),
                        }),
                        rocket2: Object.assign(saveData.space.upgrades?.rocket2 || {}, {
                            parts: 20,
                            price: 1000,
                            resource1Price: [1000, 'glass', 'compounds'],
                            resource2Price: [1000, 'titanium', 'compounds'],
                            resource3Price: [3000, 'steel', 'compounds'],
                            setPrice: 'rocket2Price',
                            fuelQuantityToLaunch: 12000,
                            autoBuyer: Object.assign(saveData.space.upgrades?.rocket2?.autoBuyer || {}, {
                                currentTierLevel: 1,
                                normalProgression: false,
                                tier1: { 
                                    nameUpgrade: 'Fuel', 
                                    screen: 'rocket2', 
                                    place: 'rocket2Autobuyer1Row', 
                                    price: 6000, 
                                    rate: 0.02, 
                                    quantity: 0, 
                                    setPrice: 'rocket2AB1Price', 
                                    energyUse: 0.8 
                                },
                            }),
                        }),
                        rocket3: Object.assign(saveData.space.upgrades?.rocket3 || {}, {
                            parts: 25,
                            price: 1000,
                            resource1Price: [1000, 'glass', 'compounds'],
                            resource2Price: [1000, 'titanium', 'compounds'],
                            resource3Price: [3000, 'steel', 'compounds'],
                            setPrice: 'rocket3Price',
                            fuelQuantityToLaunch: 14000,
                            autoBuyer: Object.assign(saveData.space.upgrades?.rocket3?.autoBuyer || {}, {
                                currentTierLevel: 1,
                                normalProgression: false,
                                tier1: { 
                                    nameUpgrade: 'Fuel', 
                                    screen: 'rocket3', 
                                    place: 'rocket3Autobuyer1Row', 
                                    price: 7000, 
                                    rate: 0.02, 
                                    quantity: 0, 
                                    setPrice: 'rocket3AB1Price', 
                                    energyUse: 0.9 
                                },
                            }),
                        }),
                        rocket4: Object.assign(saveData.space.upgrades?.rocket4 || {}, {
                            parts: 30,
                            price: 1000,
                            resource1Price: [1000, 'glass', 'compounds'],
                            resource2Price: [1000, 'titanium', 'compounds'],
                            resource3Price: [3000, 'steel', 'compounds'],
                            setPrice: 'rocket4Price',
                            fuelQuantityToLaunch: 16000,
                            autoBuyer: Object.assign(saveData.space.upgrades?.rocket4?.autoBuyer || {}, {
                                currentTierLevel: 1,
                                normalProgression: false,
                                tier1: { 
                                    nameUpgrade: 'Fuel', 
                                    screen: 'rocket4', 
                                    place: 'rocket4Autobuyer1Row', 
                                    price: 8000, 
                                    rate: 0.02, 
                                    quantity: 0, 
                                    setPrice: 'rocket4AB1Price', 
                                    energyUse: 1.0 
                                },
                            }),
                        }),
                    }
                });

                Object.assign(saveData.space.upgrades, {
                    ssStructural: {
                        finished: false,
                        builtParts: 0,
                        parts: 20,
                        price: 6000,
                        resource1Price: [8000, 'steel', 'compounds'],
                        resource2Price: [3000, 'titanium', 'compounds'],
                        resource3Price: [9000, 'silicon', 'resources'],
                        setPrice: 'ssStructuralPrice',
                    },
                    ssLifeSupport: {
                        finished: false,
                        builtParts: 0,
                        parts: 10,
                        price: 15000,
                        resource1Price: [10000, 'glass', 'compounds'],
                        resource2Price: [100000, 'oxygen', 'resources'],
                        resource3Price: [30000, 'water', 'compounds'],
                        setPrice: 'ssLifeSupportPrice',
                    },
                    ssAntimatterEngine: {
                        finished: false,
                        builtParts: 0,
                        parts: 16,
                        price: 12000,
                        resource1Price: [7000, 'steel', 'compounds'],
                        resource2Price: [4000, 'titanium', 'compounds'],
                        resource3Price: [20000, 'neon', 'resources'],
                        setPrice: 'ssAntimatterEnginePrice',
                    },
                    ssFleetHangar: {
                        finished: false,
                        builtParts: 0,
                        parts: 1,
                        price: 100000,
                        resource1Price: [80000, 'glass', 'compounds'],
                        resource2Price: [40000, 'titanium', 'compounds'],
                        resource3Price: [150000, 'steel', 'compounds'],
                        setPrice: 'ssFleetHangarPrice'
                    },
                    ssStellarScanner: {
                        finished: false,
                        builtParts: 0,
                        parts: 8,
                        price: 5000,
                        resource1Price: [3000, 'glass', 'compounds'],
                        resource2Price: [4000, 'silicon', 'resources'],
                        resource3Price: [6000, 'neon', 'resources'],
                        setPrice: 'ssStellarScannerPrice'
                    },
                    fleetEnvoy: {
                        envoyBuiltYet: false,
                        maxCanBuild: 1,
                        quantity: 0,
                        price: 2000,
                        resource1Price: [8000, 'hydrogen', 'resources'],
                        resource2Price: [300, 'silicon', 'resources'],
                        resource3Price: [120, 'titanium', 'compounds'],
                        setPrice: 'fleetEnvoyPrice',
                        bonusPercentage: null,
                        baseAttackStrength: 0,
                        bonusAgainstType: null,
                        bonusAgainstTrait: null,
                        defenseStrength: 0,
                        joinsAttackDefense: false
                    },
                    fleetScout: {
                        maxCanBuild: 100000,
                        quantity: 0,
                        price: 5000,
                        resource1Price: [14000, 'hydrogen', 'resources'],
                        resource2Price: [1000, 'silicon', 'resources'],
                        resource3Price: [300, 'titanium', 'compounds'],
                        setPrice: 'fleetScoutPrice',
                        bonusPercentage: 10,
                        baseAttackStrength: 2,
                        bonusGivenAgainstType: 'air',
                        bonusRemovedBy: 'Aerialians',
                        defenseStrength: 2,
                        joinsAttackDefense: true,
                        speed: 5
                    },
                    fleetMarauder: {
                        maxCanBuild: 100000,
                        quantity: 0,
                        price: 7500,
                        resource1Price: [14000, 'helium', 'resources'],
                        resource2Price: [2000, 'silicon', 'resources'],
                        resource3Price: [600, 'titanium', 'compounds'],
                        setPrice: 'fleetMarauderPrice',
                        bonusPercentage: 15,
                        baseAttackStrength: 4,
                        bonusGivenAgainstType: 'air',
                        bonusRemovedBy: 'Aerialians',
                        defenseStrength: 3,
                        joinsAttackDefense: true,
                        speed: 4
                    },
                    fleetLandStalker: {
                        maxCanBuild: 100000,
                        quantity: 0,
                        price: 9000,
                        resource1Price: [22000, 'helium', 'resources'],
                        resource2Price: [3000, 'silicon', 'resources'],
                        resource3Price: [900, 'titanium', 'compounds'],
                        setPrice: 'fleetLandStalkerPrice',
                        bonusPercentage: 20,
                        baseAttackStrength: 4,
                        bonusGivenAgainstType: 'land',
                        bonusRemovedBy: 'Terrans',
                        defenseStrength: 0,
                        joinsAttackDefense: true,
                        speed: 2
                    },
                    fleetNavalStrafer: {
                        maxCanBuild: 100000,
                        quantity: 0,
                        price: 8000,
                        resource1Price: [26000, 'hydrogen', 'resources'],
                        resource2Price: [4000, 'silicon', 'resources'],
                        resource3Price: [1200, 'titanium', 'compounds'],
                        setPrice: 'fleetNavalStraferPrice',
                        bonusPercentage: 15,
                        baseAttackStrength: 6,
                        bonusGivenAgainstType: 'sea',
                        bonusRemovedBy: 'Aquatic',
                        defenseStrength: 0,
                        joinsAttackDefense: true,
                        speed: 1
                    }
                });

                if (!saveData.techs.orbitalConstruction) { saveData.techs.orbitalConstruction = { appearsAt: [45000, "planetaryNavigation", "rocketComposites", ""], prereqs: ['Planetary Navigation', 'Rocket Composites'], price: 50000, idForRenderPosition: 9100 } }
                if (!saveData.techs.antimatterEngines) { saveData.techs.antimatterEngines = { appearsAt: [65000, "orbitalConstruction", "neutronCapture", "FTLTravelTheory"], prereqs: ['Orbital Construction', 'Neutron Capture', 'FTL Travel Theory'], price: 78000, idForRenderPosition: 9101 } }
                if (!saveData.techs.FTLTravelTheory) { saveData.techs.FTLTravelTheory = { appearsAt: [60000, "neutronCapture", "planetaryNavigation", "advancedFuels"], prereqs: ['Neutron Capture', 'Planetary Navigation', 'Advanced Fuels'], price: 65000, idForRenderPosition: 9102 } }
                if (!saveData.techs.lifeSupportSystems) { saveData.techs.lifeSupportSystems = { appearsAt: [55000, "orbitalConstruction", "nanoTubeTechnology", "quantumComputing"], prereqs: ['Orbital Construction', 'Nano Tube Technology', 'Quantum Computing'], price: 60000, idForRenderPosition: 9103 } }
                if (!saveData.techs.starshipFleets) { saveData.techs.starshipFleets = { appearsAt: [80000, "FTLTravelTheory", "antimatterEngines", "orbitalConstruction"], prereqs: ['FTL Travel Theory', 'Antimatter Engines', 'Orbital Construction'], price: 100000, idForRenderPosition: 9104 } }
                if (!saveData.techs.stellarScanners) { saveData.techs.stellarScanners = { appearsAt: [70000, "FTLTravelTheory", "orbitalConstruction"], prereqs: ['FTL Travel Theory', 'Orbital Construction'], price: 72000, idForRenderPosition: 9105 } }
            } else if (objectType === 'starSystemsData') {

            } else if (objectType === 'rocketNames') {

            }
        }

        if (saveData.version < 0.52) {
            if (objectType === 'resourceData') {

            } else if (objectType === 'starSystemsData') {

            } else if (objectType === 'rocketNames') {
            
            } else if (objectType === 'galacticMarketData') {
                saveData = {
                    version: 0.52,
                    resources: {
                        hydrogen: { 
                            name: "Hydrogen", 
                            baseValue: 0.02, 
                            marketBias: 0,
                            tradeVolume: 100000,
                            eventModifier: 0 
                        },
                        helium: { 
                            name: "Helium", 
                            baseValue: 0.01, 
                            marketBias: 0, 
                            tradeVolume: 100000,
                            eventModifier: 0 
                        },
                        carbon: { 
                            name: "Carbon", 
                            baseValue: 0.1, 
                            marketBias: 0,
                            tradeVolume: 100000,
                            eventModifier: 0 
                        },
                        neon: { 
                            name: "Neon", 
                            baseValue: 0.06, 
                            marketBias: 0, 
                            tradeVolume: 100000,
                            eventModifier: 0 
                        },
                        oxygen: { 
                            name: "Oxygen", 
                            baseValue: 0.05, 
                            marketBias: 0, 
                            tradeVolume: 100000,
                            eventModifier: 0 
                        },
                        silicon: { 
                            name: "Silicon", 
                            baseValue: 0.08, 
                            marketBias: 0, 
                            tradeVolume: 100000,
                            eventModifier: 0 
                        },
                        iron: { 
                            name: "Iron", 
                            baseValue: 0.12, 
                            marketBias: 0, 
                            tradeVolume: 100000,
                            eventModifier: 0 
                        },
                        sodium: { 
                            name: "Sodium", 
                            baseValue: 0.10, 
                            marketBias: 0, 
                            tradeVolume: 100000,
                            eventModifier: 0 
                        }
                    },
                    compounds: {
                        water: { 
                            name: "Water", 
                            baseValue: 0.08, 
                            marketBias: 0, 
                            tradeVolume: 100000,
                            eventModifier: 0 
                        },
                        diesel: { 
                            name: "Diesel", 
                            baseValue: 0.2, 
                            marketBias: 0, 
                            tradeVolume: 100000,
                            eventModifier: 0 
                        },
                        glass: { 
                            name: "Glass", 
                            baseValue: 0.8, 
                            marketBias: 0, 
                            tradeVolume: 100000,
                            eventModifier: 0 
                        },
                        steel: { 
                            name: "Steel", 
                            baseValue: 1.2, 
                            marketBias: 0, 
                            tradeVolume: 100000,
                            eventModifier: 0 
                        },
                        concrete: { 
                            name: "Concrete", 
                            baseValue: 0.8, 
                            marketBias: 0, 
                            tradeVolume: 100000,
                            eventModifier: 0 
                        },
                        titanium: { 
                            name: "Titanium", 
                            baseValue: 6, 
                            marketBias: 0, 
                            tradeVolume: 100000,
                            eventModifier: 0 
                        }
                    } 
                }
            }
        }

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
    
        saveData.version += 0.01;
    }   

    return saveData;
}
