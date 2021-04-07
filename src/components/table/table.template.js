/**
 * @param {number} rowCount
 * @param {number} colCount
 * @return {string}
 */
export function createTable(rowCount, colCount) {
    let res = `<div class="table-header">${createTableHeader(colCount)}</div>
                <div class="table-body"><div class="column-row-info-container"><div class="column-row-info">`;

    for (let i = 1; i <= rowCount; i++) {
        res += `<div class="row-info"><div class="row-number">${i}</div><div class="row-resize"><div data-resize="row" class="handler"></div></div></div>`;
    }
    
    res += `</div></div><div class="table-wrapper">`;
    
    for (let i = 1; i <= rowCount; i++) {
        res += createSingleRow(i, colCount);
    }
    res += `</div><div class="column-row-info-patch"></div></div>`;
    
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
        const columnTitle = getColumnTitle(i);
        res += `<div class="column" data-column-number="${i}" data-resizable="true"><div class="column-title">${columnTitle}</div><div data-resize="col" class="col-resize"></div></div>`;
    }
    res += `</div><div class="row-column-info-patch"></div></div>`;
    
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
    let res = `<div class="row" data-row-number="${rowNumber}" data-resizable="true">
                    <div class="row-data">
                        `;
    
    for (let i = 1; i <= colCount; i++) {
        res += `<div class="cell" data-cell-row-number="${rowNumber}" data-cell-column-number="${i}" contenteditable="true"></div>`;
    }
    res += `</div></div>`;
    
    return res;
}
