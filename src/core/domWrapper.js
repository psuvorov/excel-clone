/**
 * 
 */
class DomWrapper {
    /**
     * @param {string | HTMLElement | EventTarget} queryObject
     */
    constructor(queryObject) {
        this.$nativeElement = typeof(queryObject) === "string" ? document.querySelector(queryObject) : queryObject;
    }

    /**
     * 
     * @param {string} html
     * @return {DomWrapper}
     */
    html(html ) {
        if (typeof(html) === "string") {
            this.$nativeElement.innerHTML = html;
            return this;
        }
        this.$nativeElement.outerHTML.trim();
        
        return this;
    }

    /**
     * 
     * @return {DomWrapper}
     */
    clear() {
        this.html("");
        return this;
    }

    /**
     * 
     * @param {any} eventType
     * @param {any} callback
     */
    on(eventType, callback) {
        this.$nativeElement.addEventListener(eventType, callback);
    }

    /**
     * 
     * @param {any} eventType
     * @param {any} callback
     */
    off(eventType, callback) {
        this.$nativeElement.removeEventListener(eventType, callback);
    }

    /**
     * 
     * @param {DomWrapper} element
     * @return {DomWrapper}
     */
    append(element) {
        this.$nativeElement.append(element.$nativeElement);
        
        return this;
    }

    /**
     * 
     * @return {DOMStringMap}
     */
    get data() {
        return this.$nativeElement.dataset;
    }

    /**
     * 
     * @param {string} selector
     * @return {DomWrapper} 
     */
    closest(selector) {
        return $(this.$nativeElement.closest(selector));
    }

    /**
     * @param {string} selector
     * @return {NodeListOf<Element>}
     */
    findAll(selector) {
        return this.$nativeElement.querySelectorAll(selector);
    }

    /**
     * 
     * @return {DOMRect}
     */
    getCoords() {
        return this.$nativeElement.getBoundingClientRect();
    }
}

/**
 * @param {string | HTMLElement | EventTarget} queryObject
 * @return {DomWrapper}
 */
export function $(queryObject) {
    return new DomWrapper(queryObject);
}

/**
 * 
 * @param {string} tagName
 * @param {string} classes
 * @return {DomWrapper}
 */
$.create = (tagName, classes = "") => {
    const el = document.createElement(tagName);
    if (classes) {
        el.classList.add(classes);
    }
    
    return $(el);
};
