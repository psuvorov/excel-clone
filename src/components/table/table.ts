import {SpreadsheetBaseComponent} from "../spreadsheetBaseComponent";
import {createTable} from "./table.template";
import {$, DomWrapper} from "../../core/domWrapper";
import {SelectionRange, TableSelection} from "./tableSelection";
import {EventNames} from "../../core/resources";
import * as actions from "../../redux/actions";
import {changeCellContent, changeCellStyle} from "../../redux/actions";
import {
    ApplicationState,
    CellContentHorizontalAlignment,
    CellContentVerticalAlignment,
    TableCell,
    TableCellStyle
} from "../../core/applicationState";
import {
    getClassNameForHorizontalAlignment,
    getClassNameForVerticalAlignment, isInit
} from "../../core/utils";

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
        
        this.initFirstCellSelection();
        this.initTableSubscriptions();
        this.initTableScroll();
    }
    
    public loadState(): void {
        const appState: ApplicationState = this.store.getState();
        
        const tableState = appState[Table.componentName];
        this.restoreColumnWidths(tableState);
        this.restoreRowHeights(tableState);
        this.restoreTableContent(tableState);
    }
    
    public dispose(): void {
        super.dispose();
        
        this.observable.dispose(EventNames.FormulaInput);
        this.observable.dispose(EventNames.NextCellSelectionRequested);
    }

    public toHtml(): string {
        // TODO: make it configurable
        this.rowCount = 100;
        this.columnCount = 30;
        
        return createTable(this.rowCount, this.columnCount);
    }

    private initFirstCellSelection(): void {
        this.tableSelection.selectCells({
            col1: 1,
            row1: 1,
            col2: 1,
            row2: 1
        });
        this.tableSelection.initialMouseSelectedCell = null;
    }

    private initTableSubscriptions(): void {
        this.observable.subscribe(EventNames.FormulaInput, inputText => {
            this.tableSelection.currentSelectedCell.textContent = inputText;

            const cellColumnNumber = +this.tableSelection.currentSelectedCell.data.cellColumnNumber;
            const cellRowNumber = +this.tableSelection.currentSelectedCell.data.cellRowNumber;
            this.options.store.dispatch(changeCellContent(cellColumnNumber, cellRowNumber, inputText));
        });

        this.observable.subscribe(EventNames.NextCellSelectionRequested, () => {
            const nextCell = this.getNextCell("Enter");

            this.tableSelection.selectCells({
                col1: +nextCell.data.cellColumnNumber,
                row1: +nextCell.data.cellRowNumber,
                col2: +nextCell.data.cellColumnNumber,
                row2: +nextCell.data.cellRowNumber
            });
        });
        
        this.observable.subscribe(EventNames.CutCellsRequested, () => {
            // Get selected range
            let selectionRange = this.tableSelection.getSelectionRange();
            
            // Remove selected cells from UI
            
            // Do not touch app state
            
            // TODO: consider moving copy-paste stuff to the separate class
            
            
        });
        this.observable.subscribe(EventNames.CopyCellsRequested, () => {
            // Get selected range
            let selectionRange = this.tableSelection.getSelectionRange();
            
            
            
        });
        this.observable.subscribe(EventNames.PasteCellsRequested, () => {
            // Get TableCell data
            let selectedCells = this.tableSelection.getSelectedCells();
            
            
            
            
        });
        this.observable.subscribe(EventNames.FormatBoldButtonClicked, () => {
            let selectionRange = this.tableSelection.getSelectionRange();
            if (selectionRange.col1 !== selectionRange.col2 && selectionRange.row1 !== selectionRange.row2) {
                return;
            }

            const appState: ApplicationState = this.store.getState();
            let tableCell = appState.table.cellContents[selectionRange.col1][selectionRange.row1];
            
            if (isInit(tableCell) && isInit(tableCell.tableCellStyle) && isInit(tableCell.tableCellStyle.bold) && tableCell.tableCellStyle.bold === true) {
                this.tableSelection.removeCssClassFromSelectedCells("bold");
                this.setCellStyle({bold: false});
            } else {
                this.tableSelection.applyCssClassToSelectedCells("bold");
                this.setCellStyle({bold: true});
            }
        });
        this.observable.subscribe(EventNames.FormatItalicButtonClicked, () => {
            let selectionRange = this.tableSelection.getSelectionRange();
            if (selectionRange.col1 !== selectionRange.col2 && selectionRange.row1 !== selectionRange.row2) {
                return;
            }

            const appState: ApplicationState = this.store.getState();
            let tableCell = appState.table.cellContents[selectionRange.col1][selectionRange.row1];

            if (isInit(tableCell) && isInit(tableCell.tableCellStyle) && isInit(tableCell.tableCellStyle.italic) && tableCell.tableCellStyle.italic === true) {
                this.tableSelection.removeCssClassFromSelectedCells("italic");
                this.setCellStyle({italic: false});
            } else {
                this.tableSelection.applyCssClassToSelectedCells("italic");
                this.setCellStyle({italic: true});
            }
        });
        this.observable.subscribe(EventNames.FormatUnderlinedButtonClicked, () => {
            let selectionRange = this.tableSelection.getSelectionRange();
            if (selectionRange.col1 !== selectionRange.col2 && selectionRange.row1 !== selectionRange.row2) {
                return;
            }

            const appState: ApplicationState = this.store.getState();
            let tableCell = appState.table.cellContents[selectionRange.col1][selectionRange.row1];

            if (isInit(tableCell) && isInit(tableCell.tableCellStyle) && isInit(tableCell.tableCellStyle.underlined) && tableCell.tableCellStyle.underlined === true) {
                this.tableSelection.removeCssClassFromSelectedCells("underlined");
                this.setCellStyle({underlined: false});
            } else {
                this.tableSelection.applyCssClassToSelectedCells("underlined");
                this.setCellStyle({underlined: true});
            }
        });
        this.observable.subscribe(EventNames.AlignVerticalTopButtonClicked, () => {
            this.tableSelection.removeCssClassFromSelectedCells("align-vertical-center", "align-vertical-bottom");
            
            this.tableSelection.applyCssClassToSelectedCells("align-vertical-top");
            this.setCellStyle({verticalAlignment: CellContentVerticalAlignment.Top});
            
        });
        this.observable.subscribe(EventNames.AlignVerticalCenterButtonClicked, () => {
            this.tableSelection.removeCssClassFromSelectedCells("align-vertical-top", "align-vertical-bottom");
            
            this.tableSelection.applyCssClassToSelectedCells("align-vertical-center");
            this.setCellStyle({verticalAlignment: CellContentVerticalAlignment.Center});
        });
        this.observable.subscribe(EventNames.AlignVerticalBottomButtonClicked, () => {
            this.tableSelection.removeCssClassFromSelectedCells("align-vertical-top", "align-vertical-center");
            
            this.tableSelection.applyCssClassToSelectedCells("align-vertical-bottom");
            this.setCellStyle({verticalAlignment: CellContentVerticalAlignment.Bottom});
        });
        this.observable.subscribe(EventNames.FormatAlignLeftButtonClicked, () => {
            this.tableSelection.removeCssClassFromSelectedCells("format-align-center", "format-align-right");
            
            this.tableSelection.applyCssClassToSelectedCells("format-align-left");
            this.setCellStyle({horizontalAlignment: CellContentHorizontalAlignment.Left});
        });
        this.observable.subscribe(EventNames.FormatAlignCenterButtonClicked, () => {
            this.tableSelection.removeCssClassFromSelectedCells("format-align-left", "format-align-right");
            
            this.tableSelection.applyCssClassToSelectedCells("format-align-center");
            this.setCellStyle({horizontalAlignment: CellContentHorizontalAlignment.Center});
        });
        this.observable.subscribe(EventNames.FormatAlignRightButtonClicked, () => {
            this.tableSelection.removeCssClassFromSelectedCells("format-align-left", "format-align-center");
            
            this.tableSelection.applyCssClassToSelectedCells("format-align-right");
            this.setCellStyle({horizontalAlignment: CellContentHorizontalAlignment.Right});
        });
    }
    
    private setCellStyle(cellStyle: TableCellStyle): void {
        const selectionRange = this.tableSelection.getSelectionRange();
        for (let i = selectionRange.col1; i <= selectionRange.col2; i++) {
            for (let j = selectionRange.row1; j <= selectionRange.row2; j++) {
                this.options.store.dispatch(changeCellStyle(i, j, cellStyle));
            }
        }
    }

    // TODO: Implement horizontal scroll with Shift
    private initTableScroll(): void {
        let lastScrollLeft = 0;
        let lastScrollTop = 0;
        this.$root.find(".table-wrapper").addEventListener("scroll", (event) => {
            // TODO: Needs to rework this fragment
            
            const target = event.target as HTMLElement;
            const columnRowInfo = target.closest(".table-body").querySelector(".column-row-info") as HTMLElement;
            const rowColumnInfo = this.$root.find(".table-header .row-data");

            const tableWrapperScrollLeft = target.scrollLeft;
            const tableWrapperScrollTop = target.scrollTop;
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

    private onMousedown(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        
        // Resize columns and rows
        this.performColumnOrRowResizing(target);
        
        // Cell(s) selection
        this.performCellSelection(target, event.shiftKey);
        
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
            this.tableSelection.selectCells({
                col1: firstCellColumnNumber, 
                row1: firstCellRowNumber, 
                col2: secondCellColumnNumber, 
                row2: secondCellRowNumber
            });
        }; 
        
        // Select whole row(s)
        this.performWholeRowsSelection(target.closest(".row-info"), selectRowOrColumn);
        
        // Select whole column(s)
        this.performWholeColumnsSelection(target.closest(".column"), selectRowOrColumn);
    }
    
    private performColumnOrRowResizing(resizer: HTMLElement): void {
        if (resizer.dataset.resize) {
            const $resizer = $(resizer);
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
    }
    
    private performCellSelection(cellElem: HTMLElement, shiftKey: boolean): void {
        if (cellElem.classList.contains("cell")) {
            const firstCell = this.tableSelection.currentSelectedCell;

            if (shiftKey && firstCell) {
                const secondCell = $(cellElem);
                this.tableSelection.selectCells({
                    col1: +firstCell.data.cellColumnNumber,
                    row1: +firstCell.data.cellRowNumber,
                    col2: +secondCell.data.cellColumnNumber,
                    row2: +secondCell.data.cellRowNumber
                });
            } else {
                const cell = $(cellElem);

                this.tableSelection.selectCells({
                    col1: +cell.data.cellColumnNumber,
                    row1: +cell.data.cellRowNumber,
                    col2: +cell.data.cellColumnNumber,
                    row2: +cell.data.cellRowNumber
                });
            }
        }
    }
    
    private performWholeRowsSelection(rowInfoEl, selectRowOrColumn: Function): void {
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
    }
    
    private performWholeColumnsSelection(columnEl, selectRowOrColumn: Function): void {
        if (!isInit(columnEl))
            return;

        const columnNumber = $(columnEl).data.columnNumber;
        const cells = this.$root.findAll(`.cell[data-cell-column-number="${columnNumber}"]`);

        const firstCell = $(cells[0]);
        const lastCell = $(cells[cells.length - 1]);

        selectRowOrColumn(+firstCell.data.cellColumnNumber, +firstCell.data.cellRowNumber,
            +lastCell.data.cellColumnNumber, +lastCell.data.cellRowNumber);
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

            let selectionRange: SelectionRange = this.tableSelection.getSelectionRange();
            if (selectionRange.col1 === +initialCell.data.cellColumnNumber && selectionRange.row1 === +initialCell.data.cellRowNumber &&
                selectionRange.col2 === +hoveredCell.data.cellColumnNumber && selectionRange.row2 === +hoveredCell.data.cellRowNumber)
                return;
            
            this.tableSelection.selectCells({
                col1: +initialCell.data.cellColumnNumber, 
                row1: +initialCell.data.cellRowNumber,
                col2: +hoveredCell.data.cellColumnNumber, 
                row2: +hoveredCell.data.cellRowNumber
            });
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
            this.tableSelection.selectCells({
                col1: +nextCell.data.cellColumnNumber, 
                row1: +nextCell.data.cellRowNumber, 
                col2: +nextCell.data.cellColumnNumber, 
                row2: +nextCell.data.cellRowNumber
            });
            this.tableSelection.initialMouseSelectedCell = null;
        } else if (event.key === "Delete") {
            this.observable.notify(EventNames.CellsDeselectionRequested);
        }
    }

    private onInput(event: InputEvent): void {
        const inputText = (event.target as HTMLElement).textContent.trim();

        const selectedCell = this.tableSelection.currentSelectedCell;
        const selectedCellColumnNumber = +selectedCell.data.cellColumnNumber;
        const selectedCellRowNumber = +selectedCell.data.cellRowNumber;
        
        this.store.dispatch(actions.changeCellContent(selectedCellColumnNumber, selectedCellRowNumber, inputText));
        
        this.observable.notify(EventNames.CellInput, inputText);
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
                const tableCell: TableCell = tableState.cellContents[columnNumber][rowNumber];
                if (tableCell) {
                    const $tableCellElem = $(this.$root.find(`[data-cell-column-number="${columnNumber}"][data-cell-row-number="${rowNumber}"]`));
                    if ($tableCellElem) {
                        $tableCellElem.textContent = tableCell.value;
                        
                        if (!isInit(tableCell.tableCellStyle))
                            return;
                        
                        // TODO: rework reassigning cell format classes
                        if (tableCell.tableCellStyle.bold === true) {
                            $tableCellElem.addClass("bold");
                        }
                        if (tableCell.tableCellStyle.italic === true) {
                            $tableCellElem.addClass("italic");
                        }
                        if (tableCell.tableCellStyle.underlined === true) {
                            $tableCellElem.addClass("underlined");
                        }
                        if (isInit(tableCell.tableCellStyle.verticalAlignment)) {
                            $tableCellElem.removeClass("align-vertical-top", "align-vertical-center", "align-vertical-bottom");
                            $tableCellElem.addClass(getClassNameForVerticalAlignment(tableCell.tableCellStyle.verticalAlignment));
                        }
                        if (isInit(tableCell.tableCellStyle.horizontalAlignment)) {
                            $tableCellElem.removeClass("format-align-left", "format-align-center", "format-align-right");
                            $tableCellElem.addClass(getClassNameForHorizontalAlignment(tableCell.tableCellStyle.horizontalAlignment));
                        }
                    }
                }
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

export type SelectedCells = {
    [columnNumber: number]: {[rowNumber: number]: TableCell}
}


