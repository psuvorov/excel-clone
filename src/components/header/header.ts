import {SpreadsheetBaseComponent} from "../spreadsheetBaseComponent";
import {DomWrapper} from "../../core/domWrapper";

/**
 * 
 */
export class Header extends SpreadsheetBaseComponent {
    
    public static readonly componentName = "header";
    public static readonly className = `spreadsheet__${Header.componentName}`;

    constructor($root: DomWrapper, options: any) {
        super($root, options);
    }

    init() {
        super.init();
    }

    public loadState(): void {
        
    }

    public toHtml(): string {
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

    private onClick(event: Event): void {
        console.log("Header: onInput", event);
    }
}
