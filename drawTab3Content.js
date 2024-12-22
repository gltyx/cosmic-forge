import { getTimerRateRatio, deferredActions, getCanAffordDeferred, setCanAffordDeferred, setTechUnlockedArray, setTechSpecificUIItemsArray, setTemporaryRowsRepo } from './constantsAndGlobalVars.js';
import { gain, startUpdateAutoBuyerTimersAndRates } from './game.js';
import { getResourceDataObject, setAutoBuyerTierLevel, getAutoBuyerTierLevel } from './resourceDataObject.js';
import { sortTechRows, createOptionRow, createButton, showNotification, updateDescriptionRow } from './ui.js';

export function drawTab3Content(heading, optionContentElement) {
    sortTechRows(true);
    if (heading === 'Research') {
        const researchScienceKitRow = createOptionRow(
            'researchScienceKitRow',
            null,
            'Science Kit:',
            createButton(`Add ${getResourceDataObject('research', ['upgrades', 'scienceKit', 'rate']) * getTimerRateRatio()} Research /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'scienceKitQuantity', 'scienceKit', false, null, 'scienceUpgrade'),
                    deferredActions.push(() => {
                        if (getCanAffordDeferred()) {
                            startUpdateAutoBuyerTimersAndRates('scienceKit');
                        }
                        setCanAffordDeferred(null);
                    });
            }, 'upgradeCheck', '', 'scienceUpgrade', 'scienceKit', 'cash', false, null),
            null,
            null,
            null,
            null,
            `${getResourceDataObject('research', ['upgrades', 'scienceKit', 'price']) + ' Research'}`,
            '',
            'upgradeCheck',
            'scienceUpgrade',
            'scienceKit',
            'cash',
            null,
            false,
            null
        );
        optionContentElement.appendChild(researchScienceKitRow);

        const researchScienceClubRow = createOptionRow(
            'researchScienceClubRow',
            null,
            'Open Science Club:',
            createButton(`Add ${getResourceDataObject('research', ['upgrades', 'scienceClub', 'rate']) * getTimerRateRatio()} Research /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'scienceClubQuantity', 'scienceClub', false, null, 'scienceUpgrade');
                deferredActions.push(() => {
                    if (getCanAffordDeferred()) {
                        startUpdateAutoBuyerTimersAndRates('scienceClub');
                    }
                    setCanAffordDeferred(null);
                });
            }, 'upgradeCheck', '', 'scienceUpgrade', 'scienceClub', 'cash', false, null),
            null,
            null,
            null,
            null,
            `${getResourceDataObject('research', ['upgrades', 'scienceClub', 'price']) + ' Research'}`,
            '',
            'upgradeCheck',
            'scienceUpgrade',
            'scienceClub',
            'cash',
            null,
            ['tech', 'knowledgeSharing'],
            null
        );
        optionContentElement.appendChild(researchScienceClubRow);
    } else if (heading === 'Tech Tree') {
        const rows = [
            {
                techName: 'knowledgeSharing',
                row: createOptionRow(
                    'techKnowledgeSharingRow',
                    null,
                    'Knowledge Sharing:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('knowledgeSharing', null, 'techUnlock', 'techUnlock', false, 'techs');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('knowledgeSharing');
                        showNotification('Knowledge Sharing Researched\n\nYou can now open Science Clubs!', 'info');
                    }, 'techUnlock', '', 'knowledgeSharing', null, 'research', false, null),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['knowledgeSharing', 'price'])} Research`,
                    '',
                    'techUnlock',
                    'knowledgeSharing',
                    null,
                    'research',
                    null,
                    false,
                    null
                )
            },
            {
                techName: 'fusionTheory',
                row: createOptionRow(
                    'techFusionTheoryRow',
                    null,
                    'Fusion Theory:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('fusionTheory', null, 'techUnlock', 'techUnlock', false, 'techs');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('fusionTheory');
                        showNotification('Fusion Theory Researched\n\nUseful for future experiments!', 'info');
                    }, 'techUnlock', '', 'fusionTheory', null, 'research', false, null),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['fusionTheory', 'price'])} Research`,
                    '',
                    'techUnlock',
                    'fusionTheory',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null
                )
            },
            {
                techName: 'hydrogenFusion',
                row: createOptionRow(
                    'techHydrogenFusionRow',
                    null,
                    'Hydrogen Fusion:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('hydrogenFusion', null, 'techUnlock', 'techUnlock', false, 'techs');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('hydrogenFusion');
                        setTechSpecificUIItemsArray('hydrogen', 'fusionButton', 'hydrogenFusion');
                        updateDescriptionRow('hydrogenSellRow', 'content2');
                        showNotification('Hydrogen Fusion Researched\n\nYou can now fuse Hydrogen!', 'info');
                    }, 'techUnlock', '', 'hydrogenFusion', null, 'research', false, null),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['hydrogenFusion', 'price'])} Research, <span id="hydrogenFusionPrereq" class="red-disabled-text">Fusion Theory</span>`,
                    '',
                    'techUnlock',
                    'hydrogenFusion',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null
                )
            },
            {
                techName: 'heliumFusion',
                row: createOptionRow(
                    'techHeliumFusionRow',
                    null,
                    'Helium Fusion:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('heliumFusion', null, 'techUnlock', 'techUnlock', false, 'techs');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('heliumFusion');
                        setTechSpecificUIItemsArray('helium', 'fusionButton', 'heliumFusion');
                        updateDescriptionRow('heliumSellRow', 'content2');
                        showNotification('Helium Fusion Researched\n\nYou can now fuse Helium!', 'info');
                    }, 'techUnlock', '', 'heliumFusion', null, 'research', false, null),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['heliumFusion', 'price'])} Research, <span id="heliumFusionPrereq" class="red-disabled-text">Hydrogen Fusion</span>`,
                    '',
                    'techUnlock',
                    'heliumFusion',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null
                )
            },
            {
                techName: 'carbonFusion',
                row: createOptionRow(
                    'techCarbonFusionRow',
                    null,
                    'Carbon Fusion:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('carbonFusion', null, 'techUnlock', 'techUnlock', false, 'techs');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('carbonFusion');
                        setTechSpecificUIItemsArray('carbon', 'fusionButton', 'carbonFusion');
                        updateDescriptionRow('carbonSellRow', 'content2');
                        showNotification('Carbon Fusion Researched\n\nYou can now fuse Carbon!', 'info');
                    }, 'techUnlock', '', 'carbonFusion', null, 'research', false, null),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['carbonFusion', 'price'])} Research, <span id="carbonFusionPrereq" class="red-disabled-text">Nano Tube Technology</span>`,
                    '',
                    'techUnlock',
                    'carbonFusion',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null
                )
            },
            {
                techName: 'quantumComputing',
                row: createOptionRow(
                    'techQuantumComputingRow',
                    null,
                    'Quantum Computing:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('quantumComputing', null, 'techUnlock', 'techUnlock', false, 'techs');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('quantumComputing');
                        const resourceObject = getResourceDataObject('resources');
                        Object.keys(resourceObject).forEach(key => {
                            if (getResourceDataObject('resources', [key, 'upgrades', 'autoBuyer', 'normalProgression']) === true) {
                                setAutoBuyerTierLevel(key, 2, false);
                            }
                        });
                        showNotification('Quantum Computing Researched\n\nMore advanced Machinery is now available!', 'info');
                    }, 'techUnlock', '', 'quantumComputing', null, 'research', false, null),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['quantumComputing', 'price'])} Research`,
                    '',
                    'techUnlock',
                    'quantumComputing',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null
                )
            },
            {
                techName: 'nanoTubeTechnology',
                row: createOptionRow(
                    'techNanoTubeTechnologyRow',
                    null,
                    'Nano Tube Technology:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('nanoTubeTechnology', null, 'techUnlock', 'techUnlock', false, 'techs');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('nanoTubeTechnology');
                        showNotification('Nano Tube Technology Researched\n\nWith this we can start to learn about how to fuse Carbon in the future!', 'info');
                    }, 'techUnlock', '', 'nanoTubeTechnology', null, 'research', false, null),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['nanoTubeTechnology', 'price'])} Research, <span id="nanoTubeTechnologyPrereq" class="red-disabled-text">Helium Fusion</span>`,
                    '',
                    'techUnlock',
                    'nanoTubeTechnology',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null
                )
            },
            {
                techName: 'stellarCartography',
                row: createOptionRow(
                    'techStellarCartographyRow',
                    null,
                    'Stellar Cartography:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('stellarCartography', null, 'techUnlock', 'techUnlock', false, 'techs');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('stellarCartography');
                        setTechSpecificUIItemsArray('tab3', 'tab3', 'stellarCartography');
                        showNotification('Stellar Cartography Researched\n\nYou unlocked The Star Map!', 'info');
                    }, 'techUnlock', '', 'stellarCartography', null, 'research', false, null),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['stellarCartography', 'price'])} Research`,
                    '',
                    'techUnlock',
                    'stellarCartography',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null
                )
            },
            {
                techName: 'fusionEfficiencyI',
                row: createOptionRow(
                    'techfusionEfficiencyIRow',
                    null,
                    'Fusion Efficiency Stage I:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('fusionEfficiencyI', null, 'techUnlock', 'techUnlock', false, 'techs');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('fusionEfficiencyI');
                        setTechSpecificUIItemsArray('', '', 'fusionEfficiencyI');
                        showNotification('Fusion Efficiency Stage I Researched\n\n20% Boost to Fusion returns!', 'info');
                    }, 'techUnlock', '', 'fusionEfficiencyI', null, 'research', false, null),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['fusionEfficiencyI', 'price'])} Research, <span id="fusionEfficiencyIPrereq" class="red-disabled-text">Fusion Theory</span>`,
                    '',
                    'techUnlock',
                    'fusionEfficiencyI',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null
                )
            },
            {
                techName: 'fusionEfficiencyII',
                row: createOptionRow(
                    'techfusionEfficiencyIIRow',
                    null,
                    'Fusion Efficiency Stage II:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('fusionEfficiencyII', null, 'techUnlock', 'techUnlock', false, 'techs');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('fusionEfficiencyII');
                        setTechSpecificUIItemsArray('', '', 'fusionEfficiencyII');
                        showNotification('Fusion Efficiency Stage II Researched\n\nFurther 20% Boost to Fusion returns!', 'info');
                    }, 'techUnlock', '', 'fusionEfficiencyII', null, 'research', false, null),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['fusionEfficiencyII', 'price'])} Research, <span id="fusionEfficiencyIIPrereq" class="red-disabled-text">Fusion Efficiency Stage I</span>`,
                    '',
                    'techUnlock',
                    'fusionEfficiencyII',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null
                )
            },
            {
                techName: 'fusionEfficiencyIII',
                row: createOptionRow(
                    'techfusionEfficiencyIIIRow',
                    null,
                    'Fusion Efficiency Stage III:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('fusionEfficiencyIII', null, 'techUnlock', 'techUnlock', false, 'techs');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('fusionEfficiencyIII');
                        setTechSpecificUIItemsArray('', '', 'fusionEfficiencyIII');
                        showNotification('Fusion Efficiency Stage III Researched\n\n100% Fusion returns!', 'info');
                    }, 'techUnlock', '', 'fusionEfficiencyIII', null, 'research', false, null),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['fusionEfficiencyIII', 'price'])} Research, <span id="fusionEfficiencyIIIPrereq" class="red-disabled-text">Fusion Efficiency Stage II</span>`,
                    '',
                    'techUnlock',
                    'fusionEfficiencyIII',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null
                )
            },
        ];

        rows.forEach(item => {
            const rowElement = item.row;
            if (rowElement) {
                optionContentElement.appendChild(rowElement);
            }
        });

        const container = optionContentElement;
        setTemporaryRowsRepo(container, rows);
    }
}
