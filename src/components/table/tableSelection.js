/**
 * 
 */
export class TableSelection {
    static selectedClassName = "selected";
    
    /**
     * 
     */
    constructor() {
        /**
         * 
         * @type {{row1: string, col2: string, row2: string, col1: string} | null}
         */
        this.selectedRange = null;
    }

    /**
     * 
     * @param {DomWrapper} $cell
     */
    selectCell($cell) {
        this.clearSelection();
        this.currentSelectedCell = $cell;
        $cell.addClass(TableSelection.selectedClassName);
    }

    /**
     * 
     */
    clearSelection() {
        if (this.currentSelectedCell) {
            this.currentSelectedCell.removeClass(TableSelection.selectedClassName);
            this.currentSelectedCell = null;
        }
        if (this.selectedRange) {
            this.iterateOverSelectedCells((currentCell) => {
                currentCell.classList.remove(TableSelection.selectedClassName);
            });
        }
    }

    /**
     * @param {DomWrapper} $cell
     */
    selectCells($cell) {
        this.selectedRange = {
            col1: +this.currentSelectedCell.data.cellColumnNumber < +$cell.data.cellColumnNumber ? 
                this.currentSelectedCell.data.cellColumnNumber : $cell.data.cellColumnNumber,
            row1: +this.currentSelectedCell.data.cellRowNumber < +$cell.data.cellRowNumber ?
                this.currentSelectedCell.data.cellRowNumber : $cell.data.cellRowNumber,
            col2: +this.currentSelectedCell.data.cellColumnNumber > +$cell.data.cellColumnNumber ?
                this.currentSelectedCell.data.cellColumnNumber : $cell.data.cellColumnNumber,
            row2: +this.currentSelectedCell.data.cellRowNumber > +$cell.data.cellRowNumber ?
                this.currentSelectedCell.data.cellRowNumber : $cell.data.cellRowNumber,
        };

        this.iterateOverSelectedCells((currentCell) => {
            currentCell.classList.add(TableSelection.selectedClassName);
        });
    }

    /**
     * 
     * @param {Function} cb
     */
    iterateOverSelectedCells(cb) {
        // TODO: Introduce data attribute for table element
        const spreadsheetEl = document.querySelector(".spreadsheet__table");

        const startingColumn = spreadsheetEl.querySelector(`[data-column-number="${this.selectedRange.col1}"]`);
        const startingRow = spreadsheetEl.querySelector(`[data-row-number="${this.selectedRange.row1}"]`);
        const endColumn = spreadsheetEl.querySelector(`[data-column-number="${this.selectedRange.col2}"]`);
        const endRow = spreadsheetEl.querySelector(`[data-row-number="${this.selectedRange.row2}"]`);

        let currentRow = startingRow;
        while (currentRow && +currentRow.dataset.rowNumber <= +endRow.dataset.rowNumber) {
            let currentColumn = startingColumn;

            const currentRowNumber = currentRow.dataset.rowNumber;
            while (currentColumn && +currentColumn.dataset.columnNumber <= +endColumn.dataset.columnNumber) {
                const currentColumnNumber = currentColumn.dataset.columnNumber;
                const currentCell = spreadsheetEl.querySelector(`[data-cell-column-number="${currentColumnNumber}"][data-cell-row-number="${currentRowNumber}"]`);
                cb(currentCell);
                
                currentColumn = currentColumn.nextElementSibling;
            }
            currentRow = currentRow.nextElementSibling;
        }
    }


    /**
     * 
     * @param {string} columnTitle
     * @param {string} rowNumber
     */
    // highlightCellCaption(columnTitle, rowNumber) {
    //     const columnHeader = document.querySelector(`[data-header-name='${columnTitle}']`);
    //     columnHeader.classList.add("selected");
    //
    //     const rowHeader = document.querySelector(`[data-row-number='${rowNumber}']`);
    //     rowHeader.classList.add("selected");
    // }

    // /**
    //  * 
    //  * @return {{row1: string, col2: string, row2: string, col1: string} | null}
    //  */
    // getSelectedRange() {
    //     return this.selectedRange;
    // }
}
