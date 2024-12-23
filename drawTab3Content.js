import { getTimerRateRatio, deferredActions, getCanAffordDeferred, setCanAffordDeferred, setTechUnlockedArray, setTechSpecificUIItemsArray, setTemporaryRowsRepo } from './constantsAndGlobalVars.js';
import { gain, startUpdateAutoBuyerTimersAndRates } from './game.js';
import { getResourceDataObject, setAutoBuyerTierLevel, getAutoBuyerTierLevel } from './resourceDataObject.js';
import { sortTechRows, createOptionRow, createButton, showNotification, updateDescriptionRow } from './ui.js';
import { techNotificationMessages } from './descriptions.js';

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
                        showNotification(techNotificationMessages.knowledgeSharing, 'info');
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
                        showNotification(techNotificationMessages.fusionTheory, 'info');
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
                        showNotification(techNotificationMessages.hydrogenFusion, 'info');
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
                        showNotification(techNotificationMessages.heliumFusion, 'info');
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
                        showNotification(techNotificationMessages.carbonFusion, 'info');
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
                techName: 'neonFusion',
                row: createOptionRow(
                    'techNeonFusionRow',
                    null,
                    'Neon Fusion:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('neonFusion', null, 'techUnlock', 'techUnlock', false, 'techs');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('neonFusion');
                        setTechSpecificUIItemsArray('neon', 'fusionButton', 'neonFusion');
                        updateDescriptionRow('neonSellRow', 'content2');
                        showNotification(techNotificationMessages.neonFusion, 'info');
                    }, 'techUnlock', '', 'neonFusion', null, 'research', false, null),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['neonFusion', 'price'])} Research, <span id="neonFusionPrereq" class="red-disabled-text">Noble Gas Collection</span>`,
                    '',
                    'techUnlock',
                    'neonFusion',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null
                )
            },            
            {
                techName: 'oxygenFusion',
                row: createOptionRow(
                    'techOxygenFusionRow',
                    null,
                    'Oxygen Fusion:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('oxygenFusion', null, 'techUnlock', 'techUnlock', false, 'techs');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('oxygenFusion');
                        setTechSpecificUIItemsArray('oxygen', 'fusionButton', 'oxygenFusion');
                        updateDescriptionRow('oxygenSellRow', 'content2');
                        showNotification(techNotificationMessages.oxygenFusion, 'info');
                    }, 'techUnlock', '', 'oxygenFusion', null, 'research', false, null),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['oxygenFusion', 'price'])} Research, <span id="oxygenFusionPrereq" class="red-disabled-text">Neon Fusion</span>`,
                    '',
                    'techUnlock',
                    'oxygenFusion',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null
                )
            },            
            {
                techName: 'siliconFusion',
                row: createOptionRow(
                    'techSiliconFusionRow',
                    null,
                    'Silicon Fusion:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('siliconFusion', null, 'techUnlock', 'techUnlock', false, 'techs');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('siliconFusion');
                        setTechSpecificUIItemsArray('silicon', 'fusionButton', 'siliconFusion');
                        updateDescriptionRow('siliconSellRow', 'content2');
                        showNotification(techNotificationMessages.siliconFusion, 'info');
                    }, 'techUnlock', '', 'siliconFusion', null, 'research', false, null),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['siliconFusion', 'price'])} Research, <span id="siliconFusionPrereq" class="red-disabled-text">Oxygen Fusion</span>`,
                    '',
                    'techUnlock',
                    'siliconFusion',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null
                )
            },    
            {
                techName: 'nobleGasCollection',
                row: createOptionRow(
                    'techNobleGasCollectionRow',
                    null,
                    'Noble Gas Collection:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('nobleGasCollection', null, 'techUnlock', 'techUnlock', false, 'techs');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('nobleGasCollection');
                        showNotification(techNotificationMessages.nobleGasCollection, 'info');
                    }, 'techUnlock', '', 'nobleGasCollection', null, 'research', false, null),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['nobleGasCollection', 'price'])} Research, <span id="nobleGasCollectionPrereq" class="red-disabled-text">Nano Tube Technology</span>`,
                    '',
                    'techUnlock',
                    'nobleGasCollection',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null
                )
            },
            {
                techName: 'glassManufacture',
                row: createOptionRow(
                    'techGlassManufactureRow',
                    null,
                    'Glass Manufacture:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('glassManufacture', null, 'techUnlock', 'techUnlock', false, 'techs');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('glassManufacture');
                        showNotification(techNotificationMessages.glassManufacture, 'info');
                    }, 'techUnlock', '', 'glassManufacture', null, 'research', false, null),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['glassManufacture', 'price'])} Research, <span id="glassManufacturePrereq" class="red-disabled-text">Oxygen Fusion</span>`,
                    '',
                    'techUnlock',
                    'glassManufacture',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null
                )
            },
            {
                techName: 'neutronCapture',
                row: createOptionRow(
                    'techNeutronCaptureRow',
                    null,
                    'Neutron Capture:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('neutronCapture', null, 'techUnlock', 'techUnlock', false, 'techs');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('neutronCapture');
                        showNotification(techNotificationMessages.neutronCapture, 'info');
                    }, 'techUnlock', '', 'neutronCapture', null, 'research', false, null),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['neutronCapture', 'price'])} Research, <span id="neutronCapturePrereq" class="red-disabled-text">Silicon Fusion</span>`,
                    '',
                    'techUnlock',
                    'neutronCapture',
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
                        showNotification(techNotificationMessages.quantumComputing, 'info');
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
                        showNotification(techNotificationMessages.nanoTubeTechnology, 'info');
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
                        showNotification(techNotificationMessages.stellarCartography, 'info');
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
                        showNotification(techNotificationMessages.fusionEfficiencyI, 'info');
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
                        showNotification(techNotificationMessages.fusionEfficiencyII, 'info');
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
                        showNotification(techNotificationMessages.fusionEfficiencyIII, 'info');
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
