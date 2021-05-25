import {EventNames} from "./resources";
import {isInit} from "./utils";


export class Observable {
    
    private readonly handlers: any;
    
    constructor() {
        this.handlers = {};
    }

    public subscribe(eventName: EventNames, handler: Function): void {
        this.handlers[eventName] = this.handlers[eventName] || [];
        this.handlers[eventName].push(handler);
    }
    
    public dispose(eventName: EventNames): void {
        delete this.handlers[eventName];
    }

    public notify(eventName: EventNames, eventData: any = null): void {
        const eventHandlers = this.handlers[eventName];
        if (!isInit(eventHandlers))
            return;
        
        for (const handler of eventHandlers) {
            handler.call({}, eventData);
        }
    }
}
