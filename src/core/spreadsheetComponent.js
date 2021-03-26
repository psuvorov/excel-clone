import {DomListener} from "@core/domListener";

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
    }

    /**
     * 
     */
    dispose() {
       this.removeDomListeners();
    }
}
