export const TABLE_RESIZE = 'TABLE_RESIZE';

/**
 *
 * @param {string} columnNumber
 * @param {number} newColumnWidth
 * @return {any}
 */
export function tableResize(columnNumber, newColumnWidth) {
    return {
        type: TABLE_RESIZE,
        data: {
            columnId: columnNumber,
            newColumnWidth
        }
    };
}
