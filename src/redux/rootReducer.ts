import {ActionTypes} from "./actions";
import {TableCell, TableCellStyle} from "../core/applicationState";
import {isInit} from "../core/utils";

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
            if (!isInit(prevState.table.cellContents[action.data.columnNumber]))
                prevState.table.cellContents[action.data.columnNumber] = {};

            let tableCell = prevState.table.cellContents[action.data.columnNumber][action.data.rowNumber] as TableCell;
            if (!isInit(tableCell))
                tableCell = {value: action.data.value};
            else
                tableCell.value = action.data.value
            
            prevState.table.cellContents[action.data.columnNumber][action.data.rowNumber] = tableCell;

            return prevState;
        }
        case ActionTypes.changeCellStyle: {
            const prevState = {...state};
            if (!isInit(prevState.table.cellContents[action.data.columnNumber]))
                prevState.table.cellContents[action.data.columnNumber] = {};
            const newTableCellStyle = action.data.cellStyle as TableCellStyle;

            let oldTableCell = prevState.table.cellContents[action.data.columnNumber][action.data.rowNumber] as TableCell;
            if (!isInit(oldTableCell)) {
                oldTableCell = {tableCellStyle: {}};
            }
            if (!isInit(oldTableCell.tableCellStyle)) {
                oldTableCell.tableCellStyle = {};
            }
            
            if (isInit(newTableCellStyle.bold))
                oldTableCell.tableCellStyle.bold = newTableCellStyle.bold;
            if (isInit(newTableCellStyle.italic))
                oldTableCell.tableCellStyle.italic = newTableCellStyle.italic;
            if (isInit(newTableCellStyle.underlined))
                oldTableCell.tableCellStyle.underlined = newTableCellStyle.underlined;
            if (isInit(newTableCellStyle.verticalAlignment))
                oldTableCell.tableCellStyle.verticalAlignment = newTableCellStyle.verticalAlignment;
            if (isInit(newTableCellStyle.horizontalAlignment))
                oldTableCell.tableCellStyle.horizontalAlignment = newTableCellStyle.horizontalAlignment;

            prevState.table.cellContents[action.data.columnNumber][action.data.rowNumber] = oldTableCell;

            return prevState;
        }
        default:
            return state;
    }
}
