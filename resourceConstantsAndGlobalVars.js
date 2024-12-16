import { setResourceSalePreview, getResourceSalePreview } from "./constantsAndGlobalVars.js";

//FUNCTION REGISTRIES
export const functionRegistryUpgrade = {
    getUpgradeHydrogen: getUpgradeHydrogen,
    getUpgradeResearch: getUpgradeResearch,
    getHydrogenQuantity: getHydrogenQuantity,
    getResearchQuantity: getResearchQuantity,
    getCash: getCash,
    // Add more functions here as needed
};

export const functionRegistryResourceQuantity = {
    hydrogen: { getQuantity: getHydrogenQuantity, setSalePreview: setResourceSalePreview, getSalePreview: getResourceSalePreview, salePreviewElement: 'sellHydrogenDescription' },
    //helium: { getQuantity: getHeliumQuantity, setSalePreview: setHeliumSalePreview },
    // Add more resources here...
};

//RESOURCE SALE VALUES
export const SALE_VALUES = {
    hydrogen: 0.005,
    helium: 0.010,
};

//QUANTITY VARIABLES
//RESOURCES
export let researchQuantity = 0;
export let hydrogenQuantity = 0;

//AUTOBUYERS
export let scienceKitQuantity = 0;
export let scienceClubQuantity = 0;
export let hydrogenAB1Quantity = 0;

//RATE VARIABLES
export let researchRate = 0;
export let hydrogenRate = 0;

//STORAGE VARIABLES
export let hydrogenStorage = 200;

//RESOURCE UPGRADE OBJECTS
export let upgradeHydrogen = {
    storage: {
        type: 'storage',
        requirementQty: 1,
        price: getHydrogenStorage,
        resource: 'hydrogen',
        checkQuantity: getHydrogenQuantity,
        deduct: setHydrogenQuantity,
        setPrice: null
    },
    autoBuyer: {
        type: 'autoBuyer',
        tier1: {
            price: 65, rate: 0.01, setPrice: 'hydrogenAB1Price'
        },
        tier2: {
            price: 500, rate: 25, setPrice: 'hydrogenAB2Price'
        },
        tier3: {
            price: 2500, rate: 125, setPrice: 'hydrogenAB3Price'
        },
        tier4: {
            price: 12500, rate: 625, setPrice: 'hydrogenAB4Price'
        },
        requirementQty: 1,
        resource: 'hydrogen',
        checkQuantity: getHydrogenQuantity,
        deduct: setHydrogenQuantity,
    },
};

//RESEARCH UPGRADE OBJECT
export let upgradeResearch = {
    techs: {
        knowledgeSharing: {
            appearsAt: 0,
            price: 5,
            resource: 'research',
            effectFunction: 'revealElement'
        },
        discoverHelium: {
            appearsAt: 20, //300
            price: 30, //500
            resource: 'research',
            effectFunction: 'revealElement'
        }
    },
    research: {
        scienceKit: {
            requirementQty: 1,
            price: 5,
            rate: 0.003,
            resource: 'cash',
            checkQuantity: getCash,
            deduct: setCash,
            setPrice: 'scienceKitPrice'
        },
        scienceClub: {
            requirementQty: 1,
            price: 100,
            rate: 0.06,
            resource: 'cash',
            checkQuantity: getCash,
            deduct: setCash,
            setPrice: 'scienceClubPrice'
        }
    }
};
//----------------------------------------------------------------------------------------------------------
//GETTER SETTERS
export function getUpgradeHydrogen(key) {
    return upgradeHydrogen[key];
}

export function setUpgradeHydrogen(key, tier, property, value) {
    upgradeHydrogen[key][tier][property] = value;
}
export function setUpgradeResearch(key1, key2, property, value) {
    upgradeResearch[key1][key2][property] = value;
}

export function getUpgradeResearch(key1, key2) {
    return upgradeResearch[key1][key2];
}
export function getHydrogenRate() {
    return hydrogenRate;
}

export function setHydrogenRate(value) {
    hydrogenRate = value;
}

export function getResearchRate() {
    return researchRate;
}

export function setResearchRate(value) {
    researchRate = value;
}
export function getHydrogenQuantity() {
    return hydrogenQuantity;
}

export function setHydrogenQuantity(value) {
    hydrogenQuantity = value;
}

export function getHydrogenStorage() {
    return hydrogenStorage;
}

export function setHydrogenStorage(value) {
    hydrogenStorage = value;
}

export function getResearchQuantity() {
    return researchQuantity;
}

export function setResearchQuantity(value) {
    researchQuantity = value;
}

export function getScienceKitQuantity() {
    return scienceKitQuantity;
}

export function setScienceKitQuantity(value) {
    scienceKitQuantity = value;
}

export function getScienceClubQuantity() {
    return scienceClubQuantity;
}

export function setScienceClubQuantity(value) {
    scienceClubQuantity = value;
}
export let cash = 100;
export function getCash() {
    return cash;
}

export function setCash(value) {
    cash = value;
}
export function getHydrogenAB1Quantity() {
    return hydrogenAB1Quantity;
}

export function setHydrogenAB1Quantity(value) {
    hydrogenAB1Quantity = value;
}
