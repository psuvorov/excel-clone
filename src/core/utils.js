import {EventNames} from "@core/resources";

/**
 * 
 * @param {string} eventName
 * @return {boolean}
 */
export const isAllowedEventName = eventName => Object.keys(EventNames).includes(eventName);
