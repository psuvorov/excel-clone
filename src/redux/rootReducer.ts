import {ActionTypes} from "./actions";

// TODO: bring ApplicationState class
export function rootReducer(state: any, action: {type: string, data: any}): any {
    switch (action.type) {
        case ActionTypes.columnResize: {
            const prevState = {...state};
            prevState.table.columnWidths[action.data.columnNumber] = action.data.newColumnWidth;
            
            return prevState; 
        }
        case ActionTypes.rowResize: {
            const prevState = {...state};
            prevState.table.rowHeights[action.data.rowNumber] = action.data.newRowHeight;

            return prevState;
        }
        case ActionTypes.changeCellContent: {
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
