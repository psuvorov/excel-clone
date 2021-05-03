export const COLUMN_RESIZE = 'COLUMN_RESIZE';
export const ROW_RESIZE = 'ROW_RESIZE';

/**
 *
 * @param {string} columnNumber
 * @param {number} newColumnWidth
 * @return {any}
 */
export function columnResize(columnNumber, newColumnWidth) {
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
 * @return {any}
 */
export function rowResize(rowNumber, newRowHeight) {
    return {
        type: ROW_RESIZE,
        data: {
            rowNumber,
            newRowHeight
        }
    };
}
