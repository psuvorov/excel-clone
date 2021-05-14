import {$, DomWrapper} from "../../core/domWrapper";
import {EventNames} from "../../core/resources";
import {SelectedCells, Table} from "./table";
import {changeCellContent} from "../../redux/actions";
import {Observable} from "../../core/observable";
import {Store} from "redux";
import {ApplicationState} from "../../core/applicationState";

/**
 * TODO: add comments 
 */
export class TableSelection {
    private static readonly selectedCellClassName = "selected";
    
    private static readonly topLeftCorner = "top-left-corner";
    private static readonly topRightCorner = "top-right-corner";
    private static readonly bottomLeftCorner = "bottom-left-corner";
    private static readonly bottomRightCorner = "bottom-right-corner";
    private static readonly topBorder = "top-border";
    private static readonly rightBorder = "right-border";
    private static readonly bottomBorder = "bottom-border";
    private static readonly leftBorder = "left-border";
    

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
    
    public getSelectedCells(): SelectedCells {
        let res = {} as SelectedCells;

        for (let i = Math.min(this.currentSelectionRange.col1, this.currentSelectionRange.col2); i <= Math.max(this.currentSelectionRange.col1, this.currentSelectionRange.col2); i++) {
            res[i] = {};
        }
        
        let state = this.store.getState() as ApplicationState;
        this.iterateOverSelectedCells((cell: HTMLElement) => {
            const col = +cell.dataset.cellColumnNumber;
            const row = +cell.dataset.cellRowNumber;
            
            res[col][row] = state.table.cellContents[col][row];
        });
        
        return res;
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
            $(cell).addClass(...cssClasses);
        });
    }
    
    public removeCssClassFromSelectedCells(...cssClasses: string[]): void {
        this.iterateOverSelectedCells((cell: HTMLElement) => {
            $(cell).removeClass(...cssClasses);
        });
    }
    
    private highlightSelectedCells(): void {
        // Select a new group of cells
        this.iterateOverSelectedCells((currentCell) => {
            currentCell.classList.add(TableSelection.selectedCellClassName);
            
            const currCol = +currentCell.dataset.cellColumnNumber;
            const currRow = +currentCell.dataset.cellRowNumber;
            
            if (this.currentSelectionRange.row1 === currRow) {
                if (this.currentSelectionRange.col1 === currCol) {
                    // Top Left corner
                    currentCell.classList.add(TableSelection.topLeftCorner);
                } else if (this.currentSelectionRange.col2 === currCol) {
                    // Top Right corner
                    currentCell.classList.add(TableSelection.topRightCorner);
                } else {
                    // Top border
                    currentCell.classList.add(TableSelection.topBorder);
                }
            }  if (this.currentSelectionRange.row2 === currRow) {
                if (this.currentSelectionRange.col1 === currCol) {
                    // Bottom Left corner
                    currentCell.classList.add(TableSelection.bottomLeftCorner);
                } else if (this.currentSelectionRange.col2 === currCol) {
                    // Bottom Right corner
                    currentCell.classList.add(TableSelection.bottomRightCorner);
                } else {
                    // Bottom border
                    currentCell.classList.add(TableSelection.bottomBorder);
                }
            }  if (this.currentSelectionRange.col1 === currCol) {
                // Left border
                currentCell.classList.add(TableSelection.leftBorder);
            }  if (this.currentSelectionRange.col2 === currCol) {
                // Right border
                currentCell.classList.add(TableSelection.rightBorder);
            }
            
        }, (currentRow) => {
            if (this.currentSelectionRange.col1 !== 1)
                currentRow.classList.add(TableSelection.selectedCellClassName);
        }, (currentColumn) => {
            if (this.currentSelectionRange.row1 !== 1)
                currentColumn.classList.add(TableSelection.selectedCellClassName);
        });
    }

    private deselectPreviousSelection(): void {
        this.iterateOverSelectedCells((currentCell) => {
            currentCell.classList.remove(
                TableSelection.selectedCellClassName,
                TableSelection.topLeftCorner,
                TableSelection.topRightCorner,
                TableSelection.bottomLeftCorner,
                TableSelection.bottomRightCorner,
                TableSelection.topBorder,
                TableSelection.rightBorder,
                TableSelection.bottomBorder,
                TableSelection.leftBorder
            );
            
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
