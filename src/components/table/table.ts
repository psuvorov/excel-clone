import {SpreadsheetBaseComponent} from "../spreadsheetBaseComponent";
import {createTable} from "./table.template";
import {$, DomWrapper} from "../../core/domWrapper";
import {TableSelection} from "./tableSelection";
import {EventNames} from "../../core/resources";
import * as actions from "../../redux/actions";
import {Formula} from "../formula/formula";
import {changeCellContent} from "../../redux/actions";

/**
 * 
 */
export class Table extends SpreadsheetBaseComponent {
    public static readonly componentName = "table";
    public static readonly className = `spreadsheet__${Table.componentName}`;
    
    public static readonly stateProperties = {
        columnWidths: 'columnWidths',
        rowHeights: 'rowHeights',
        cellContents: 'cellContents',
    };
    
    private tableSelection: TableSelection;
    private rowCount: number;
    private columnCount: number;

    constructor($root: DomWrapper, options: any) {
        // options.subscribedTo = [Formula.stateProperties.formulaBarText];
        options.listeners = ["mousedown", "mousemove", "mouseup", "keydown", "input"];
        super($root, options);
        this.store = options.store;
    }

    public init(): void {
        super.init();
        
        this.tableSelection = new TableSelection(this.store, this.observable);
        
        this.tableSelection.selectCells(1, 1, 1, 1);
        this.tableSelection.initialMouseSelectedCell = null;
        
        this.observable.subscribe(EventNames.formulaInput, inputText => {
            this.tableSelection.currentSelectedCell.textContent = inputText;
            
            const cellColumnNumber = +this.tableSelection.currentSelectedCell.data.cellColumnNumber;
            const cellRowNumber = +this.tableSelection.currentSelectedCell.data.cellRowNumber;
            this.options.store.dispatch(changeCellContent(cellColumnNumber, cellRowNumber, inputText));
        });

        this.observable.subscribe(EventNames.selectNextCellAfterFormulaInput, () => {
            const nextCell = this.getNextCell("Enter");

            this.tableSelection.selectCells(+nextCell.data.cellColumnNumber, +nextCell.data.cellRowNumber, +nextCell.data.cellColumnNumber, +nextCell.data.cellRowNumber);
        });
        
        let lastScrollLeft = 0;
        let lastScrollTop = 0;
        this.$root.find(".table-wrapper").addEventListener("scroll", (event) => {
            // TODO: Needs to rework this fragment
            const columnRowInfo = event.target.closest(".table-body").querySelector(".column-row-info");
            const rowColumnInfo = this.$root.find(".table-header .row-data");
            
            const tableWrapperScrollLeft = event.target.scrollLeft;
            const tableWrapperScrollTop = event.target.scrollTop;
            if (lastScrollLeft !== tableWrapperScrollLeft) {
                rowColumnInfo.style.marginLeft = (40 - tableWrapperScrollLeft) + "px";
                lastScrollLeft = tableWrapperScrollLeft;
            }
            if (lastScrollTop !== tableWrapperScrollTop) {
                columnRowInfo.style.marginTop = -tableWrapperScrollTop + "px";
                lastScrollTop = tableWrapperScrollTop;
            }
        });
    }

    
    public loadState(): void {
        const appState = this.store.getState();
        
        const tableState = appState[Table.componentName];
        this.restoreColumnWidths(tableState);
        this.restoreRowHeights(tableState);
        this.restoreTableContent(tableState);
    }
    
    public dispose(): void {
        super.dispose();
        
        this.observable.dispose(EventNames.formulaInput);
        this.observable.dispose(EventNames.selectNextCellAfterFormulaInput);
    }

    public toHtml(): string {
        // TODO: make it configurable
        this.rowCount = 100;
        this.columnCount = 30;
        
        return createTable(this.rowCount, this.columnCount);
    }

    private onMousedown(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        
        // Resize columns and rows
        if (target.dataset.resize) {
            const $resizer = $(target);
            const resizerType = $resizer.data.resize;
            
            if (resizerType === "col") {
                const $column = $resizer.closest('[data-resizable="true"]');
                this.resizeColumn($column, $resizer);
            } else {
                const rowNumber = $resizer.closest(".row-info").data.rowNumber;
                const $row = $($resizer.closest(".table-body").find(`.table-wrapper .row[data-row-number="${rowNumber}"]`));
                this.resizeRow($row, $resizer);
            }
            return;
        } 
        
        // Cell(s) selection
        if (target.classList.contains("cell")) {
            const firstCell = this.tableSelection.currentSelectedCell;

            if (event.shiftKey && firstCell) {
                const secondCell = $(target);
                this.tableSelection.selectCells(+firstCell.data.cellColumnNumber, +firstCell.data.cellRowNumber, 
                    +secondCell.data.cellColumnNumber, +secondCell.data.cellRowNumber);
            } else {
                const cell = $(target);

                this.tableSelection.selectCells(+cell.data.cellColumnNumber, +cell.data.cellRowNumber,
                    +cell.data.cellColumnNumber, +cell.data.cellRowNumber);
            }
        }

        /**
         *
         * @param {number} firstCellColumnNumber
         * @param {number} firstCellRowNumber
         * @param {number} secondCellColumnNumber
         * @param {number} secondCellRowNumber
         */
        const selectRowOrColumn = (firstCellColumnNumber, firstCellRowNumber, secondCellColumnNumber, secondCellRowNumber) => {
            let selectionType;
            let selectableColumn;
            let selectableRow;
            if (firstCellColumnNumber === secondCellColumnNumber) {
                selectionType = "column";
                selectableColumn = firstCellColumnNumber;
            } else {
                selectionType = "row";
                selectableRow = firstCellRowNumber;
            }
            
            // Unset Selected Pivot in case changed selection type
            if (this.tableSelection.selectedPivot && this.tableSelection.selectedPivot.type !== selectionType)
                this.tableSelection.selectedPivot = null;

            if (event.shiftKey && this.tableSelection.selectedPivot) {
                if (selectionType === "column") {
                    firstCellColumnNumber = this.tableSelection.selectedPivot.number;
                } else {
                    firstCellRowNumber = this.tableSelection.selectedPivot.number;
                }
            } else {
                // If it's just a regular click, set Selected Pivot 
                this.tableSelection.selectedPivot = {type: selectionType, number: selectionType === "column" ? selectableColumn : selectableRow};
            }

            this.tableSelection.clearSelection();
            this.tableSelection.selectCells(firstCellColumnNumber, firstCellRowNumber, secondCellColumnNumber, secondCellRowNumber);
        }; 
        
        // Select whole row(s)
        const rowInfoEl = target.closest(".row-info") as HTMLElement;
        if (rowInfoEl && rowInfoEl.childElementCount > 0) {
            const $row = $(rowInfoEl.closest(".table-body")).find(`.table-wrapper .row[data-row-number="${rowInfoEl.dataset.rowNumber}"]`);
            const $rowData = $row.querySelector(".row-data");
            const firstCell = $($rowData.firstElementChild);
            const lastCell = $($rowData.lastElementChild);

            selectRowOrColumn(+firstCell.data.cellColumnNumber, +firstCell.data.cellRowNumber, 
                +lastCell.data.cellColumnNumber, +lastCell.data.cellRowNumber);
        } else if (rowInfoEl && rowInfoEl.childElementCount === 0) {
            selectRowOrColumn(1, 1,
                this.columnCount, this.rowCount);
        }
        
        // Select whole column(s)
        const columnEl = target.closest(".column");
        if (columnEl) {
            const columnNumber = $(columnEl).data.columnNumber;
            const cells = this.$root.findAll(`.cell[data-cell-column-number="${columnNumber}"]`);

            const firstCell = $(cells[0]);
            const lastCell = $(cells[cells.length - 1]);

            selectRowOrColumn(+firstCell.data.cellColumnNumber, +firstCell.data.cellRowNumber,
                +lastCell.data.cellColumnNumber, +lastCell.data.cellRowNumber);
        }
    }
    
    // TODO: try to name it more meaningfully
    private resizeColumn(columnElement: DomWrapper, resizer: DomWrapper): void {
        const columnElementCoords = columnElement.getCoords();
        const columnCellToResizeEls = this.$root.findAll(`[data-cell-column-number="${columnElement.data.columnNumber}"]`);

        resizer.css({"height": "100vh"});
        
        const hoveredColumns = {};
        
        const onMouseMoveEventHandler = e => {
            if (e.target.classList.contains("column")) {
                hoveredColumns[$(e.target).data.columnNumber] = e.target;
                e.target.style.pointerEvents = "none";
            }
            
            const delta = e.pageX - resizer.getCoords().right;
            resizer.css({
                "left": (parseInt(window.getComputedStyle(resizer.$nativeElement).left) + delta) + "px",
                "opacity": 1
            });
        };

        document.addEventListener("mousemove", onMouseMoveEventHandler);
        document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", onMouseMoveEventHandler);
            resizer.css({
                "height": "",
                "opacity": ""
            });

            const delta = resizer.getCoords().right - columnElementCoords.right;
            
            const newWidth = columnElementCoords.width + delta;
            
            this.setColumnWidth(columnElement, columnCellToResizeEls, newWidth);
            
            Object.keys(hoveredColumns).forEach(k => hoveredColumns[k].style.removeProperty("pointer-events"));
        }, {once: true});
    }

    private setColumnWidth(columnElement: DomWrapper, columnCellToResizeEls: NodeListOf<HTMLElement>, width: number): void {
        columnElement.css({"width": width + "px"});

        columnCellToResizeEls.forEach(cellEl => {
            cellEl.style.width = width + "px";
        });

        this.store.dispatch(actions.columnResize(+columnElement.data.columnNumber, width));
    }

    // TODO: try to name it more meaningfully
    // TODO: consider merging these two similar methods
    private resizeRow(rowElement: DomWrapper, resizer: DomWrapper): void {
        const resizableElementCoords = rowElement.getCoords();

        resizer.css({"width": "100%"});
        
        const hoveredRows = {};

        const onMouseMoveEventHandler = e => {
            const rowInfo = e.target.closest(".row-info");
            if (rowInfo) {
                const rowNumber = $(rowInfo).data.rowNumber;
                hoveredRows[rowNumber] = rowInfo;
                rowInfo.style.pointerEvents = "none";
            }
            
            const delta = e.pageY - resizer.getCoords().bottom;
            resizer.css({
                "top": (parseInt(window.getComputedStyle(resizer.$nativeElement).top) + delta) + "px",
                "opacity": 1
            });
        };

        document.addEventListener("mousemove", onMouseMoveEventHandler);
        document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", onMouseMoveEventHandler);
            
            resizer.css({
                "width": "",
                "opacity": ""
            });

            const delta = resizer.getCoords().bottom - resizableElementCoords.bottom;
            const newHeight = resizableElementCoords.height + delta;

            this.setRowHeight(rowElement, newHeight);

            Object.keys(hoveredRows).forEach(k => hoveredRows[k].style.removeProperty("pointer-events"));
        }, {once: true});
    }

    private setRowHeight(rowElement: DomWrapper, height: number): void {
        const rowNumber = rowElement.data.rowNumber;
        rowElement.css({"height": height + "px"});
        const rowInfo = $(rowElement.closest(".table-body").find(`.column-row-info .row-info[data-row-number="${rowNumber}"]`));
        rowInfo.css({"height": height + "px"});

        this.store.dispatch(actions.rowResize(+rowElement.data.rowNumber, height));
    }

    private onMouseup(event: MouseEvent): void {
        if (this.tableSelection.initialMouseSelectedCell)
            this.tableSelection.initialMouseSelectedCell = null;
    }

    private onMousemove(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (this.tableSelection.initialMouseSelectedCell && target.classList.contains("cell")) {
            const hoveredCell = $(target);

            const initialCell = this.tableSelection.initialMouseSelectedCell;
            
            // TODO: optimize this block
            this.tableSelection.selectCells(+initialCell.data.cellColumnNumber, +initialCell.data.cellRowNumber,
                +hoveredCell.data.cellColumnNumber, +hoveredCell.data.cellRowNumber);
        }
    }

    private onKeydown(event: KeyboardEvent): void {
        const allowedKeys = [
            "Enter",
            "Tab",
            "ArrowUp",
            "ArrowRight",
            "ArrowDown",
            "ArrowLeft",
            "Home"
        ];
        
        if (allowedKeys.includes(event.key)) {
            event.preventDefault();

            const nextCell = this.getNextCell(event.key, event.shiftKey, event.ctrlKey);
            this.tableSelection.selectCells(+nextCell.data.cellColumnNumber, +nextCell.data.cellRowNumber, +nextCell.data.cellColumnNumber, +nextCell.data.cellRowNumber);
        } else if (event.key === "Delete") {
            this.observable.notify(EventNames.clearSelectedCells);
        }
    }

    private onInput(event: InputEvent): void {
        const inputText = (event.target as HTMLElement).textContent.trim();

        const selectedCell = this.tableSelection.currentSelectedCell;
        const selectedCellColumnNumber = +selectedCell.data.cellColumnNumber;
        const selectedCellRowNumber = +selectedCell.data.cellRowNumber;
        
        this.store.dispatch(actions.changeCellContent(selectedCellColumnNumber, selectedCellRowNumber, inputText));
        
        this.observable.notify(EventNames.cellInput, inputText);
    }

    private setCellValue(columnNumber: number, rowNumber: number, value: string): void {
        const r = $(this.$root.find(`[data-cell-column-number="${columnNumber}"][data-cell-row-number="${rowNumber}"]`));
        if (r)
            r.textContent = value;
    }

    private restoreColumnWidths(tableState: any): void {
        Object.keys(tableState.columnWidths).forEach(columnNumber => {
            const columnElement = $(this.$root.find(`.table-header [data-column-number="${columnNumber}"]`));
            const columnCellToResizeEls = this.$root.findAll(`[data-cell-column-number="${columnElement.data.columnNumber}"]`);
            const columnWidth = tableState.columnWidths[columnNumber];

            this.setColumnWidth(columnElement, columnCellToResizeEls, columnWidth);
        });
    }

    private restoreRowHeights(tableState: any): void {
        Object.keys(tableState.rowHeights).forEach(rowNumber => {
            const rowElement = $(this.$root.find(`.table-wrapper .row[data-row-number="${rowNumber}"]`));
            const rowHeight = tableState.rowHeights[rowNumber];
            this.setRowHeight(rowElement, rowHeight);
        });
    }

    private restoreTableContent(tableState: any): void {
        Object.keys(tableState.cellContents).forEach(columnNumber => {
            Object.keys(tableState.cellContents[columnNumber]).forEach(rowNumber => {
                const cellValue = tableState.cellContents[columnNumber][rowNumber];
                if (cellValue)
                    this.setCellValue(+columnNumber, +rowNumber, cellValue);
            });
        });
    }

    private getNextCell(key: string, shiftPressed: boolean = false, ctrlPressed: boolean = false): DomWrapper {
        const selectedCell = this.tableSelection.currentSelectedCell;
        const selectedCellColumnNumber = +selectedCell.data.cellColumnNumber;
        const selectedCellRowNumber = +selectedCell.data.cellRowNumber;

        let nextCellCoords = [selectedCellColumnNumber, selectedCellRowNumber];
        if (key === "Enter") {
            if (shiftPressed) {
                nextCellCoords = [selectedCellColumnNumber, selectedCellRowNumber - 1];
            } else {
                nextCellCoords = [selectedCellColumnNumber, selectedCellRowNumber + 1];
            }
        } else if (key === "Tab") {
            if (shiftPressed) {
                nextCellCoords = [selectedCellColumnNumber - 1, selectedCellRowNumber];
            } else {
                nextCellCoords = [selectedCellColumnNumber + 1, selectedCellRowNumber];
            }
        } else if (key === "ArrowUp") {
            nextCellCoords = [selectedCellColumnNumber, selectedCellRowNumber - 1];
        } else if (key === "ArrowRight") {
            nextCellCoords = [selectedCellColumnNumber + 1, selectedCellRowNumber];
        } else if (key === "ArrowDown") {
            nextCellCoords = [selectedCellColumnNumber, selectedCellRowNumber + 1];
        } else if (key === "ArrowLeft") {
            nextCellCoords = [selectedCellColumnNumber - 1, selectedCellRowNumber];
        } else if (key === "Home") {
            if (ctrlPressed) {
                nextCellCoords = [1, 1];
            } else {
                nextCellCoords = [1, selectedCellRowNumber];
            }
        }

        return $(this.$root.find(`[data-cell-column-number="${nextCellCoords[0]}"][data-cell-row-number="${nextCellCoords[1]}"]`));
    }
}
