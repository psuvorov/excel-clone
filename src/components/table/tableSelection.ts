import {$, DomWrapper} from "../../core/domWrapper";
import {EventNames} from "../../core/resources";
import {Table} from "./table";
import {changeCellContent} from "../../redux/actions";
import {Observable} from "../../core/observable";
import {Store} from "redux";

/**
 * TODO: add comments 
 */
export class TableSelection {
    private static readonly selectedCellClassName = "selected";

    public initialMouseSelectedCell: DomWrapper; // TODO: try to name it more meaningfully 
    private currentSelectionRange: SelectionRange;
    public currentSelectedCell: DomWrapper; // TODO: WTF
    public selectedPivot: {type: string, number: number}; // TODO: check this out
    private spreadsheetEl: HTMLElement;
    private observable: Observable;
    private store: Store<any, { type: string; data: any }>;

    constructor(store: Store<any, { type: string; data: any }>, observable: Observable) {
        // TODO: Introduce data attribute for table element
        this.spreadsheetEl = document.querySelector(`.${Table.className}`);

        this.observable = observable;
        this.store = store;

        this.observable.subscribe(EventNames.CellsDeselectionRequested, () => {
            this.iterateOverSelectedCells((currentCellEl) => {
                const currentCell = $(currentCellEl);
                currentCell.textContent = "";
                this.store.dispatch(changeCellContent(+currentCell.data.cellColumnNumber, +currentCell.data.cellRowNumber, ""));
            });
            
            this.currentSelectedCell.textContent = "";
            this.store.dispatch(changeCellContent(+this.currentSelectedCell.data.cellColumnNumber, +this.currentSelectedCell.data.cellRowNumber, ""));
            this.observable.notify(EventNames.CellInput, "");
        });
    }

    public getSelectionRange(): SelectionRange {
        return Object.freeze(this.currentSelectionRange);
    }

    public selectCells(selectionRange: SelectionRange) {
        // Single cell selection
        if (selectionRange.col1 === selectionRange.col2 && selectionRange.row1 === selectionRange.row2) {
            this.clearSelection();
            
            // If we select a single cell after selected row / column, unset Selected Pivot 
            // in a sense we don't want to select the second row / column. 
            this.selectedPivot = null;

            const spreadsheetEl = document.querySelector(`.${Table.className}`);
            const cell = $(spreadsheetEl.querySelector(`[data-cell-column-number="${selectionRange.col1}"][data-cell-row-number="${selectionRange.row1}"]`));
            
            this.currentSelectedCell = cell;
            cell.focus().addClass(TableSelection.selectedCellClassName);
            
            console.log("+++++++++++");
            
            this.observable.notify(EventNames.SingleCellSelected, {
                columnNumber: +cell.data.cellColumnNumber,
                rowNumber: +cell.data.cellRowNumber,
                content: cell.textContent
            });

            this.initialMouseSelectedCell = cell;
        }
        
        this.deselectPreviousSelection();
        
        this.currentSelectionRange = {
            col1: Math.min(selectionRange.col1, selectionRange.col2),
            row1: Math.min(selectionRange.row1, selectionRange.row2),
            col2: Math.max(selectionRange.col1, selectionRange.col2),
            row2: Math.max(selectionRange.row1, selectionRange.row2),
        };
        
        // TODO: Set border for the whole selection perimeter
        this.highlightSelectedCells();
    }
    
    public clearSelection(): void {
        // TODO: break it down into two local functions
        if (this.currentSelectedCell) {
            const selectedColumn = this.spreadsheetEl.querySelector(`.table-header .column[data-column-number="${this.currentSelectedCell.data.cellColumnNumber}"]`);
            const selectedRow = this.spreadsheetEl.querySelector(`.column-row-info .row-info[data-row-number="${this.currentSelectedCell.data.cellRowNumber}"]`);

            selectedColumn.classList.remove(TableSelection.selectedCellClassName);
            selectedRow.classList.remove(TableSelection.selectedCellClassName);

            this.currentSelectedCell.removeClass(TableSelection.selectedCellClassName);
            this.currentSelectedCell = null;
        }

        if (this.currentSelectionRange) {
            this.deselectPreviousSelection();
            this.currentSelectionRange = null;
        }
    }
    
    public applyCssClassToSelectedCells(...cssClasses: string[]): void {
        this.iterateOverSelectedCells((cell: HTMLElement) => {
            $(cell).addClass(cssClasses.join(" "));
        });
    }
    
    public removeCssClassFromSelectedCells(...cssClasses: string[]): void {
        this.iterateOverSelectedCells((cell: HTMLElement) => {
            $(cell).removeClass(cssClasses.join(" "));
        });
    }
    
    private highlightSelectedCells(): void {
        // Select a new group of cells
        this.iterateOverSelectedCells((currentCell) => {
            currentCell.classList.add(TableSelection.selectedCellClassName);
        }, (currentRow) => {
            currentRow.classList.add(TableSelection.selectedCellClassName);
        }, (currentColumn) => {
            currentColumn.classList.add(TableSelection.selectedCellClassName);
        });
    }

    private deselectPreviousSelection(): void {
        this.iterateOverSelectedCells((currentCell) => {
            currentCell.classList.remove(TableSelection.selectedCellClassName);
        }, (currentRow) => {
            currentRow.classList.remove(TableSelection.selectedCellClassName);
        }, (currentColumn) => {
            currentColumn.classList.remove(TableSelection.selectedCellClassName);
        });
    }

    private iterateOverSelectedCells(currentCellCb: (cell: HTMLElement) => void, currentRowCb: (row: HTMLElement) => void = null, currentColumnCb: (column: HTMLElement) => void = null) {
        if (!this.currentSelectionRange)
            return;

        // TODO: Introduce data attribute for table element
        const spreadsheetEl = document.querySelector(`.${Table.className}`);

        const startingColumn = spreadsheetEl.querySelector(`[data-column-number="${this.currentSelectionRange.col1}"]`) as HTMLElement;
        const startingRow = spreadsheetEl.querySelector(`[data-row-number="${this.currentSelectionRange.row1}"]`) as HTMLElement;
        const endColumn = spreadsheetEl.querySelector(`[data-column-number="${this.currentSelectionRange.col2}"]`) as HTMLElement;
        const endRow = spreadsheetEl.querySelector(`[data-row-number="${this.currentSelectionRange.row2}"]`) as HTMLElement;

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
                // TODO: super costly operation, consider accessing cells by indices
                const currentCell = spreadsheetEl.querySelector(`[data-cell-column-number="${currentColumnNumber}"][data-cell-row-number="${currentRowNumber}"]`) as HTMLElement;
                currentCellCb(currentCell);

                currentColumn = currentColumn.nextElementSibling as HTMLElement;
            }
            currentRow = currentRow.nextElementSibling as HTMLElement;
        }
    }
}

export type SelectionRange = {row1: number, col2: number, row2: number, col1: number};
