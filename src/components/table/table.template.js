/**
 * @param {number} rowCount
 * @param {number} colCount
 * @return {string}
 */
export function createTable(rowCount = 150, colCount = 30) {
    let res = createTableHeader(colCount);
    
    for (let i = 1; i <= rowCount; i++) {
        res += createSingleRow(i, colCount);
    }
    
    return res;
}

/**
 * 
 * @param {number} colCount
 * @return {string}
 */
function createTableHeader(colCount) {
    let res = `<div class="row">                    
                    <div class="row-info"></div>
                        <div class="row-data">`;
    
    for (let i = 1; i <= colCount; i++) {
        res += `<div class="column">${getColumnTitle(i)}</div>`;
    }
    res += `</div></div>`;
    
    return res;
}

/**
 * 
 * @param {number} columnNumber
 * @return {string}
 */
function getColumnTitle(columnNumber) {
    const res = [];
    
    while (columnNumber > 0) {
        const charToAdd = String.fromCharCode(((columnNumber - 1) % 26) + 'A'.charCodeAt(0));
        res.push(charToAdd);
        columnNumber = Math.floor((columnNumber - 1) / 26);
    }
    
    return res.reverse().join('');
}

/**
 *
 * @param {number} rowNumber
 * @param {number} colCount
 * @return {string}
 */
function createSingleRow(rowNumber, colCount) {
    let res = `<div class="row">
                    <div class="row-info">${rowNumber}</div>
                    <div class="row-data">
                        `;
    
    for (let i = 0; i < colCount; i++) {
        res += `<div class="cell" contenteditable="true"></div>`;
    }
    res += `</div></div>`;
    
    return res;
}