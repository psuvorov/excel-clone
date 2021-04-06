import {SpreadsheetComponent} from "@core/spreadsheetComponent";
import {createTable} from "@/components/table/table.template";
import {$} from "@core/domWrapper";
import {TableSelection} from "@/components/table/tableSelection";
import {EventNames} from "@core/resources";

/**
 * 
 */
export class Table extends SpreadsheetComponent {
    static className = "spreadsheet__table";

    /**
     *
     * @param {DomWrapper} $root
     * @param {Observable} observable
     */
    constructor($root, observable) {
        super($root, observable, {
            name: "Table",
            listeners: ["mousedown", "mousemove", "mouseup", "keydown", "input"]
        });
    }

    /**
     * 
     */
    init() {
        super.init();
        
        const $cell = $(this.$root.find("[data-cell-column-number='1'][data-cell-row-number='1']"));
        this.tableSelection = new TableSelection(this.observable);
        
        this.tableSelection.selectSingleCell($cell);
        
        this.observable.subscribe(EventNames.formulaInput, inputText => {
            this.tableSelection.currentSelectedCell.textContent = inputText;
        });

        this.observable.subscribe(EventNames.selectNextCellAfterFormulaInput, () => {
            const nextCell = this.getNextCell("Enter");

            this.tableSelection.selectSingleCell(nextCell);
        });
    }

    /**
     * 
     */
    dispose() {
        super.dispose();
        
        this.observable.dispose(EventNames.formulaInput);
        this.observable.dispose(EventNames.selectNextCellAfterFormulaInput);
    }

    /**
     *
     * @return {string}
     */
    toHtml() {
        this.rowCount = 100;
        this.columnCount = 30;
        return createTable(this.rowCount, this.columnCount);
    }

    /**
     * 
     * @param {MouseEvent} event
     */
    onMousedown(event) {
        const target = event.target;
        
        // Resize columns and rows
        if (target.dataset.resize) {
            const $resizer = $(event.target);
            const $parent = $resizer.closest('[data-resizable="true"]');
            const resizerType = $resizer.data.resize;
            
            if (resizerType === "col")
                this.resizeColumn($parent, $resizer);
            else
                this.resizeRow($parent, $resizer);
            
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
                this.tableSelection.selectSingleCell(cell);
                this.tableSelection.initialMouseSelectedCell = cell;
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
        const rowInfoEl = target.closest(".row-info");
        if (rowInfoEl && rowInfoEl.childElementCount > 0) {
            const $row = $(rowInfoEl.closest(".row"));
            const $rowData = $row.find(".row-data");
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
    
    /**
     *
     * @param {DomWrapper} resizableElement
     * @param {DomWrapper} resizer
     */
    resizeColumn(resizableElement, resizer) {
        const resizableElementCoords = resizableElement.getCoords();
        const columnCellToResizeEls = this.$root.findAll(`[data-cell-column-number="${resizableElement.data.columnNumber}"]`);

        resizer.css({"height": "100%"});
        
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

            const delta = resizer.getCoords().right - resizableElementCoords.right;

            resizableElement.css({"width": (resizableElementCoords.width + delta) + "px"});

            columnCellToResizeEls.forEach(/** @param {HTMLElement} cellEl */ cellEl => {
                cellEl.style.width = (resizableElementCoords.width + delta) + "px";
            });

            Object.keys(hoveredColumns).forEach(k => hoveredColumns[k].style.removeProperty("pointer-events"));
        }, {once: true});
    }

    /**
     *
     * @param {DomWrapper} resizableElement
     * @param {DomWrapper} resizer
     */
    resizeRow(resizableElement, resizer) {
        const resizableElementCoords = resizableElement.getCoords();
        const rowCellToResizeEls = this.$root.findAll(`[data-cell-row-number="${resizableElement.data.rowNumber}"]`);

        resizer.css({"width": "100%"});
        
        const hoveredRows = {};

        const onMouseMoveEventHandler = e => {
            console.log(e.target.closest(".row"));
            const hoveredRow = $(e.target.closest(".row"));
            if (hoveredRow.$nativeElement) {
                const rowNumber = hoveredRow.data.rowNumber;
                const rowInfo = hoveredRow.find(".row-info");
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

            resizableElement.css({"height": (resizableElementCoords.height + delta) + "px"});

            rowCellToResizeEls.forEach(/** @param {HTMLElement} cellEl */ cellEl => {
                cellEl.style.height = (resizableElementCoords.height + delta) + "px";
            });
            
            Object.keys(hoveredRows).forEach(k => hoveredRows[k].style.removeProperty("pointer-events"));
        }, {once: true});
    }

    /**
     * 
     * @param {MouseEvent} event
     */
    onMouseup(event) {
        if (this.tableSelection.initialMouseSelectedCell)
            this.tableSelection.initialMouseSelectedCell = null;
    }

    /**
     * @param {MouseEvent} event
     */
    onMousemove(event) {
        if (this.tableSelection.initialMouseSelectedCell && event.target.classList.contains("cell")) {
            const hoveredCell = $(event.target);

            const initialCell = this.tableSelection.initialMouseSelectedCell;
            this.tableSelection.selectCells(+initialCell.data.cellColumnNumber, +initialCell.data.cellRowNumber,
                +hoveredCell.data.cellColumnNumber, +hoveredCell.data.cellRowNumber);
        }
    }

    /**
     * 
     * @param {KeyboardEvent} event
     */
    onKeydown(event) {
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
            this.tableSelection.selectSingleCell(nextCell);
        } else if (event.key === "Delete") {
            this.observable.notify(EventNames.emptySelectedCells);
        }
    }

    /**
     * @param {InputEvent} event
     */
    onInput(event) {
        const inputText = event.target.textContent.trim();
        
        this.observable.notify(EventNames.cellInput, inputText);
    }

    /**
     *
     * @param {string} key
     * @param {boolean} shiftPressed
     * @param {boolean} ctrlPressed
     * @return {DomWrapper}
     */
    getNextCell(key, shiftPressed= false, ctrlPressed= false) {
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
