import {TABLE_RESIZE} from "@/redux/actions";

/**
 * 
 * @param {{}} state
 * @param {{}} action
 * @return {string|*}
 */
export function rootReducer(state, action) {
    switch (action.type) {
        case TABLE_RESIZE: {
            const prevState = {...state};
            prevState.table.columnWidths[action.data.columnId] = action.data.newColumnWidth;
            
            return prevState; 
        }
        default:
            return state;
    }
}
