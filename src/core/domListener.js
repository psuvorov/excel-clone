/**
 * 
 */
export class DomListener {
    /**
     *
     * @param {DomWrapper} $root
     * @param {[]} listeners
     */
    constructor($root, listeners= []) {
        if (!$root)
            throw new Error("No $root provided for DomListener");
        
        /** @type {DomWrapper} */
        this.$root = $root;
        this.listeners = listeners;
    }

    /**
     * 
     */
    initDomListeners() {
        this.listeners.forEach(listener => {
            const method = getEventMethodName(listener);
            if (!this[method])
                throw new Error(`Method ${method} is not implemented in ${this.name || ''} component.`);
            
            this.$root.on(listener, this[method].bind(this));
        });
    }

    /**
     * 
     */
    removeDomListeners() {
        
    }
}


/**
 * 
 * @param {string} eventName
 * @return {string}
 */
const getEventMethodName = eventName => "on" + eventName.charAt(0).toUpperCase() + eventName.slice(1, eventName.length);
