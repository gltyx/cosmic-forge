export const resourceData = {
    resources: {
        hydrogen: {
            nameResource: 'Hydrogen',
            screenName: 'hydrogen',
            saleValue: 0.005,
            salePreviewElement: 'sellHydrogenDescription',
            quantity: 0,
            rate: 0,
            storageCapacity: 100,
            upgrades: {
                autoBuyer: {
                    tier1: { nameUpgrade: 'Hydrogen Compressor', screen: 'hydrogen', place: 'hydrogenAutoBuyer1Row', price: 65, rate: 0.01, quantity: 0, setPrice: 'hydrogenAB1Price' },
                    tier2: { nameUpgrade: 'Advanced Hydrogen Compressor', screen: 'hydrogen', place: 'hydrogenAutoBuyer2Row', price: 500, rate: 25, quantity: 0, setPrice: 'hydrogenAB2Price' },
                    tier3: { nameUpgrade: 'Industrial Hydrogen Compressor', screen: 'hydrogen', place: 'hydrogenAutoBuyer3Row', price: 2500, rate: 125, quantity: 0, setPrice: 'hydrogenAB3Price' },
                    tier4: { nameUpgrade: 'Quantum Hydrogen Compressor', screen: 'hydrogen', place: 'hydrogenAutoBuyer4Row', price: 12500, rate: 625, quantity: 0, setPrice: 'hydrogenAB4Price' }
                },
            },
            revealedBy: "",
            canFuseTech: 'hydrogenFusion',
            fuseTo1: 'helium',
            fuseToRatio1: 0.5
        },
        helium: {
            nameResource: 'Helium',
            screenName: 'helium',
            saleValue: 0.01,
            salePreviewElement: 'sellHeliumDescription',
            quantity: 0,
            rate: 0,
            storageCapacity: 100,
            upgrades: {
                autoBuyer: {
                    tier1: { nameUpgrade: 'Helium Extractor', description: 'Automatically extracts Helium at a rate of 0.01 units per second.', price: 75, rate: 0.01, quantity: 0, setPrice: 'heliumAB1Price' },
                    tier2: { nameUpgrade: 'Advanced Helium Extractor', description: 'Increases extraction rate to 0.25 units per second.', price: 575, rate: 25, quantity: 0, setPrice: 'heliumAB2Price' },
                    tier3: { nameUpgrade: 'Industrial Helium Extractor', description: 'Increases extraction rate to 1.25 units per second.', price: 2875, rate: 125, quantity: 0, setPrice: 'heliumAB3Price' },
                    tier4: { nameUpgrade: 'Quantum Helium Extractor', description: 'Maximizes extraction rate to 6.25 units per second.', price: 14375, rate: 625, quantity: 0, setPrice: 'heliumAB4Price' }
                },
            },
            revealedBy: "hydrogenFusion",
            canFuseTech: 'heliumFusion',
            fuseTo1: 'carbon',
            fuseToRatio1: 0.3
        },
        carbon: {
            nameResource: 'Carbon',
            screenName: 'carbon',
            saleValue: 0.1,
            salePreviewElement: 'sellCarbonDescription',
            quantity: 0,
            rate: 0,
            storageCapacity: 100,
            upgrades: {
                autoBuyer: {
                    tier1: { nameUpgrade: 'Carbon Extractor', description: 'Automatically extracts Carbon at a rate of 0.01 units per second.', price: 55, rate: 0.01, quantity: 0, setPrice: 'carbonAB1Price' },
                    tier2: { nameUpgrade: 'Advanced Carbon Extractor', description: 'Increases extraction rate to 0.25 units per second.', price: 425, rate: 25, quantity: 0, setPrice: 'carbonAB2Price' },
                    tier3: { nameUpgrade: 'Industrial Carbon Extractor', description: 'Increases extraction rate to 1.25 units per second.', price: 2125, rate: 125, quantity: 0, setPrice: 'carbonAB3Price' },
                    tier4: { nameUpgrade: 'Quantum Carbon Extractor', description: 'Maximizes extraction rate to 6.25 units per second.', price: 10625, rate: 625, quantity: 0, setPrice: 'carbonAB4Price' }
                },
            },
            revealedBy: "heliumFusion",
            canFuseTech: 'carbonFusion',
            fuseTo1: 'nextElement',
            fuseToRatio1: 0.5
        },
    },
    research: {
        screenName: 'research',
        quantity: 1,
        rate: 0,
        upgrades: {
            scienceKit: { requirementQty: 1, price: 5, rate: 0.003, quantity: 0, setPrice: 'scienceKitPrice' },
            scienceClub: { requirementQty: 1, price: 100, rate: 0.06, quantity: 0, setPrice: 'scienceClubPrice' },
        },
    },
    techs: {
        knowledgeSharing: { appearsAt: [0, null], price: 5 },
        fusionTheory: { appearsAt: [500, null], price: 750 },
        hydrogenFusion: { appearsAt: [750, 'fusionTheory'], price: 1500 },
    },
    currency: {
        cash: 100000,
    },
};


// FUNCTION REGISTRIES
export const functionRegistryUpgrade = {
    getUpgradeHydrogen: getUpgradeHydrogen,
    getUpgradeHelium: getUpgradeHelium,
    getUpgradeCarbon: getUpgradeCarbon,
};

// QUANTITY VARIABLES
// RESOURCES
export let hydrogenQuantity = 0;
export let heliumQuantity = 0;
export let carbonQuantity = 0;

// AUTOBUYERS
export let scienceKitQuantity = 0;
export let scienceClubQuantity = 0;
export let hydrogenAB1Quantity = 0;
export let heliumAB1Quantity = 0;
export let carbonAB1Quantity = 0;

// RATE VARIABLES
export let researchRate = 0;
export let hydrogenRate = 0;
export let heliumRate = 0;
export let carbonRate = 0;

// STORAGE VARIABLES
export let hydrogenStorage = 100;
export let heliumStorage = 100;
export let carbonStorage = 100;


//RESOURCE UPGRADE OBJECTS
export let upgradeHydrogen = {
    storage: {
        type: 'storage',
        requirementQty: 1,
        price: '',
        resource: 'hydrogen',
        checkQuantity: '',
        deduct: '',
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
        checkQuantity: '',
        deduct: '',
    },
};

export let upgradeHelium = {
    storage: {
        type: 'storage',
        requirementQty: 1,
        price: '',
        resource: 'helium',
        checkQuantity: '',
        deduct: '',
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
        checkQuantity: '',
        deduct: '',
    },
};

export let upgradeCarbon = {
    storage: {
        type: 'storage',
        requirementQty: 1,
        price: '',
        resource: 'carbon',
        checkQuantity: '',
        deduct: '',
        setPrice: null
    },
    autoBuyer: {
        type: 'autoBuyer',
        tier1: {
            price: 55, rate: 0.01, setPrice: 'carbonAB1Price'
        },
        tier2: {
            price: 425, rate: 25, setPrice: 'carbonAB2Price'
        },
        tier3: {
            price: 2125, rate: 125, setPrice: 'carbonAB3Price'
        },
        tier4: {
            price: 10625, rate: 625, setPrice: 'carbonAB4Price'
        },        
        requirementQty: 1,
        resource: 'carbon',
        checkQuantity: '',
        deduct: '',
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
            checkQuantity: '',
            deduct: '',
            setPrice: 'scienceKitPrice'
        },
        scienceClub: {
            requirementQty: 1,
            price: 100,
            rate: 0.06,
            resource: 'cash',
            checkQuantity: '',
            deduct: '',
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

export function getUpgradeCarbon(key) {
    return upgradeCarbon[key];
}

export function setUpgradeCarbon(key, tier, property, value) {
    upgradeCarbon[key][tier][property] = value;
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

export function getCarbonRate() {
    return carbonRate;
}

export function setCarbonRate(value) {
    carbonRate = value;
}

export function getResearchRate() {
    return researchRate;
}

export function setResearchRate(value) {
    researchRate = value;
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

export function getCarbonAB1Quantity() {
    return carbonAB1Quantity;
}

export function setCarbonAB1Quantity(value) {
    carbonAB1Quantity = value;
}

export function getResourceDataObject(key, subKeys) {
    let current = resourceData[key];

    if (!current) {
        console.warn(`Resource data not found for key: ${key}`);
        return undefined;
    }

    if (subKeys) {
        for (const subKey of subKeys) {
            current = current?.[subKey];
            if (current === undefined) {
                console.warn(`Missing subKey: ${subKey}`);
                return undefined;
            }
        }
    }

    return current;
}

export function setResourceDataObject(value, key, subKeys = []) {
    if (!key) {
        console.warn("Main key is required.");
        return;
    }

    let current = resourceData;
    current = current[key] || (current[key] = {});

    for (let i = 0; i < subKeys.length; i++) {
        const subKey = subKeys[i];

        if (i === subKeys.length - 1) {
            current[subKey] = value;
        } else {
            current = current[subKey] || (current[subKey] = {});
        }
    }
}




