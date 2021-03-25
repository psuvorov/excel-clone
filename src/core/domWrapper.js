/**
 * 
 */
class DomWrapper {
    /**
     * @param {string | HTMLElement} queryObject
     */
    constructor(queryObject) {
        this.$nativeELement = typeof(queryObject) === "string" ? document.querySelector(queryObject) : queryObject;
    }

    /**
     * 
     * @param {string} html
     * @return {DomWrapper}
     */
    html(html ) {
        if (typeof(html) === "string") {
            this.$nativeELement.innerHTML = html;
            return this;
        }
        this.$nativeELement.outerHTML.trim();
        
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
     * @param {DomWrapper} element
     * @return {DomWrapper}
     */
    append(element) {
        this.$nativeELement.append(element.$nativeELement);
        
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
