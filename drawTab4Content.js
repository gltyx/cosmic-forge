import { generateStarfield } from './ui.js';

export function drawTab4Content(heading, optionContentElement) {
    const starContainer = document.querySelector('#optionContentTab4');
    generateStarfield(starContainer, 100, 80);
}
