import {SpreadsheetComponent} from "@core/spreadsheetComponent";

/**
 * 
 */
export class Formula extends SpreadsheetComponent {
    static className = "spreadsheet__formula";
    
    /**
     * 
     * @return {string}
     */
    toHtml() {
        return `<div class="info">fx</div>
                <div class="input" contenteditable="true" spellcheck="false"></div>`;
    }
}
