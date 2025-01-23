import { getTechTreeData, getTechUnlockedArray, getUpcomingTechArray, getTimerRateRatio, deferredActions, getCanAffordDeferred, setCanAffordDeferred, setTechUnlockedArray, setTechSpecificUIItemsArray, setTemporaryRowsRepo, setTechTreeDrawnYet, setTechRenderChange, setRenderedTechTree } from './constantsAndGlobalVars.js';
import { setAllCompoundsToZeroQuantity, gain, startUpdateTimersAndRates } from './game.js';
import { getResourceDataObject, setAutoBuyerTierLevel, getAutoBuyerTierLevel } from './resourceDataObject.js';
import { createSvgElement, createTextElement, sortTechRows, createOptionRow, createButton, showNotification, updateDescriptionRow } from './ui.js';
import { techNotificationMessages } from './descriptions.js';

export function drawTab3Content(heading, optionContentElement) {
    sortTechRows(true);
    if (heading === 'Research') {
        const researchScienceKitRow = createOptionRow(
            'researchScienceKitRow',
            null,
            'Science Kit:',
            createButton(`Add ${getResourceDataObject('research', ['upgrades', 'scienceKit', 'rate']) * getTimerRateRatio()} Research /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'scienceKitQuantity', 'scienceKit', false, null, 'scienceUpgrade', 'resources'),
                    deferredActions.push(() => {
                        if (getCanAffordDeferred()) {
                            startUpdateTimersAndRates('scienceKit');
                        }
                        setCanAffordDeferred(null);
                    });
            }, 'upgradeCheck', '', 'scienceUpgrade', 'scienceKit', 'cash', false, null, 'science'),
            createTextElement(`Quantity: ${getResourceDataObject('research', ['upgrades', 'scienceKit', 'quantity'])}`, 'scienceKitQuantity', ['science-building-quantity']),
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
            null,
            'science'
        );
        optionContentElement.appendChild(researchScienceKitRow);

        const researchScienceClubRow = createOptionRow(
            'researchScienceClubRow',
            null,
            'Open Science Club:',
            createButton(`Add ${getResourceDataObject('research', ['upgrades', 'scienceClub', 'rate']) * getTimerRateRatio()} Research /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'scienceClubQuantity', 'scienceClub', false, null, 'scienceUpgrade', 'resources');
                deferredActions.push(() => {
                    if (getCanAffordDeferred()) {
                        startUpdateTimersAndRates('scienceClub');
                    }
                    setCanAffordDeferred(null);
                });
            }, 'upgradeCheck', '', 'scienceUpgrade', 'scienceClub', 'cash', false, null, 'science'),
            createTextElement(`Quantity: ${getResourceDataObject('research', ['upgrades', 'scienceClub', 'quantity'])}`, 'scienceClubQuantity', ['science-building-quantity']),
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
            null,
            'science'
        );
        optionContentElement.appendChild(researchScienceClubRow);

        const researchScienceLabRow = createOptionRow(
            'researchScienceLabRow',
            null,
            'Open Science Lab:',
            createButton(`Add ${getResourceDataObject('research', ['upgrades', 'scienceLab', 'rate']) * getTimerRateRatio()} Research /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'scienceLabQuantity', 'scienceLab', false, null, 'scienceUpgrade', 'resources');
                deferredActions.push(() => {
                    if (getCanAffordDeferred()) {
                        startUpdateTimersAndRates('scienceLab');
                    }
                    setCanAffordDeferred(null);
                });
            }, 'upgradeCheck', '', 'scienceUpgrade', 'scienceLab', 'cash', false, null, 'science'),
            createTextElement(`Quantity: ${getResourceDataObject('research', ['upgrades', 'scienceLab', 'quantity'])}`, 'scienceLabQuantity', ['science-building-quantity']),
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
            ['tech', 'scienceLaboratories'],
            null,
            null,
            'science'
        );
        optionContentElement.appendChild(researchScienceLabRow);

    } else if (heading === 'Technology') {
        const rows = [
            {
                techName: 'knowledgeSharing',
                row: createOptionRow(
                    'techKnowledgeSharingRow',
                    null,
                    'Knowledge Sharing:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('knowledgeSharing', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('knowledgeSharing');
                        showNotification(techNotificationMessages.knowledgeSharing, 'info');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'knowledgeSharing', null, 'research', false, null, 'tech'),
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
                    null,
                    'tech'
                )
            },
            {
                techName: 'fusionTheory',
                row: createOptionRow(
                    'techFusionTheoryRow',
                    null,
                    'Fusion Theory:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('fusionTheory', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('fusionTheory');
                        showNotification(techNotificationMessages.fusionTheory, 'info');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'fusionTheory', null, 'research', false, null, 'tech'),
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
                    null,
                    'tech'
                )
            },
            {
                techName: 'hydrogenFusion',
                row: createOptionRow(
                    'techHydrogenFusionRow',
                    null,
                    'Hydrogen Fusion:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('hydrogenFusion', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('hydrogenFusion');
                        setTechSpecificUIItemsArray('hydrogen', 'fusionButton', 'hydrogenFusion');
                        updateDescriptionRow('hydrogenSellRow', 'content2');
                        showNotification(techNotificationMessages.hydrogenFusion, 'info');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'hydrogenFusion', null, 'research', false, null, 'tech'),
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
                    null,
                    'tech'
                )
            },
            {
                techName: 'heliumFusion',
                row: createOptionRow(
                    'techHeliumFusionRow',
                    null,
                    'Helium Fusion:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('heliumFusion', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('heliumFusion');
                        setTechSpecificUIItemsArray('helium', 'fusionButton', 'heliumFusion');
                        updateDescriptionRow('heliumSellRow', 'content2');
                        showNotification(techNotificationMessages.heliumFusion, 'info');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'heliumFusion', null, 'research', false, null, 'tech'),
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
                    null,
                    'tech'
                )
            },
            {
                techName: 'carbonFusion',
                row: createOptionRow(
                    'techCarbonFusionRow',
                    null,
                    'Carbon Fusion:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('carbonFusion', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('carbonFusion');
                        setTechSpecificUIItemsArray('carbon', 'fusionButton', 'carbonFusion');
                        updateDescriptionRow('carbonSellRow', 'content2');
                        showNotification(techNotificationMessages.carbonFusion, 'info');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'carbonFusion', null, 'research', false, null, 'tech'),
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
                    null,
                    'tech'
                )
            },
            {
                techName: 'neonFusion',
                row: createOptionRow(
                    'techNeonFusionRow',
                    null,
                    'Neon Fusion:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('neonFusion', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('neonFusion');
                        setTechSpecificUIItemsArray('neon', 'fusionButton', 'neonFusion');
                        updateDescriptionRow('neonSellRow', 'content2');
                        showNotification(techNotificationMessages.neonFusion, 'info');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'neonFusion', null, 'research', false, null, 'tech'),
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
                    null,
                    'tech'
                )
            },            
            {
                techName: 'oxygenFusion',
                row: createOptionRow(
                    'techOxygenFusionRow',
                    null,
                    'Oxygen Fusion:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('oxygenFusion', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('oxygenFusion');
                        setTechSpecificUIItemsArray('oxygen', 'fusionButton', 'oxygenFusion');
                        updateDescriptionRow('oxygenSellRow', 'content2');
                        showNotification(techNotificationMessages.oxygenFusion, 'info');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'oxygenFusion', null, 'research', false, null, 'tech'),
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
                    null,
                    'tech'
                )
            },            
            {
                techName: 'siliconFusion',
                row: createOptionRow(
                    'techSiliconFusionRow',
                    null,
                    'Silicon Fusion:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('siliconFusion', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('siliconFusion');
                        setTechSpecificUIItemsArray('silicon', 'fusionButton', 'siliconFusion');
                        updateDescriptionRow('siliconSellRow', 'content2');
                        showNotification(techNotificationMessages.siliconFusion, 'info');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'siliconFusion', null, 'research', false, null, 'tech'),
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
                    null,
                    'tech'
                )
            },    
            {
                techName: 'nobleGasCollection',
                row: createOptionRow(
                    'techNobleGasCollectionRow',
                    null,
                    'Noble Gas Collection:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('nobleGasCollection', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('nobleGasCollection');
                        showNotification(techNotificationMessages.nobleGasCollection, 'info');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'nobleGasCollection', null, 'research', false, null, 'tech'),
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
                    null,
                    'tech'
                )
            },
            {
                techName: 'glassManufacture',
                row: createOptionRow(
                    'techGlassManufactureRow',
                    null,
                    'Glass Manufacture:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('glassManufacture', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('glassManufacture');
                        showNotification(techNotificationMessages.glassManufacture, 'info');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'glassManufacture', null, 'research', false, null, 'tech'),
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
                    null,
                    'tech'
                )
            },
            {
                techName: 'aggregateMixing',
                row: createOptionRow(
                    'techAggregateMixingRow',
                    null,
                    'Aggregate Mixing:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('aggregateMixing', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('aggregateMixing');
                        showNotification(techNotificationMessages.aggregateMixing, 'info');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'aggregateMixing', null, 'research', false, null, 'tech'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['aggregateMixing', 'price'])} Research${getResourceDataObject('techs', ['aggregateMixing', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="aggregateMixingPrereq">${getResourceDataObject('techs', ['aggregateMixing', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'aggregateMixing',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null,
                    null,
                    'tech'
                )
            },            
            {
                techName: 'neutronCapture',
                row: createOptionRow(
                    'techNeutronCaptureRow',
                    null,
                    'Neutron Capture:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('neutronCapture', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('neutronCapture');
                        showNotification(techNotificationMessages.neutronCapture, 'info');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'neutronCapture', null, 'research', false, null, 'tech'),
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
                    null,
                    'tech'
                )
            },                               
            {
                techName: 'quantumComputing',
                row: createOptionRow(
                    'techQuantumComputingRow',
                    null,
                    'Quantum Computing:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('quantumComputing', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('quantumComputing');
                        const resourceObject = getResourceDataObject('resources');
                        Object.keys(resourceObject).forEach(key => {
                            if (getResourceDataObject('resources', [key, 'upgrades', 'autoBuyer', 'normalProgression']) === true) {
                                setAutoBuyerTierLevel(key, 2, false, 'resources');
                            }
                        });
                        showNotification(techNotificationMessages.quantumComputing, 'info');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'quantumComputing', null, 'research', false, null, 'tech'),
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
                    null,
                    'tech'
                )
            },
            {
                techName: 'scienceLaboratories',
                row: createOptionRow(
                    'techScienceLaboratoriesRow',
                    null,
                    'Science Laboratories:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('scienceLaboratories', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('scienceLaboratories');
                        showNotification(techNotificationMessages.scienceLaboratories, 'info');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'scienceLaboratories', null, 'research', false, null, 'tech'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['scienceLaboratories', 'price'])} Research${getResourceDataObject('techs', ['scienceLaboratories', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="scienceLaboratoriesPrereq">${getResourceDataObject('techs', ['scienceLaboratories', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'scienceLaboratories',
                    null,
                    'research',
                    null,
                    false,
                    null,
                    null,
                    'tech'
                )
            },
            {
                techName: 'hydroCarbons',
                row: createOptionRow(
                    'techHydroCarbonsRow',
                    null,
                    'HydroCarbons:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('hydroCarbons', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('hydroCarbons');
                        showNotification(techNotificationMessages.hydroCarbons, 'info');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'hydroCarbons', null, 'research', false, null, 'tech'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['hydroCarbons', 'price'])} Research${getResourceDataObject('techs', ['hydroCarbons', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="hydroCarbonsPrereq">${getResourceDataObject('techs', ['hydroCarbons', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'hydroCarbons',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null,
                    null,
                    'tech'
                )
            },
            {
                techName: 'nanoTubeTechnology',
                row: createOptionRow(
                    'techNanoTubeTechnologyRow',
                    null,
                    'Nano Tube Technology:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('nanoTubeTechnology', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('nanoTubeTechnology');
                        showNotification(techNotificationMessages.nanoTubeTechnology, 'info');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'nanoTubeTechnology', null, 'research', false, null, 'tech'),
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
                    null,
                    'tech'
                )
            },
            {
                techName: 'stellarCartography',
                row: createOptionRow(
                    'techStellarCartographyRow',
                    null,
                    'Stellar Cartography:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('stellarCartography', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('stellarCartography');
                        setTechSpecificUIItemsArray('tab3', 'tab3', 'stellarCartography');
                        showNotification(techNotificationMessages.stellarCartography, 'info');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'stellarCartography', null, 'research', false, null, 'tech'),
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
                    null,
                    'tech'
                )
            },
            {
                techName: 'basicPowerGeneration',
                row: createOptionRow(
                    'techBasicPowerGenerationRow',
                    null,
                    'Basic Power Generation:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('basicPowerGeneration', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('basicPowerGeneration');
                        setTechSpecificUIItemsArray('tab3', 'tab3', 'basicPowerGeneration');
                        showNotification(techNotificationMessages.basicPowerGeneration, 'info');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'basicPowerGeneration', null, 'research', false, null, 'tech'),
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
                    null,
                    'tech'
                )
            },
            {
                techName: 'sodiumIonPowerStorage',
                row: createOptionRow(
                    'techSodiumIonPowerStorageRow',
                    null,
                    'Sodium Ion Power Storage:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('sodiumIonPowerStorage', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('sodiumIonPowerStorage');
                        setTechSpecificUIItemsArray('tab3', 'tab3', 'sodiumIonPowerStorage');
                        showNotification(techNotificationMessages.sodiumIonPowerStorage, 'info');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'sodiumIonPowerStorage', null, 'research', false, null, 'tech'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['sodiumIonPowerStorage', 'price'])} Research${getResourceDataObject('techs', ['sodiumIonPowerStorage', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="sodiumIonPowerStoragePrereq">${getResourceDataObject('techs', ['sodiumIonPowerStorage', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'sodiumIonPowerStorage',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null,
                    null,
                    'tech'
                )
            },
            {
                techName: 'advancedPowerGeneration',
                row: createOptionRow(
                    'techAdvancedPowerGenerationRow',
                    null,
                    'Advanced Power Generation:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('advancedPowerGeneration', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('advancedPowerGeneration');
                        setTechSpecificUIItemsArray('tab3', 'tab3', 'advancedPowerGeneration');
                        showNotification(techNotificationMessages.advancedPowerGeneration, 'info');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'advancedPowerGeneration', null, 'research', false, null, 'tech'),
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
                    null,
                    'tech'
                )
            },
            {
                techName: 'solarPowerGeneration',
                row: createOptionRow(
                    'techSolarPowerGenerationRow',
                    null,
                    'Solar Power Generation:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('solarPowerGeneration', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('solarPowerGeneration');
                        setTechSpecificUIItemsArray('tab3', 'tab3', 'solarPowerGeneration');
                        showNotification(techNotificationMessages.solarPowerGeneration, 'info');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'solarPowerGeneration', null, 'research', false, null, 'tech'),
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
                    null,
                    'tech'
                )
            },
            {
                techName: 'compounds',
                row: createOptionRow(
                    'techCompoundsRow',
                    null,
                    'Compounds:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('compounds', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('compounds');
                        setTechSpecificUIItemsArray('tab3', 'tab3', 'compounds');
                        showNotification(techNotificationMessages.compounds, 'info');
                        setRenderedTechTree(false);
                        setAllCompoundsToZeroQuantity();
                    }, 'techUnlock', '', 'compounds', null, 'research', false, null, 'tech'),
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
                    null,
                    'tech'
                )
            },
            {
                techName: 'steelFoundries',
                row: createOptionRow(
                    'techSteelFoundriesRow',
                    null,
                    'Steel Foundries:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('steelFoundries', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('steelFoundries');
                        setTechSpecificUIItemsArray('tab3', 'tab3', 'steelFoundries');
                        showNotification(techNotificationMessages.steelFoundries, 'info');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'steelFoundries', null, 'research', false, null, 'tech'),
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
                    null,
                    'tech'
                )
            },
            {
                techName: 'giganticTurbines',
                row: createOptionRow(
                    'techGiganticTurbinesRow',
                    null,
                    'Gigantic Turbines:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('giganticTurbines', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('giganticTurbines');
                        setTechSpecificUIItemsArray('tab3', 'tab3', 'giganticTurbines');
                        showNotification(techNotificationMessages.giganticTurbines, 'info');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'giganticTurbines', null, 'research', false, null, 'tech'),
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
                    null,
                    'tech'
                )
            },
            {
                techName: 'atmosphericTelescopes',
                row: createOptionRow(
                    'techAtmosphericTelescopesRow',
                    null,
                    'Atmospheric Telescopes:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('atmosphericTelescopes', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('atmosphericTelescopes');
                        setTechSpecificUIItemsArray('tab3', 'tab3', 'atmosphericTelescopes');
                        showNotification(techNotificationMessages.atmosphericTelescopes, 'info');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'atmosphericTelescopes', null, 'research', false, null, 'tech'),
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
                    null,
                    'tech'
                )
            },
            {
                techName: 'fusionEfficiencyI',
                row: createOptionRow(
                    'techFusionEfficiencyIRow',
                    null,
                    'Fusion Efficiency I:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('fusionEfficiencyI', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('fusionEfficiencyI');
                        setTechSpecificUIItemsArray('', '', 'fusionEfficiencyI');
                        showNotification(techNotificationMessages.fusionEfficiencyI, 'info');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'fusionEfficiencyI', null, 'research', false, null, 'tech'),
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
                    null,
                    'tech'
                )
            },
            {
                techName: 'fusionEfficiencyII',
                row: createOptionRow(
                    'techFusionEfficiencyIIRow',
                    null,
                    'Fusion Efficiency II:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('fusionEfficiencyII', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('fusionEfficiencyII');
                        setTechSpecificUIItemsArray('', '', 'fusionEfficiencyII');
                        showNotification(techNotificationMessages.fusionEfficiencyII, 'info');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'fusionEfficiencyII', null, 'research', false, null, 'tech'), 
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
                    null,
                    'tech'
                )
            },
            {
                techName: 'fusionEfficiencyIII',
                row: createOptionRow(
                    'techFusionEfficiencyIIIRow',
                    null,
                    'Fusion Efficiency III:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('fusionEfficiencyIII', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('fusionEfficiencyIII');
                        setTechSpecificUIItemsArray('', '', 'fusionEfficiencyIII');
                        showNotification(techNotificationMessages.fusionEfficiencyIII, 'info');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'fusionEfficiencyIII', null, 'research', false, null, 'tech'),
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
                    null,
                    'tech'
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
    }if (heading === 'Tech Tree') {
        const techTreeSvgRow = createOptionRow(
            'techTreeSvgRow',
            null,
            '',
            createSvgElement('techTreeSvg', '100%', '700px', ['tech-tree-svg']),
            null,
            null,
            null,
            null,
            '',
            '',
            'techTreeRender',
            '',
            '',
            '',
            null,
            false,
            null,
            null,
            'tech-tree',
            [true, 'invisible', '100%']
        );
    
        optionContentElement.appendChild(techTreeSvgRow);

        const tooltip = document.getElementById('techTreeTooltip');
        if (tooltip) {
            tooltip.remove();
        }
        getTechTreeData(false);
        setTechTreeDrawnYet(true);   

    }    
}
