import {SpreadsheetComponent} from "@core/spreadsheetComponent";
import {createTable} from "@/components/table/table.template";

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
     * @param {{}} event
     */
    onClick(event) {
        console.log("Table: onClick", event);
    }

    /**
     * 
     * @param {{}} event
     */
    onMousedown(event) {
        console.log("Table: onMousedown", event);
    }

    /**
     * 
     * @param {{}} event
     */
    onMouseup(event) {
        console.log("Table: onMouseup", event);
    }

    /**
     * @param {{}} event
     */
    onMousemove(event) {
        console.log("Table: onMousemove", event);
    }
}
