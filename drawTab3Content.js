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
            null,
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
            null,
            null
        );
        optionContentElement.appendChild(researchScienceClubRow);

        const researchScienceLabRow = createOptionRow(
            'researchScienceLabRow',
            null,
            'Open Science Lab:',
            createButton(`Add ${getResourceDataObject('research', ['upgrades', 'scienceLab', 'rate']) * getTimerRateRatio()} Research /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'scienceLabQuantity', 'scienceLab', false, null, 'scienceUpgrade');
                deferredActions.push(() => {
                    if (getCanAffordDeferred()) {
                        startUpdateAutoBuyerTimersAndRates('scienceLab');
                    }
                    setCanAffordDeferred(null);
                });
            }, 'upgradeCheck', '', 'scienceUpgrade', 'scienceLab', 'cash', false, null),
            null,
            null,
            null,
            null,
            `${getResourceDataObject('research', ['upgrades', 'scienceLab', 'price']) + ' Research'}`,
            '',
            'upgradeCheck',
            'scienceUpgrade',
            'scienceLab',
            'cash',
            null,
            ['tech', 'knowledgeSharing'], //change add new tech for scienceLabs
            null,
            null
        );
        optionContentElement.appendChild(researchScienceLabRow);

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
                    `${getResourceDataObject('techs', ['knowledgeSharing', 'price'])} Research${getResourceDataObject('techs', ['knowledgeSharing', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="knowledgeSharingPrereq">${getResourceDataObject('techs', ['knowledgeSharing', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'knowledgeSharing',
                    null,
                    'research',
                    null,
                    false,
                    null,
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
                    `${getResourceDataObject('techs', ['fusionTheory', 'price'])} Research${getResourceDataObject('techs', ['fusionTheory', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="fusionTheoryPrereq">${getResourceDataObject('techs', ['fusionTheory', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'fusionTheory',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null,
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
                    `${getResourceDataObject('techs', ['hydrogenFusion', 'price'])} Research${getResourceDataObject('techs', ['hydrogenFusion', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="hydrogenFusionPrereq">${getResourceDataObject('techs', ['hydrogenFusion', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'hydrogenFusion',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null,
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
                    `${getResourceDataObject('techs', ['heliumFusion', 'price'])} Research${getResourceDataObject('techs', ['heliumFusion', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="heliumFusionPrereq">${getResourceDataObject('techs', ['heliumFusion', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'heliumFusion',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null,
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
                    `${getResourceDataObject('techs', ['carbonFusion', 'price'])} Research${getResourceDataObject('techs', ['carbonFusion', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="carbonFusionPrereq">${getResourceDataObject('techs', ['carbonFusion', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'carbonFusion',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null,
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
                    `${getResourceDataObject('techs', ['neonFusion', 'price'])} Research${getResourceDataObject('techs', ['neonFusion', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="neonFusionPrereq">${getResourceDataObject('techs', ['neonFusion', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'neonFusion',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null,
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
                    `${getResourceDataObject('techs', ['oxygenFusion', 'price'])} Research${getResourceDataObject('techs', ['oxygenFusion', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="oxygenFusionPrereq">${getResourceDataObject('techs', ['oxygenFusion', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'oxygenFusion',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null,
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
                    `${getResourceDataObject('techs', ['siliconFusion', 'price'])} Research${getResourceDataObject('techs', ['siliconFusion', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="siliconFusionPrereq">${getResourceDataObject('techs', ['siliconFusion', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'siliconFusion',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null,
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
                    `${getResourceDataObject('techs', ['nobleGasCollection', 'price'])} Research${getResourceDataObject('techs', ['nobleGasCollection', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="nobleGasCollectionPrereq">${getResourceDataObject('techs', ['nobleGasCollection', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'nobleGasCollection',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null,
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
                    `${getResourceDataObject('techs', ['glassManufacture', 'price'])} Research${getResourceDataObject('techs', ['glassManufacture', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="glassManufacturePrereq">${getResourceDataObject('techs', ['glassManufacture', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'glassManufacture',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null,
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
                    `${getResourceDataObject('techs', ['neutronCapture', 'price'])} Research${getResourceDataObject('techs', ['neutronCapture', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="neutronCapturePrereq">${getResourceDataObject('techs', ['neutronCapture', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'neutronCapture',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null,
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
                    `${getResourceDataObject('techs', ['quantumComputing', 'price'])} Research${getResourceDataObject('techs', ['quantumComputing', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="quantumComputingPrereq">${getResourceDataObject('techs', ['quantumComputing', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'quantumComputing',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null,
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
                    `${getResourceDataObject('techs', ['nanoTubeTechnology', 'price'])} Research${getResourceDataObject('techs', ['nanoTubeTechnology', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="nanoTubeTechnologyPrereq">${getResourceDataObject('techs', ['nanoTubeTechnology', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'nanoTubeTechnology',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null,
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
                    `${getResourceDataObject('techs', ['stellarCartography', 'price'])} Research${getResourceDataObject('techs', ['stellarCartography', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="stellarCartographyPrereq">${getResourceDataObject('techs', ['stellarCartography', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'stellarCartography',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null,
                    null
                )
            },
            {
                techName: 'basicPowerGeneration',
                row: createOptionRow(
                    'techBasicPowerGenerationRow',
                    null,
                    'Basic Power Generation:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('basicPowerGeneration', null, 'techUnlock', 'techUnlock', false, 'techs');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('basicPowerGeneration');
                        setTechSpecificUIItemsArray('tab3', 'tab3', 'basicPowerGeneration');
                        showNotification(techNotificationMessages.basicPowerGeneration, 'info');
                    }, 'techUnlock', '', 'basicPowerGeneration', null, 'research', false, null),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['basicPowerGeneration', 'price'])} Research${getResourceDataObject('techs', ['basicPowerGeneration', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="basicPowerGenerationPrereq">${getResourceDataObject('techs', ['basicPowerGeneration', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'basicPowerGeneration',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null,
                    null
                )
            },
            {
                techName: 'advancedPowerGeneration',
                row: createOptionRow(
                    'techAdvancedPowerGenerationRow',
                    null,
                    'Advanced Power Generation:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('advancedPowerGeneration', null, 'techUnlock', 'techUnlock', false, 'techs');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('advancedPowerGeneration');
                        setTechSpecificUIItemsArray('tab3', 'tab3', 'advancedPowerGeneration');
                        showNotification(techNotificationMessages.advancedPowerGeneration, 'info');
                    }, 'techUnlock', '', 'advancedPowerGeneration', null, 'research', false, null),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['advancedPowerGeneration', 'price'])} Research${getResourceDataObject('techs', ['advancedPowerGeneration', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="advancedPowerGenerationPrereq">${getResourceDataObject('techs', ['advancedPowerGeneration', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'advancedPowerGeneration',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null,
                    null
                )
            },
            {
                techName: 'solarPowerGeneration',
                row: createOptionRow(
                    'techSolarPowerGenerationRow',
                    null,
                    'Solar Power Generation:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('solarPowerGeneration', null, 'techUnlock', 'techUnlock', false, 'techs');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('solarPowerGeneration');
                        setTechSpecificUIItemsArray('tab3', 'tab3', 'solarPowerGeneration');
                        showNotification(techNotificationMessages.solarPowerGeneration, 'info');
                    }, 'techUnlock', '', 'solarPowerGeneration', null, 'research', false, null),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['solarPowerGeneration', 'price'])} Research${getResourceDataObject('techs', ['solarPowerGeneration', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="solarPowerGenerationPrereq">${getResourceDataObject('techs', ['solarPowerGeneration', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'solarPowerGeneration',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null,
                    null
                )
            },
            {
                techName: 'compounds',
                row: createOptionRow(
                    'techCompoundsRow',
                    null,
                    'Compounds:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('compounds', null, 'techUnlock', 'techUnlock', false, 'techs');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('compounds');
                        setTechSpecificUIItemsArray('tab3', 'tab3', 'compounds');
                        showNotification(techNotificationMessages.compounds, 'info');
                    }, 'techUnlock', '', 'compounds', null, 'research', false, null),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['compounds', 'price'])} Research${getResourceDataObject('techs', ['compounds', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="compoundsPrereq">${getResourceDataObject('techs', ['compounds', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'compounds',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null,
                    null
                )
            },
            {
                techName: 'steelFoundries',
                row: createOptionRow(
                    'techSteelFoundriesRow',
                    null,
                    'Steel Foundries:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('steelFoundries', null, 'techUnlock', 'techUnlock', false, 'techs');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('steelFoundries');
                        setTechSpecificUIItemsArray('tab3', 'tab3', 'steelFoundries');
                        showNotification(techNotificationMessages.steelFoundries, 'info');
                    }, 'techUnlock', '', 'steelFoundries', null, 'research', false, null),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['steelFoundries', 'price'])} Research${getResourceDataObject('techs', ['steelFoundries', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="steelFoundriesPrereq">${getResourceDataObject('techs', ['steelFoundries', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'steelFoundries',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null,
                    null
                )
            },
            {
                techName: 'giganticTurbines',
                row: createOptionRow(
                    'techGiganticTurbinesRow',
                    null,
                    'Gigantic Turbines:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('giganticTurbines', null, 'techUnlock', 'techUnlock', false, 'techs');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('giganticTurbines');
                        setTechSpecificUIItemsArray('tab3', 'tab3', 'giganticTurbines');
                        showNotification(techNotificationMessages.giganticTurbines, 'info');
                    }, 'techUnlock', '', 'giganticTurbines', null, 'research', false, null),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['giganticTurbines', 'price'])} Research${getResourceDataObject('techs', ['giganticTurbines', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="giganticTurbinesPrereq">${getResourceDataObject('techs', ['giganticTurbines', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'giganticTurbines',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null,
                    null
                )
            },
            {
                techName: 'atmosphericTelescopes',
                row: createOptionRow(
                    'techAtmosphericTelescopesRow',
                    null,
                    'Atmospheric Telescopes:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('atmosphericTelescopes', null, 'techUnlock', 'techUnlock', false, 'techs');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('atmosphericTelescopes');
                        setTechSpecificUIItemsArray('tab3', 'tab3', 'atmosphericTelescopes');
                        showNotification(techNotificationMessages.atmosphericTelescopes, 'info');
                    }, 'techUnlock', '', 'atmosphericTelescopes', null, 'research', false, null),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['atmosphericTelescopes', 'price'])} Research${getResourceDataObject('techs', ['atmosphericTelescopes', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="atmosphericTelescopesPrereq">${getResourceDataObject('techs', ['atmosphericTelescopes', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'atmosphericTelescopes',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null,
                    null
                )
            },
            {
                techName: 'fusionEfficiencyI',
                row: createOptionRow(
                    'techFusionEfficiencyIRow',
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
                    `${getResourceDataObject('techs', ['fusionEfficiencyI', 'price'])} Research${getResourceDataObject('techs', ['fusionEfficiencyI', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="fusionEfficiencyIPrereq">${getResourceDataObject('techs', ['fusionEfficiencyI', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'fusionEfficiencyI',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null,
                    null
                )
            },
            {
                techName: 'fusionEfficiencyII',
                row: createOptionRow(
                    'techFusionEfficiencyIIRow',
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
                    `${getResourceDataObject('techs', ['fusionEfficiencyII', 'price'])} Research${getResourceDataObject('techs', ['fusionEfficiencyII', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="fusionEfficiencyIIPrereq">${getResourceDataObject('techs', ['fusionEfficiencyII', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'fusionEfficiencyII',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null,
                    null
                )
            },
            {
                techName: 'fusionEfficiencyIII',
                row: createOptionRow(
                    'techFusionEfficiencyIIIRow',
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
                   `${getResourceDataObject('techs', ['fusionEfficiencyIII', 'price'])} Research${getResourceDataObject('techs', ['fusionEfficiencyIII', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="fusionEfficiencyIIIPrereq">${getResourceDataObject('techs', ['fusionEfficiencyIII', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'fusionEfficiencyIII',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null,
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
