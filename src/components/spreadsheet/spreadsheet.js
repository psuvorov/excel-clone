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

        this.componentsRaw = options.components || [];
        /** @type {SpreadsheetComponent[]} */
        this.components = [];
    }

    /**
     * 
     * @return {DomWrapper}
     */
    getRoot() {
        const $root = $.create("div", "spreadsheet");
        
        this.componentsRaw.forEach((/** @type {SpreadsheetComponent} */ Component) => {
            const $el = $.create("div", Component.className);
            
            const component = new Component($el);
            $el.html(component.toHtml());
            $root.append($el);

            this.components.push(component);
        });
        
        return $root;
    }

    /**
     * 
     */
    render() {
        this.$el.append(this.getRoot());
        this.components.forEach(x => x.init());
    }
}
