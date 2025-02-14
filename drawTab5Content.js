import { createButton, generateStarfield } from './ui.js';
import { STAR_FIELD_SEED, NUMBER_OF_STARS, getStarMapMode, setStarMapMode } from './constantsAndGlobalVars.js';

export function drawTab5Content(heading, optionContentElement) {
    if (heading === 'Star Map') {
        const headerRow = document.getElementById('headerContentTab5');
        
        headerRow.innerHTML = `
            <div id="starMapNameField" class="star-map-name-field">Star Map</div>
            <div id="starButtonContainer" class="header-button-container"></div>
        `;
        
        const starButtonContainer = headerRow.querySelector('#starButtonContainer');
        const buttons = ['Normal', 'Distance', 'In Range'];
        
        buttons.forEach(button => {
            const buttonElement = createButton(button, ['option-button', 'star-option-button'], () => { 
                document.querySelectorAll('.star-option-button').forEach(btn => {
                    btn.classList.remove('green-ready-text');
                });
    
                buttonElement.classList.add('green-ready-text');
                
                setStarMapMode(button.toLowerCase());

                const starContainer = document.querySelector('#optionContentTab5');
                starContainer.innerHTML = '';
                generateStarfield(starContainer, NUMBER_OF_STARS, STAR_FIELD_SEED, getStarMapMode());
            }, '', '', '', null, '', true, '', '');
            
            starButtonContainer.appendChild(buttonElement);

            if (buttonElement.innerHTML.toLowerCase() === getStarMapMode()) {
                buttonElement.classList.add('green-ready-text');
            }
        });
        
        const starContainer = document.querySelector('#optionContentTab5');   
        starContainer.innerHTML = '';     
        generateStarfield(starContainer, NUMBER_OF_STARS, STAR_FIELD_SEED, getStarMapMode());
    }
}