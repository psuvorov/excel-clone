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

        this.tableSelection = new TableSelection();
    }

    /**
     * 
     */
    init() {
        super.init();
        
        const $cell = $(this.$root.find("[data-cell-column-number='1'][data-cell-row-number='1']"));
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
        
        if (target.dataset.resize) {
            const $resizer = $(event.target);
            const $parent = $resizer.closest('[data-resizable="true"]');
            const resizerType = $resizer.data.resize;
            
            if (resizerType === "col")
                this.resizeColumn($parent, $resizer);
            else
                this.resizeRow($parent, $resizer);
        }

        if (target.classList.contains("cell")) {
            const firstCell = this.tableSelection.currentSelectedCell;

            if (event.shiftKey && firstCell) {
                const secondCell = $(target);
                this.tableSelection.selectCells(firstCell, secondCell);
            } else {
                this.tableSelection.selectSingleCell($(target));
            }
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
