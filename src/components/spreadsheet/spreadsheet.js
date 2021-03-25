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
        /** @type {HTMLElement} */
        this.$el = document.querySelector(selector);

        /** @type {SpreadsheetComponent[]} */
        this.components = options.components || [];
    }

    /**
     * 
     * @return {HTMLDivElement}
     */
    getRoot() {
        const $root = document.createElement("div");
        
        this.components.forEach((Component) => {
            const component = new Component();
            $root.insertAdjacentHTML("beforeend", component.toHtml());
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
