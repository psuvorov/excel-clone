export const COLUMN_RESIZE = 'COLUMN_RESIZE';
export const ROW_RESIZE = 'ROW_RESIZE';
export const CHANGE_CELL_CONTENT = 'CHANGE_CELL_CONTENT';

/**
 *
 * @param {string} columnNumber
 * @param {number} newColumnWidth
 * @return {{}}
 */
export function columnResize(columnNumber: number, newColumnWidth: number) {
    return {
        type: COLUMN_RESIZE,
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
        type: ROW_RESIZE,
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
        type: CHANGE_CELL_CONTENT,
        data: {
            columnNumber,
            rowNumber,
            value
        }
    };
}
