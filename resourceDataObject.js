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
                    tier1: { nameUpgrade: 'Helium Extractor', screen: 'helium', place: 'heliumAutoBuyer1Row', price: 75, rate: 0.01, quantity: 0, setPrice: 'heliumAB1Price' },
                    tier2: { nameUpgrade: 'Advanced Helium Extractor', screen: 'helium', place: 'heliumAutoBuyer2Row', price: 575, rate: 25, quantity: 0, setPrice: 'heliumAB2Price' },
                    tier3: { nameUpgrade: 'Industrial Helium Extractor', screen: 'helium', place: 'heliumAutoBuyer3Row', price: 2875, rate: 125, quantity: 0, setPrice: 'heliumAB3Price' },
                    tier4: { nameUpgrade: 'Quantum Helium Extractor', screen: 'helium', place: 'heliumAutoBuyer4Row', price: 14375, rate: 625, quantity: 0, setPrice: 'heliumAB4Price' }
                }
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
                    tier1: { nameUpgrade: 'Burner', screen: 'carbon', place: 'carbonAutoBuyer1Row', price: 55, rate: 0.01, quantity: 0, setPrice: 'carbonAB1Price' },
                    tier2: { nameUpgrade: 'Advanced Carbon Extractor', screen: 'carbon', place: 'carbonAutoBuyer2Row', price: 425, rate: 25, quantity: 0, setPrice: 'carbonAB2Price' },
                    tier3: { nameUpgrade: 'Industrial Carbon Extractor', screen: 'carbon', place: 'carbonAutoBuyer3Row', price: 2125, rate: 125, quantity: 0, setPrice: 'carbonAB3Price' },
                    tier4: { nameUpgrade: 'Quantum Carbon Extractor', screen: 'carbon', place: 'carbonAutoBuyer4Row', price: 10625, rate: 625, quantity: 0, setPrice: 'carbonAB4Price' }
                }
            },
            revealedBy: "heliumFusion",
            canFuseTech: 'carbonFusion',
            fuseTo1: 'nextElement',
            fuseToRatio1: 0.5
        },
    },
    research: {
        screenName: 'research',
        quantity: 100,
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
        fusionEfficiencyI: { appearsAt: [1000, null], price: 2000 },
        fusionEfficiencyII: { appearsAt: [1000, null], price: 2000 },
        fusionEfficiencyIII: { appearsAt: [1000, null], price: 2000 },
    },
    currency: {
        cash: 100000,
    },
};

//----------------------------------------------------------------------------------------------------------
//GETTER SETTERS

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