import {$, DomWrapper} from "./domWrapper";
import {Observable} from "./observable";
import {SpreadsheetBaseComponent} from "../components/spreadsheetBaseComponent";


/**
 * 
 */
export class Spreadsheet {
    private $el: DomWrapper;
    private readonly options: any;
    private componentsRaw: any;
    private components: SpreadsheetBaseComponent[];
    
    constructor(selector: string, options: any) {
        this.$el = $(selector);
        this.options = options;
        this.componentsRaw = options.components || [];
        this.components = [];
        
        options.observable = new Observable();
    }

    
    public getRoot(): DomWrapper {
        const $root = $.create("div", "spreadsheet");
        
        this.componentsRaw.forEach((Component: any) => {
            const $el = $.create("div", Component.className);
            
            const component = new Component($el, this.options);
            $el.html(component.toHtml());
            $root.append($el);

            this.components.push(component);
        });
        
        return $root;
    }

    
    public render(): void {
        this.$el.append(this.getRoot());
        this.components.forEach(x => x.init());
    }

    
    public dispose(): void {
        this.components.forEach(x => x.dispose());
    }
}
