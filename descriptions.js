import { getTimerRateRatio, getSaveName, getRocketUserName, getDestinationStar } from "./constantsAndGlobalVars.js";
import { getResourceDataObject, getStarSystemDataObject } from "./resourceDataObject.js";
import { capitaliseWordsWithRomanNumerals, capitaliseString } from "./utilityFunctions.js";

export let gameIntroHeader;
export let gameIntroText;
export let gameSaveNameCollect;
export let headerDescriptions;
export let techNotificationMessages;
export let optionDescriptions;
export let newsTickerContent;
export let helpContent;
export let statisticsContent;
export let rocketNames;
export let starNames;
export let launchStarShipWarningHeader;
export let launchStarShipWarningText;
export let enterWarModeModalHeader;
export let enterwarModeModalBackOutText;
export let enterwarModeModalNoBackOutText;
export let enterWarModeInsultedText;
export let enterWarModeSurrenderText;
export let enterWarModeNotVassalizedText;
export let enterWarModeScaredText;
export let enterWarModeModalLaughAtProspect;
export let enterWarModeModalLaughAndEnterWar;
export let enterWarModeModalImproveToReceptive;
export let enterWarModeModalNeutral;
export let enterWarModeModalReserved;
export let enterWarModeModalPatience;
export let modalBattleHeaderText;
export let modalBattleWonText;
export let modalBattleLostText;
export let modalBattleNoSentientLifeHeader;
export let modalBattleNoSentientLifeText;
export let modalRebirthHeader;
export let modalRebirthText;
export let modalGalacticTabUnlockHeader;
export let modalGalacticTabUnlockText;

export function initialiseDescriptions() {
    gameIntroHeader = 'Welcome to the Cosmic Forge!';
    gameSaveNameCollect = `
        Welcome Pioneer! Please enter your code name!<br><br>
        <textarea 
            id="pioneerCodeName"  
            class="save-name save-name-height save-name-modal-width">${getSaveName()}</textarea><br><br>You can load a previous game by changing this name to a previous one.
    `;
    gameIntroText = 'You find yourself with advanced knowledge but on a world with almost no material!<br>Begin by gathering Hydrogen and mastering the art of fusion to create Helium, Carbon, and beyond.<br> Explore new technologies to unlock powerful compounds, and one by one recreate the materials to create<br>a craft to explore and discover the secrets of the interstellar medium!<br><br>With each click, fusion, and discovery, you edge closer to fulfilling your destiny!<br><br>Good Luck!';
    launchStarShipWarningHeader = 'WARNING: POINT OF NO RETURN!';
    launchStarShipWarningText = 'Once your Starship is launched you may not retrieve it this run.<br>So please revise the Star Data section and ensure you really want to select this destination,<br>then please click OK to confirm, or CANCEL to check.';
    enterWarModeModalHeader = `CONQUEST!`;
    enterwarModeModalBackOutText = `You are disengaging diplomacy.<br><br>This means you can no longer engage in diplomacy,<br>and must undertake the conquest when ready to try and conquer the new System.`;
    enterwarModeModalNoBackOutText = `You are now going to start the conquest.<br>Without intelligence you need to prepare your fleet thoroughly, good luck!`;
    enterWarModeInsultedText = `Your attempts have backfired!<br><br>The enemy is insulted by your bad manners and has cut off<br>all diplomatic ties!`;  
    enterWarModeSurrenderText = `The enemy has surrendered!<br><br>They recognize your superior strength and have chosen to yield without a fight.<br>You now have full control over the System, and no battle is necessary.`;  
    enterWarModeNotVassalizedText = `Despite your attempts to vassalize and your good relation,<br>they just prefer being independent, so violence will be the only way to conquer the System!`;
    enterWarModeScaredText = `The enemy is terrified of your power!<br><br>Diplomacy is closed but their fleet strength is halved due to deserters!`;
    enterWarModeModalLaughAtProspect = `The enemy laughs at the prospect of your attempts to manipulate them!<br>Their impression of you has fallen!`;
    enterWarModeModalLaughAndEnterWar = `The enemy laughs at the prospect of your attempts to bully them!<br>They are now going to punish you!<br>War!`;
    enterWarModeModalImproveToReceptive = `The pitter patter was successful, the enemy is now receptive towards you<br>and their impression improved!`;
    enterWarModeModalNeutral = `After chatting the enemy remains neutral towards you.`;
    enterWarModeModalReserved = `The enemy still has a low impression of you and are reserved in their attitude.`;
    enterWarModeModalPatience = `The enemy negotiator is tired of chatter and has retired to consider their position.`;
    modalBattleHeaderText = `OUTCOME OF CONQUEST:`;
    modalBattleWonText = `You have won the battle!<br><br><span class="green-ready-text">Gained X AP!</span>`;
    modalBattleLostText = `You have lost the battle!<br><br>Your fleet has been destroyed, and must be rebuilt to try again to conquer the System!`;
    modalBattleNoSentientLifeHeader = `SETTLE NEW SYSTEM!`;
    modalBattleNoSentientLifeText = `There is no sentient life in this System, so you can settle right away!<br><br><span class="green-ready-text">Gained X AP!</span>`;
    modalRebirthHeader = `WARNING: REBIRTH!`;
    modalRebirthText = `You are about to reset your progress and start again at the new System.<br><br>Are you sure you want to do this?<br><br><span class="green-ready-text">You will carry over X AP!</span>`;
    modalGalacticTabUnlockHeader = `Star System reached!`;
    modalGalacticTabUnlockText = `As you approach the new System, your scanners detect a faint communication signal...<br><br>"You have shown great innovation, you may now access our Galactic Trading Platform"<br><br><span class="green-ready-text">Galactic Tab Unlocked!</span>`;

    headerDescriptions = {
        'Resources': 'Here you can gain and sell resources. You can also upgrade your storage capacity and automate resource harvesting.  When you discover fusion, you will also handle that here.',
        'Compounds': 'Here you can create and sell compounds from constituent parts or with advanced machinery.',
        'Interstellar': 'Here you can explore the galaxy and discover new stars and planets.',
        'Research': 'In the Research section, you can unlock new technologies to progress through the game, and also get upgrades to farm research points.',
        'Energy': 'Here you can buy upgrades for generating power which is needed for more advanced buildings.',
        'Space Mining': 'Here you can build vessels to mine asteroids for valuable Antimatter, enabling you to visit locations in the Star Map, and really start to conquer the galaxy!',
        'Galactic': 'Here you can exchange your AP for permanent buffs, and reset runs.',
        'Settings': 'Change the game settings to your liking.',
        
        'hydrogen': 'The most basic element known to man, very cheap to produce and has a pretty low value, but anything can be created from it.',
        'helium': 'Lighter than air this one will make you float away!',
        'carbon': 'This is the first stable solid element, made from fused Helium.',
        'neon': 'The first noble gas! Very "bright" of you to discover it!',
        'oxygen': 'A vital element for most, oxygen is highly reactive and essential for combustion and respiration.',
        'sodium': 'A soft, silvery metal.',
        'silicon': 'The backbone of modern technology, it is a crucial component in electronics and solar panels.',
        'iron': 'A strong and versatile metal, iron is the foundation of construction and industry.',

        'energy storage': "Any buildings beyond the first level require power to operate, you can store that energy here.",
        'power plant': "These buildings provide the energy resource, and it is used by advanced buildings, without which they won't operate.",
        'advanced power plant': "These buildings provide higher amounts of energy for powering a lot of machinery.",
        'solar power plant': "Solar power plants provide renewable energy without using any resources.",
        'research': "Here you can buy upgrades to generate research points for unlocking new technology.",
        'technology': "Here you can unlock new technologies to improve your game, provided you have enough research points!",
        'tech tree': 'Here you can see a visual representation of technologies and what they provide.',
    
        'diesel': 'The first compound created by your hands, it is a useful early fuel.',
        'glass': 'This is reinforced specialist glass and is great for solar applications.',
        'steel': 'This is reinforced steel, highly durable and used in construction and manufacturing.',
        'water': 'Water is an essential resource which can be produced, or collected from rain in your reservoir.',
        'concrete': 'Concrete is a fundamental building material used in construction, offering strength and versatility.',
        'titanium': 'Titanium is a strong, lightweight, and corrosion-resistant metal, needed for advanced construction.',

        'star map': "This is a map of the known galaxy.",
        'star data': "Here you can find information about studied stars.",
        'star ship': "Here you can build and manage your Star Ship to travel to and scan studied Stars.",
        'fleet hangar': `Build your fleets to conquer visited Systems - Fleet Power: <span class="green-ready-text">${getResourceDataObject('fleets', ['attackPower'])}</span>`,
        'colonise': `Engage in Diplomacy and War to establish your new colony at <span class="green-ready-text">${capitaliseWordsWithRomanNumerals(getDestinationStar())}</span> - Fleet Power: <span class="green-ready-text">${getResourceDataObject('fleets', ['attackPower'])}</span>`,

        'mining': "This shows Antimatter being produced, where, and by which Rocket Miner.",
        'space telescope': "Here you can build a telescope to search for asteroids to mine Antimatter.",
        'asteroids': "Here you can see discovered Asteroids and analyse them.",
        'launch pad': "Build vessels to mine asteroids for valuable Antimatter.",

        'rebirth': "Here you can reset the run at your new system, once settled!",
        'galactic market': "Here you can make various trades in the Galactic Market.",
        'ascendency': "Here you can spend AP for permanent buffs to speed up your runs!",

        'get started': "Learn how to get started in Cosmic Forge.",
        'concepts - early': "Early game concepts.",
        'concepts - mid': "Mid game concepts.",
        'concepts - late': "Late game concepts pre rebirth.",
        'visual': "Change the visual settings of the game.",
        'game options': "Change the game options to your liking.",
        'saving / loading': "Save and Load your progress in the game.",
        'statistics': `Here you can see your progress in the game.`,

    };

    rocketNames = {
        version: 0.58,
        rocketDescription: "Build the launch pad to launch built rockets and mine asteroids for Antimatter.",
        [getRocketUserName('rocket1').toLowerCase()]: "Build the launch pad to launch built rockets and mine asteroids for Antimatter.",
        [getRocketUserName('rocket2').toLowerCase()]: "Build the launch pad to launch built rockets and mine asteroids for Antimatter.",
        [getRocketUserName('rocket3').toLowerCase()]: "Build the launch pad to launch built rockets and mine asteroids for Antimatter.",
        [getRocketUserName('rocket4').toLowerCase()]: "Build the launch pad to launch built rockets and mine asteroids for Antimatter.",
    }

    techNotificationMessages = {
        knowledgeSharing: 'Knowledge Sharing Researched\n\nYou can now open Science Clubs!',
        fusionTheory: 'Fusion Theory Researched\n\nUseful for future experiments!',
        hydrogenFusion: 'Hydrogen Fusion Researched\n\nYou can now fuse Hydrogen!',
        heliumFusion: 'Helium Fusion Researched\n\nYou can now fuse Helium!',
        carbonFusion: 'Carbon Fusion Researched\n\nYou can now fuse Carbon!',
        neonFusion: 'Neon Fusion Researched\n\nYou can now fuse Neon!',
        oxygenFusion: 'Oxygen Fusion Researched\n\nYou can now fuse Oxygen!',
        siliconFusion: 'Silicon Fusion Researched\n\nYou can now fuse Silicon!',
        nobleGasCollection: 'Noble Gas Collection Researched\n\nYou can now store Noble Gases when fused!',
        glassManufacture: 'Glass Manufacture Researched\n\nYou can now produce Glass compounds!',
        aggregateMixing: 'Aggregate Mixing Researched\n\nYou can now produce Concrete compounds!',
        neutronCapture: 'Neutron Capture Researched\n\nThis will now allow us to fuse Titanium, a versatile and durable material essential for advanced construction and technology!',
        quantumComputing: 'Quantum Computing Researched\n\nMore advanced Machinery is now available!',
        scienceLaboratories: 'Science Laboratories Researched\n\nYou can now build Science Labs!',
        hydroCarbons: 'HydroCarbons Researched\n\nYou can gain access to Diesel Fuel once you have Compounds unlocked!',
        nanoTubeTechnology: 'Nano Tube Technology Researched\n\nWith this we can start to learn about how to fuse Carbon in the future!',
        nanoBrokers: 'Nano Brokers Researched\n\nYou can toggle resources to be automatically sold for cash instead of accumulating!',
        stellarCartography: 'Stellar Cartography Researched\n\nYou unlocked Interstellar tab!',
        fusionEfficiencyI: 'Fusion Efficiency I Researched\n\n20% Boost to Fusion returns!',
        fusionEfficiencyII: 'Fusion Efficiency II Researched\n\nFurther 20% Boost to Fusion returns!',
        fusionEfficiencyIII: 'Fusion Efficiency III Researched\n\n100% Fusion returns!',
        atmosphericTelescopes: 'Atmospheric Telescopes Researched\n\nYou can now get data from the local stellar neighborhood!',
        giganticTurbines: 'Gigantic Turbines Researched\n\nThis opens up new research in power generation!',
        steelFoundries: 'Steel Foundries Researched\n\nYou can now create Steel compounds!',
        rocketComposites: 'Rocket Composites Researched\n\nYou can now build Rocket Parts!',
        advancedFuels: 'Advanced Fuels Researched\n\nYou can now fuel Rockets!',
        planetaryNavigation: 'Planetary Navigation Researched\n\nYou can now travel to Asteroids!',
        advancedPowerGeneration: 'Advanced Power Generation Researched\n\nBuild Advanced Power Plants!',
        basicPowerGeneration: 'Basic Power Generation Researched\n\nYou can now build basic Power Stations!',
        solarPowerGeneration: 'Solar Power Generation Researched\n\nYou can now build Solar Panels to generate power!',
        compounds: 'Compounds Researched\n\nUnlocks the Compounds tab!',
        sodiumIonPowerStorage: 'Sodium Ion Power Storage Researched\n\nYou can build batteries to store energy!',
        orbitalConstruction: 'Orbital Construction Researched\n\nYou can now build Starship Modules!',
        antimatterEngines: 'Antimatter Engines Researched\n\nYou can now build Antimatter Engines allowing Interstellar Travel!',
        FTLTravelTheory: 'FTL Travel Theory Researched\n\nYou can now research how to travel faster than light!',
        lifeSupportSystems: 'Life Support Systems Researched\n\nYou can now sustain life in deep space!',
        starshipFleets: 'Starship Fleets Researched\n\nYou can now construct Starship Offensive capabilities!',
        stellarScanners: 'Stellar Scanners Researched\n\nWhen you arrive at a new Star System you can see details of alien life and if it poses a threat!',
    };

    optionDescriptions = {
        hydrogenSellRow: {
            content1: "Here you can sell Hydrogen for cash",
            content2: "Here you can sell Hydrogen for cash or fuse it into Helium",
            updateAt: "hydrogenFusion"
        },
        hydrogenGainRow: {
            content1: "Manually gain one unit of Hydrogen.",
            content2: "",
            updateAt: ""
        },
        hydrogenIncreaseStorageRow: {
            content1: "Upgrade your Hydrogen storage capacity to hold more resources.",
            content2: "",
            updateAt: ""
        },
        heliumSellRow: {
            content1: "Here you can sell Helium for cash",
            content2: "Here you can sell Helium for cash or fuse it into Carbon",
            updateAt: "heliumFusion"
        },
        heliumGainRow: {
            content1: "Manually scrape one unit of Helium.",
            content2: "",
            updateAt: ""
        },
        heliumIncreaseStorageRow: {
            content1: "Increase your Helium storage capacity to store more Helium.",
            content2: "",
            updateAt: ""
        },
        carbonSellRow: {
            content1: "Here you can sell Carbon for cash",
            content2: "Here you can sell Carbon for cash or fuse it into Neon",
            updateAt: "carbonFusion"
        },
        carbonGainRow: {
            content1: "Extract Carbon manually from the environment.",
            content2: "",
            updateAt: ""
        },
        carbonIncreaseStorageRow: {
            content1: "Expand your Carbon storage.",
            content2: "",
            updateAt: ""
        },
        neonSellRow: {
            content1: "Here you can sell Neon for cash",
            content2: "Here you can sell Neon for cash or fuse it into Oxygen",
            updateAt: "neonFusion"
        },
        neonGainRow: {
            content1: "Manually gain one unit of Neon.",
            content2: "",
            updateAt: ""
        },
        neonIncreaseStorageRow: {
            content1: "Upgrade your Neon storage capacity to hold more resources.",
            content2: "",
            updateAt: ""
        },
        oxygenSellRow: {
            content1: "Here you can sell Oxygen for cash.",
            content2: "Here you can sell Oxygen for cash or fuse it into Silicon.",
            updateAt: "oxygenFusion"
        },
        oxygenGainRow: {
            content1: "Manually gain one unit of Oxygen.",
            content2: "",
            updateAt: ""
        },
        oxygenIncreaseStorageRow: {
            content1: "Upgrade your Oxygen storage capacity to hold more resources.",
            content2: "",
            updateAt: ""
        },
        sodiumSellRow: {
            content1: "Here you can sell Sodium for cash.",
            content2: "",
            updateAt: ""
        },
        sodiumGainRow: {
            content1: "Manually gain one unit of Sodium.",
            content2: "",
            updateAt: ""
        },
        sodiumIncreaseStorageRow: {
            content1: "Upgrade your Sodium storage capacity to hold more resources.",
            content2: "",
            updateAt: ""
        },
        siliconSellRow: {
            content1: "Here you can sell Silicon for cash.",
            content2: "Here you can sell Silicon for cash or fuse it into Iron.",
            updateAt: "siliconFusion"
        },
        siliconGainRow: {
            content1: "Manually gain one unit of Silicon.",
            content2: "",
            updateAt: ""
        },
        siliconIncreaseStorageRow: {
            content1: "Upgrade your Silicon storage capacity to hold more resources.",
            content2: "",
            updateAt: ""
        },
        ironSellRow: {
            content1: "Here you can sell Iron for cash.",
            content2: "",
            updateAt: ""
        },
        ironGainRow: {
            content1: "Manually gain one unit of Iron.",
            content2: "",
            updateAt: ""
        },
        ironIncreaseStorageRow: {
            content1: "Upgrade your Iron storage capacity to hold more resources.",
            content2: "",
            updateAt: ""
        },
        dieselCreateRow: {
            content1: "Here you can create Diesel from its constituent parts, provided you have them, and the power is ON.",
            content2: "",
            updateAt: ""
        },
        dieselSellRow: {
            content1: "Here you can sell Diesel for cash.",
            content2: "",
            updateAt: ""
        },
        dieselIncreaseStorageRow: {
            content1: "Upgrade your Diesel storage capacity to hold more resources.",
            content2: "",
            updateAt: ""
        },
        glassCreateRow: {
            content1: "Here you can create Glass from its constituent parts, provided you have them, and the power is ON.",
            content2: "",
            updateAt: ""
        },
        glassSellRow: {
            content1: "Here you can sell Glass for cash.",
            content2: "",
            updateAt: ""
        },
        glassIncreaseStorageRow: {
            content1: "Upgrade your Glass storage capacity to hold more resources.",
            content2: "",
            updateAt: ""
        },
        steelCreateRow: {
            content1: "Here you can create Steel from its constituent parts, provided you have them, and the power is ON.",
            content2: "",
            updateAt: ""
        },
        steelSellRow: {
            content1: "Here you can sell Steel for cash.",
            content2: "",
            updateAt: ""
        },
        steelIncreaseStorageRow: {
            content1: "Upgrade your Steel storage capacity to hold more resources.",
            content2: "",
            updateAt: ""
        },
        waterCreateRow: {
            content1: "Here you can manage the production of Water, provided you have the materials, and the power is ON.",
            content2: "",
            updateAt: ""
        },
        waterSellRow: {
            content1: "Here you can sell Water for cash.",
            content2: "",
            updateAt: ""
        },
        waterIncreaseStorageRow: {
            content1: "Upgrade your Water reservoir capacity to store more water.",
            content2: "",
            updateAt: ""
        },
        concreteCreateRow: {
            content1: "Here you can create Concrete, provided you have the materials, and the power is ON.",
            content2: "",
            updateAt: ""
        },
        concreteSellRow: {
            content1: "Here you can sell Concrete for cash.",
            content2: "",
            updateAt: ""
        },
        concreteIncreaseStorageRow: {
            content1: "Upgrade your Concrete storage capacity to hold more resources.",
            content2: "",
            updateAt: ""
        },
        titaniumCreateRow: {
            content1: "Here you can create Titanium, provided you have the materials, and the power is ON.",
            content2: "",
            updateAt: ""
        },
        titaniumSellRow: {
            content1: "Here you can sell Titanium for cash.",
            content2: "",
            updateAt: ""
        },
        titaniumIncreaseStorageRow: {
            content1: "Upgrade your Titanium storage capacity to hold more resources.",
            content2: "",
            updateAt: ""
        },
        hydrogenAutoBuyer1Row: {
            content1: `Add a Hydrogen Compressor to automate Hydrogen generation.`,
            content2: "",
            updateAt: ""
        },
        hydrogenAutoBuyer2Row: {
            content1: `Add an Advanced Hydrogen Compressor for enhanced automation - Power: ${Math.floor(getResourceDataObject('resources', ['hydrogen', 'upgrades', 'autoBuyer', 'tier2', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        hydrogenAutoBuyer3Row: {
            content1: `Install a Hydrogen Refinery to maximize efficiency in Hydrogen generation - Power: ${Math.floor(getResourceDataObject('resources', ['hydrogen', 'upgrades', 'autoBuyer', 'tier3', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        hydrogenAutoBuyer4Row: {
            content1: `Add a Quantum Hydrogen Synthesizer for cutting-edge Hydrogen production - Power: ${Math.floor(getResourceDataObject('resources', ['hydrogen', 'upgrades', 'autoBuyer', 'tier4', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        heliumAutoBuyer1Row: {
            content1: `Helium seems lighter than air - add an Atmosphere Scraper to automate Helium collection.`,
            content2: "",
            updateAt: ""
        },
        heliumAutoBuyer2Row: {
            content1: `Add an Advanced Helium Scraper for enhanced Helium collection - Power: ${Math.floor(getResourceDataObject('resources', ['helium', 'upgrades', 'autoBuyer', 'tier2', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        heliumAutoBuyer3Row: {
            content1: `Install a Helium Refinery to improve automation of Helium generation - Power: ${Math.floor(getResourceDataObject('resources', ['helium', 'upgrades', 'autoBuyer', 'tier3', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        heliumAutoBuyer4Row: {
            content1: `Add a Quantum Helium Synthesizer for cutting-edge Helium production - Power: ${Math.floor(getResourceDataObject('resources', ['helium', 'upgrades', 'autoBuyer', 'tier4', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        carbonAutoBuyer1Row: {
            content1: `Buy a miner to automate the collection of Carbon.`,
            content2: "",
            updateAt: ""
        },
        carbonAutoBuyer2Row: {
            content1: `Install an Advanced Carbon Miner for improved Carbon extraction - Power: ${Math.floor(getResourceDataObject('resources', ['carbon', 'upgrades', 'autoBuyer', 'tier2', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        carbonAutoBuyer3Row: {
            content1: `Add a Carbon Refinery to maximize automated Carbon collection - Power: ${Math.floor(getResourceDataObject('resources', ['carbon', 'upgrades', 'autoBuyer', 'tier3', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        carbonAutoBuyer4Row: {
            content1: `Add a Quantum Carbon Synthesizer for cutting-edge Carbon generation - Power: ${Math.floor(getResourceDataObject('resources', ['carbon', 'upgrades', 'autoBuyer', 'tier4', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        neonAutoBuyer1Row: {
            content1: `Add an Neon Extractor to automate Neon generation.`,
            content2: "",
            updateAt: ""
        },
        neonAutoBuyer2Row: {
            content1: `Add an Advanced Neon Extractor to improve automation of Neon collection - Power: ${Math.floor(getResourceDataObject('resources', ['neon', 'upgrades', 'autoBuyer', 'tier2', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        neonAutoBuyer3Row: {
            content1: `Install a Neon Refinery to enhance Neon collection - Power: ${Math.floor(getResourceDataObject('resources', ['neon', 'upgrades', 'autoBuyer', 'tier3', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        neonAutoBuyer4Row: {
            content1: `Add a Quantum Neon Synthesizer for cutting-edge Neon production - Power: ${Math.floor(getResourceDataObject('resources', ['neon', 'upgrades', 'autoBuyer', 'tier4', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        oxygenAutoBuyer1Row: {
            content1: `Add an Oxygen Extractor to automate Oxygen generation.`,
            content2: "",
            updateAt: ""
        },
        oxygenAutoBuyer2Row: {
            content1: `Install an Advanced Oxygen Extractor for improved Oxygen generation - Power: ${Math.floor(getResourceDataObject('resources', ['oxygen', 'upgrades', 'autoBuyer', 'tier2', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        oxygenAutoBuyer3Row: {
            content1: `Add an Oxygen Refinery to maximize automation of Oxygen production - Power: ${Math.floor(getResourceDataObject('resources', ['oxygen', 'upgrades', 'autoBuyer', 'tier3', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        oxygenAutoBuyer4Row: {
            content1: `Add a Quantum Oxygen Synthesizer for advanced Oxygen generation - Power: ${Math.floor(getResourceDataObject('resources', ['oxygen', 'upgrades', 'autoBuyer', 'tier4', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        sodiumAutoBuyer1Row: {
            content1: `Add a Sodium Extractor to automate Sodium generation.`,
            content2: "",
            updateAt: ""
        },
        sodiumAutoBuyer2Row: {
            content1: `Add an Advanced Sodium Extractor for better Sodium automation - Power: ${Math.floor(getResourceDataObject('resources', ['sodium', 'upgrades', 'autoBuyer', 'tier2', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        sodiumAutoBuyer3Row: {
            content1: `Install a Sodium Refinery to boost Sodium production - Power: ${Math.floor(getResourceDataObject('resources', ['sodium', 'upgrades', 'autoBuyer', 'tier3', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        sodiumAutoBuyer4Row: {
            content1: `Add a Quantum Sodium Synthesizer for advanced Sodium generation - Power: ${Math.floor(getResourceDataObject('resources', ['sodium', 'upgrades', 'autoBuyer', 'tier4', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        siliconAutoBuyer1Row: {
            content1: `Add a Silicon Extractor to automate Silicon generation.`,
            content2: "",
            updateAt: ""
        },
        siliconAutoBuyer2Row: {
            content1: `Add an Advanced Silicon Extractor for improved Silicon collection - Power: ${Math.floor(getResourceDataObject('resources', ['silicon', 'upgrades', 'autoBuyer', 'tier2', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        siliconAutoBuyer3Row: {
            content1: `Install a Silicon Refinery to maximize Silicon automation - Power: ${Math.floor(getResourceDataObject('resources', ['silicon', 'upgrades', 'autoBuyer', 'tier3', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        siliconAutoBuyer4Row: {
            content1: `Add a Quantum Silicon Synthesizer for cutting-edge Silicon production - Power: ${Math.floor(getResourceDataObject('resources', ['silicon', 'upgrades', 'autoBuyer', 'tier4', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        ironAutoBuyer1Row: {
            content1: `Add an Iron Extractor to automate Iron generation.`,
            content2: "",
            updateAt: ""
        },
        ironAutoBuyer2Row: {
            content1: `Add an Advanced Iron Extractor for enhanced Iron collection - Power: ${Math.floor(getResourceDataObject('resources', ['iron', 'upgrades', 'autoBuyer', 'tier2', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        ironAutoBuyer3Row: {
            content1: `Install an Iron Refinery to maximize Iron production automation - Power: ${Math.floor(getResourceDataObject('resources', ['iron', 'upgrades', 'autoBuyer', 'tier3', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        ironAutoBuyer4Row: {
            content1: `Add a Quantum Iron Synthesizer for advanced Iron generation - Power: ${Math.floor(getResourceDataObject('resources', ['iron', 'upgrades', 'autoBuyer', 'tier4', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        dieselAutoBuyer1Row: {
            content1: `Add an Extractor to collect oil and make Diesel.`,
            content2: "",
            updateAt: ""
        },
        dieselAutoBuyer2Row: {
            content1: `Add an Advanced Diesel Refinery for enhanced Diesel production - Power: ${Math.floor(getResourceDataObject('compounds', ['diesel', 'upgrades', 'autoBuyer', 'tier2', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        dieselAutoBuyer3Row: {
            content1: `Install a Diesel Synthesizer for improved Diesel automation - Power: ${Math.floor(getResourceDataObject('compounds', ['diesel', 'upgrades', 'autoBuyer', 'tier3', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        dieselAutoBuyer4Row: {
            content1: `Add a Quantum Diesel Synthesizer for cutting-edge Diesel generation - Power: ${Math.floor(getResourceDataObject('compounds', ['diesel', 'upgrades', 'autoBuyer', 'tier4', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        glassAutoBuyer1Row: {
            content1: `Add a Workshop Glass Fabricator to create glass.`,
            content2: "",
            updateAt: ""
        },
        glassAutoBuyer2Row: {
            content1: `Install an Advanced Glass Fabricator for better Glass production - Power: ${Math.floor(getResourceDataObject('compounds', ['glass', 'upgrades', 'autoBuyer', 'tier2', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        glassAutoBuyer3Row: {
            content1: `Add a Glass Refinery to enhance Glass automation - Power: ${Math.floor(getResourceDataObject('compounds', ['glass', 'upgrades', 'autoBuyer', 'tier3', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        glassAutoBuyer4Row: {
            content1: `Add a Quantum Glass Synthesizer for cutting-edge Glass production - Power: ${Math.floor(getResourceDataObject('compounds', ['glass', 'upgrades', 'autoBuyer', 'tier4', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        steelAutoBuyer1Row: {
            content1: `Add a Back Yard Steel Foundry to create steel.`,
            content2: "",
            updateAt: ""
        },
        steelAutoBuyer2Row: {
            content1: `Add an Advanced Steel Foundry for enhanced Steel production - Power: ${Math.floor(getResourceDataObject('compounds', ['steel', 'upgrades', 'autoBuyer', 'tier2', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        steelAutoBuyer3Row: {
            content1: `Install a Steel Refinery to improve Steel automation - Power: ${Math.floor(getResourceDataObject('compounds', ['steel', 'upgrades', 'autoBuyer', 'tier3', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        steelAutoBuyer4Row: {
            content1: `Add a Quantum Steel Synthesizer for advanced Steel generation - Power: ${Math.floor(getResourceDataObject('compounds', ['steel', 'upgrades', 'autoBuyer', 'tier4', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        waterAutoBuyer1Row: {
            content1: `Add a Water Mixer to facilitate water processing.`,
            content2: "",
            updateAt: ""
        },
        waterAutoBuyer2Row: {
            content1: `Add an Advanced Water Mixer for better Water production - Power: ${Math.floor(getResourceDataObject('compounds', ['water', 'upgrades', 'autoBuyer', 'tier2', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        waterAutoBuyer3Row: {
            content1: `Install a Water Refinery to maximize Water automation - Power: ${Math.floor(getResourceDataObject('compounds', ['water', 'upgrades', 'autoBuyer', 'tier3', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        waterAutoBuyer4Row: {
            content1: `Add a Quantum Water Synthesizer for advanced Water generation - Power: ${Math.floor(getResourceDataObject('compounds', ['water', 'upgrades', 'autoBuyer', 'tier4', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        concreteAutoBuyer1Row: {
            content1: `Add a Concrete Mixer to automate Concrete production.`,
            content2: "",
            updateAt: ""
        },
        concreteAutoBuyer2Row: {
            content1: `Install an Advanced Concrete Mixer for enhanced Concrete production - Power: ${Math.floor(getResourceDataObject('compounds', ['concrete', 'upgrades', 'autoBuyer', 'tier2', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        concreteAutoBuyer3Row: {
            content1: `Add a Concrete Refinery to maximize Concrete automation - Power: ${Math.floor(getResourceDataObject('compounds', ['concrete', 'upgrades', 'autoBuyer', 'tier3', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        concreteAutoBuyer4Row: {
            content1: `Add a Quantum Concrete Synthesizer for cutting-edge Concrete production - Power: ${Math.floor(getResourceDataObject('compounds', ['concrete', 'upgrades', 'autoBuyer', 'tier4', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        titaniumAutoBuyer1Row: {
            content1: `Add a Titanium Mixer to automate Titanium production.`,
            content2: "",
            updateAt: ""
        },
        titaniumAutoBuyer2Row: {
            content1: `Install an Advanced Titanium Mixer for enhanced Titanium production - Power: ${Math.floor(getResourceDataObject('compounds', ['titanium', 'upgrades', 'autoBuyer', 'tier2', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        titaniumAutoBuyer3Row: {
            content1: `Add a Titanium Refinery to maximize Titanium automation - Power: ${Math.floor(getResourceDataObject('compounds', ['titanium', 'upgrades', 'autoBuyer', 'tier3', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        titaniumAutoBuyer4Row: {
            content1: `Add a Quantum Titanium Synthesizer for cutting-edge Titanium production - Power: ${Math.floor(getResourceDataObject('compounds', ['titanium', 'upgrades', 'autoBuyer', 'tier4', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },             
        researchScienceKitRow: {
            content1: "Purchase a Science Kit to start generating Research points.",
            content2: "",
            updateAt: ""
        },
        researchScienceClubRow: {
            content1: "Open a Science Club to produce Research points more effectively.",
            content2: "",
            updateAt: ""
        },
        researchScienceLabRow: {
            content1: `Build a Science Lab to do large amounts of Research - Power: ${Math.floor(getResourceDataObject('research', ['upgrades', 'scienceLab', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        techKnowledgeSharingRow: {
            content1: "Unlock Knowledge Sharing to advance research capabilities.",
            content2: "Unlock Knowledge Sharing to improve research capacity and make new technologies accessible.<br><br><span class='green-ready-text'>Build Science Club</span>",
            updateAt: ""
        },
        techFusionTheoryRow: {
            content1: "Unlock Fusion Theory to pave the way for advanced fusion technologies.",
            content2: "Unlock Fusion Theory to unlock the potential of advanced fusion technologies for greater energy production.<br><br><span class='green-ready-text'>Prerequisite for Fusion technologies</span>",
            updateAt: ""
        },
        techHydrogenFusionRow: {
            content1: "Unlock Hydrogen Fusion to experiment with fusing Hydrogen atoms.",
            content2: "Unlock Hydrogen Fusion to explore the potential of fusing Hydrogen atoms for sustainable energy.<br><br><span class='green-ready-text'>Unlock Helium resource</span>",
            updateAt: ""
        },
        techStellarCartographyRow: {
            content1: "Unlock Stellar Cartography to map the stars.",
            content2: "Unlock Stellar Cartography to map distant stars and unlock new astronomical research capabilities.<br><br><span class='green-ready-text'>Unlock Star Map</span>",
            updateAt: ""
        },
        techNanoBrokersRow: {
            content1: "Unlock Nano Brokers to automatically sell Resources and Compounds!",
            content2: "Unlock Nano Brokers to automatically sell Resources and Compounds!<br><br><span class='green-ready-text'>Unlock Auto Sellers on all Resources and Compounds</span>",
            updateAt: ""
        },
        techQuantumComputingRow: {
            content1: "Unlock Quantum Computing to enhance computational power and enable more advanced machinery.",
            content2: "Unlock Quantum Computing to drive technological advancements through enhanced computational capabilities.<br><br><span class='green-ready-text'>Unlock Tier 2 AutoBuyers</span>",
            updateAt: ""
        },
        techHeliumFusionRow: {
            content1: "Unlock Helium Fusion to enable the fusion of Helium atoms.",
            content2: "Unlock Helium Fusion to develop methods for fusing Helium and generate more energy.<br><br><span class='green-ready-text'>Unlock Carbon resource</span>",
            updateAt: ""
        },
        techHydroCarbonsRow: {
            content1: "Unlock HydroCarbons to produce early fuel for power generation.",
            content2: "Unlock HydroCarbons to start generating energy by using early forms of fuel.<br><br><span class='green-ready-text'>Create Diesel (with Compounds Tab)</span>",
            updateAt: ""
        },
        techNanoTubeTechnologyRow: {
            content1: "Unlock NanoTube Technology to learn the first step about the fusion of Carbon.",
            content2: "Unlock NanoTube Technology to advance material science, focusing on carbon-based nanotubes.<br><br><span class='green-ready-text'>Prerequisite for Carbon technologies</span>",
            updateAt: ""
        },
        techCarbonFusionRow: {
            content1: "Unlock Carbon Fusion to finalize knowledge about the fusion of Carbon atoms.",
            content2: "Unlock Carbon Fusion to explore and harness the power of Carbon atom fusion for more efficient energy.<br><br><span class='green-ready-text'>Unlock Sodium and Neon resources</span>",
            updateAt: ""
        },
        techNeonFusionRow: {
            content1: "Unlock Neon Fusion to explore and harness fusion reactions of Neon.",
            content2: "Unlock Neon Fusion to investigate and utilize the fusion of Neon atoms for advanced energy solutions.<br><br><span class='green-ready-text'>Unlock Oxygen resource</span>",
            updateAt: ""
        },
        techOxygenFusionRow: {
            content1: "Unlock Oxygen Fusion to experiment with fusing Oxygen atoms.",
            content2: "Unlock Oxygen Fusion to explore the process of Oxygen atom fusion and boost energy efficiency.<br><br><span class='green-ready-text'>Unlock Silicon resource</span>",
            updateAt: ""
        },
        techSiliconFusionRow: {
            content1: "Unlock Silicon Fusion to experiment fusing Silicon.",
            content2: "Unlock Silicon Fusion to examine the fusion process of Silicon atoms for advanced applications.<br><br><span class='green-ready-text'>Unlock Iron resource</span>",
            updateAt: ""
        },
        techNeutronCaptureRow: {
            content1: "Unlock Neutron Capture to collect fusion by-products.",
            content2: "Unlock Neutron Capture to gather and study by-products from fusion reactions for advanced technologies.<br><br><span class='green-ready-text'>Unlock Titanium resource</span>",
            updateAt: ""
        },
        techGlassManufactureRow: {
            content1: "Unlock Glass Manufacture to produce advanced Glass compounds from Silicon and Oxygen.",
            content2: "Unlock Glass Manufacture to produce advanced glass compounds from Silicon and Oxygen for various industrial uses.<br><br><span class='green-ready-text'>Create Glass compound</span>",
            updateAt: ""
        },
        techAggregateMixingRow: {
            content1: "Unlock Aggregate Mixing to produce concrete compounds from Silicon, Sodium and Hydrogen.",
            content2: "Unlock Aggregate Mixing to produce concrete and construction materials using Silicon, Sodium, and Hydrogen.<br><br><span class='green-ready-text'>Create Concrete compound</span>",
            updateAt: ""
        },        
        techNobleGasCollectionRow: {
            content1: "Unlock Noble Gas Collection to store rare noble gases.",
            content2: "Unlock Noble Gas Collection to store and manage rare noble gases, essential for high-end applications.<br><br><span class='green-ready-text'>Prerequisite for Neon Fusion (with Carbon Fusion)</span>",
            updateAt: ""
        },
        techFusionEfficiencyIRow: {
            content1: "Unlock Fusion Efficiency I to enhance fusion efficiency.",
            content2: "Unlock Fusion Efficiency I to improve the performance and energy output of fusion reactions.<br><br><span class='green-ready-text'>Fusion Efficiency +20%</span>",
            updateAt: ""
        },
        techFusionEfficiencyIIRow: {
            content1: "Unlock Fusion Efficiency II to further enhance fusion efficiency.",
            content2: "Unlock Fusion Efficiency II to maximize fusion efficiency, leading to higher energy yields and lower waste.<br><br><span class='green-ready-text'>Fusion Efficiency +20%</span>",
            updateAt: ""
        },
        techFusionEfficiencyIIIRow: {
            content1: "Unlock Fusion Efficiency III to realise 100% efficient fusion.",
            content2: "Unlock Fusion Efficiency III to achieve fully optimized, 100% efficient fusion energy generation.<br><br><span class='green-ready-text'>100% Fusion Efficiency</span>",
            updateAt: ""
        },
        techAtmosphericTelescopesRow: {
            content1: "Unlock Atmospheric Telescopes to get data about the surrounding stellar neighborhood.",
            content2: "Unlock Atmospheric Telescopes to gather data and insights about nearby stars and cosmic bodies.<br><br><span class='green-ready-text'>Reveal Star Data</span>",
            updateAt: ""
        },
        techGiganticTurbinesRow: {
            content1: "Unlock Gigantic Turbines to allow the building of advanced power generators.",
            content2: "Unlock Gigantic Turbines to build massive, high-efficiency turbines for advanced power generation.<br><br><span class='green-ready-text'>Prerequisite for Advanced Power Plant</span>",
            updateAt: ""
        },
        techSteelFoundriesRow: {
            content1: "Unlock Steel Foundries to produce high strength steel alloys from Iron.",
            content2: "Unlock Steel Foundries to produce high-strength steel alloys from iron, enabling advanced manufacturing and construction.<br><br><span class='green-ready-text'>Unlock Steel compound</span>",
            updateAt: ""
        },
        techCompoundsRow: {
            content1: "Unlock Compounds to expand the materials you have access to.",
            content2: "Unlock Compounds to gain access to new materials and enhance your manufacturing capabilities.<br><br><span class='green-ready-text'>Unlock Compounds Tab</span>",
            updateAt: ""
        },
        techRocketCompositesRow: {
            content1: "Unlock Rocket Composites to build rocket components and unlock the Launch Pad tab.",
            content2: "Unlock Rocket Composites to build rocket components to mine in space.<br><br><span class='green-ready-text'>Unlock Launch Pad Tab</span>",
            updateAt: ""
        },
        techAdvancedFuelsRow: {
            content1: "Unlock Advanced Fuels to fuel your Space Mining vessels.",
            content2: "Unlock Advanced Fuels to fuel your Space Mining vessels<br><br><span class='green-ready-text'>Create Rocket Fuel</span>",
            updateAt: ""
        },
        techPlanetaryNavigationRow: {
            content1: "Unlock the ability to travel to Asteroids.",
            content2: "Unlock the ability to travel to Asteroids.<br><br><span class='green-ready-text'>Travel To Asteroids</span>",
            updateAt: ""
        },
        techAdvancedPowerGenerationRow: {
            content1: "Unlock Advanced Power Generation to boost energy production.",
            content2: "Unlock Advanced Power Generation to increase energy output, powering more complex systems and facilities.<br><br><span class='green-ready-text'>Build Advanced Power Plant</span>",
            updateAt: ""
        },
        techBasicPowerGenerationRow: {
            content1: "Unlock Basic Power Generation to start producing energy.",
            content2: "Unlock Basic Power Generation to lay the foundation for generating energy and powering essential systems.<br><br><span class='green-ready-text'>Build Power Plant</span>",
            updateAt: ""
        },
        techSolarPowerGenerationRow: {
            content1: "Unlock the ability to utilize the local star to harness clean, renewable energy.",
            content2: "Unlock Solar Power Generation to harness renewable solar energy, reducing reliance on non-renewable resources.<br><br><span class='green-ready-text'>Build Solar Power Plant</span>",
            updateAt: ""
        },        
        techScienceLaboratoriesRow: {
            content1: "Unlock Science Laboratories to build huge labs for large scale, dedicated research.",
            content2: "Unlock Science Laboratories to establish large-scale labs dedicated to conducting cutting-edge research.<br><br><span class='green-ready-text'>Build Science Laboratory</span>",
            updateAt: "" 
        },
        techSodiumIonPowerStorageRow: {
            content1: "Unlock the ability to build batteries to store energy that you generate.",
            content2: "Unlock Sodium-Ion Power Storage to build advanced batteries for storing energy generated by your systems.<br><br><span class='green-ready-text'>Build Tier 1 Battery</span>",
            updateAt: "" 
        }, 
        techOrbitalConstructionRow: {
            content1: "Unlock Orbital Construction to build starship modules.",
            content2: "Unlock Orbital Construction to build starship modules.<br><br><span class='green-ready-text'>Unlock Starship Section in InterStellar Tab</span>",
            updateAt: ""
        },
        techAntimatterEnginesRow: {
            content1: "Unlock Antimatter Engines to build interstellar propulsion systems.",
            content2: "Unlock Antimatter Engines to build interstellar propulsion systems.<br><br><span class='green-ready-text'>Build Starship Antimatter Engines</span>",
            updateAt: ""
        },
        techFTLTravelTheoryRow: {
            content1: "Unlock FTL Travel Theory to research faster-than-light travel.",
            content2: "Unlock FTL Travel Theory to research faster-than-light travel.<br><br><span class='green-ready-text'>Can Launch Starship</span>",
            updateAt: ""
        },
        techLifeSupportSystemsRow: {
            content1: "Unlock Life Support Systems to sustain life in deep space.",
            content2: "Unlock Life Support Systems to sustain life in deep space.<br><br><span class='green-ready-text'>Build Starship Habitatation Modules</span>",
            updateAt: ""
        },
        techStarshipFleetsRow: {
            content1: "Unlock Starship Fleets to build and command interstellar armadas.",
            content2: "Unlock Starship Fleets to build and command interstellar armadas.<br><br><span class='green-ready-text'>Allow building of Fleet Hangar onboard the Star Ship!</span>",
            updateAt: ""
        },  
        techStellarScannersRow: {
            content1: "Unlock Stellar Scanners to identify life signatures around Star Systems.",
            content2: "Unlock Stellar Scanners to identify life signatures around Star Systems.<br><br><span class='green-ready-text'>Allow building of Stellar Scanner onboard the Star Ship!</span>",
            updateAt: ""
        },               
        energyPowerPlant1Row: {
            content1: "This is the first building available to produce energy.",
            content2: "",
            updateAt: ""
        },
        energyPowerPlant2Row: {
            content1: "This building produces clean, renewable energy without using resources, but its efficiency is weather dependant!",
            content2: "",
            updateAt: ""
        },
        energyPowerPlant3Row: {
            content1: "This building produces significantly more power than its earlier iteration, but consumes more resources.",
            content2: "",
            updateAt: ""
        },
        energyBattery1Row: {
            content1: "Store small amount of energy for use if power starts being used faster than it can be generated.",
            content2: "",
            updateAt: ""
        },
        energyBattery2Row: {
            content1: "Store larger amount of energy for use if power starts being used faster than it can be generated.",
            content2: "",
            updateAt: ""
        },
        energyBattery3Row: {
            content1: "Store a huge amount of energy for use if power starts being used faster than it can be generated.",
            content2: "",
            updateAt: ""
        },
        antimatterSvgRow: {
            content1: "Hold down the Antimatter rate bar to increase production!",
            content2: "",
            updateAt: ""
        },
        spaceBuildLaunchPadRow: {
            content1: "Build the launch pad to launch built rockets and mine asteroids for antimatter.",
            content2: "",
            updateAt: ""
        },
        spaceBuildTelescopeRow: {
            content1: "Build the space telescope to search for Asteroids to mine.",
            content2: "",
            updateAt: "" 
        },
        spaceTelescopeSearchAsteroidRow: {
            content1: `Search and discover Asteroids - Power: ${Math.floor(getResourceDataObject('space', ['upgrades', 'spaceTelescope', 'energyUseSearchAsteroid']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: "" 
        },
        spaceTelescopeInvestigateStarRow: {
            content1: `Study the Stars! - Power: ${Math.floor(getResourceDataObject('space', ['upgrades', 'spaceTelescope', 'energyUseInvestigateStar']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: "" 
        },
        spaceRocket1TravelRow: {
            content1: `Select an Asteroid to travel there and begin mining Antimatter`,
            content2: "",
            updateAt: "" 
        },
        spaceRocket2TravelRow: {
            content1: `Select an Asteroid to travel there and begin mining Antimatter`,
            content2: "",
            updateAt: "" 
        },
        spaceRocket3TravelRow: {
            content1: `Select an Asteroid to travel there and begin mining Antimatter`,
            content2: "",
            updateAt: "" 
        },
        spaceRocket4TravelRow: {
            content1: `Select an Asteroid to travel there and begin mining Antimatter`,
            content2: "",
            updateAt: "" 
        },
        spaceRocket1AutoBuyerRow: {
            content1: `Fuel and launch your mining vessel to start mining valuable Antimatter - Power: ${Math.floor(getResourceDataObject('space', ['upgrades', 'rocket1', 'autoBuyer', 'tier1', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        spaceRocket2AutoBuyerRow: {
            content1: `Fuel and launch your mining vessel to start mining valuable Antimatter - Power: ${Math.floor(getResourceDataObject('space', ['upgrades', 'rocket2', 'autoBuyer', 'tier1', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        spaceRocket3AutoBuyerRow: {
            content1: `Fuel and launch your mining vessel to start mining valuable Antimatter - Power: ${Math.floor(getResourceDataObject('space', ['upgrades', 'rocket3', 'autoBuyer', 'tier1', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        spaceStarShipStellarScannerRow: {
            content1: `Click to Scan the destination Star for any life or threats that may be present.`,
            content2: "",
            updateAt: ""
        },
        spaceRocket4AutoBuyerRow: {
            content1: `Fuel and launch your mining vessel to start mining valuable Antimatter - Power: ${Math.floor(getResourceDataObject('space', ['upgrades', 'rocket4', 'autoBuyer', 'tier1', 'energyUse']) * getTimerRateRatio())}KW / s`,
            content2: "",
            updateAt: ""
        },
        spaceFleetEnvoyBuildRow: {
            content1: `A special buildable once craft.  When built, you can send it on a diplomacy mission to gather information about sentient alien lifeforms residing in the discovered System.`,
            content2: "",
            updateAt: ""
        },
        spaceFleetScoutBuildRow: {
            content1: `A cheap, light craft good in large numbers.`,
            // content1: `A cheap, light craft good in large numbers. Gains a <span class="green-ready-text">&nbsp;${getResourceDataObject('space', ['upgrades', 'fleetScout', 'bonusPercentage'])}%&nbsp;</span> bonus against <span class="green-ready-text">&nbsp;${capitaliseString(getResourceDataObject('space', ['upgrades', 'fleetScout', 'bonusGivenAgainstType']))}&nbsp;</span> fleets.`,
            content2: "",
            updateAt: ""
        },
        spaceFleetMarauderBuildRow: {
            content1: `A strong craft, designed for decimating enemy fleets.`,
            //content1: `A strong craft, designed for decimating enemy fleets. <span class="green-ready-text">&nbsp;${getResourceDataObject('space', ['upgrades', 'fleetMarauder', 'bonusPercentage'])}%&nbsp;</span> bonus against <span class="green-ready-text">&nbsp;${capitaliseString(getResourceDataObject('space', ['upgrades', 'fleetMarauder', 'bonusGivenAgainstType']))}&nbsp;</span> fleets.`,
            content2: "",
            updateAt: ""
        },
        spaceFleetLandStalkerBuildRow: {
            content1: `If they don't fly, they fear this awesome machine!`,
            //content1: `If they don't fly, they fear this awesome machine! <span class="green-ready-text">&nbsp;${getResourceDataObject('space', ['upgrades', 'fleetMarauder', 'bonusPercentage'])}%&nbsp;</span> bonus against <span class="green-ready-text">&nbsp;${capitaliseString(getResourceDataObject('space', ['upgrades', 'fleetLandStalker', 'bonusGivenAgainstType']))}&nbsp;</span> fleets.`,
            content2: "",
            updateAt: ""
        },
        spaceFleetNavalStraferBuildRow: {
            content1: `Naval fleets can be devastated in a heartbeat!`,
            // content1: `Naval fleets can be devastated in a heartbeat! Gains a <span class="green-ready-text">&nbsp;${getResourceDataObject('space', ['upgrades', 'fleetScout', 'bonusPercentage'])}%&nbsp;</span> bonus against <span class="green-ready-text">&nbsp;${capitaliseString(getResourceDataObject('space', ['upgrades', 'fleetNavalStrafer', 'bonusGivenAgainstType']))}&nbsp;</span> fleets.`,
            content2: "",
            updateAt: ""
        },
        rebirthRow: {
            content1: "Rebirth to start over at the new System.  This will reset all progress, but you will keep unspent AP and any permanent buffs purchased with it",
            content2: "",
            updateAt: ""
        },
        galacticMarketItemSelectRow: {
            content1: "Trade Resources and Compounds.  There is a commission to pay!",
            content2: "",
            updateAt: ""
        },
        galacticMarketSellApForCashRow: {
            content1: "Sell AP for Cash!  Be careful as AP are not easy to come by!",
            content2: "",
            updateAt: ""
        },
        galacticMarketLiquidateForAPRow: {
            content1: "Liquidate ALL Cash, Resources and Compounds, to AP.  You can only do this once per run so choose your moment wisely!",
            content2: `Liquidate ALL Cash, Resources and Compounds, to AP. <span class="red-disabled-text">Already done this run!</span>`,
            updateAt: ""
        },
        settingsCurrencySymbolRow: {
            content1: "Change the currency symbol displayed in the game.",
            content2: "",
            updateAt: ""
        },
        settingsNotationRow: {
            content1: "Select a notation format for displaying large numbers.",
            content2: "",
            updateAt: ""
        },
        settingsToggleNotificationsRow: {
            content1: "Enable or disable in-game notifications.",
            content2: "",
            updateAt: ""
        },
        settingsThemeRow: {
            content1: "Choose a visual theme to change the game’s appearance.",
            content2: "",
            updateAt: ""
        },
        diplomacyOptionsRow: {
            content1: "If available, and Envoy built, click to try to intimidate or improve relations",
            content2: "",
            updateAt: ""
        },
        receptionStatusRow: {
            content1: "You can communicate with civilized species, unless they are Belligerent towards you.",
            content2: "",
            updateAt: ""
        },
        buffEfficientStorageRow: {
            content1: "When you upgrade storage capacity of a Resource or Compound, it is doubled an extra time per purchase up to three times!",
            content2: "",
            updateAt: ""
        },
        buffSmartAutoBuyersRow: {
            content1: "Enhances auto buyers, increasing their efficiency by 50% per purchase.",
            content2: "",
            updateAt: ""
        },
        buffJumpstartResearchRow: {
            content1: "All Technology worth up to 4200 Research Points is given for free on Rebirth.",
            content2: "",
            updateAt: ""
        },
        buffOptimizedPowerGridsRow: {
            content1: "Increases the effectiveness of power grid upgrades by 20%.",
            content2: "",
            updateAt: ""
        },
        buffFasterAsteroidScanRow: {
            content1: "Reduces the time taken to perform an Asteroid Search by 25% per purchase.",
            content2: "",
            updateAt: ""
        },
        buffDeeperStarStudyRow: {
            content1: "Double the range reveal of a star study each purchase.",
            content2: "",
            updateAt: ""
        },
        buffAsteroidScannerBoostRow: {
            content1: "Minimum rarity of asteroids upgraded by 1 - Buy once, minimum Asteroid rarity is Uncommon etc.",
            content2: "",
            updateAt: ""
        },
        buffRocketFuelOptimizationRow: {
            content1: "Reduces fuelling time for rockets by 50%",
            content2: "",
            updateAt: ""
        },
        buffEnhancedMiningRow: {
            content1: "Improves antimatter extraction efficiency, by 25% per purchase.",
            content2: "",
            updateAt: ""
        },
        buffQuantumEnginesRow: {
            content1: "Upgrades starship engines, halving travel time per purchase.",
            content2: "",
            updateAt: ""
        }
    };

    newsTickerContent = {
        wackyEffects: [
            {
                body: "Stretch Me!",
                item: "wave",
                linkWord: "Stretch Me!",
                class: "",
                id: 1000
            },
            {
                body: "🕺💃 D.I.S.C.O. 🕺💃",
                item: "disco",
                linkWord: "🕺💃 D.I.S.C.O. 🕺💃",
                class: "",
                id: 1001
            },
            {
                body: "Boing!",
                item: "bounce",
                linkWord: "Boing!",
                class: "",
                id: 1002
            },
            {
                body: "There Or Not?",
                item: "fade",
                linkWord: "There Or Not?",
                class: "",
                id: 1003
            },
            {
                body: "Bzzzzzzz!",
                item: "glitch",
                linkWord: "Bzzzzzzz!",
                class: "",
                id: 1004
            },
            {
                body: "Wibble Wobble!",
                item: "wobble",
                linkWord: "Wibble Wobble!",
                class: "",
                id: 1005
            },
            {
                body: "Dont Click This: Boo!",
                item: "boo",
                linkWord: "Boo!",
                class: "boo",
                id: 1006
            }     
        ],        
        oneOff: [
            {
                id : 3000,
                body: "Double storage capacity of all unlocked resources here!",
                type: ["storageMultiplier", 2],
                condition: "visible",
                category: ["resources"],
                item: "all",
                linkWord: "here"
            },
            {
                id : 3001,
                body: "Double storage capacity of all unlocked compounds here!",
                type: ["storageMultiplier", 2],
                condition: "visible",
                category: ["compounds"],
                item: "all",
                linkWord: "here"
            },
            {
                id : 3002,
                body: "Double storage capacity of all unlocked resources and compounds here!",
                type: ["storageMultiplier", 2],
                condition: "visible",
                category: ["resources", "compounds"],
                item: "all",
                linkWord: "here"
            },
            {
                id : 3003,
                body: "Double storage capacity of tier 1 batteries here!",
                type: ["storageMultiplier", 2],
                condition: "",
                category: ["buildings", "batteries"],
                item: ["energy", "battery1"],
                linkWord: "here"
            },
            {   
                id : 3004,
                body: "Double storage capacity of tier 2 batteries here!",
                type: ["storageMultiplier", 2],
                condition: "",
                category: ["buildings"],
                item: ["energy", "battery2"],
                linkWord: "here"
            },
            {
                id : 3005,
                body: "Double storage capacity of tier 3 batteries here!",
                type: ["storageMultiplier", 2],
                condition: "",
                category: ["buildings"],
                item: ["energy", "battery3"],
                linkWord: "here"
            },
            {
                id : 3006,
                body: "Double output of all basic Power Plants here!",
                type: ["rateMultiplier", 2],
                condition: "",
                category: ["buildings"],
                item: ["energy", "powerPlant1"],
                linkWord: "here"
            },
            {
                id : 3007,
                body: "Double output of all Solar Power Plants here!",
                type: ["rateMultiplier", 2],
                condition: "",
                category: ["buildings"],
                item: ["energy", "powerPlant2"],
                linkWord: "here"
            },
            {
                id : 3008,
                body: "Double output of all Advanced Power Plants here!",
                type: ["rateMultiplier", 2],
                condition: "",
                category: ["buildings"],
                item: ["energy", "powerPlant3"],
                linkWord: "here"
            },            
            {
                id : 3009,
                body: "Double output of Tier 1 Auto Buyers for all unlocked resources here!",
                type: ["rateMultiplier", 2],
                condition: "",
                category: ["resources"],
                item: ["all", "tier1"],
                linkWord: "here"
            },
            {
                id : 3010,
                body: "Double output of Tier 1 Auto Buyers for all unlocked compounds here!",
                type: ["rateMultiplier", 2],
                condition: "",
                category: ["compounds"],
                item: ["all", "tier1"],
                linkWord: "here"
            },
            {
                id : 3011,
                body: "Double output of Tier 1 Auto Buyers for all unlocked resources and compounds here!",
                type: ["rateMultiplier", 2],
                condition: "",
                category: ["resources", "compounds"],
                item: ["all", "tier1"],
                linkWord: "here"
            },
            {
                id: 3012,
                body: "Get 100 free Antimatter here!",
                type: ["adder", 100],
                condition: "visible",
                category: "antimatter",
                item: "quantity",
                linkWord: "here"
            },            
            {
                id : 3013,
                body: "Get 1 free AP here!",
                type: ["adder", 1],
                condition: "visible",
                category: "ascendencyPoints",
                item: "quantity",
                linkWord: "here"
            }
        ],
        prize: [
            {
                body: "Click here to get xxx free Hydrogen!",
                type: "giftResource",
                condition: "visible",
                category: "resources",
                item: "hydrogen",
                linkWord: "here",
                id: 2000
            },
            {
                body: "Click here to get xxx free Helium!",
                type: "giftResource",
                condition: "visible",
                category: "resources",
                item: "helium",
                linkWord: "here",
                id: 2001
            },
            {
                body: "Click here to get xxx free Carbon!",
                type: "giftResource",
                condition: "visible",
                category: "resources",
                item: "carbon",
                linkWord: "here",
                id: 2002
            },
            {
                body: "Click here to get xxx free Neon!",
                type: "giftResource",
                condition: "visible",
                category: "resources",
                item: "neon",
                linkWord: "here",
                id: 2003
            },
            {
                body: "Click here to get xxx free Oxygen!",
                type: "giftResource",
                condition: "visible",
                category: "resources",
                item: "oxygen",
                linkWord: "here",
                id: 2004
            },
            {
                body: "Click here to get xxx free Sodium!",
                type: "giftResource",
                condition: "visible",
                category: "resources",
                item: "sodium",
                linkWord: "here",
                id: 2005
            },
            {
                body: "Click here to get xxx free Silicon!",
                type: "giftResource",
                condition: "visible",
                category: "resources",
                item: "silicon",
                linkWord: "here",
                id: 2006
            },
            {
                body: "Click here to get xxx free Iron!",
                type: "giftResource",
                condition: "visible",
                category: "resources",
                item: "iron",
                linkWord: "here",
                id: 2007
            },
            {
                body: "Click here to get xxx free Diesel!",
                type: "giftResource",
                condition: "visible",
                category: "compounds",
                item: "diesel",
                linkWord: "here",
                id: 2008
            },
            {
                body: "Click here to get xxx free Glass!",
                type: "giftResource",
                condition: "visible",
                category: "compounds",
                item: "glass",
                linkWord: "here",
                id: 2009
            },
            {
                body: "Click here to get xxx free Steel!",
                type: "giftResource",
                condition: "visible",
                category: "compounds",
                item: "steel",
                linkWord: "here",
                id: 2010
            },
            {
                body: "Click here to get xxx free Concrete!",
                type: "giftResource",
                condition: "visible",
                category: "compounds",
                item: "concrete",
                linkWord: "here",
                id: 2011
            },
            {
                body: "Click here to get xxx free Titanium!",
                type: "giftResource",
                condition: "visible",
                category: "compounds",
                item: "titanium",
                linkWord: "here",
                id: 2012
            },
            {
                body: "Click here to get xxx free Water!",
                type: "giftResource",
                condition: "visible",
                category: "compounds",
                item: "water",
                linkWord: "here",
                id: 2013
            }
        ],
        noPrize: [   //push index as id      
            "A hummingbird's heart can beat over 1,200 times per minute.",
            "The shortest commercial flight in the world lasts just 57 seconds.",
            "The Eiffel Tower can grow by up to 15 cm during hot weather.",
            "Bananas are naturally radioactive due to their potassium content.",
            "The longest hiccuping spree lasted 68 years!",
            "You can't hum while holding your nose.",
            "Cows have best friends and can get stressed when separated.",
            "Venus is the hottest planet in our solar system.",
            "Honey never spoils. Archaeologists have found 3,000-year-old honey in tombs!",
            "A cloud can weigh more than a million pounds.",
            "The moon is slowly moving away from the Earth by about 1.5 inches a year.",
            "A group of flamingos is called a 'flamboyance'.",
            "In space, astronauts can’t cry due to the lack of gravity.",
            "Sloths can hold their breath for up to 40 minutes underwater.",
            "Wombat poop is cube-shaped and helps it stay put.",
            "The Eiffel Tower can be taller by 15 cm during summer heat due to metal expansion.",
            "There are more stars in the universe than grains of sand on all of Earth's beaches.",
            "Penguins propose to their mates with a pebble.",
            "Sharks existed before trees!",
            "A sneeze can travel up to 100 miles per hour.",
            "A narwhal’s tusk is actually a tooth that can grow up to 10 feet long.",
            "The human stomach gets a new lining every few days.",
            "Cleopatra lived closer to the time of the moon landing than to the Great Pyramid’s construction.",
            "Butterflies can taste with their feet.",
            "The first successful organ transplant was a kidney transplant in 1954.",
            "The longest snowflake recorded was 15 inches wide.",
            "A day on Venus is longer than its year!",
            "Octopuses have three hearts and blue blood.",
            "The fastest-growing plant is bamboo, which can grow up to 35 inches in a single day.",
            "The world's largest rubber band ball weighs over 4,000 pounds.",
            "The shortest war in history lasted only 38 minutes.",
            "Shakespeare invented over 1,700 words in the English language.",
            "A jellyfish called Turritopsis dohrnii can live forever.",
            "There’s a species of fish that can walk on land: the mudskipper.",
            "A giraffe's neck contains the same number of vertebrae as a human's neck.",
            "The world’s largest snowman was built in Maine, USA, and stood over 122 feet tall.",
            "The longest time anyone has gone without sleep is 11 days.",
            "The first alarm clock could only ring at 4 a.m.",
            "In 2006, Pluto was reclassified as a dwarf planet.",
            "A single strand of spider silk is stronger than steel of the same diameter.",
            "Cleopatra wasn’t Egyptian. She was actually Greek.",
            "There are more fake flamingos than real flamingos in the world.",
            "It’s physically impossible to lick your own elbow.",
            "A group of owls is called a parliament.",
            "There are 293 ways to make change for a dollar in the U.S.",
            "A baby kangaroo is called a joey.",
            "The fastest-growing plant on Earth is a type of bamboo.",
            "The unicorn is Scotland's national animal.",
            "The human nose can detect over 1 trillion different scents.",
            "A full moon is 14% brighter than a half moon.",
            "Penguins can’t fly, but they are incredible swimmers.",
            "In Japan, there is a museum dedicated entirely to rocks that look like faces.",
            "The average person produces about 1-1.5 quarts of saliva per day.",
            "In 2004, a man in the UK managed to ride a roller coaster 303 times in one day, setting a record.",
            "The Great Wall of China is not visible from space without aid, despite popular belief.",
            "The lifespan of a single taste bud is about 10 days.",
            "The average person walks about 100,000 miles in a lifetime.",
            "Sharks can live for up to 400 years, with the Greenland shark being the longest-living vertebrate.",
            "A sneeze can travel at 100 mph, and it takes about 2-3 seconds for a person to recover from a sneeze.",
            "The Eiffel Tower is painted every seven years to protect it from rust.",
            "The unicorn is Scotland's national animal, even though it's a mythical creature.",
            "A day on Mars is only 40 minutes longer than a day on Earth.",
            "Butterflies taste with their feet, using sensors to detect the chemicals in plants.",
            "The strongest muscle in the human body, relative to its size, is the masseter (jaw muscle).",
            "The shortest commercial flight in the world is in Scotland, lasting just 57 seconds.",
            "Pigs are smarter than dogs and can learn to play video games.",
            "The longest word in the English language has 189,819 letters and refers to a protein in the human body.",
            "The Earth’s core is as hot as the surface of the sun, with temperatures reaching up to 9,932°F (5,500°C).",
            "Octopuses have three hearts: two pump blood to the gills, and one pumps it to the rest of the body.",
            "The honeybee is the only insect that produces food eaten by humans.",
            "In the 16th century, European doctors believed that 'sitting on a toad' could cure warts.",
            "The world record for the most tattoos on a single person is over 800.",
            "The longest hiccuping spree lasted for 68 years and was documented by a man from California.",
            "Cows have excellent memories and can remember faces for up to 10 years.",
            "An octopus can taste what it touches with its suckers.",
            "Bananas are actually classified as berries, while strawberries are not.",
            "A piece of paper cannot be folded more than seven times, no matter how large or thin it is.",
            "The word 'nerd' was first coined by Dr. Seuss in 1950.",
            "It rains diamonds on Jupiter and Saturn due to high pressure and carbon.",
            "Dolphins are capable of recognizing themselves in a mirror, demonstrating self-awareness.",
            "A panda's diet consists of 99% bamboo, but they are members of the order Carnivora.",
            "The longest recorded flight of a chicken is 13 seconds.",
            "The first computer mouse was made of wood.",
            "Cleopatra lived closer in time to the first moon landing than to the construction of the Great Pyramid of Giza.",
            "There are more possible iterations of a game of chess than there are atoms in the observable universe.",
            "The tallest building in the world, the Burj Khalifa, has 163 floors and stands over 2,700 feet tall.",
            "A group of cats is called a clowder.",
            "A goldfish has a memory span of only 3 seconds, or so the myth goes, but recent studies show they can remember things for months.",
            "The first successful human organ transplant was a kidney transplant in 1954.",
            "A blue whale’s heart is as large as a small car and weighs about 400 pounds.",
            "There are more pyramids in Sudan than in Egypt.",
            "The average person spends about six months of their lifetime waiting for red lights to turn green.",
            "There is a town in Norway called Hell, and it freezes over in the winter.",
            "A kangaroo can’t walk backward.",
            "It’s impossible to fold a paper in half more than seven times.",
            "Peanuts are not nuts; they are legumes.",
            "The first recorded use of the word 'robot' was in 1920, in a play called 'R.U.R.' by Karel Čapek.",
            "Dolphins have names for each other and can call each other by name.",
            "Humans share 60% of their DNA with bananas.",
            "A day on Mercury lasts longer than a year on Mercury.",
            "The word 'testify' comes from the ancient practice of men swearing an oath on their testicles.",
            "The longest time between two twins being born is 87 days.",
            "The tallest mountain in the solar system is Olympus Mons on Mars, which is about three times the height of Mount Everest.",
            "Rats laugh when they are tickled.",
            "Sea otters hold hands while they sleep to keep from drifting apart.",
            "A giraffe can clean its ears with its 21-inch tongue.",
            "There are more plastic flamingos in the U.S. than real flamingos.",
            "The average person has about 100,000 hairs on their head.",
            "There’s a tree that can grow a fruit called 'cannonball' that weighs up to 50 pounds.",
            "In ancient Rome, urine was used as a mouthwash.",
            "You can’t breathe and swallow at the same time.",
            "The first known contraceptive was used in ancient Egypt and involved crocodile dung.",
            "An astronaut's helmet costs over $3 million."
        ]
    };
}

statisticsContent = {
    'overview': {
        subHeading1: "Time Played ",
        subBody1: "0",

        subHeading2: "Pioneer ",
        subBody2: "Leigh",

        subHeading3: "Current AP ",
        subBody3: "10000",

        subHeading4: "AP Gain ",
        subBody4: "10000",

        subHeading5: "Run ",
        subBody5: "1",

        subHeading6: "Unique News Tickers Seen ",
        subBody6: "1000",

        subHeading7: "News Ticker Prizes Collected ",
        subBody7: "10",

        subHeading8: "Theme ",
        subBody8: "Terminal",

        subHeading9: "Antimatter Mined ",
        subBody9: "10000",

        subHeading10: "Total Asteroids Discovered ",
        subBody10: "50",

        subHeading11: "Legendary Asteroids Discovered ",
        subBody11: "5",

        subHeading12: "Rockets Launched ",
        subBody12: "156",

        subHeading13: "Star Ships Launched ",
        subBody13: "3"
    },
    'run': {
        subHeading1: "Run Time",
        subBody1: "100d 18h 10m 32s",

        subHeading2: "Star System",
        subBody2: "Spica",

        subHeading3: "Current Weather",
        subBody3: "☀",

        subHeading4: "Cash",
        subBody4: "10000",

        subHeading5: "AP Anticipated",
        subBody5: "3",

        subHeading6: "Antimatter",
        subBody6: "10000"
    },
    'resources': {
        subHeading1: "Hydrogen ",
        subBody1: "10000",

        subHeading2: "Helium ",
        subBody2: "10000",

        subHeading3: "Carbon ",
        subBody3: "10000",

        subHeading4: "Neon ",
        subBody4: "10000",

        subHeading5: "Oxygen ",
        subBody5: "10000",

        subHeading6: "Sodium ",
        subBody6: "10000",

        subHeading7: "Silicon ",
        subBody7: "10000",

        subHeading8: "Iron ",
        subBody8: "10000"
    },
    'compounds': {
        subHeading1: "Diesel ",
        subBody1: "10000",

        subHeading2: "Glass ",
        subBody2: "10000",

        subHeading3: "Steel ",
        subBody3: "10000",

        subHeading4: "Concrete ",
        subBody4: "10000",

        subHeading5: "Water ",
        subBody5: "10000",

        subHeading6: "Titanium ",
        subBody6: "10000"
    },
    'research': {
        subHeading1: "Research Points ",
        subBody1: "10000",

        subHeading2: "Science Kits ",
        subBody2: "10000",

        subHeading3: "Science Clubs ",
        subBody3: "10000",

        subHeading4: "Science Labs ",
        subBody4: "10000",

        subHeading5: "Techs Unlocked",
        subBody5: "10000 / 38 (make dynamic)"
    },
    'energy': {
        subHeading1: "Power",
        subBody1: "ON",

        subHeading2: "Total Energy",
        subBody2: "10000 KW",

        subHeading3: "Total Production",
        subBody3: "10000 KW",

        subHeading4: "Total Consumption",
        subBody4: "10000 KW",

        subHeading5: "Total Battery Storage",
        subBody5: "10000 MWh",

        subHeading6: "Times Tripped",
        subBody6: "10000",

        subHeading7: "Basic Power Plants ",
        subBody7: "10000",

        subHeading8: "Advanced Power Plants ",
        subBody8: "10000",

        subHeading9: "Solar Power Plants ",
        subBody9: "10000",

        subHeading10: "Sodium Ion Batteries ",
        subBody10: "10000",

        subHeading11: "Battery2 ",
        subBody11: "10000",

        subHeading12: "Battery3 ",
        subBody12: "10000"
    },
    'spaceMining': {
        subHeading1: "Space Telescope Built",
        subBody1: "Yes",

        subHeading2: "Launch Pad Built",
        subBody2: "Yes",

        subHeading3: "Rockets Built",
        subBody3: "4",

        subHeading4: "Asteroids Discovered",
        subBody4: "15",

        subHeading5: "Asteroids Mined",
        subBody5: "10",
    },
    'interstellar': {
        subHeading1: "Star Study Range",
        subBody1: "5",

        subHeading2: "Star Ship Built",
        subBody2: "Yes",

        subHeading3: "Star Ship Distance Travelled",
        subBody3: "0ly",

        subHeading4: "System Scanned",
        subBody4: "No",

        subHeading5: "Fleet Attack Strength",
        subBody5: "10000",

        subHeading6: "Fleet1",
        subBody6: "8",

        subHeading7: "Fleet2",
        subBody7: "12",

        subHeading8: "Fleet3",
        subBody8: "8",

        subHeading9: "Fleet4",
        subBody9: "2",

        subHeading10: "Fleet5",
        subBody10: "2",

        subHeading11: "Enemy",
        subBody11: "Xythians",

        subHeading12: "Enemy Total Defence Overcome",
        subBody12: "10000",

        subHeading13: "Enemy Total Defence Remaining",
        subBody13: "10000",

        subHeading14: "AP From Star Voyage",
        subBody14: "1",
    }
}

helpContent = {
    'get started': {
        subHeading1: "Introduction",
        subBody1: "Cosmic Forge in a nutshell is an incremental game.  However it is much more than that, and hopefully it will give you hours of gaming pleasure.<br/><br/>When you start the game, it is going to look pretty bleak, which it is, as you have been abandoned on a planet in the Spica system with nothing but a great understanding of the universe, and the ability to harness Hydrogen.  As you gain more of this basic building block, you will be able to sell it and gain some Cash.<br/><br/>Anyway, before going any further, open the Resources Tab, and expand the Gases section, and you will note there is a section called Hydrogen.  Click this and the Resources section will open.  Although it can look overwhelming at first, the concept is pretty simple.  At the top you will see a dropdown which allows you to set an amount of stock to sell, and a sell button.  This sells your Hydrogen for Cash, which you can see at the top left of the screen.<br/><br/>With some Cash in your pocket it is time to set about the goal, which is to ascend to the stars!  Quite a heavy task from a few coins and some Hydrogen atoms, I am sure you will agree, but fear not!<br/><br/>Next if you look below this section, you have a Gain button, that, when clicked adds a Hydrogen atom to your stocks.  You need to store this atom, and thats where the next section comes in.  If you gain so much Hydrogen that your storage is full, then you can trade all but one atom for an increase in storage, although making you gain the Hydrogen again, you can now collect twice as much!<br/><br/>This is great but a bit labour intensive.  To get around this, if you look below, you will see that there is a section allowing you to build a Hydrogen Generator, from now on called an Auto Buyer.  With this Auto Buyer, you can sit back and relax, while the Hydrogen is gained all by itself until the storage is full, which will make life easier for sure.<br/><br/>Now that the pressure is off a bit, next you will note there is a Research Tab, and opening this will give you access to some more information, and more importantly the concept of Research Points!  You can build a Science Kit which will start to generate you Research Points, very slowly at first, but this can grow very quickly.  Use the first batch you generate to open the Technology section and research your first technology, 'Knowledge Sharing'.<br/><br/>Congratulations you have just understood the main concept of Cosmic Forge, which is grinding and buying rewards with the profits.<br/><br/>Eventually you will be able to use this loop to discover new elements and grow those numbers beyond what you ever imagined!<br/><br/>Thanks for reading, now feel free to explore some other topics in the Cosmicopedia to give you some more context!"
    },
    'concepts - early': {
        subHeading1: "Resources",
        subBody1: "Resources are the building blocks of the game. They can be manually gathered, sold, used to buy upgrades, fused to create other Resources, or later on, used in the creation of advanced Compounds.",

        subHeading2: "Manual Gain",
        subBody2: "The Resources all have a button that when clicked, adds 1 to the quantity of that Resource, while the total quantity is less than the storage limit. This is useful in the early stages of the game as a way to get small amounts of Resources to get things kicked off!",

        subHeading3: "Sell",
        subBody3: "Using the dropdown to choose a suitable quantity, and then clicking the Sell button, will exchange the chosen quantity of Resource (or later on, Compound) for Cash which can be used towards buying certain upgrades.",

        subHeading4: "Storage",
        subBody4: "Each Resource and Compound has a Storage limit. If the Storage is full, no more of that Resource can be gained until some are used or Storage is increased. Upgrading Storage uses all but 1 of your stocks of that Resource or Compound.",

        subHeading5: "Auto Buyers",
        subBody5: "Auto Buyers allow you to automate the collection of Resources once unlocked. They work continuously in the background, freeing you up to focus on other tasks. That is until the Storage is full. Some require Energy to operate.",

        subHeading6: "Research Points",
        subBody6: "Research Points are gained by Research Upgrades and are used to unlock new technologies.",

        subHeading7: "Research Upgrades",
        subBody7: "Research Upgrades allow you to generate Research Points, although some require Energy to operate.",

        subHeading8: "Technology",
        subBody8: "Technology unlocks powerful upgrades and new game mechanics. Most techs have prerequisites and a cost in Research Points.",

        subHeading9: "Compounds",
        subBody9: "Compounds are more advanced materials that require multiple Resources to create. They are needed for mid to late game mechanics.",

        subHeading10: "Fusion",
        subBody10: "Fusion is a process that allows you to create Resources from more basic Resources.",

        subHeading11: "News Ticker",
        subBody11: "The News Ticker displays very important (honestly!) information, and can sometimes yield secret buffs, so keep an eye on it at all times!",
    },
    'concepts - mid': {
        subHeading1: "Energy Generation & Consumption",
        subBody1: "Energy is needed to power a lot of Upgrades, such as some Auto Buyers, and Research Upgrades, and then Consumed in a lot of later game mechanics, and if this is the case, it will be indicated in the description for the feature. There are Energy Production facilities, and Energy Storage facilities.",

        subHeading2: "Power Buildings",
        subBody2: "Power Buildings generate Energy, and there are various types. They Consume Fuel while running, which can sometimes be Compounds, and in other cases Solar power.",

        subHeading3: "Batteries",
        subBody3: "Batteries store excess Energy for use when Generation is insufficient, for example if there are not enough Power Buildings following the purchase of an Upgrade, or if the Fuel is exhausted for a particular Power Building. Upgrading Battery capacity is key to maintaining Energy flow, while expanding Upgrades that consume Energy.",

        subHeading4: "Weather",
        subBody4: "Weather affects various in-game mechanics, including Energy Production. It can affect the launching of Rockets, and can provide extra Resources through Precipitation. The prevailing Weather, and indeed the Resource provided by Precipitation can vary depending on the Star that is being played (a late game mechanic).",

        subHeading5: "Space Mining",
        subBody5: "Space Mining allows for the extraction of rare Antimatter from Asteroids.",

        subHeading6: "Space Telescope",
        subBody6: "The Space Telescope is used to scan for Asteroids that can be Mined by your Rocket Miners, and in the Late Game, to Study Stars.  Using the Space Telescope requires a lot of Energy, and it has a high build cost.",

        subHeading7: "Asteroids",
        subBody7: "Asteroids contain Antimatter. Mining asteroids requires the Construction and Launching of Rocket Miners. Some Asteroids are easy to Travel To and Mine, whereas others require more time. The quantity of Antimatter varies, and so the Asteroids have different classes based on their quality. If you are really lucky, you may even find a Legendary Asteroid and have it named after you!",

        subHeading8: "Launch Pad",
        subBody8: "The Launch Pad is a prerequisite to building Rocket Miners.  It is an expensive Upgrade, and once built, you can see the number of Rocket Miners you have, and their stages of Construction, or Launch state.",

        subHeading9: "Rocket Miners - Building",
        subBody9: "You can build up to 4 Rocket Miners using advanced Compounds and a lot of Cash, provided you have built a Launch Pad. They each require a number of modules or Parts to build, which get progressively more expensive.  By default they are named as Rocket 1 etc but can be renamed.",

        subHeading10: "Rocket Miners - Launching & Travelling",
        subBody10: "Rockets must be Fuelled and Launched. They can Travel To to any Asteroid you have discovered with the Space Telescope, provided they are Fuelled and Launched.  Fuelling requires Power and time, and Launching requires good weather.  Once Launched, you can select a destination for your rocket from the discovered Asteroids dropdown, and then click to Travel To it.",

        subHeading11: "Rocket Miners - Mining",
        subBody11: "Once a Rocket Miner has travelled to an Asteroid, it will automatically Mine Antimatter from the Asteroid until it is exhausted, and will then return and require Fuelling to be used again.  While at an Asteroid, a Rocket Miner can Mine faster if the Boost option is used, available in the Mining panel."
    },
    'concepts - late': {
        subHeading1: "Star Map",
        subBody1: "The Star Map provides a view of the known Universe, and although it is discovered relatively early in the Game, it comes in to play much later.  Once you start to Study Stars, you can use this Star Map and the Star Data table to plan out your post Rebirth options.",

        subHeading2: "Antimatter",
        subBody2: "Antimatter is an advanced Resource used as Starship Fuel, and is a key component in progressing towards Rebirthing and completing the Game.  It is Mined from Asteroids using Rocket Miners.",

        subHeading3: "Starship - Construction",
        subBody3: "Building a Starship is a major milestone. Starships can travel to distant star systems and permit Rebirthing.",

        subHeading4: "Starship - Travelling",
        subBody4: "Starships can Travel To Studied Star systems, each offering unique Weather, Resources, and challenges when you rebirth on them for a new run.", 

        subHeading5: "Diplomacy",
        subBody5: "Most Star Systems contain intelligent alien life. You need to perform a Stellar Scan, and build an Envoy and send it, to initiate this. The Scan gives information about the lifeform in the System, it is not mandatory, but if you don't do this, your only option will be war and without knowing the size of the enemy force!  There are several options when these encounters are made, ranging from Bullying them, to trying to Vassalize them, and if all else fails, Conquerig them!  You can improve or worsen their impression of you which can affect their fleet size.  Leaders have traits that can affect how they respond to you, or in the case of war, can buff or reduce their defense, speed, fleet size etc.",

        subHeading6: "Battle",
        subBody6: "Not all systems are friendly. Sometimes the only option will be to fight it out to try to conquer it.  You must use the Fleet Hangar screen to build an attack force and initiate a battle.  If you lose, all your fleet will be destroyed but not your Star Ship.  You can rebuild, but it is an expensive process so try and win!.",

        subHeading7: "Ascendency Points (AP)",
        subBody7: "Ascendency Points (AP) are earned by Travelling To Stars. Simply put, the further away the Star is, the more AP will be granted upon Rebirth. They can be spent in the Galactic Market.  You can also gain them by liquidating all your resources and compounds and cash once per run, and also some colonising methods can double the payout also.", 

        subHeading8: "Rebirth",
        subBody8: "Rebirth resets progress but conquers a New System.", 

        subHeading9: "Galactic Market",
        subBody9: "The Galactic market is a major unlock, and arrives after your ship arrives at the new System in the first run.  In it, you can trade Resources, Cash and AP.",

        subHeading10: "Ascendency Perks",
        subBody10: "You can spend acquired AP on permanent buffs that make future runs easier, and the game more replayable and fun!"
    }
}

starNames = [
    "Sirius","Canopus","Arcturus","Sadalmelik","Capella","Rigel","Procyon","Betelgeuse","Altair","Aldebaran",
    "Sterope","Antares","Pollux","Fomalhaut","Deneb","Mimosa","Regulus","Adhara","Castor","Shaula",
    "Bellatrix","Elnath","Miaplacidus","Alnilam","Alnair","Alioth","Alnitak","Dubhe","Mirfak","Wezen",
    "Sargas","Kaus Australis","Avior","Alkaid","Menkalinan","Atria","Alhena","Peacock","Tureis","Nunki",
    "Mirzam","Alphard","Rasalhague","Caph","Zubenelgenubi","Electra","Hamal","Mintaka","Alsephina","Menkent",
    "Enif","Tiaki","Ascella","Algol","Markab","Suhail","Zeta Ophiuchi","Kochab","Ankaa","Denebola",
    "Vega","Azelfafage","Maia","Arkab Prior","Thuban","Izar","Ruchbah","Albireo","Almaaz","Dschubba",
    "Algieba","Gomeisa","Hoedus II","Cebalrai","Nashira","Muscida","Kitalpha","Hyadum I","Eltanin","Yildun",
    "Biham","Zubeneschamali","Alpherg","Alcor","Polaris","Pleione","Spica","Chara","Sadachbia","Rasalgethi",
    "Barnards Star","Saiph","Hassaleh","Furud","Atik","Sadalsuud","Propus","Botein","Acamar","Anser"
];

export function getOptionDescription(key1) {
    return optionDescriptions[key1];
}

export function setOptionDescription(key1, value) {
    if (!optionDescriptions[key1]) {
        optionDescriptions[key1] = {};
    }
    Object.assign(optionDescriptions[key1], value);
}

export function getHeaderDescriptions(key) {
    return headerDescriptions[key];
}

export function setHeaderDescriptions(key, value) {
    headerDescriptions[key] = value.toLowerCase();
}

export function getRocketNames(key) {
    return rocketNames[key];
}

export function setRocketNames(key, value) {
    rocketNames[key] = value.toLowerCase();
}

export function replaceRocketNames(value) {
    rocketNames = value;
}

export function getStarNames() {
    return [...starNames];
}

export function getHelpContent(section, type) {
    const currentSection = helpContent[section];

    if (type === 'subHeadings') {
        return Object.keys(currentSection)
            .filter(key => key.startsWith('subHeading'))
            .map(key => currentSection[key]);
    } else if (type === 'subBodys') {
        return Object.keys(currentSection)
            .filter(key => key.startsWith('subBody'))
            .map(key => currentSection[key]);
    }

    return [];
}

export function getStatisticsContent(type) {
    const mainHeadings = Object.keys(statisticsContent);

    if (type === 'mainHeadings') {
        return mainHeadings;
    }

    if (type === 'subHeadings' || type === 'subBodys') {
        let subSections = [];

        mainHeadings.forEach(mainHeading => {
            const subSectionsForMainHeading = statisticsContent[mainHeading];
            let subSectionArray = [];
            
            for (let i = 1; i <= Object.keys(subSectionsForMainHeading).length / 2; i++) {
                const subHeading = subSectionsForMainHeading[`subHeading${i}`] || '';
                const subBody = subSectionsForMainHeading[`subBody${i}`] || '';
                if (type === 'subHeadings') {
                    subSectionArray.push(subHeading);
                } else if (type === 'subBodys') {
                    subSectionArray.push(subBody);
                }
            }
            subSections.push(subSectionArray);
        });
        return subSections;
    }
    return [];
}
