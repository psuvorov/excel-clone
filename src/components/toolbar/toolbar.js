import {SpreadsheetComponent} from "@core/spreadsheetComponent";

/**
 * 
 */
export class Toolbar extends SpreadsheetComponent {
    static className = "spreadsheet__toolbar";
    
    /**
     *
     * @return {string}
     */
    toHtml() {
        return `<div class="button">
                    <i class="material-icons">format_bold</i>
                </div>
                <div class="button">
                    <i class="material-icons">format_italic</i>
                </div>
                <div class="button">
                    <i class="material-icons">format_underlined</i>
                </div>
                <div class="button">
                    <i class="material-icons">format_align_left</i>
                </div>
                <div class="button">
                    <i class="material-icons">format_align_center</i>
                </div>
                <div class="button">
                    <i class="material-icons">format_align_center</i>
                </div>`;
    }
}
