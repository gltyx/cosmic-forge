import { setCanFuelRockets, setCanTravelToAsteroids, getTechTreeData, getTimerRateRatio, deferredActions, getCanAffordDeferred, setCanAffordDeferred, setTechUnlockedArray, setTemporaryCoreTechRowsRepo, setTechTreeDrawnYet, setRenderedTechTree, setUnlockedCompoundsArray, getTechUnlockedArray, getUnlockedResourcesArray, getPlayerPhilosophy, setPlayerPhilosophy } from './constantsAndGlobalVars.js';
import { setAllCompoundsToZeroQuantity, gain, startUpdateTimersAndRates, addToResourceAllTimeStat } from './game.js';
import { setResourceDataObject, getResourceDataObject, setAutoBuyerTierLevel } from './resourceDataObject.js';
import { removeTabAttentionIfNoIndicators, createToggleSwitch, createSvgElement, createTextElement, sortTechRows, createOptionRow, createButton, showNotification, updateDescriptionRow, appendAttentionIndicator } from './ui.js';
import { techNotificationMessages } from './descriptions.js';

export function drawTab3Content(heading, optionContentElement) {
    const optionElement = document.getElementById(heading.toLowerCase().replace(/\s(.)/g, (match, group1) => group1.toUpperCase()).replace(/\s+/g, '') + 'Option');
    if (optionElement) {
        const warningIcon = optionElement.querySelector('span.attention-indicator');
        if (warningIcon && warningIcon.innerHTML.includes('⚠️')) {
            warningIcon.remove();
        }
    }
    removeTabAttentionIfNoIndicators('tab3');

    sortTechRows(true);
    if (heading === 'Research') {
        const researchScienceKitRow = createOptionRow(
            'researchScienceKitRow',
            null,
            'Science Kit:',
            createButton(`Add ${getResourceDataObject('research', ['upgrades', 'scienceKit', 'rate']) * getTimerRateRatio()} Research /s`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check'], () => {
                gain(1, 'scienceKitQuantity', 'scienceKit', false, null, 'scienceUpgrade', 'resources');
                addToResourceAllTimeStat(1, 'scienceKits');
                    deferredActions.push(() => {
                        if (getCanAffordDeferred()) {
                            startUpdateTimersAndRates('scienceKit');
                        }
                        setCanAffordDeferred(null);
                    });
            }, 'upgradeCheck', '', 'scienceUpgrade', 'scienceKit', 'cash', true, null, 'science'),
            createTextElement(`Quantity: ${getResourceDataObject('research', ['upgrades', 'scienceKit', 'quantity'])}`, 'scienceKitQuantity', ['science-building-quantity']),
            createToggleSwitch('scienceKitToggle', true, (isEnabled) => {
                setResourceDataObject(isEnabled, 'research', ['upgrades', 'scienceKit', 'active']);
            }, ['toggle-switch-spacing']),
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
                addToResourceAllTimeStat(1, 'scienceClubs');
                deferredActions.push(() => {
                    if (getCanAffordDeferred()) {
                        startUpdateTimersAndRates('scienceClub');
                    }
                    setCanAffordDeferred(null);
                });
            }, 'upgradeCheck', '', 'scienceUpgrade', 'scienceClub', 'cash', true, null, 'science'),
            createTextElement(`Quantity: ${getResourceDataObject('research', ['upgrades', 'scienceClub', 'quantity'])}`, 'scienceClubQuantity', ['science-building-quantity']),
            createToggleSwitch('scienceClubToggle', true, (isEnabled) => {
                setResourceDataObject(isEnabled, 'research', ['upgrades', 'scienceClub', 'active']);
            }, ['toggle-switch-spacing']),
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
                addToResourceAllTimeStat(1, 'scienceLabs');
                deferredActions.push(() => {
                    if (getCanAffordDeferred()) {
                        startUpdateTimersAndRates('scienceLab');
                    }
                    setCanAffordDeferred(null);
                });
            }, 'upgradeCheck', '', 'scienceUpgrade', 'scienceLab', 'cash', true, null, 'science'),
            createTextElement(`Quantity: ${getResourceDataObject('research', ['upgrades', 'scienceLab', 'quantity'])}`, 'scienceLabQuantity', ['science-building-quantity']),
            createToggleSwitch('scienceLabToggle', true, (isEnabled) => {
                setResourceDataObject(isEnabled, 'research', ['upgrades', 'scienceLab', 'active']);
            }, ['toggle-switch-spacing']),
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
                        showNotification(techNotificationMessages.knowledgeSharing, 'info', 3000, 'tech');
                        setRenderedTechTree(false);
                        appendAttentionIndicator(document.getElementById('researchOption'));
                    }, 'techUnlock', '', 'knowledgeSharing', null, 'research', true, null, 'tech'),
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
                        showNotification(techNotificationMessages.fusionTheory, 'info', 3000, 'tech');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'fusionTheory', null, 'research', true, null, 'tech'),
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
                        updateDescriptionRow('hydrogenSellRow', 'content2');
                        showNotification(techNotificationMessages.hydrogenFusion, 'info', 3000, 'tech');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'hydrogenFusion', null, 'research', true, null, 'tech'),
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
                        updateDescriptionRow('heliumSellRow', 'content2');
                        showNotification(techNotificationMessages.heliumFusion, 'info', 3000, 'tech');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'heliumFusion', null, 'research', true, null, 'tech'),
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
                        updateDescriptionRow('carbonSellRow', 'content2');
                        showNotification(techNotificationMessages.carbonFusion, 'info', 3000, 'tech');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'carbonFusion', null, 'research', true, null, 'tech'),
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
                        updateDescriptionRow('neonSellRow', 'content2');
                        showNotification(techNotificationMessages.neonFusion, 'info', 3000, 'tech');
                        setUnlockedCompoundsArray('water');
                        if (getTechUnlockedArray().includes('compounds')) {
                            appendAttentionIndicator(document.getElementById(`waterOption`));
                        }
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'neonFusion', null, 'research', true, null, 'tech'),
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
                        updateDescriptionRow('oxygenSellRow', 'content2');
                        showNotification(techNotificationMessages.oxygenFusion, 'info', 3000, 'tech');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'oxygenFusion', null, 'research', true, null, 'tech'),
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
                        updateDescriptionRow('siliconSellRow', 'content2');
                        showNotification(techNotificationMessages.siliconFusion, 'info', 3000, 'tech');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'siliconFusion', null, 'research', true, null, 'tech'),
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
                        showNotification(techNotificationMessages.nobleGasCollection, 'info', 3000, 'tech');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'nobleGasCollection', null, 'research', true, null, 'tech'),
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
                        showNotification(techNotificationMessages.glassManufacture, 'info', 3000, 'tech');
                        setUnlockedCompoundsArray('glass');
                        if (getTechUnlockedArray().includes('compounds')) {
                            appendAttentionIndicator(document.getElementById(`glassOption`));
                        }
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'glassManufacture', null, 'research', true, null, 'tech'),
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
                        showNotification(techNotificationMessages.aggregateMixing, 'info', 3000, 'tech');
                        setUnlockedCompoundsArray('concrete');
                        if (getTechUnlockedArray().includes('compounds')) {
                            appendAttentionIndicator(document.getElementById(`concreteOption`));
                        }
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'aggregateMixing', null, 'research', true, null, 'tech'),
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
                        showNotification(techNotificationMessages.neutronCapture, 'info', 3000, 'tech');
                        setUnlockedCompoundsArray('titanium');
                        if (getTechUnlockedArray().includes('compounds')) {
                            appendAttentionIndicator(document.getElementById(`titaniumOption`));
                        }
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'neutronCapture', null, 'research', true, null, 'tech'),
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
                        showNotification(techNotificationMessages.quantumComputing, 'info', 3000, 'tech');
                        setRenderedTechTree(false);
                        indicateAllResources();
                    }, 'techUnlock', '', 'quantumComputing', null, 'research', true, null, 'tech'),
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
                        showNotification(techNotificationMessages.scienceLaboratories, 'info', 3000, 'tech');
                        setRenderedTechTree(false);
                        appendAttentionIndicator(document.getElementById('researchOption'));
                    }, 'techUnlock', '', 'scienceLaboratories', null, 'research', true, null, 'tech'),
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
                        showNotification(techNotificationMessages.hydroCarbons, 'info', 3000, 'tech');
                        setUnlockedCompoundsArray('diesel');
                        if (getTechUnlockedArray().includes('compounds')) {
                            appendAttentionIndicator(document.getElementById(`dieselOption`));
                        }
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'hydroCarbons', null, 'research', true, null, 'tech'),
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
                        showNotification(techNotificationMessages.nanoTubeTechnology, 'info', 3000, 'tech');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'nanoTubeTechnology', null, 'research', true, null, 'tech'),
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
                techName: 'nanoBrokers',
                row: createOptionRow(
                    'techNanoBrokersRow',
                    null,
                    'Nano Brokers:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('nanoBrokers', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('nanoBrokers');
                        showNotification(techNotificationMessages.nanoBrokers, 'info', 3000, 'tech');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'nanoBrokers', null, 'research', true, null, 'tech'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['nanoBrokers', 'price'])} Research${getResourceDataObject('techs', ['nanoBrokers', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="nanoBrokersPrereq">${getResourceDataObject('techs', ['nanoBrokers', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'nanoBrokers',
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
                        showNotification(techNotificationMessages.stellarCartography, 'info', 3000, 'tech');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'stellarCartography', null, 'research', true, null, 'tech'),
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
                        showNotification(techNotificationMessages.basicPowerGeneration, 'info', 3000, 'tech');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'basicPowerGeneration', null, 'research', true, null, 'tech'),
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
                        showNotification(techNotificationMessages.sodiumIonPowerStorage, 'info', 3000, 'tech');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'sodiumIonPowerStorage', null, 'research', true, null, 'tech'),
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
                        showNotification(techNotificationMessages.advancedPowerGeneration, 'info', 3000, 'tech');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'advancedPowerGeneration', null, 'research', true, null, 'tech'),
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
                        showNotification(techNotificationMessages.solarPowerGeneration, 'info', 3000, 'tech');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'solarPowerGeneration', null, 'research', true, null, 'tech'),
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
                techName: 'rocketComposites',
                row: createOptionRow(
                    'techRocketCompositesRow',
                    null,
                    'Rocket Composites:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('rocketComposites', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('rocketComposites');
                        const resourceObject = getResourceDataObject('resources');
                        Object.keys(resourceObject).forEach(key => {
                            if (getResourceDataObject('resources', [key, 'upgrades', 'autoBuyer', 'normalProgression']) === true) {
                                setAutoBuyerTierLevel(key, 4, false, 'resources');
                                indicateAllResources();
                            }
                        });
                        showNotification(techNotificationMessages.rocketComposites, 'info', 3000, 'tech');
                        setRenderedTechTree(false);
                        if (!document.getElementById('tab6').innerHTML.includes('???')) {
                            appendAttentionIndicator(document.getElementById(`launchPadOption`)); 
                        }  
                        document.getElementById('launchPadOption').parentElement.parentElement.classList.remove('invisible');
                    }, 'techUnlock', '', 'rocketComposites', null, 'research', true, null, 'tech'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['rocketComposites', 'price'])} Research${getResourceDataObject('techs', ['rocketComposites', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="rocketCompositesPrereq">${getResourceDataObject('techs', ['rocketComposites', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'rocketComposites',
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
                techName: 'advancedFuels',
                row: createOptionRow(
                    'techAdvancedFuelsRow',
                    null,
                    'Advanced Fuels:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('advancedFuels', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('advancedFuels');
                        showNotification(techNotificationMessages.advancedFuels, 'info', 3000, 'tech');
                        setRenderedTechTree(false);
                        setCanFuelRockets(true);
                    }, 'techUnlock', '', 'advancedFuels', null, 'research', true, null, 'tech'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['advancedFuels', 'price'])} Research${getResourceDataObject('techs', ['advancedFuels', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="advancedFuelsPrereq">${getResourceDataObject('techs', ['advancedFuels', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'advancedFuels',
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
                techName: 'planetaryNavigation',
                row: createOptionRow(
                    'techPlanetaryNavigationRow',
                    null,
                    'Planetary Navigation:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('planetaryNavigation', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('planetaryNavigation');
                        showNotification(techNotificationMessages.planetaryNavigation, 'info', 3000, 'tech');
                        setRenderedTechTree(false);
                        setCanTravelToAsteroids(true);
                    }, 'techUnlock', '', 'planetaryNavigation', null, 'research', true, null, 'tech'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['planetaryNavigation', 'price'])} Research${getResourceDataObject('techs', ['planetaryNavigation', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="planetaryNavigationPrereq">${getResourceDataObject('techs', ['planetaryNavigation', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'planetaryNavigation',
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
                        showNotification(techNotificationMessages.compounds, 'info', 3000, 'tech');
                        setRenderedTechTree(false);
                        setAllCompoundsToZeroQuantity();
                    }, 'techUnlock', '', 'compounds', null, 'research', true, null, 'tech'),
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
                        showNotification(techNotificationMessages.steelFoundries, 'info', 3000, 'tech');
                        setUnlockedCompoundsArray('steel');
                        if (getTechUnlockedArray().includes('compounds')) {
                            appendAttentionIndicator(document.getElementById(`steelOption`));
                        }
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'steelFoundries', null, 'research', true, null, 'tech'),
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
                        showNotification(techNotificationMessages.giganticTurbines, 'info', 3000, 'tech');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'giganticTurbines', null, 'research', true, null, 'tech'),
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
                        showNotification(techNotificationMessages.atmosphericTelescopes, 'info', 3000, 'tech');
                        setRenderedTechTree(false);
                        if (!document.getElementById('tab6').innerHTML.includes('???')) {
                            appendAttentionIndicator(document.getElementById(`spaceTelescopeOption`)); 
                        } 
                    }, 'techUnlock', '', 'atmosphericTelescopes', null, 'research', true, null, 'tech'),
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
                        showNotification(techNotificationMessages.fusionEfficiencyI, 'info', 3000, 'tech');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'fusionEfficiencyI', null, 'research', true, null, 'tech'),
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
                        showNotification(techNotificationMessages.fusionEfficiencyII, 'info', 3000, 'tech');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'fusionEfficiencyII', null, 'research', true, null, 'tech'), 
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
                        showNotification(techNotificationMessages.fusionEfficiencyIII, 'info', 3000, 'tech');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'fusionEfficiencyIII', null, 'research', true, null, 'tech'),
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
            {
                techName: 'orbitalConstruction',
                row: createOptionRow(
                    'techOrbitalConstructionRow',
                    null,
                    'Orbital Construction:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('orbitalConstruction', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('orbitalConstruction');
                        showNotification(techNotificationMessages.orbitalConstruction, 'info', 3000, 'tech');
                        setRenderedTechTree(false);
                        document.getElementById('starShipOption').parentElement.parentElement.classList.remove('invisible');
                    }, 'techUnlock', '', 'orbitalConstruction', null, 'research', true, null, 'tech'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['orbitalConstruction', 'price'])} Research${getResourceDataObject('techs', ['orbitalConstruction', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="orbitalConstructionPrereq">${getResourceDataObject('techs', ['orbitalConstruction', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'orbitalConstruction',
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
                techName: 'antimatterEngines',
                row: createOptionRow(
                    'techAntimatterEnginesRow',
                    null,
                    'Antimatter Engines:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('antimatterEngines', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('antimatterEngines');
                        showNotification(techNotificationMessages.antimatterEngines, 'info', 3000, 'tech');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'antimatterEngines', null, 'research', true, null, 'tech'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['antimatterEngines', 'price'])} Research${getResourceDataObject('techs', ['antimatterEngines', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="antimatterEnginesPrereq">${getResourceDataObject('techs', ['antimatterEngines', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'antimatterEngines',
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
                techName: 'FTLTravelTheory',
                row: createOptionRow(
                    'techFTLTravelTheoryRow',
                    null,
                    'FTL Travel Theory:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('FTLTravelTheory', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('FTLTravelTheory');
                        showNotification(techNotificationMessages.FTLTravelTheory, 'info', 3000, 'tech');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'FTLTravelTheory', null, 'research', true, null, 'tech'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['FTLTravelTheory', 'price'])} Research${getResourceDataObject('techs', ['FTLTravelTheory', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="FTLTravelTheoryPrereq">${getResourceDataObject('techs', ['FTLTravelTheory', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'FTLTravelTheory',
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
                techName: 'lifeSupportSystems',
                row: createOptionRow(
                    'techLifeSupportSystemsRow',
                    null,
                    'Life Support Systems:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('lifeSupportSystems', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('lifeSupportSystems');
                        showNotification(techNotificationMessages.lifeSupportSystems, 'info', 3000, 'tech');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'lifeSupportSystems', null, 'research', true, null, 'tech'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['lifeSupportSystems', 'price'])} Research${getResourceDataObject('techs', ['lifeSupportSystems', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="lifeSupportSystemsPrereq">${getResourceDataObject('techs', ['lifeSupportSystems', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'lifeSupportSystems',
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
                techName: 'starshipFleets',
                row: createOptionRow(
                    'techStarshipFleetsRow',
                    null,
                    'Starship Fleets:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('starshipFleets', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('starshipFleets');
                        showNotification(techNotificationMessages.starshipFleets, 'info', 3000, 'tech');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'starshipFleets', null, 'research', true, null, 'tech'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['starshipFleets', 'price'])} Research${getResourceDataObject('techs', ['starshipFleets', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="starshipFleetsPrereq">${getResourceDataObject('techs', ['starshipFleets', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'starshipFleets',
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
                techName: 'stellarScanners',
                row: createOptionRow(
                    'techStellarScannersRow',
                    null,
                    'Stellar Scanners:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'tech-unlock'], (event) => {
                        gain('stellarScanners', null, 'techUnlock', 'techUnlock', false, 'techs', 'resources');
                        event.currentTarget.classList.add('unlocked-tech');
                        setTechUnlockedArray('stellarScanners');
                        showNotification(techNotificationMessages.stellarScanners, 'info', 3000, 'tech');
                        setRenderedTechTree(false);
                    }, 'techUnlock', '', 'stellarScanners', null, 'research', true, null, 'tech'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('techs', ['stellarScanners', 'price'])} Research${getResourceDataObject('techs', ['stellarScanners', 'prereqs']).filter(prereq => prereq !== null).length > 0 ? ', ' : ''}<span id="stellarScannersPrereq">${getResourceDataObject('techs', ['stellarScanners', 'prereqs']).filter(prereq => prereq !== null).join(', ') || ''}</span>`,
                    '',
                    'techUnlock',
                    'stellarScanners',
                    null,
                    'research',
                    null,
                    ['research', 'researchPoints'],
                    null,
                    null,
                    'tech'
                )
            }                                  
        ];

        rows.forEach(item => {
            const rowElement = item.row;
            if (rowElement) {
                optionContentElement.appendChild(rowElement);
            }
        });

        const container = optionContentElement;
        setTemporaryCoreTechRowsRepo(container, rows);
    }
    
    if (heading === 'Tech Tree') {
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

    if (heading === 'Philosophy') {
        const constructorRows = [
            {
                techName: 'spaceStorageTankResearch',
                row: createOptionRow(
                    'spaceStorageTankResearchRow',
                    null,
                    'Storage Research:',
                    createButton(`UNLOCK`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'philosophy-tech-unlock'], (event) => {
                        gain('spaceStorageTankResearch', null, 'techUnlockPhilosophy', 'techUnlockPhilosophy', false, 'techsPhilosophy', 'resources');
                        showNotification('ABILITY: Base storage expansion multiplier now 5x instead of 2x!', 'info', 3000, 'tech');
                    }, 'techUnlockPhilosophy', '', 'spaceStorageTankResearch', null, 'research', true, null, 'techPhilosophy'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('philosophyRepeatableTechs', ['constructor', 'spaceStorageTankResearch', 'price'])} Research`,
                    '',
                    'techUnlockPhilosophy',
                    'spaceStorageTankResearch',
                    null,
                    'research',
                    null,
                    false,
                    null,
                    null,
                    'techPhilosophy'
                )
            },
            {
                techName: 'efficientAssembly',
                row: createOptionRow(
                    'efficientAssemblyRow',
                    null,
                    'Efficient Assembly:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'philosophy-tech-unlock'], (event) => {
                        gain('efficientAssembly', null, 'techUnlockPhilosophy', 'techUnlockPhilosophy', false, 'techsPhilosophy', 'resources');
                        showNotification('Special Building costs reduced by 1%!', 'info', 3000, 'tech');
                    }, 'techUnlockPhilosophy', '', 'efficientAssembly', null, 'research', true, null, 'techPhilosophy'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('philosophyRepeatableTechs', ['constructor', 'efficientAssembly', 'price'])} Research`,
                    '',
                    'techUnlockPhilosophy',
                    'efficientAssembly',
                    null,
                    'research',
                    null,
                    false,
                    null,
                    null,
                    'techPhilosophy'
                )
            },
            {
                techName: 'laserMining',
                row: createOptionRow(
                    'laserMiningRow',
                    null,
                    'Laser Mining:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'philosophy-tech-unlock'], (event) => {
                        gain('laserMining', null, 'techUnlockPhilosophy', 'techUnlockPhilosophy', false, 'techsPhilosophy', 'resources');
                        showNotification('Resources AutoBuyers 1% cheaper!', 'info', 3000, 'tech');
                    }, 'techUnlockPhilosophy', '', 'laserMining', null, 'research', true, null, 'techPhilosophy'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('philosophyRepeatableTechs', ['constructor', 'laserMining', 'price'])} Research`,
                    '',
                    'techUnlockPhilosophy',
                    'laserMining',
                    null,
                    'research',
                    null,
                    false,
                    null,
                    null,
                    'techPhilosophy'
                )
            },
            {
                techName: 'massCompoundAssembly',
                row: createOptionRow(
                    'massCompoundAssemblyRow',
                    null,
                    'Mass Compound Assembly:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'philosophy-tech-unlock'], (event) => {
                        gain('massCompoundAssembly', null, 'techUnlockPhilosophy', 'techUnlockPhilosophy', false, 'techsPhilosophy', 'resources');
                        showNotification('Compounds recipes cheaper!', 'info', 3000, 'tech');
                    }, 'techUnlockPhilosophy', '', 'massCompoundAssembly', null, 'research', true, null, 'techPhilosophy'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('philosophyRepeatableTechs', ['constructor', 'massCompoundAssembly', 'price'])} Research`,
                    '',
                    'techUnlockPhilosophy',
                    'massCompoundAssembly',
                    null,
                    'research',
                    null,
                    false,
                    null,
                    null,
                    'techPhilosophy'
                )
            },   
            {
                techName: 'energyDrones',
                row: createOptionRow(
                    'energyDronesRow',
                    null,
                    'Energy Drones:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'philosophy-tech-unlock'], (event) => {
                        gain('energyDrones', null, 'techUnlockPhilosophy', 'techUnlockPhilosophy', false, 'techsPhilosophy', 'resources');
                        showNotification('Energy Buildings 1% cheaper!', 'info', 3000, 'tech');
                    }, 'techUnlockPhilosophy', '', 'energyDrones', null, 'research', true, null, 'techPhilosophy'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('philosophyRepeatableTechs', ['constructor', 'energyDrones', 'price'])} Research`,
                    '',
                    'techUnlockPhilosophy',
                    'energyDrones',
                    null,
                    'research',
                    null,
                    false,
                    null,
                    null,
                    'techPhilosophy'
                )
            }                                            
        ];

        const supremacistRows = [
            {
                techName: 'fleetHolograms',
                row: createOptionRow(
                    'techPhilosophyFleetHologramsRow',
                    null,
                    'Fleet Holograms:',
                    createButton(`UNLOCK`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'philosophy-tech-unlock'], (event) => {
                        gain('fleetHolograms', null, 'techUnlockPhilosophy', 'techUnlockPhilosophy', false, 'techsPhilosophy', 'resources');
                        showNotification('ABILITY: You can now always Vassalize enemies provided your fleet is 3x larger than theirs!', 'info', 3000, 'tech');
                    }, 'techUnlockPhilosophy', '', 'fleetHolograms', null, 'research', true, null, 'techPhilosophy'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('philosophyRepeatableTechs', ['supremacist', 'fleetHolograms', 'price'])} Research`,
                    '',
                    'techUnlockPhilosophy',
                    'fleetHolograms',
                    null,
                    'research',
                    null,
                    false,
                    null,
                    null,
                    'techPhilosophy'
                )
            },     
            {
                techName: 'hangarAutomation',
                row: createOptionRow(
                    'techPhilosophyHangarAutomationRow',
                    null,
                    'Hangar Automation:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'philosophy-tech-unlock'], (event) => {
                        gain('hangarAutomation', null, 'techUnlockPhilosophy', 'techUnlockPhilosophy', false, 'techsPhilosophy', 'resources');
                        showNotification('Fleet build costs reduced by 1%!', 'info', 3000, 'tech');
                    }, 'techUnlockPhilosophy', '', 'hangarAutomation', null, 'research', true, null, 'techPhilosophy'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('philosophyRepeatableTechs', ['supremacist', 'hangarAutomation', 'price'])} Research`,
                    '',
                    'techUnlockPhilosophy',
                    'hangarAutomation',
                    null,
                    'research',
                    null,
                    false,
                    null,
                    null,
                    'techPhilosophy'
                )
            },
            {
                techName: 'syntheticPlating',
                row: createOptionRow(
                    'techPhilosophySyntheticPlatingRow',
                    null,
                    'Synthetic Plating:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'philosophy-tech-unlock'], (event) => {
                        gain('syntheticPlating', null, 'techUnlockPhilosophy', 'techUnlockPhilosophy', false, 'techsPhilosophy', 'resources');
                        showNotification('Fleet Armor increased by 1%!', 'info', 3000, 'tech');
                    }, 'techUnlockPhilosophy', '', 'syntheticPlating', null, 'research', true, null, 'techPhilosophy'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('philosophyRepeatableTechs', ['supremacist', 'syntheticPlating', 'price'])} Research`,
                    '',
                    'techUnlockPhilosophy',
                    'syntheticPlating',
                    null,
                    'research',
                    null,
                    false,
                    null,
                    null,
                    'techPhilosophy'
                )
            },
            {
                techName: 'antimatterEngineMinaturization',
                row: createOptionRow(
                    'techPhilosophyAntimatterEngineMinaturizationRow',
                    null,
                    'Antimatter Engine Miniaturization:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'philosophy-tech-unlock'], (event) => {
                        gain('antimatterEngineMinaturization', null, 'techUnlockPhilosophy', 'techUnlockPhilosophy', false, 'techsPhilosophy', 'resources');
                        showNotification('Fleet Speed increased by 1%!', 'info', 3000, 'tech');
                    }, 'techUnlockPhilosophy', '', 'antimatterEngineMinaturization', null, 'research', true, null, 'techPhilosophy'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('philosophyRepeatableTechs', ['supremacist', 'antimatterEngineMinaturization', 'price'])} Research`,
                    '',
                    'techUnlockPhilosophy',
                    'antimatterEngineMinaturization',
                    null,
                    'research',
                    null,
                    false,
                    null,
                    null,
                    'techPhilosophy'
                )
            },
            {
                techName: 'laserIntensityResearch',
                row: createOptionRow(
                    'techPhilosophyLaserIntensityResearchRow',
                    null,
                    'Laser Intensity Research:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'philosophy-tech-unlock'], (event) => {
                        gain('laserIntensityResearch', null, 'techUnlockPhilosophy', 'techUnlockPhilosophy', false, 'techsPhilosophy', 'resources');
                        showNotification('Fleet Attack Power increased by 1%!', 'info', 3000, 'tech');
                    }, 'techUnlockPhilosophy', '', 'laserIntensityResearch', null, 'research', true, null, 'techPhilosophy'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('philosophyRepeatableTechs', ['supremacist', 'laserIntensityResearch', 'price'])} Research`,
                    '',
                    'techUnlockPhilosophy',
                    'laserIntensityResearch',
                    null,
                    'research',
                    null,
                    false,
                    null,
                    null,
                    'techPhilosophy'
                )
            }                   
        ];

        const voidbornRows = [
            {
                techName: 'voidSeers',
                row: createOptionRow(
                    'techPhilosophyVoidSeersRow',
                    null,
                    'Void Seers:',
                    createButton(`UNLOCK`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'philosophy-tech-unlock'], (event) => {
                        gain('voidSeers', null, 'techUnlockPhilosophy', 'techUnlockPhilosophy', false, 'techsPhilosophy', 'resources');
                        showNotification('ABILITY: Space Telescope can now scan for instant Resources and Compounds!', 'info', 3000, 'tech');
                    }, 'techUnlockPhilosophy', '', 'voidSeers', null, 'research', true, null, 'techPhilosophy'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('philosophyRepeatableTechs', ['voidborn', 'voidSeers', 'price'])} Research`,
                    '',
                    'techUnlockPhilosophy',
                    'voidSeers',
                    null,
                    'research',
                    null,
                    false,
                    null,
                    null,
                    'techPhilosophy'
                )
            }, 
            {
                techName: 'stellarWhispers',
                row: createOptionRow(
                    'techPhilosophyStellarWhispersRow',
                    null,
                    'Stellar Whispers:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'philosophy-tech-unlock'], (event) => {
                        gain('stellarWhispers', null, 'techUnlockPhilosophy', 'techUnlockPhilosophy', false, 'techsPhilosophy', 'resources');
                        showNotification('Initial Impression of enemies improved by 1%!', 'info', 3000, 'tech');
                    }, 'techUnlockPhilosophy', '', 'stellarWhispers', null, 'research', true, null, 'techPhilosophy'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('philosophyRepeatableTechs', ['voidborn', 'stellarWhispers', 'price'])} Research`,
                    '',
                    'techUnlockPhilosophy',
                    'stellarWhispers',
                    null,
                    'research',
                    null,
                    false,
                    null,
                    null,
                    'techPhilosophy'
                )
            },
            {
                techName: 'stellarInsightManifold',
                row: createOptionRow(
                    'techPhilosophyStellarInsightManifoldRow',
                    null,
                    'Stellar Insight Manifold:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'philosophy-tech-unlock'], (event) => {
                        gain('stellarInsightManifold', null, 'techUnlockPhilosophy', 'techUnlockPhilosophy', false, 'techsPhilosophy', 'resources');
                        showNotification('Star Study speed increased by 1%!', 'info', 3000, 'tech');
                    }, 'techUnlockPhilosophy', '', 'stellarInsightManifold', null, 'research', true, null, 'techPhilosophy'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('philosophyRepeatableTechs', ['voidborn', 'stellarInsightManifold', 'price'])} Research`,
                    '',
                    'techUnlockPhilosophy',
                    'stellarInsightManifold',
                    null,
                    'research',
                    null,
                    false,
                    null,
                    null,
                    'techPhilosophy'
                )
            },
            {
                techName: 'asteroidDwellers',
                row: createOptionRow(
                    'techPhilosophyAsteroidDwellersRow',
                    null,
                    'Asteroid Dwellers:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'philosophy-tech-unlock'], (event) => {
                        gain('asteroidDwellers', null, 'techUnlockPhilosophy', 'techUnlockPhilosophy', false, 'techsPhilosophy', 'resources');
                        showNotification('Asteroid Search speed increased by 1%!', 'info', 3000, 'tech');
                    }, 'techUnlockPhilosophy', '', 'asteroidDwellers', null, 'research', true, null, 'techPhilosophy'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('philosophyRepeatableTechs', ['voidborn', 'asteroidDwellers', 'price'])} Research`,
                    '',
                    'techUnlockPhilosophy',
                    'asteroidDwellers',
                    null,
                    'research',
                    null,
                    false,
                    null,
                    null,
                    'techPhilosophy'
                )
            },
            {
                techName: 'ascendencyPhilosophy',
                row: createOptionRow(
                    'techPhilosophyAscendencyPhilosophyRow',
                    null,
                    'Ascendency Philosophy:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'philosophy-tech-unlock'], (event) => {
                        gain('ascendencyPhilosophy', null, 'techUnlockPhilosophy', 'techUnlockPhilosophy', false, 'techsPhilosophy', 'resources');
                        showNotification('Base Ascendency Point gain +1!', 'info', 3000, 'tech');
                    }, 'techUnlockPhilosophy', '', 'ascendencyPhilosophy', null, 'research', true, null, 'techPhilosophy'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('philosophyRepeatableTechs', ['voidborn', 'ascendencyPhilosophy', 'price'])} Research`,
                    '',
                    'techUnlockPhilosophy',
                    'ascendencyPhilosophy',
                    null,
                    'research',
                    null,
                    false,
                    null,
                    null,
                    'techPhilosophy'
                )
            }                       
        ];

        const expansionistRows = [
            {
                techName: 'rapidExpansion',
                row: createOptionRow(
                    'techPhilosophyRapidExpansionRow',
                    null,
                    'Rapid Expansion:',
                    createButton(`UNLOCK`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'philosophy-tech-unlock'], (event) => {
                        gain('rapidExpansion', null, 'techUnlockPhilosophy', 'techUnlockPhilosophy', false, 'techsPhilosophy', 'resources');
                        showNotification('ABILITY: You now have a chance of capturing up to 3 nearby Systems for every 1!', 'info', 3000, 'tech');
                    }, 'techUnlockPhilosophy', '', 'rapidExpansion', null, 'research', true, null, 'techPhilosophy'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('philosophyRepeatableTechs', ['expansionist', 'rapidExpansion', 'price'])} Research`,
                    '',
                    'techUnlockPhilosophy',
                    'rapidExpansion',
                    null,
                    'research',
                    null,
                    false,
                    null,
                    null,
                    'techPhilosophy'
                )
            },  
            {
                techName: 'spaceElevator',
                row: createOptionRow(
                    'techPhilosophySpaceElevatorRow',
                    null,
                    'Space Elevator:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'philosophy-tech-unlock'], (event) => {
                        gain('spaceElevator', null, 'techUnlockPhilosophy', 'techUnlockPhilosophy', false, 'techsPhilosophy', 'resources');
                        showNotification('Starship Parts cost reduced by 1%!', 'info', 3000, 'tech');
                    }, 'techUnlockPhilosophy', '', 'spaceElevator', null, 'research', true, null, 'techPhilosophy'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('philosophyRepeatableTechs', ['expansionist', 'spaceElevator', 'price'])} Research`,
                    '',
                    'techUnlockPhilosophy',
                    'spaceElevator',
                    null,
                    'research',
                    null,
                    false,
                    null,
                    null,
                    'techPhilosophy'
                )
            },
            {
                techName: 'launchPadMassProduction',
                row: createOptionRow(
                    'techPhilosophyLaunchPadMassProductionRow',
                    null,
                    'Launch Pad Mass Production:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'philosophy-tech-unlock'], (event) => {
                        gain('launchPadMassProduction', null, 'techUnlockPhilosophy', 'techUnlockPhilosophy', false, 'techsPhilosophy', 'resources');
                        showNotification('Rocket Parts cost reduced by 1%!', 'info', 3000, 'tech');
                    }, 'techUnlockPhilosophy', '', 'launchPadMassProduction', null, 'research', true, null, 'techPhilosophy'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('philosophyRepeatableTechs', ['expansionist', 'launchPadMassProduction', 'price'])} Research`,
                    '',
                    'techUnlockPhilosophy',
                    'launchPadMassProduction',
                    null,
                    'research',
                    null,
                    false,
                    null,
                    null,
                    'techPhilosophy'
                )
            },
            {
                techName: 'asteroidAttractors',
                row: createOptionRow(
                    'techPhilosophyAsteroidAttractorsRow',
                    null,
                    'Asteroid Attractors:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'philosophy-tech-unlock'], (event) => {
                        gain('asteroidAttractors', null, 'techUnlockPhilosophy', 'techUnlockPhilosophy', false, 'techsPhilosophy', 'resources');
                        showNotification('Rocket Travel time reduced by 1%!', 'info', 3000, 'tech');
                    }, 'techUnlockPhilosophy', '', 'asteroidAttractors', null, 'research', true, null, 'techPhilosophy'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('philosophyRepeatableTechs', ['expansionist', 'asteroidAttractors', 'price'])} Research`,
                    '',
                    'techUnlockPhilosophy',
                    'asteroidAttractors',
                    null,
                    'research',
                    null,
                    false,
                    null,
                    null,
                    'techPhilosophy'
                )
            },
            {
                techName: 'warpDrive',
                row: createOptionRow(
                    'techPhilosophyWarpDriveRow',
                    null,
                    'Warp Drive:',
                    createButton(`Research`, ['option-button', 'red-disabled-text', 'resource-cost-sell-check', 'philosophy-tech-unlock'], (event) => {
                        gain('warpDrive', null, 'techUnlockPhilosophy', 'techUnlockPhilosophy', false, 'techsPhilosophy', 'resources');
                        showNotification('Starship Travel time reduced by 1%!', 'info', 3000, 'tech');
                    }, 'techUnlockPhilosophy', '', 'warpDrive', null, 'research', true, null, 'techPhilosophy'),
                    null,
                    null,
                    null,
                    null,
                    `${getResourceDataObject('philosophyRepeatableTechs', ['expansionist', 'warpDrive', 'price'])} Research`,
                    '',
                    'techUnlockPhilosophy',
                    'warpDrive',
                    null,
                    'research',
                    null,
                    false,
                    null,
                    null,
                    'techPhilosophy'
                )
            }                      
        ];

        let specificPhilosophyRows;

        switch (getPlayerPhilosophy()) {
            case 'constructor':
                specificPhilosophyRows = constructorRows;
                break;
            case 'supremacist':
                specificPhilosophyRows = supremacistRows;
                break;
            case 'voidborn':
                specificPhilosophyRows = voidbornRows;
                break;
            case 'expansionist':
                specificPhilosophyRows = expansionistRows;
                break;
            default: return;
        }

        specificPhilosophyRows.forEach(item => {
            const rowElement = item.row;
            if (rowElement) {
                optionContentElement.appendChild(rowElement);
            }
        });
    }
}

function indicateAllResources() {
    const resources = ['hydrogen', 'helium', 'carbon', 'neon', 'oxygen', 'sodium', 'silicon', 'iron'];

    resources.forEach(resource => {
        if (getUnlockedResourcesArray().includes(resource)) {
            const element = document.getElementById(`${resource}Option`);
            if (element) {
                appendAttentionIndicator(element);
            }
        }
    });
}

