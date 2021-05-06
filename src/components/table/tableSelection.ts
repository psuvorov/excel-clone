import {$, DomWrapper} from "../../core/domWrapper";
import {EventNames} from "../../core/resources";
import {Table} from "./table";
import {changeCellContent} from "../../redux/actions";

/**
 * 
 */
export class TableSelection {
    static selectedCellClassName = "selected";

    /**
     * 
     * @type {DomWrapper}
     */
    initialMouseSelectedCell = null; // TODO: try to name it more meaningfully 
    private selectedRange: {row1: number, col2: number, row2: number, col1: number};
    currentSelectedCell: DomWrapper;
    selectedPivot: {type: string, number: number};
    private spreadsheetEl: HTMLElement;
    private observable: any;
    private store: any;

    /**
     *
     * @param {any} store
     * @param {Observable} observable
     */
    constructor(store, observable) {
        this.selectedRange = null;

        this.currentSelectedCell = null;

        /**
         * 
         * @type {{type: string, number: number}}
         */
        this.selectedPivot = null;

        // TODO: Introduce data attribute for table element
        this.spreadsheetEl = document.querySelector(`.spreadsheet__${Table.componentName}`);

        this.observable = observable;
        this.store = store;

        this.observable.subscribe(EventNames.clearSelectedCells, () => {
            this.iterateOverSelectedCells((currentCellEl) => {
                const currentCell = $(currentCellEl);
                currentCell.textContent = "";
                this.store.dispatch(changeCellContent(+currentCell.data.cellColumnNumber, +currentCell.data.cellRowNumber, ""));
            });
            this.currentSelectedCell.textContent = "";
            this.store.dispatch(changeCellContent(+this.currentSelectedCell.data.cellColumnNumber, +this.currentSelectedCell.data.cellRowNumber, ""));
            this.observable.notify(EventNames.cellInput, "");
        });
    }

    /**
     * 
     */
    clearSelection() {
        if (this.currentSelectedCell) {
            const selectedColumn = this.spreadsheetEl.querySelector(`.table-header .column[data-column-number="${this.currentSelectedCell.data.cellColumnNumber}"]`);
            const selectedRow = this.spreadsheetEl.querySelector(`.column-row-info .row-info[data-row-number="${this.currentSelectedCell.data.cellRowNumber}"]`);

            selectedColumn.classList.remove("selected");
            selectedRow.classList.remove("selected");

            this.currentSelectedCell.removeClass(TableSelection.selectedCellClassName);
            this.currentSelectedCell = null;
        }
        if (this.selectedRange) {
            this.iterateOverSelectedCells((/** @type {HTMLElement} */currentCell) => {
                currentCell.classList.remove(TableSelection.selectedCellClassName);
            }, (/** @type {HTMLElement} */currentRow) => {
                currentRow.classList.remove("selected");
            }, (/** @type {HTMLElement} */currentColumn) => {
                currentColumn.classList.remove("selected");
            });
            this.selectedRange = null;
        }
    }

    /**
     * 
     * @param {number} firstCellColumnNumber
     * @param {number} firstCellRowNumber
     * @param {number} secondCellColumnNumber
     * @param {number} secondCellRowNumber
     */
    selectCells(firstCellColumnNumber, firstCellRowNumber, secondCellColumnNumber, secondCellRowNumber) {
        if (firstCellColumnNumber === secondCellColumnNumber && firstCellRowNumber === secondCellRowNumber) {
            this.clearSelection();
            // If we select a single cell after selected row / column, unset Selected Pivot 
            // in a sense we don't want to select the second row / column. 
            this.selectedPivot = null;

            const spreadsheetEl = document.querySelector(".spreadsheet__table");
            const cell = $(spreadsheetEl.querySelector(`[data-cell-column-number="${firstCellColumnNumber}"][data-cell-row-number="${firstCellRowNumber}"]`));
            
            this.currentSelectedCell = cell;
            cell.focus().addClass(TableSelection.selectedCellClassName);

            this.observable.notify(EventNames.singleCellSelect, {
                columnNumber: +cell.data.cellColumnNumber,
                rowNumber: +cell.data.cellRowNumber,
                content: cell.textContent
            });

            this.initialMouseSelectedCell = cell;
        }
        
        
        // Deselect the previous group of cells
        this.iterateOverSelectedCells((/** @type {HTMLElement} */currentCell) => {
            currentCell.classList.remove(TableSelection.selectedCellClassName);
        }, (/** @type {HTMLElement} */currentRow) => {
            currentRow.classList.remove("selected");
        }, (/** @type {HTMLElement} */currentColumn) => {
            currentColumn.classList.remove("selected");
        });
        
        this.selectedRange = {
            col1: Math.min(firstCellColumnNumber, secondCellColumnNumber),
            row1: Math.min(firstCellRowNumber, secondCellRowNumber),
            col2: Math.max(firstCellColumnNumber, secondCellColumnNumber),
            row2: Math.max(firstCellRowNumber, secondCellRowNumber),
        };
        
        // TODO: Set border for the whole selection perimeter
        
        // Select a new group of cells
        this.iterateOverSelectedCells((/** @type {HTMLElement} */currentCell) => {
            currentCell.classList.add(TableSelection.selectedCellClassName);
        }, (/** @type {HTMLElement} */currentRow) => {
            currentRow.classList.add("selected");
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
    iterateOverSelectedCells(currentCellCb, currentRowCb = null, currentColumnCb = null) {
        if (!this.selectedRange)
            return;
        
        // TODO: Introduce data attribute for table element
        const spreadsheetEl = document.querySelector(".spreadsheet__table");

        const startingColumn = spreadsheetEl.querySelector(`[data-column-number="${this.selectedRange.col1}"]`) as HTMLElement;
        const startingRow = spreadsheetEl.querySelector(`[data-row-number="${this.selectedRange.row1}"]`) as HTMLElement;
        const endColumn = spreadsheetEl.querySelector(`[data-column-number="${this.selectedRange.col2}"]`) as HTMLElement;
        const endRow = spreadsheetEl.querySelector(`[data-row-number="${this.selectedRange.row2}"]`) as HTMLElement;

        let currentRow = startingRow;
        while (currentRow && +currentRow.dataset.rowNumber <= +endRow.dataset.rowNumber) {
            if (currentRowCb)
                currentRowCb(currentRow);
            
            let currentColumn = startingColumn;

            const currentRowNumber = currentRow.dataset.rowNumber;
            while (currentColumn && +currentColumn.dataset.columnNumber <= +endColumn.dataset.columnNumber) {
                if (currentColumnCb)
                    currentColumnCb(currentColumn);
                
                const currentColumnNumber = currentColumn.dataset.columnNumber;
                const currentCell = spreadsheetEl.querySelector(`[data-cell-column-number="${currentColumnNumber}"][data-cell-row-number="${currentRowNumber}"]`);
                currentCellCb(currentCell);
                
                currentColumn = currentColumn.nextElementSibling as HTMLElement;
            }
            currentRow = currentRow.nextElementSibling as HTMLElement;
        }
    }
}
