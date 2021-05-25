/**
 * TODO: add comments here 
 */
import {isInit} from "./utils";

export class DomWrapper {
    
    public $nativeElement: any;
    
    constructor(queryObject: string | Element | HTMLElement) {
        this.$nativeElement = typeof(queryObject) === "string" ? document.querySelector(queryObject) : queryObject;
    }

    public html(html: string): DomWrapper {
        if (typeof(html) === "string") {
            this.$nativeElement.innerHTML = html;
            return this;
        }
        
        this.$nativeElement.outerHTML.trim();
        
        return this;
    }

    public clear(): DomWrapper {
        this.html("");
        
        return this;
    }

    public on(eventType: string, callback: Function): void {
        this.$nativeElement.addEventListener(eventType, callback);
    }

    public off(eventType: string, callback: Function): void {
        this.$nativeElement.removeEventListener(eventType, callback);
    }

    public append(element: DomWrapper): DomWrapper {
        this.$nativeElement.append(element.$nativeElement);
        
        return this;
    }

    public get data(): DOMStringMap {
        return this.$nativeElement.dataset;
    }

    public closest(selector: string): DomWrapper {
        return $(this.$nativeElement.closest(selector));
    }

    public find(selector: string): HTMLElement {
        return this.$nativeElement.querySelector(selector);
    }

    public findAll(selector: string): NodeListOf<HTMLElement> {
        return this.$nativeElement.querySelectorAll(selector);
    }

    public focus(): DomWrapper {
        this.$nativeElement.focus();
        
        return this;
    }

    public set textContent(text) {
        this.$nativeElement.textContent = text;
    }

    public get textContent(): string {
        return this.$nativeElement.textContent;
    }

    public getCoords(): DOMRect {
        return this.$nativeElement.getBoundingClientRect();
    }

    public css(styles: any): void {
        Object.keys(styles)
            .forEach(x => {
                if (styles[x] === "") {
                    this.$nativeElement.style.removeProperty(x);
                } else {
                    this.$nativeElement.style[x] = styles[x];
                }
            });
    }

    public addClass(...classNames: string[]): void {
        this.$nativeElement.classList.add(...classNames);
    }

    public removeClass(...classNames: string[]): void {
        this.$nativeElement.classList.remove(...classNames);
    }

    public toggleClass(className: string): void {
        this.$nativeElement.classList.toggle(className);
    }
}

export function $(queryObject: string | Element | HTMLElement): DomWrapper {
    if (!isInit(queryObject))
        return null;
    
    return new DomWrapper(queryObject);
}

$.create = (tagName: string, classes = ""): DomWrapper => {
    const el = document.createElement(tagName);
    if (classes) {
        el.classList.add(classes);
    }
    
    return $(el);
};
