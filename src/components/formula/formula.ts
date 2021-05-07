import {SpreadsheetBaseComponent} from "../spreadsheetBaseComponent";
import {EventNames} from "../../core/resources";
import {DomWrapper} from "../../core/domWrapper";

/**
 * 
 */
export class Formula extends SpreadsheetBaseComponent {
    public static readonly componentName = "formula";
    public static readonly className = `spreadsheet__${Formula.componentName}`;

    static stateProperties = {
        formulaBarText: 'formulaBarText',
    };
    
    constructor($root: DomWrapper, options: any) {
        options.listeners = ["keydown", "input"];
        super($root, options);
    }
    
    public init(): void {
        super.init();
        const $inputBar = this.$root.find(".input");
        
        this.observable.subscribe(EventNames.singleCellSelect, ({columnNumber, rowNumber, content}) => {
            if (content === null)
                content = "";
            
            $inputBar.textContent = content;
        });

        this.observable.subscribe(EventNames.cellInput, cellTextContent => {
            if (cellTextContent === null)
                cellTextContent = "";

            $inputBar.textContent = cellTextContent;
        });
    }

    public loadState(): void {
        
    }

    public dispose(): void {
        super.dispose();
        
        this.observable.dispose(EventNames.singleCellSelect);
        this.observable.dispose(EventNames.cellInput);
    }

    public toHtml(): string {
        return `<div class="info">f</div>
                <div class="input" contenteditable="true" spellcheck="false"></div>`;
    }

    private onInput(event: InputEvent): void {
        if (event.data === null) {
            event.preventDefault();
            return;
        }
        
        const inputText = (event.target as HTMLElement).textContent.trim();
        
        this.observable.notify(EventNames.formulaInput, inputText);
    }

    private onKeydown(event: KeyboardEvent): void {
        if (event.key === "Enter") {
            this.observable.notify(EventNames.selectNextCellAfterFormulaInput);
        }
    }
}
