/**
 * 
 */
export class TableSelection {
    static selectedCellClassName = "selected";
    
    /**
     * 
     */
    constructor() {
        /**
         * 
         * @type {{row1: string, col2: string, row2: string, col1: string} | null}
         */
        this.selectedRange = null;

        // TODO: Introduce data attribute for table element
        this.spreadsheetEl = document.querySelector(".spreadsheet__table");
    }

    /**
     * 
     * @param {DomWrapper} $cell
     */
    selectSingleCell($cell) {
        this.clearSelection();
        
        this.currentSelectedCell = $cell;
        $cell.addClass(TableSelection.selectedCellClassName);

        const selectedColumn = this.spreadsheetEl.querySelector(`[data-column-number="${$cell.data.cellColumnNumber}"]`);
        const selectedRow = this.spreadsheetEl.querySelector(`[data-row-number="${$cell.data.cellRowNumber}"]`);

        selectedColumn.classList.add("selected");
        selectedRow.querySelector(".row-info").classList.add("selected");
    }

    /**
     * 
     */
    clearSelection() {
        if (this.currentSelectedCell) {
            const selectedColumn = this.spreadsheetEl.querySelector(`[data-column-number="${this.currentSelectedCell.data.cellColumnNumber}"]`);
            const selectedRow = this.spreadsheetEl.querySelector(`[data-row-number="${this.currentSelectedCell.data.cellRowNumber}"]`);

            selectedColumn.classList.remove("selected");
            selectedRow.querySelector(".row-info").classList.remove("selected");

            this.currentSelectedCell.removeClass(TableSelection.selectedCellClassName);
            this.currentSelectedCell = null;
        }
        if (this.selectedRange) {
            this.iterateOverSelectedCells((/** @type {HTMLElement} */currentCell) => {
                currentCell.classList.remove(TableSelection.selectedCellClassName);
            }, (/** @type {HTMLElement} */currentRow) => {
                currentRow.querySelector(".row-info").classList.remove("selected");
            }, (/** @type {HTMLElement} */currentColumn) => {
                currentColumn.classList.remove("selected");
            });
            this.selectedRange = null;
        }
    }

    /**
     * @param {DomWrapper} $firstCell
     * @param {DomWrapper} $secondCell
     */
    selectCells($firstCell, $secondCell) {
        // Deselect the previous group of cells
        this.iterateOverSelectedCells((/** @type {HTMLElement} */currentCell) => {
            currentCell.classList.remove(TableSelection.selectedCellClassName);
        }, (/** @type {HTMLElement} */currentRow) => {
            currentRow.querySelector(".row-info").classList.remove("selected");
        }, (/** @type {HTMLElement} */currentColumn) => {
            currentColumn.classList.remove("selected");
        });
        
        this.selectedRange = {
            col1: +$firstCell.data.cellColumnNumber < +$secondCell.data.cellColumnNumber ?
                $firstCell.data.cellColumnNumber : $secondCell.data.cellColumnNumber,
            row1: +$firstCell.data.cellRowNumber < +$secondCell.data.cellRowNumber ?
                $firstCell.data.cellRowNumber : $secondCell.data.cellRowNumber,
            col2: +$firstCell.data.cellColumnNumber > +$secondCell.data.cellColumnNumber ?
                $firstCell.data.cellColumnNumber : $secondCell.data.cellColumnNumber,
            row2: +$firstCell.data.cellRowNumber > +$secondCell.data.cellRowNumber ?
                $firstCell.data.cellRowNumber : $secondCell.data.cellRowNumber,
        };
        
        // TODO: Set border for the whole selection perimeter
        
        // Select a new group of cells
        this.iterateOverSelectedCells((/** @type {HTMLElement} */currentCell) => {
            currentCell.classList.add(TableSelection.selectedCellClassName);
        }, (/** @type {HTMLElement} */currentRow) => {
            currentRow.querySelector(".row-info").classList.add("selected");
        }, (/** @type {HTMLElement} */currentColumn) => {
            currentColumn.classList.add("selected");
        });
    }

    /**
     *
     * @param {Function} currentCellCb
     * @param {Function} currentRowCb
     * @param {Function} currentColumnCb
     */
    iterateOverSelectedCells(currentCellCb, currentRowCb, currentColumnCb) {
        if (!this.selectedRange)
            return;
        
        // TODO: Introduce data attribute for table element
        const spreadsheetEl = document.querySelector(".spreadsheet__table");

        const startingColumn = spreadsheetEl.querySelector(`[data-column-number="${this.selectedRange.col1}"]`);
        const startingRow = spreadsheetEl.querySelector(`[data-row-number="${this.selectedRange.row1}"]`);
        const endColumn = spreadsheetEl.querySelector(`[data-column-number="${this.selectedRange.col2}"]`);
        const endRow = spreadsheetEl.querySelector(`[data-row-number="${this.selectedRange.row2}"]`);

        let currentRow = startingRow;
        while (currentRow && +currentRow.dataset.rowNumber <= +endRow.dataset.rowNumber) {
            currentRowCb(currentRow);
            
            let currentColumn = startingColumn;

            const currentRowNumber = currentRow.dataset.rowNumber;
            while (currentColumn && +currentColumn.dataset.columnNumber <= +endColumn.dataset.columnNumber) {
                currentColumnCb(currentColumn);
                
                const currentColumnNumber = currentColumn.dataset.columnNumber;
                const currentCell = spreadsheetEl.querySelector(`[data-cell-column-number="${currentColumnNumber}"][data-cell-row-number="${currentRowNumber}"]`);
                currentCellCb(currentCell);
                
                currentColumn = currentColumn.nextElementSibling;
            }
            currentRow = currentRow.nextElementSibling;
        }
    }
}
