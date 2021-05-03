import {COLUMN_RESIZE, ROW_RESIZE} from "@/redux/actions";

/**
 * 
 * @param {{}} state
 * @param {{}} action
 * @return {string|*}
 */
export function rootReducer(state, action) {
    switch (action.type) {
        case COLUMN_RESIZE: {
            const prevState = {...state};
            prevState.table.columnWidths[action.data.columnNumber] = action.data.newColumnWidth;
            
            return prevState; 
        }
        case ROW_RESIZE: {
            const prevState = {...state};
            prevState.table.rowHeights[action.data.rowNumber] = action.data.newRowHeight;

            return prevState;
        }
        default:
            return state;
    }
}
