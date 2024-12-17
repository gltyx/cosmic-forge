
export const headerDescriptions = {
    visual: "Change the visual settings of the game.",
    research: "Here you can buy upgrades to generate research points for unlocking new technology.",
    'tech tree': "Here you can unlock new technologies to improve your game, provided you have enough research points!",
    hydrogen: "The most basic element known to man, very cheap to produce and has a pretty low value, but anything can be created from it.",
    helium: "Lighter than air this one will make you float away!"
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
        content1: "Sell Helium to earn cash.",
        content2: "",
        updateAt: ""
    },
    heliumGainRow: {
        content1: "Manually gain one unit of Helium.",
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

