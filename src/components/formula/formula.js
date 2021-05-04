import {SpreadsheetBaseComponent} from "@/components/spreadsheetBaseComponent";
import {EventNames} from "@core/resources";

/**
 * 
 */
export class Formula extends SpreadsheetBaseComponent {
    static componentName = "formula";
    static className = `spreadsheet__${Formula.componentName}`;

    static stateProperties = {
        formulaBarText: 'formulaBarText',
    };
    
    /**
     *
     * @param {DomWrapper} $root
     * @param {any} options
     */
    constructor($root, options) {
        options.listeners = ["keydown", "input"];
        super($root, options);
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
    loadState() {
        super.loadState();
    }

    /**
     * 
     */
    dispose() {
        super.dispose();
        
        this.observable.dispose(EventNames.singleCellSelect);
        this.observable.dispose(EventNames.cellInput);
    }

    /**
     * 
     * @return {string}
     */
    toHtml() {
        return `<div class="info">f</div>
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
            this.observable.notify(EventNames.selectNextCellAfterFormulaInput);
        }
    }
}
