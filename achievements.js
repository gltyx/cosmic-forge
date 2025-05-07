import { getAchievementFlagArray, getActivatedWackyNewsEffectsArray, getAlreadySeenNewsTickerArray, getCollectedPrecipitationQuantityThisRun, getCompoundCreateDropdownRecipeText, getCurrentOptionPane, getCurrentStarSystem, getGameActiveCountTime, getMiningObject, getMultiplierPermanentResources, getStarVisionDistance, getStatRun, getTechUnlockedArray, getUnlockedResourcesArray, setAchievementFlagArray, setCompoundCreateDropdownRecipeText, setMultiplierPermanentCompounds, setMultiplierPermanentResources } from "./constantsAndGlobalVars.js";
import { getAchievementNotification, newsTickerContent, refreshAchievementTooltipDescriptions } from "./descriptions.js";
import { achievementsData, getAchievementDataObject, getResourceDataObject, getStarSystemDataObject, setAchievementDataObject, setResourceDataObject } from "./resourceDataObject.js";
import { showNotification } from "./ui.js";

export function resetAchievementsOnRebirth() {
    for (const key in achievementsData) {
        if (achievementsData[key].resetOnRebirth) {
            setAchievementDataObject(false, key, ['active']);
        }
    }
}

export const achievementFunctionsMap = {
    achievementResearchAllTechnologies,
    achievementAchieve100FusionEfficiency,
    achievementTripPower,
    achievementCollect100Precipitation,
    achievementCreateCompound,
    achievementDiscoverAsteroid,
    achievementLaunchRocket,
    achievementMineAllAntimatterAsteroid,
    achievementStudyAStar,
    achievementLaunchStarShip,
    achievementInitiateDiplomacyWithAlienRace,
    achievementBeatEnemy,
    achievementSpendAp,
    achievementPerformGalaticMarketTransaction,
    achievementLiquidateAllAssets,
    achievementRebirth,
    achievementConquerStarSystems,
    achievementSeeAllNewsTickers,
    achievementActivateAllWackyNewsTickers,
    achievementCollect100TitaniumAsPrecipitation,
    achievementDiscoverLegendaryAsteroid,
    achievementHave4RocketsMiningAntimatter,
    achievementStudyAllStarsInOneRun,
    achievementTrade10APForCash,
    achievementHave50HoursWithOnePioneer
};

export function checkForAchievements() {
    const inactiveAchievements = Object.keys(achievementsData).reduce((acc, key) => {
        if (key === 'version') return acc;
        const achievement = getAchievementDataObject(key);

        if (getCurrentOptionPane() === 'achievements') {
            const achievementElement = document.getElementById(achievement.id);
            if (achievement && achievement.active) {
                achievementElement.style.opacity = 1;
            } else if (achievement && !achievement.active) {
                achievementElement.style.opacity = 0.3;
            }
        }

        if (achievement && achievement.active === false) {
            acc[key] = achievement;
        }
        return acc;
    }, {});

    for (const [key, achievement] of Object.entries(inactiveAchievements)) {
        if (achievement.specialCondition !== false) {
            const achievementFunction = achievement.specialCondition;

            if (achievement.specialConditionArguments !== false) {
                achievementFunction(...achievement.specialConditionArguments);
            } else {
                achievementFunction();
            }
        } else {
            genericAchievementChecker(achievement);
        }
    }

    setAchievementFlagArray(null, 'empty');
}

export function genericAchievementChecker(achievement) {
    const requirementType = achievement?.requirements?.requirement1;

    switch (requirementType) {
        case 'resources':
            const resourceType = achievement.requirements.value1.type;
            const requiredQuantity = achievement?.requirements.value1.quantity;
            const currentResourceQuantity = getResourceDataObject('resources', [resourceType, 'quantity']);

            if (currentResourceQuantity >= requiredQuantity) {
                grantAchievement(achievement);
            }
            break;
        case 'unlock':
            const requiredUnlock = achievement.requirements.value1;
            if (getUnlockedResourcesArray().includes(requiredUnlock)) {
                grantAchievement(achievement);
            }
            break;
        case 'tech':
            const requiredTech = achievement.requirements.value1;

            if (getTechUnlockedArray().includes(requiredTech)) {
                grantAchievement(achievement);
            }
            break;
        case 'buildings':
            const buildingType = achievement.requirements.value1.type;
            const buildingQuantity = getResourceDataObject('buildings', ['energy', 'upgrades', buildingType, 'quantity']);

            if (buildingQuantity >= achievement.requirements.value1.quantity) {
                grantAchievement(achievement);
            }
            break;
        case 'cash':
            const requiredCash = achievement.requirements.value1.quantity;
            const currentCash = getResourceDataObject('currency', ['cash']);

            if (currentCash >= requiredCash) {
                grantAchievement(achievement);
            }
            break;
        case 'special':
            return;
    }
}

export function grantAchievement(achievement) {
    setAchievementDataObject(true, achievement.id, ['active']);
    showNotification(getAchievementNotification(achievement.notification), 'achievement', 4000, 'default');

    refreshAchievementTooltipDescriptions();
    addAchievementBonus(achievement);
}

export function addAchievementBonus(achievement) {
    const category = achievement.gives.gives1;
    const type = achievement.gives.value1?.type;
    const quantity = achievement.gives.value1?.quantity;

    switch (category) {
        case 'ascendencyPoints':
            const currentPoints = getResourceDataObject('ascendencyPoints', ['quantity']);
            setResourceDataObject(Math.floor(currentPoints + quantity), 'ascendencyPoints', ['quantity']);
            break;
        case 'multiplierPermanent':
        case 'multiplier':
            switch (type) {
                case 'createCostCompounds':
                    if (category === 'multiplierPermanent') {
                        setMultiplierPermanentCompounds(quantity);
                    }
                    const allCompounds = getResourceDataObject('compounds');

                    for (const compoundKey in allCompounds) {
                        for (let i = 1; i <= 4; i++) {
                            const ratioKey = `createsFromRatio${i}`;
                            const currentRatio = getResourceDataObject('compounds', [compoundKey, ratioKey]);

                            if (currentRatio > 0) {
                                const newRatio = Math.max(1, currentRatio * quantity);
                                setResourceDataObject(newRatio, 'compounds', [compoundKey, ratioKey]);
                            }
                        }

                        const originalCompoundText = getCompoundCreateDropdownRecipeText(compoundKey);
                        const updatedCompoundText = {};

                        for (const key of ['max', 'threeQuarters', 'twoThirds', 'half', 'oneThird']) {
                            if (originalCompoundText[key]) {
                                updatedCompoundText[key] = originalCompoundText[key];
                            }
                        }

                        const resourceShortNames = {
                            iron: 'Irn',
                            carbon: 'Crb',
                            sodium: 'Sod',
                            neon: 'Neo',
                            hydrogen: 'Hyd',
                            oxygen: 'Oxy',
                            silicon: 'Sil'
                        };

                        const quantitiesToUpdate = {
                            '50000': 50000,
                            '5000': 5000,
                            '500': 500,
                            '50': 50,
                            '5': 5,
                            '1': 1
                        };

                        const sources = [];
                        for (let i = 1; i <= 4; i++) {
                            const from = getResourceDataObject('compounds', [compoundKey, `createsFrom${i}`]);
                            const ratio = getResourceDataObject('compounds', [compoundKey, `createsFromRatio${i}`]);
                            if (from && from[0] && ratio > 0) {
                                const shortName = resourceShortNames[from[0]];
                                sources.push({ compound: shortName, ratio });
                            }
                        }

                        for (const [label, baseMultiplier] of Object.entries(quantitiesToUpdate)) {
                            const parts = sources.map(({ compound: compound, ratio }) => {
                                const amount = ratio * baseMultiplier;
                                let formatted;

                                if (amount >= 1000000) {
                                    formatted = `${(amount / 1000000).toFixed(amount % 1000000 === 0 ? 0 : 1)}M`;
                                } else if (amount >= 1000) {
                                    formatted = `${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}K`;
                                } else {
                                    formatted = Math.round(amount);
                                }

                                return `${formatted} ${compound}`;
                            });
                            updatedCompoundText[label] = {
                                value: label,
                                text: `${label} - ${parts.join(', ')}`
                            };
                        }

                        setCompoundCreateDropdownRecipeText(compoundKey, updatedCompoundText);
                    }
                    break;
                case 'allResources':
                    if (category === 'multiplierPermanent') {
                        setMultiplierPermanentResources(getMultiplierPermanentResources() + quantity);
                    }
                    const allResources = getResourceDataObject('resources');

                    for (const resourceKey in allResources) {
                        if (resourceKey === 'solar') continue;
                        for (let i = 1; i <= 4; i++) {
                            const tierKey = `tier${i}`;
                            const currentRate = getResourceDataObject('resources', [resourceKey, 'upgrades', 'autoBuyer', tierKey, 'rate']);
                            if (category === 'multiplierPermanent') {
                                setResourceDataObject(currentRate * getMultiplierPermanentResources(), 'resources', [resourceKey, 'upgrades', 'autoBuyer', tierKey, 'rate']);
                            } else {
                                setResourceDataObject(currentRate * quantity, 'resources', [resourceKey, 'upgrades', 'autoBuyer', tierKey, 'rate']);
                            }
                        }
                    }
                    break;
                case 'cash':
                    const resources = getResourceDataObject('resources');
                    for (const resourceKey in resources) {
                        const currentSaleValue = getResourceDataObject('resources', [resourceKey, 'saleValue']);
                        setResourceDataObject(currentSaleValue * quantity, 'resources', [resourceKey, 'saleValue']);
                    }

                    const compounds = getResourceDataObject('compounds');
                    for (const compoundKey in compounds) {
                        const currentSaleValue = getResourceDataObject('compounds', [compoundKey, 'saleValue']);
                        setResourceDataObject(currentSaleValue * quantity, 'compounds', [compoundKey, 'saleValue']);
                    }
                    break;
            }
            break;
        case 'cash':
            const currentCash = getResourceDataObject('currency', ['cash']);
            setResourceDataObject(Math.floor(currentCash + quantity), 'currency', ['cash']);
            break;
        case 'antimatter':
            const currentAntimatter = getResourceDataObject('antimatter', ['quantity']);
            setResourceDataObject(Math.floor(currentAntimatter + quantity), 'antimatter', ['quantity']);
            break;
    }
}

export function achievementResearchAllTechnologies() {
    const achievement = getAchievementDataObject('researchAllTechnologies');
    const allTechs = getResourceDataObject('techs');
    const unlockedTechs = getTechUnlockedArray();
    const allTechsUnlocked = Object.keys(allTechs).every(techKey => unlockedTechs.includes(techKey));

    if (allTechsUnlocked) {
        grantAchievement(achievement);
    }
}

export function achievementAchieve100FusionEfficiency() {
    const achievement = getAchievementDataObject('achieve100FusionEfficiency');
    if (getTechUnlockedArray().includes('fusionEfficiencyIII')) {
        setAchievementFlagArray('achieve100FusionEfficiency', 'remove');
        grantAchievement(achievement);
    }
}

export function achievementTripPower() {
    const achievement = getAchievementDataObject('tripPower');
    if (getAchievementFlagArray().includes('tripPower')) {
        setAchievementFlagArray('tripPower', 'remove');
        grantAchievement(achievement);
    }
}

export function achievementCollect100Precipitation() {
    const achievement = getAchievementDataObject('collect100Precipitation');
    if (getCollectedPrecipitationQuantityThisRun() >= 100) {
        grantAchievement(achievement);
    }
}


export function achievementCreateCompound() {
    let achievement;
    if (getAchievementFlagArray().includes('createSteel')) {
        achievement = getAchievementDataObject('createSteel');
        setAchievementFlagArray('createSteel', 'remove');
        grantAchievement(achievement);
    }

    if (getAchievementFlagArray().includes('createTitanium')) {
        achievement = getAchievementDataObject('createTitanium');
        setAchievementFlagArray('createTitanium', 'remove');
        grantAchievement(achievement);
    }
}

export function achievementDiscoverAsteroid() {
    const achievement = getAchievementDataObject('discoverAsteroid');
    if (getAchievementFlagArray().includes('discoverAsteroid')) {
        setAchievementFlagArray('discoverAsteroid', 'remove');
        grantAchievement(achievement);
    }
}

export function achievementLaunchRocket() {
    const achievement = getAchievementDataObject('launchRocket');
    if (getAchievementFlagArray().includes('launchRocket')) {
        setAchievementFlagArray('launchRocket', 'remove');
        grantAchievement(achievement);
    }
}

export function achievementMineAllAntimatterAsteroid() {
    const achievement = getAchievementDataObject('mineAllAntimatterAsteroid');
    if (getAchievementFlagArray().includes('mineAllAntimatterAsteroid')) {
        setAchievementFlagArray('mineAllAntimatterAsteroid', 'remove');
        grantAchievement(achievement);
    }
}

export function achievementStudyAStar(requiredDistance) {
    let achievement;
    if (getStarVisionDistance() >= requiredDistance) {
        switch (requiredDistance) {
            case 0.5:
                achievement = getAchievementDataObject('studyStar');
                break;
            case 5:
                achievement = getAchievementDataObject('studyStarMoreThan5LYAway');
                break;
            case 20:
                achievement = getAchievementDataObject('studyStarMoreThan20LYAway');
                break;
        }
        if (achievement) {
            grantAchievement(achievement);
        }
    }
}

export function achievementLaunchStarShip() {
    const achievement = getAchievementDataObject('launchStarship');
    if (getAchievementFlagArray().includes('launchStarship')) {
        setAchievementFlagArray('launchStarship', 'remove');
        grantAchievement(achievement);
    }
}

export function achievementInitiateDiplomacyWithAlienRace() {
    const achievement = getAchievementDataObject('initiateDiplomacyWithAlienRace');
    if (getAchievementFlagArray().includes('initiateDiplomacyWithAlienRace')) {
        setAchievementFlagArray('initiateDiplomacyWithAlienRace', 'remove');
        grantAchievement(achievement);
    }
}

export function achievementBeatEnemy(type) {
    const typeToIdMap = {
        bully: 'bullyEnemyIntoSubmission',
        vassalize: 'vassalizeEnemy',
        conquer: 'conquerEnemy',
        hiveMind: 'conquerHiveMindEnemy',
        belligerent: 'conquerBelligerentEnemy',
        withoutScanning: 'conquerEnemyWithoutScanning',
        unoccupied: 'settleUnoccupiedSystem',
        noLife: 'discoverSystemWithNoLife',
        settleNormal: 'settleSystem'
    };

    const achievementId = typeToIdMap[type];
    const achievement = getAchievementDataObject(achievementId);

    if (getAchievementFlagArray().includes(achievementId)) {
        setAchievementFlagArray(achievementId, 'remove');
        grantAchievement(achievement);
    }
}

export function achievementSpendAp() {
    const achievement = getAchievementDataObject('spendAP');
    if (getAchievementFlagArray().includes('spendAP')) {
        setAchievementFlagArray('spendAP', 'remove');
        grantAchievement(achievement);
    }
}

export function achievementPerformGalaticMarketTransaction() {
    const achievement = getAchievementDataObject('performGalacticMarketTransaction');
    if (getAchievementFlagArray().includes('performGalacticMarketTransaction')) {
        setAchievementFlagArray('performGalacticMarketTransaction', 'remove');
        grantAchievement(achievement);
    }
}

export function achievementLiquidateAllAssets() {
    const achievement = getAchievementDataObject('liquidateAllAssets');
    if (getAchievementFlagArray().includes('liquidateAllAssets')) {
        setAchievementFlagArray('liquidateAllAssets', 'remove');
        grantAchievement(achievement);
    }
}

export function achievementRebirth() {
    const achievement = getAchievementDataObject('rebirth');
    if (getAchievementFlagArray().includes('rebirth')) {
        setAchievementFlagArray('rebirth', 'remove');
        grantAchievement(achievement);
    }
}

export function achievementConquerStarSystems(conqueredQuantity) {
    if (getStatRun() - 1 >= conqueredQuantity) {
        switch (conqueredQuantity) {
            case 10:
                grantAchievement('conquer10StarSystems');
                break;
            case 50:
                grantAchievement('conquer50StarSystems');
                break;
        }
    }
}

export function achievementSeeAllNewsTickers() {
    const achievement = getAchievementDataObject('seeAllNewsTickers');
    const newsTickerObject = newsTickerContent;
    let totalLength = 0;

    for (const key in newsTickerObject) {
        const array = newsTickerObject[key];
        if (Array.isArray(array)) {
            totalLength += array.length;
        }
    }

    if (totalLength === getAlreadySeenNewsTickerArray().length) {
        grantAchievement(achievement);
    }
}

export function achievementActivateAllWackyNewsTickers() {
    const achievement = getAchievementDataObject('activateAllWackyNewsTickers');
    const newsTickerObject = newsTickerContent;
    const wackyArray = newsTickerObject['wackyEffects'];
    let totalLength = 0;

    if (Array.isArray(wackyArray)) {
        totalLength = wackyArray.length;
    }

    if (totalLength === getActivatedWackyNewsEffectsArray().length) {
        grantAchievement(achievement);
    }
}

export function achievementCollect100TitaniumAsPrecipitation() {
    const achievement = getAchievementDataObject('collect100TitaniumAsPrecipitation');
    const currentPrecipitationType = getStarSystemDataObject('stars', [getCurrentStarSystem(), 'precipitationType']);

    if (currentPrecipitationType === 'titanium' && getCollectedPrecipitationQuantityThisRun() >= 100) {
        grantAchievement(achievement);
    }
}

export function achievementDiscoverLegendaryAsteroid() {
    const achievement = getAchievementDataObject('discoverLegendaryAsteroid');
    if (getAchievementFlagArray().includes('discoverLegendaryAsteroid')) {
        setAchievementFlagArray('discoverLegendaryAsteroid', 'remove');
        grantAchievement(achievement);
    }
}

export function achievementHave4RocketsMiningAntimatter() {
    const achievement = getAchievementDataObject('have4RocketsMiningAntimatter');
    const miningObject = getMiningObject();

    if (Object.values(miningObject).every(value => value !== null)) {
        grantAchievement(achievement);
    }
}

export function achievementStudyAllStarsInOneRun() {
    const achievement = getAchievementDataObject('studyAllStarsInOneRun');
    if (getAchievementFlagArray().includes('studyAllStarsInOneRun')) {
        setAchievementFlagArray('studyAllStarsInOneRun', 'remove');
        grantAchievement(achievement);
    }
}

export function achievementTrade10APForCash() {
    const achievement = getAchievementDataObject('trade10APForCash');
    if (getAchievementFlagArray().includes('trade10APForCash')) {
        setAchievementFlagArray('trade10APForCash', 'remove');
        grantAchievement(achievement);
    }
}

export function achievementHave50HoursWithOnePioneer() {
    const elapsedTimeActive = getGameActiveCountTime()[0];
    const achievement = getAchievementDataObject('have50HoursWithOnePioneer');

    const fiftyHoursInMs = 50 * 60 * 60 * 1000;

    if (elapsedTimeActive >= fiftyHoursInMs) {
        grantAchievement(achievement);
    }
}
