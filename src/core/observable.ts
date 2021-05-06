import {isAllowedEventName} from "./utils";
import {ErrorMessages} from "./resources";

/**
 * 
 */
export class Observable {
    
    private readonly handlers: any;
    
    /**
     * 
     */
    constructor() {
        this.handlers = {};
    }

    /**
     * 
     * @param {string} eventName
     * @param {Function} handler
     */
    subscribe(eventName: string, handler: Function) {
        if (!isAllowedEventName(eventName))
            throw new Error(ErrorMessages.wrongEventType.toString());
        
        this.handlers[eventName] = this.handlers[eventName] || [];
        this.handlers[eventName].push(handler);
    }

    /**
     * 
     * @param {string} eventName
     */
    dispose(eventName: string) {
        if (!isAllowedEventName(eventName))
            throw new Error(ErrorMessages.wrongEventType.toString());
        
        delete this.handlers[eventName];
    }

    /**
     * 
     * @param {string} eventName
     * @param {any} eventData
     */
    notify(eventName: string, eventData: any = null) {
        if (!isAllowedEventName(eventName))
            throw new Error(ErrorMessages.wrongEventType.toString());
        
        const eventHandlers = this.handlers[eventName];
        if (!eventHandlers)
            return;
        
        for (const handler of eventHandlers) {
            handler.call({}, eventData);
        }
    }
}
