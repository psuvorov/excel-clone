export enum ActionTypes {
    columnResize = "columnResize",
    rowResize = "rowResize",
    changeCellContent = "changeCellContent"
}

/**
 *
 * @param {string} columnNumber
 * @param {number} newColumnWidth
 * @return {{}}
 */
export function columnResize(columnNumber: number, newColumnWidth: number) {
    return {
        type: ActionTypes.columnResize,
        data: {
            columnNumber,
            newColumnWidth
        }
    };
}

/**
 *
 * @param {string} rowNumber
 * @param {number} newRowHeight
 * @return {{}}
 */
export function rowResize(rowNumber: number, newRowHeight: number) {
    return {
        type: ActionTypes.rowResize,
        data: {
            rowNumber,
            newRowHeight
        }
    };
}

/**
 * 
 * @param {number} columnNumber
 * @param {number} rowNumber
 * @param {string} value
 * @return {{}}
 */
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
