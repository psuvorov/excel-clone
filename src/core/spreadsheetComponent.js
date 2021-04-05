import {DomListener} from "@core/domListener";
import {EventNames} from "@core/resources";

/**
 *
 */
export class SpreadsheetComponent extends DomListener {
    /**
     *
     * @param {DomWrapper} $root
     * @param {Observable} observable
     * @param {{}} options
     */
    constructor($root, observable, options= {}) {
        super($root, options.listeners);
        this.name = options.name || '';
        this.observable = observable;
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
