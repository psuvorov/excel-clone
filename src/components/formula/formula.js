import {SpreadsheetComponent} from "@core/spreadsheetComponent";

/**
 * 
 */
export class Formula extends SpreadsheetComponent {
    static className = "spreadsheet__formula";

    /**
     * 
     * @param {DomWrapper} $root
     */
    constructor($root) {
        super($root, {
            name: "Formula",
            listeners: ['input', 'click']
        });
    }

    /**
     * 
     * @return {string}
     */
    toHtml() {
        return `<div class="info">fx</div>
                <div class="input" contenteditable="true" spellcheck="false"></div>`;
    }

    /**
     * 
     * @param {{}} event
     */
    onInput(event) {
        
    }

    /**
     * @param {{}} event 
     */
    onClick(event) {
        
    }
}
