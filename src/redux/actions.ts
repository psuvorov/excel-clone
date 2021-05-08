import {TableCell, TableCellStyle} from "../core/applicationState";

export enum ActionTypes {
    columnResize = "columnResize",
    rowResize = "rowResize",
    changeCellContent = "changeCellContent",
    changeCellStyle = "changeCellStyle"
}

export function columnResize(columnNumber: number, newColumnWidth: number) {
    return {
        type: ActionTypes.columnResize,
        data: {
            columnNumber,
            newColumnWidth
        }
    };
}

export function rowResize(rowNumber: number, newRowHeight: number) {
    return {
        type: ActionTypes.rowResize,
        data: {
            rowNumber,
            newRowHeight
        }
    };
}

export function changeCellContent(columnNumber: number, rowNumber: number, value: string) {
    return {
        type: ActionTypes.changeCellContent,
        data: {
            columnNumber,
            rowNumber,
            value
        }
    };
}

export function changeCellStyle(columnNumber: number, rowNumber: number, cellStyle: TableCellStyle) {
    return {
        type: ActionTypes.changeCellStyle,
        data: {
            columnNumber,
            rowNumber,
            cellStyle
        }
    };
}
