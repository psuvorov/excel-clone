import {SpreadsheetBaseComponent} from "@/components/spreadsheetBaseComponent";

/**
 * 
 */
export class Header extends SpreadsheetBaseComponent {
    static className = "spreadsheet__header";

    /**
     *
     * @param {DomWrapper} $root
     * @param {{}} options
     */
    constructor($root, options) {
        super($root, options);
    }

    /**
     *
     */
    loadState() {
        super.loadState();
    }

    /**
     *
     * @return {string}
     */
    toHtml() {
        return `<input type="text" class="input" value="New spreadsheet" />
                <div>
                    <div class="button">
                        <i class="material-icons">delete</i>
                    </div>
                    <div class="button">
                        <i class="material-icons">exit_to_app</i>
                    </div>
                </div>`;
    }

    /**
     * 
     * @param {{}} event
     */
    onClick(event) {
        console.log("Header: onInput", event);
    }
}
