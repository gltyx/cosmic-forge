import { setResourceSalePreview, getResourceSalePreview } from "./constantsAndGlobalVars.js";

//FUNCTION REGISTRIES
export const functionRegistryUpgrade = {
    getHydrogenStorage: getHydrogenStorage,
    getHeliumStorage: getHeliumStorage,
    getUpgradeResearch: getUpgradeResearch,
    getUpgradeHydrogen: getUpgradeHydrogen,
    getUpgradeHelium: getUpgradeHelium,
    getHydrogenQuantity: getHydrogenQuantity,
    getHeliumQuantity: getHeliumQuantity,
    getResearchQuantity: getResearchQuantity,
    getCash: getCash,
    // Add more functions here as needed
};

export const functionRegistryResourceQuantity = {
    hydrogen: { getQuantity: getHydrogenQuantity, setSalePreview: setResourceSalePreview, getSalePreview: getResourceSalePreview, salePreviewElement: 'sellHydrogenDescription' },
    helium: { getQuantity: getHeliumQuantity, setSalePreview: setResourceSalePreview, getSalePreview: getResourceSalePreview, salePreviewElement: 'sellHeliumDescription' },
    // Add more resources here...
    //CARBON from helium
};

//RESOURCE SALE VALUES
export const SALE_VALUES = {
    hydrogen: 0.005,
    helium: 0.01,
};

//QUANTITY VARIABLES
//RESOURCES
export let cash = 100000;
export let researchQuantity = 320;
export let hydrogenQuantity = 0;
export let heliumQuantity = 0;

//AUTOBUYERS
export let scienceKitQuantity = 0;
export let scienceClubQuantity = 0;
export let hydrogenAB1Quantity = 0;
export let heliumAB1Quantity = 0;

//RATE VARIABLES
export let researchRate = 0;
export let hydrogenRate = 0;
export let heliumRate = 0;

//STORAGE VARIABLES
export let hydrogenStorage = 100;
export let heliumStorage = 100;

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

export let upgradeHelium = {
    storage: {
        type: 'storage',
        requirementQty: 1,
        price: getHeliumStorage,
        resource: 'helium',
        checkQuantity: getHeliumQuantity,
        deduct: setHeliumQuantity,
        setPrice: null
    },
    autoBuyer: {
        type: 'autoBuyer',
        tier1: {
            price: 75, rate: 0.01, setPrice: 'heliumAB1Price'
        },
        tier2: {
            price: 575, rate: 25, setPrice: 'heliumAB2Price'
        },
        tier3: {
            price: 2875, rate: 125, setPrice: 'heliumAB3Price'
        },
        tier4: {
            price: 14375, rate: 625, setPrice: 'heliumAB4Price'
        },        
        requirementQty: 1,
        resource: 'helium',
        checkQuantity: getHeliumQuantity,
        deduct: setHeliumQuantity,
    },
};

//RESEARCH UPGRADE OBJECT
export let upgradeResearch = {
    techs: {
        knowledgeSharing: {
            appearsAt: [0, null],
            price: 5,
            resource: 'research',
            effectFunction: 'revealElement'
        },
        fusionTheory: {
            appearsAt: [500, null],
            price: 750,
            resource: 'research',
            effectFunction: 'prerequisite'
        },
        hydrogenFusion: {
            appearsAt: [750, 'fusionTheory'],
            price: 1500,
            resource: 'research',
            effectFunction: 'revealElement'
        },
        fusionEfficiencyI: {
            appearsAt: [1000, null],
            price: 2000,
            resource: 'research',
            effectFunction: 'prerequisite'
        },
        fusionEfficiencyII: {
            appearsAt: [1000, null],
            price: 2000,
            resource: 'research',
            effectFunction: 'prerequisite'
        },
        fusionEfficiencyIII: {
            appearsAt: [1000, null],
            price: 2000,
            resource: 'research',
            effectFunction: 'prerequisite'
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

export function getUpgradeHelium(key) {
    return upgradeHelium[key];
}

export function setUpgradeHelium(key, tier, property, value) {
    upgradeHelium[key][tier][property] = value;
}

export function getUpgradeResearch(key1, key2) {
    return upgradeResearch[key1][key2];
}

export function setUpgradeResearch(key1, key2, property, value) {
    upgradeResearch[key1][key2][property] = value;
}

export function getHydrogenRate() {
    return hydrogenRate;
}

export function setHydrogenRate(value) {
    hydrogenRate = value;
}

export function getHeliumRate() {
    return heliumRate;
}

export function setHeliumRate(value) {
    heliumRate = value;
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

export function getHeliumQuantity() {
    return heliumQuantity;
}

export function setHeliumQuantity(value) {
    heliumQuantity = value;
}

export function getHydrogenStorage() {
    return hydrogenStorage;
}

export function setHydrogenStorage(value) {
    hydrogenStorage = value;
}

export function getHeliumStorage() {
    return heliumStorage;
}

export function setHeliumStorage(value) {
    heliumStorage = value;
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

export function getHeliumAB1Quantity() {
    return heliumAB1Quantity;
}

export function setHeliumAB1Quantity(value) {
    heliumAB1Quantity = value;
}
