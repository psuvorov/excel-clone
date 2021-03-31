import {SpreadsheetComponent} from "@core/spreadsheetComponent";
import {createTable} from "@/components/table/table.template";
import {$} from "@core/domWrapper";

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
            listeners: ["click", "mousedown", "mousemove", "mouseup"]
        });
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
     * @param {Event} event
     */
    onClick(event) {
        
    }

    /**
     * 
     * @param {Event} event
     */
    onMousedown(event) {
        if (event.target.dataset.resize) {
            const $resizer = $(event.target);
            const $parent = $resizer.closest('[data-resizable="true"]');
            const resizerType = $resizer.data.resize;
            
            if (resizerType === "col")
                this.resizeColumn($parent, $resizer);
            else
                this.resizeRow($parent, $resizer);
        }
    }

    /**
     *
     * @param {DomWrapper} resizableElement
     * @param {DomWrapper} resizer
     */
    resizeColumn(resizableElement, resizer) {
        const coords = resizableElement.getCoords();
        const columnCellToResizeEls = this.$root.findAll(`[data-cell-header-name="${resizableElement.data.headerName}"]`);

        const onMouseMoveEventHandler = e => {
            const delta = e.pageX - coords.right;
            resizableElement.css({"width": (coords.width + delta) + "px"});

            columnCellToResizeEls.forEach(/** @param {HTMLElement} cellEl */ cellEl => {
                cellEl.style.width = (coords.width + delta) + "px";
            });
        };

        document.addEventListener("mousemove", onMouseMoveEventHandler);
        document.addEventListener("mouseup", () => document.removeEventListener("mousemove", onMouseMoveEventHandler));
    }

    /**
     *
     * @param {DomWrapper} resizableElement
     * @param {DomWrapper} resizer
     */
    resizeRow(resizableElement, resizer) {
        const coords = resizableElement.getCoords();
        const rowCellToResizeEls = this.$root.findAll(`[data-cell-row-number="${resizableElement.data.rowNumber}"]`);

        const onMouseMoveEventHandler = e => {
            const delta = e.pageY - coords.bottom;
            resizableElement.css({"height": (coords.height + delta) + "px"});

            rowCellToResizeEls.forEach(/** @param {HTMLElement} cellEl */ cellEl => {
                cellEl.style.height = (coords.height + delta) + "px";
            });
        };

        document.addEventListener("mousemove", onMouseMoveEventHandler);
        document.addEventListener("mouseup", () => document.removeEventListener("mousemove", onMouseMoveEventHandler));
    }

    /**
     * 
     * @param {Event} event
     */
    onMouseup(event) {
        if (event.target.dataset.resize) {
            console.log("End resizing ", event.target.dataset.resize);
        }
    }

    /**
     * @param {Event} event
     */
    onMousemove(event) {
        if (event.target.dataset.resize) {
            console.log("Start moving ", event.target.dataset.resize);
        }
    }
}
