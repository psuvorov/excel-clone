export const COLUMN_RESIZE = 'COLUMN_RESIZE';
export const ROW_RESIZE = 'ROW_RESIZE';
export const CHANGE_CELL_CONTENT = 'CHANGE_CELL_CONTENT';
export const CHANGE_FORMULA_BAR_TEXT = 'CHANGE_FORMULA_BAR_TEXT';

/**
 *
 * @param {string} columnNumber
 * @param {number} newColumnWidth
 * @return {{}}
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
 * @return {{}}
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

/**
 * 
 * @param {number} columnNumber
 * @param {number} rowNumber
 * @param {string} value
 * @return {{}}
 */
export function changeCellContent(columnNumber, rowNumber, value) {
    return {
        type: CHANGE_CELL_CONTENT,
        data: {
            columnNumber,
            rowNumber,
            value
        }
    };
}
