import { generateStarfield } from './ui.js';

export function drawTab5Content(heading, optionContentElement) {

    if (heading === 'Star Map') {
        const starContainer = document.querySelector('#optionContentTab5');
        generateStarfield(starContainer, 100, 80);
    }
}