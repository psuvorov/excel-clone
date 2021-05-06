/**
 * 
 */
export class DomWrapper {
    
    public $nativeElement: any;
    
    /**
     * @param {string | HTMLElement | EventTarget} queryObject
     */
    constructor(queryObject: any) {
        this.$nativeElement = typeof(queryObject) === "string" ? document.querySelector(queryObject) : queryObject;
    }

    /**
     * 
     * @param {string} html
     * @return {DomWrapper}
     */
    html(html: string) {
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
    on(eventType: string, callback: Function) {
        this.$nativeElement.addEventListener(eventType, callback);
    }

    /**
     * 
     * @param {any} eventType
     * @param {any} callback
     */
    off(eventType: string, callback: Function) {
        this.$nativeElement.removeEventListener(eventType, callback);
    }

    /**
     * 
     * @param {DomWrapper} element
     * @return {DomWrapper}
     */
    append(element: DomWrapper) {
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
    closest(selector: string) {
        return $(this.$nativeElement.closest(selector));
    }

    /**
     * 
     * @param {string} selector
     * @return {Element}
     */
    find(selector: string) {
        return this.$nativeElement.querySelector(selector);
    }

    /**
     * @param {string} selector
     * @return {NodeListOf<Element>}
     */
    findAll(selector: string) {
        return this.$nativeElement.querySelectorAll(selector);
    }

    /**
     * 
     * @return {DomWrapper}
     */
    focus() {
        this.$nativeElement.focus();
        return this;
    }

    /**
     * 
     * @param {string} text
     */
    set textContent(text) {
        this.$nativeElement.textContent = text;
    }

    /**
     * 
     * @return {string}
     */
    get textContent() {
        return this.$nativeElement.textContent;
    }

    /**
     * 
     * @return {DOMRect}
     */
    getCoords() {
        return this.$nativeElement.getBoundingClientRect();
    }

    /**
     * 
     * @param {Object.<string, string>} styles
     */
    css(styles: any) {
        Object.keys(styles)
            .forEach(x => {
                if (styles[x] === "") {
                    this.$nativeElement.style.removeProperty(x);
                } else {
                    this.$nativeElement.style[x] = styles[x];
                }
            });
    }

    /**
     * 
     * @param {string} className
     */
    addClass(className: string) {
        this.$nativeElement.classList.add(className);
    }

    /**
     * 
     * @param {string} className
     */
    removeClass(className: string) {
        this.$nativeElement.classList.remove(className);
    }
}

/**
 * @param {string | HTMLElement | EventTarget} queryObject
 * @return {DomWrapper}
 */
export function $(queryObject: any) {
    if (!queryObject)
        return null;
    
    return new DomWrapper(queryObject);
}

/**
 * 
 * @param {string} tagName
 * @param {string} classes
 * @return {DomWrapper}
 */
$.create = (tagName: string, classes = "") => {
    const el = document.createElement(tagName);
    if (classes) {
        el.classList.add(classes);
    }
    
    return $(el);
};
