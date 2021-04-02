import {SpreadsheetComponent} from "@core/spreadsheetComponent";
import {createTable} from "@/components/table/table.template";
import {$} from "@core/domWrapper";
import {TableSelection} from "@/components/table/tableSelection";

/**
 * 
 */
export class Table extends SpreadsheetComponent {
    static className = "spreadsheet__table";

    /**
     * 
     * @param {DomWrapper} $root
     */
    constructor($root) {
        super($root, {
            listeners: ["mousedown", "mousemove", "mouseup"]
        });
    }

    /**
     * 
     */
    init() {
        super.init();
        
        const $cell = $(this.$root.find("[data-cell-column-number='1'][data-cell-row-number='1']"));
        this.tableSelection = new TableSelection();
        
        this.tableSelection.selectSingleCell($cell);
    }

    /**
     *
     * @return {string}
     */
    toHtml() {
        return createTable();
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
        } 
        
        // Cell(s) selection
        if (target.classList.contains("cell")) {
            const firstCell = this.tableSelection.currentSelectedCell;

            if (event.shiftKey && firstCell) {
                const secondCell = $(target);
                this.tableSelection.selectCells(+firstCell.data.cellColumnNumber, +firstCell.data.cellRowNumber, 
                    +secondCell.data.cellColumnNumber, +secondCell.data.cellRowNumber);
            } else {
                this.tableSelection.selectSingleCell($(target));
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
        if (rowInfoEl) {
            const $row = $(rowInfoEl.closest(".row"));
            const $rowData = $row.find(".row-data");
            const firstCell = $($rowData.firstElementChild);
            const lastCell = $($rowData.lastElementChild);

            selectRowOrColumn(+firstCell.data.cellColumnNumber, +firstCell.data.cellRowNumber, 
                +lastCell.data.cellColumnNumber, +lastCell.data.cellRowNumber);
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
        
        const onMouseMoveEventHandler = e => {
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

        const onMouseMoveEventHandler = e => {
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
        }, {once: true});
    }

    /**
     * 
     * @param {MouseEvent} event
     */
    onMouseup(event) {
        
    }

    /**
     * @param {MouseEvent} event
     */
    onMousemove(event) {
        
    }
}
