import { generateStarfield } from './ui.js';
import { getImageUrls } from './constantsAndGlobalVars.js';

export function drawTab5Content(heading, optionContentElement) {
    const starContainer = document.querySelector('#optionContentTab5');
    generateStarfield(starContainer, 100, 80);
}