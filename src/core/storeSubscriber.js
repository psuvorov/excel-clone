/**
 * 
 */
export class StoreSubscriber {
    /**
     * 
     * @param {Store} store
     */
    constructor(store) {
        this.store = store;
        this.sub = null;
    }

    /**
     * @param {SpreadsheetBaseComponent[]} components 
     */
    subscribeComponents(components) {
        this.sub = this.store.subscribe(() => {
            const state = this.store.getState();
            Object.keys(state).forEach(key => {
                components.forEach(component => {
                    if (component.subscribedTo.includes(key)) {
                        console.log("Store changes for ", key);
                        
                        const changes = {[key]: state[key]};
                        component.storeChanged(changes);
                    }
                });
            });
        });
    }

    /**
     * 
     */
    unsubscribeFromStore() {
        this.sub.unsubscribe();
    }
}
