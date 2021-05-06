import {DomListener} from "../core/domListener";

/**
 *
 */
export class SpreadsheetBaseComponent extends DomListener {
    protected observable: any;
    protected store: any;
    protected options: any;
    
    
    constructor($root, options: any= {}) {
        super($root, options.listeners);
        this.name = options.name || '';
        this.observable = options.observable;
        //this.subscribedTo = options.subscribedTo || [];
        this.store = options.store;
        // TODO: make it accessible as a one single object 
        this.options = options;
    }

    /**
     * 
     * @return {string}
     */
    toHtml() {
        return "";
    }

    /**
     * 
     */
    init() {
        this.initDomListeners();
        this.loadState();
    }

    /**
     * 
     */
    loadState() {
        
    }

    /**
     * 
     */
    dispose() {
       this.removeDomListeners();
    }
}
