import {SpreadsheetComponent} from "@core/spreadsheetComponent";

/**
 * 
 */
export class Header extends SpreadsheetComponent {
    static className = "spreadsheet__header";

    /**
     *
     * @param {DomWrapper} $root
     * @param {Observable} observable
     * @param {{}} options
     */
    constructor($root, observable, options) {
        super($root, observable, options);
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
