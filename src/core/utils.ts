import {EventNames} from "./resources";

/**
 * 
 * @param {string} eventName
 * @return {boolean}
 */
export const isAllowedEventName = (eventName: string) => Object.keys(EventNames).includes(eventName);
