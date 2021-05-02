import {DomListener} from "@core/domListener";
import {EventNames} from "@core/resources";

/**
 *
 */
export class SpreadsheetComponent extends DomListener {
    /**
     *
     * @param {DomWrapper} $root
     * @param {{}} options
     */
    constructor($root, options= {}) {
        super($root, options.listeners);
        this.name = options.name || '';
        this.observable = options.observable;
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
