import {isAllowedEventName} from "@core/utils";
import {ErrorMessages} from "@core/resources";

/**
 * 
 */
export class Observable {
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
    subscribe(eventName, handler) {
        if (!isAllowedEventName(eventName))
            throw new Error(ErrorMessages.wrongEventType.toString());
        
        this.handlers[eventName] = this.handlers[eventName] || [];
        this.handlers[eventName].push(handler);
    }

    /**
     * 
     * @param {string} eventName
     */
    dispose(eventName) {
        if (!isAllowedEventName(eventName))
            throw new Error(ErrorMessages.wrongEventType.toString());
        
        delete this.handlers[eventName];
    }

    /**
     * 
     * @param {string} eventName
     * @param {any} eventData
     */
    notify(eventName, eventData = null) {
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
