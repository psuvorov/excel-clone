/**
 * 
 */
import {DomWrapper} from "./domWrapper";
import {isInit} from "./utils";

export class DomListener {
    
    private listeners: any[];
    
    protected $root: DomWrapper;
    
    protected name: string;
    
    constructor(root: DomWrapper, listeners= []) {
        if (!isInit(root))
            throw new Error("No $root provided for DomListener");
        
        this.$root = root;
        this.listeners = listeners;
    }

    public initDomListeners(): void {
        this.listeners.forEach(listener => {
            const method = getEventMethodName(listener);
            if (!isInit(this[method]))
                throw new Error(`Method ${method} is not implemented in ${this.name || ''} component.`);

            this[method] = this[method].bind(this);
            this.$root.on(listener, this[method]);
        });
    }

    public removeDomListeners(): void {
        this.listeners.forEach(listener => {
            const method = getEventMethodName(listener);
            if (!isInit(this[method]))
                throw new Error(`Method ${method} is not implemented in ${this.name || ''} component.`);
            
            this.$root.off(listener, this[method]);
        });
    }
}

const getEventMethodName = (eventName: string): string => 
    "on" + eventName.charAt(0).toUpperCase() + eventName.slice(1, eventName.length);
