
export function createTable(rowCount: number, colCount: number): string {
    let res = `<div class="table-header">${createTableHeader(colCount)}</div>
                <div class="table-body"><div class="column-row-info-container"><div class="column-row-info">`;

    for (let i = 1; i <= rowCount; i++) {
        res += `<div class="row-info" data-row-number="${i}"><div class="row-number">${i}</div><div class="row-resize"><div data-resize="row" class="handler"></div></div></div>`;
    }
    
    res += `</div></div><div class="table-wrapper">`;
    
    for (let i = 1; i <= rowCount; i++) {
        res += createSingleRow(i, colCount);
    }
    res += `</div><div class="column-row-info-patch"></div></div>`;
    
    return res;
}

function createTableHeader(colCount: number): string {
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

function getColumnTitle(columnNumber: number): string {
    const res = [];
    
    while (columnNumber > 0) {
        const charToAdd = String.fromCharCode(((columnNumber - 1) % 26) + 'A'.charCodeAt(0));
        res.push(charToAdd);
        columnNumber = Math.floor((columnNumber - 1) / 26);
    }
    
    return res.reverse().join('');
}

function createSingleRow(rowNumber: number, colCount: number): string {
    let res = `<div class="row" data-row-number="${rowNumber}" data-resizable="true">
                    <div class="row-data">
                        `;
    
    for (let i = 1; i <= colCount; i++) {
        res += `<div class="cell align-vertical-bottom" data-cell-row-number="${rowNumber}" data-cell-column-number="${i}" contenteditable="true"></div>`;
    }
    res += `</div></div>`;
    
    return res;
}
