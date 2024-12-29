export const gameIntroHeader = 'Welcome to the Cosmic Forge!';
export const gameIntroText = 'Embark on an epic journey from the simplest element to the building blocks of the cosmos.<br>Begin by gathering Hydrogen and mastering the art of fusion to create Helium, Carbon, and beyond.<br> Explore new technologies, unlock powerful compounds, and automate your processes to reshape entire planets.<br> Craft advanced compounds with unique uses, and discover the secrets of the stars with interstellar exploration.<br>With each click, fusion, and discovery, you edge closer to becoming the architect of a vibrant galaxy.<br><br>Good Luck!';

export const headerDescriptions = {
    'Resources': 'Here you can gain and sell resources. You can also upgrade your storage capacity and automate resource harvesting.  When you discover fusion, you will also handle that here.',
    'Compounds': 'Here you can create and sell compounds from constituent parts or with advanced machinery.',
    'Star Map': 'Here you can explore the galaxy and discover new stars and planets.',
    'Technology': 'In the Technology section, you can unlock new technologies to progress through the game, and also get upgrades to farm research points.',
    'Buildings': 'Here you can buy upgrades for making resource gathering more efficient and progress through the game.',
    tab6intro: '',
    tab7intro: '',
    'Settings': 'Change the game settings to your liking.',
    
    hydrogen: "The most basic element known to man, very cheap to produce and has a pretty low value, but anything can be created from it.",
    helium: "Lighter than air this one will make you float away!",
    carbon: "This is the first stable solid element, made from fused Helium",
    neon: "The first noble gas!  Very 'bright' of you to discover it!",
    oxygen: "A vital element for most, oxygen is highly reactive and essential for combustion and respiration.",
    sodium: "A soft, silvery metal",
    silicon: "The backbone of modern technology, it is a crucial component in electronics and solar panels.",
    iron: "A strong and versatile metal, iron is the foundation of construction and industry.",

    energy: "Any buildings beyond the first level require power to operate, you can manage that here, as well as energy storage.",
    'power plant': "These buildings provide the energy resource, and it is used by advanced buildings, without which they won't operate.",
    'advanced power plant': "These buildings provide high amounts of energy for powering a lot of machinery.",
    'solar power plant': "Solar power plants provide renewable energy without using a lot of resources.",
    research: "Here you can buy upgrades to generate research points for unlocking new technology.",
    'tech tree': "Here you can unlock new technologies to improve your game, provided you have enough research points!",

    diesel: "The first compound created by your hands, it is a useful early fuel!",

    'star map': "This is a map of the known galaxy",
    
    visual: "Change the visual settings of the game.",
};

export const techNotificationMessages = {
    knowledgeSharing: 'Knowledge Sharing Researched\n\nYou can now open Science Clubs!',
    fusionTheory: 'Fusion Theory Researched\n\nUseful for future experiments!',
    hydrogenFusion: 'Hydrogen Fusion Researched\n\nYou can now fuse Hydrogen!',
    heliumFusion: 'Helium Fusion Researched\n\nYou can now fuse Helium!',
    carbonFusion: 'Carbon Fusion Researched\n\nYou can now fuse Carbon!',
    neonFusion: 'Neon Fusion Researched\n\nYou can now fuse Neon!',
    oxygenFusion: 'Oxygen Fusion Researched\n\nYou can now fuse Oxygen!',
    siliconFusion: 'Silicon Fusion Researched\n\nYou can now fuse Silicon!',
    nobleGasCollection: 'Noble Gas Collection Researched\n\nWe can now store Noble Gases when fused!',
    glassManufacture: 'Glass Manufacture Researched\n\nWe can now produce Glass compounds!',
    neutronCapture: 'Neutron Capture Researched\n\nThis will now allow us to fuse Gold, modern day Alchemy, we will be rich beyond belief!',
    quantumComputing: 'Quantum Computing Researched\n\nMore advanced Machinery is now available!',
    scienceLaboratories: 'Science Laboratories Researched\n\nYou can now build Science Labs!',
    hydroCarbons: 'HydroCarbons Researched\n\nYou can gain access to Diesel Fuel once you have Compounds unlocked!',
    nanoTubeTechnology: 'Nano Tube Technology Researched\n\nWith this we can start to learn about how to fuse Carbon in the future!',
    stellarCartography: 'Stellar Cartography Researched\n\nYou unlocked The Star Map!',
    fusionEfficiencyI: 'Fusion Efficiency Stage I Researched\n\n20% Boost to Fusion returns!',
    fusionEfficiencyII: 'Fusion Efficiency Stage II Researched\n\nFurther 20% Boost to Fusion returns!',
    fusionEfficiencyIII: 'Fusion Efficiency Stage III Researched\n\n100% Fusion returns!',
    atmosphericTelescopes: 'Atmospheric Telescopes Researched\n\nYou can now get data from the local stellar neighborhood!',
    giganticTurbines: 'Gigantic Turbines Researched\n\nThis opens up new research in power generation!',
    steelFoundries: 'Steel Foundries Researched\n\nYou can now build Steel Foundries!',
    advancedPowerGeneration: 'Advanced Power Generation Researched\n\nBuild Advanced Power Plants!',
    basicPowerGeneration: 'Basic Power Generation Researched\n\nYou can now build basic Power Stations!',
    solarPowerGeneration: 'Solar Power Generation Researched\n\nYou can now build Solar Panels to generate power!',
    compounds: 'Compounds Researched\n\nUnlocks the Compounds tab!',
    sodiumIonPowerStorage: 'Sodium Ion Power Storage Researched\n\nYou can build batteries to store energy!'
};

export const optionDescriptions = {
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
    hydrogenAutoBuyer1Row: {
        content1: "Add a Hydrogen Compressor to automate Hydrogen generation.",
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
    heliumAutoBuyer1Row: {
        content1: "Helium seems lighter than air, so fill balloons, and add an Atmosphere Scraper to automate Helium collection.",
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
    carbonAutoBuyer1Row: {
        content1: "Buy a miner to automate the collection of Carbon.",
        content2: "",
        updateAt: ""
    },
    neonSellRow: {
        content1: "Here you can sell Neon for cash",
        content2: "Here you can sell Neon for cash or fuse it into Silver",
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
    neonAutoBuyer1Row: {
        content1: "Add an Neon Extractor to automate Neon generation.",
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
    oxygenAutoBuyer1Row: {
        content1: "Add an Oxygen Extractor to automate Oxygen generation.",
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
    sodiumAutoBuyer1Row: {
        content1: "Add a Sodium Extractor to automate Sodium generation.",
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
    siliconAutoBuyer1Row: {
        content1: "Add a Silicon Extractor to automate Silicon generation.",
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
    ironAutoBuyer1Row: {
        content1: "Add an Iron Extractor to automate Iron generation.",
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
    dieselAutoBuyer1Row: {
        content1: "Add an Extractor to collect oil and make diesel.",
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
        content1: "Build a Science Lab to do large amounts of Research.",
        content2: "",
        updateAt: ""
    },
    techKnowledgeSharingRow: {
        content1: "Unlock Knowledge Sharing to advance research capabilities.",
        content2: "",
        updateAt: ""
    },
    techFusionTheoryRow: {
        content1: "Unlock Fusion Theory to pave the way for advanced fusion technologies.",
        content2: "",
        updateAt: ""
    },
    techHydrogenFusionRow: {
        content1: "Unlock Hydrogen Fusion to experiment with fusing Hydrogen atoms.",
        content2: "",
        updateAt: ""
    },
    techStellarCartographyRow: {
        content1: "Unlock Stellar Cartography to map the stars.",
        content2: "",
        updateAt: ""
    },
    techQuantumComputingRow: {
        content1: "Unlock Quantum Computing to enhance computational power and enable more advanced machinery.",
        content2: "",
        updateAt: ""
    },
    techHeliumFusionRow: {
        content1: "Unlock Helium Fusion to enable the fusion of helium atoms.",
        content2: "",
        updateAt: ""
    },
    techHydroCarbonsRow: {
        content1: "Unlock HydroCarbons to produce early fuel for power generation.",
        content2: "",
        updateAt: ""
    },
    techNanoTubeTechnologyRow: {
        content1: "Unlock NanoTube Technology to manufacture new machines to extract resources more efficiently.",
        content2: "",
        updateAt: ""
    },
    techCarbonFusionRow: {
        content1: "Unlock Carbon Fusion to experiment with the fusion of carbon atoms.",
        content2: "",
        updateAt: ""
    },
    techNeonFusionRow: {
        content1: "Unlock Neon Fusion to explore and harness fusion reactions of neon.",
        content2: "",
        updateAt: ""
    },
    techOxygenFusionRow: {
        content1: "Unlock Oxygen Fusion to experiment with fusing oxygen atoms.",
        content2: "",
        updateAt: ""
    },
    techSiliconFusionRow: {
        content1: "Unlock Silicon Fusion to experiment fusing silicon.",
        content2: "",
        updateAt: ""
    },
    techNeutronCaptureRow: {
        content1: "Unlock Neutron Capture to collect fusion by-products.",
        content2: "",
        updateAt: ""
    },
    techGlassManufactureRow: {
        content1: "Unlock Glass Manufacture to produce advanced glass compounds from silicon and oxygen.",
        content2: "",
        updateAt: ""
    },
    techNobleGasCollectionRow: {
        content1: "Unlock Noble Gas Collection to store rare noble gases.",
        content2: "",
        updateAt: ""
    },
    techFusionEfficiencyIRow: {
        content1: "Unlock Fusion Efficiency I to enhance fusion efficiency.",
        content2: "",
        updateAt: ""
    },
    techFusionEfficiencyIIRow: {
        content1: "Unlock Fusion Efficiency II to further enhance fusion efficiency.",
        content2: "",
        updateAt: ""
    },
    techFusionEfficiencyIIIRow: {
        content1: "Unlock Fusion Efficiency III to realise 100% efficient fusion.",
        content2: "",
        updateAt: ""
    },
    techAtmosphericTelescopesRow: {
        content1: "Unlock Atmospheric Telescopes to get data about the surrounding stellar neighborhood.",
        content2: "",
        updateAt: ""
    },
    techGiganticTurbinesRow: {
        content1: "Unlock Gigantic Turbines to allow the building of advanced power generators.",
        content2: "",
        updateAt: ""
    },
    techSteelFoundriesRow: {
        content1: "Unlock Steel Foundries to produce high strength steel compounds.",
        content2: "",
        updateAt: ""
    },
    techCompoundsRow: {
        content1: "Unlock Compounds to expand the materials you have access to.",
        content2: "",
        updateAt: ""
    },
    techAdvancedPowerGenerationRow: {
        content1: "Unlock Advanced Power Generation to boost energy production.",
        content2: "",
        updateAt: ""
    },
    techBasicPowerGenerationRow: {
        content1: "Unlock Basic Power Generation to start producing energy.",
        content2: "",
        updateAt: ""
    },
    techSolarPowerGenerationRow: {
        content1: "Unlock the ability to utilize the local star to harness clean, renewable energy.",
        content2: "",
        updateAt: ""
    },
    techScienceLaboratoriesRow: {
        content1: "Unlock Science Laboratories to build huge labs for large scale, dedicated research.",
        content2: "",
        updateAt: "" 
    },
    techSodiumIonPowerStorageRow: {
        content1: "Unlock the ability to build batteries to store energy that you generate.",
        content2: "",
        updateAt: "" 
    },
    energyPowerPlant1Row: {
        content1: "This is the first building available to produce energy.",
        content2: "",
        updateAt: ""
    },
    energyPowerPlant2Row: {
        content1: "This building produces clean, renewable energy without using resources.",
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
};
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

export function setHeaderDescriptions(value) {
    headerDescriptions[key] = value;
}

