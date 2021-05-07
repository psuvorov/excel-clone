export enum ActionTypes {
    columnResize = "columnResize",
    rowResize = "rowResize",
    changeCellContent = "changeCellContent"
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
