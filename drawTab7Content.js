import { createOptionRow, createButton, showRebirthPopup } from './ui.js';

export function drawTab7Content(heading, optionContentElement) {
    if (heading === 'Rebirth') {
    
            const rebirthRow = createOptionRow(
                'rebirthRow',
                null,
                'Rebirth:',
                createButton(`REBIRTH`, ['option-button', 'red-disabled-text', 'rebirth-check'], () => {
                    showRebirthPopup();
                }, null, null, null, null, null, true, null, 'rebirth'),
                null,
                null,
                null,
                null,
                `RESET ALL PROGRESS AND KEEP AWARDED AP`,
                '',
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                'rebirth'
            );
            optionContentElement.appendChild(rebirthRow);
        }
}
