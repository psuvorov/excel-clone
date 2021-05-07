import {DomListener} from "../core/domListener";
import {Observable} from "../core/observable";

export abstract class SpreadsheetBaseComponent extends DomListener {
    
    protected observable: Observable;
    protected store: any;
    protected options: any;
    
    protected constructor($root, options: any= {}) {
        super($root, options.listeners);
        
        this.name = options.name || '';
        this.observable = options.observable;
        //this.subscribedTo = options.subscribedTo || [];
        this.store = options.store;
        // TODO: make it accessible as a one single object 
        this.options = options;
    }

    protected abstract toHtml(): string;

    public init(): void {
        this.initDomListeners();
        this.loadState();
    }

    protected abstract loadState(): void

    public dispose(): void {
       this.removeDomListeners();
    }
}
