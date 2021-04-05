import {SpreadsheetComponent} from "@core/spreadsheetComponent";
import {EventNames} from "@core/resources";

/**
 * 
 */
export class Formula extends SpreadsheetComponent {
    static className = "spreadsheet__formula";

    /**
     *
     * @param {DomWrapper} $root
     * @param {Observable} observable
     */
    constructor($root, observable) {
        super($root, observable, {
            name: "Formula",
            listeners: ["keydown", "input"]
        });
    }


    /**
     * 
     */
    init() {
        super.init();
        const $inputBar = this.$root.find(".input");
        
        this.observable.subscribe(EventNames.singleCellSelect, cellTextContent => {
            if (cellTextContent === null)
                cellTextContent = "";
            
            $inputBar.textContent = cellTextContent;
        });

        this.observable.subscribe(EventNames.cellInput, cellTextContent => {
            if (cellTextContent === null)
                cellTextContent = "";

            $inputBar.textContent = cellTextContent;
        });
    }

    /**
     * 
     */
    dispose() {
        super.dispose();
        this.observable.dispose(EventNames.singleCellSelect);
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
     * @param {InputEvent} event
     */
    onInput(event) {
        if (event.data === null) {
            event.preventDefault();
            return;
        }
        
        const inputText = event.target.textContent.trim();
        
        this.observable.notify(EventNames.formulaInput, inputText);
    }

    /**
     * 
     * @param {KeyboardEvent} event
     */
    onKeydown(event) {
        if (event.key === "Enter") {
            this.observable.notify(EventNames.selectNextCellAfterFormulaInput, null);
        }
    }
}
