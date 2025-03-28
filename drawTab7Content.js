import { createOptionRow, createButton, showRebirthPopup, createDropdown, createTextElement, createTextFieldArea } from './ui.js';

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

    if (heading === 'Galactic Market') {
        const galacticMarketItemSelectRow = createOptionRow(
            'galacticMarketItemSelectRow',
            null,
            'Trade:',
            createDropdown('galacticMarketOutgoingStockTypeDropDown', [
                { value: 'select', text: 'Select Resource / Compound' },
                { value: 'hydrogen', text: 'Hydrogen' },
                { value: 'helium', text: 'Helium' },
                { value: 'carbon', text: 'Carbon' },
                { value: 'neon', text: 'Neon' },
                { value: 'oxygen', text: 'Oxygen' },
                { value: 'sodium', text: 'Sodium' },
                { value: 'silicon', text: 'Silicon' },
                { value: 'iron', text: 'Iron' },
                { value: 'diesel', text: 'Diesel' },
                { value: 'glass', text: 'Glass' },
                { value: 'steel', text: 'Steel' },
                { value: 'concrete', text: 'Concrete' },
                { value: 'water', text: 'Water' },
                { value: 'titanium', text: 'Titanium' }
            ], 'select', (value) => {
                //setGalacticMarketOutgoingStockType(value);
            }),
            createTextElement(`For:`, 'galacticMarketForText', '', null),
            createDropdown('galacticMarketIncomingStockTypeDropDown', [
                { value: 'select', text: 'Select Resource / Compound' },
                { value: 'hydrogen', text: 'Hydrogen' },
                { value: 'helium', text: 'Helium' },
                { value: 'carbon', text: 'Carbon' },
                { value: 'neon', text: 'Neon' },
                { value: 'oxygen', text: 'Oxygen' },
                { value: 'sodium', text: 'Sodium' },
                { value: 'silicon', text: 'Silicon' },
                { value: 'iron', text: 'Iron' },
                { value: 'diesel', text: 'Diesel' },
                { value: 'glass', text: 'Glass' },
                { value: 'steel', text: 'Steel' },
                { value: 'concrete', text: 'Concrete' },
                { value: 'water', text: 'Water' },
                { value: 'titanium', text: 'Titanium' }
            ], 'select', (value) => {
                //setGalacticMarketIncomingStockType(value);
            }),
            null,
            null,
            null,
            '',
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            'galacticMarketResourceTradeTypes',
            [true, '20%', '80%']
        );
        optionContentElement.appendChild(galacticMarketItemSelectRow);

        const galacticMarketQuantitySelectorRow = createOptionRow(
            'galacticMarketQuantitySelectorRow',
            null,
            'Quantity:',
            createDropdown('galacticMarketQuantityToTradeDropDown', [
                { value: 'select', text: 'Select Quantity' },
                { value: 'all', text: 'All Stock' },
                { value: 'enter', text: 'Enter Quantity' },
            ], 'select', (value) => {
                //setGalacticMarketOutgoingQuantitySelectionType(value);
                //setGalacticMarketOutgoingQuantitySelectionTypeDisabledStatus(value);
            }),
            createTextFieldArea('galacticMarketQuantityTextArea', ['galactic-market-textarea', 'invisible'], 'Quantity...', null),
            null,
            null,
            null,
            null,
            '',
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            'galacticMarketResourceTradeQuantity',
            [true, '20%', '80%']
        );
        optionContentElement.appendChild(galacticMarketQuantitySelectorRow);

        const galacticMarketTradeSummaryAndConfirmRow = createOptionRow(
            'galacticMarketTradeSummaryAndConfirmRow',
            null,
            'Confirm:',
            createTextElement(`Trade <span id="galacticMarketIncomingQuantityText" class="green-ready-text">999</span> <span id="galacticMarketIncomingQuantityText" class="green-ready-text">Hydrogen</span>`, 'galacticMarketSummaryOutgoing', ['galactic-market-summary-text'], null),            
            createTextElement(`for <span id="galacticMarketOutgoingQuantityText" class="green-ready-text">12</span> <span id="galacticMarketOutgoingQuantityText" class="green-ready-text">Diesel</span>`, 'galacticMarketSummaryIncoming', ['galactic-market-summary-text'], null),            
            createTextElement(`Commission: <span id="galacticMarketComissionQuantitySummaryText" class="warning-orange-text">49</span> <span id="galacticMarketComissionQuantitySummaryText" class="warning-orange-text">Hydrogen</span>`, 'galacticMarketSummaryCommission', ['galactic-market-summary-text-wide'], null),
            createButton(`CONFIRM`, ['option-button', 'red-disabled-text', 'galactic-market-confirm-trade-button'], () => {
                //galacticMarketTrade();
            }, null, null, null, null, null, true, null, 'galacticMarketTradeConfirm'),
            null,
            null,
            null,
            '',
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            'galacticMarketTradeConfirm',
            [true, '20%', '80%']
        );
        optionContentElement.appendChild(galacticMarketTradeSummaryAndConfirmRow);

        const galacticMarketSellApForCashRow = createOptionRow(
            'galacticMarketSellApForCashRow',
            null,
            'Sell AP:',
            createDropdown('galacticMarketSellApForCashDropDown', [
                { value: 'select', text: 'Select Quantity' },
                { value: '1', text: 'Sell 1 AP' },
                { value: '5', text: 'Sell 5 AP' },
                { value: '10', text: 'Sell 10 AP' },
            ], 'select', (value) => {
                //setGalacticMarketSellApForCashQuantity(value);
            }),
            createButton(`SELL`, ['option-button', 'red-disabled-text', 'galactic-market-confirm-sell-ap-button'], () => {
                //galacticMarketSellApForCash();
            }, null, null, null, null, null, true, null, 'galacticMarketSellApForCashConfirm'),
            null,
            null,
            null,
            `CASH GAIN: <span id ="galacticMarketCashGainQuantity" class="green-ready-text invisible notation">0</span>`,
            '',
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            'galacticMarketSellApForCashConfirm'
        );
        optionContentElement.appendChild(galacticMarketSellApForCashRow);

        const galacticMarketLiquidateForAPRow = createOptionRow(
            'galacticMarketLiquidateForAPRow',
            null,
            'Liquidate:',
            createDropdown('galacticMarketSellApForCashDropDown', [
                { value: 'no', text: 'I DO NOT WANT TO LIQUIDATE' },
                { value: 'yes', text: 'I WANT TO LIQUIDATE' },
            ], 'no', (value) => {
                //setGalacticMarketLiquidationAuthorization(value);
            }),
            createButton(`LIQUIDATE`, ['option-button', 'red-disabled-text', 'galactic-market-confirm-liquidate-button'], () => {
                //galacticMarketLiquidateForAp();
            }, null, null, null, null, null, true, null, 'galacticMarketLiquidateForApConfirm'),
            null,
            null,
            null,
            `AP GAIN: <span id ="galacticMarketCashGainQuantity" class="green-ready-text invisible">0</span>`, //updateDescriptionRow('galacticMarketLiquidateForAPRow', 'content2'); when user has used this up
            '',
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            'galacticMarketLiquidateForApConfirm'
        );
        optionContentElement.appendChild(galacticMarketLiquidateForAPRow);
    }

    if (heading === 'Ascendency') {
        
    }
}
