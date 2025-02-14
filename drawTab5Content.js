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

    if (heading === 'Star Data') {
        //create a set of collapsed rows that when expanded, show star data and if rebirthing show what buffs it will give
        //the idea is discover stars until you can no longer be arsed, but knowing they give more ascendency points (rebirth points)
        //when you reach the point you want to rebirth, you select a star and assuming you have the right technology, and resources, and antimatter, then you can rebirth on that star
        //the game will start again but you will carry antimatter and ascendency points through with you
        //the last tab will unlock after the first rebirth where we open a market allowing purchase of buffs from antimatter left over and very strong ones from ascendency points
        //these will be permanent buffs
    }
}