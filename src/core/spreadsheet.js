import {$} from "@core/domWrapper";
import {Observable} from "@core/observable";
import {StoreSubscriber} from "@core/storeSubscriber";


/**
 * 
 */
export class Spreadsheet {
    /**
     * 
     * @param {string} selector
     * @param {any} options
     */
    constructor(selector, options) {
        /** @type {DomWrapper} */
        this.$el = $(selector);
        this.options = options;
        this.componentsRaw = options.components || [];
        /** @type {SpreadsheetBaseComponent[]} */
        this.components = [];
        options.observable = new Observable();
        options.subscriber = new StoreSubscriber(this.options.store);
    }

    /**
     * 
     * @return {DomWrapper}
     */
    getRoot() {
        const $root = $.create("div", "spreadsheet");
        
        this.componentsRaw.forEach((/** @type {SpreadsheetBaseComponent} */ Component) => {
            const $el = $.create("div", Component.className);
            
            const component = new Component($el, this.options);
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
        this.options.subscriber.subscribeComponents(this.components);
        this.components.forEach(x => x.init());
    }

    /**
     * 
     */
    dispose() {
        this.options.subscriber.unsubscribeFromStore();
        this.components.forEach(x => x.dispose());
    }
}
