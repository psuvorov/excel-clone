import {COLUMN_RESIZE, ROW_RESIZE, CHANGE_CELL_CONTENT} from "./actions";

/**
 * 
 * @param {{}} state
 * @param {{}} action
 * @return {string|*}
 */
export function rootReducer(state: any, action: any) {
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
        case CHANGE_CELL_CONTENT: {
            const prevState = {...state};
            if (!prevState.table.cellContents[action.data.columnNumber])
                prevState.table.cellContents[action.data.columnNumber] = {};
            prevState.table.cellContents[action.data.columnNumber][action.data.rowNumber] = action.data.value;

            return prevState;
        }
        default:
            return state;
    }
}
