import {DomListener} from "@core/domListener";

/**
 *
 */
export class SpreadsheetBaseComponent extends DomListener {
    /**
     *
     * @param {DomWrapper} $root
     * @param {{}} options
     */
    constructor($root, options= {}) {
        super($root, options.listeners);
        this.name = options.name || '';
        this.observable = options.observable;
        this.subscribedTo = options.subscribedTo || [];
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
     * @param {any} changes
     */
    storeChanged(changes) {
        
    }

    /**
     * 
     */
    dispose() {
       this.removeDomListeners();
    }
}
