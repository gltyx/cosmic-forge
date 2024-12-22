import { generateStarfield } from './ui.js';

export function drawTab3Content(heading, optionContentElement) {
    const starContainer = document.querySelector('#optionContentTab3');
    generateStarfield(starContainer, 100, 80);
}
