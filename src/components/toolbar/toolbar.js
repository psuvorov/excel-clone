import {SpreadsheetComponent} from "@core/spreadsheetComponent";

/**
 * 
 */
export class Toolbar extends SpreadsheetComponent {
    static className = "spreadsheet__toolbar";

    /**
     *
     * @param {DomWrapper} $root
     * @param {Observable} observable
     */
    constructor($root, observable) {
        super($root, observable, {
            name: "Toolbar",
            listeners: ["click"]
        });
    }

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

    /**
     * 
     * @param {{}} event
     */
    onClick(event) {
        console.log("Toolbar: onClick", event.target);
    }
}
