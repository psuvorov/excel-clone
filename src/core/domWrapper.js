/**
 * 
 */
class DomWrapper {
    /**
     * @param {string | HTMLElement} queryObject
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
     * @param {DomWrapper} element
     * @return {DomWrapper}
     */
    append(element) {
        this.$nativeElement.append(element.$nativeElement);
        
        return this;
    }
}

/**
 * @param {string | HTMLElement} queryObject
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
