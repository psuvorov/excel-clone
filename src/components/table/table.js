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
            const coords = $parent.getCoords();

            const columnCellToResizeEls = this.$root.findAll(`[data-cell-header-name="${$parent.data.headerName}"]`);
            
            const onMouseMoveEventHandler = e => {
                const delta = e.pageX - coords.right;
                $parent.$nativeElement.style.width = (coords.width + delta) + "px";
                
                columnCellToResizeEls.forEach(/** @param {HTMLElement} cellEl */ cellEl => {
                    cellEl.style.width = (coords.width + delta) + "px";
                });
            };

            document.addEventListener("mousemove", onMouseMoveEventHandler);
            document.addEventListener("mouseup", () => document.removeEventListener("mousemove", onMouseMoveEventHandler));
        }
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
