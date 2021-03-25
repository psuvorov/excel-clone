import {$} from "@core/domWrapper";

/**
 * 
 */
export class Spreadsheet {
    /**
     * 
     * @param {string} selector
     * @param {{}} options
     */
    constructor(selector, options) {
        /** @type {DomWrapper} */
        this.$el = $(selector);

        /** @type {SpreadsheetComponent[]} */
        this.components = options.components || [];
    }


    /**
     * 
     * @return {DomWrapper}
     */
    getRoot() {
        const $root = $.create("div", "spreadsheet");
        
        this.components.forEach((/** @type {SpreadsheetComponent} */Component) => {
            const $el = $.create("div", Component.className);
            
            const component = new Component($el);
            $el.html(component.toHtml());
            $root.append($el);
        });
        
        return $root;
    }

    /**
     * 
     */
    render() {
        this.$el.append(this.getRoot());
    }
}
